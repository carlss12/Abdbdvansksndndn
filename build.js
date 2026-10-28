// Genera manifest.json, catalog/, meta/, stream/ y los logos que falten a partir de channels.json.
// Los logos que ya existen en logos/ no se tocan; para los demas se busca el logo en iptv-org
// (https://iptv-org.github.io/api) y, si no aparece, se genera una tarjeta con el nombre.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUT_DIR = __dirname;
// El id lleva el prefijo 'kitsu:' porque Nuvio en la TV solo ejecuta plugins para ids TMDB/IMDb o kitsu:/mal:/anilist:.
// Los plugins buscan 'cbl-' dentro del id, asi que 'kitsu:cbl-espn' sigue funcionando. Los archivos de logos usan FILE_PREFIX (sin ':').
const PREFIX = 'kitsu:cbl-';
const FILE_PREFIX = 'cbl-';
const ADDON_ID = 'org.cobalto.guia.t';
const ADDON_NAME = 'Cobalto T';
const CATALOGS = [
  { key: 'deportes', id: 'cobalto-deportes', name: 'Deportes' },
  { key: 'canales', id: 'cobalto-canales', name: 'Canales' }
];

const CANVAS_W = 800;
const CANVAS_H = 450;
const LOGO_MAX_FRACTION = 0.82;
const LIGHT_BG = 0xF2F2F2FF;
const DARK_BG = 0x161616FF;
const PAISES_PREFERIDOS = ['MX', 'US', 'AR', 'CO', 'PE', 'ES', 'CL'];

let Jimp = null;
function getJimp() {
  if (!Jimp) Jimp = require('jimp');
  return Jimp;
}

function norm(str) {
  return String(str || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

// ---------- logos desde iptv-org ----------
let IPTV = null;
async function cargarIptv() {
  if (IPTV) return IPTV;
  try {
    const get = async (u) => {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`${u} -> ${r.status}`);
      return r.json();
    };
    const [canales, logos] = await Promise.all([
      get('https://iptv-org.github.io/api/channels.json'),
      get('https://iptv-org.github.io/api/logos.json')
    ]);
    const logosPorCanal = new Map();
    for (const l of logos) {
      if (!/^(png|jpe?g|gif|bmp|tiff?)$/i.test(l.format || '')) continue; // Jimp no lee SVG ni WEBP
      if (!logosPorCanal.has(l.channel)) logosPorCanal.set(l.channel, []);
      logosPorCanal.get(l.channel).push(l);
    }
    const porNombre = new Map();
    for (const c of canales) {
      if (!logosPorCanal.has(c.id)) continue;
      for (const n of [c.name, ...(c.alt_names || [])]) {
        const k = norm(n);
        if (!k) continue;
        if (!porNombre.has(k)) porNombre.set(k, []);
        porNombre.get(k).push(c);
      }
    }
    IPTV = { logosPorCanal, porNombre };
  } catch (e) {
    console.warn('  ! No pude leer la base de iptv-org:', e.message);
    IPTV = { logosPorCanal: new Map(), porNombre: new Map() };
  }
  return IPTV;
}

async function buscarLogoIptv(nombre) {
  const { logosPorCanal, porNombre } = await cargarIptv();
  const candidatos = porNombre.get(norm(nombre));
  if (!candidatos || candidatos.length === 0) return null;
  const puntaje = (c) => {
    const i = PAISES_PREFERIDOS.indexOf(c.country);
    return (c.closed ? 100 : 0) + (i === -1 ? 50 : i);
  };
  candidatos.sort((a, b) => puntaje(a) - puntaje(b));
  const logos = logosPorCanal.get(candidatos[0].id) || [];
  logos.sort((a, b) => (b.width || 0) - (a.width || 0));
  return logos.length ? logos[0].url : null;
}

// ---------- tarjetas 800x450 (misma logica del addon de ejemplo) ----------
function averageLuminance(img) {
  let total = 0;
  let count = 0;
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const alpha = this.bitmap.data[idx + 3];
    if (alpha < 40) return;
    total += 0.299 * this.bitmap.data[idx] + 0.587 * this.bitmap.data[idx + 1] + 0.114 * this.bitmap.data[idx + 2];
    count++;
  });
  return count === 0 ? 128 : total / count;
}

function fraccionOpaca(img) {
  let opacos = 0, total = 0;
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    total++;
    if (this.bitmap.data[idx + 3] > 250) opacos++;
  });
  return total === 0 ? 0 : opacos / total;
}

function colorDeEsquina(img) {
  const idx = img.getPixelIndex(0, 0);
  const r = img.bitmap.data[idx], g = img.bitmap.data[idx + 1], b = img.bitmap.data[idx + 2];
  return ((r << 24) | (g << 16) | (b << 8) | 0xFF) >>> 0;
}

async function tarjetaDeTexto(nombre, outPath) {
  const J = getJimp();
  const canvas = new J(CANVAS_W, CANVAS_H, DARK_BG);
  const font = await J.loadFont(nombre.length > 16 ? J.FONT_SANS_32_WHITE : J.FONT_SANS_64_WHITE);
  canvas.print(font, 40, 0, {
    text: nombre,
    alignmentX: J.HORIZONTAL_ALIGN_CENTER,
    alignmentY: J.VERTICAL_ALIGN_MIDDLE
  }, CANVAS_W - 80, CANVAS_H);
  await canvas.writeAsync(outPath);
}

async function tarjetaDeLogo(url, outPath) {
  const J = getJimp();
  const logoImg = await J.read(url);
  const casiOpaco = fraccionOpaca(logoImg) > 0.9;
  let bg;
  if (casiOpaco) {
    bg = colorDeEsquina(logoImg);
  } else {
    bg = averageLuminance(logoImg) < 128 ? LIGHT_BG : DARK_BG;
    try { logoImg.autocrop({ tolerance: 0.02, cropSymmetric: false, leaveBorder: 0 }); } catch (e) { /* sin recorte */ }
  }
  const canvas = new J(CANVAS_W, CANVAS_H, bg);
  const scale = Math.min((CANVAS_W * LOGO_MAX_FRACTION) / logoImg.bitmap.width, (CANVAS_H * LOGO_MAX_FRACTION) / logoImg.bitmap.height, 4);
  logoImg.scale(scale, J.RESIZE_BICUBIC);
  canvas.composite(logoImg, Math.round((CANVAS_W - logoImg.bitmap.width) / 2), Math.round((CANVAS_H - logoImg.bitmap.height) / 2));
  await canvas.writeAsync(outPath);
}

async function asegurarLogo(ch, id) {
  const rel = `logos/${id}.png`; // id aqui es FILE_PREFIX + slug
  const outPath = path.join(OUT_DIR, rel);
  if (fs.existsSync(outPath)) return rel; // ya existe: no se vuelve a generar
  if (process.env.SKIP_IMAGES) return null;
  const url = await buscarLogoIptv(ch.iptv || ch.name);
  if (url) {
    try {
      await tarjetaDeLogo(url, outPath);
      console.log(`  + logo de iptv-org para ${ch.name}`);
      return rel;
    } catch (e) {
      console.warn(`  ! No pude usar el logo de ${ch.name} (${url}): ${e.message}`);
    }
  } else {
    console.warn(`  ! iptv-org no tiene logo para ${ch.name}`);
  }
  await tarjetaDeTexto(ch.name, outPath);
  console.log(`  + tarjeta de texto para ${ch.name}`);
  return rel;
}

// ---------- fuentes de Cipres dentro del addon ----------
// Nuvio en la TV pide las fuentes de los canales (tipo "tv") solo al addon, no a los plugins.
// Por eso las URLs de plu/providers/cipres.js se copian aqui a stream/tv/<id>.json.
// cipres.js sigue siendo la unica lista que hay que editar.
function cargarCipres() {
  const file = path.join(OUT_DIR, 'plu', 'providers', 'cipres.js');
  if (!fs.existsSync(file)) { console.warn('  ! No encuentro plu/providers/cipres.js: los canales quedan sin fuentes.'); return { channels: {}, label: 'Lat 1' }; }
  const ctx = { exports: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx);
  return { channels: ctx.CHANNELS || {}, label: ctx.LABEL || 'Lat 1' };
}

function streamsDeCipres(cipres, slug) {
  const grupos = cipres.channels[slug] || [];
  const vistos = new Set();
  const streams = [];
  for (const [nombre, urls] of grupos) {
    urls.forEach((url, n) => {
      if (vistos.has(url)) return;
      vistos.add(url);
      streams.push({ name: cipres.label, title: `${nombre} · Opción ${n + 1}`, url });
    });
  }
  return streams;
}

// ---------- main ----------
async function main() {
  const canales = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'channels.json'), 'utf8'));
  const repoSlug = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME || 'main';
  const RAW_BASE = repoSlug ? `https://raw.githubusercontent.com/${repoSlug}/${branch}` : 'https://raw.githubusercontent.com/USUARIO/REPO/main';
  if (!repoSlug) console.warn('Corriendo local sin GITHUB_REPOSITORY: las URLs de los logos quedan con USUARIO/REPO hasta que corra en GitHub Actions.');
  const CACHE_BUST = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 8) : String(Date.now());

  // Borra lo generado, menos lo de la agenda (lo maneja agenda.js: catalogo cobalto-agenda y metas kitsu:cbl-ag-*).
  const esDeAgenda = (f) => f === 'cobalto-agenda.json' || f.startsWith('kitsu:cbl-ag-');
  for (const d of ['meta/tv', 'catalog/tv']) {
    const dir = path.join(OUT_DIR, d);
    if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (!esDeAgenda(f)) fs.rmSync(path.join(dir, f), { recursive: true, force: true });
  }
  for (const d of ['stream']) fs.rmSync(path.join(OUT_DIR, d), { recursive: true, force: true });
  for (const d of ['meta/tv', 'catalog/tv', 'logos']) fs.mkdirSync(path.join(OUT_DIR, d), { recursive: true });

  const porCatalogo = {};
  CATALOGS.forEach(c => { porCatalogo[c.key] = []; });
  const usados = new Set();

  for (const ch of canales) {
    const id = PREFIX + ch.slug;
    if (usados.has(id)) throw new Error(`slug repetido: ${ch.slug}`);
    usados.add(id);
    if (!porCatalogo[ch.category]) throw new Error(`categoria desconocida en ${ch.slug}: ${ch.category}`);

    const relLogo = await asegurarLogo(ch, FILE_PREFIX + ch.slug);
    const poster = relLogo ? `${RAW_BASE}/${relLogo}?v=${CACHE_BUST}` : undefined;

    const meta = {
      id,
      type: 'tv',
      name: ch.name,
      poster,
      logo: poster,
      background: poster,
      posterShape: 'landscape',
      genres: ch.genre ? [ch.genre] : undefined,
      description: `Canal en vivo — ${ch.name}.`
    };
    fs.writeFileSync(path.join(OUT_DIR, 'meta', 'tv', `${id}.json`), JSON.stringify({ meta }, null, 2));
    // Las fuentes (Cipres, Onix, Marfil) las dan los plugins: con el id kitsu: la TV tambien los ejecuta.
    porCatalogo[ch.category].push({ id, type: 'tv', name: meta.name, poster, posterShape: 'landscape', genres: meta.genres });
  }

  for (const c of CATALOGS) {
    fs.writeFileSync(path.join(OUT_DIR, 'catalog', 'tv', `${c.id}.json`), JSON.stringify({ metas: porCatalogo[c.key] }, null, 2));
  }

  const manifest = {
    id: ADDON_ID,
    version: '1.0.0',
    name: ADDON_NAME,
    description: 'Guía de canales en vivo',
    resources: ['catalog', 'meta', 'stream'],
    types: ['tv'],
    idPrefixes: [PREFIX],
    catalogs: [...CATALOGS.map(c => ({ type: 'tv', id: c.id, name: c.name })), { type: 'tv', id: 'cobalto-agenda', name: 'Agenda' }],
    behaviorHints: { configurable: false }
  };
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`Listo: ${canales.length} canales (${CATALOGS.map(c => `${c.name}: ${porCatalogo[c.key].length}`).join(', ')}).`);
}

main().catch(err => {
  console.error('Falló el build:', err);
  process.exit(1);
});
