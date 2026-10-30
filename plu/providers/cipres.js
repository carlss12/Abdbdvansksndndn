/**
 * Ciprés - fuentes adicionales para canales en vivo
 * Se activa al abrir un canal del catálogo (id "cbl-<canal>") y devuelve las fuentes guardadas aquí abajo.
 * Si una fuente deja de funcionar, se cambia la URL en CHANNELS (o se agrega otra a la lista del canal).
 */
var DEBUG = true; // true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.8.0";
var LABEL = "Lat 1";
var PREFIX = "cbl-";

// canal del catalogo -> [[nombre a mostrar, [urls en orden de prioridad]], ...]
// cada url puede ser "url" (etiqueta EN VIVO) o ["url", "FHD" | "HD" | "SD"]
var CHANNELS = {
  "espn": [["ESPN", [
    ["https://barinaslive1.boldmss.com/ESPN/ESPN.isml/ESPN.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a004/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05r/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a08p/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a04x/index.m3u8","FHD"],
    ["http://181.119.185.32:8000/play/a004/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a09k/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a0ck/index.m3u8","FHD"],
    ["http://181.78.197.59:8000/play/a07z/index.m3u8","FHD"]
  ]]],
  "espn-2": [["ESPN 2", [
    ["https://barinaslive1.boldmss.com/ESPN_2/ESPN_2.isml/ESPN_2.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a005/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05s/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a07d/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a00u/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a06g/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05c/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a0cl/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0oj/index.m3u8?hls","FHD"],
    ["http://181.119.185.32:8000/play/a01w/index.m3u8?hls","FHD"]
  ]]],
  "espn-3": [["ESPN 3", [
    ["https://barinaslive1.boldmss.com/ESPN_3/ESPN_3.isml/ESPN_3.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a02u/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05t/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a07j/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a010/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a07g/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05d/index.m3u8?hls","FHD"],
    ["http://181.78.197.59:8000/play/a081/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0ps/index.m3u8?hls","FHD"]
  ]]],
  "espn-4": [["ESPN 4", [
    ["https://barinaslive1.boldmss.com/ESPN_4/ESPN_4.isml/ESPN_4.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a02v/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05x/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a07k/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a028/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a065/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0og/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0pz/index.m3u8?hls","FHD"]
  ]]],
  "espn-5": [["ESPN 5", [
    ["https://barinaslive1.boldmss.com/ESPN_5/ESPN_5.isml/ESPN_5.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a00a/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05y/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a03p/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a00v/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a078/index.m3u8?hls","FHD"],
    ["http://181.119.185.32:8000/play/a00n/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a06j/index.m3u8?hls","FHD"],
    ["http://181.119.177.253:8000/play/a04y/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0pr/index.m3u8?hls","FHD"]
  ]]],
  "espn-6": [["ESPN 6", [
    ["https://barinaslive1.boldmss.com/ESPN_6/ESPN_6.isml/ESPN_6.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a00b/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a05u/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a03n/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a00p/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a05p/index.m3u8?hls","FHD"],
    ["http://190.61.101.11:7050/play/a05e/index.m3u8?hls","FHD"],
    ["http://186.148.196.100:8000/play/a02q","FHD"],
    ["http://181.224.255.210:8001/play/a0eq/index.m3u8?hls","FHD"]
  ]]],
  "espn-7": [["ESPN 7", [
    ["https://barinaslive1.boldmss.com/ESPN_7/ESPN_7.isml/ESPN_7.m3u8","FHD"],
    ["http://190.61.47.54:8000/play/a033/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a080/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a05o/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a087/index.m3u8?hls","FHD"],
    ["http://205.235.6.29:8000/play/a0zv/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0p2/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0m5/index.m3u8?hls","FHD"]
  ]]],
  "espn-premium": [["ESPN Premium", [
    ["http://181.78.0.107:8006/play/a05o/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a01b/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a07t/index.m3u8?hls","FHD"],
    ["http://181.224.255.210:8001/play/a0pt/index.m3u8?hls","FHD"],
    ["http://205.235.6.29:8000/play/a0wl/index.m3u8?hls","FHD"],
    ["http://181.119.84.106:8000/play/a0qw/index.m3u8","FHD"]
  ]]],
  "fox-sports": [["Fox Sports", [
    ["http://38.190.100.202:8000/play/a06n/index.m3u8","FHD"],
    ["http://190.61.101.11:7050/play/a08t/index.m3u8?hls","FHD"],
    ["http://138.59.227.20:8000/play/a085/index.m3u8","FHD"],
    ["http://158.172.155.130:8000/play/a09x/index.m3u8","FHD"]
  ]]],
  "fox-sports-2": [["Fox Sports 2", [
    ["http://38.190.100.202:8000/play/a06o/index.m3u8","FHD"],
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
    ["http://38.190.100.202:8000/play/a05n/index.m3u8","FHD"],
    ["http://45.186.254.75:8000/play/a0en/index.m3u8","FHD"],
    ["http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/592036.ts","FHD"],
    ["http://vhdigital.cl/live/Limacolombia2025/E7sRFtAnv9/592036.ts","FHD"]
  ]]],
  "dsports-2": [["DSports 2", [
    ["http://38.190.100.202:8000/play/a05m/index.m3u8","FHD"]
  ]]],
  "dsports-plus": [["DSports Plus", [
    ["http://38.190.100.202:8000/play/a09q/index.m3u8","FHD"]
  ]]],
  "tudn": [["TUDN", [
    ["http://181.119.215.61:8000/play/a07v/index.m3u8","FHD"],
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
    ["http://181.119.215.61:8000/play/a07q/index.m3u8","FHD"],
    ["http://190.61.101.11:7050/play/a04g/index.m3u8?hls","FHD"],
    ["http://45.5.118.152:8000/play/a08f/index.m3u8","FHD"],
    ["http://181.119.177.253:8000/play/a0dz/index.m3u8","FHD"],
    ["http://186.148.184.22:8000/play/a0i6/index.m3u8","FHD"]
  ]]],
  "sky-sports-f1": [["Sky Sports F1", [

  ]]],
  "movistar-deportes": [["Movistar Deportes", [
    ["http://38.190.100.202:8000/play/a07i/index.m3u8","FHD"],
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
    ["http://38.190.100.202:8000/play/a06q/index.m3u8","FHD"],
    ["http://205.235.6.29:8000/play/a104/index.m3u8?hls","FHD"],
    ["http://200.59.191.177:8000/play/a0o9/index.m3u8?hls","FHD"],
    ["http://190.108.83.69:8000/play/a03i/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a06f/index.m3u8?hls","FHD"]
  ]]],
  "hbo": [["HBO", [
    ["http://181.119.215.61:8000/play/a0l2/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a04c/index.m3u8","FHD"]
  ]]],
  "hbo-2": [["HBO 2", [
    ["http://181.119.215.61:8000/play/a00c/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a04d/index.m3u8","FHD"],
    "http://181.119.185.32:8000/play/a01c/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a030/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a00i/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/Bantel_new/hbo2/chunks.m3u8",
    "http://15.204.246.24:8080/HBO2HD/index.m3u8",
    "http://tvsen7.aynascope.net/hbo2/index.m3u8"
  ]]],
  "hbo-family": [["HBO Family", [
    ["http://181.119.215.61:8000/play/a0l5/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a05p/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a04f/index.m3u8","FHD"],
    ["http://45.171.64.30:6060/play/a00k/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0nv/index.m3u8?hls","FHD"]
  ]]],
  "hbo-plus": [["HBO Plus", [
    ["http://181.119.215.61:8000/play/a0l4/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a04e/index.m3u8","FHD"]
  ]]],
  "hbo-pop": [["HBO Pop", [
    ["http://38.190.100.202:8000/play/a017/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0on/index.m3u8?hls","FHD"]
  ]]],
  "hbo-xtreme": [["HBO Xtreme", [
    ["http://181.119.215.61:8000/play/a0l6/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a089/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a01d/index.m3u8","FHD"]
  ]]],
  "tnt": [["TNT", [
    ["http://190.61.47.54:8000/play/a01s/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a020/index.m3u8","FHD"],
    ["http://181.119.185.32:8000/play/a017/index.m3u8?hls","FHD"],
    ["http://45.171.64.30:6060/play/a03i/index.m3u8","FHD"]
  ]]],
  "cinemax": [["Cinemax", [
    ["http://38.226.49.253:8000/play/a0ax/index.m3u8?hls","FHD"],
    ["https://streaming.onnethn.com/CINEMAX/playlist.m3u8","FHD"]
  ]]],
  "space": [["Space", [
    ["http://190.61.47.54:8000/play/a020/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a0iz/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a026/index.m3u8","FHD"],
    ["http://181.119.185.32:8000/play/a00d/index.m3u8?hls","FHD"],
    ["http://45.171.64.30:6060/play/a04n/index.m3u8","FHD"]
  ]]],
  "warner-channel": [["Warner Channel", [
    ["http://190.61.47.54:8000/play/a02s/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a061/index.m3u8?hls","FHD"]
  ]]],
  "cinecanal": [["Cinecanal", [
    ["http://190.61.47.54:8000/play/a02z/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a077/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a021/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a05z/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/CINECANAL/CINECANAL.isml/CINECANAL.m3u8","FHD"]
  ]]],
  "fx": [["FX", [
    ["http://190.61.47.54:8000/play/a030/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a0gw/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a079/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a029/index.m3u8","FHD"],
    ["http://181.119.185.32:8000/play/a00a/index.m3u8?hls","FHD"],
    ["https://barinaslive1.boldmss.com/FX/FX.isml/FX.m3u8","FHD"]
  ]]],
  "golden": [["Golden", [
    ["http://190.61.47.54:8000/play/a00j/index.m3u8","FHD"],
    ["http://181.119.215.61:8000/play/a0jv/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a038/index.m3u8","FHD"],
    ["http://181.224.255.210:8001/play/a0qv/index.m3u8?hls","FHD"],
    ["http://38.226.49.253:8000/play/a09m/index.m3u8?hls","FHD"],
    ["http://181.224.200.5:2277/play/a0do/index.m3u8","FHD"],
    ["http://168.196.127.137:6001/play/a06y/index.m3u8","FHD"]
  ]]],
  "golden-premier": [["Golden Premier", [
    ["http://38.190.100.202:8000/play/a046/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a047/index.m3u8","FHD"],
    ["http://200.57.28.141:8540/play/a0lo","FHD"]
  ]]],
  "tooncast": [["Tooncast", [
    ["http://181.119.215.61:8000/play/a03k/index.m3u8","FHD"],
    ["http://38.226.49.253:8000/play/a03u/index.m3u8?hls","FHD"],
    ["http://38.134.250.110:8000/play/a01t/index.m3u8","FHD"],
    ["https://streaming.onnethn.com/TOONCAST/playlist.m3u8","FHD"],
    ["http://190.61.42.218:9000/play/a06i/index.m3u8","FHD"]
  ]]],
  "adult-swim": [["Adult Swim", [
    ["http://181.119.215.61:8000/play/a05v/index.m3u8","FHD"],
    ["http://181.78.0.107:8006/play/a0am/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a02s/index.m3u8","FHD"]
  ]]],
  "bitme": [["bitMe", [
    ["http://190.61.47.54:8000/play/a027/index.m3u8","FHD"],
    ["https://cablered.iptvperu.tv:1936/cablered/bitme-srt_new/playlist.m3u8","FHD"],
    ["https://cablered.iptvperu.tv:1936/cablered/bitme_new/playlist.m3u8","FHD"]
  ]]],
  "azteca-uno": [["Azteca Uno", [
    ["http://play.pelusa.online:8080/4SpexjF76RbM1/AW4m6zLkCqNt/32663","FHD"],
    ["http://187.245.231.226:8000/play/a0uz/index.m3u8","FHD"]
  ]]],
  "nickelodeon": [["Nickelodeon", [
    ["http://181.119.215.61:8000/play/a0hs/index.m3u8","FHD"],
    ["http://38.190.100.202:8000/play/a05t/index.m3u8","FHD"],
    ["http://181.78.79.131:8000/play/a0qm","FHD"],
    ["https://barinaslive1.boldmss.com/NICK/NICK.isml/NICK.m3u8","FHD"]
  ]]],
  "simpson-24-7": [["Simpson 24/7", [
    ["https://live20.bozztv.com/akamaissh101/ssh101/simptestnews/chunks.m3u8","EN VIVO"]
  ]]],
  "south-park": [["South Park", [
    ["https://jmp2.uk/plu-609ae5cd48d3200007b0a98e.m3u8","HD"]
  ]]],
  "hey-arnold": [["Hey Arnold!", [
    ["https://jmp2.uk/plu-66c79221b1a34600087e264d.m3u8","HD"]
  ]]],
  "avatar-aang": [["Avatar: La Leyenda de Aang", [
    ["https://jmp2.uk/plu-6759ee82bd523200083b4f0f.m3u8","HD"]
  ]]],
  "naruto": [["Naruto", [
    ["https://jmp2.uk/plu-5ee92e72fb286e0007285fec.m3u8","HD"]
  ]]],
  "naruto-shippuden": [["Naruto Shippuden", [
    ["https://jmp2.uk/plu-64c92fea3c3344000869e8a9.m3u8","HD"]
  ]]],
  "one-piece": [["One Piece", [
    ["https://jmp2.uk/plu-5ff4b9ccf938f8000779eb99.m3u8","HD"]
  ]]],
  "inuyasha": [["Inuyasha", [
    ["https://jmp2.uk/plu-66b26665d512590008c507b7.m3u8","HD"]
  ]]],
  "hunter-x-hunter": [["Hunter x Hunter", [
    ["https://jmp2.uk/plu-65d916a2f7f0af0008b6540d.m3u8","HD"]
  ]]],
  "jojo": [["JoJo's Bizarre Adventure", [
    ["https://jmp2.uk/plu-66c790f780a0af0008583aa4.m3u8","HD"]
  ]]],
  "death-note": [["Death Note", [
    ["https://jmp2.uk/plu-626c2ed933a2890007e91422.m3u8","HD"]
  ]]],
  "south-park-cartman": [["South Park: Colección Cartman", [
    ["https://jmp2.uk/plu-65df731cec9fda0008b7aa8d.m3u8","HD"]
  ]]],
  "south-park-stan": [["South Park: Colección Stan", [
    ["https://jmp2.uk/plu-65df72db18036500081a8292.m3u8","HD"]
  ]]],
  "captain-tsubasa": [["Captain Tsubasa", [
    ["https://jmp2.uk/plu-64666345f3f5b1000882bfb4.m3u8","HD"]
  ]]],
  "comedy-central": [["Comedy Central Pluto TV", [
    ["https://jmp2.uk/plu-5ffcc21a432945000762d06b.m3u8","HD"]
  ]]],
  "daria": [["Daria", [
    ["https://jmp2.uk/plu-62d0895ebe7a970008785244.m3u8","HD"]
  ]]],
  "hechiceras": [["Hechiceras", [
    ["https://jmp2.uk/plu-67f95fa76b11614ab0caaef3.m3u8","HD"]
  ]]],
  "tortugas-ninja": [["Las Tortugas Ninja", [
    ["https://jmp2.uk/plu-63dd5d7a4e83e700088fbca8.m3u8","HD"]
  ]]],
  "padrinos-magicos": [["Los Padrinos Mágicos", [
    ["https://jmp2.uk/plu-6322099c822bbc00074857db.m3u8","HD"]
  ]]],
  "los-pitufos": [["Los Pitufos", [
    ["https://jmp2.uk/plu-68a3a97fd8f7693ae3f8575f.m3u8","HD"]
  ]]],
  "nickelodeon-clasico": [["Nickelodeon Clásico", [
    ["https://jmp2.uk/plu-6824cda00101510f9eeaa011.m3u8","HD"]
  ]]],
  "nickelodeon-icarly": [["Nickelodeon iCarly", [
    ["https://jmp2.uk/plu-620ff0a01f9e8700076c6f9d.m3u8","HD"]
  ]]],
  "nickelodeon-teen": [["Nickelodeon Teen", [
    ["https://jmp2.uk/plu-5fab09a8749b1a00077d35d2.m3u8","HD"]
  ]]],
  "nickelodeon-toons": [["Nickelodeon Toons", [
    ["https://jmp2.uk/plu-645952687cb4b100084ed52e.m3u8","HD"]
  ]]],
  "rugrats": [["Rugrats", [
    ["https://jmp2.uk/plu-5ea7215005d66d0007e8128a.m3u8","HD"]
  ]]],
  "pokemon": [["Pokémon", [
    ["https://jmp2.uk/plu-6870072ca9d5c45c3e9466f1.m3u8","HD"]
  ]]],
  "bob-esponja": [["Bob Esponja Pantalones Cuadrados", [
    ["https://jmp2.uk/plu-6254598f5083f800076d8563.m3u8","HD"]
  ]]],
  "boruto": [["Boruto: Naruto Next Generations", [
    ["https://jmp2.uk/plu-656f37f257fe4a000884dfee.m3u8","HD"]
  ]]],
  "familia-del-barrio": [["La Familia del Barrio", [
    ["https://jmp2.uk/plu-62d08af527ce19000731eaa0.m3u8","HD"]
  ]]],
  "azteca-deportes-premium": [["Azteca Deportes Premium", [
    ["https://jmp2.uk/plu-65cf60d166eec80008724e6f.m3u8","HD"]
  ]]],
  "azteca-deportes-premium": [["Azteca Deportes Premium", [
    ["https://jmp2.uk/plu-65cf60d166eec80008724e6f.m3u8","HD"]
  ]]],
  "azcorazon": [["Azcorazón", [
    ["http://38.190.100.202:8000/play/a04i/index.m3u8","HD"]
  ]]],
  "pasiones": [["Pasiones", [
    ["http://38.190.100.202:8000/play/a04y/index.m3u8","HD"]
  ]]],
  "universal-cinema": [["Universal Cinema", [
    ["http://38.190.100.202:8000/play/a04z/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0kt/index.m3u8","HD"]
  ]]],
  "universal-comedy": [["Universal Comedy", [
    ["http://38.190.100.202:8000/play/a04s/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0i5/index.m3u8","HD"],
    ["http://45.171.64.30:6060/play/a03t/index.m3u8","HD"]
  ]]],
  "universal-crime": [["Universal Crime", [
    ["http://38.190.100.202:8000/play/a05s/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0i4/index.m3u8","HD"],
    ["http://45.171.64.30:6060/play/a03s/index.m3u8","HD"]
  ]]],
  "universal-premiere": [["Universal Premiere", [
    ["http://38.190.100.202:8000/play/a04p/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0i1/index.m3u8","HD"],
    ["http://45.171.64.30:6060/play/a03p/index.m3u8","HD"]
  ]]],
  "universal-reality": [["Universal Reality", [
    ["http://38.190.100.202:8000/play/a04r/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0i3/index.m3u8","HD"],
    ["http://45.171.64.30:6060/play/a03r/index.m3u8","HD"]
  ]]],
  "tnt-series": [["TNT Series", [
    ["http://190.61.47.54:8000/play/a021/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0km/index.m3u8","HD"]
  ]]],
  "cartoon-network": [["Cartoon Network", [
    ["http://190.61.47.54:8000/play/a01z/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a06i/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0l0/index.m3u8","HD"]
  ]]],
  "cartoonito": [["Cartoonito", [
    ["http://190.61.47.54:8000/play/a02c/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a052/index.m3u8","HD"]
  ]]],
  "comedy-central-hd": [["Comedy Central", [
    ["http://38.190.100.202:8000/play/a00r/index.m3u8","HD"]
  ]]],
  "disney-jr": [["Disney Jr", [
    ["http://190.61.47.54:8000/play/a03h/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a02h/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0g1/index.m3u8","HD"]
  ]]],
  "disney-channel": [["Disney Channel", [
    ["http://190.61.47.54:8000/play/a031/index.m3u8","HD"],
    ["http://38.190.100.202:8000/play/a027/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a0i8/index.m3u8","HD"]
  ]]],
  "dreamworks": [["DreamWorks", [
    ["http://190.61.47.54:8000/play/a041/index.m3u8","HD"]
  ]]],
  "telehit-latino": [["Telehit Latino", [
    ["http://190.61.47.54:8000/play/a029/index.m3u8","HD"]
  ]]],
  "las-estrellas": [["Las Estrellas", [
    ["http://190.61.47.54:8000/play/a022/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a07t/index.m3u8","HD"]
  ]]],
  "golden-edge": [["Golden Edge", [
    ["http://190.61.47.54:8000/play/a025/index.m3u8","HD"]
  ]]],
  "claro-sports-1": [["Claro Sports 1", [
    ["http://38.190.100.202:8000/play/a082/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a07o/index.m3u8","HD"]
  ]]],
  "claro-sports-2": [["Claro Sports 2", [
    ["http://38.190.100.202:8000/play/a083/index.m3u8","HD"],
    ["http://181.119.215.61:8000/play/a07p/index.m3u8","HD"]
  ]]],
  "claro-sports-3": [["Claro Sports 3", [
    ["http://181.119.215.61:8000/play/a07i/index.m3u8","HD"]
  ]]],
  "canal-6": [["Canal 6 CDMX", [
    ["https://mdstrm.com/live-stream-playlist/5f2d9d6ff17144074bd8a284.m3u8","HD"]
  ]], ["Canal 6 MTY", [
    ["https://mdstrm.com/live-stream-playlist/57b4dbf5dbbfc8f16bb63ce1.m3u8","HD"]
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

// ---------- partidos de la agenda (ids "cbl-ag-<id>") ----------
// Toma los canales de cada opcion del partido (el "stream=" del reproductor de futbol libre) y, si Cipres tiene ese canal, da sus fuentes.
var AGENDA_URL = "https://api.wqxag.com/diaries.json";
// id del canal en futbol libre -> canal de arriba, cuando el nombre no es igual (los que coinciden sin guiones, como espn4 = espn-4, no hacen falta)
var AGENDA_ALIAS = {
  espnmx: "espn", espn2mx: "espn-2", espn3mx: "espn-3", espn4mx: "espn-4",
  foxsportsmx: "fox-sports", foxsports2mx: "fox-sports-2", foxsports3mx: "fox-sports-3",
  tudnmx: "tudn", tudn_mx: "tudn", winsports: "win-sports", winsports2: "win-sports-plus", winsportsplus: "win-sports-plus",
  directvsports: "dsports", directvsports2: "dsports-2", directvsportsplus: "dsports-plus",
  dsportsplus: "dsports-plus", liga1max: "liga-1-max", skysportsf1: "sky-sports-f1"
};
var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64decode(t) {
  t = String(t || "").replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+\/]/g, "");
  var out = "", bits = 0, acc = 0;
  for (var i = 0; i < t.length; i++) {
    acc = (acc << 6) | B64.indexOf(t.charAt(i));
    bits += 6;
    if (bits >= 8) { bits -= 8; out += String.fromCharCode((acc >> bits) & 255); acc &= (1 << bits) - 1; }
  }
  return out;
}
function agendaStreamId(iframe) {
  var m = /[?&]r=([^&]+)/.exec(String(iframe || ""));
  if (!m) return "";
  var q = m[1];
  try { q = decodeURIComponent(q); } catch (e) { /* ya viene limpio */ }
  var u = b64decode(q), k = /[?&]stream=([^&#]+)/.exec(u);
  return k && !/disney/i.test(u) ? k[1].toLowerCase() : "";
}
function slugForStreamId(sid) {
  if (AGENDA_ALIAS[sid] && CHANNELS[AGENDA_ALIAS[sid]]) return AGENDA_ALIAS[sid];
  var flat = sid.replace(/[^a-z0-9]/g, "");
  for (var slug in CHANNELS) if (slug.replace(/[^a-z0-9]/g, "") === flat) return slug;
  return "";
}
function sourcesFor(slug, seen, results) {
  (CHANNELS[slug] || []).forEach(function (g) {
    g[1].forEach(function (item, n) {
      var url = typeof item === "string" ? item : item[0];
      var quality = typeof item === "string" ? "EN VIVO" : item[1];
      if (seen[url]) return;
      seen[url] = true;
      results.push({ name: LABEL, title: g[0] + " · Opción " + (n + 1), url: url, quality: quality, headers: {} });
    });
  });
}
async function agendaStreams(diaryId) {
  var game = null;
  try {
    var r = await fetch(AGENDA_URL, { headers: { "Accept": "application/json" } });
    var data = r.ok ? JSON.parse(await r.text()).data || [] : [];
    for (var i = 0; i < data.length; i++) if (String(data[i].id) === diaryId) { game = data[i]; break; }
  } catch (e) { /* sin agenda: sin fuentes */ }
  if (!game) return [];
  var embeds = (game.attributes.embeds && game.attributes.embeds.data) || [];
  var slugs = [], results = [], seen = {};
  embeds.forEach(function (e) {
    var sid = agendaStreamId(e.attributes.embed_iframe), slug = sid && slugForStreamId(sid);
    if (slug && slugs.indexOf(slug) < 0) slugs.push(slug);
  });
  slugs.forEach(function (slug) { sourcesFor(slug, seen, results); });
  return results; // si Cipres no tiene ninguno de esos canales, no estorba (sin diagnostico)
}

async function getStreams(tmdbId, type, season, episode) {
  if (type !== "tv" || !tmdbId) return [];
  var slug = slugFromId(tmdbId);
  var ag = /^ag-(\d+)$/.exec(slug);
  if (ag) return agendaStreams(ag[1]);
  var grupos = slug && CHANNELS[slug];
  if (!grupos) return []; // no es un canal de este plugin: no estorbar
  var results = [], seen = {};
  sourcesFor(slug, seen, results);
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\nsin fuentes para " + slug + " (v" + VERSION + ")", headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._slug = slugFromId;
