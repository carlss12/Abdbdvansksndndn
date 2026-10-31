/**
 * Lucha - lucha libre en vivo (SmackDown, CMLL y demas)
 * Se activa al abrir "Lucha en vivo" del catalogo (id "kitsu:cbl-lucha-en-vivo").
 * Misma idea que Berilo: pide la pagina de cada reproductor desde el celular, con el Referer de la pagina que lo embebe
 * (minhasdelicias.com), saca la lista HLS del HTML y revisa que este viva. Los reproductores solo abren con ese Referer.
 */
// El motor de plugins de Nuvio en la TV no tiene setTimeout/clearTimeout: sin esto todo falla con "setTimeout is not defined".
if (typeof globalThis.setTimeout !== "function") {
  globalThis.setTimeout = function () { return 1; };
  globalThis.clearTimeout = function () {};
}
var DEBUG = true; // true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.0.2";
var LABEL = "Lucha";
var PREFIX = "cbl-lucha";
var REFERER = "https://minhasdelicias.com/";
var UA = "Mozilla/5.0 (Linux; Android 13; moto g82 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

// [nombre a mostrar, pagina del reproductor]: para agregar otro, una linea mas.
var SOURCES = [
  ["Opción 1 · Ringmotif", "https://ringmotif.net/e/jmekma4q2tzcn"],
  ["Opción 2 · Blogger", "https://weye26.blogspot.com/p/f.html"],
  ["Opción 3 · VK Video", "https://live.vkvideo.ru/app/embed/noobcraftero"]
];
var AD_HOSTS = /aguadepez\.store|doubleclick|googlesyndication|google\.com|youtube\.com|facebook\.com/i;

var TRACE = [];
function trace(m) { TRACE.push(String(m).replace(/\s+/g, " ").slice(0, 260)); }

function isMine(id) { return String(id || "").toLowerCase().indexOf(PREFIX) >= 0; }

// ---------- base64 (el motor de la TV puede no tener atob) ----------
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64decode(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/]/g, "");
  var out = "", bits = 0, acc = 0;
  for (var i = 0; i < s.length; i++) {
    acc = (acc << 6) | B64.indexOf(s.charAt(i));
    bits += 6;
    if (bits >= 8) { bits -= 8; out += String.fromCharCode((acc >> bits) & 255); acc &= (1 << bits) - 1; }
  }
  return out;
}

// ---------- red ----------
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
  return { status: r.status, ok: r.ok, text: text, url: r.url || url };
}
function origin(u) { var m = /^(https?:\/\/[^\/]+)/.exec(u); return m ? m[1] : ""; }
function hostOf(u) { return origin(u).replace(/^https?:\/\//, ""); }

// ---------- buscar la lista HLS en una pagina ----------
function clean(s) {
  return String(s || "").replace(/\\u0026/g, "&").replace(/\\u002F/gi, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&");
}
var M3U8 = /https?:\/\/[^"'\s<>\\)]+?\.m3u8(?:\?[^"'\s<>\\)]*)?/;

// Script empaquetado ("eval(function(p,a,c,k,e,d)..."): la envoltura donde casi todos los reproductores esconden la direccion.
function unpack(html) {
  var i = html.indexOf("eval(function(p,a,c,k,e");
  if (i < 0) return "";
  var m = /\}\('((?:[^'\\]|\\.)*)',\s*(\d+),\s*(\d+),\s*'((?:[^'\\]|\\.)*)'\.split\('\|'\)/.exec(html.slice(i));
  if (!m) return "";
  var p = m[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  var a = parseInt(m[2], 10), c = parseInt(m[3], 10), k = m[4].split("|");
  function enc(n) { return (n < a ? "" : enc(Math.floor(n / a))) + ((n = n % a) > 35 ? String.fromCharCode(n + 29) : n.toString(36)); }
  var dict = {};
  while (c--) dict[enc(c)] = k[c] || enc(c);
  return p.replace(/\b\w+\b/g, function (w) { return dict[w] != null ? dict[w] : w; });
}
// Direcciones relativas ("/stream/xx/master.m3u8") que muchos reproductores guardan en "hls2"/"hls4"/"file"/"source".
var M3U8_REL = /["'](\/(?!\/)[^"'\s<>\\]*?\.m3u8(?:\?[^"'\s<>\\]*)?)["']/;
function pick(text, base) {
  var m = M3U8.exec(text);
  if (m) return m[0];
  m = M3U8_REL.exec(text);
  if (m && base) return origin(base) + m[1];
  return "";
}
function findPlaylist(html, base) {
  var text = clean(html), hit = pick(text, base);
  if (hit) return hit;
  var packed = clean(unpack(text));
  hit = packed && pick(packed, base);
  if (hit) return hit;
  var re = /atob\(\s*["']([A-Za-z0-9+\/=_-]{16,})["']\s*\)/g, b;
  while ((b = re.exec(text))) {
    hit = pick(clean(b64decode(b[1])), base);
    if (hit) return hit;
  }
  return "";
}
// Pistas para el diagnostico cuando una pagina no suelta la lista: que trae y donde mirar.
function hints(html) {
  var t = String(html || ""), h = [];
  if (/eval\(function\(p,a,c,k,e/.test(t)) h.push("packer" + (unpack(t) ? " ok" : " NO-desempaca"));
  var n = (t.match(/\.m3u8/g) || []).length; if (n) h.push("m3u8x" + n);
  if (/atob\(/.test(t)) h.push("atob");
  if (/jwplayer|clappr|hls\.js|videojs|Playerjs/i.test(t)) h.push((/jwplayer|clappr|hls\.js|videojs|Playerjs/i.exec(t) || [""])[0]);
  var f = /(?:file|source|src|hls\d?|playlist)["']?\s*[:=]\s*["']([^"']{8,90})["']/i.exec(t); if (f) h.push("file=" + f[1]);
  var d = /document\.location\s*=\s*["']?([^"';\s]{0,80})/.exec(t); if (d) h.push("redir=" + d[1]);
  return h.join(" ");
}
function findIframes(html, base) {
  var out = [], re = /<iframe[^>]+src=["']([^"']+)["']/gi, m;
  while ((m = re.exec(html))) {
    var u = clean(m[1]).replace(/^\s+|\s+$/g, "");
    if (/^\/\//.test(u)) u = "https:" + u;
    else if (/^\//.test(u)) u = origin(base) + u;
    if (/^https:\/\//.test(u) && !AD_HOSTS.test(u) && out.indexOf(u) < 0) out.push(u);
  }
  return out;
}

// Abre la pagina con el Referer de la que la embebe; si no trae la lista pero si otro reproductor (iframe), lo sigue
// (dos niveles como mucho) con esta pagina como Referer. Cada paso deja una linea en TRACE para el diagnostico.
async function extract(url, referer, depth) {
  var r;
  try { r = await get(url, { "Referer": referer, "Sec-Fetch-Dest": "iframe" }, 8000); }
  catch (e) { trace(hostOf(url) + " fallo: " + String(e && e.message || e)); return null; }
  var host = hostOf(url), final = hostOf(r.url);
  var tag = host + (final && final !== host ? ">" + final : "") + " " + r.status + " " + r.text.length + "B";
  if (!r.ok) { trace(tag); return null; }
  var found = findPlaylist(r.text, r.url);
  if (found) { trace(tag + " m3u8 " + found.replace(/^https?:\/\//, "").slice(0, 110)); return { url: found, page: r.url }; }
  var frames = findIframes(r.text, r.url);
  if (frames.length && depth > 0) {
    trace(tag + " iframe " + frames.length);
    for (var i = 0; i < Math.min(frames.length, 3); i++) {
      var hit = await extract(frames[i], r.url, depth - 1);
      if (hit) return hit;
    }
    return null;
  }
  trace(tag + " nada [" + hints(r.text) + "] " + r.text.replace(/\s+/g, " ").slice(0, 60));
  return null;
}

// "ok" = lista HLS viva (o no se pudo revisar), "offline" = el servidor responde que no hay señal
async function verify(url, page) {
  try {
    var r = await get(url, { "Referer": origin(page) + "/", "Origin": origin(page) }, 4500);
    if (r.ok) { var good = /^#EXTM3U/.test(r.text.replace(/^\s+/, "")); trace("verify 200 " + (good ? "lista" : "no es lista: " + r.text.slice(0, 60))); return good ? "ok" : "offline"; }
    trace("verify " + r.status + (r.status === 0 ? " (sin lectura: se ofrece igual)" : ""));
    return r.status >= 400 ? "offline" : "ok";
  } catch (e) { trace("verify sin respuesta: " + String(e && e.message || e)); return "ok"; }
}

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  if (!isMine(tmdbId)) return []; // no es un canal de este plugin: no estorbar
  TRACE = [];
  trace("Lucha v" + VERSION);
  var jobs = SOURCES.map(function (s, idx) {
    return (async function () {
      try {
        var hit = await extract(s[1], REFERER, 2);
        if (!hit) return null;
        if ((await verify(hit.url, hit.page)) === "offline") { trace(s[0] + " sin señal"); return null; }
        return { order: idx, name: s[0], url: hit.url, page: hit.page };
      } catch (err) { trace(s[0] + " fallo: " + String(err && err.message || err)); return null; }
    })();
  });
  var found = (await Promise.all(jobs)).filter(Boolean).sort(function (a, b) { return a.order - b.order; });
  var results = [], seen = {};
  found.forEach(function (f) {
    if (seen[f.url]) return;
    seen[f.url] = true;
    var o = origin(f.page);
    results.push({ name: LABEL, title: f.name + " · " + hostOf(f.url), url: f.url, quality: "EN VIVO", headers: { "Referer": o + "/", "Origin": o, "User-Agent": UA } });
  });
  if (DEBUG) results.push({ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\n" + TRACE.join("\n"), headers: {} }); // con DEBUG sale siempre, aunque haya fuentes
  return results;
}

exports.getStreams = getStreams;
exports._findPlaylist = findPlaylist;
