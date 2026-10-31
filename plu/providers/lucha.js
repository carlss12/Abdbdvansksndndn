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
var DEBUG = 1; // 0: nunca muestra diagnostico | 1: solo aparece "DIAGNOSTICO" si no sale ninguna fuente | 2: siempre (para depurar)
var VERSION = "1.0.7";
var LABEL = "Lucha";
var PREFIX = "cbl-lucha";
var REFERER = "https://minhasdelicias.com/";
var UA = "Mozilla/5.0 (Linux; Android 13; moto g82 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

// [nombre a mostrar, pagina del reproductor]: para agregar otro, una linea mas.
var SOURCES = [
  ["Opción 1 · Blogger", "https://weye26.blogspot.com/p/f.html"],
  ["Opción 2 · VK Video", "https://live.vkvideo.ru/app/embed/noobcraftero"]
];
var AD_HOSTS = /aguadepez\.store|doubleclick|googlesyndication|google\.com|youtube\.com|facebook\.com/i;

var TRACE = [];
function trace(m) { TRACE.push(String(m).replace(/\s+/g, " ").slice(0, 420)); }

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
// Pelar capas: bloques enormes en base64 que al decodificarse dan otro base64 (a veces con unos caracteres basura al inicio).
function printable(s) {
  if (!s) return 0;
  var ok = 0;
  for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); if ((c >= 32 && c <= 126) || c === 10 || c === 13 || c === 9) ok++; }
  return ok / s.length;
}
function peel(blob, base) {
  var cur = String(blob || ""), layers = 0, hit = "";
  while (layers < 12) {
    var bestK = -1, bestScore = 0;
    for (var k = 0; k < 12; k++) {
      var sc = printable(b64decode(cur.slice(k, k + 240)));
      if (sc > bestScore) { bestScore = sc; bestK = k; }
    }
    if (bestScore < 0.9) break;
    cur = b64decode(cur.slice(bestK));
    layers++;
    hit = pick(clean(cur), base);
    if (hit) return { url: hit, layers: layers, last: cur };
  }
  return { url: "", layers: layers, last: cur };
}
function findPlaylist(html, base) {
  var text = clean(html), hit = pick(text, base);
  if (hit) return hit;
  var packed = clean(unpack(text));
  hit = packed && pick(packed, base);
  if (hit) return hit;
  var re = /["']([A-Za-z0-9+\/=_-]{40,})["']/g, b, n = 0;
  while ((b = re.exec(text)) && n++ < 60) {
    var dec = clean(b64decode(b[1]));
    hit = pick(dec, base) || pick(dec.split("").reverse().join(""), base);
    if (hit) return hit;
    var rev = clean(b64decode(b[1].split("").reverse().join("")));
    hit = pick(rev, base);
    if (hit) return hit;
    if (b[1].length >= 200) { var pr = peel(b[1], base); if (pr.url) return pr.url; }
  }
  return "";
}
// Pistas para el diagnostico cuando una pagina no suelta la lista: devuelve varias lineas cortas.
function vis(x) { return String(x || "").replace(/[^\x20-\x7e]/g, "·").replace(/\s+/g, " "); }
function hints(html) {
  var t = String(html || ""), h = [];
  var n = (t.match(/\.m3u8/g) || []).length; if (n) h.push("m3u8 x" + n);
  var pk = /jwplayer|clappr|hls\.js|videojs|Playerjs/i.exec(t); if (pk) h.push("player " + pk[0]);
  var bm = /[A-Za-z0-9+\/=_-]{200,}/.exec(t);
  var lastTxt = "";
  if (bm) {
    h.push("BLOB " + bm[0].length + " de " + t.length);
    var pr = peel(bm[0], null);
    lastTxt = pr.last;
    h.push("PELAR " + pr.layers + " capas, queda " + pr.last.length + "B printable " + Math.round(printable(pr.last.slice(0, 300)) * 100) + "%");
    h.push("INICIO{" + vis(pr.last.slice(0, 150)) + "}");
    h.push("FINAL{" + vis(pr.last.slice(-90)) + "}");
  }
  var k = /(?:hls|cmaf|dash|playlist|streamUrl|stream_url|manifest)\w{0,10}["']?\s*[:=]\s*["'](?:https?:)?\/[^"']{6,100}/i.exec(t); if (k) h.push("KEY{" + vis(k[0]) + "}");
  var hosts = [], re = /https?:\\?\/\\?\/([a-z0-9.-]+\.[a-z]{2,})/gi, m2;
  var tt = t + " " + lastTxt.slice(0, 60000); while ((m2 = re.exec(tt)) && hosts.length < 8) { var hh = m2[1].toLowerCase(); if (hosts.indexOf(hh) < 0 && !/w3\.org|schema\.org|ogp\.me|jsdelivr|googleapis/.test(hh)) hosts.push(hh); }
  if (hosts.length) h.push("HOSTS " + hosts.join(" "));
  return h;
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

// EXPERIMENTAL (sin probar): VK Live carga el stream por su API; se prueba con el nombre del canal (ultimo tramo del enlace).
async function vkApi(url) {
  var name = (/\/embed\/([^\/?#]+)/.exec(url) || [])[1];
  if (!name) return "";
  var cands = ["https://api.live.vkvideo.ru/v1/blog/" + name + "/public_video_stream", "https://api.live.vkvideo.ru/v1/blog/" + name + "/public_video_stream/data_for_player"];
  for (var i = 0; i < cands.length; i++) {
    try {
      var r = await get(cands[i], { "Referer": "https://live.vkvideo.ru/", "Origin": "https://live.vkvideo.ru", "Accept": "application/json" }, 6000);
      var hit = r.ok ? pick(clean(r.text), cands[i]) : "";
      trace("vkapi " + (i + 1) + " " + r.status + " " + r.text.length + "B " + (hit ? "m3u8 " + hit.replace(/^https?:\/\//, "").slice(0, 90) : "sin m3u8: " + vis(r.text).slice(0, 110)));
      if (hit) return hit;
    } catch (e) { trace("vkapi " + (i + 1) + " fallo: " + String(e && e.message || e)); }
  }
  return "";
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
  if (!found && /(^|\.)live\.vkvideo\.ru$/.test(host)) found = await vkApi(url); // experimental: la pagina de VK carga el video por su API
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
  trace(tag + " nada"); hints(r.text).forEach(function (x) { trace("  " + x); });
  return null;
}

// "ok" = lista HLS viva (o no se pudo revisar), "offline" = el servidor responde que no hay señal
async function verify(url, page) {
  try {
    var r = await get(url, { "Referer": origin(page) + "/", "Origin": origin(page) }, 4500);
    if (r.ok) { var good = /^#EXTM3U/.test(r.text.replace(/^\s+/, "")); trace("verify 200 " + (good ? "lista" : "no es lista: " + r.text.slice(0, 60))); return good ? "ok" : "offline"; }
    trace("verify " + r.status + (r.status === 0 ? " (sin respuesta real: no se ofrece)" : ""));
    return (r.status >= 400 || r.status === 0) ? "offline" : "ok";
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
  if (DEBUG === 2 || (DEBUG && !results.length)) results.push({ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\n" + TRACE.join("\n"), headers: {} }); // con DEBUG = 2 sale siempre
  return results;
}

exports.getStreams = getStreams;
exports._findPlaylist = findPlaylist;
