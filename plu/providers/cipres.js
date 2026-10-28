/**
 * Ciprés - fuentes adicionales para canales en vivo
 * Se activa al abrir un canal del catálogo (id "cbl-<canal>") y devuelve las fuentes guardadas aquí abajo.
 * Si una fuente deja de funcionar, se cambia la URL en CHANNELS (o se agrega otra a la lista del canal).
 */
var DEBUG = true; // true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.4.0";
var LABEL = "Lat 1";
var PREFIX = "cbl-";

// canal del catalogo -> [[nombre a mostrar, [urls en orden de prioridad]], ...]
// cada url puede ser "url" (etiqueta EN VIVO) o ["url", "FHD" | "HD" | "SD"]
var CHANNELS = {
  "espn": [["ESPN", [
    ["http://181.119.215.61:8000/play/a05r/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a08p/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a04x/index.m3u8","HD"],
    ["http://181.119.185.32:8000/play/a004/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a09k/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a0ck/index.m3u8","FHD"],
    ["http://181.78.197.59:8000/play/a07z/index.m3u8","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN/ESPN.isml/ESPN.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a004/index.m3u8","FHD"],
    "http://190.102.120.20:8000/play/a04r/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a001/index.m3u8?hls"
  ]]],
  "espn-2": [["ESPN 2", [
    ["http://181.119.215.61:8000/play/a05s/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a07d/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a00u/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a06g/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05c/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a0cl/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0oj/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_2/ESPN_2.isml/ESPN_2.m3u8","FHD"],
    ["http://181.119.185.32:8000/play/a01w/index.m3u8?hls","FHD"]
  ]]],
  "espn-3": [["ESPN 3", [
    ["http://181.119.215.61:8000/play/a05t/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a07j/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a010/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a07g/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05d/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_3/ESPN_3.isml/ESPN_3.m3u8","FHD"],
    ["http://181.78.197.59:8000/play/a081/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0ps/index.m3u8?hls","FHD"]
  ]]],
  "espn-4": [["ESPN 4", [
    ["http://181.119.215.61:8000/play/a05x/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a07k/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a028/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a065/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0og/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0pz/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_4/ESPN_4.isml/ESPN_4.m3u8","FHD"]
  ]]],
  "espn-5": [["ESPN 5", [
    ["http://181.119.215.61:8000/play/a05y/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a03p/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a00v/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a078/index.m3u8?hls","FHD"],
    ["http://181.119.185.32:8000/play/a00n/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a06j/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a04y/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0pr/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_5/ESPN_5.isml/ESPN_5.m3u8","FHD"]
  ]]],
  "espn-6": [["ESPN 6", [
    ["http://181.119.215.61:8000/play/a05u/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a03n/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a00p/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a05p/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05e/index.m3u8?hls","FHD"],
    ["http://186.148.196.100:8000/play/a02q","FHD"],
    ["http://181.224.255.210:8001/play/a0eq/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_6/ESPN_6.isml/ESPN_6.m3u8","FHD"]
  ]]],
  "espn-7": [["ESPN 7", [
    ["http://181.78.0.107:8006/play/a080/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a05o/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a087/index.m3u8?hls","FHD"],
    ["http://205.235.6.29:8000/play/a0zv/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0p2/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0m5/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/ESPN_7/ESPN_7.isml/ESPN_7.m3u8","FHD"]
  ]]],
  "espn-premium": [["ESPN Premium", [
    ["http://181.78.0.107:8006/play/a05o/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a01b/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a07t/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0pt/index.m3u8?hls","FHD"],
    ["http://205.235.6.29:8000/play/a0wl/index.m3u8?hls","FHD"],
    ["http://181.119.84.106:8000/play/a0qw/index.m3u8","FHD"]
  ]]],
  "fox-sports": [["Fox Sports", [
    ["http://38.190.100.202:8000/play/a06n/index.m3u8","HD"],
    ["http://190.61.101.11:7050/play/a08t/index.m3u8?hls","FHD"],
    ["http://138.59.227.20:8000/play/a085/index.m3u8","FHD"],
    ["http://158.172.155.130:8000/play/a09x/index.m3u8","FHD"]
  ]]],
  "fox-sports-2": [["Fox Sports 2", [
    ["http://38.190.100.202:8000/play/a06o/index.m3u8","HD"],
    "http://190.61.101.11:7050/play/a08v/index.m3u8?hls"
  ]]],
  "fox-sports-3": [["Fox Sports 3", [

  ]]],
  "fox-sports-premium": [["Fox Sports Premium", [
    ["http://190.61.101.11:7050/play/a08u/index.m3u8?hls","FHD"]
  ]]],
  "fox": [["FOX", [
    "http://186.33.0.57:8000/play/a048/index.m3u8",
    "http://45.228.234.62:8000/play/a05i/index.m3u8",
    "http://45.5.116.228:8000/play/a05z/index.m3u8",
    "http://45.167.1.139:8000/play/a05u",
    "http://45.167.1.137:8000/play/a05u",
    "http://181.119.177.253:8000/play/a0cy/index.m3u8",
    "http://190.61.101.11:7050/play/a0a9/index.m3u8?hls",
    "http://186.33.0.57:8000/play/a069/index.m3u8",
    "http://190.61.101.11:7050/play/a0a4/index.m3u8?hls",
    "http://45.5.118.152:8000/play/a08x/index.m3u8",
    "http://190.61.101.11:7050/play/a0af/index.m3u8?hls",
    "https://live-manifest.production-public.tubi.io/live/13a764a8-a91d-4a17-a7f7-ee99250598b5/playlist.m3u8",
    "http://45.186.105.214:8000/play/a10f/index.m3u8",
    "http://181.78.192.238:8000/play/a2hg/index.m3u8",
    "http://181.78.192.238:8000/play/a2hu/index.m3u8",
    "https://b.tubi1.apollo.adrise.io/live/fox-2-j8fvmx.m3u8",
    "https://live-manifest.production-public.tubi.io/live/d906efca-1302-4e29-b0d9-9a1d7a305d69/playlist.m3u8"
  ]]],
  "dsports": [["DSports", [
    ["http://38.190.100.202:8000/play/a05n/index.m3u8","HD"],
    ["http://45.186.254.75:8000/play/a0en/index.m3u8","FHD"],
    ["http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/592036.ts","FHD"],
    ["http://vhdigital.cl/live/Limacolombia2025/E7sRFtAnv9/592036.ts","FHD"]
  ]]],
  "dsports-2": [["DSports 2", [
    ["http://38.190.100.202:8000/play/a05m/index.m3u8","HD"]
  ]]],
  "dsports-plus": [["DSports Plus", [
    ["http://38.190.100.202:8000/play/a09q/index.m3u8","HD"]
  ]]],
  "tudn": [["TUDN", [
    ["http://181.119.215.61:8000/play/a07v/index.m3u8","HD"],
    ["http://play.pelusa.online:8080/4SpexjF76RbM1/AW4m6zLkCqNt/31129","FHD"],
    ["http://181.119.177.253:8000/play/a0ds/index.m3u8","FHD"],
    ["http://179.60.224.196:8000/play/a0f4/index.m3u8","FHD"]
  ]]],
  "liga-1": [["Liga 1", [
    ["http://38.224.48.4:8000/play/a0y4/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0sb/index.m3u8?hls","FHD"],
    ["http://45.5.57.132:8000/play/a08a/index.m3u8","FHD"]
  ]]],
  "liga-1-max": [["Liga 1 MAX", [
    ["http://38.226.49.253:8000/play/a0g4/index.m3u8?hls","FHD"],
    ["http://186.148.196.100:8000/play/a030","FHD"],
    ["http://190.60.59.60:8000/play/a0sv/index.m3u8","FHD"],
    ["http://38.224.48.4:8000/play/a0x2/index.m3u8","FHD"]
  ]]],
  "sky-sports-la-liga": [["Sky Sports La Liga", [
    ["http://181.119.215.61:8000/play/a07q/index.m3u8","HD"],
    ["http://190.61.101.11:7050/play/a04g/index.m3u8?hls","FHD"],
    ["http://45.5.118.152:8000/play/a08f/index.m3u8","FHD"],
    ["http://181.119.177.253:8000/play/a0dz/index.m3u8","FHD"],
    ["http://186.148.184.22:8000/play/a0i6/index.m3u8","FHD"]
  ]]],
  "sky-sports-f1": [["Sky Sports F1", [

  ]]],
  "movistar-deportes": [["Movistar Deportes", [
    ["http://38.190.100.202:8000/play/a07i/index.m3u8","HD"],
    ["http://190.108.83.69:8000/play/a07o/index.m3u8","HD"],
    ["http://157.100.9.51:8000/play/a22s","HD"],
    ["http://205.235.6.29:8000/play/a0zd/index.m3u8?hls","HD"],
    ["http://38.199.5.160:8000/play/a0c9/index.m3u8","HD"],
    ["http://45.186.254.75:8000/play/a0es/index.m3u8","HD"],
    ["http://45.5.57.132:8000/play/a08b/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a0gf/index.m3u8?hls","HD"]
  ]]],
  "win-sports": [["Win Sports", [
    ["http://181.225.190.242:8000/play/a03r","FHD"]
  ]]],
  "win-sports-plus": [["Win Sports+", [
    ["http://186.148.184.22:8000/play/a0ih/index.m3u8","FHD"],
    ["http://181.78.21.38:8000/play/a07r/index.m3u8","FHD"]
  ]]],
  "tnt-sports": [["TNT Sports", [
    ["http://181.79.87.131:8000/play/a0e0/index.m3u8","HD"],
    ["http://205.235.6.29:8000/play/a0xa/index.m3u8?hls","HD"],
    ["http://181.78.79.131:8000/play/a0mo","HD"],
    ["http://181.119.185.32:8000/play/a00t/index.m3u8?hls","HD"]
  ]]],
  "tnt-sports-premium": [["TNT Sports Premium", [
    ["http://38.190.100.202:8000/play/a06q/index.m3u8","HD"],
    ["http://205.235.6.29:8000/play/a104/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0o9/index.m3u8?hls","FHD"],
    ["http://190.108.83.69:8000/play/a03i/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a06f/index.m3u8?hls","FHD"]
  ]]],
  "hbo": [["HBO", [
    ["http://181.119.215.61:8000/play/a0l2/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a04c/index.m3u8","HD"]
  ]]],
  "hbo-2": [["HBO 2", [
    ["http://181.119.215.61:8000/play/a00c/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a04d/index.m3u8","HD"],
    "http://181.119.185.32:8000/play/a01c/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a030/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a00i/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/Bantel_new/hbo2/chunks.m3u8",
    "http://15.204.246.24:8080/HBO2HD/index.m3u8",
    "http://tvsen7.aynascope.net/hbo2/index.m3u8"
  ]]],
  "hbo-family": [["HBO Family", [
    ["http://181.119.215.61:8000/play/a0l5/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a05p/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a04f/index.m3u8","HD"],
    ["http://45.171.64.30:6060/play/a00k/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0nv/index.m3u8?hls","FHD"]
  ]]],
  "hbo-plus": [["HBO Plus", [
    ["http://181.119.215.61:8000/play/a0l4/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a04e/index.m3u8","HD"]
  ]]],
  "hbo-pop": [["HBO Pop", [
    ["http://38.190.100.202:8000/play/a017/index.m3u8","HD"],
    ["http://181.224.255.210:8001/play/a0on/index.m3u8?hls","FHD"]
  ]]],
  "hbo-xtreme": [["HBO Xtreme", [
    ["http://181.119.215.61:8000/play/a0l6/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a089/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a01d/index.m3u8","HD"]
  ]]],
  "tnt": [["TNT", [
    ["http://38.190.100.202:8000/play/a020/index.m3u8","HD"],
    ["http://181.119.185.32:8000/play/a017/index.m3u8?hls","FHD"],
    ["http://45.171.64.30:6060/play/a03i/index.m3u8","FHD"]
  ]]],
  "cinemax": [["Cinemax", [
    ["http://38.226.49.253:8000/play/a0ax/index.m3u8?hls","FHD"],
    ["https://streaming.onnethn.com/CINEMAX/playlist.m3u8","FHD"]
  ]]],
  "space": [["Space", [
    ["http://181.119.215.61:8000/play/a0iz/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a026/index.m3u8","HD"],
    ["http://181.119.185.32:8000/play/a00d/index.m3u8?hls","FHD"],
    ["http://45.171.64.30:6060/play/a04n/index.m3u8","FHD"]
  ]]],
  "warner-channel": [["Warner Channel", [
    ["http://38.226.49.253:8000/play/a061/index.m3u8?hls","FHD"]
  ]]],
  "cinecanal": [["Cinecanal", [
    ["http://181.78.0.107:8006/play/a077/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a021/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a05z/index.m3u8?hls","FHD"],
    ["http://190.61.47.54:8000/play/a02z/index.m3u8","FHD"],
    ["https://barinaslive1.boldmss.com/CINECANAL/CINECANAL.isml/CINECANAL.m3u8","FHD"]
  ]]],
  "fx": [["FX", [
    ["http://181.119.215.61:8000/play/a0gw/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a079/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a029/index.m3u8","HD"],
    ["http://181.119.185.32:8000/play/a00a/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/FX/FX.isml/FX.m3u8","FHD"]
  ]]],
  "golden": [["Golden", [
    ["http://181.119.215.61:8000/play/a0jv/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a038/index.m3u8","HD"],
    ["http://181.224.255.210:8001/play/a0qv/index.m3u8?hls","FHD"],
    ["http://38.226.49.253:8000/play/a09m/index.m3u8?hls","FHD"],
    ["http://181.224.200.5:2277/play/a0do/index.m3u8","FHD"],
    ["http://168.196.127.137:6001/play/a06y/index.m3u8","FHD"]
  ]]],
  "golden-premier": [["Golden Premier", [
    ["http://38.190.100.202:8000/play/a046/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a047/index.m3u8","HD"],
    ["http://200.57.28.141:8540/play/a0lo","FHD"]
  ]]],
  "tooncast": [["Tooncast", [
    ["http://181.119.215.61:8000/play/a03k/index.m3u8","HD"],
    ["http://38.226.49.253:8000/play/a03u/index.m3u8?hls","FHD"],
    ["http://38.134.250.110:8000/play/a01t/index.m3u8","FHD"],
    ["https://streaming.onnethn.com/TOONCAST/playlist.m3u8","FHD"],
    ["http://190.61.42.218:9000/play/a06i/index.m3u8","FHD"]
  ]]],
  "adult-swim": [["Adult Swim", [
    ["http://181.119.215.61:8000/play/a05v/index.m3u8","HD"],
    ["http://181.78.0.107:8006/play/a0am/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a02s/index.m3u8","HD"]
  ]]],
  "bitme": [["bitMe", [
    ["https://cablered.iptvperu.tv:1936/cablered/bitme-srt_new/playlist.m3u8","FHD"],
    ["https://cablered.iptvperu.tv:1936/cablered/bitme_new/playlist.m3u8","FHD"]
  ]]],
  "azteca-uno": [["Azteca Uno", [
    ["http://play.pelusa.online:8080/4SpexjF76RbM1/AW4m6zLkCqNt/32663","FHD"],
    ["http://187.245.231.226:8000/play/a0uz/index.m3u8","FHD"]
  ]]],
  "nickelodeon": [["Nickelodeon", [
    ["http://181.119.215.61:8000/play/a0hs/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a05t/index.m3u8","HD"],
    ["https://barinaslive1.boldmss.com/NICK/NICK.isml/NICK.m3u8","FHD"],
    ["http://181.78.79.131:8000/play/a0qm","FHD"]
  ]]],
  "dzn": [["Dazn", [
    "http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/584993.ts",
    "http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/584996.ts",
    "http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/1328695.ts"
  ]]]
};

function slugFromId(id) {
  var s = String(id || "").toLowerCase(), i = s.indexOf(PREFIX);
  return i < 0 ? "" : s.slice(i + PREFIX.length);
}

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  var slug = slugFromId(tmdbId);
  var grupos = slug && CHANNELS[slug];
  if (!grupos) return []; // no es un canal de este plugin: no estorbar
  var results = [], seen = {};
  grupos.forEach(function (g) {
    g[1].forEach(function (item, n) {
      var url = typeof item === "string" ? item : item[0];
      var quality = typeof item === "string" ? "EN VIVO" : item[1];
      if (seen[url]) return;
      seen[url] = true;
      results.push({ name: LABEL, title: g[0] + " · Opción " + (n + 1), url: url, quality: quality, headers: {} });
    });
  });
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\nsin fuentes para " + slug + " (v" + VERSION + ")", headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._slug = slugFromId;
