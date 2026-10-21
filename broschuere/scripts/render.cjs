#!/usr/bin/env node
// Rendert die Broschüre (HTML) zu einem druckfähigen PDF und erzeugt Seitenvorschauen für die QA.
//
// Nutzung:
//   node scripts/render.cjs [--in src/index.html] [--pdf dist/broschuere.pdf] [--png dist/preview] [--dpi 72]
//
// Prüft außerdem jede .page auf Inhalte, die über den Seitenrand hinauslaufen (Overflow).

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const root = path.resolve(__dirname, '..');
const input = path.resolve(root, arg('in', 'src/index.html'));
const pdfOut = path.resolve(root, arg('pdf', 'dist/Mietwohnraumfoerderung-Niedersachsen-2026.pdf'));
const pngDir = arg('png', null) ? path.resolve(root, arg('png')) : null;
const dpi = Number(arg('dpi', '72'));

(async () => {
  const browser = await chromium.launch(
    fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
  );
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  await page.goto('file://' + input, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // Overflow-Check in Druckmedien-Darstellung
  await page.emulateMedia({ media: 'print' });
  const report = await page.evaluate(() => {
    const out = [];
    const pages = [...document.querySelectorAll('.page')];
    pages.forEach((p, idx) => {
      const pr = p.getBoundingClientRect();
      if (p.scrollHeight > p.clientHeight + 1 || p.scrollWidth > p.clientWidth + 1) {
        out.push(`Seite ${idx + 1}: Inhalt größer als Seite (${p.scrollWidth}×${p.scrollHeight} > ${p.clientWidth}×${p.clientHeight})`);
      }
      p.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || el.closest('[data-bleed]')) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.bottom > pr.bottom + 1 || r.right > pr.right + 1) {
          const label = (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase());
          out.push(`Seite ${idx + 1}: ${label} ragt über den Rand (${Math.round(r.right - pr.right)}px rechts, ${Math.round(r.bottom - pr.bottom)}px unten)`);
        }
        if ((el.scrollHeight > el.clientHeight + 2) && ['hidden', 'clip'].includes(cs.overflowY) && el.clientHeight > 0) {
          const label = (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase());
          out.push(`Seite ${idx + 1}: ${label} schneidet Inhalt ab (overflow hidden, ${el.scrollHeight - el.clientHeight}px)`);
        }
      });
    });
    return { pages: pages.length, issues: [...new Set(out)] };
  });

  fs.mkdirSync(path.dirname(pdfOut), { recursive: true });
  await page.pdf({ path: pdfOut, preferCSSPageSize: true, printBackground: true });
  await browser.close();

  const info = execFileSync('pdfinfo', [pdfOut]).toString();
  const pdfPages = Number((info.match(/Pages:\s+(\d+)/) || [])[1]);
  console.log(`PDF: ${pdfOut}`);
  console.log(`.page-Elemente: ${report.pages}, PDF-Seiten: ${pdfPages}`);
  if (report.pages !== pdfPages) console.log('WARNUNG: Seitenzahl im PDF weicht von der Anzahl .page-Elemente ab (Umbruch/Overflow?)');
  report.issues.forEach((i) => console.log('OVERFLOW: ' + i));
  errors.forEach((e) => console.log('FEHLER: ' + e));

  if (pngDir) {
    fs.mkdirSync(pngDir, { recursive: true });
    fs.readdirSync(pngDir).filter((f) => f.endsWith('.png')).forEach((f) => fs.unlinkSync(path.join(pngDir, f)));
    execFileSync('pdftoppm', ['-png', '-r', String(dpi), pdfOut, path.join(pngDir, 'seite')]);
    const pngs = fs.readdirSync(pngDir).filter((f) => /^seite-\d+\.png$/.test(f)).sort();
    // Kontaktbogen als Doppelseiten (Umschlag einzeln) für den Gesamteindruck
    try {
      execFileSync('montage', [...pngs.map((f) => path.join(pngDir, f)), '-tile', '4x', '-geometry', '+8+8', '-background', '#d9d9d9', path.join(pngDir, 'uebersicht.png')]);
    } catch (e) {
      console.log('Hinweis: Kontaktbogen konnte nicht erzeugt werden: ' + e.message);
    }
    console.log(`Vorschauen: ${pngs.length} PNGs in ${pngDir} (+ uebersicht.png)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
