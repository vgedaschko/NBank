#!/usr/bin/env node
// Rendert eine Mappe zum Ansehen: PDF, je Folie ein Bild (1600 px breit) und eine Übersicht als Kontaktbogen.
//   PPTX_SKILL=<Ordner des pptx-Skills> [PYTHON=<python>] node werkzeug/render.cjs DATEI.pptx ZIELORDNER [--spalten 4] [--pdf ZIEL.pdf]
//   --pdf legt das PDF zusätzlich unter diesem Namen ab (die Fassung zum Weitergeben: dist/<Name der Mappe>.pdf)
// Braucht LibreOffice über scripts/office/soffice.py des Skills und pdftoppm (Poppler). Der Build selbst braucht beides nicht.
'use strict';
const path = require('path'), fs = require('fs');
const { execFileSync } = require('child_process');

// Werkzeugnamen aus den PDF-Metadaten nehmen (E11): /Creator und /Producer im Info-Verzeichnis gleich lang überschreiben
function bereinigePdf(pdf) {
  let buf = fs.readFileSync(pdf), n = 0;
  const s = buf.toString('latin1');
  const neu = s.replace(/\/(Creator|Producer)<FEFF([0-9A-Fa-f]*)>/g, (m, feld, hex) => {
    const zeichen = hex.length / 4, text = 'PGN'.slice(0, zeichen).padEnd(zeichen, ' ');
    n++;
    return `/${feld}<FEFF${[...text].map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join('')}>`;
  });
  if (n && neu.length === s.length) fs.writeFileSync(pdf, Buffer.from(neu, 'latin1'));
  return n;
}

async function main() {
  const args = process.argv.slice(2), si = args.indexOf('--spalten');
  const spaltenArg = si >= 0 ? Number(args.splice(si, 2)[1]) : null;
  const pi = args.indexOf('--pdf'), pdfZiel = pi >= 0 ? args.splice(pi, 2)[1] : null;
  if (pi >= 0 && !pdfZiel) throw new Error('--pdf braucht einen Dateinamen.');
  const [datei, zielArg] = args;
  if (!datei || !zielArg) { console.error('Aufruf: PPTX_SKILL=<Ordner des pptx-Skills> node werkzeug/render.cjs DATEI.pptx ZIELORDNER [--spalten 4] [--pdf ZIEL.pdf]'); process.exit(2); }
  const skill = process.env.PPTX_SKILL;
  if (!skill) throw new Error('Umgebungsvariable PPTX_SKILL fehlt (Ordner des pptx-Skills mit scripts/office/soffice.py).');
  const soffice = path.join(skill, 'scripts', 'office', 'soffice.py');
  if (!fs.existsSync(soffice)) throw new Error(`Nicht gefunden: ${soffice}`);
  const quelle = path.resolve(datei), ziel = path.resolve(zielArg), python = process.env.PYTHON || 'python3';
  if (!fs.existsSync(quelle)) throw new Error(`Nicht gefunden: ${quelle}`);
  fs.mkdirSync(ziel, { recursive: true });
  for (const f of fs.readdirSync(ziel)) if (/^folie-\d+\.png$/.test(f) || f === 'uebersicht.png') fs.unlinkSync(path.join(ziel, f));

  // 1 PDF über LibreOffice
  execFileSync(python, [soffice, '--headless', '--convert-to', 'pdf', '--outdir', ziel, quelle], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000 });
  const pdf = path.join(ziel, path.basename(quelle).replace(/\.pptx$/i, '.pdf'));
  if (!fs.existsSync(pdf)) throw new Error('LibreOffice hat kein PDF geschrieben.');
  const meta = bereinigePdf(pdf);
  if (pdfZiel) { fs.mkdirSync(path.dirname(path.resolve(pdfZiel)), { recursive: true }); fs.copyFileSync(pdf, path.resolve(pdfZiel)); }

  // 2 Bilder je Folie, 1600 px breit
  execFileSync('pdftoppm', ['-png', '-scale-to-x', '1600', '-scale-to-y', '-1', pdf, path.join(ziel, 'tmp-folie')], { stdio: ['ignore', 'pipe', 'pipe'] });
  const roh = fs.readdirSync(ziel).filter(f => /^tmp-folie-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.match(/(\d+)\.png$/)[1], 10) - parseInt(b.match(/(\d+)\.png$/)[1], 10));
  const bilder = roh.map((f, i) => { const neu = `folie-${String(i + 1).padStart(2, '0')}.png`; fs.renameSync(path.join(ziel, f), path.join(ziel, neu)); return path.join(ziel, neu); });

  // 3 Übersicht als Kontaktbogen
  const sharp = require('sharp');
  const n = bilder.length, spalten = spaltenArg || (n <= 4 ? 2 : n <= 12 ? 3 : 4), tw = 640, th = 360, rand = 18, kopf = 22;
  const zeilen = Math.ceil(n / spalten), bw = rand + spalten * (tw + rand), bh = rand + zeilen * (th + kopf + rand);
  const teile = [];
  for (let i = 0; i < n; i++) {
    const x = rand + (i % spalten) * (tw + rand), y = rand + Math.floor(i / spalten) * (th + kopf + rand);
    teile.push({ input: await sharp(bilder[i]).resize(tw, th, { fit: 'fill' }).png().toBuffer(), left: x, top: y + kopf });
    teile.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="${kopf}"><text x="0" y="16" font-family="Work Sans, sans-serif" font-size="15" font-weight="600" fill="#202020">Folie ${String(i + 1).padStart(2, '0')}</text></svg>`), left: x, top: y });
  }
  await sharp({ create: { width: bw, height: bh, channels: 3, background: '#8E8A85' } }).composite(teile).png({ compressionLevel: 9 }).toFile(path.join(ziel, 'uebersicht.png'));
  console.log(`${path.basename(pdf)} · ${n} Bilder folie-NN.png · uebersicht.png in ${ziel}` + (pdfZiel ? ` · PDF auch als ${pdfZiel}` : '') + (meta ? '' : ' · Hinweis: PDF-Metadaten nicht bereinigt'));
}

main().catch(e => { console.error('Fehler: ' + (e.stderr ? String(e.stderr) + '\n' : '') + e.message); process.exit(1); });
