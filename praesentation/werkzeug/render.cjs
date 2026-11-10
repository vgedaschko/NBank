#!/usr/bin/env node
// Rendert eine Mappe zum Ansehen: PDF, je Folie ein Bild (1600 px breit) und eine Übersicht als Kontaktbogen.
//   node werkzeug/render.cjs DATEI.pptx ZIELORDNER [--spalten 4] [--pdf ZIEL.pdf]
//   --pdf legt das PDF zusätzlich unter diesem Namen ab (die Fassung zum Weitergeben: dist/<Name der Mappe>.pdf)
// Braucht LibreOffice (Programm „soffice“ im Suchpfad oder SOFFICE=<Pfad zum Programm>) und pdftoppm (Poppler). Der Build selbst braucht beides nicht.
// LibreOffice läuft mit einem eigenen, leeren Benutzerprofil in einem Zwischenordner im Zielordner; das Profil des Rechners bleibt unberührt.
'use strict';
const path = require('path'), fs = require('fs');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');

// Werkzeugnamen aus den PDF-Metadaten nehmen (E11): /Creator und /Producer im Info-Verzeichnis gleich lang überschreiben.
// Sprache des Dokuments: LibreOffice trägt /Lang(en-US) ein; die Folien sind deutsch, Vorleseprogramme sollen sie deutsch lesen.
// Beides ersetzt gleich lange Zeichenfolgen, die Verweistabelle des PDF bleibt gültig. Rückgabe: { meta, sprache } (Zahl der Ersetzungen)
function bereinigePdf(pdf) {
  let buf = fs.readFileSync(pdf), meta = 0, sprache = 0;
  const s = buf.toString('latin1');
  const neu = s.replace(/\/(Creator|Producer)<FEFF([0-9A-Fa-f]*)>/g, (m, feld, hex) => {
    const zeichen = hex.length / 4, text = 'PGN'.slice(0, zeichen).padEnd(zeichen, ' ');
    meta++;
    return `/${feld}<FEFF${[...text].map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')).join('')}>`;
  }).replace(/\/Lang\(en-US\)/g, () => (sprache++, '/Lang(de-DE)'));
  if ((meta || sprache) && neu.length === s.length) fs.writeFileSync(pdf, Buffer.from(neu, 'latin1'));
  return { meta, sprache };
}

async function main() {
  const args = process.argv.slice(2), si = args.indexOf('--spalten');
  const spaltenArg = si >= 0 ? Number(args.splice(si, 2)[1]) : null;
  const pi = args.indexOf('--pdf'), pdfZiel = pi >= 0 ? args.splice(pi, 2)[1] : null;
  if (pi >= 0 && !pdfZiel) throw new Error('--pdf braucht einen Dateinamen.');
  const [datei, zielArg] = args;
  if (!datei || !zielArg) { console.error('Aufruf: node werkzeug/render.cjs DATEI.pptx ZIELORDNER [--spalten 4] [--pdf ZIEL.pdf]   (LibreOffice: „soffice“ im Suchpfad oder SOFFICE=<Pfad>)'); process.exit(2); }
  const soffice = process.env.SOFFICE || 'soffice';
  const quelle = path.resolve(datei), ziel = path.resolve(zielArg);
  if (!fs.existsSync(quelle)) throw new Error(`Nicht gefunden: ${quelle}`);
  fs.mkdirSync(ziel, { recursive: true });
  for (const f of fs.readdirSync(ziel)) if (/^folie-\d+\.png$/.test(f) || f === 'uebersicht.png') fs.unlinkSync(path.join(ziel, f));

  // 1 PDF über LibreOffice, mit eigenem Benutzerprofil in einem Zwischenordner im Zielordner (wird danach entfernt)
  const profil = fs.mkdtempSync(path.join(ziel, 'profil-'));
  try {
    execFileSync(soffice, [`-env:UserInstallation=${pathToFileURL(profil).href}`, '--headless', '--convert-to', 'pdf', '--outdir', ziel, quelle],
      { stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000, env: { ...process.env, SAL_USE_VCLPLUGIN: 'svp' } });
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`LibreOffice nicht gefunden („${soffice}“). Installieren oder mit SOFFICE=<Pfad zum Programm soffice> angeben.`);
    throw e;
  } finally { fs.rmSync(profil, { recursive: true, force: true }); }
  const pdf = path.join(ziel, path.basename(quelle).replace(/\.pptx$/i, '.pdf'));
  if (!fs.existsSync(pdf)) throw new Error('LibreOffice hat kein PDF geschrieben.');
  const { meta, sprache } = bereinigePdf(pdf);
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
  console.log(`${path.basename(pdf)} · ${n} Bilder folie-NN.png · uebersicht.png in ${ziel}` + (pdfZiel ? ` · PDF auch als ${pdfZiel}` : '') + (meta ? '' : ' · Hinweis: PDF-Metadaten nicht bereinigt') + (sprache ? '' : ' · Hinweis: Sprache des PDF nicht auf Deutsch gesetzt'));
}

main().catch(e => { console.error('Fehler: ' + (e.stderr ? String(e.stderr) + '\n' : '') + e.message); process.exit(1); });
