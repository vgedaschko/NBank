// Assets der Broschüre → Bilder für die Folien (assets/). Die Quelle wird nur gelesen.
// Aufruf: node lib/assets.cjs      (einmalig; der Folienbau liest assets/ danach nur); node lib/assets.cjs --nur qr-nbank-karte (nur der QR-Code der Folie A2)
// Im Folienbau: const { asset } = require('./assets.cjs'); asset('logo-rot.png') liefert den Pfad und prüft, dass die Datei da ist.
'use strict';
const path = require('path'), fs = require('fs');

const OUT = path.join(__dirname, '..', 'assets');
const SRC = process.env.BROSCHUERE_ASSETS || path.resolve(__dirname, '..', '..', 'broschuere', 'src', 'assets');
const W = 13.333, H = 7.5, PXW = 2667, PXH = 1500;

function asset(name) {
  const p = path.join(OUT, name);
  if (!fs.existsSync(p)) throw new Error(`Asset fehlt: assets/${name}. Erst „node lib/assets.cjs“ ausführen; vorhandene Namen stehen in lib/API.md.`);
  return p;
}

// Liste aller erzeugten Dateien (für API.md und Prüfungen)
const UI = ['check', 'kreuz', 'stopp', 'hinweis', 'achtung', 'frist', 'kalender', 'rechner', 'telefon', 'mail', 'web', 'standort', 'dokument', 'pfeil'];
const UI_FARBEN = { tinte: '202020', rot: 'B71E3F', dunkelrot: '8B2939', weiss: 'FFFFFF' };
const PIKTO = { 'neubau-mfh': 'B71E3F', 'eh40-neubau': '3A62A6', 'modernisierung': 'A0581A', 'inseln': '0A5372', 'bindungserwerb': '9A52AE', 'bindungsverlaengerung': '3C3C3B', 'weg-aufstockung': 'B71E3F', 'weg-ersterwerb': 'B71E3F' };
const WERTE = ['verantwortung', 'kostensicherheit', 'innovation', 'vertrauen'];

// var(--name, Rückfall) auflösen: librsvg kennt keine CSS-Variablen
function resolveVars(svg, map = {}) {
  let prev;
  do {
    prev = svg;
    svg = svg.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)/gi, (m, name, fb) => (name in map ? map[name] : (fb || '').trim()));
  } while (svg !== prev);
  return svg;
}
const mix = (hex, pct) => [0, 2, 4].map(i => parseInt(hex.substr(i, 2), 16)).map(c => Math.round(c + (255 - c) * pct / 100)).map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
// CSS linear-gradient(160deg) auf dem Rechteck x, y, w, h → SVG-Koordinaten
function grad160(id, x, y, w, h, c0, c1) {
  const a = 160 * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a);
  const L = Math.abs(w * dx) + Math.abs(h * dy), cx = x + w / 2, cy = y + h / 2, p = v => v.toFixed(3);
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${p(cx - dx * L / 2)}" y1="${p(cy - dy * L / 2)}" x2="${p(cx + dx * L / 2)}" y2="${p(cy + dy * L / 2)}"><stop offset="0" stop-color="#${c0}"/><stop offset="1" stop-color="#${c1}"/></linearGradient>`;
}
const inner = svg => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

async function erzeuge() {
  const sharp = require('sharp');
  if (!fs.existsSync(SRC)) throw new Error(`Assets der Broschüre nicht gefunden: ${SRC} (Umgebungsvariable BROSCHUERE_ASSETS setzen)`);
  fs.mkdirSync(OUT, { recursive: true });
  const lies = f => fs.readFileSync(path.join(SRC, f), 'utf8');
  const liste = [];
  async function png(svg, file, width, height) {
    // Zielgröße in Pixeln in das Wurzelelement schreiben: librsvg rastert dann direkt in der Zielauflösung
    svg = svg.replace(/<\?xml[\s\S]*?\?>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<svg\b([^>]*)>/, (m, attrs) => {
      attrs = attrs.replace(/\s(width|height|x|y)="[^"]*"/g, '');
      return `<svg${attrs} width="${width}" height="${height}" preserveAspectRatio="none">`;
    });
    const buf = await sharp(Buffer.from(svg), { density: 72, limitInputPixels: false }).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(path.join(OUT, file), buf);
    liste.push(`${file.padEnd(36)} ${width}×${height}  ${(buf.length / 1024).toFixed(0)} KB`);
  }

  // 1 Verläufe 160° (Rot, Anthrazit)
  for (const [name, c0, c1] of [['bg-rot', 'B71E3F', '8B2939'], ['bg-anthrazit', '3C3C3B', '202020']]) {
    await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${grad160('g', 0, 0, W, H, c0, c1)}</defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`, name + '.png', PXW, PXH);
  }
  // 2 Titel: Verlauf und Axonometrie als Negativ (Flächen = Verlauf an derselben Stelle plus n % Weiß)
  {
    const axo = lies('pgn/sig-axo-brauerstrasse.svg');
    const box = { x: 7.55, y: 0.98, h: 4.40 };               // Lage der Zeichnung auf der Folie (Zoll); Breite folgt 190 : 165
    const s = (box.h * 25.4) / 165, u = v => v * 25.4 / s;   // Zoll → Zeichnungseinheiten
    const vb = { x: -u(box.x), y: -u(box.y), w: u(W), h: u(H) };
    const defs = [0, 4, 6, 10, 16].map(n => grad160('r' + n, vb.x, vb.y, vb.w, vb.h, mix('B71E3F', n), mix('8B2939', n))).join('');
    const neg = {
      '--sig-ink': '#fff', '--sig-line': '#fff', '--sig-accent': '#fff', '--sig-grid': 'rgba(255,255,255,.6)', '--sig-soft': 'rgba(255,255,255,.62)',
      '--sig-face': 'url(#r0)', '--sig-face-2': 'url(#r6)', '--sig-face-3': 'url(#r10)', '--sig-face-4': 'url(#r16)', '--sig-paper': 'url(#r4)',
      '--sig-glass': 'url(#r4)', '--sig-dark': 'rgba(255,255,255,.5)', '--sig-brick': 'rgba(255,255,255,.26)',
    };
    const body = resolveVars(inner(axo), neg).replace(/#sig-axo /g, '');
    await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"><defs>${defs}</defs><rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="url(#r0)"/>${body}</svg>`, 'bg-titel.png', PXW, PXH);
    await png(resolveVars(axo), 'axo-hell.png', 2400, Math.round(2400 * 165 / 190));   // helle Fassung, freigestellt
    // Folie 14 (Modellhaus): helle Fassung ohne die Förderkette „24,00 = 80 % FÖRDERUNG | 20 %“ (zweite Maßkette an der Längsseite mit Marke,
    // Punkt, Strichen und Hilfslinien), ohne Nordpfeil und Maßstab, Maßketten in Grau statt Rot. Jede Streichung muss genau einmal treffen.
    {
      let t = axo;
      const weg = (re, was) => { const n = (t.match(re) || []).length; if (n !== 1) throw new Error(`Axonometrie Folie 14: „${was}“ trifft ${n}-mal`); t = t.replace(re, ''); };
      weg(/<path class="sig-dim-key"[^>]*\/>/g, 'Marke 24,00');
      weg(/<circle class="sig-dim-dot"[^>]*\/>/g, 'Punkt 24,00');
      weg(/<text class="sig-dim-t sig-dim-t--key"[^>]*>[^<]*<\/text>/g, 'Text 80 % Förderung');
      weg(/<text class="sig-dim-t sig-dim-t--rest"[^>]*>[^<]*<\/text>/g, 'Text 20 %');
      weg(/<g class="sig-north">[\s\S]*?<\/g>/g, 'Nordpfeil');
      weg(/<g class="sig-scalebar">[\s\S]*?<\/g>/g, 'Maßstab');
      for (const sp of ['M11.74,95.74L99.06,146.16', 'M13.12,95.6L13.71,97.82', 'M80.29,134.38L80.88,136.6', 'M97.08,144.08L97.68,146.3',
        'M87.16,131.69L79.33,136.22', 'M19.99,92.91L12.16,97.44', 'M103.96,141.39L96.12,145.91']) weg(new RegExp(sp.replace(/\./g, '\\.'), 'g'), sp);
      // Ausschnitt auf die Zeichnung ohne Nordpfeil und Maßstab (gemessen: y 22,7 bis 153,4 von 165), Verhältnis 190 : 134
      if (!t.includes('viewBox="0 0 190 165"')) throw new Error('Axonometrie Folie 14: viewBox der Vorlage hat sich geändert');
      t = t.replace('viewBox="0 0 190 165"', 'viewBox="0 21 190 134"');
      await png(resolveVars(t, { '--sig-accent': '#77716B' }), 'axo-modellhaus.png', 2400, Math.round(2400 * 134 / 190));
    }
  }
  // 3 Schluss: Verlauf und Grundriss in Weiß (Ausschnitt 8 / 20 / 186 × 114 der A4-Zeichnung); dazu der Grundriss in Tinte, freigestellt
  {
    const roh = lies('pgn/sig-grundriss.svg');
    const crop = { x: 8, y: 20, w: 186, h: 114 }, box = { x: 6.55, y: 0.75, w: 6.2 };
    const s = (box.w * 25.4) / crop.w, u = v => v * 25.4 / s;
    const vb = { x: crop.x - u(box.x), y: crop.y - u(box.y), w: u(W), h: u(H) };
    const body = inner(resolveVars(roh, { '--sig-plan': '#fff' })).replace(/#sig-grundriss\{/g, 'g.gr{').replace(/#sig-grundriss /g, 'g.gr ');
    await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"><defs>${grad160('r0', vb.x, vb.y, vb.w, vb.h, 'B71E3F', '8B2939')}</defs><rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${vb.h}" fill="url(#r0)"/><g class="gr" color="#fff">${body}</g></svg>`, 'bg-schluss.png', PXW, PXH);
    const hell = inner(resolveVars(roh, { '--sig-plan': '#202020' })).replace(/#sig-grundriss\{/g, 'g.gr{').replace(/#sig-grundriss /g, 'g.gr ');
    await png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}"><g class="gr" color="#202020">${hell}</g></svg>`, 'grundriss-hell.png', 2400, Math.round(2400 * crop.h / crop.w));
  }
  // 4 Logos (nur die rote Fassung; auf Rot und Anthrazit steht sie auf weißem Feld)
  await png(lies('pgn/logo-rot.svg'), 'logo-rot.png', 1600, Math.round(1600 * 109.5 / 621.4));
  await png(lies('pgn/logo-mark-rot.svg'), 'logo-mark-rot.png', 800, Math.round(800 * 109.2 / 351.8));
  // 5 QR-Code, Punktraster, Nordpfeil, Werte-Icons
  await png(resolveVars(lies('pgn/qr-pgn-architekten.svg').replace(/<!--[\s\S]*?-->/g, '')), 'qr-pgn.png', 1110, 1110);
  await png(lies('pgn/sig-raster-brauerstrasse.svg').replace(/currentColor/g, '#B71E3F'), 'raster-brauerstrasse-rot.png', 3000, Math.round(3000 * 67.8 / 180));
  await png(resolveVars(lies('pgn/sig-nordpfeil.svg')), 'nordpfeil.png', 480, 600);
  for (const n of WERTE) await png(lies(`pgn/${n}-white.svg`), `wert-${n}-weiss.png`, 332, 332);
  // 6 Linien-Icons und Piktogramme (Fragmente ohne xmlns; currentColor → Farbe)
  const frag = (file, color, acc) => lies(file).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/(<[a-z]+ class="pict-acc[^"]*"[^>]*?)fill="currentColor"/g, `$1fill="#${acc || color}"`)
    .replace(/(<[a-z]+ class="pict-acc-line"[^>]*?)(\/?)>/g, `$1 stroke="#${acc || color}"$2>`)
    .replace(/class="pict-acc pict-acc--shade"/g, 'class="pict-acc" fill-opacity=".72"').replace(/class="pict-acc pict-acc--top"/g, 'class="pict-acc" fill-opacity=".4"')
    .replace(/currentColor/g, '#' + color);
  for (const n of UI) for (const [fn, hex] of Object.entries(UI_FARBEN)) await png(frag(`ui-${n}.svg`, hex), `ui-${n}-${fn}.png`, 256, 256);
  for (const [n, acc] of Object.entries(PIKTO)) await png(frag(`pikto-${n}.svg`, '202020', acc), `pikto-${n}.png`, 512, 512);
  // 7 Referenzbild Brauerstraße (Duplex, 1800 × 740), unverändert
  fs.copyFileSync(path.join(SRC, 'pgn/img/brauerstrasse-duplex.jpg'), path.join(OUT, 'ref-brauerstrasse.jpg'));
  liste.push('ref-brauerstrasse.jpg'.padEnd(36) + ' 1800×740  Kopie');
  // 7a Die Visualisierung „Neu Wulmstorf“ (Referenz 02) zeigt nicht das Modellhaus; Folie 14 zeigt seit 15.11.2026 die Axonometrie ohne Förderkette (2)
  return liste;
}

// 8 QR-Code zur NBank-Karte (Folie A2, seit der Änderungsrunde vom 13.11.2026, F32.1): derselbe Code wie in der Broschüre, Blatt „Bedarf am
// Standort und die Rolle der Kommune“ (src/pages/17-standort-und-kommune.html, Inline-SVG im Link a.p18-qr). Die Module werden unverändert
// übernommen, nicht neu codiert; das Ziel des Links muss das Ziel im Inhalt der Broschüre sein (content/pages/17-standort-und-kommune.json,
// blocks[1].data.qr.url). Ruhezone vier Module (die Broschüre hat zwei im Bild, den Rest gibt die weiße Ringmitte), Module in Tinte auf Weiß,
// 20 Pixel je Modul, scharfe Kanten.
// Aufruf allein: node lib/assets.cjs --nur qr-nbank-karte
const QR_KARTE = { datei: 'qr-nbank-karte.png', seite: '17-standort-und-kommune', ruhe: 4, px: 20 };
async function qrNbankKarte() {
  const sharp = require('sharp');
  const html = fs.readFileSync(path.resolve(SRC, '..', 'pages', QR_KARTE.seite + '.html'), 'utf8');
  const inhalt = JSON.parse(fs.readFileSync(path.resolve(SRC, '..', '..', 'content', 'pages', QR_KARTE.seite + '.json'), 'utf8'));
  const a = html.match(/<a class="p18-qr" href="([^"]+)"[^>]*>\s*<svg viewBox="([-\d. ]+)"[^>]*>([\s\S]*?)<\/svg>\s*<\/a>/);
  if (!a) throw new Error(`QR-Code der Broschüre nicht gefunden (${QR_KARTE.seite}.html, a.p18-qr).`);
  const ziel = inhalt.blocks[1].data.qr.url;
  if (a[1] !== ziel) throw new Error(`QR-Code der Broschüre: Link „${a[1]}“ und Ziel im Inhalt „${ziel}“ weichen ab.`);
  const pfad = (a[3].match(/<path class="qr-mod" d="([^"]+)"/) || [])[1];
  if (!pfad) throw new Error('QR-Code der Broschüre: Module (path.qr-mod) fehlen.');
  // Größe aus den Modulen: das Raster beginnt bei 0, die größte Koordinate plus 1 ist die Kantenlänge
  const n = Math.max(...[...pfad.matchAll(/M(\d+) (\d+)h(\d+)/g)].map(m => Math.max(+m[1] + +m[3], +m[2] + 1)));
  if (![21, 25, 29, 33, 37, 41, 45, 49, 53, 57].includes(n)) throw new Error(`QR-Code der Broschüre: ${n} Module je Seite ergeben keine QR-Version.`);
  const r = QR_KARTE.ruhe, k = n + 2 * r, px = k * QR_KARTE.px;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-r} ${-r} ${k} ${k}" width="${px}" height="${px}" shape-rendering="crispEdges">` +
    `<rect x="${-r}" y="${-r}" width="${k}" height="${k}" fill="#FFFFFF"/><path d="${pfad}" fill="#202020"/></svg>`;
  const buf = await sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(OUT, QR_KARTE.datei), buf);
  return [`${QR_KARTE.datei.padEnd(36)} ${px}×${px}  ${(buf.length / 1024).toFixed(0)} KB  (${n} Module, Ruhezone ${r}, Ziel ${ziel})`];
}

module.exports = { asset, ASSET_ORDNER: OUT, UI, UI_FARBEN, PIKTO, WERTE, QR_KARTE };

if (require.main === module) {
  const nur = process.argv.includes('--nur') ? process.argv[process.argv.indexOf('--nur') + 1] : null;
  if (nur && nur !== 'qr-nbank-karte') { console.error(`Fehler: --nur kennt nur „qr-nbank-karte“.`); process.exit(1); }
  (nur ? qrNbankKarte() : erzeuge().then(async l => [...l, ...(await qrNbankKarte())]))
    .then(l => { console.log(l.join('\n')); console.log(`${l.length} Dateien in ${OUT}`); }).catch(e => { console.error('Fehler: ' + e.message); process.exit(1); });
}
