#!/usr/bin/env node
// Vektorschraffur für das Designsystem „Planwerk“ (Korrekturlauf 1, Stand 30.09.2026).
//
// Warum: Chromium rastert SVG-<pattern>-Füllungen und gekachelte CSS-Muster (repeating-linear-gradient,
// Verlauf mit background-size + repeat) beim PDF-Export als Bild mit 72 dpi – die Schraffur ist im Druck verpixelt.
// Deshalb werden Schraffuren als echte, auf das Rechteck vorgeschnittene 45°-Linien in EINEM <path> gesetzt
// (kein <pattern>, kein clip-path, keine IDs). Ergebnis: reine Vektorpfade in PDF und IDML.
//
// Markup im Partial (1 SVG-Einheit = 1 mm):
//   <rect class="c-equity" x="107" y="8.6" width="23.5" height="6.2"/>                 Fläche (Tönung)
//   <path class="hatch" data-hatch="107 8.6 23.5 6.2" d="…"/>                           Linien (d wird erzeugt)
//   <rect class="c-equity-frame" x="107" y="8.6" width="23.5" height="6.2"/>           Rahmen (optional, deckt die Linienenden)
// Mehrere Rechtecke in einem Pfad: data-hatch="107 8.6 23.5 6.2; 107 23.2 23.5 6.2".
// Optional: data-hatch-step="1.2" (Linienabstand in mm, rechtwinklig gemessen; Standard 1,2) und
// data-hatch-dir="\" (Gegenrichtung; Standard „/“ = von links unten nach rechts oben).
// Die Linien sind global verankert (wie patternUnits="userSpaceOnUse"): Nachbarflächen laufen bündig durch.
//
// Nutzung:
//   node scripts/schraffur.cjs --sync [Dateien …]     d-Attribute aller path[data-hatch] neu berechnen und zurückschreiben
//                                                     (ohne Dateien: src/pages/*.html)
//   node scripts/schraffur.cjs --check [Dateien …]    meldet <pattern>, CSS-Muster und veraltete d-Attribute (Exit 1)
//   node scripts/schraffur.cjs "x y w h" [--step 1.2] [--dir '\'] [--class "hatch"]
//                                                     gibt ein fertiges <path class="hatch" …/> aus
//   node scripts/schraffur.cjs --css                  gibt die Daten-URIs für styles.css aus (Legende, Planraster)
// assemble.cjs ruft expandHatches() für jedes Partial auf – der Build ist also auch ohne --sync richtig;
// --sync hält das Partial (= Satz) synchron.

const fs = require('fs');
const path = require('path');

const STEP = 1.2;          // Linienabstand in mm (rechtwinklig)
const MIN_SEG = 0.12;      // Eckfragmente kürzer als das entfallen (würden als Punkt erscheinen)

const fmt = (n) => {
  const s = (Math.round(n * 1000) / 1000).toFixed(3).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
};

// Vorgeschnittene 45°-Linien für ein oder mehrere Rechtecke → path-d
function hatchPath(rects, { step = STEP, dir = '/' } = {}) {
  const d = step * Math.SQRT2;          // Abstand der Linien entlang der Achsen
  const out = [];
  for (const [x0, y0, w, h] of rects) {
    const x1 = x0 + w, y1 = y0 + h;
    if (dir === '/') {
      // Linien x + y = c
      for (let k = Math.ceil((x0 + y0) / d); k * d <= x1 + y1 + 1e-9; k++) {
        const c = k * d;
        const xs = Math.max(x0, c - y1), xe = Math.min(x1, c - y0);
        if ((xe - xs) * Math.SQRT2 < MIN_SEG) continue;
        out.push(`M${fmt(xs)},${fmt(c - xs)}L${fmt(xe)},${fmt(c - xe)}`);
      }
    } else {
      // Linien x − y = c
      for (let k = Math.ceil((x0 - y1) / d); k * d <= x1 - y0 + 1e-9; k++) {
        const c = k * d;
        const xs = Math.max(x0, c + y0), xe = Math.min(x1, c + y1);
        if ((xe - xs) * Math.SQRT2 < MIN_SEG) continue;
        out.push(`M${fmt(xs)},${fmt(xs - c)}L${fmt(xe)},${fmt(xe - c)}`);
      }
    }
  }
  return out.join('');
}

const parseRects = (s) => s.split(';').map((r) => r.trim()).filter(Boolean).map((r) => {
  const v = r.split(/[\s,]+/).map(Number);
  if (v.length !== 4 || v.some((n) => !Number.isFinite(n))) throw new Error(`data-hatch: ungültiges Rechteck „${r}“ (erwartet „x y w h“)`);
  return v;
});

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? m[1] : null;
};

// Füllt/aktualisiert das d-Attribut jedes <path … data-hatch="…">
function expandHatches(html) {
  let count = 0, changed = 0;
  const res = html.replace(/<path\b[^>]*\sdata-hatch="[^"]*"[^>]*>/g, (tag) => {
    count++;
    const rects = parseRects(attr(tag, 'data-hatch'));
    const step = attr(tag, 'data-hatch-step');
    const dir = (attr(tag, 'data-hatch-dir') || '/').replace(/&#92;|\\\\/g, '\\');
    const d = hatchPath(rects, { step: step ? Number(step) : STEP, dir: dir === '\\' ? '\\' : '/' });
    let next;
    if (/\sd="[^"]*"/.test(tag)) next = tag.replace(/\sd="[^"]*"/, ` d="${d}"`);
    else next = tag.replace(/\s*(\/?)>$/, (m, slash) => ` d="${d}"${slash}>`);
    if (next !== tag) changed++;
    return next;
  });
  return { html: res, count, changed };
}

// Muster, die Chromium im PDF rastert
function findRasterPatterns(text) {
  const hits = [];
  const lines = text.split('\n');
  lines.forEach((l, i) => {
    if (/<pattern\b/.test(l)) hits.push(`${i + 1}: SVG-<pattern>`);
    if (/repeating-(linear|radial|conic)-gradient/.test(l)) hits.push(`${i + 1}: CSS repeating-*-gradient`);
    if (/background-size/.test(l) && /gradient/.test(lines.slice(Math.max(0, i - 3), i + 1).join(' ')) && !/no-repeat/.test(l)) {
      hits.push(`${i + 1}: gekachelter CSS-Verlauf (background-size ohne no-repeat)`);
    }
  });
  return hits;
}

// --- Daten-URIs für styles.css (Farben fest, weil url() keine Tokens kennt) ---
const enc = (svg) => `url("data:image/svg+xml,${svg.replace(/"/g, "'").replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
function cssDataUris() {
  const sw = { w: 4.6, h: 3 };
  const swEquity = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sw.w} ${sw.h}" preserveAspectRatio="none">`
    + `<rect width="${sw.w}" height="${sw.h}" fill="#DCD8D3"/>`
    + `<path d="${hatchPath([[0, 0, sw.w, sw.h]])}" stroke="#8E8A85" stroke-width=".2" fill="none"/>`
    + `<rect x=".1" y=".1" width="${fmt(sw.w - 0.2)}" height="${fmt(sw.h - 0.2)}" stroke="#8E8A85" stroke-width=".2" fill="none"/></svg>`;
  const swCap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sw.w} ${sw.h}" preserveAspectRatio="none">`
    + `<rect x=".125" y=".125" width="${fmt(sw.w - 0.25)}" height="${fmt(sw.h - 0.25)}" stroke="#B71E3F" stroke-width=".25" stroke-dasharray="1 .6" fill="none"/></svg>`;
  const swAxis = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sw.w} .25" preserveAspectRatio="none">`
    + `<path d="M0,.125H${sw.w}" stroke="#B71E3F" stroke-width=".25" stroke-dasharray="1.6 .5 .4 .5"/></svg>`;
  // Planraster 5 mm (Rechenblatt): eine Zeichnung 180 × 260 mm, nicht gekachelt, links oben angelegt
  let p = 'M0,0v260';
  for (let x = 5; x <= 180; x += 5) p += 'm5,-260v260';
  p += 'M0,0h180';
  for (let y = 5; y <= 260; y += 5) p += 'm-180,5h180';
  const plan = `<svg xmlns="http://www.w3.org/2000/svg" width="180mm" height="260mm" viewBox="0 0 180 260">`
    + `<path d="${p}" stroke="#ECEAE7" stroke-width=".2" fill="none"/></svg>`;
  // Strichpunkt-Linien in CSS (ohne viewBox: Einheiten = CSS-px, 1 mm = 3,7795 px; Linie über die volle Breite/Höhe)
  const px = (mm) => fmt(mm * 96 / 25.4);
  const dashH = `<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="50%" x2="100%" y2="50%" stroke="#202020" stroke-width="40" stroke-dasharray="${px(6)} ${px(1.2)} ${px(0.6)} ${px(1.2)}"/></svg>`;
  const dashV = `<svg xmlns="http://www.w3.org/2000/svg"><line x1="50%" y1="0" x2="50%" y2="100%" stroke="#202020" stroke-width="40" stroke-dasharray="${px(5)} ${px(1.2)} ${px(0.6)} ${px(1.2)}"/></svg>`;
  return { '--sw-equity': enc(swEquity), '--sw-cap': enc(swCap), '--sw-axis': enc(swAxis), '--planraster': enc(plan),
    '--dashdot-h': enc(dashH).replace(/%(?![0-9A-F]{2})/g, '%25'), '--dashdot-v': enc(dashV).replace(/%(?![0-9A-F]{2})/g, '%25') };
}

module.exports = { hatchPath, expandHatches, findRasterPatterns, cssDataUris, STEP };

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const argv = process.argv.slice(2);
  const opt = (name, fb) => { const i = argv.indexOf(`--${name}`); return i > -1 ? argv[i + 1] : fb; };
  const fileArgs = argv.filter((a, i) => !a.startsWith('--') && !['--step', '--dir', '--class'].includes(argv[i - 1]));
  const defaultFiles = () => ['src/pages'].flatMap((d) => {
    const dir = path.join(root, d);
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort().map((f) => path.join(dir, f)) : [];
  });
  if (argv.includes('--css')) {
    Object.entries(cssDataUris()).forEach(([k, v]) => console.log(`  ${k}: ${v};`));
  } else if (argv.includes('--sync') || argv.includes('--check')) {
    const check = argv.includes('--check');
    const files = fileArgs.length ? fileArgs.map((f) => path.resolve(f)) : defaultFiles();
    if (check && !fileArgs.length) files.push(path.join(root, 'src', 'styles.css'));
    let problems = 0, total = 0;
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      const rel = path.relative(root, f);
      findRasterPatterns(text).forEach((h) => { problems++; console.log(`MUSTER: ${rel}:${h}`); });
      if (!f.endsWith('.html')) continue;
      const r = expandHatches(text);
      total += r.count;
      if (!r.changed) continue;
      if (check) { problems++; console.log(`SCHRAFFUR: ${rel}: ${r.changed} von ${r.count} Pfaden veraltet – node scripts/schraffur.cjs --sync`); }
      else { fs.writeFileSync(f, r.html); console.log(`${rel}: ${r.changed} von ${r.count} Schraffurpfaden aktualisiert`); }
    }
    console.log(`${total} Schraffurpfade in ${files.length} Dateien${check ? `, ${problems} Befund(e)` : ''}`);
    if (check && problems) process.exit(1);
  } else if (fileArgs.length) {
    const rects = parseRects(fileArgs.join(' '));
    const step = Number(opt('step', STEP));
    const dir = opt('dir', '/') === '\\' ? '\\' : '/';
    const cls = opt('class', 'hatch');
    const extra = (step !== STEP ? ` data-hatch-step="${step}"` : '') + (dir === '\\' ? ' data-hatch-dir="\\"' : '');
    console.log(`<path class="${cls}" data-hatch="${rects.map((r) => r.map(fmt).join(' ')).join('; ')}"${extra} d="${hatchPath(rects, { step, dir })}"/>`);
  } else {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 30).map((l) => l.slice(3)).join('\n'));
  }
}
