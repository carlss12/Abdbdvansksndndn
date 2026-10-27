/**
 * Ónix - canales deportivos en vivo
 * Se activa al abrir un canal de TV. Si el id es del catálogo ("cbl-<canal>") devuelve todas las variantes del canal
 * (ej. ESPN, ESPN MX); si viene de otro addon lo empareja por nombre como antes.
 * Todo corre en el celular, asi que el token del m3u8 se pide desde la misma IP que reproduce.
 */
var DEBUG = true; // true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.1.0";
var LABEL = "Lat 2";
var PREFIX = "cbl-";

// [nombre a mostrar, id en los reproductores, canal del catalogo]
var CHANNELS = [
  ["ESPN", "espn", "espn"],
  ["ESPN 2", "espn2", "espn-2"],
  ["ESPN 3", "espn3", "espn-3"],
  ["Fox Sports", "foxsports", "fox-sports"],
  ["Fox Sports 2", "foxsports2", "fox-sports-2"],
  ["Fox Sports 3", "foxsports3", "fox-sports-3"],
  ["DSports", "dsports", "dsports"],
  ["DSports 2", "dsports2", "dsports-2"],
  ["DSports Plus", "dsportsplus", "dsports-plus"],
  ["Liga 1 MAX", "liga1max", "liga-1-max"],
  ["ESPN MX", "espnmx", "espn"],
  ["ESPN 2 MX", "espn2mx", "espn-2"],
  ["ESPN 3 MX", "espn3mx", "espn-3"],
  ["Fox Sports MX", "foxsportsmx", "fox-sports"],
  ["Fox Sports 2 MX", "foxsports2mx", "fox-sports-2"],
  ["Fox Sports 3 MX", "foxsports3mx", "fox-sports-3"],
  ["Fox Sports Premium", "foxsportspremium", "fox-sports-premium"],
  ["TUDN MX", "tudn_mx", "tudn"]
];
// otros nombres con que pueden llegar los canales desde un addon -> nombre de arriba
// (DIRECTV Sports se renombro DSports: es el mismo canal)
var ALIASES = {
  "tudn": "TUDN MX", "dsportsplus": "DSports Plus", "foxsportspremium": "Fox Sports Premium",
  "directvsports": "DSports", "directvsports2": "DSports 2", "directvsportsplus": "DSports Plus"
};

var UA = "Mozilla/5.0 (Linux; Android 13; moto g82 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
var TRACE = [];
function trace(m) { TRACE.push(String(m).replace(/\s+/g, " ").slice(0, 140)); }

// ---------- emparejar el id de Nuvio con un canal ----------
function key(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\b(mexico)\b/g, "mx").replace(/\bhd\b/g, "").replace(/[^a-z0-9]+/g, "");
}
function variants(id) {
  var parts = String(id).toLowerCase().split("-"), out = [];
  for (var i = 0; i < Math.min(parts.length, 8); i++) {
    var rest = parts.slice(i);
    out.push(rest.join("-"));
    // sin el sufijo de pais que ponen algunos addons ("...-espn-2-mexico-mx", "...-directv-sports-co")
    if (rest.length > 1 && /^(mx|co|pe|ar|us|es|cl|ec|ve|br|latam|hd)$/.test(rest[rest.length - 1])) out.push(rest.slice(0, -1).join("-"));
  }
  return out;
}
function match(id) {
  var vs = variants(id), i, j;
  for (i = 0; i < vs.length; i++) {
    var k = key(vs[i]);
    if (!k) continue;
    var alias = ALIASES[k];
    for (j = 0; j < CHANNELS.length; j++) {
      if (key(CHANNELS[j][0]) === k || (alias && CHANNELS[j][0] === alias)) return CHANNELS[j];
    }
  }
  return null;
}

function slugFromId(id) {
  var t = String(id || "").toLowerCase(), i = t.indexOf(PREFIX);
  return i < 0 ? "" : t.slice(i + PREFIX.length);
}
// id del catalogo -> todas las variantes del canal; id de otro addon -> el canal que coincida por nombre
function matchAll(id) {
  var slug = slugFromId(id);
  if (slug) return CHANNELS.filter(function (c) { return c[2] === slug; });
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
async function get(url, headers, ms) {
  var h = { "User-Agent": UA, "Accept-Language": "es-419,es;q=0.9" };
  for (var k in headers) h[k] = headers[k];
  var r = await withTimeout(fetch(url, { headers: h }), ms, "peticion");
  var text = await r.text();
  return { status: r.status, ok: r.ok, text: text };
}
function unslash(s) { return String(s).replace(/\\\//g, "/"); }

async function viaTvf90(id) {
  var r = await get("https://tvf90.com/5.php?stream=" + encodeURIComponent(id), { "Referer": "https://tvf90.com/" }, 8000);
  var m = r.ok && /playbackURL\s*=\s*"([^"]+)"/.exec(r.text);
  trace("tvf90 " + r.status + (m ? " ok" : " sin url"));
  return m ? unslash(m[1]) : "";
}
async function viaLa18(id) {
  var r = await get("https://la18hd.su/vivo/canal.php?stream=" + encodeURIComponent(id), { "Sec-Fetch-Dest": "iframe" }, 8000);
  var m = r.ok && /"src":"([^"]+)"/.exec(r.text);
  trace("la18hd " + r.status + (m ? " ok" : " sin url"));
  return m ? unslash(m[1]) : "";
}
// "ok" = lista HLS viva (o un host que no sabemos revisar), "offline" = el servidor responde que no hay señal
async function verify(url) {
  if (!/^https:\/\/[^\/]*\.(?:ftlly|fubo18|domhsd)\.com[:\/]/.test(url)) return "ok";
  try {
    var r = await get(url, {}, 4500);
    if (r.ok) return /^#EXTM3U/.test(r.text.replace(/^\s+/, "")) ? "ok" : "offline";
    return r.status >= 400 ? "offline" : "ok";
  } catch (e) { return "ok"; }
}

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  var list = matchAll(tmdbId);
  if (!list.length) {
    // Modo prueba: muestra el id que llego para poder ajustar el emparejamiento. Quitar con DEBUG = false.
    if (DEBUG && !slugFromId(tmdbId) && !/^(tt)?\d+$/.test(String(tmdbId))) {
      return [{ name: LABEL, title: "", url: "https://example.com/", quality: "\uD83D\uDEE0 ID NO RECONOCIDO (no reproducir)\nid=" + tmdbId, headers: {} }];
    }
    return []; // no es un canal de este plugin: no estorbar
  }
  TRACE = [];
  trace("Ónix v" + VERSION + " | id=" + tmdbId + " -> " + list.map(function (c) { return c[0] + " (" + c[1] + ")"; }).join(", "));
  var players = [["tvf90", viaTvf90], ["la18hd", viaLa18]];
  var jobs = [];
  list.forEach(function (ch, ci) {
    players.forEach(function (p, pi) {
      jobs.push((async function () {
        try {
          var url = await p[1](ch[1]);
          if (!url) return null;
          if ((await verify(url)) === "offline") { trace(ch[1] + " " + p[0] + " sin señal"); return null; }
          return { order: ci * 10 + pi, ch: ch, opcion: pi + 1, url: url };
        } catch (e) { trace(ch[1] + " " + p[0] + " fallo: " + String(e && e.message || e)); return null; }
      })());
    });
  });
  var found = (await Promise.all(jobs)).filter(Boolean).sort(function (a, b) { return a.order - b.order; });
  var results = [], seen = {};
  found.forEach(function (f) {
    if (seen[f.url]) return;
    seen[f.url] = true;
    results.push({ name: LABEL, title: f.ch[0] + " · Opción " + f.opcion, url: f.url, quality: "HD", headers: {} });
  });
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\n" + TRACE.join("\n"), headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._match = match;
exports._matchAll = matchAll;
