/**
 * Marfil - canales de TV en vivo
 * Se activa al abrir un canal de TV. Si el id es del catálogo ("cbl-<canal>") devuelve todas las variantes del canal
 * (ej. ESPN, ESPN MX, ESPN Colombia); si viene de otro addon lo empareja por nombre como antes.
 *   live/core.php?canal=<id> (Referer del sitio) -> stream.php firmado -> pagina con /playlist/N/index.m3u8?token=...
 * Todo corre en el celular, asi que el token se pide desde la misma IP que reproduce.
 */
var BASE = "https://www.tvenvivo.org";
var UA = "Mozilla/5.0 (Linux; Android 13; moto g82 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
// true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO" con los pasos. Poner en false al terminar de probar.
var DEBUG = true;
var VERSION = "1.1.0";
var LABEL = "Lat 3";
var PREFIX = "cbl-";

// [slug, canal que pide el reproductor, nombre, canal del catalogo]
var CHANNELS = [
  ["bein-sports-xtra","beinsportsxtra","Bein Sports Xtra","bein-sports-xtra"],
  ["liga-1","liga1","Liga 1","liga-1"],
  ["liga-1-max","liga1max","Liga 1 Max","liga-1-max"],
  ["tudn","tudn","TUDN","tudn"],
  ["sky-sports-la-liga","skysportslaliga","Sky Sports La Liga","sky-sports-la-liga"],
  ["fox-sports-premium","foxsportspremium","Fox Sports Premium","fox-sports-premium"],
  ["tyc-sports","tycsports","TyC Sports","tyc-sports"],
  ["movistar-la-liga","movistarlaliga","Movistar La Liga","movistar-la-liga"],
  ["movistar-liga-campeones","movistarligadecampeones","Movistar Liga de Campeones","movistar-liga-de-campeones"],
  ["directv-sports","directvsports","Directv Sports","dsports"],
  ["directv-sports-2","directvsports2","Directv Sports 2","dsports-2"],
  ["directv-sports-plus","directvsportsplus","Directv Sports Plus","dsports-plus"],
  ["espn-premium-latino-america","espnpremiumlat","ESPN Premium Usa","espn-premium"],
  ["espn-premium-argentina","espnpremiumar","ESPN Premium Argentina","espn-premium"],
  ["espn-colombia","espn","ESPN Colombia","espn"],
  ["espn-argentina","espnar","ESPN Argentina","espn"],
  ["espn-2","espn2","ESPN 2","espn-2"],
  ["espn-3","espn3","ESPN 3","espn-3"],
  ["espn-4","espn4","ESPN 4","espn-4"],
  ["espn-5","espn5","ESPN 5","espn-5"],
  ["espn-6","espn6","ESPN 6","espn-6"],
  ["espn-7","espn7","ESPN 7","espn-7"],
  ["espn-mexico","espnmexico","ESPN Mexico","espn"],
  ["espn-2-mexico","espn2mexico","ESPN 2 Mexico","espn-2"],
  ["espn-3-mexico","espn3mexico","ESPN 3 Mexico","espn-3"],
  ["espn-4-mexico","espn4mexico","ESPN 4 Mexico","espn-4"],
  ["espn-5-mexico","espn5mexico","ESPN 5 Mexico","espn-5"],
  ["fox-sports","foxsports","Fox Sports","fox-sports"],
  ["fox-sports-2","foxsports2","Fox Sports 2","fox-sports-2"],
  ["fox-sports-3","foxsports3","Fox Sports 3","fox-sports-3"],
  ["fox-sports-mexico","foxsportsmexico","Fox Sports Mexico","fox-sports"],
  ["fox-sports-2-mexico","foxsports2mexico","Fox Sports 2 Mexico","fox-sports-2"],
  ["fox-sports-3-mexico","foxsports3mexico","Fox Sports 3 Mexico","fox-sports-3"],
  ["telefe","telefe","Telefe","telefe"],
  ["el-trece","eltrece","El Trece","el-trece"],
  ["azteca-uno","aztecauno","Azteca Uno","azteca-uno"],
  ["tooncast","tooncast","Tooncast","tooncast"],
  ["tnt","tnt","TNT","tnt"],
  ["cinemax","cinemax","Cinemax","cinemax"],
  ["space","space","Space","space"],
  ["warner-channel","warnerchannel","Warner Channel","warner-channel"],
  ["cinecanal","cinecanal","Cinecanal","cinecanal"],
  ["fx","fx","FX","fx"],
  ["golden","golden","Golden","golden"],
  ["golden-premier","goldenpremier","Golden Premier","golden-premier"],
];

// canales del catalogo que son deportivos (llevan etiqueta HD; el resto es SD)
var SPORTS = ["espn", "espn-2", "espn-3", "espn-4", "espn-5", "espn-6", "espn-7", "espn-premium", "fox-sports", "fox-sports-2", "fox-sports-3", "fox-sports-premium", "dsports", "dsports-2", "dsports-plus", "tudn", "liga-1", "liga-1-max", "bein-sports-xtra", "sky-sports-la-liga", "tyc-sports", "movistar-la-liga", "movistar-liga-de-campeones"];
function shortName(n) { return String(n).replace(/\bM[eé]xico\b/g, "MX"); }

var MANIFEST_RE = /https?:\/\/[^"'\s<]+?\/playlist\/\d+\/index\.m3u8\?token=[0-9a-f]{40}-[0-9a-f]{32}-\d+-\d+/;
var PLAYER_RE = /src="(https:\/\/[^"]+\/stream\.php[^"]+)"/;
var TRACE = [];
function trace(m) { TRACE.push(String(m).replace(/\s+/g, " ").slice(0, 140)); }

// ---------- emparejar el id de Nuvio con un canal ----------
function key(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\b(mexico)\b/g, "mx").replace(/\b(colombia)\b/g, "co").replace(/\b(argentina)\b/g, "ar").replace(/\b(peru)\b/g, "pe")
    .replace(/\buno\b/g, "1").replace(/\bhd\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
}
var INDEX = null;
function index() {
  if (INDEX) return INDEX;
  INDEX = CHANNELS.map(function (c) { return { c: c, keys: [key(c[0]), key(c[2])] }; });
  return INDEX;
}
function variants(id) {
  var parts = String(id).toLowerCase().split("-"), out = [];
  for (var i = 0; i < Math.min(parts.length, 6); i++) {
    var rest = parts.slice(i);
    out.push(rest.join("-"));
    if (rest.length > 1 && /^(mx|co|pe|ar|us|es|cl|ec|ve|br|latam|hd)$/.test(rest[rest.length - 1])) out.push(rest.slice(0, -1).join("-"));
  }
  return out;
}
function match(id) {
  var idx = index(), vs = variants(id), i, j;
  for (i = 0; i < vs.length; i++) {
    var k = key(vs[i]);
    if (!k) continue;
    for (j = 0; j < idx.length; j++) if (idx[j].keys.indexOf(k) >= 0) return idx[j].c;
  }
  // ultimo recurso: el canal cuyo nombre esta contenido en el id (el mas largo gana)
  var full = key(id), best = null, bestLen = 0;
  for (j = 0; j < idx.length; j++) {
    for (var q = 0; q < idx[j].keys.length; q++) {
      var kk = idx[j].keys[q];
      if (kk.length >= 5 && full.indexOf(kk) >= 0 && kk.length > bestLen) { best = idx[j].c; bestLen = kk.length; }
    }
  }
  return best;
}

function slugFromId(id) {
  var s = String(id || "").toLowerCase(), i = s.indexOf(PREFIX);
  return i < 0 ? "" : s.slice(i + PREFIX.length);
}
// id del catalogo -> todas las variantes del canal; id de otro addon -> el canal que coincida por nombre
function matchAll(id) {
  var slug = slugFromId(id);
  if (slug) return CHANNELS.filter(function (c) { return c[3] === slug; });
  var one = match(id);
  return one ? [one] : [];
}

// ---------- resolver ----------
function withTimeout(p, ms, label) {
  return new Promise(function (resolve, reject) {
    var t = setTimeout(function () { reject(new Error(label + " tarda demasiado")); }, ms);
    p.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
  });
}
async function get(url, referer, ms) {
  var headers = { "User-Agent": UA, "Accept-Language": "es-419,es;q=0.9" };
  if (referer) headers["Referer"] = referer;
  var r = await withTimeout(fetch(url, { headers: headers }), ms, "peticion");
  var text = await r.text();
  return { status: r.status, ok: r.ok, text: text };
}
// Una "opcion" = una de las 3 versiones del reproductor del sitio (live, live2, live3) sobre el mismo stream.
async function viaSource(canal, source) {
  var dir = source === "1" ? "live" : "live" + source;
  var core = await get(BASE + "/" + dir + "/core.php?canal=" + encodeURIComponent(canal), BASE + "/", 9000);
  trace("op" + source + " core " + core.status);
  var player = core.ok && PLAYER_RE.exec(core.text);
  if (!player) throw new Error("core " + core.status);
  var page = await get(player[1].replace(/&amp;/g, "&"), null, 25000);
  trace("op" + source + " stream.php " + page.status);
  var html = page.ok ? page.text.replace(/\\\//g, "/") : "";
  var all = html.match(new RegExp(MANIFEST_RE.source, "g")) || [];
  var seen = {}, urls = [];
  all.forEach(function (u) {
    var n = /\/playlist\/(\d+)\//.exec(u)[1];
    if (!seen[n]) { seen[n] = true; urls.push({ n: n, url: u }); }
  });
  if (!urls.length) throw new Error("sin manifiesto " + page.status);
  trace("op" + source + " playlists: " + urls.map(function (x) { return x.n; }).join(","));
  var status = 200;
  try { status = (await get(urls[0].url, null, 4000)).status; } catch (e) { /* si no responde, que lo intente el reproductor */ }
  trace("op" + source + " m3u8 " + status);
  if (status === 404) throw new Error("canal sin senal");
  return urls;
}

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  var list = matchAll(tmdbId);
  if (!list.length) return []; // no es un canal de este plugin: no estorbar
  TRACE = [];
  trace("Marfil v" + VERSION + " | id=" + tmdbId + " -> " + list.map(function (c) { return c[2] + " (" + c[1] + ")"; }).join(", "));
  var results = [], urls = {};
  await new Promise(function (done) {
    var pending = list.length * 3, grace = null;
    list.forEach(function (ch, ci) {
      var quality = SPORTS.indexOf(ch[3]) >= 0 ? "HD" : "SD";
      ["1", "2", "3"].forEach(function (s) {
        viaSource(ch[1], s).then(function (playlists) {
          playlists.forEach(function (x) {
            if (!urls[x.url]) {
              urls[x.url] = true;
              results.push({ order: ci * 10 + Number(s), name: LABEL, title: shortName(ch[2]) + " · Opción " + s + (playlists.length > 1 ? " (playlist " + x.n + ")" : ""), url: x.url, quality: quality, headers: {} });
            }
          });
          // con el primero basta: damos 4 s de gracia por si llegan las otras opciones y variantes
          if (!grace) grace = setTimeout(done, 4000);
        }, function (e) { trace(ch[1] + " op" + s + " fallo: " + String(e && e.message || e)); }).then(function () {
          if (--pending === 0) { if (grace) clearTimeout(grace); done(); }
        });
      });
    });
  });
  results.sort(function (a, b) { return a.order - b.order; });
  results.forEach(function (r) { delete r.order; });
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: BASE + "/", quality: "🛠 DIAGNOSTICO (no reproducir)\n" + TRACE.join("\n"), headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._match = match;
exports._matchAll = matchAll;
