/**
 * Berilo - partidos de la agenda
 * Se activa al abrir un partido del catalogo "Agenda" (id "kitsu:cbl-ag-<id>").
 * Pide la agenda desde el celular, toma las opciones del partido (canal normal, OP2, OP3, HD; sin Disney+)
 * y resuelve cada una con el reproductor de la pagina. El token del m3u8 se pide desde la misma IP que reproduce.
 */
// El motor de plugins de Nuvio en la TV no tiene setTimeout/clearTimeout: sin esto todo falla con "setTimeout is not defined".
if (typeof globalThis.setTimeout !== "function") {
  globalThis.setTimeout = function () { return 1; };
  globalThis.clearTimeout = function () {};
}
var DEBUG = true; // true: si el partido se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.0.0";
var LABEL = "Agenda";
var PREFIX = "cbl-ag-";
var AGENDA_URL = "https://api.wqxag.com/diaries.json";
var UA = "Mozilla/5.0 (Linux; Android 13; moto g82 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
var TRACE = [];
function trace(m) { TRACE.push(String(m).replace(/\s+/g, " ").slice(0, 160)); }

function diaryIdFromId(id) {
  var t = String(id || "").toLowerCase(), i = t.indexOf(PREFIX);
  if (i < 0) return "";
  var n = t.slice(i + PREFIX.length);
  return /^\d+$/.test(n) ? n : "";
}

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
// "/embed/eventos.html?r=<base64 de la url del reproductor>" -> url del reproductor
function playerUrl(iframe) {
  var m = /[?&]r=([^&]+)/.exec(String(iframe || ""));
  if (!m) return "";
  var q = m[1];
  try { q = decodeURIComponent(q); } catch (e) { /* ya viene limpio */ }
  var u = b64decode(q);
  return /^https?:\/\//.test(u) ? u : "";
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
  return { status: r.status, ok: r.ok, text: text };
}
function unslash(s) { return String(s).replace(/\\\//g, "/"); }
function origin(u) { var m = /^(https?:\/\/[^\/]+)/.exec(u); return m ? m[1] : ""; }

// ---------- resolver una pagina de reproductor ----------
// Busca la lista HLS en la pagina: playbackURL (tvf90), "src" (la18hd) o cualquier .m3u8; si solo hay un iframe, lo sigue una vez.
function findStream(text) {
  var m = /playbackURL\s*=\s*["']([^"']+)["']/.exec(text);
  if (m) return unslash(m[1]);
  m = /["'](?:src|source|file|url)["']?\s*[:=]\s*["'](https?:[^"']+\.m3u8[^"']*)["']/.exec(text);
  if (m) return unslash(m[1]);
  m = /(https?:\\?\/\\?\/[^"'\s\\<>]+(?:\\\/[^"'\s<>]*)*\.m3u8[^"'\s<>]*)/.exec(text);
  if (m) return unslash(m[1]);
  return "";
}
function findIframe(text, base) {
  var m = /<iframe[^>]+src=["']([^"']+)["']/i.exec(text) || /"src"\s*:\s*"(https?:[^"]+)"/.exec(text);
  if (!m) return "";
  var u = unslash(m[1]);
  if (/^\/\//.test(u)) return "https:" + u;
  if (/^\//.test(u)) return origin(base) + u;
  return /^https?:/.test(u) ? u : "";
}
async function resolve(url, depth) {
  var r = await get(url, { "Referer": origin(url) + "/" }, 8000);
  var host = origin(url).replace(/^https?:\/\//, "");
  if (!r.ok) { trace(host + " " + r.status); return ""; }
  var s = findStream(r.text);
  if (s) { trace(host + " ok"); return s; }
  var next = depth < 1 ? findIframe(r.text, url) : "";
  if (next) { trace(host + " -> iframe"); return resolve(next, depth + 1); }
  trace(host + " sin url");
  return "";
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

// ---------- opciones del partido ----------
function isDisney(name, url) { return /disney/i.test(String(name) + " " + String(url)); }
function cleanName(n) { return String(n || "").replace(/\s+/g, " ").trim(); }
function qualityOf(n) { return "HD"; }

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  var did = diaryIdFromId(tmdbId);
  if (!did) return []; // no es un partido de este plugin: no estorbar
  TRACE = [];
  trace("Berilo v" + VERSION + " | partido " + did);
  var game = null;
  try {
    var r = await get(AGENDA_URL, { "Accept": "application/json" }, 9000);
    var data = r.ok ? JSON.parse(r.text).data || [] : [];
    trace("agenda " + r.status + " (" + data.length + " partidos)");
    for (var i = 0; i < data.length; i++) if (String(data[i].id) === did) { game = data[i]; break; }
  } catch (e) { trace("agenda fallo: " + String(e && e.message || e)); }
  if (!game) return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\npartido no encontrado en la agenda\n" + TRACE.join("\n"), headers: {} }] : [];

  var embeds = (game.attributes.embeds && game.attributes.embeds.data) || [];
  var jobs = [];
  if (!embeds.length) trace("el partido no trae opciones");
  embeds.forEach(function (e, idx) {
    var name = cleanName(e.attributes.embed_name), purl = playerUrl(e.attributes.embed_iframe);
    if (!purl || isDisney(name, purl)) return; // sin Disney+
    jobs.push((async function () {
      try {
        var url = await resolve(purl, 0);
        if (!url) return null;
        if ((await verify(url)) === "offline") { trace(name + " sin señal"); return null; }
        return { order: idx, name: name, url: url };
      } catch (err) { trace(name + " fallo: " + String(err && err.message || err)); return null; }
    })());
  });
  if (embeds.length && !jobs.length) trace("sin opciones validas (solo Disney+ o enlaces ilegibles)");
  var found = (await Promise.all(jobs)).filter(Boolean).sort(function (a, b) { return a.order - b.order; });
  var results = [], seen = {};
  found.forEach(function (f) {
    if (seen[f.url]) return;
    seen[f.url] = true;
    results.push({ name: LABEL, title: f.name, url: f.url, quality: qualityOf(f.name), headers: {} });
  });
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\n" + TRACE.join("\n"), headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._playerUrl = playerUrl;
exports._diaryId = diaryIdFromId;
exports._findStream = findStream;
