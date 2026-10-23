// Schriftzuordnung CSS → Desktop-Schrift (Familie, Stil, PostScript-Name) und Erzeugung der „Document Fonts“.
// Die eigentliche Arbeit (Achsen lesen, Bündeln, Instanziieren, Teilmengen zusammenführen) macht make-fonts.py
// mit fontTools; hier werden nur die Anfragen aus dem DOM-Modell gebaut.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { fileURLToPath } = require('url');

/**
 * @param model   Ergebnis von browser.extract()
 * @param outDir  Zielordner „Document Fonts“ oder null (nur planen)
 * @param python  Python-Interpreter mit fontTools + brotli
 */
function planFonts(model, { outDir, tmpDir, python = 'python3', log = () => {} }) {
  // Quellen je CSS-Familie und Lage (normal/italic) aus den @font-face-Regeln
  const sources = {};
  for (const ff of model.fontFaces) {
    const files = ff.urls.filter((u) => u.startsWith('file:')).map((u) => fileURLToPath(u)).filter((p) => fs.existsSync(p) && /\.(woff2?|ttf|otf)$/i.test(p));
    if (!files.length) continue;
    const st = /italic|oblique/.test(ff.style) ? 'italic' : 'normal';
    sources[ff.family] = sources[ff.family] || { normal: [], italic: [] };
    for (const f of files) if (!sources[ff.family][st].includes(f)) sources[ff.family][st].push(f);
  }
  const use = new Map(model.fontUse);
  const requests = [];
  model.styles.forEach((s, id) => {
    const chars = use.get(id) || 0;
    if (!chars) return;
    const axes = { ...s.fvs };
    if (axes.opsz === undefined && s.opticalAuto) axes.opsz = s.sizePx;
    requests.push({ id, family: s.family, italic: s.italic, weight: s.weight, axes, chars });
  });
  const missing = [...new Set(requests.map((r) => r.family))].filter((f) => !sources[f]);
  const tmp = fs.mkdtempSync(path.join(tmpDir || os.tmpdir(), 'idml-fonts-'));
  const inFile = path.join(tmp, 'in.json'), outFile = path.join(tmp, 'out.json');
  fs.writeFileSync(inFile, JSON.stringify({ sources, requests, outDir, minShare: 0.01 }));
  execFileSync(python, [path.join(__dirname, 'make-fonts.py'), inFile, outFile], { stdio: ['ignore', 'inherit', 'inherit'], timeout: 10 * 60 * 1000 });
  const res = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  fs.rmSync(tmp, { recursive: true, force: true });
  missing.forEach((f) => res.warnings.push(`Keine @font-face-Quelle für „${f}“ – Desktop-Schrift muss installiert sein`));
  // Nicht geplante Stile (ohne Text, z. B. nur Inline-Grafik): nächstliegenden Schnitt derselben Familie suchen
  const faceOfStyle = (id) => {
    const k = res.map[String(id)];
    if (k !== undefined) return res.faces[k];
    const s = model.styles[id];
    const same = res.faces.filter((f) => f.cssFamily === s.family && f.italic === s.italic);
    const pool = same.length ? same : res.faces.filter((f) => f.cssFamily === s.family);
    if (!pool.length) return { family: s.family.replace(/ Variable$/, ''), style: s.italic ? 'Italic' : 'Regular', ps: s.family.replace(/\s/g, ''), synthetic: true };
    return pool.slice().sort((a, b) => Math.abs(a.weightClass - s.weight) - Math.abs(b.weightClass - s.weight))[0];
  };
  log(`Schriften: ${res.faces.length} Schnitte in ${new Set(res.faces.map((f) => f.family)).size} Familien`);
  return { faces: res.faces, faceOfStyle, warnings: res.warnings };
}

module.exports = { planFonts };
