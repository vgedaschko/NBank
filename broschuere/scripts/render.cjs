#!/usr/bin/env node
// Rendert die Broschüre (HTML) zu einem barrierearmen Bildschirm-PDF (getaggt, Lesezeichen, Metadaten),
// optional zu einem Druck-PDF mit 3 mm Beschnitt und erzeugt Seitenvorschauen für die QA.
//
// Nutzung:
//   node scripts/render.cjs [--in src/index.html] [--pdf dist/broschuere.pdf] [--png dist/preview] [--dpi 72]
//                           [--print-pdf dist/…-Druck.pdf | --no-print]
//
// Ablauf:
//   1. Seite laden, Druckmedien emulieren, Schriften abwarten.
//   2. Statische Schriftinstanzen zuordnen (src/fonts/static/instances.json, erzeugt von scripts/fonts-static.py):
//      Chromium/Skia bettet variable Fonts immer als Type 3 ein; statische Instanzen werden als CID-TrueType eingebettet.
//      Fehlt eine Instanz, wird sie gemeldet (FONT:) und in src/fonts/static/needed.json nachgetragen.
//   3. Ungenutzte weiche Trennstriche (U+00AD) entfernen: Nur dort, wo tatsächlich umbrochen wird, bleibt einer stehen.
//      Der Umbruch ändert sich dadurch nicht (wird geprüft).
//   4. Overflow-Check je .page (OVERFLOW-Zeilen = Fehler).
//   5. Bildschirm-PDF: tagged (Struktur, /Lang, Alt-Texte aus aria-label), eigene Lesezeichen aus h1/h2,
//      Metadaten (Info + XMP), DisplayDocTitle.
//      Danach: alle ungetaggten Inhalte (Fußzeile, Register-Reiter, Farbleisten, Zier, aria-hidden, Flächen/Linien)
//      als /Artifact markieren (PDF/UA-1, Matterhorn 01-005) – siehe markArtifacts().
//   6. Druck-PDF (Standard bei src/index.html): 216 × 303 mm, randabfallende Flächen 3 mm über das Endformat gezogen,
//      TrimBox/BleedBox gesetzt. RGB – die Konvertierung nach PDF/X-4 (ICC-Profil des Papiers) macht die Druckerei.

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const zlib = require('zlib');
const { chromium } = require('playwright');
const { PDFDocument, PDFName, PDFHexString, PDFNumber, PDFNull, PDFArray, PDFBool, PDFRef } = require('pdf-lib');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}
const flag = (name) => process.argv.includes(`--${name}`);

const root = path.resolve(__dirname, '..');
const input = path.resolve(root, arg('in', 'src/index.html'));
const pdfOut = path.resolve(root, arg('pdf', 'dist/Mietwohnraumfoerderung-Niedersachsen-2026.pdf'));
const pngDir = arg('png', null) ? path.resolve(root, arg('png')) : null;
const dpi = Number(arg('dpi', '72'));
const isFullDoc = path.basename(input) === 'index.html';
const printOut = flag('no-print')
  ? null
  : arg('print-pdf', null)
    ? path.resolve(root, arg('print-pdf'))
    : isFullDoc ? pdfOut.replace(/\.pdf$/, '-Druck-3mm-Beschnitt.pdf') : null;

const staticDir = path.join(root, 'src', 'fonts', 'static');
const instancesFile = path.join(staticDir, 'instances.json');
const neededFile = path.join(staticDir, 'needed.json');

const META = {
  author: 'Investitions- und Förderbank Niedersachsen – NBank',
  subject: 'Wohnraum, der sich rechnen kann. Konditionen und Modellrechnungen zur RL Mietwohnraum 2026',
  keywords: ['Mietwohnraumförderung', 'Niedersachsen', 'RL Mietwohnraum 2026', 'NBank', 'Sozialer Wohnungsbau'],
  creator: 'NBank',
  lang: 'de-DE',
};

const MM = 72 / 25.4;          // pt je mm
const BLEED_MM = 3;

/* ---------------------------------------------------------------------------------------------
   Im Browser: Schrift-Tupel bestimmen (Familie, Stil, Gewicht, opsz, SOFT, WONK)
   --------------------------------------------------------------------------------------------- */
function browserFontTuples() {
  const AX = { Inter: { opsz: [14, 32] }, Fraunces: { opsz: [9, 144] } };
  const famOf = (ff) => {
    const first = ff.split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (first.startsWith('Fraunces')) return 'Fraunces';
    if (first.startsWith('Inter')) return 'Inter';
    return null;
  };
  const tupleOf = (cs) => {
    const fam = famOf(cs.fontFamily);
    if (!fam) return null;
    const fvs = {};
    if (cs.fontVariationSettings && cs.fontVariationSettings !== 'normal') {
      cs.fontVariationSettings.split(',').forEach((p) => {
        const m = p.trim().match(/^["'](\w{4})["']\s+(-?[\d.]+)/);
        if (m) fvs[m[1]] = Number(m[2]);
      });
    }
    let opsz = fvs.opsz;
    if (opsz === undefined) {
      opsz = cs.fontOpticalSizing === 'none' ? (fam === 'Inter' ? 14 : 144) : parseFloat(cs.fontSize);
    }
    const [lo, hi] = AX[fam].opsz;
    opsz = Math.round(Math.min(hi, Math.max(lo, opsz)) * 100) / 100;
    const t = { fam, style: cs.fontStyle === 'italic' ? 'italic' : 'normal', wght: Math.round(Number(cs.fontWeight)), opsz };
    if (fam === 'Fraunces') { t.SOFT = fvs.SOFT ?? 0; t.WONK = fvs.WONK ?? 1; }   // Achsen-Standard Fraunces: SOFT 0, WONK 1
    t.key = [t.fam, t.style, t.wght, t.opsz, t.SOFT ?? '', t.WONK ?? ''].join('|');
    return t;
  };
  const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
  const out = [];
  let n = 0;
  document.querySelectorAll('body *').forEach((el) => {
    if (['STYLE', 'SCRIPT', 'TITLE'].includes(el.tagName)) return;
    const targets = [];
    if (hasOwnText(el)) targets.push(['', getComputedStyle(el)]);
    for (const pseudo of ['::before', '::after']) {
      const ps = getComputedStyle(el, pseudo);
      if (ps.content && ps.content !== 'none' && ps.content !== 'normal' && ps.content !== '""' && ps.display !== 'none') targets.push([pseudo, ps]);
    }
    if (el.matches('.dropcap')) targets.push(['::first-letter', getComputedStyle(el, '::first-letter')]);
    targets.forEach(([pseudo, cs]) => {
      const t = tupleOf(cs);
      if (!t) return;
      out.push({ ...t, pseudo, id: pseudo ? (el.dataset.fi || (el.dataset.fi = String(++n))) : null, el: pseudo ? null : el });
    });
  });
  return out;
}

(async () => {
  const browser = await chromium.launch(
    fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
  );
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  const errors = [];
  const notes = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
  await page.goto('file://' + input, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  // Layout-Schnappschuss (Kanten aller Elemente), um Nebenwirkungen der Nachbearbeitung zu erkennen
  const snapshot = () => page.evaluate(() => [...document.querySelectorAll('.page *')].map((el) => {
    const r = el.getBoundingClientRect();
    return [Math.round(r.left * 4) / 4, Math.round(r.top * 4) / 4, Math.round(r.width * 4) / 4, Math.round(r.height * 4) / 4];
  }));
  const diffSnap = (a, b) => {
    let changed = 0, max = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const d = Math.max(...a[i].map((v, k) => Math.abs(v - b[i][k])));
      if (d > 0.5) { changed++; max = Math.max(max, d); }
    }
    return { changed, max: Math.round(max * 100) / 100, total: a.length };
  };
  const snap0 = await snapshot();

  // 2 · Statische Schriftinstanzen
  const instances = fs.existsSync(instancesFile) ? JSON.parse(fs.readFileSync(instancesFile, 'utf8')) : null;
  {
    const tuples = await page.evaluate(`(${browserFontTuples.toString()})().map(({el, ...t}) => t)`);
    const keys = [...new Set(tuples.map((t) => t.key))];
    const byKey = instances ? new Map(instances.faces.map((f) => [f.key, f])) : new Map();
    const missing = keys.filter((k) => !byKey.has(k));
    if (missing.length) {
      const needed = fs.existsSync(neededFile) ? JSON.parse(fs.readFileSync(neededFile, 'utf8')) : [];
      const all = new Map(needed.map((t) => [t.key, t]));
      tuples.forEach(({ key, fam, style, wght, opsz, SOFT, WONK }) => all.set(key, { key, fam, style, wght, opsz, SOFT, WONK }));
      fs.mkdirSync(staticDir, { recursive: true });
      fs.writeFileSync(neededFile, JSON.stringify([...all.values()].sort((a, b) => a.key.localeCompare(b.key)), null, 1));
      notes.push(`FONT: ${missing.length} von ${keys.length} Schrift-Instanzen fehlen (Type 3 im PDF) – python3 scripts/fonts-static.py ausführen`);
    }
    if (instances && byKey.size) {
      const css = instances.css; // @font-face-Regeln aller Instanzen (relativ zu src/fonts/static/)
      const base = 'file://' + staticDir + '/';
      const result = await page.evaluate(async ({ css, base, map, fnSrc }) => {
        const style = document.createElement('style');
        style.textContent = css.replace(/url\(\.\//g, `url(${base}`);
        document.head.appendChild(style);
        const tuples = (0, eval)(`(${fnSrc})`)();
        const rules = [];
        let mapped = 0;
        tuples.forEach((t) => {
          const fam = map[t.key];
          if (!fam) return;
          mapped++;
          if (t.el) {
            t.el.style.setProperty('font-family', `"${fam}"`, 'important');
            t.el.style.setProperty('font-variation-settings', 'normal', 'important');
            t.el.style.setProperty('font-optical-sizing', 'none', 'important');
            t.el.style.setProperty('font-synthesis', 'none', 'important');
          } else {
            rules.push(`[data-fi="${t.id}"]${t.pseudo}{font-family:"${fam}"!important;font-variation-settings:normal!important;font-optical-sizing:none!important;font-synthesis:none!important}`);
          }
        });
        const ps = document.createElement('style');
        ps.textContent = rules.join('\n');
        document.head.appendChild(ps);
        document.body.offsetHeight;
        await document.fonts.ready;
        const faces = [...document.fonts].filter((f) => f.family.replace(/"/g, '').startsWith('FI '));
        await Promise.all(faces.filter((f) => f.status === 'loading').map((f) => f.loaded.catch(() => null)));
        await document.fonts.ready;
        // Kontrolle: Textstellen ohne Instanz (z. B. Fallback-Schrift für fehlende Glyphen)
        const unmapped = [];
        document.querySelectorAll('.page *').forEach((el) => {
          if (['STYLE', 'SCRIPT', 'TITLE'].includes(el.tagName.toUpperCase())) return;
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) return;
          const ff = getComputedStyle(el).fontFamily;
          if (!/^"?FI /.test(ff)) unmapped.push(`${el.closest('.page').dataset.page}: <${el.tagName.toLowerCase()} class="${el.getAttribute('class') || ''}"> ${el.textContent.trim().slice(0, 40)} (${ff.slice(0, 30)})`);
        });
        return { mapped, total: tuples.length, failed: faces.filter((f) => f.status === 'error').length, unmapped };
      }, { css, base, map: Object.fromEntries(instances.faces.map((f) => [f.key, f.family])), fnSrc: browserFontTuples.toString() });
      if (result.failed) errors.push(`${result.failed} statische Schriftdateien konnten nicht geladen werden`);
      result.unmapped.forEach((u) => notes.push(`FONT: ohne statische Instanz: ${u}`));
      const d = diffSnap(snap0, await snapshot());
      notes.push(`Statische Schriften: ${result.mapped}/${result.total} Textstellen zugeordnet; Layout-Abweichung: ${d.changed} von ${d.total} Elementen (max. ${d.max}px)`);
    }
  }

  // 3 · Ungenutzte weiche Trennstriche entfernen. text-wrap: pretty kann auf eine entfernte (ungenutzte) Trennstelle
  //     reagieren (die gierige Vorab-Brechung ändert sich) – solche Absätze bekommen ihre Trennstriche zurück.
  const shy = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.page *')];
    const snap = () => els.map((el) => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    const before = snap();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('\u00AD')) nodes.push(walker.currentNode);
    const range = document.createRange();
    const orig = new Map();      // Textknoten → Originalwert
    const stripped = new Map();  // Textknoten → Wert ohne ungenutzte Trennstriche
    nodes.forEach((n) => {
      const v = n.nodeValue;
      let out = '';
      for (let i = 0; i < v.length; i++) {
        if (v[i] !== '\u00AD') { out += v[i]; continue; }
        if (i === 0 || i + 1 >= v.length) { out += v[i]; continue; }
        range.setStart(n, i - 1); range.setEnd(n, i);
        const a = range.getBoundingClientRect();
        range.setStart(n, i + 1); range.setEnd(n, i + 2);
        const b = range.getBoundingClientRect();
        if (!a.height || !b.height) { out += v[i]; continue; }          // nicht gesetzt (ausgeblendet)
        const sameLine = Math.abs(b.top - a.top) < 1 && b.left >= a.left;
        if (!sameLine) out += v[i];
      }
      if (out !== v) { orig.set(n, v); stripped.set(n, out); }
    });
    stripped.forEach((out, n) => { n.nodeValue = out; });
    const BLOCK = 'p, li, td, th, dd, dt, h1, h2, h3, h4, figcaption, blockquote, address, aside, section, div';
    let restored = 0;
    for (let round = 0; round < 4; round++) {
      const after = snap();
      const moved = els.filter((el, i) => before[i].some((v, k) => Math.abs(v - after[i][k]) > 0.5));
      if (!moved.length) break;
      const blocks = new Set(moved.map((el) => el.closest(BLOCK) || el));
      // Absatz (und bei Bedarf übergeordnete Blöcke) zurücksetzen
      blocks.forEach((blk) => {
        const target = round < 2 ? blk : (blk.parentElement && blk.parentElement.closest(BLOCK)) || blk;
        orig.forEach((v, n) => { if (target.contains(n) && n.nodeValue !== v) { n.nodeValue = v; restored++; } });
      });
    }
    const finalSnap = snap();
    const stillMoved = els.filter((el, i) => before[i].some((v, k) => Math.abs(v - finalSnap[i][k]) > 0.5)).length;
    const count = (s) => (s.match(/\u00AD/g) || []).length;
    let kept = 0, removed = 0;
    orig.forEach((v, n) => { removed += count(v) - count(n.nodeValue); });
    nodes.forEach((n) => { kept += count(n.nodeValue); });
    return { kept, removed, restored, stillMoved };
  });
  notes.push(`Weiche Trennstriche: ${shy.removed} ungenutzte entfernt, ${shy.kept} behalten (${shy.restored} Textknoten wegen text-wrap zurückgesetzt)`);
  if (shy.stillMoved) errors.push(`Entfernen der weichen Trennstriche hat ${shy.stillMoved} Elemente verschoben`);

  // 4 · Overflow-Check in Druckmedien-Darstellung
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

  // Lesezeichen: je Seite die h1 (Ebene 1) und ihre h2 (Ebene 2), bereinigt (ohne Fußnotenziffern,
  // ohne aria-hidden-Teile, <br> → Leerzeichen, ohne weiche Trennstriche)
  const outline = await page.evaluate(() => {
    const clean = (h) => {
      const c = h.cloneNode(true);
      c.querySelectorAll('.fn, [aria-hidden="true"], .stamp').forEach((x) => x.remove());
      c.querySelectorAll('br').forEach((x) => x.replaceWith(' '));
      return c.textContent.replace(/­/g, '').replace(/\s+/g, ' ').trim();
    };
    return [...document.querySelectorAll('.page')].map((p, i) => {
      const pr = p.getBoundingClientRect();
      const y = (el) => el.getBoundingClientRect().top - pr.top;
      const h1 = p.querySelector('h1');
      return {
        index: i,
        no: Number(p.dataset.page || i + 1),
        title: h1 ? clean(h1) : '',
        y: h1 ? y(h1) : 0,
        children: [...p.querySelectorAll('h2')].filter((h) => !h.closest('[aria-hidden="true"]') && clean(h)).map((h) => ({ title: clean(h), y: y(h) })),
      };
    });
  });
  const docTitle = await page.title();

  fs.mkdirSync(path.dirname(pdfOut), { recursive: true });
  await page.pdf({ path: pdfOut, preferCSSPageSize: true, printBackground: true, tagged: true, outline: false });
  await finishPdf(pdfOut, { outline, docTitle, offset: 0 });

  // 6 · Druck-PDF mit Beschnitt
  if (printOut) {
    await page.evaluate((bleed) => {
      // Chromium rundet das Blattformat auf 1/100 Zoll: Blatt daher in Zoll aufrunden (≥ 3 mm Beschnitt an allen Kanten)
      const W = Math.ceil(((210 + 2 * bleed) / 25.4) * 100) / 100, H = Math.ceil(((297 + 2 * bleed) / 25.4) * 100) / 100;
      const st = document.createElement('style');
      st.textContent = `
        @page { size: ${W}in ${H}in; margin: 0; }
        html, body { background: none !important; padding: 0 !important; }
        .bleed-sheet { width: ${W}in; height: ${H}in; padding: ${bleed}mm 0 0 ${bleed}mm; overflow: hidden;
                       break-after: page; page-break-after: always; }
        .bleed-sheet:last-child { break-after: auto; page-break-after: auto; }
        .bleed-sheet > .page { margin: 0 !important; overflow: visible !important; box-shadow: none !important;
                               break-after: auto !important; page-break-after: auto !important; }
        .cover__art { left: -${bleed}mm !important; top: -${bleed}mm !important; width: calc(${W}in) !important; height: calc(${H}in) !important; }`;
      document.head.appendChild(st);
      // Jede Seite in ein Blatt (Endformat + Beschnitt) in der Seitenfarbe setzen
      document.querySelectorAll('.page').forEach((p) => {
        const sheet = document.createElement('div');
        sheet.className = 'bleed-sheet';
        sheet.style.background = getComputedStyle(p).backgroundColor;
        p.parentNode.insertBefore(sheet, p);
        sheet.appendChild(p);
      });
      document.querySelectorAll('.cover__art > svg').forEach((s) => {
        const vb = s.viewBox.baseVal;
        if (vb && vb.width === 210 && vb.height === 297) s.setAttribute('viewBox', `${-bleed} ${-bleed} ${W * 25.4} ${H * 25.4}`);
      });
      // Randabfallende Flächen (data-bleed und ihre Kinder mit Vollton-Hintergrund): an jeder Kante, die das Endformat
      // berührt, per versetztem Schatten in Hintergrundfarbe um den Beschnitt verlängern – der Satz bleibt unverändert.
      const px = 96 / 25.4;
      const tol = 0.8 * px;
      document.querySelectorAll('.page').forEach((p) => {
        const pr = p.getBoundingClientRect();
        p.querySelectorAll('[data-bleed], [data-bleed] *').forEach((el) => {
          const cs = getComputedStyle(el);
          const bg = cs.backgroundColor;
          if (!bg || bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg) || cs.backgroundImage !== 'none') return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const L = r.left - pr.left < tol, R = pr.right - r.right < tol, T = r.top - pr.top < tol, B = pr.bottom - r.bottom < tol;
          const sh = [];
          const d = `${bleed}mm`, n = `-${bleed}mm`;
          if (L) sh.push(`${n} 0`); if (R) sh.push(`${d} 0`); if (T) sh.push(`0 ${n}`); if (B) sh.push(`0 ${d}`);
          if (L && T) sh.push(`${n} ${n}`); if (R && T) sh.push(`${d} ${n}`); if (L && B) sh.push(`${n} ${d}`); if (R && B) sh.push(`${d} ${d}`);
          if (sh.length) el.style.setProperty('box-shadow', sh.map((s) => `${s} 0 0 ${bg}`).join(', '), 'important');
        });
      });
      document.body.offsetHeight;
    }, BLEED_MM);
    await page.pdf({ path: printOut, preferCSSPageSize: true, printBackground: true, tagged: true, outline: false });
    await finishPdf(printOut, { outline, docTitle, offset: BLEED_MM, print: true });
  }
  await browser.close();

  const info = execFileSync('pdfinfo', [pdfOut]).toString();
  const pdfPages = Number((info.match(/Pages:\s+(\d+)/) || [])[1]);
  console.log(`PDF: ${pdfOut}`);
  console.log(`.page-Elemente: ${report.pages}, PDF-Seiten: ${pdfPages}, Tagged: ${(info.match(/Tagged:\s+(\w+)/) || [])[1]}`);
  if (printOut) {
    const pinfo = execFileSync('pdfinfo', ['-box', printOut]).toString();
    console.log(`Druck-PDF: ${printOut} (${(pinfo.match(/Page size:\s+([^\n]+)/) || [])[1]}, TrimBox ${((pinfo.match(/TrimBox:\s+([^\n]+)/) || [])[1] || '').trim()})`);
  }
  if (report.pages !== pdfPages) console.log('WARNUNG: Seitenzahl im PDF weicht von der Anzahl .page-Elemente ab (Umbruch/Overflow?)');
  notes.forEach((n) => console.log(n));
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

/* ---------------------------------------------------------------------------------------------
   PDF-Nachbearbeitung mit pdf-lib: Metadaten, XMP, Lesezeichen, Seitenboxen
   --------------------------------------------------------------------------------------------- */
async function finishPdf(file, { outline, docTitle, offset, print }) {
  const doc = await PDFDocument.load(fs.readFileSync(file), { updateMetadata: false });
  const ctx = doc.context;
  const catalog = doc.catalog;
  const pages = doc.getPages();
  const title = docTitle || 'Mietwohnraumförderung Niedersachsen 2026';

  doc.setTitle(title, { showInWindowTitleBar: true });
  doc.setAuthor(META.author);
  doc.setSubject(META.subject);
  doc.setKeywords(META.keywords);
  doc.setCreator(META.creator);
  doc.setLanguage(META.lang);
  const created = doc.getCreationDate() || new Date();
  doc.setModificationDate(new Date());

  // XMP-Metadatenstrom (unkomprimiert)
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const iso = (d) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  const xmp = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/">
   <dc:format>application/pdf</dc:format>
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(title)}</rdf:li></rdf:Alt></dc:title>
   <dc:creator><rdf:Seq><rdf:li>${esc(META.author)}</rdf:li></rdf:Seq></dc:creator>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${esc(META.subject)}</rdf:li></rdf:Alt></dc:description>
   <dc:subject><rdf:Bag>${META.keywords.map((k) => `<rdf:li>${esc(k)}</rdf:li>`).join('')}</rdf:Bag></dc:subject>
   <dc:language><rdf:Bag><rdf:li>${META.lang}</rdf:li></rdf:Bag></dc:language>
   <pdf:Keywords>${esc(META.keywords.join(', '))}</pdf:Keywords>
   <pdf:Producer>${esc(doc.getProducer() || 'Skia/PDF')}</pdf:Producer>
   <xmp:CreatorTool>${esc(META.creator)}</xmp:CreatorTool>
   <xmp:CreateDate>${iso(created)}</xmp:CreateDate>
   <xmp:ModifyDate>${iso(new Date())}</xmp:ModifyDate>
   <xmp:MetadataDate>${iso(new Date())}</xmp:MetadataDate>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
  const xmpStream = ctx.stream(Buffer.from(xmp, 'utf8'), { Type: 'Metadata', Subtype: 'XML' });
  catalog.set(PDFName.of('Metadata'), ctx.register(xmpStream));

  // Lesezeichen: „S. 8 · Bis zu 80 % Förderquote“, darunter die Modultitel (h2) der Seite
  const outlinesRef = ctx.nextRef();
  const top = [];
  const dest = (pi, yPx) => {
    const pg = pages[pi];
    const h = pg.getHeight();
    const yPt = Math.max(0, h - (offset * MM + (yPx * 0.75)) + 6);
    return ctx.obj([pg.ref, PDFName.of('XYZ'), PDFNull, PDFNumber.of(Math.round(yPt * 100) / 100), PDFNull]);
  };
  const mkItems = (list, parentRef) => {
    const refs = list.map(() => ctx.nextRef());
    list.forEach((it, i) => {
      const d = ctx.obj({});
      d.set(PDFName.of('Title'), PDFHexString.fromText(it.title));
      d.set(PDFName.of('Parent'), parentRef);
      d.set(PDFName.of('Dest'), dest(it.page, it.y));
      if (i > 0) d.set(PDFName.of('Prev'), refs[i - 1]);
      if (i < list.length - 1) d.set(PDFName.of('Next'), refs[i + 1]);
      if (it.children && it.children.length) {
        const kids = mkItems(it.children.map((c) => ({ ...c, page: it.page })), refs[i]);
        d.set(PDFName.of('First'), kids[0]);
        d.set(PDFName.of('Last'), kids[kids.length - 1]);
        d.set(PDFName.of('Count'), PDFNumber.of(-kids.length));   // zugeklappt
      }
      ctx.assign(refs[i], d);
    });
    return refs;
  };
  outline.forEach((p) => {
    if (p.index >= pages.length) return;
    top.push({ title: `S. ${p.no} · ${p.title || 'Seite ' + p.no}`, page: p.index, y: p.y, children: p.children });
  });
  if (top.length) {
    const refs = mkItems(top, outlinesRef);
    const root = ctx.obj({});
    root.set(PDFName.of('Type'), PDFName.of('Outlines'));
    root.set(PDFName.of('First'), refs[0]);
    root.set(PDFName.of('Last'), refs[refs.length - 1]);
    root.set(PDFName.of('Count'), PDFNumber.of(refs.length));
    ctx.assign(outlinesRef, root);
    catalog.set(PDFName.of('Outlines'), outlinesRef);
    catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
  }

  // Subset-Präfixe eindeutig machen: Chrome vergibt sie je Seite neu (erste Schrift der Seite „AAAAAA+“, zweite „BAAAAA+“ …),
  // dieselbe Schrift steht so auf jeder Seite als eigene Teilmenge unter demselben Namen. ISO 32000 (9.6.4): verschiedene
  // Teilmengen brauchen verschiedene Präfixe. Neues Präfix = 6 Buchstaben aus dem MD5 des eingebetteten Fontprogramms
  // (gleiche Datei → gleicher Name, reproduzierbar). Die Basisnamen sind seit scripts/fonts-static.py je Instanz eindeutig.
  {
    const crypto = require('crypto');
    const tagOf = new Map();   // md5 → Präfix
    const used = new Set();
    const mkTag = (md5) => {
      if (tagOf.has(md5)) return tagOf.get(md5);
      let n = BigInt('0x' + md5.slice(0, 15)), tag;
      do { tag = ''; let m = n; for (let i = 0; i < 6; i++) { tag += String.fromCharCode(65 + Number(m % 26n)); m /= 26n; } n++; } while (used.has(tag));
      used.add(tag); tagOf.set(md5, tag);
      return tag;
    };
    const rename = (dict, key, tag) => {
      const v = dict.get(PDFName.of(key));
      if (!v) return;
      const name = v.decodeText ? v.decodeText() : v.asString().replace(/^\//, '');
      dict.set(PDFName.of(key), PDFName.of(`${tag}+${name.replace(/^[A-Z]{6}\+/, '')}`));
    };
    let fixed = 0;
    ctx.enumerateIndirectObjects().forEach(([, obj]) => {
      if (!obj || !obj.get || String(obj.get(PDFName.of('Type'))) !== '/Font' || String(obj.get(PDFName.of('Subtype'))) !== '/Type0') return;
      const desc = ctx.lookup(ctx.lookup(obj.get(PDFName.of('DescendantFonts'))).get(0));
      const fd = desc && ctx.lookup(desc.get(PDFName.of('FontDescriptor')));
      const ff = fd && (fd.get(PDFName.of('FontFile2')) || fd.get(PDFName.of('FontFile3')) || fd.get(PDFName.of('FontFile')));
      if (!ff) return;
      const md5 = crypto.createHash('md5').update(Buffer.from(ctx.lookup(ff).contents)).digest('hex');
      const tag = mkTag(md5);
      rename(obj, 'BaseFont', tag); rename(desc, 'BaseFont', tag); rename(fd, 'FontName', tag);
      fixed++;
    });
    if (fixed) console.log(`Schriften: ${fixed} Teilmengen, ${tagOf.size} verschiedene Fontprogramme mit eindeutigem Präfix (${path.basename(file)})`);
  }

  // Ungetaggte Inhalte als Artefakt kennzeichnen (PDF/UA-1: „Inhalt weder getaggt noch Artefakt“)
  const art = { pages: 0, runs: 0 };
  pages.forEach((pg) => {
    const c = pg.node.get(PDFName.of('Contents'));
    if (!c) return;
    const refs = c instanceof PDFArray ? c.asArray() : [c];
    const parts = refs.map((r) => {
      const st = ctx.lookup(r);
      const f = st.dict.get(PDFName.of('Filter'));
      if (f && String(f) !== '/FlateDecode') throw new Error(`Content-Stream mit Filter ${f} nicht unterstützt`);
      return f ? zlib.inflateSync(Buffer.from(st.contents)) : Buffer.from(st.contents);
    });
    const res = markArtifacts(Buffer.concat(parts.flatMap((b, i) => (i ? [Buffer.from('\n'), b] : [b]))));
    if (!res.runs) return;
    const stream = ctx.flateStream(res.data);
    pg.node.set(PDFName.of('Contents'), ctx.register(stream));
    refs.forEach((r) => { if (r instanceof PDFRef) ctx.delete(r); });
    art.pages++; art.runs += res.runs;
  });
  console.log(`Artefakte: ${art.runs} ungetaggte Mal-Läufe auf ${art.pages} Seiten als /Artifact markiert (${path.basename(file)})`);

  // Druck-PDF: Endformat (TrimBox) und Beschnitt (BleedBox)
  if (print) {
    const b = offset * MM;
    const trimW = 210 * MM, trimH = 297 * MM;
    pages.forEach((pg) => {
      const { width, height } = pg.getSize();
      // Inhalt beginnt exakt 3 mm von links/oben; Chromium rundet die Blattgröße, daher Endformat von oben links messen
      pg.setBleedBox(0, 0, width, height);
      pg.setTrimBox(b, height - b - trimH, trimW, trimH);
      pg.setCropBox(0, 0, width, height);
    });
  }

  fs.writeFileSync(file, await doc.save({ useObjectStreams: false }));
}

/* ---------------------------------------------------------------------------------------------
   Artefakte: Chrome taggt nur Inhalte mit Strukturbezug (BDC mit MCID). Alles andere – Seitengrund, Flächen, Linien,
   aria-hidden-Text (Fußzeile, Register-Reiter, Farbleisten, Zier-Anführungszeichen, Pfeile) – steht außerhalb jeder
   Marked-Content-Sequenz. markArtifacts() umschließt jeden solchen Mal-Lauf mit „/Artifact BMC … EMC“.
   Regeln: Ein Pfad wird samt Konstruktion (m/l/c/re … f/S) umschlossen; reine Clip-Pfade („W n“) zeichnen nichts und
   bleiben unberührt. Ein Lauf, der in BT…ET beginnt, endet im selben Textobjekt. Läufe enden vor q/Q, BT/ET, BDC/BMC
   und EMC – sie sind damit sauber mit Grafikzustand, Textobjekten und Chromes Marked Content verschachtelt.
   Form-XObjects ohne eigenes Marked Content („Do“ auf Tiefe 0) werden als Ganzes Artefakt.
   --------------------------------------------------------------------------------------------- */
function tokenizeContent(buf) {
  const cmds = [];
  const n = buf.length;
  let i = 0, start = -1;
  const ws = (c) => c === 0x20 || c === 0x0a || c === 0x0d || c === 0x09 || c === 0x0c || c === 0x00;
  const delim = (c) => c === 0x28 || c === 0x29 || c === 0x3c || c === 0x3e || c === 0x5b || c === 0x5d || c === 0x7b || c === 0x7d || c === 0x2f || c === 0x25;
  while (i < n) {
    const c = buf[i];
    if (ws(c)) { i++; continue; }
    if (start < 0) start = i;
    if (c === 0x25) { while (i < n && buf[i] !== 0x0a && buf[i] !== 0x0d) i++; continue; }          // % Kommentar
    if (c === 0x28) {                                                                                 // (String)
      let depth = 0;
      for (; i < n; i++) {
        if (buf[i] === 0x5c) { i++; continue; }
        if (buf[i] === 0x28) depth++;
        else if (buf[i] === 0x29 && --depth === 0) { i++; break; }
      }
      continue;
    }
    if (c === 0x3c) { if (buf[i + 1] === 0x3c) { i += 2; continue; } while (i < n && buf[i] !== 0x3e) i++; i++; continue; }
    if (c === 0x3e) { i += buf[i + 1] === 0x3e ? 2 : 1; continue; }
    if (c === 0x5b || c === 0x5d || c === 0x7b || c === 0x7d) { i++; continue; }
    if (c === 0x2f) { i++; while (i < n && !ws(buf[i]) && !delim(buf[i])) i++; continue; }          // /Name
    const s = i;
    while (i < n && !ws(buf[i]) && !delim(buf[i])) i++;
    const tok = buf.toString('latin1', s, i);
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(tok) || tok === 'true' || tok === 'false' || tok === 'null') continue;
    if (tok === 'BI') return null;                                                                    // Inline-Bild: nicht anfassen
    cmds.push({ op: tok, start, end: i });
    start = -1;
  }
  return cmds;
}

function markArtifacts(buf) {
  const cmds = tokenizeContent(buf);
  if (!cmds) return { data: buf, runs: 0 };
  const PATH = new Set(['m', 'l', 'c', 'v', 'y', 'h', 're', 'W', 'W*']);
  const PAINT = new Set(['S', 's', 'f', 'F', 'f*', 'B', 'B*', 'b', 'b*']);
  const SHOW = new Set(['Tj', 'TJ', "'", '"']);
  const CLOSE = new Set(['q', 'Q', 'BT', 'ET', 'BDC', 'BMC', 'EMC']);
  const out = [];
  let pos = 0, depth = 0, open = false, runs = 0;
  const emit = (to) => { if (to > pos) { out.push(buf.subarray(pos, to)); pos = to; } };
  const openAt = (at) => { if (open) return; emit(at); out.push(Buffer.from('/Artifact BMC\n')); open = true; runs++; };
  const closeAt = (at) => { if (!open) return; emit(at); out.push(Buffer.from('\nEMC\n')); open = false; };
  for (let k = 0; k < cmds.length; k++) {
    const cm = cmds[k];
    if (CLOSE.has(cm.op)) closeAt(cm.start);
    if (cm.op === 'BDC' || cm.op === 'BMC') depth++;
    else if (cm.op === 'EMC') depth = Math.max(0, depth - 1);
    else if (depth === 0 && PATH.has(cm.op)) {
      // ganzen Pfad bis zum Mal-Operator betrachten; nur zeichnende Pfade werden Artefakt
      let j = k;
      while (j < cmds.length && PATH.has(cmds[j].op)) j++;
      if (j < cmds.length && PAINT.has(cmds[j].op)) openAt(cm.start);
      k = j < cmds.length && (PAINT.has(cmds[j].op) || cmds[j].op === 'n') ? j : j - 1;   // Konstruktion + Mal-Operator überspringen
      continue;
    } else if (depth === 0 && (SHOW.has(cm.op) || cm.op === 'Do' || cm.op === 'sh' || PAINT.has(cm.op))) {
      openAt(cm.start);
    }
  }
  closeAt(buf.length);
  emit(buf.length);
  return { data: Buffer.concat(out), runs };
}
