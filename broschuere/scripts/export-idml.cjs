#!/usr/bin/env node
// Exportiert das gerenderte HTML-Layout der Broschüre als InDesign-Paket (IDML, ab CC 2020).
//
// Nutzung (aus broschuere/):  npm run indesign   (= node scripts/export-idml.cjs; Optionen: npm run indesign -- --python …)
//   Ein Lauf: assemble (src/index.html neu) → Referenz-PDF (nur wenn älter als die Quellen, über render.cjs)
//             → Export → zwei Prüfungen → Auslieferung nach dist/indesign/
//   node scripts/export-idml.cjs [--in src/index.html] [--out dist/indesign] [--name Mietwohnraumfoerderung-2026]
//        [--python PFAD] [--refs DIR] [--ref-pdf PDF | --no-ref-pdf] [--no-assemble] [--tables native|frames]
//        [--setzer einzeilig|absatz] [--page-selector .page] [--master-selector .page__foot] [--no-master-items]
//        [--no-merge] [--keep-model] [--no-validate] [--force] [--check] [--selbsttest] [--help]
//   --check: nur das vorhandene Paket in --out prüfen; --selbsttest: Prüfnetz mit beschädigten Kopien des Pakets testen
//   Python: --python PFAD, sonst Umgebungsvariable IDML_PYTHON, sonst .venv/bin/python (npm run indesign:setup), sonst python3
//
// Ergebnis in --out:
//   <name>.idml        InDesign-Dokument (Doppelseiten, Ebenen, Absatz-/Zeichenformate, Farbfelder, Tabellen)
//   Links/             verknüpfte Vektorgrafiken (jedes Inline-SVG bzw. jede Verlaufsfläche als eigenes PDF)
//   Document Fonts/    statische Desktop-Schnitte (TTF) der verwendeten Schriften + OFL-Lizenztexte
//   Referenz-PDF       (mit --ref-pdf) das freigegebene PDF zum Vergleich
//   LIESMICH.txt       Öffnen, Schriften, Verknüpfungen, bekannte Grenzen
//
// Ablauf: Chromium lädt die Seite wie scripts/render.cjs (Druckmedien, Schriften), scripts/idml/browser.cjs
// materialisiert ::before/::after und misst jedes Element (getBoundingClientRect, Range-Rechtecke, Grundlinien).
// scripts/idml/fonts.cjs + make-fonts.py (fontTools) planen und erzeugen die Desktop-Schnitte, graphics.cjs rendert
// die Grafiken, build.cjs fasst Absätze zu Textrahmen zusammen und leitet die Formate ab, writer.cjs schreibt das
// IDML, check.cjs prüft das fertige Paket (ZIP-Aufbau, XML, IDs, Verweise, Verknüpfungen, Glyphen), validate.py
// prüft unabhängig davon (lxml/fontTools/pypdf). Gebaut wird in einem eigenen Arbeitsordner je Lauf neben --out; erst
// wenn beide Prüfungen bestanden sind, ersetzt das neue Paket das alte (sonst bleibt das alte unverändert, --force
// liefert trotzdem). Eine Sperrdatei <out>.lock verhindert zwei gleichzeitige Exporte in dasselbe Ziel; die
// Auslieferung sichert die alten Erzeugnisse zuerst und stellt sie bei einem Fehler wieder her.
// Voraussetzungen: Playwright/Chromium (wie render.cjs), pdf-lib, Python 3 mit scripts/idml/requirements-idml.txt.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}
const flag = (name) => process.argv.includes(`--${name}`);
const DEFAULT_REF_NAME = 'PGN-Mietwohnraumfoerderung-Niedersachsen-2026.pdf';   // wie render.cjs / npm run build
const MAX_MINUTES = Number(arg('max-minuten', '20'));                             // Wächter gegen Hänger (Browser, Python)

if (flag('help') || flag('h')) {
  console.log(`InDesign-Export (IDML) der Broschüre – Beschreibung in INDESIGN.md

  npm run indesign                  assemble → Referenz-PDF (falls veraltet) → Export → Prüfungen → dist/indesign/
  npm run indesign -- OPTIONEN      Optionen durchreichen, z. B. -- --python ~/venv/bin/python
  npm run indesign:check            vorhandenes Paket prüfen (check.cjs + validate.py)
  npm run indesign:setup            einmalig: .venv/ mit den Python-Paketen anlegen

Optionen:
  --python PFAD       Python mit fontTools + brotli (sonst IDML_PYTHON, .venv/bin/python, python3)
  --out DIR           Zielordner (Standard dist/indesign)
  --ref-pdf PDF       dieses PDF als Referenz ins Paket legen (Standard: dist/${DEFAULT_REF_NAME}, wird bei Bedarf neu gerendert)
  --no-ref-pdf        Paket ohne Referenz-PDF
  --no-assemble       src/index.html nicht neu zusammensetzen
  --force             trotz Prüfungsfehlern ausliefern
  --check, --selbsttest, --no-validate, --setzer einzeilig|absatz, --no-master-items, --tables frames, --keep-model
Exit-Codes: 0 ausgeliefert · 1 Prüfungsfehler bzw. Abbruch (altes Paket unverändert) · 2 Voraussetzung fehlt · 3 anderer Lauf aktiv`);
  process.exit(0);
}

const root = path.resolve(__dirname, '..');
const DEFAULT_IN = path.join(root, 'src', 'index.html');
const input = path.resolve(root, arg('in', 'src/index.html'));
const outDir = path.resolve(root, arg('out', 'dist/indesign'));
const name = arg('name', 'Mietwohnraumfoerderung-2026');
// Python: --python, sonst IDML_PYTHON, sonst das Projekt-venv .venv/ (npm run indesign:setup), sonst python3
const python = arg('python', process.env.IDML_PYTHON || (fs.existsSync(path.join(root, '.venv', 'bin', 'python')) ? path.join(root, '.venv', 'bin', 'python') : 'python3'));
const refsDir = arg('refs', process.env.IDML_REFS || '');
// Referenz-PDF: --ref-pdf PFAD (fest), --no-ref-pdf (keins), sonst das PDF von npm run build – nur beim Gesamtdokument;
// ist es älter als die Quellen oder fehlt es, wird es vor dem Export mit render.cjs neu erzeugt (ensureRefPdf)
const DEFAULT_REF = path.join(root, 'dist', DEFAULT_REF_NAME);
const refPdfExplicit = !!arg('ref-pdf', '');
let refPdf = flag('no-ref-pdf') ? null : refPdfExplicit ? path.resolve(root, arg('ref-pdf')) : input === DEFAULT_IN ? DEFAULT_REF : null;
const autoAssemble = input === DEFAULT_IN && !flag('no-assemble');
const opts = {
  pageSelector: arg('page-selector', '.page'),
  tables: arg('tables', 'native'),
  // Einzeilensetzer = gieriger Umbruch wie Chromium (gleicher Zeilenfall); Absatzsetzer auf Wunsch
  composer: arg('setzer', 'einzeilig') === 'absatz' ? 'HL Composer' : 'HL Single',
  mergeFrames: !flag('no-merge'),
  bleedMm: Number(arg('bleed', '3')),
  bleedTolMm: 0.8,
  layerOrder: arg('layer-order', 'top-first'),   // nur für Tests (Scribus liest die Ebenen andersherum)
  // Seitenfuß: identische Objekte auf die Musterseite „A-Inhalt“ (--no-master-items: alles auf den Seiten)
  footSelector: arg('master-selector', '.page__foot'),
  masterItems: !flag('no-master-items'),
};
const log = (...a) => console.log(...a);
const fail = (msg, code = 2) => { console.error(`FEHLER: ${msg}`); process.exit(code); };
const rel = (p) => path.relative(root, p) || '.';

// ---- Sperre: höchstens ein Export bzw. eine Prüfung je Zielordner --------------------------------------------------
// <out>.lock wird exklusiv angelegt (O_EXCL) und enthält PID, Rechner und Startzeit. Eine Sperre, deren Prozess nicht
// mehr läuft, gilt als verwaist und wird übernommen; ein zweiter Lauf wird mit klarer Meldung abgelehnt.
const lockFile = `${outDir}.lock`;
let lockHeld = false;
const pidAlive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
function readLock(file) {
  try { return { info: JSON.parse(fs.readFileSync(file, 'utf8')), mtime: fs.statSync(file).mtimeMs }; } catch (e) {
    try { return { info: null, mtime: fs.statSync(file).mtimeMs }; } catch (e2) { return null; }
  }
}
const lockLive = (l) => (l.info ? (l.info.host !== os.hostname() || pidAlive(l.info.pid)) : Date.now() - l.mtime < 30000);
function acquireLock() {
  fs.mkdirSync(path.dirname(outDir), { recursive: true });
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const fd = fs.openSync(lockFile, 'wx');
      fs.writeSync(fd, JSON.stringify({ pid: process.pid, host: os.hostname(), start: new Date().toISOString(), cmd: process.argv.slice(2).join(' ') }));
      fs.closeSync(fd);
      lockHeld = true;
      return;
    } catch (e) {
      if (e.code !== 'EEXIST') fail(`Sperrdatei ${rel(lockFile)} nicht anlegbar: ${e.message}`);
    }
    const l = readLock(lockFile);
    if (!l) continue;                                   // eben freigegeben → erneut versuchen
    if (lockLive(l)) {
      const who = l.info ? `PID ${l.info.pid}${l.info.host !== os.hostname() ? ` auf ${l.info.host}` : ''}, gestartet ${l.info.start}` : 'unbekannter Prozess';
      fail(`Ein anderer Export bzw. eine Prüfung (${who}) arbeitet gerade mit ${rel(outDir)}.\n` +
        `  Exporte nicht parallel starten – warten, bis der andere Lauf fertig ist. Ist sicher kein Lauf mehr aktiv, ${rel(lockFile)} löschen.`, 3);
    }
    // verwaist: atomar beiseite legen; war es doch eine frische Sperre (Wettlauf), zurücklegen und abbrechen
    const aside = `${lockFile}.verwaist-${process.pid}`;
    try { fs.renameSync(lockFile, aside); } catch (e) { continue; }
    const moved = readLock(aside);
    if (moved && lockLive(moved)) {
      try { fs.linkSync(aside, lockFile); } catch (e) { /* inzwischen neu gesperrt */ }
      fs.rmSync(aside, { force: true });
      fail(`Ein anderer Export hat ${rel(outDir)} soeben gesperrt – nicht parallel starten.`, 3);
    }
    fs.rmSync(aside, { force: true });
    log(`Hinweis: verwaiste Sperre ${rel(lockFile)}${moved && moved.info ? ` (PID ${moved.info.pid})` : ''} übernommen.`);
  }
  fail(`Sperre ${rel(lockFile)} konnte nicht angelegt werden.`, 3);
}
function releaseLock() {
  if (!lockHeld) return;
  const l = readLock(lockFile);
  if (l && l.info && l.info.pid === process.pid && l.info.host === os.hostname()) fs.rmSync(lockFile, { force: true });
  lockHeld = false;
}
process.on('exit', releaseLock);

// ---- Vorabprüfungen (vor dem langen Browserlauf) --------------------------------------------------------------------
function pyHas(mods) {
  const r = spawnSync(python, ['-c', `import ${mods.join(', ')}`], { encoding: 'utf8' });
  return r.status === 0 ? true : (r.error ? r.error.message : (r.stderr || '').trim().split('\n').pop());
}
const REQ = path.join(__dirname, 'idml', 'requirements-idml.txt');
const pyHint = `Abhilfe: npm run indesign:setup (legt .venv/ an: python3 -m venv .venv && .venv/bin/pip install -r ${path.relative(root, REQ)}); .venv/ wird automatisch verwendet, sonst --python PFAD bzw. IDML_PYTHON=PFAD`;
if (!flag('check') && !flag('selbsttest')) {
  const ok = pyHas(['fontTools', 'brotli']);
  if (ok !== true) fail(`Python „${python}“ kann fontTools/brotli nicht laden (${ok}).\n  ${pyHint}`);
}
let playwright;
try { playwright = require('playwright'); } catch (e) { fail('Playwright fehlt (npm install im Ordner broschuere/, ggf. NODE_PATH setzen)'); }
try { require('pdf-lib'); } catch (e) { fail('pdf-lib fehlt (npm install im Ordner broschuere/)'); }
if (!flag('check') && !flag('selbsttest') && !autoAssemble && !fs.existsSync(input)) fail(`Eingabe fehlt: ${input} – zuerst node scripts/assemble.cjs`);
if (refPdfExplicit && refPdf && !fs.existsSync(refPdf)) fail(`Referenz-PDF fehlt: ${refPdf} (npm run build, --ref-pdf weglassen oder --no-ref-pdf)`);
const validatePy = !flag('no-validate') && (() => {
  const ok = pyHas(['lxml', 'pypdf', 'fontTools']);
  if (ok !== true) { log(`Hinweis: validate.py übersprungen – Python ohne lxml/pypdf (${ok}). ${pyHint}`); return null; }
  return { ink: pyHas(['PIL']) === true, simpleidml: pyHas(['simple_idml.idml']) === true };
})();

const B = require('./idml/browser.cjs');
const { planFonts } = require('./idml/fonts.cjs');
const { renderGraphics } = require('./idml/graphics.cjs');
const { buildDocument } = require('./idml/build.cjs');
const { writeIdml } = require('./idml/writer.cjs');
const { writeZip } = require('./idml/zip.cjs');
const { checkPackage } = require('./idml/check.cjs');
const { liesmich } = require('./idml/liesmich.cjs');

// validate.py (lxml/fontTools/pypdf) – unabhängige Strukturprüfung; liefert die Fehlermeldungen, Warnungen gehen ins Log
function runValidate(idmlPath, expectFile) {
  if (!validatePy) return [];
  const errs = [];
  const jf = path.join(path.dirname(idmlPath), '.validate.json');
  const a = ['-I', path.join(__dirname, 'idml', 'validate.py'), idmlPath, '--json', jf, '--max', '5'];
  if (expectFile) a.push('--expect', expectFile);
  if (refsDir && fs.existsSync(refsDir)) a.push('--refs', refsDir);
  if (!validatePy.ink) a.push('--no-ink');
  if (!validatePy.simpleidml) a.push('--no-simpleidml');
  const r = spawnSync(python, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 15 * 60 * 1000 });
  let rep = null;
  try { rep = JSON.parse(fs.readFileSync(jf, 'utf8')); } catch (e) { /* */ }
  fs.rmSync(jf, { force: true });
  if (!rep) return [`validate.py ist abgebrochen (Exit ${r.status}${r.error ? `, ${r.error.code === 'ETIMEDOUT' ? 'Zeitlimit 15 min' : r.error.message}` : ''}): ${(r.stderr || '').trim().split('\n').slice(-3).join(' | ')}`];
  const f = rep.findings || [];
  const nErr = f.filter((x) => x.level === 'FEHLER').reduce((n, x) => n + x.count, 0);
  const nWarn = f.filter((x) => x.level === 'WARNUNG').reduce((n, x) => n + x.count, 0);
  log(`Prüfung validate.py${refsDir ? ' (mit Referenz-IDMLs)' : ''}${expectFile ? ' (mit Erwartungen aus dem DOM)' : ''}: ${nErr} Fehler, ${nWarn} Warnungen`);
  f.forEach((x) => x.messages.slice(0, 5).forEach((m) => {
    if (x.level === 'FEHLER') errs.push(`validate.py [${x.key}] ${m}`);
    else log(`WARNUNG: validate.py [${x.key}] ${m}`);
  }));
  return errs;
}

// Nur prüfen (npm run indesign:check): vorhandenes Paket in --out mit check.cjs und validate.py
if (flag('check')) {
  const idml = path.join(outDir, `${name}.idml`);
  if (!fs.existsSync(idml)) fail(`Kein Paket: ${idml}`);
  acquireLock();   // kein Prüfen während einer Auslieferung
  const chk = checkPackage(idml, { fontsDir: path.join(outDir, 'Document Fonts') });
  log(`Prüfung check.cjs: ${chk.stats.xml} XML-Dateien, ${chk.stats.selfs} IDs, ${chk.stats.links} Verknüpfungen, ${chk.stats.glyphChars || 0} Zeichen gegen die Schriften – ${chk.errors.length ? chk.errors.length + ' Fehler' : 'keine Fehler'}`);
  chk.warnings.slice(0, 20).forEach((w) => log('WARNUNG: ' + w));
  const errs = [...chk.errors, ...runValidate(idml)];
  errs.forEach((e) => log('FEHLER: ' + e));
  log(errs.length ? `${errs.length} Fehler` : 'Paket in Ordnung');
  process.exit(errs.length ? 1 : 0);
}

// Selbsttest des Prüfnetzes (npm run indesign:selbsttest): beschädigte Kopien des Pakets müssen als Fehler auffallen
if (flag('selbsttest')) {
  const idml = path.join(outDir, `${name}.idml`);
  if (!fs.existsSync(idml)) fail(`Kein Paket: ${idml}`);
  if (pyHas(['lxml', 'pypdf', 'fontTools']) !== true) fail(`Python „${python}“ ohne lxml/pypdf/fontTools.\n  ${pyHint}`);
  acquireLock();
  const r = spawnSync(python, ['-I', path.join(__dirname, 'idml', 'selbsttest.py'), idml, '--node', process.execPath], { stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}

// Jüngste Änderung der Quellen: src/ ohne das generierte index.html und ohne Hilfsdateien (.preview-*, .measure-tmp),
// content/; mit extra zusätzlich einzelne Dateien (z. B. die Skripte, die das Referenz-PDF erzeugen)
function newestSource(extra = []) {
  let t = 0;
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (p !== input && p !== DEFAULT_IN) t = Math.max(t, fs.statSync(p).mtimeMs);
    }
  };
  walk(path.join(root, 'src'));
  walk(path.join(root, 'content'));
  for (const f of extra) if (fs.existsSync(f)) t = Math.max(t, fs.statSync(f).mtimeMs);
  return t;
}

// Zeitstempel für Paket, Metadaten und LIESMICH: SOURCE_DATE_EPOCH, sonst jüngste Quelldatei – zwei Exporte desselben
// Stands sind dadurch bytegleich.
function sourceDate() {
  if (process.env.SOURCE_DATE_EPOCH) return new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000);
  return new Date(Math.floor((newestSource() || Date.now()) / 1000) * 1000);
}

// Eingaben aktuell halten (unter der Sperre, im eigenen Arbeitsordner, vor dem Browserlauf). Versionierte Dateien in
// dist/ (die freigegebenen PDFs) fasst der Export nie an:
// 1. src/index.html (nicht versioniert) aus template.html + pages/ neu zusammensetzen (deterministisch, < 1 s), damit
//    nie ein veraltetes Layout exportiert wird.
// 2. Referenz-PDF: das PDF von npm run build verwenden, wenn es jünger als alle Quellen und Build-Skripte ist; sonst
//    mit render.cjs (--no-print) in den Arbeitsordner rendern (etwa 10 s), dist/ bleibt unverändert. Befunde von
//    render.cjs (OVERFLOW …) betreffen das Layout selbst und werden als Warnung durchgereicht.
// Gibt die Datei zurück, die als Referenz ins Paket kommt (oder null); wirft bei Fehlern.
function runNode(script, args, what) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script), ...args],
    { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 10 * 60 * 1000 });
  if (r.status !== 0) {
    const out = `${r.stdout || ''}\n${r.stderr || ''}`.trim().split('\n').slice(-8).join('\n  ');
    throw new Error(`${what} fehlgeschlagen (Exit ${r.status}${r.error ? `, ${r.error.code === 'ETIMEDOUT' ? 'Zeitlimit' : r.error.message}` : ''})\n  ${out}`);
  }
  return r.stdout || '';
}
function ensureInputs(workDir) {
  if (autoAssemble) {
    const out = runNode('assemble.cjs', [], 'Zusammensetzen (scripts/assemble.cjs)');
    log(`assemble: ${(out.trim().split('\n').pop() || '').trim()}`);
  }
  if (!fs.existsSync(input)) throw new Error(`Eingabe fehlt: ${input}`);
  if (!refPdf) { log('Referenz-PDF: keins (--no-ref-pdf bzw. eigene --in-Datei)'); return null; }
  const newest = newestSource([path.join(__dirname, 'assemble.cjs'), path.join(__dirname, 'render.cjs')]);
  const fresh = fs.existsSync(refPdf) && fs.statSync(refPdf).mtimeMs >= newest;
  if (fresh) { log(`Referenz-PDF: ${rel(refPdf)} (aktuell)`); return refPdf; }
  if (refPdfExplicit) { log(`WARNUNG: Referenz-PDF ${rel(refPdf)} ist älter als die Quellen – es zeigt womöglich nicht den exportierten Stand`); return refPdf; }
  const tmpRef = path.join(workDir, '.referenz.pdf');
  log(`Referenz-PDF: ${rel(refPdf)} ${fs.existsSync(refPdf) ? 'ist älter als die Quellen' : 'fehlt'} – Referenz fürs Paket wird mit scripts/render.cjs ` +
    'neu gerendert (dist/ bleibt unverändert; npm run build aktualisiert es) …');
  const out = runNode('render.cjs', ['--in', rel(input), '--pdf', tmpRef, '--no-print'], 'Referenz-PDF (scripts/render.cjs)');
  if (!fs.existsSync(tmpRef)) throw new Error('render.cjs hat kein Referenz-PDF erzeugt');
  const finds = out.split('\n').filter((l) => /^(FEHLER|OVERFLOW|LASTLINE|SATZSPIEGEL|FONT|WARNUNG):/.test(l));
  finds.slice(0, 10).forEach((l) => log(`WARNUNG: render.cjs ${l}`));
  log(`Referenz-PDF: neu gerendert${finds.length ? ` (${finds.length} Befunde von render.cjs, siehe oben – betreffen das Layout, nicht den Export)` : ''}`);
  return tmpRef;
}

// Satzspiegel: häufigste Seitenränder (ohne Seiten mit Rand 0), als innen/außen normiert
function typeArea(model) {
  const cnt = new Map();
  model.pages.forEach((p) => {
    const m = p.margins;
    if (m.top + m.bottom + m.left + m.right < 0.5) return;
    const left = p.number % 2 === 0;
    const n = { top: m.top, bottom: m.bottom, left: left ? m.right : m.left, right: left ? m.left : m.right };   // left = innen
    const k = [n.top, n.bottom, n.left, n.right].map((v) => v.toFixed(2)).join('|');
    const e = cnt.get(k) || { m: n, n: 0 };
    e.n++;
    cnt.set(k, e);
  });
  const best = [...cnt.values()].sort((a, b) => b.n - a.n)[0];
  return best ? best.m : model.pages[0].margins;
}

// Arbeitsordner je Lauf (eindeutig) neben dem Ziel; erst nach bestandener Prüfung wird das Ziel ersetzt
const PRODUCTS = (refName) => [`${name}.idml`, 'Links', 'Document Fonts', 'LIESMICH.txt', ...(refName ? [refName] : [])];
const base = path.basename(outDir);
acquireLock();
// Arbeits- und Sicherungsordner abgebrochener Läufe (Prozess beendet, Sperre war verwaist) aufräumen
for (const f of fs.readdirSync(path.dirname(outDir))) {
  if (f === `.${base}-neu` || f.startsWith(`.${base}-neu-`) || f.startsWith(`.${base}-alt-`)) {
    const p = path.join(path.dirname(outDir), f);
    if (f.startsWith(`.${base}-alt-`) && fs.readdirSync(p).length) { log(`WARNUNG: Sicherung eines abgebrochenen Laufs bleibt erhalten: ${rel(p)}`); continue; }
    fs.rmSync(p, { recursive: true, force: true });
  }
}
const stage = fs.mkdtempSync(path.join(path.dirname(outDir), `.${base}-neu-`));
const cleanStage = () => fs.rmSync(stage, { recursive: true, force: true });
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { cleanStage(); console.error(`Abgebrochen (${sig}) – das bisherige Paket in ${rel(outDir)} ist unverändert.`); process.exit(130); });
let refSrc;
try { refSrc = ensureInputs(stage); } catch (e) {
  cleanStage();
  fail(`${e.message}\n  Export nicht gestartet – das bisherige Paket in ${rel(outDir)} ist unverändert.`);
}
const refName = refSrc ? `Referenz-${path.basename(refPdf)}` : null;
// Wächter: hängt Browser oder Python, wird der Lauf nach MAX_MINUTES abgebrochen (Arbeitsordner weg, altes Paket bleibt)
setTimeout(() => {
  try { cleanStage(); } catch (e) { /* */ }
  console.error(`FEHLER: Export nach ${MAX_MINUTES} min abgebrochen (Hänger?) – das bisherige Paket in ${rel(outDir)} ist unverändert. ` +
    'Erneut starten; bei Wiederholung mit --keep-model bzw. einzeln (node scripts/render.cjs) eingrenzen.');
  process.exit(1);
}, MAX_MINUTES * 60 * 1000).unref();

// Auslieferung: alte Erzeugnisse erst in einen Sicherungsordner, dann die neuen hinein; bei einem Fehler zurückrollen
function deliver(refName) {
  fs.mkdirSync(outDir, { recursive: true });
  const backup = fs.mkdtempSync(path.join(path.dirname(outDir), `.${base}-alt-`));
  const old = new Set(PRODUCTS(null).concat(fs.readdirSync(outDir).filter((f) => /^Referenz-.*\.pdf$/.test(f))));
  const moved = [], placed = [];
  try {
    for (const p of old) if (fs.existsSync(path.join(outDir, p))) { fs.renameSync(path.join(outDir, p), path.join(backup, p)); moved.push(p); }
    for (const p of PRODUCTS(refName)) if (fs.existsSync(path.join(stage, p))) { fs.renameSync(path.join(stage, p), path.join(outDir, p)); placed.push(p); }
  } catch (e) {
    for (const p of placed.reverse()) { try { fs.renameSync(path.join(outDir, p), path.join(stage, p)); } catch (e2) { fs.rmSync(path.join(outDir, p), { recursive: true, force: true }); } }
    const lost = [];
    for (const p of moved) { try { fs.renameSync(path.join(backup, p), path.join(outDir, p)); } catch (e2) { lost.push(p); } }
    if (!lost.length) fs.rmSync(backup, { recursive: true, force: true });
    throw new Error(`Auslieferung fehlgeschlagen (${e.message}); ${lost.length ? `alte Erzeugnisse liegen noch in ${rel(backup)}: ${lost.join(', ')}` : 'das bisherige Paket ist wiederhergestellt'}`);
  }
  fs.rmSync(backup, { recursive: true, force: true });
}

(async () => {
  const t0 = Date.now();
  const date = sourceDate();
  const linksDir = path.join(stage, 'Links');
  const fontsDir = path.join(stage, 'Document Fonts');
  const tmpDir = path.join(stage, '.tmp');
  fs.mkdirSync(tmpDir, { recursive: true });
  const idmlPath = path.join(stage, `${name}.idml`);

  const browser = await playwright.chromium.launch({
    ...(fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}),
    args: ['--allow-file-access-from-files'],   // für CSSOM-Zugriff auf verlinkte Stylesheets (Tokens, @font-face)
  });
  const errors = [];
  let model, grid, title, domFoot;
  try {
    const url = pathToFileURL(input).href;
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(B.installHelpers);
    const prep = await page.evaluate(B.prepare, { pageSelector: opts.pageSelector });
    log(`Vorbereitung: ${prep.pseudos} ::before/::after als Elemente, Layout-Abweichung ${prep.moved} Elemente (max. ${prep.maxShift}px)`);
    if (prep.moved) errors.push(`Materialisieren der Pseudo-Elemente hat ${prep.moved} Elemente verschoben`);
    model = await page.evaluate(B.extract, { pageSelector: opts.pageSelector, bleedTolMm: opts.bleedTolMm, tables: opts.tables, footSelector: opts.footSelector });
    // Spaltenraster aus den Tokens (--col, --gutter), falls vorhanden
    grid = await page.evaluate((sel) => {
      const pg = document.querySelector(sel);
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--col);height:var(--gutter)';
      (pg || document.body).appendChild(probe);
      const r = probe.getBoundingClientRect();
      probe.remove();
      return r.width > 0 && r.height > 0 ? { colPx: r.width, gutterPx: r.height } : null;
    }, opts.pageSelector);
    title = await page.title();
    // Erwartung für die Musterseiten-Prüfung, unabhängig vom Modell: Seiten mit Standard-Fußzeile im DOM
    domFoot = await page.evaluate(({ ps, fs }) => [...document.querySelectorAll(ps)].map((pg, i) => (fs && pg.querySelector(fs) ? i + 1 : 0)).filter(Boolean),
      { ps: opts.pageSelector, fs: opts.footSelector });
    await page.close();
    if (!model.pages.length) throw new Error(`Keine Seiten (${opts.pageSelector}) gefunden`);
    log(`DOM: ${model.pages.length} Seiten, ${model.tokens.length} Farb-Tokens, ${model.pages.reduce((n, p) => n + p.paragraphs.length, 0)} Absätze, ` +
      `${model.pages.reduce((n, p) => n + p.tables.length, 0)} Tabellen, ${model.graphicsCount} Grafiken, ${model.decorCount} Verlaufsflächen`);
    if (flag('keep-model')) {
      const mf = path.join(path.dirname(outDir), `.${base}-modell.json`);
      fs.writeFileSync(mf, JSON.stringify(model));
      log(`DOM-Modell: ${rel(mf)}`);
    }

    // Schriften
    var fonts = planFonts(model, { outDir: fontsDir, tmpDir, python, log });
    fonts.faces.forEach((f) => log(`  ${f.family} ${f.style}`.padEnd(36) + `${f.ps}.ttf  ${Object.entries(f.axes).map(([k, v]) => `${k} ${v}`).join(', ')}`));
    // OFL-Lizenztexte der weitergegebenen (abgeleiteten) Schriften beilegen (OFL 1.1 verlangt sie bei jeder Weitergabe)
    const licDir = path.join(root, 'src', 'fonts', 'licenses');
    fonts.licenses = [];
    for (const fam of new Set(fonts.faces.map((f) => f.cssFamily.replace(/ Variable$/, '')))) {
      const lic = path.join(licDir, `${fam.toLowerCase().replace(/\s+/g, '-')}-OFL.txt`);
      if (fs.existsSync(lic)) { fs.copyFileSync(lic, path.join(fontsDir, path.basename(lic))); fonts.licenses.push(path.basename(lic)); }
      else errors.push(`Lizenztext fehlt für „${fam}“ (${path.relative(root, lic)}) – Schrift darf ohne Lizenztext nicht weitergegeben werden`);
    }

    // Grafiken
    var graphics = await renderGraphics({ browser, url, model, linksDir, fontsDir, faces: fonts.faces, opts, log });
  } finally {
    await browser.close();
  }

  // Dokumentmodell + IDML
  const doc = buildDocument(model, { fonts, graphics, opts });
  const W = doc.W;
  doc.margins = typeArea(model);
  doc.gridFor = (m) => {
    if (!grid) return null;
    const cw = W - m.left - m.right;
    const col = grid.colPx * 0.75, gut = grid.gutterPx * 0.75;
    const count = Math.round((cw + gut) / (col + gut));
    if (count < 2 || count > 24 || Math.abs(count * col + (count - 1) * gut - cw) > 2) return null;   // passt nicht zum Raster
    return { count, gutter: gut, col };
  };
  doc.grid = doc.gridFor(doc.margins);
  doc.title = title;
  doc.docName = `${name}.indd`;
  doc.composer = opts.composer;
  doc.date = date;
  doc.tableAnchorStyle = 'ParagraphStyle/Tabellenanker';
  doc.cellEmptyStyle = 'ParagraphStyle/$ID/NormalParagraphStyle';
  const byChars = fonts.faces.slice().sort((a, b) => b.chars - a.chars);
  doc.defaultFace = byChars[0] || { family: 'Minion Pro', style: 'Regular' };
  const pkg = writeIdml(doc, { layerOrder: opts.layerOrder });
  const entries = [{ name: 'mimetype', data: 'application/vnd.adobe.indesign-idml-package', store: true }]
    .concat(pkg.order.map((n) => ({ name: n, data: pkg.files[n] })));
  fs.writeFileSync(idmlPath, writeZip(entries, date));
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (refSrc) fs.copyFileSync(refSrc, path.join(stage, refName));

  // Erwartungen aus DOM und Modell für beide Prüfungen (nicht ausgeliefert): Seiten mit Standard-Fußzeile im DOM,
  // Seiten, deren Fuß auf die Musterseite gewandert ist, Druckbögen mit ausgeblendeten Musterobjekten
  const expect = {
    footPages: domFoot,
    masterPages: [...doc.master.pages].sort((a, b) => a - b),
    noMasterItemPages: doc.pages.filter((p, i) => doc.master.spreadsWithout.has(i === 0 ? 0 : Math.floor((i + 1) / 2))).map((p) => p.number),
    composer: doc.composer,
  };
  const expectFile = path.join(stage, '.erwartung.json');
  fs.writeFileSync(expectFile, JSON.stringify(expect));

  // Prüfung 1: check.cjs (immer)
  const chk = checkPackage(idmlPath, { fontsDir, expect });
  fs.writeFileSync(path.join(stage, 'LIESMICH.txt'), liesmich({ name, doc, fonts, pkg, chk, model, opts, refName, date }));
  log(`IDML: ${pkg.spreads} Druckbögen, ${model.pages.length} Seiten, ${doc.stats.frames} Textrahmen, ${doc.stats.paragraphs} Absätze, ` +
    `${doc.stats.tables} Tabellen, ${doc.stats.shapes} Flächen/Linien, ${doc.stats.graphics} Grafikrahmen (${doc.stats.masterItems} Objekte davon auf der Musterseite), ` +
    `${doc.paraStyles.length} Absatz- (+${(doc.baseStyles || []).length} Basis-) und ${doc.charStyles.length} Zeichenformate, ${doc.swatches.length} Farbfelder`);
  log(`Satz: ${doc.stats.prettyParas} Absätze mit text-wrap: pretty ab der ersten Abweichung fest umbrochen (${doc.stats.prettyBreaks} Umbrüche), ` +
    `${doc.stats.protectedWords} Wörter gegen Wörterbuchtrennung geschützt, ${doc.stats.hangCells} Zellen mit hängendem Einzug, ` +
    `${doc.stats.widenedCells} Zellen mit mehr Platz für unteilbaren Text (${doc.stats.widenedTables} Tabellen mit Hilfsspalte); Musterseiten: ` +
    `${(doc.masterInfo || []).map((m) => `${m.name} S. ${m.pages.join(',') || '–'}`).join(' · ')}`);
  log(`Prüfung check.cjs: ${chk.stats.xml} XML-Dateien${chk.stats.xmllint ? ' (auch xmllint)' : ''}, ${chk.stats.selfs} IDs, ${chk.stats.links} Verknüpfungen, ` +
    `${chk.stats.glyphChars || 0} Zeichen gegen die Schriften geprüft – ${chk.errors.length ? chk.errors.length + ' Fehler' : 'keine Fehler'}`);
  const warnings = [...new Set(doc.warnings.concat(graphics.warnings || []))];
  warnings.forEach((w) => log('WARNUNG: ' + w));
  chk.warnings.slice(0, 20).forEach((w) => log('WARNUNG: ' + w));
  const allErrors = [...errors, ...(doc.errors || []), ...chk.errors];

  // Prüfung 2: validate.py (unabhängig, Python)
  allErrors.push(...runValidate(idmlPath, expectFile));
  fs.rmSync(expectFile, { force: true });
  allErrors.forEach((e) => log('FEHLER: ' + e));

  // Ausliefern: alte Erzeugnisse im Ziel ersetzen (andere Dateien im Ziel bleiben unberührt)
  if (allErrors.length && !flag('force')) {
    const keep = `${outDir}-fehlgeschlagen`;
    fs.rmSync(keep, { recursive: true, force: true });
    fs.renameSync(stage, keep);
    log(`NICHT ausgeliefert: ${allErrors.length} Fehler. Das bisherige Paket in ${rel(outDir)} ist unverändert; ` +
      `das fehlerhafte liegt zur Ansicht in ${rel(keep)} (--force liefert trotzdem aus).`);
    process.exit(1);
  }
  deliver(refName);
  cleanStage();
  fs.rmSync(`${outDir}-fehlgeschlagen`, { recursive: true, force: true });
  log(`Ausgeliefert: ${rel(path.join(outDir, `${name}.idml`))}${allErrors.length ? ` (TROTZ ${allErrors.length} Fehlern, --force)` : ''} – fertig in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  process.exit(allErrors.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  cleanStage();   // nur den eigenen Arbeitsordner entfernen; das bisherige Ziel bleibt unverändert
  console.error(`FEHLER: Export abgebrochen – das bisherige Paket in ${rel(outDir)} ist unverändert.`);
  process.exit(1);
});
