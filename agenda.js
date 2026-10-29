// Genera el catalogo "Agenda" (partidos del dia de Futbol Libre) SIN tocar los demas catalogos:
//   catalog/tv/cobalto-agenda.json, meta/tv/kitsu:cbl-ag-<id>.json y las tarjetas agenda/cards/*.png
// Corre solo (workflow agenda.yml, cada 30 min). build.js respeta estos archivos y solo agrega el catalogo al manifest.
// Las fuentes (streams) NO se guardan aqui: el plugin berilo.js vuelve a pedir la agenda desde el celular.
const fs = require('fs');
const path = require('path');

const OUT_DIR = __dirname;
const AGENDA_URL = process.env.AGENDA_FILE ? null : 'https://api.wqxag.com/diaries.json';
const IMG_URL = 'https://img.wqxag.com';
const PREFIX = 'kitsu:cbl-ag-';

// diary_hour viene en hora de Colombia/Peru (UTC-5): la pagina mostraba 11:45 para un diary_hour de 12:45 con hora de Mexico (UTC-6).
const FUENTE_UTC = -5;   // zona de diary_hour
const LOCAL_UTC = -6;    // zona del usuario (Ciudad de Mexico, sin horario de verano)
const MAX_PARTIDOS = 150;
// La pagina de Futbol Libre quita los partidos ya terminados: se ocultan pasadas DURACION_H horas del inicio
// (y los que ya empezaron y no tienen ninguna opcion de transmision).
const DURACION_H = 3;

const CANVAS_W = 800, CANVAS_H = 450;
const DARK_BG = 0x161616FF;

let Jimp = null;
const getJimp = () => (Jimp || (Jimp = require('jimp')));

const limpiar = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function parsear(item) {
  const a = item.attributes || {};
  const desc = limpiar(a.diary_description);
  const i = desc.indexOf(': ');
  const liga = i > 0 ? desc.slice(0, i).replace(/:$/, '') : ((a.country && a.country.data && a.country.data.attributes.name) || 'Fútbol');
  const partido = i > 0 ? desc.slice(i + 2) : desc;
  const [h, m] = String(a.diary_hour || '00:00').split(':').map(Number);
  const [Y, M, D] = String(a.date_diary || '').split('-').map(Number);
  if (!Y || !M || !D) return null;
  const inicioUtc = Date.UTC(Y, M - 1, D, h - FUENTE_UTC, m);
  const local = new Date(inicioUtc + LOCAL_UTC * 3600e3);
  const hora = String(local.getUTCHours()).padStart(2, '0') + ':' + String(local.getUTCMinutes()).padStart(2, '0');
  const dia = local.getUTCFullYear() + '-' + String(local.getUTCMonth() + 1).padStart(2, '0') + '-' + String(local.getUTCDate()).padStart(2, '0');
  const img = a.country && a.country.data && a.country.data.attributes.image && a.country.data.attributes.image.data;
  const imgUrl = img && img.attributes ? img.attributes.url : null;
  // sin Disney+ (mismo filtro en plu/providers/berilo.js)
  const todos = (a.embeds && a.embeds.data) || [];
  const embeds = todos.filter(e => {
    const q = String(e.attributes.embed_iframe || '').split('r=')[1] || '';
    let url = ''; try { url = Buffer.from(decodeURIComponent(q), 'base64').toString(); } catch (_) { /* sin decodificar */ }
    return !/disney/i.test((e.attributes.embed_name || '') + ' ' + url);
  });
  return {
    id: item.id, liga, partido, hora, dia, inicioUtc,
    imagen: imgUrl ? (/^https?:/.test(imgUrl) ? imgUrl : IMG_URL + imgUrl) : null,
    opciones: embeds.length, total: todos.length
  };
}

async function tarjeta(p, outPath) {
  const J = getJimp();
  const canvas = new J(CANVAS_W, CANVAS_H, DARK_BG);
  const f64 = await J.loadFont(J.FONT_SANS_64_WHITE);
  const f32 = await J.loadFont(p.partido.length > 28 ? J.FONT_SANS_32_WHITE : J.FONT_SANS_64_WHITE);
  const f16 = await J.loadFont(J.FONT_SANS_16_WHITE);
  let x0 = 40;
  if (p.imagen) {
    try {
      const flag = await J.read(p.imagen);
      flag.contain(96, 96);
      canvas.composite(flag, 40, 36);
      x0 = 160;
    } catch (e) { /* sin imagen de la liga */ }
  }
  canvas.print(f64, x0, 30, p.hora);
  canvas.print(f16, x0, 110, { text: p.liga, alignmentX: J.HORIZONTAL_ALIGN_LEFT }, CANVAS_W - x0 - 20);
  canvas.print(f32, 40, 170, { text: p.partido, alignmentX: J.HORIZONTAL_ALIGN_CENTER, alignmentY: J.VERTICAL_ALIGN_MIDDLE }, CANVAS_W - 80, CANVAS_H - 200);
  await canvas.writeAsync(outPath);
}

async function main() {
  let json;
  if (process.env.AGENDA_FILE) json = JSON.parse(fs.readFileSync(process.env.AGENDA_FILE, 'utf8'));
  else {
    const r = await fetch(AGENDA_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36', 'Accept': 'application/json' } });
    if (!r.ok) throw new Error(`la agenda respondio ${r.status}`);
    json = await r.json();
  }
  const ahora = process.env.AHORA_UTC ? Number(process.env.AHORA_UTC) : Date.now();
  const hoyLocal = new Date(ahora + LOCAL_UTC * 3600e3).toISOString().slice(0, 10);

  const partidos = (json.data || []).map(parsear).filter(Boolean)
    .filter(p => p.total === 0 || p.opciones > 0)                 // aun sin opciones: se queda (las agregan despues); solo Disney+: fuera
    .filter(p => p.dia >= hoyLocal)                               // hoy y proximos dias
    .filter(p => ahora < p.inicioUtc + DURACION_H * 3600e3)      // ya termino: fuera
    .filter(p => !(p.total === 0 && ahora > p.inicioUtc))        // ya empezo y sigue sin opciones: fuera
    .sort((a, b) => a.inicioUtc - b.inicioUtc || a.id - b.id)
    .slice(0, MAX_PARTIDOS);

  const repoSlug = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME || 'main';
  const RAW_BASE = repoSlug ? `https://raw.githubusercontent.com/${repoSlug}/${branch}` : 'https://raw.githubusercontent.com/USUARIO/REPO/main';

  const cardsDir = path.join(OUT_DIR, 'agenda', 'cards');
  const metaDir = path.join(OUT_DIR, 'meta', 'tv');
  fs.mkdirSync(cardsDir, { recursive: true });
  fs.mkdirSync(metaDir, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, 'catalog', 'tv'), { recursive: true });

  const metas = [];
  const cardsVivas = new Set(), metasVivas = new Set();
  for (const p of partidos) {
    const id = PREFIX + p.id;
    const cardName = `ag-${p.id}-${p.hora.replace(':', '')}.png`; // la hora va en el nombre: si cambia, se regenera
    const cardPath = path.join(cardsDir, cardName);
    cardsVivas.add(cardName);
    if (!fs.existsSync(cardPath) && !process.env.SKIP_IMAGES) {
      try { await tarjeta(p, cardPath); } catch (e) { console.warn(`  ! tarjeta de ${p.partido}: ${e.message}`); }
    }
    const poster = fs.existsSync(cardPath) ? `${RAW_BASE}/agenda/cards/${cardName}` : undefined;
    const dia = p.dia === hoyLocal ? '' : ` (${p.dia.slice(8)}/${p.dia.slice(5, 7)})`;
    const meta = {
      id, type: 'tv', name: `${p.hora} ${p.partido}${dia}`,
      poster, logo: poster, background: poster, posterShape: 'landscape',
      genres: [p.liga],
      description: `${p.liga} · ${p.hora} (hora de Ciudad de México)${dia}. ${p.opciones ? p.opciones + ' opciones de transmisión.' : 'Las opciones de transmisión se publican poco antes del partido.'}`
    };
    fs.writeFileSync(path.join(metaDir, `${id}.json`), JSON.stringify({ meta }, null, 2));
    metasVivas.add(`${id}.json`);
    metas.push({ id, type: 'tv', name: meta.name, poster, posterShape: 'landscape', genres: meta.genres });
  }
  // limpiar partidos viejos
  for (const f of fs.readdirSync(cardsDir)) if (!cardsVivas.has(f)) fs.rmSync(path.join(cardsDir, f));
  for (const f of fs.readdirSync(metaDir)) if (f.startsWith(PREFIX) && !metasVivas.has(f)) fs.rmSync(path.join(metaDir, f));

  fs.writeFileSync(path.join(OUT_DIR, 'catalog', 'tv', 'cobalto-agenda.json'), JSON.stringify({ metas }, null, 2));
  console.log(`Agenda lista: ${metas.length} partidos (hoy local: ${hoyLocal}).`);
}

main().catch(err => { console.error('Falló la agenda:', err); process.exit(1); });
