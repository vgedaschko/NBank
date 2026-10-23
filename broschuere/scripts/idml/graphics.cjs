// Grafiken (Inline-SVG, img) und Flächen mit Verlauf/Muster als eigenständige Vektor-PDFs rendern.
// Verfahren: frische Seite laden, gleiche Vorbereitung/Extraktion (gleiche Kennungen), dann alle Ziele einer Art
// je auf ein eigenes Druckblatt stellen (oben links), EIN page.pdf()-Aufruf, mit pdf-lib je Blatt auf die
// Elementgröße (+ Beschnittzugabe) zuschneiden. Texte in SVGs bleiben Teil der Grafik; sie werden mit den
// Desktop-Schnitten aus „Document Fonts“ gesetzt (keine Type-3-Schriften, gleiche Schnitte wie im IDML-Text).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { PDFDocument } = require('pdf-lib');
const B = require('./browser.cjs');
const { germanName } = require('./build.cjs');
// Dateinamen nur aus ASCII (Umlaute umschreiben), Wörter mit Bindestrich
const asciiSlug = (s) => String(s).replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ß/g, 'ss')
  .normalize('NFKD').replace(/[^\x20-\x7e]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Im Browser: SVG-Texte auf die Desktop-Schnitte umstellen
async function mapGraphicFonts(opts) {
  const H = window.__idml;
  const st = document.createElement('style');
  st.textContent = opts.faces.map((f) => `@font-face{font-family:"${f.cssName}";src:url("${f.url}") format("truetype");font-weight:400;font-style:normal;font-display:block}`).join('\n');
  document.head.appendChild(st);
  const pick = (o) => {
    const same = opts.faces.filter((f) => f.cssFamily === o.family);
    if (!same.length) return null;
    const it = same.filter((f) => f.italic === o.italic);
    const pool = it.length ? it : same;
    const wd = (f) => Math.abs(f.weight - o.weight) * 10 + (f.weight > o.weight ? (o.weight > 500 ? 0 : 1) : (o.weight < 400 ? 0 : 1));
    const opsz = o.fvs.opsz !== undefined ? o.fvs.opsz : o.opticalAuto ? o.sizePx : null;
    const od = (f) => (opsz && f.opsz ? Math.abs(Math.log(opsz / f.opsz)) : 0);
    return pool.slice().sort((a, b) => wd(a) - wd(b) || od(a) - od(b))[0];
  };
  let mapped = 0;
  document.querySelectorAll('[data-idml-g] *, [data-idml-g]').forEach((el) => {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) return;
    const o = H.fontOrig.get(el);
    if (!o) return;
    const f = pick(o);
    if (!f) return;
    el.style.setProperty('font-family', `"${f.cssName}"`, 'important');
    el.style.setProperty('font-weight', '400', 'important');
    el.style.setProperty('font-style', 'normal', 'important');
    el.style.setProperty('font-variation-settings', 'normal', 'important');
    el.style.setProperty('font-optical-sizing', 'none', 'important');
    el.style.setProperty('font-synthesis', 'none', 'important');
    mapped++;
  });
  document.body.offsetHeight;
  await document.fonts.ready;
  const faces = [...document.fonts].filter((f) => f.family.replace(/"/g, '').startsWith('IDML '));
  await Promise.all(faces.map((f) => f.load().catch(() => null)));
  await document.fonts.ready;
  return { mapped, failed: faces.filter((f) => f.status === 'error').length };
}

async function renderGraphics({ browser, url, model, linksDir, fontsDir, faces, opts, log }) {
  const out = new Map();
  const warnings = [];
  const warn = (m) => { warnings.push(m); log('  Warnung: ' + m); };
  out.warnings = warnings;
  fs.mkdirSync(linksDir, { recursive: true });
  const bleedPx = (opts.bleedMm ?? 3) * 96 / 25.4;
  const kinds = [['g', 'graphics'], ['d', 'decors']];
  const hashes = new Map();
  let files = 0;
  const fontFaces = (faces || []).filter((f) => f.file).map((f, i) => ({
    cssName: `IDML ${i} ${f.family} ${f.style}`, url: pathToFileURL(path.join(fontsDir, f.file)).href,
    cssFamily: f.cssFamily, italic: f.italic, weight: f.weightClass, opsz: f.axes && f.axes.opsz,
  }));
  for (const [kind, key] of kinds) {
    let items = [];
    model.pages.forEach((pg) => pg[key].forEach((g) => {
      const left = pg.number % 2 === 0;
      // Beschnittzugabe nur an Außenkanten (oben, unten, außen), nie am Bund
      const b = { l: g.edges.l && left ? bleedPx : 0, r: g.edges.r && !left ? bleedPx : 0, t: g.edges.t ? bleedPx : 0, b: g.edges.b ? bleedPx : 0 };
      // Flächen (Verlauf/Muster): die Box wächst in den Beschnitt; nicht erweiterbare (Rahmen, Ecken, Clip) bleiben bündig
      if (kind === 'd' && !g.growable) { b.l = 0; b.r = 0; b.t = 0; b.b = 0; }
      // Grafiken: sichtbarer Überstand (SVG-Beschriftungen über die Box hinaus) wie eine Beschnittzugabe mitrendern
      if (g.ink) for (const k of ['l', 't', 'r', 'b']) b[k] = Math.max(b[k], g.ink[k] || 0);
      items.push({ id: g.id, page: pg.number, w: g.w / 0.75, h: g.h / 0.75, bleed: b, grow: kind === 'd', g });
    }));
    if (!items.length) continue;
    // gleich aussehende Flächen (gleiche Signatur, gleiche Beschnittzugabe) nur einmal rendern und gemeinsam verknüpfen
    const firstOf = new Map();
    items.forEach((it) => {
      const k = kind === 'd' && it.g.sig ? `${it.g.sig}|${JSON.stringify(it.bleed)}` : null;
      if (k && firstOf.has(k)) it.dupOf = firstOf.get(k); else if (k) firstOf.set(k, it);
    });
    const allItems = items;
    items = items.filter((it) => !it.dupOf);
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(B.installHelpers);
    await page.evaluate(B.prepare, { pageSelector: opts.pageSelector });
    const again = await page.evaluate(B.extract, { pageSelector: opts.pageSelector, bleedTolMm: opts.bleedTolMm, tables: opts.tables, footSelector: opts.footSelector });
    const n = kind === 'g' ? again.graphicsCount : again.decorCount;
    if (n !== allItems.length) throw new Error(`Grafik-Durchgang: ${n} statt ${allItems.length} Elemente gefunden (DOM nicht deterministisch?)`);
    if (kind === 'g' && fontFaces.length) {
      const r = await page.evaluate(mapGraphicFonts, { faces: fontFaces });
      if (r.failed) warn(`${r.failed} Schriftdateien für Grafiken nicht geladen`);
    }
    const slotW = Math.ceil(Math.max(...items.map((i) => i.w + i.bleed.l + i.bleed.r)) / 96 + 0.01) * 96;
    const slotH = Math.ceil(Math.max(...items.map((i) => i.h + i.bleed.t + i.bleed.b)) / 96 + 0.01) * 96;
    const placed = await page.evaluate(B.stageGraphics, { kind, slotW, slotH, items: items.map((i) => ({ id: i.id, bleed: i.bleed, grow: i.grow })) });
    // Lagekontrolle
    placed.forEach((p, k) => {
      const it = items[k];
      const ex = it.grow ? 0 : it.bleed.l, ey = it.grow ? 0 : it.bleed.t;
      if (Math.abs(p.x - ex) > 0.6 || Math.abs(p.y - ey) > 0.6) warn(`${kind}${it.id} (S. ${it.page}) liegt beim Rendern bei ${p.x.toFixed(2)}/${p.y.toFixed(2)} statt ${ex.toFixed(2)}/${ey.toFixed(2)} px`);
    });
    const tmpPdf = path.join(linksDir, `.render-${kind}.pdf`);
    await page.pdf({ path: tmpPdf, preferCSSPageSize: true, printBackground: true, pageRanges: `1-${items.length}`, tagged: false, outline: false });
    await page.close();
    const src = await PDFDocument.load(fs.readFileSync(tmpPdf));
    if (src.getPageCount() < items.length) throw new Error(`Grafik-PDF hat ${src.getPageCount()} statt ${items.length} Seiten`);
    const counters = new Map();
    for (let k = 0; k < items.length; k++) {
      const it = items[k];
      const sp = src.getPage(k);
      const { height: ph } = sp.getSize();
      const wpt = (it.w + it.bleed.l + it.bleed.r) * 0.75, hpt = (it.h + it.bleed.t + it.bleed.b) * 0.75;
      const doc = await PDFDocument.create();
      const emb = await doc.embedPage(sp, { left: 0, bottom: ph - hpt, right: wpt, top: ph });
      const np = doc.addPage([wpt, hpt]);
      np.drawPage(emb, { x: 0, y: 0, width: wpt, height: hpt });
      doc.setProducer('scripts/export-idml.cjs (Chromium/Skia, pdf-lib)');
      doc.setCreator('scripts/export-idml.cjs');
      doc.setCreationDate(new Date(0));
      doc.setModificationDate(new Date(0));
      const bytes = Buffer.from(await doc.save({ useObjectStreams: false }));
      const hash = crypto.createHash('sha1').update(bytes).digest('hex');
      let file = hashes.get(hash);
      if (!file) {
        // sprechender Dateiname: Seite(n), Bauteil deutsch (aus der CSS-Klasse), laufende Nummer, ggf. Beschriftung
        const ok = (c) => !/^(u-|l-|is-|has-|bs-\d|on-|c-)/.test(c);
        const srcCls = (it.g.cls || []).filter(ok).concat((it.g.parentCls || []).filter(ok));
        const key = srcCls.length ? srcCls[0].replace(/^p\d{2}-/, '') : (it.g.tag || 'grafik');
        const word = germanName(key === 'idml-pseudo' ? 'zier' : key, 'para');
        const label = (it.g.label || '').split(/[,.;:–—(]/)[0].trim().split(/\s+/).slice(0, 4).join(' ');
        const slug = asciiSlug(word).slice(0, 28) + (label && label.length <= 40 ? `-${asciiSlug(label).slice(0, 32)}` : '');
        const pagesUsed = [...new Set(allItems.filter((x) => x === it || x.dupOf === it).map((x) => x.page))].sort((a, b) => a - b);
        const pre = pagesUsed.length > 1 ? `S${String(pagesUsed[0]).padStart(2, '0')}-${String(pagesUsed[pagesUsed.length - 1]).padStart(2, '0')}` : `S${String(it.page).padStart(2, '0')}`;
        const c = (counters.get(pre) || 0) + 1;
        counters.set(pre, c);
        file = `${pre}-${kind === 'g' ? 'Grafik' : 'Flaeche'}-${String(c).padStart(2, '0')}-${slug}.pdf`.replace(/-+/g, '-');
        fs.writeFileSync(path.join(linksDir, file), bytes);
        hashes.set(hash, file);
        files++;
      }
      out.set(`${kind}${it.id}`, { file: 'Links/' + file, name: file.replace(/\.pdf$/, ''), pdfW: wpt, pdfH: hpt, bleed: it.bleed });
    }
    fs.rmSync(tmpPdf, { force: true });
    allItems.filter((it) => it.dupOf).forEach((it) => out.set(`${kind}${it.id}`, out.get(`${kind}${it.dupOf.id}`)));
  }
  log(`Grafiken: ${out.size} platziert, ${files} PDF-Dateien in Links/ (gleiche Grafiken zusammengefasst)`);
  return out;
}

module.exports = { renderGraphics };
