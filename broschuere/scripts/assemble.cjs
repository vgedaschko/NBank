#!/usr/bin/env node
// Setzt die Broschüre aus src/template.html und den Seiten-Partials in src/pages/*.html zusammen.
//
// Nutzung:
//   node scripts/assemble.cjs                         -> src/index.html (alle Seiten)
//   node scripts/assemble.cjs --only 05 --out src/.preview-05.html
//                                                     -> nur Seiten, deren Dateiname mit "05" beginnt
// --only akzeptiert eine kommagetrennte Liste von Präfixen (z. B. "01,02").

const fs = require('fs');
const path = require('path');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const out = path.resolve(root, arg('out', 'src/index.html'));
const only = arg('only', null);

if (path.dirname(out) !== src) {
  console.error('--out muss in src/ liegen, damit relative Pfade (fonts/, assets/, styles.css) stimmen.');
  process.exit(1);
}

const prefixes = only ? only.split(',').map((s) => s.trim()) : null;
const files = fs
  .readdirSync(path.join(src, 'pages'))
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !prefixes || prefixes.some((p) => f.startsWith(p)))
  .sort();

if (!files.length) {
  console.error('Keine passenden Seiten in src/pages gefunden.');
  process.exit(1);
}

const template = fs.readFileSync(path.join(src, 'template.html'), 'utf8');
const pages = files
  .map((f) => `<!-- ${f} -->\n` + fs.readFileSync(path.join(src, 'pages', f), 'utf8').trim())
  .join('\n\n');
fs.writeFileSync(out, template.replace('<!--PAGES-->', pages));
console.log(`${files.length} Seite(n) -> ${path.relative(root, out)}`);
