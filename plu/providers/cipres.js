/**
 * Ciprés - fuentes adicionales para canales en vivo
 * Se activa al abrir un canal del catálogo (id "cbl-<canal>") y devuelve las fuentes guardadas aquí abajo.
 * Si una fuente deja de funcionar, se cambia la URL en CHANNELS (o se agrega otra a la lista del canal).
 */
var DEBUG = true; // true: si el canal se reconoce pero no sale nada, aparece una entrada "DIAGNOSTICO". Poner en false al terminar de probar.
var VERSION = "1.3.0";
var LABEL = "Lat 1";
var PREFIX = "cbl-";

// canal del catalogo -> [[nombre a mostrar, [urls en orden de prioridad]], ...]
var CHANNELS = {
  "espn": [["ESPN", [
    "http://181.119.185.32:8000/play/a004/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0sd/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a09k/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0sa/index.m3u8?hls",
    "http://181.119.177.253:8000/play/a0ck/index.m3u8",
    "http://181.79.87.130:8000/play/a02i/index.m3u8",
    "http://181.78.197.59:8000/play/a07z/index.m3u8",
    "https://barinaslive1.boldmss.com/ESPN/ESPN.isml/ESPN.m3u8",
    "http://190.61.47.54:8000/play/a004/index.m3u8",
    "http://190.83.2.182:8090/ESPN/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn-mux/chunks.m3u8",
    "http://85.237.89.160:9590/usa-s/ESPN-HD/index.m3u8",
    "http://tvsen7.aynascope.net/espn/index.m3u8",
    "http://212.5.144.156:8080/espn/index.m3u8",
    "http://38.226.49.253:8000/play/a07l/index.m3u8?hls",
    "http://190.60.45.197:2222/play/a0gz/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a04s/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a04r/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a001/index.m3u8?hls"
  ]]],
  "espn-2": [["ESPN 2", [
    "http://38.226.49.253:8000/play/a06g/index.m3u8?hls",
    "http://190.60.45.197:2222/play/a038/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a05c/index.m3u8?hls",
    "http://181.119.177.253:8000/play/a0cl/index.m3u8",
    "http://181.224.255.210:8001/play/a0oj/index.m3u8?hls",
    "https://barinaslive1.boldmss.com/ESPN_2/ESPN_2.isml/ESPN_2.m3u8",
    "http://190.61.47.54:8000/play/a005/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn2-mux/playlist.m3u8",
    "http://85.237.89.160:9590/usa-s/ESPN-2-HD/index.m3u8",
    "http://190.60.45.197:2222/play/a01z/index.m3u8?hls",
    "http://181.119.185.32:8000/play/a01w/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a04t/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a002/index.m3u8?hls"
  ]]],
  "espn-3": [["ESPN 3", [
    "http://190.102.120.20:8000/play/a043/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a07g/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a05d/index.m3u8?hls",
    "http://181.225.73.159:8000/play/a03f/index.m3u8",
    "http://190.83.2.182:8090/ESPN3/index.m3u8",
    "https://barinaslive1.boldmss.com/ESPN_3/ESPN_3.isml/ESPN_3.m3u8",
    "http://181.78.197.59:8000/play/a081/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn3-mux/playlist.m3u8",
    "http://190.60.45.197:2222/play/a045/index.m3u8?hls",
    "http://181.119.185.32:8000/play/a009/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a003/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0ps/index.m3u8?hls"
  ]]],
  "espn-4": [["ESPN 4", [
    "http://38.226.49.253:8000/play/a065/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0og/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a08p/index.m3u8?hls",
    "http://200.59.191.177:8000/play/a0pz/index.m3u8?hls",
    "http://181.78.197.59:8000/play/a07n/index.m3u8",
    "https://barinaslive1.boldmss.com/ESPN_4/ESPN_4.isml/ESPN_4.m3u8",
    "http://190.102.120.20:8000/play/a004/index.m3u8?hls"
  ]]],
  "espn-5": [["ESPN 5", [
    "http://38.226.49.253:8000/play/a078/index.m3u8?hls",
    "http://181.119.185.32:8000/play/a00n/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a06j/index.m3u8?hls",
    "http://181.119.177.253:8000/play/a04y/index.m3u8",
    "http://181.224.255.210:8001/play/a0pr/index.m3u8?hls",
    "https://barinaslive1.boldmss.com/ESPN_5/ESPN_5.isml/ESPN_5.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn5-mux/playlist.m3u8",
    "http://190.102.120.20:8000/play/a005/index.m3u8?hls"
  ]]],
  "espn-6": [["ESPN 6", [
    "http://190.60.45.197:2222/play/a027/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a05p/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a05e/index.m3u8?hls",
    "http://186.148.196.100:8000/play/a02q",
    "http://181.224.255.210:8001/play/a0eq/index.m3u8?hls",
    "https://barinaslive1.boldmss.com/ESPN_6/ESPN_6.isml/ESPN_6.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn6-mux/playlist.m3u8",
    "http://190.102.120.20:8000/play/a006/index.m3u8?hls"
  ]]],
  "espn-7": [["ESPN 7", [
    "http://190.60.45.197:2222/play/a04k/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a087/index.m3u8?hls",
    "http://205.235.6.29:8000/play/a0zv/index.m3u8?hls",
    "http://200.59.191.177:8000/play/a0p2/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0m5/index.m3u8?hls",
    "https://barinaslive1.boldmss.com/ESPN_7/ESPN_7.isml/ESPN_7.m3u8",
    "http://181.119.185.32:8000/play/a01y/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a008/index.m3u8?hls"
  ]]],
  "espn-premium": [["ESPN Premium", [
    "http://38.226.49.253:8000/play/a07t/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0pt/index.m3u8?hls",
    "http://205.235.6.29:8000/play/a0wl/index.m3u8?hls",
    "http://181.119.84.106:8000/play/a0qw/index.m3u8",
    "http://158.172.155.130:8000/play/a0ao/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/espn_premium.stream/playlist.m3u8"
  ]]],
  "fox-sports": [["Fox Sports", [
    "http://liontv.es:8080/Euphoria/Euphoria2023/388690",
    "http://190.61.101.11:7050/play/a08t/index.m3u8?hls",
    "http://45.167.2.138:8000/play/a0ql/index.m3u8",
    "http://138.59.227.20:8000/play/a085/index.m3u8",
    "http://158.172.155.130:8000/play/a09x/index.m3u8",
    "http://23.237.104.106:8080/USA_FOX_DEPORTES/index.m3u8",
    "http://85.237.89.160:9590/usa-s/FOX-SPORTS-1/index.m3u8",
    "https://tvsen7.aynascope.net/foxsports1/index.m3u8"
  ]]],
  "fox-sports-2": [["Fox Sports 2", [
    "http://liontv.es:8080/Euphoria/Euphoria2023/473005",
    "http://190.61.101.11:7050/play/a08v/index.m3u8?hls",
    "http://186.33.26.18:8000/play/a0rt/index.m3u8",
    "https://zapster.trapemn.tv:1936/CD-LATAM/FoxSports2/playlist.m3u8",
    "https://tvsen7.aynascope.net/foxsports2/index.m3u8"
  ]]],
  "fox-sports-3": [["Fox Sports 3", [
    "http://liontv.es:8080/Euphoria/Euphoria2023/345278",
    "http://45.167.2.138:8000/play/a0qn/index.m3u8",
    "http://45.167.2.101:8000/play/a0rw/index.m3u8"
  ]]],
  "fox-sports-premium": [["Fox Sports Premium", [
    "http://190.61.101.11:7050/play/a08w/index.m3u8?hls",
    "http://190.61.101.11:7050/play/a08u/index.m3u8?hls"
  ]]],
  "fox": [["FOX", [
    "http://186.33.0.57:8000/play/a048/index.m3u8",
    "http://45.228.234.62:8000/play/a05i/index.m3u8",
    "http://45.5.118.188:8000/play/a04i/index.m3u8",
    "http://45.5.116.228:8000/play/a05z/index.m3u8",
    "http://38.52.208.106:8000/play/a048/index.m3u8",
    "http://45.167.1.138:8000/play/a05u",
    "http://45.167.1.139:8000/play/a05u",
    "http://45.167.1.136:8000/play/a05u",
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
    "http://38.187.7.252:8000/play/a03d/index.m3u8",
    "http://190.117.20.37:8000/play/a08d/38457924.m3u8",
    "http://181.224.255.210:8001/play/a0s8/index.m3u8?hls",
    "http://45.186.254.75:8000/play/a0en/index.m3u8",
    "http://157.100.9.51:8000/play/a26e",
    "http://15.204.146.163:8002/play/a00g/index.m3u8",
    "http://138.121.113.175:8000/play/a0cj/index.m3u8",
    "http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/592036.ts",
    "http://vhdigital.cl/live/Limacolombia2025/E7sRFtAnv9/592036.ts"
  ]]],
  "dsports-2": [["DSports 2", [
    "http://190.238.43.117:9000/play/a09f/index.m3u8",
    "http://157.100.9.51:8000/play/a25d",
    "http://38.224.175.2:8000/play/a066/index.m3u8",
    "http://187.102.208.209:8000/play/a0bq/index.m3u8",
    "http://138.121.113.175:8000/play/a0ca/index.m3u8"
  ]]],
  "dsports-plus": [["DSports Plus", [
    "http://190.238.43.117:9000/play/a09d/index.m3u8",
    "http://157.100.9.51:8000/play/a26d"
  ]]],
  "tudn": [["TUDN", [
    "http://play.pelusa.online:8080/4SpexjF76RbM1/AW4m6zLkCqNt/31129",
    "http://181.119.177.253:8000/play/a0ds/index.m3u8",
    "http://179.60.224.196:8000/play/a0f4/index.m3u8",
    "http://186.33.1.71:8000/play/a0bx/index.m3u8",
    "https://streaming.alwaysdata.net/tudn.php",
    "http://45.5.118.152:8000/play/a08n/index.m3u8",
    "http://45.190.13.8/TUDNHD/index.m3u8",
    "https://streaming-live-fcdn.api.prd.univisionnow.com/tudn/tudn.isml/hls/tudn.m3u8"
  ]]],
  "liga-1": [["Liga 1", [
    "http://38.224.48.4:8000/play/a0y4/index.m3u8",
    "http://181.224.255.210:8001/play/a0sb/index.m3u8?hls",
    "http://45.5.57.132:8000/play/a08a/index.m3u8",
    "http://181.224.255.210:8001/play/a0sf/index.m3u8?hls"
  ]]],
  "liga-1-max": [["Liga 1 MAX", [
    "http://38.226.49.253:8000/play/a0g4/index.m3u8?hls",
    "http://186.148.196.100:8000/play/a030",
    "http://190.60.59.60:8000/play/a0sv/index.m3u8",
    "http://38.224.48.4:8000/play/a0x2/index.m3u8"
  ]]],
  "sky-sports-la-liga": [["Sky Sports La Liga", [
    "http://190.61.101.11:7050/play/a04g/index.m3u8?hls",
    "http://45.5.118.152:8000/play/a08f/index.m3u8",
    "http://181.119.177.253:8000/play/a0dz/index.m3u8",
    "http://186.33.61.182:8000/play/a05q/index.m3u8",
    "http://45.5.118.188:8000/play/a06p/index.m3u8",
    "http://186.33.1.71:8000/play/a03u/index.m3u8",
    "http://186.148.184.22:8000/play/a0i6/index.m3u8"
  ]]],
  "sky-sports-f1": [["Sky Sports F1", [
    "http://157.100.9.51:8000/play/a25q"
  ]]],
  "movistar-deportes": [["Movistar Deportes", [
    "http://190.108.83.69:8000/play/a07o/index.m3u8",
    "http://157.100.9.51:8000/play/a22s",
    "http://205.235.6.29:8000/play/a0zd/index.m3u8?hls",
    "http://186.33.57.100:8000/play/a2m7/index.m3u8",
    "http://38.199.5.160:8000/play/a0c9/index.m3u8",
    "http://38.56.111.14:8000/play/a02y/index.m3u8",
    "http://38.210.105.10:8000/play/a0j7/index.m3u8",
    "http://45.186.254.75:8000/play/a0es/index.m3u8",
    "http://45.5.57.132:8000/play/a08b/index.m3u8",
    "http://170.244.209.30:8000/play/a1i8/index.m3u8",
    "http://45.4.1.201:8000/play/a13e/index.m3u8",
    "http://195.178.110.110/movistar/index.m3u8",
    "http://38.226.49.253:8000/play/a0gf/index.m3u8?hls"
  ]]],
  "win-sports": [["Win Sports", [
    "http://181.225.190.242:8000/play/a03r",
    "http://190.217.66.92:8000/play/a0fh/index.m3u8?hls",
    "http://181.79.87.130:8000/play/a0ez/index.m3u8",
    "http://138.121.15.230:9002/WIN-SPORT/index.m3u8",
    "http://181.78.12.119:16123/play/ch18/index.m3u8",
    "http://15.204.146.163:8002/play/a00h/index.m3u8",
    "http://168.228.44.241:9999/play/a050/index.m3u8",
    "http://190.60.45.197:2222/play/a03z/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a04o/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a03p/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a056/index.m3u8?hls"
  ]]],
  "win-sports-plus": [["Win Sports+", [
    "http://186.148.184.22:8000/play/a0ih/index.m3u8",
    "http://190.217.66.92:8000/play/a0qs/index.m3u8?hls",
    "http://181.78.21.38:8000/play/a07r/index.m3u8"
  ]]],
  "tnt-sports": [["TNT Sports", [
    "http://181.79.87.131:8000/play/a0e0/index.m3u8",
    "http://205.235.6.29:8000/play/a0xa/index.m3u8?hls",
    "http://181.78.79.131:8000/play/a0mo",
    "http://181.119.185.32:8000/play/a00t/index.m3u8?hls"
  ]]],
  "tnt-sports-premium": [["TNT Sports Premium", [
    "http://205.235.6.29:8000/play/a104/index.m3u8?hls",
    "http://200.59.191.177:8000/play/a0o9/index.m3u8?hls",
    "http://190.108.83.69:8000/play/a03i/index.m3u8",
    "http://38.226.49.253:8000/play/a06f/index.m3u8?hls"
  ]]],
  "hbo": [["HBO", [
    "http://181.119.185.32:8000/play/a00o/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0f161/index.m3u8?hls",
    "https://streaming.onnethn.com/HBO/playlist.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/HBO/chunks.m3u8",
    "http://15.204.246.24:8080/HBOHD/index.m3u8",
    "http://tvsen7.aynascope.net/hbo/index.m3u8"
  ]]],
  "hbo-2": [["HBO 2", [
    "http://181.119.185.32:8000/play/a01c/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a030/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a00i/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/Bantel_new/hbo2/chunks.m3u8",
    "http://15.204.246.24:8080/HBO2HD/index.m3u8",
    "http://tvsen7.aynascope.net/hbo2/index.m3u8"
  ]]],
  "hbo-family": [["HBO Family", [
    "http://38.226.49.253:8000/play/a033/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0nv/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a00k/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/HBO_Family/chunks.m3u8",
    "http://15.204.246.24:8080/HBOFamilyHD/index.m3u8"
  ]]],
  "hbo-plus": [["HBO Plus", [
    "http://181.119.185.32:8000/play/a01d/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0qz/index.m3u8?hls",
    "http://15.204.246.24:8080/HBOPlusHD/index.m3u8"
  ]]],
  "hbo-mundi": [["HBO Mundi", [
    "http://181.224.255.210:8001/play/a0rf/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a04k/index.m3u8?hls"
  ]]],
  "hbo-pop": [["HBO Pop", [
    "http://181.224.255.210:8001/play/a0on/index.m3u8?hls"
  ]]],
  "hbo-signature": [["HBO Signature", [
    "http://38.226.49.253:8000/play/a04j/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0re/index.m3u8?hls"
  ]]],
  "hbo-xtreme": [["HBO Xtreme", [
    "http://181.224.255.210:8001/play/a0nw/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a07w/index.m3u8?hls",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/HBO_Xtreme/chunks.m3u8"
  ]]],
  "tnt": [["TNT", [
    "http://190.102.120.20:8000/play/a045/index.m3u8?hls",
    "http://181.119.185.32:8000/play/a017/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a03i/index.m3u8",
    "http://181.78.211.244:8005/play/a09g/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/tnt/chunks.m3u8",
    "http://15.204.246.24:8080/TNTHD/index.m3u8",
    "http://212.5.144.156/tnt/index.m3u8",
    "https://turnerlive.warnermediacdn.com/hls/live/2023168/tnteast/slate/VIDEO_0_3564000.m3u8",
    "https://turnerlive.warnermediacdn.com/hls/live/2023170/tntwest/slate/VIDEO_0_3564000.m3u8"
  ]]],
  "cinemax": [["Cinemax", [
    "http://38.226.49.253:8000/play/a0ax/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a00b/index.m3u8?hls",
    "http://38.65.175.84:8000/play/a093/index.m3u8",
    "https://streaming.onnethn.com/CINEMAX/playlist.m3u8",
    "http://23.237.104.106:8080/USA_MOREMAX/index.m3u8",
    "http://23.237.104.106:8080/USA_5STARMAX/index.m3u8",
    "http://23.237.104.106:8080/USA_CINEMAX_WEST/index.m3u8"
  ]]],
  "space": [["Space", [
    "http://181.119.185.32:8000/play/a00d/index.m3u8?hls",
    "http://190.102.120.20:8000/play/a00c/index.m3u8?hls",
    "http://45.171.64.30:6060/play/a04n/index.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/space.stream/playlist.m3u8"
  ]]],
  "warner-channel": [["Warner Channel", [
    "http://38.226.49.253:8000/play/a061/index.m3u8?hls"
  ]]],
  "cinecanal": [["Cinecanal", [
    "http://181.224.255.210:8001/play/a0ob/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a05z/index.m3u8?hls",
    "http://15.204.246.24:8080/CinecanalHD/index.m3u8",
    "http://138.121.15.230:9002/CINECANAL/index.m3u8",
    "http://190.61.47.54:8000/play/a02z/index.m3u8",
    "https://barinaslive1.boldmss.com/CINECANAL/CINECANAL.isml/CINECANAL.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/Cinecanal-key/chunks.m3u8"
  ]]],
  "fx": [["FX", [
    "http://190.102.120.20:8000/play/a019/index.m3u8?hls",
    "http://181.119.185.32:8000/play/a00a/index.m3u8?hls",
    "http://15.204.246.24:8080/FXHD/index.m3u8",
    "http://190.93.224.42/FX/index.m3u8",
    "http://38.252.238.18:8000/play/a01c/index.m3u8",
    "http://168.196.127.137:6001/play/a05u/index.m3u8",
    "https://barinaslive1.boldmss.com/FX/FX.isml/FX.m3u8",
    "https://bantel-cdn1.iptvperu.tv:1936/btnscrtn/fx-key/chunks.m3u8",
    "https://tvsen7.aynascope.net/fx/index.m3u8"
  ]]],
  "golden": [["Golden", [
    "http://181.224.255.210:8001/play/a0qv/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a09m/index.m3u8?hls",
    "http://38.19.41.46:8081/MTV/index.m3u8",
    "http://209.14.115.253:8081/GOLDEN/index.m3u8",
    "http://181.224.200.5:2277/play/a0do/index.m3u8",
    "http://168.196.127.137:6001/play/a06y/index.m3u8",
    "http://15.204.196.147:22880/RECEPCION-GOLDEN_LAT-FHD/video.m3u8",
    "http://138.121.15.230:9002/GOLDEN/index.m3u8",
    "https://rpn.bozztv.com/gusa/gusa-goldentv/index.m3u8"
  ]]],
  "golden-premier": [["Golden Premier", [
    "http://200.229.147.210:9999/play/a00k/index.m3u8",
    "http://200.229.147.210:9999/play/a00l/index.m3u8",
    "http://200.57.28.141:8540/play/a0ln",
    "http://200.57.28.141:8540/play/a0lo"
  ]]],
  "tooncast": [["Tooncast", [
    "http://190.102.120.20:8000/play/a02t/index.m3u8?hls",
    "http://38.226.49.253:8000/play/a03u/index.m3u8?hls",
    "http://38.134.250.110:8000/play/a01t/index.m3u8",
    "https://streaming.onnethn.com/TOONCAST/playlist.m3u8",
    "http://190.61.42.218:9000/play/a06i/index.m3u8"
  ]]],
  "adult-swim": [["Adult Swim", [
    "http://168.197.104.22/ADULT_SWIM/index.m3u8",
    "http://45.162.64.114/ADULT_SWIM/index.m3u8",
    "http://170.244.209.30:8000/play/a02v/index.m3u8",
    "https://turnerlive.warnermediacdn.com/hls/live/2023185/aswest/noslate/VIDEO_1_5128000.m3u8"
  ]]],
  "bitme": [["bitMe", [
    "https://cablered.iptvperu.tv:1936/cablered/bitme-srt_new/playlist.m3u8",
    "https://cablered.iptvperu.tv:1936/cablered/bitme_new/playlist.m3u8",
    "http://200.229.147.210:9999/play/a01y/index.m3u8"
  ]]],
  "dragon-ball": [["Dragon Ball", [
    "https://183.bozztv.com/giatv/giatv-dball/dball/playlist.m3u8",
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/685a996c7c4f2ad40cb4f276/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f7f23a2e-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=ES&deviceDNT=false&deviceId=f7f23a2e-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=38.9100&deviceLon=1.4200&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=ES&serverSideAds=false&sessionID=f7ff6ce0-cf26-11f1-ba51-066548e8b286&sid=f7ff6ce0-cf26-11f1-ba51-066548e8b286&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmN2ZmNmNlMC1jZjI2LTExZjEtYmE1MS0wNjY1NDhlOGIyODYiLCJjbGllbnRJUCI6Ijg4LjI2LjI0MS4yNDgiLCJjaXR5IjoiRWl2aXNzYSIsInBvc3RhbENvZGUiOiIwNzgwMCIsImNvdW50cnkiOiJFUyIsImRtYSI6MCwiYWN0aXZlUmVnaW9uIjoiRVMiLCJkZXZpY2VMYXQiOjM4LjkwOTk5OTg0NzQxMjExLCJkZXZpY2VMb24iOjEuNDE5OTk5OTU3MDg0NjU1OCwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJFdXJvcGUvTWFkcmlkIiwic2VydmVyU2lkZUFkcyI6ZmFsc2UsImUyZUJlYWNvbnMiOmZhbHNlLCJmZWF0dXJlcyI6eyJtdWx0aVBvZEFkcyI6eyJjb2hvcnQiOiIiLCJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJBZFNlc3Npb25FdmVudCI6eyJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJEYXNoTmciOnsiaml0UGFjayI6InJlcGFja0ppdCxkZWNyeXB0In0sInN0aXRjaGVySGxzTmciOnsiZGVtdXhlZEF1ZGlvIjoiaml0In19LCJmbXNQYXJhbXMiOnsiZndWY0lEMiI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImZ3VmNJRDJDb3BwYSI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImN1c3RvbVBhcmFtcyI6eyJmbXNfbGl2ZXJhbXBfaWRsIjoiIiwiZm1zX2VtYWlsaGFzaCI6IiIsImZtc19zdWJzY3JpYmVyaWQiOiIiLCJmbXNfaWZhIjoiIiwiZm1zX2lkZnYiOiIiLCJmbXNfdXNlcmlkIjoiZjdmMjNhMmUtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZm1zX3ZjaWQydHlwZSI6InVzZXJpZCIsImZtc19yYW1wX2lkIjoiIiwiZm1zX2hoX3JhbXBfaWQiOiIiLCJmbXNfYmlkaWR0eXBlIjoiIiwiX2Z3XzNQX1VJRCI6IiIsImZtc19ydWxlaWQiOiIxMDAxNiwxMDAxNSwxMDAyMCwxMDAyMiwxMDAyMywxMDAyNSwxMDAwMCwxMDAwOSwxMDAxMywxMDAxNCwxMDAyMSJ9fSwiZHJtIjp7Im5hbWUiOiJ3aWRldmluZSIsImxldmVsIjoiTDMifSwic2Vzc2lvblN0YXJ0VGltZSI6MTc5Mjc5MDE3MDE2MSwiaXNzIjoiYm9vdC5wbHV0by50diIsInN1YiI6InByaTp2MTpwbHV0bzpkZXZpY2VzOkVTOlpqZG1Nak5oTW1VdFkyWXlOaTB4TVdZeExXRTVaR1F0TURBd1pETmhPR00yTTJKayIsImF1ZCI6IioucGx1dG8udHYiLCJleHAiOjE3OTI4NzY1NzAsImlhdCI6MTc5Mjc5MDE3MCwianRpIjoiYmM5N2NmOWMtNzFmYi00NjEyLWEwOGYtZjBiZTliOGQ4NjUwIn0.bRMxsPETDsX-107xCfcCvCxN1DVNF3AVgBPakT2CtKQ&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true"
  ]]],
  "dragon-ball-z": [["Dragon Ball Z", [
    "https://183.bozztv.com/giatv/giatv-dball/dball/playlist.m3u8",
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/68e8fd7c3ede4398bc69af93/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f7f23a2e-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=ES&deviceDNT=false&deviceId=f7f23a2e-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=38.9100&deviceLon=1.4200&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=ES&serverSideAds=false&sessionID=f7ff6ce0-cf26-11f1-ba51-066548e8b286&sid=f7ff6ce0-cf26-11f1-ba51-066548e8b286&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmN2ZmNmNlMC1jZjI2LTExZjEtYmE1MS0wNjY1NDhlOGIyODYiLCJjbGllbnRJUCI6Ijg4LjI2LjI0MS4yNDgiLCJjaXR5IjoiRWl2aXNzYSIsInBvc3RhbENvZGUiOiIwNzgwMCIsImNvdW50cnkiOiJFUyIsImRtYSI6MCwiYWN0aXZlUmVnaW9uIjoiRVMiLCJkZXZpY2VMYXQiOjM4LjkwOTk5OTg0NzQxMjExLCJkZXZpY2VMb24iOjEuNDE5OTk5OTU3MDg0NjU1OCwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJFdXJvcGUvTWFkcmlkIiwic2VydmVyU2lkZUFkcyI6ZmFsc2UsImUyZUJlYWNvbnMiOmZhbHNlLCJmZWF0dXJlcyI6eyJtdWx0aVBvZEFkcyI6eyJjb2hvcnQiOiIiLCJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJBZFNlc3Npb25FdmVudCI6eyJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJEYXNoTmciOnsiaml0UGFjayI6InJlcGFja0ppdCxkZWNyeXB0In0sInN0aXRjaGVySGxzTmciOnsiZGVtdXhlZEF1ZGlvIjoiaml0In19LCJmbXNQYXJhbXMiOnsiZndWY0lEMiI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImZ3VmNJRDJDb3BwYSI6ImY3ZjIzYTJlLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImN1c3RvbVBhcmFtcyI6eyJmbXNfbGl2ZXJhbXBfaWRsIjoiIiwiZm1zX2VtYWlsaGFzaCI6IiIsImZtc19zdWJzY3JpYmVyaWQiOiIiLCJmbXNfaWZhIjoiIiwiZm1zX2lkZnYiOiIiLCJmbXNfdXNlcmlkIjoiZjdmMjNhMmUtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZm1zX3ZjaWQydHlwZSI6InVzZXJpZCIsImZtc19yYW1wX2lkIjoiIiwiZm1zX2hoX3JhbXBfaWQiOiIiLCJmbXNfYmlkaWR0eXBlIjoiIiwiX2Z3XzNQX1VJRCI6IiIsImZtc19ydWxlaWQiOiIxMDAxNiwxMDAxNSwxMDAyMCwxMDAyMiwxMDAyMywxMDAyNSwxMDAwMCwxMDAwOSwxMDAxMywxMDAxNCwxMDAyMSJ9fSwiZHJtIjp7Im5hbWUiOiJ3aWRldmluZSIsImxldmVsIjoiTDMifSwic2Vzc2lvblN0YXJ0VGltZSI6MTc5Mjc5MDE3MDE2MSwiaXNzIjoiYm9vdC5wbHV0by50diIsInN1YiI6InByaTp2MTpwbHV0bzpkZXZpY2VzOkVTOlpqZG1Nak5oTW1VdFkyWXlOaTB4TVdZeExXRTVaR1F0TURBd1pETmhPR00yTTJKayIsImF1ZCI6IioucGx1dG8udHYiLCJleHAiOjE3OTI4NzY1NzAsImlhdCI6MTc5Mjc5MDE3MCwianRpIjoiYmM5N2NmOWMtNzFmYi00NjEyLWEwOGYtZjBiZTliOGQ4NjUwIn0.bRMxsPETDsX-107xCfcCvCxN1DVNF3AVgBPakT2CtKQ&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true"
  ]]],
  "naruto": [["Naruto", [
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/5ee92e72fb286e0007285fec/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f86ddb02-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=MX&deviceDNT=false&deviceId=f86ddb02-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=19.2900&deviceLon=-99.6600&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=VE&serverSideAds=false&sessionID=f8803563-cf26-11f1-ad5a-8aa5e9fb229e&sid=f8803563-cf26-11f1-ad5a-8aa5e9fb229e&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmODgwMzU2My1jZjI2LTExZjEtYWQ1YS04YWE1ZTlmYjIyOWUiLCJjbGllbnRJUCI6IjIwMC42OC4xMjguODMiLCJjaXR5IjoiVG9sdWNhIiwicG9zdGFsQ29kZSI6IjUwMDAwIiwiY291bnRyeSI6Ik1YIiwiZG1hIjowLCJhY3RpdmVSZWdpb24iOiJWRSIsImRldmljZUxhdCI6MTkuMjkwMDAwOTE1NTI3MzQ0LCJkZXZpY2VMb24iOi05OS42NjAwMDM2NjIxMDkzOCwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJBbWVyaWNhL01leGljb19DaXR5Iiwic2VydmVyU2lkZUFkcyI6ZmFsc2UsImUyZUJlYWNvbnMiOmZhbHNlLCJmZWF0dXJlcyI6eyJtdWx0aVBvZEFkcyI6eyJjb2hvcnQiOiIiLCJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJBZFNlc3Npb25FdmVudCI6eyJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJEYXNoTmciOnsiaml0UGFjayI6InJlcGFja0ppdCxkZWNyeXB0In0sInN0aXRjaGVySGxzTmciOnsiZGVtdXhlZEF1ZGlvIjoiaml0In19LCJmbXNQYXJhbXMiOnsiZndWY0lEMiI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImZ3VmNJRDJDb3BwYSI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImN1c3RvbVBhcmFtcyI6eyJmbXNfbGl2ZXJhbXBfaWRsIjoiIiwiZm1zX2VtYWlsaGFzaCI6IiIsImZtc19zdWJzY3JpYmVyaWQiOiIiLCJmbXNfaWZhIjoiIiwiZm1zX2lkZnYiOiIiLCJmbXNfdXNlcmlkIjoiZjg2ZGRiMDItY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZm1zX3ZjaWQydHlwZSI6InVzZXJpZCIsImZtc19yYW1wX2lkIjoiIiwiZm1zX2hoX3JhbXBfaWQiOiIiLCJmbXNfYmlkaWR0eXBlIjoiMTA0NSIsIl9md18zUF9VSUQiOiJJREw6QXBBMzVVU21pTmViXzNxLWE2U3gzc2l5dUtDSnVrZGVUajZNR2N2YlhwZnlneUprZlhETGVPSDB3ZEpYdUNhOVZ6eWVCeVVOdkd1VDNzLWVUZk1zTkVIblhUbVgyTG5ZNklyY3QwdmVaTkNiMm1PTkw5eElCNWM3czJhaDFvcjBhNjg3aWktTExiaDJmcjlWemx5cVRVM2dRTW5ESzM4U2k4Q0lva0J4eFRfcnRmU0swekpHSzh4M0ZWRnpfY1o4Q3FVc1Fma1RDT0hBYTVkV2pnM0dYbzJINW40djVBQWs1V0VzeDlPaUNIVjJOLTZ6RlNhNXc3UkN5OC1KT0h3LWlxSGpBOUx6R3F1VTdURGFUWnl5Y1BRcXZWNjN1am5yRjduUzRRUm1ycUtleVFVOGpwRWV3UDBhekgxZTdNYVk1V3FDd0cxa2UtZ2dDcXl0RGppa25zUVphREliVWc0dzFSMlJXNWtvYXciLCJmbXNfcnVsZWlkIjoiMTAwMDksMTAwMTQsMTAwMTYsMTAwMTUsMTAwMjEsMTAwMjIsMTAwMjMsMTAwMDAsMTAwMTMsMTAwMjAifX0sImRybSI6eyJuYW1lIjoid2lkZXZpbmUiLCJsZXZlbCI6IkwzIn0sInNlc3Npb25TdGFydFRpbWUiOjE3OTI3OTAxNzEwMDUsImlzcyI6ImJvb3QucGx1dG8udHYiLCJzdWIiOiJwcmk6djE6cGx1dG86ZGV2aWNlczpWRTpaamcyWkdSaU1ESXRZMll5TmkweE1XWXhMV0U1WkdRdE1EQXdaRE5oT0dNMk0ySmsiLCJhdWQiOiIqLnBsdXRvLnR2IiwiZXhwIjoxNzkyODc2NTcxLCJpYXQiOjE3OTI3OTAxNzEsImp0aSI6ImI1OWIyN2FkLTFjMWMtNGVmOC1hNjIyLTU2ZTNkNjU1YzU4MiJ9.PCZfQ-lwblAglKZwWDA0OGY4rMliDppD7NITPOMRH1k&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true",
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/64c92fea3c3344000869e8a9/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f86ddb02-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=MX&deviceDNT=false&deviceId=f86ddb02-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=19.2900&deviceLon=-99.6600&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=VE&serverSideAds=false&sessionID=f8803563-cf26-11f1-ad5a-8aa5e9fb229e&sid=f8803563-cf26-11f1-ad5a-8aa5e9fb229e&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmODgwMzU2My1jZjI2LTExZjEtYWQ1YS04YWE1ZTlmYjIyOWUiLCJjbGllbnRJUCI6IjIwMC42OC4xMjguODMiLCJjaXR5IjoiVG9sdWNhIiwicG9zdGFsQ29kZSI6IjUwMDAwIiwiY291bnRyeSI6Ik1YIiwiZG1hIjowLCJhY3RpdmVSZWdpb24iOiJWRSIsImRldmljZUxhdCI6MTkuMjkwMDAwOTE1NTI3MzQ0LCJkZXZpY2VMb24iOi05OS42NjAwMDM2NjIxMDkzOCwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJBbWVyaWNhL01leGljb19DaXR5Iiwic2VydmVyU2lkZUFkcyI6ZmFsc2UsImUyZUJlYWNvbnMiOmZhbHNlLCJmZWF0dXJlcyI6eyJtdWx0aVBvZEFkcyI6eyJjb2hvcnQiOiIiLCJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJBZFNlc3Npb25FdmVudCI6eyJlbmFibGVkIjp0cnVlfSwic3RpdGNoZXJEYXNoTmciOnsiaml0UGFjayI6InJlcGFja0ppdCxkZWNyeXB0In0sInN0aXRjaGVySGxzTmciOnsiZGVtdXhlZEF1ZGlvIjoiaml0In19LCJmbXNQYXJhbXMiOnsiZndWY0lEMiI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImZ3VmNJRDJDb3BwYSI6ImY4NmRkYjAyLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImN1c3RvbVBhcmFtcyI6eyJmbXNfbGl2ZXJhbXBfaWRsIjoiIiwiZm1zX2VtYWlsaGFzaCI6IiIsImZtc19zdWJzY3JpYmVyaWQiOiIiLCJmbXNfaWZhIjoiIiwiZm1zX2lkZnYiOiIiLCJmbXNfdXNlcmlkIjoiZjg2ZGRiMDItY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZm1zX3ZjaWQydHlwZSI6InVzZXJpZCIsImZtc19yYW1wX2lkIjoiIiwiZm1zX2hoX3JhbXBfaWQiOiIiLCJmbXNfYmlkaWR0eXBlIjoiMTA0NSIsIl9md18zUF9VSUQiOiJJREw6QXBBMzVVU21pTmViXzNxLWE2U3gzc2l5dUtDSnVrZGVUajZNR2N2YlhwZnlneUprZlhETGVPSDB3ZEpYdUNhOVZ6eWVCeVVOdkd1VDNzLWVUZk1zTkVIblhUbVgyTG5ZNklyY3QwdmVaTkNiMm1PTkw5eElCNWM3czJhaDFvcjBhNjg3aWktTExiaDJmcjlWemx5cVRVM2dRTW5ESzM4U2k4Q0lva0J4eFRfcnRmU0swekpHSzh4M0ZWRnpfY1o4Q3FVc1Fma1RDT0hBYTVkV2pnM0dYbzJINW40djVBQWs1V0VzeDlPaUNIVjJOLTZ6RlNhNXc3UkN5OC1KT0h3LWlxSGpBOUx6R3F1VTdURGFUWnl5Y1BRcXZWNjN1am5yRjduUzRRUm1ycUtleVFVOGpwRWV3UDBhekgxZTdNYVk1V3FDd0cxa2UtZ2dDcXl0RGppa25zUVphREliVWc0dzFSMlJXNWtvYXciLCJmbXNfcnVsZWlkIjoiMTAwMDksMTAwMTQsMTAwMTYsMTAwMTUsMTAwMjEsMTAwMjIsMTAwMjMsMTAwMDAsMTAwMTMsMTAwMjAifX0sImRybSI6eyJuYW1lIjoid2lkZXZpbmUiLCJsZXZlbCI6IkwzIn0sInNlc3Npb25TdGFydFRpbWUiOjE3OTI3OTAxNzEwMDUsImlzcyI6ImJvb3QucGx1dG8udHYiLCJzdWIiOiJwcmk6djE6cGx1dG86ZGV2aWNlczpWRTpaamcyWkdSaU1ESXRZMll5TmkweE1XWXhMV0U1WkdRdE1EQXdaRE5oT0dNMk0ySmsiLCJhdWQiOiIqLnBsdXRvLnR2IiwiZXhwIjoxNzkyODc2NTcxLCJpYXQiOjE3OTI3OTAxNzEsImp0aSI6ImI1OWIyN2FkLTFjMWMtNGVmOC1hNjIyLTU2ZTNkNjU1YzU4MiJ9.PCZfQ-lwblAglKZwWDA0OGY4rMliDppD7NITPOMRH1k&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true",
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/5ee92e72fb286e0007285fec/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f8e34f2c-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=AR&deviceDNT=false&deviceId=f8e34f2c-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=-34.6100&deviceLon=-58.4200&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=VE&serverSideAds=false&sessionID=f8eff553-cf26-11f1-acb8-b2f313d74315&sid=f8eff553-cf26-11f1-acb8-b2f313d74315&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmOGVmZjU1My1jZjI2LTExZjEtYWNiOC1iMmYzMTNkNzQzMTUiLCJjbGllbnRJUCI6IjE2OC4yMjYuMjMyLjIyOCIsImNpdHkiOiJCdWVub3MgQWlyZXMiLCJwb3N0YWxDb2RlIjoiYzEyMDYgYWJlIiwiY291bnRyeSI6IkFSIiwiZG1hIjowLCJhY3RpdmVSZWdpb24iOiJWRSIsImRldmljZUxhdCI6LTM0LjYxMDAwMDYxMDM1MTU2LCJkZXZpY2VMb24iOi01OC40MTk5OTgxNjg5NDUzMSwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY4ZTM0ZjJjLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJBbWVyaWNhL0FyZ2VudGluYS9CdWVub3NfQWlyZXMiLCJzZXJ2ZXJTaWRlQWRzIjpmYWxzZSwiZTJlQmVhY29ucyI6ZmFsc2UsImZlYXR1cmVzIjp7Im11bHRpUG9kQWRzIjp7ImNvaG9ydCI6IiIsImVuYWJsZWQiOnRydWV9LCJzdGl0Y2hlckRhc2hOZyI6eyJqaXRQYWNrIjoicmVwYWNrSml0LGRlY3J5cHQifSwic3RpdGNoZXJIbHNOZyI6eyJkZW11eGVkQXVkaW8iOiJqaXQifX0sImZtc1BhcmFtcyI6eyJmd1ZjSUQyIjoiZjhlMzRmMmMtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZndWY0lEMkNvcHBhIjoiZjhlMzRmMmMtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiY3VzdG9tUGFyYW1zIjp7ImZtc19saXZlcmFtcF9pZGwiOiIiLCJmbXNfZW1haWxoYXNoIjoiIiwiZm1zX3N1YnNjcmliZXJpZCI6IiIsImZtc19pZmEiOiIiLCJmbXNfaWRmdiI6IiIsImZtc191c2VyaWQiOiJmOGUzNGYyYy1jZjI2LTExZjEtYTlkZC0wMDBkM2E4YzYzYmQiLCJmbXNfdmNpZDJ0eXBlIjoidXNlcmlkIiwiZm1zX3JhbXBfaWQiOiIiLCJmbXNfaGhfcmFtcF9pZCI6IiIsImZtc19iaWRpZHR5cGUiOiIiLCJfZndfM1BfVUlEIjoiIiwiZm1zX3J1bGVpZCI6IjEwMDIwLDEwMDIxLDEwMDA5LDEwMDEzLDEwMDE2LDEwMDE1LDEwMDIyLDEwMDAwLDEwMDE0In19LCJkcm0iOnsibmFtZSI6IndpZGV2aW5lIiwibGV2ZWwiOiJMMyJ9LCJzZXNzaW9uU3RhcnRUaW1lIjoxNzkyNzkwMTcxNzM3LCJpc3MiOiJib290LnBsdXRvLnR2Iiwic3ViIjoicHJpOnYxOnBsdXRvOmRldmljZXM6VkU6WmpobE16Um1NbU10WTJZeU5pMHhNV1l4TFdFNVpHUXRNREF3WkROaE9HTTJNMkprIiwiYXVkIjoiKi5wbHV0by50diIsImV4cCI6MTc5Mjg3NjU3MSwiaWF0IjoxNzkyNzkwMTcxLCJqdGkiOiIxNTkxZTY4NC1jMWU5LTQ1ZjctOThhZC03NWFhZDM1YTBlYWEifQ.SuHcnptzHM0TxiQ7wgr8lQv2jmILlsGrKBD7VTpDR6o&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true",
    "https://ipv4.pluto.tv/api/tn/video/playout/v2/stitch/hls/channel/64c92fea3c3344000869e8a9/master.m3u8?advertisingId=&appName=web&appVersion=8.1.0&app_name=web&clientDeviceType=0&clientID=f8e34f2c-cf26-11f1-a9dd-000d3a8c63bd&clientModelNumber=1.0.0&country=AR&deviceDNT=false&deviceId=f8e34f2c-cf26-11f1-a9dd-000d3a8c63bd&deviceLat=-34.6100&deviceLon=-58.4200&deviceMake=chrome&deviceModel=web&deviceType=web&deviceVersion=133.0.0&marketingRegion=VE&serverSideAds=false&sessionID=f8eff553-cf26-11f1-acb8-b2f313d74315&sid=f8eff553-cf26-11f1-acb8-b2f313d74315&userId=&jwt=eyJhbGciOiJIUzI1NiIsImtpZCI6IjMwM2RkZTZhLWMwM2EtNDhlMy04NDg5LWE3YjI5MTAxMTA3NCIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSUQiOiJmOGVmZjU1My1jZjI2LTExZjEtYWNiOC1iMmYzMTNkNzQzMTUiLCJjbGllbnRJUCI6IjE2OC4yMjYuMjMyLjIyOCIsImNpdHkiOiJCdWVub3MgQWlyZXMiLCJwb3N0YWxDb2RlIjoiYzEyMDYgYWJlIiwiY291bnRyeSI6IkFSIiwiZG1hIjowLCJhY3RpdmVSZWdpb24iOiJWRSIsImRldmljZUxhdCI6LTM0LjYxMDAwMDYxMDM1MTU2LCJkZXZpY2VMb24iOi01OC40MTk5OTgxNjg5NDUzMSwicHJlZmVycmVkTGFuZ3VhZ2UiOiJlbiIsImRldmljZVR5cGUiOiJ3ZWIiLCJkZXZpY2VWZXJzaW9uIjoiMTMzLjAuMCIsImRldmljZU1ha2UiOiJjaHJvbWUiLCJkZXZpY2VNb2RlbCI6IndlYiIsImFwcE5hbWUiOiJ3ZWIiLCJhcHBWZXJzaW9uIjoiOC4xLjAiLCJjbGllbnRJRCI6ImY4ZTM0ZjJjLWNmMjYtMTFmMS1hOWRkLTAwMGQzYThjNjNiZCIsImNtQXVkaWVuY2VJRCI6IiIsImlzQ2xpZW50RE5UIjpmYWxzZSwidXNlcklEIjoiIiwibG9nTGV2ZWwiOiJERUZBVUxUIiwidGltZVpvbmUiOiJBbWVyaWNhL0FyZ2VudGluYS9CdWVub3NfQWlyZXMiLCJzZXJ2ZXJTaWRlQWRzIjpmYWxzZSwiZTJlQmVhY29ucyI6ZmFsc2UsImZlYXR1cmVzIjp7Im11bHRpUG9kQWRzIjp7ImNvaG9ydCI6IiIsImVuYWJsZWQiOnRydWV9LCJzdGl0Y2hlckRhc2hOZyI6eyJqaXRQYWNrIjoicmVwYWNrSml0LGRlY3J5cHQifSwic3RpdGNoZXJIbHNOZyI6eyJkZW11eGVkQXVkaW8iOiJqaXQifX0sImZtc1BhcmFtcyI6eyJmd1ZjSUQyIjoiZjhlMzRmMmMtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiZndWY0lEMkNvcHBhIjoiZjhlMzRmMmMtY2YyNi0xMWYxLWE5ZGQtMDAwZDNhOGM2M2JkIiwiY3VzdG9tUGFyYW1zIjp7ImZtc19saXZlcmFtcF9pZGwiOiIiLCJmbXNfZW1haWxoYXNoIjoiIiwiZm1zX3N1YnNjcmliZXJpZCI6IiIsImZtc19pZmEiOiIiLCJmbXNfaWRmdiI6IiIsImZtc191c2VyaWQiOiJmOGUzNGYyYy1jZjI2LTExZjEtYTlkZC0wMDBkM2E4YzYzYmQiLCJmbXNfdmNpZDJ0eXBlIjoidXNlcmlkIiwiZm1zX3JhbXBfaWQiOiIiLCJmbXNfaGhfcmFtcF9pZCI6IiIsImZtc19iaWRpZHR5cGUiOiIiLCJfZndfM1BfVUlEIjoiIiwiZm1zX3J1bGVpZCI6IjEwMDIwLDEwMDIxLDEwMDA5LDEwMDEzLDEwMDE2LDEwMDE1LDEwMDIyLDEwMDAwLDEwMDE0In19LCJkcm0iOnsibmFtZSI6IndpZGV2aW5lIiwibGV2ZWwiOiJMMyJ9LCJzZXNzaW9uU3RhcnRUaW1lIjoxNzkyNzkwMTcxNzM3LCJpc3MiOiJib290LnBsdXRvLnR2Iiwic3ViIjoicHJpOnYxOnBsdXRvOmRldmljZXM6VkU6WmpobE16Um1NbU10WTJZeU5pMHhNV1l4TFdFNVpHUXRNREF3WkROaE9HTTJNMkprIiwiYXVkIjoiKi5wbHV0by50diIsImV4cCI6MTc5Mjg3NjU3MSwiaWF0IjoxNzkyNzkwMTcxLCJqdGkiOiIxNTkxZTY4NC1jMWU5LTQ1ZjctOThhZC03NWFhZDM1YTBlYWEifQ.SuHcnptzHM0TxiQ7wgr8lQv2jmILlsGrKBD7VTpDR6o&quality=720p&deviceMake=chrome&deviceType=web&deviceModel=web&deviceVersion=133.0.0&architecture=x86_64&buildVersion=1.0.0&includeExtendedEvents=true&masterJWTPassthrough=true"
  ]]],
  "azteca-uno": [["Azteca Uno", [
    "http://play.pelusa.online:8080/4SpexjF76RbM1/AW4m6zLkCqNt/32663",
    "http://187.245.231.226:8000/play/a0uz/index.m3u8"
  ]]],
  "telefe": [["Telefe", [
    "http://181.224.255.210:8001/play/a0q5/index.m3u8?hls"
  ]]],
  "nickelodeon": [["Nickelodeon", [
    "http://181.119.185.32:8000/play/a015/index.m3u8?hls",
    "http://181.224.255.210:8001/play/a0ol/index.m3u8?hls",
    "http://15.204.246.24:8080/NickHD/index.m3u8",
    "http://190.93.224.42/NICK/index.m3u8",
    "https://barinaslive1.boldmss.com/NICK/NICK.isml/NICK.m3u8",
    "https://zapster.trapemn.tv:1936/CD-LATAM/Nickelodeon/playlist.m3u8",
    "http://181.78.79.131:8000/play/a0qm",
    "https://stmv2.srvif.com/nicktoons/nicktoons/playlist.m3u8",
    "http://198.58.104.90:8989/nickelodeon/index.m3u8"
  ]]],
  "dzn": [["DZN", [
    "http://cloudtvserviceplatinum.site:8080/live/Rene2024castaneda/Castaneda24rene/584995.ts",
    "http://vhdigital.cl/live/Limacolombia2025/E7sRFtAnv9/584995.ts",
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
    g[1].forEach(function (url, n) {
      if (seen[url]) return;
      seen[url] = true;
      results.push({ name: LABEL, title: g[0] + " · Opción " + (n + 1), url: url, quality: "EN VIVO", headers: {} });
    });
  });
  if (results.length) return results;
  return DEBUG ? [{ name: LABEL, title: "", url: "https://example.com/", quality: "🛠 DIAGNOSTICO (no reproducir)\nsin fuentes para " + slug + " (v" + VERSION + ")", headers: {} }] : [];
}

exports.getStreams = getStreams;
exports._slug = slugFromId;
