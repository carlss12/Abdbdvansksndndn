// Genera el catalogo "Lucha" (proximos eventos y shows semanales de lucha libre) SIN tocar los demas catalogos:
//   catalog/tv/cobalto-lucha.json, meta/tv/kitsu:cbl-lucha-ev-<clave>.json y las tarjetas agenda/lucha-cards/*.png
// Los datos se leen SOLOS de las tablas de luchaonline.com cada vez que corre (workflow agenda.yml, cada 30 min).
// Si la pagina no responde o no trae las tablas, se usan los archivos lucha-datos/*.json (respaldo; los saca el marcador).
// Las fuentes (streams) NO se guardan aqui: el plugin lucha.js responde a cualquier id que contenga "cbl-lucha".
const fs = require('fs');
const path = require('path');

const OUT_DIR = __dirname;
const DATOS_DIR = path.join(OUT_DIR, 'lucha-datos');
const PREFIX = 'kitsu:cbl-lucha-ev-';
// Paginas donde se buscan las tablas (cualquier tabla con FECHA+EVENTO o con HORA+SHOWS sirve). Para agregar otra, una linea mas.
const FUENTES_WEB = ['https://luchaonline.com/ver-horario/', 'https://luchaonline.com/'];
const LOCAL_UTC = -6;          // hora de los horarios y del usuario (Ciudad de Mexico, sin horario de verano)
const DURACION_EVENTO_H = 5;   // un evento grande se oculta pasadas 5 h de su inicio
const DURACION_SHOW_H = 3;     // un show semanal, pasadas 3 h
const MAX_ITEMS = 60;
const CANVAS_W = 800, CANVAS_H = 450;
const DARK_BG = 0x161616FF;

let Jimp = null;
const getJimp = () => (Jimp || (Jimp = require('jimp')));

const MESES = { enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5, julio: 6, agosto: 7, septiembre: 8, setiembre: 8, octubre: 9, noviembre: 10, diciembre: 11 };
const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const DIAS_BONITOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_BONITOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const limpiar = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const dd = (n) => String(n).padStart(2, '0');

// "0:00" / "20:00" -> {h, m} (o null)
function parseHora(t) {
  const m = /(\d{1,2})\s*[:.]\s*(\d{2})/.exec(String(t || ''));
  return m ? { h: Number(m[1]), m: Number(m[2]) } : null;
}
// Instante real (UTC ms) de una fecha/hora locales
const aUtc = (Y, M, D, h, m) => Date.UTC(Y, M, D, h - LOCAL_UTC, m);
// Fecha local (Y, M, D, dia de la semana) de un instante
function fechaLocal(utcMs) {
  const d = new Date(utcMs + LOCAL_UTC * 3600e3);
  return { Y: d.getUTCFullYear(), M: d.getUTCMonth(), D: d.getUTCDate(), dow: d.getUTCDay() };
}
// "Sabado 31 de Octubre" (con o sin año) -> {Y, M, D}; si no trae año se toma el mas cercano hacia adelante
function parseFecha(t, ahora) {
  const m = /(\d{1,2})\s+de\s+([a-z]+)(?:\s+(?:de\s+)?(\d{4}))?/.exec(norm(t));
  if (!m || MESES[m[2]] == null) return null;
  const hoy = fechaLocal(ahora);
  let Y = m[3] ? Number(m[3]) : hoy.Y;
  const M = MESES[m[2]], D = Number(m[1]);
  if (!m[3] && aUtc(Y, M, D, 23, 59) < ahora - 90 * 86400e3) Y++;
  return { Y, M, D };
}
function organizacion(nombre) {
  const n = norm(nombre);
  if (/\bnxt\b/.test(n)) return 'NXT';
  if (/\baew\b/.test(n)) return 'AEW';
  if (/\baaa\b|triple a/.test(n)) return 'AAA';
  if (/\btna\b|impact/.test(n)) return 'TNA';
  if (/wwe|\braw\b|smackdown|survivor|crown jewel|wrestlepalooza|wrestlemania|royal rumble|summerslam/.test(n)) return 'WWE';
  return 'Lucha libre';
}

function leerDatos() {
  const out = { eventos: [], semanales: [] };
  if (!fs.existsSync(DATOS_DIR)) return null;
  const archivos = fs.readdirSync(DATOS_DIR).filter(f => f.endsWith('.json')).sort();
  if (!archivos.length) return null;
  for (const f of archivos) {
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(DATOS_DIR, f), 'utf8')); }
    catch (e) { console.warn(`  ! ${f} no es un JSON valido: ${e.message}`); continue; }
    (j.eventos || []).forEach(x => out.eventos.push(x));
    (j.semanales || []).forEach(x => out.semanales.push(x));
  }
  return out;
}

// ---------- lectura automatica de las tablas de la pagina ----------
const ENTIDADES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', iexcl: '¡', ordm: 'º' };
function decodificar(s) {
  return String(s)
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => (ENTIDADES[n] != null ? ENTIDADES[n] : m));
}
const textoCelda = (h) => limpiar(decodificar(h.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ')));
// Mismo criterio que el marcador: tabla con FECHA+EVENTO -> eventos; tabla con HORA+SHOWS -> shows semanales.
function extraerTablas(html) {
  const out = { eventos: [], semanales: [] };
  const limpio = String(html || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  for (const t of limpio.match(/<table(?:\s[^>]*)?>[\s\S]*?<\/table>/gi) || []) {
    const filas = (t.match(/<tr(?:\s[^>]*)?>[\s\S]*?<\/tr>/gi) || [])
      .map(r => (r.match(/<t[hd](?:\s[^>]*)?>[\s\S]*?<\/t[hd]>/gi) || []).map(textoCelda))
      .filter(r => r.length >= 3);
    if (!filas.length) continue;
    const cab = filas[0].join(' ').toUpperCase();
    const cuerpo = filas.slice(1);
    if (/FECHA/.test(cab) && /EVENTO/.test(cab)) cuerpo.forEach(r => out.eventos.push({ fecha: r[0], hora: r[1], evento: r[2] }));
    else if (/SHOW/.test(cab) && /HORA/.test(cab)) cuerpo.forEach(r => out.semanales.push({ dia: r[0], hora: r[1], show: r[2] }));
  }
  return out;
}
async function leerWeb() {
  const out = { eventos: [], semanales: [] };
  if (process.env.LUCHA_SIN_WEB) return out;
  for (const url of FUENTES_WEB) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36', 'Accept': 'text/html', 'Accept-Language': 'es-MX,es;q=0.9' },
        signal: AbortSignal.timeout(20000)
      });
      if (!r.ok) { console.warn(`  ! ${url} respondio ${r.status}`); continue; }
      const t = extraerTablas(await r.text());
      console.log(`  ${url}: ${t.eventos.length} eventos, ${t.semanales.length} shows semanales`);
      out.eventos.push(...t.eventos);
      out.semanales.push(...t.semanales);
    } catch (e) { console.warn(`  ! ${url}: ${e.message}`); }
  }
  return out;
}

function construir(datos, ahora) {
  const items = [], vistos = new Set();
  const hoy = fechaLocal(ahora);

  // Eventos con fecha (PLE y otros)
  for (const e of datos.eventos) {
    const nombre = limpiar(e.evento || e.nombre);
    const f = parseFecha(e.fecha, ahora);
    if (!nombre || !f) continue;
    let hr = parseHora(e.hora);
    // 0:00 en un evento con fecha casi siempre es "hora por confirmar": se muestra el dia y se oculta al terminar ese dia
    const confirmada = !!hr && !(hr.h === 0 && hr.m === 0);
    if (!confirmada) hr = { h: 0, m: 0 };
    const inicioUtc = aUtc(f.Y, f.M, f.D, hr.h, hr.m);
    const finUtc = confirmada ? inicioUtc + DURACION_EVENTO_H * 3600e3 : aUtc(f.Y, f.M, f.D, 23, 59);
    const dow = new Date(aUtc(f.Y, f.M, f.D, 12, 0) + LOCAL_UTC * 3600e3).getUTCDay();
    items.push({ tipo: 'evento', nombre, org: organizacion(nombre), f, dow, hora: confirmada ? `${dd(hr.h)}:${dd(hr.m)}` : '', inicioUtc, finUtc });
  }

  // Shows semanales: proxima funcion de cada uno
  for (const s of datos.semanales) {
    const nombre = limpiar(s.show || s.nombre);
    const dIdx = DIAS.indexOf(norm(s.dia));
    const hr = parseHora(s.hora);
    if (!nombre || dIdx < 0 || !hr) continue;
    for (let off = 0; off <= 7; off++) {
      const base = fechaLocal(ahora + off * 86400e3);
      if (base.dow !== dIdx) continue;
      const inicioUtc = aUtc(base.Y, base.M, base.D, hr.h, hr.m);
      const finUtc = inicioUtc + DURACION_SHOW_H * 3600e3;
      if (ahora >= finUtc) continue;
      items.push({ tipo: 'semanal', nombre, org: organizacion(nombre), f: { Y: base.Y, M: base.M, D: base.D }, dow: dIdx, hora: `${dd(hr.h)}:${dd(hr.m)}`, inicioUtc, finUtc });
      break;
    }
  }

  const vigentes = items.filter(p => ahora < p.finUtc);
  // un show semanal que coincide con un evento de la misma empresa (ej. el Triple A del sabado y su evento grande) sobra
  const finales = vigentes.filter(p => p.tipo !== 'semanal' || !vigentes.some(o => o.tipo === 'evento' && o.org === p.org && Math.abs(o.inicioUtc - p.inicioUtc) < 3 * 3600e3));
  finales.sort((a, b) => a.inicioUtc - b.inicioUtc || a.nombre.localeCompare(b.nombre));

  const res = [];
  for (const p of finales) {
    p.fechaIso = `${p.f.Y}${dd(p.f.M + 1)}${dd(p.f.D)}`;
    p.clave = `${p.fechaIso}-${p.hora ? p.hora.replace(':', '') : 'xxxx'}-${slug(p.nombre).slice(0, 40)}`;
    if (vistos.has(p.clave)) continue;   // mismo dia, hora y nombre repetido en dos archivos
    vistos.add(p.clave);
    res.push(p);
  }
  return res.slice(0, MAX_ITEMS);
}

async function tarjeta(p, outPath) {
  const J = getJimp();
  const canvas = new J(CANVAS_W, CANVAS_H, DARK_BG);
  const f64 = await J.loadFont(J.FONT_SANS_64_WHITE);
  const f32 = await J.loadFont(p.nombre.length > 28 ? J.FONT_SANS_32_WHITE : J.FONT_SANS_64_WHITE);
  const f16 = await J.loadFont(J.FONT_SANS_16_WHITE);
  const fechaCorta = `${DIAS_CORTOS[p.dow]} ${dd(p.f.D)}/${dd(p.f.M + 1)}`;
  canvas.print(f64, 40, 30, p.hora ? p.hora : fechaCorta);
  canvas.print(f16, 40, 110, { text: `${p.org} · ${p.hora ? fechaCorta : 'hora por confirmar'}`, alignmentX: J.HORIZONTAL_ALIGN_LEFT }, CANVAS_W - 60);
  canvas.print(f32, 40, 170, { text: p.nombre, alignmentX: J.HORIZONTAL_ALIGN_CENTER, alignmentY: J.VERTICAL_ALIGN_MIDDLE }, CANVAS_W - 80, CANVAS_H - 200);
  await canvas.writeAsync(outPath);
}

async function main() {
  const web = await leerWeb();
  const resp = leerDatos() || { eventos: [], semanales: [] };
  // lo que traiga la pagina manda; si no trajo eventos (o shows), se usa el respaldo de lucha-datos/
  const datos = {
    eventos: web.eventos.length ? web.eventos : resp.eventos,
    semanales: web.semanales.length ? web.semanales : resp.semanales
  };
  console.log(`Eventos: ${web.eventos.length ? 'de la pagina' : 'del respaldo'} (${datos.eventos.length}). Shows semanales: ${web.semanales.length ? 'de la pagina' : 'del respaldo'} (${datos.semanales.length}).`);
  if (!datos.eventos.length && !datos.semanales.length) { console.log('Sin datos (ni de la pagina ni de lucha-datos/): no se toca el catalogo de Lucha.'); return; }
  const ahora = process.env.AHORA_UTC ? Number(process.env.AHORA_UTC) : Date.now();
  const lista = construir(datos, ahora);

  const repoSlug = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME || 'main';
  const RAW_BASE = repoSlug ? `https://raw.githubusercontent.com/${repoSlug}/${branch}` : 'https://raw.githubusercontent.com/USUARIO/REPO/main';

  const cardsDir = path.join(OUT_DIR, 'agenda', 'lucha-cards');
  const metaDir = path.join(OUT_DIR, 'meta', 'tv');
  fs.mkdirSync(cardsDir, { recursive: true });
  fs.mkdirSync(metaDir, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, 'catalog', 'tv'), { recursive: true });

  const hoy = fechaLocal(ahora);
  const metas = [];
  const cardsVivas = new Set(), metasVivas = new Set();
  for (const p of lista) {
    const id = PREFIX + p.clave;
    const cardName = `ev-${p.clave}.png`; // hora y nombre en la clave: si cambian, se regenera
    const cardPath = path.join(cardsDir, cardName);
    cardsVivas.add(cardName);
    if (!fs.existsSync(cardPath) && !process.env.SKIP_IMAGES) {
      try { await tarjeta(p, cardPath); } catch (e) { console.warn(`  ! tarjeta de ${p.nombre}: ${e.message}`); }
    }
    const poster = fs.existsSync(cardPath) ? `${RAW_BASE}/agenda/lucha-cards/${cardName}` : undefined;
    const esHoy = p.f.Y === hoy.Y && p.f.M === hoy.M && p.f.D === hoy.D;
    const corta = `${DIAS_CORTOS[p.dow]} ${dd(p.f.D)}/${dd(p.f.M + 1)}`;
    const name = esHoy ? (p.hora ? `${p.hora} ${p.nombre}` : `Hoy ${p.nombre}`) : (p.hora ? `${corta} ${p.hora} ${p.nombre}` : `${corta} ${p.nombre}`);
    const larga = `${DIAS_BONITOS[p.dow]} ${p.f.D} de ${MESES_BONITOS[p.f.M]}`;
    const meta = {
      id, type: 'tv', name,
      poster, logo: poster, background: poster, posterShape: 'landscape',
      genres: [p.org],
      description: `${p.nombre} · ${larga}${p.hora ? ', ' + p.hora + ' (hora de Ciudad de México)' : ' (hora por confirmar)'}. Se abre con las fuentes del canal Lucha en vivo: solo reproduce mientras el evento esté en vivo en ellas.`
    };
    fs.writeFileSync(path.join(metaDir, `${id}.json`), JSON.stringify({ meta }, null, 2));
    metasVivas.add(`${id}.json`);
    metas.push({ id, type: 'tv', name, poster, posterShape: 'landscape', genres: meta.genres });
  }
  for (const f of fs.readdirSync(cardsDir)) if (!cardsVivas.has(f)) fs.rmSync(path.join(cardsDir, f));
  for (const f of fs.readdirSync(metaDir)) if (f.startsWith(PREFIX) && !metasVivas.has(f)) fs.rmSync(path.join(metaDir, f));

  fs.writeFileSync(path.join(OUT_DIR, 'catalog', 'tv', 'cobalto-lucha.json'), JSON.stringify({ metas }, null, 2));
  console.log(`Catalogo Lucha listo: ${metas.length} entradas (${datos.eventos.length} eventos y ${datos.semanales.length} shows leidos).`);
}

if (require.main === module) main().catch(err => { console.error('Falló el catálogo de lucha:', err); process.exit(1); });
module.exports = { construir, parseFecha, parseHora, organizacion, extraerTablas };
