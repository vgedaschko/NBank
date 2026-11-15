#!/usr/bin/env node
// Modellrechnung S. 10–12 (Bogenseiten): füllt die Vorlagen in vorlagen/ mit den Diagrammen aus diagramme.cjs und schreibt
// die Partials nach src/pages/. Danach setzt scripts/schraffur.cjs --sync die Schraffuren. Die Seiten-JSON mit den
// Belegen schreibt seiten_json.py. Zahlen: praesentation/daten/werte.json und kennzahlen.json (aus der Rechenmappe v3).
//
//   node scripts/modellrechnung/bauen.cjs            alle drei Seiten
//   node scripts/modellrechnung/bauen.cjs 11         nur Bogenseite 11
//   node scripts/modellrechnung/bauen.cjs --check    nur prüfen, ob die Partials dem Stand der Vorlagen entsprechen
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const diagramme = require('./diagramme.cjs');

const BRO = path.resolve(__dirname, '../..');
const VORLAGEN = path.join(__dirname, 'vorlagen');
const args = process.argv.slice(2), check = args.includes('--check');
const nur = args.filter(a => /^\d+$/.test(a));
const dateien = fs.readdirSync(VORLAGEN).filter(f => /^\d\d-.*\.html$/.test(f) && (!nur.length || nur.includes(f.slice(0, 2))));

let abweichend = 0;
for (const f of dateien) {
  let s = fs.readFileSync(path.join(VORLAGEN, f), 'utf8');
  s = s.replace(/%%([A-Z]+)%%/g, (_, name) => {
    const fn = diagramme[name.toLowerCase()];
    if (!fn) throw new Error(`${f}: kein Diagramm „${name.toLowerCase()}“ in diagramme.cjs`);
    return fn().trim();
  });
  const ziel = path.join(BRO, 'src/pages', f);
  if (check) {
    // Vergleich ohne die von schraffur.cjs gesetzten Pfade (d="…" der .hatch)
    const ohne = (t) => t.replace(/(<path class="hatch"[^>]*?) d="[^"]*"/g, '$1 d=""');
    const ist = fs.existsSync(ziel) ? fs.readFileSync(ziel, 'utf8') : '';
    if (ohne(ist) !== ohne(s)) { console.log(`ABWEICHUNG ${f}: Partial entspricht nicht Vorlage + Diagrammen`); abweichend++; }
    else console.log(`OK ${f}`);
    continue;
  }
  fs.writeFileSync(ziel, s);
  execFileSync('node', [path.join(BRO, 'scripts/schraffur.cjs'), '--sync', ziel], { cwd: BRO, stdio: ['ignore', 'ignore', 'inherit'] });
  console.log(`geschrieben: src/pages/${f}`);
}
if (check && abweichend) process.exit(1);
