// Zugriff auf die Zahlen der Mappe (daten/werte.json), auf das Folienkonzept (daten/outline.json) und auf die
// Datendateien der Baugruppen (daten/regeln.json, markt.json, umsetzung.json, rahmen.json, rechnung.json). Dazu die Formatierer.
// Regel E10: Zahlen der Mappe kommen nur über W(lauf, schluessel) auf die Folien, gerundet wird erst beim Formatieren.
'use strict';
const path = require('path'), fs = require('fs');
const ORDNER = path.join(__dirname, '..', 'daten');
const NBSP = ' ', MINUS = '−';

let _werte = null, _outline = null;
const _dateien = {};
const lies = f => JSON.parse(fs.readFileSync(path.join(ORDNER, f), 'utf8'));

function werte() { return _werte || (_werte = lies('werte.json')); }

function eintrag(lauf, schluessel) {
  const L = werte().laeufe[lauf];
  if (!L) throw new Error(`werte.json: Lauf „${lauf}“ gibt es nicht. Vorhanden: ${Object.keys(werte().laeufe).join(', ')}`);
  const e = L.werte[schluessel];
  if (!e) {
    const stamm = schluessel.split('.').slice(0, 2).join('.');
    const nah = Object.keys(L.werte).filter(k => k.startsWith(stamm)).slice(0, 12);
    throw new Error(`werte.json: Schlüssel „${schluessel}“ fehlt im Lauf „${lauf}“.` + (nah.length ? ` Ähnliche Schlüssel: ${nah.join(', ')}` : ` Kein Schlüssel beginnt mit „${stamm}“; Katalog: daten/werte.json, Feld „bedeutung“.`));
  }
  return e;
}
// Rohwert der Mappe (Zahl, Text oder Liste). Bricht mit klarer Meldung ab, wenn Lauf oder Schlüssel fehlen.
function W(lauf, schluessel) { return eintrag(lauf, schluessel).wert; }
W.eintrag = eintrag;
// Zeitreihe (zr.*): Jahre von … bis, einschließlich; Vorgabe Jahr 1 bis 35 (E13)
W.reihe = (lauf, schluessel, von = 1, bis = 35) => {
  const v = W(lauf, schluessel);
  if (!Array.isArray(v)) throw new Error(`werte.json: „${schluessel}“ im Lauf „${lauf}“ ist keine Reihe.`);
  return v.slice(von - 1, bis);
};
W.laeufe = () => Object.keys(werte().laeufe);
W.meta = () => werte().meta;

// ---- Formatierer (deutsche Schreibweise, U+00A0 vor der Einheit, Minus U+2212) ---------------------------------
function runde(v, nk) { return Number(Math.round(Number(Math.abs(v) + 'e' + nk)) + 'e-' + nk); }
function zahl(v, nk = 0) {
  if (typeof v !== 'number' || !isFinite(v)) throw new Error(`Formatierer: „${v}“ ist keine Zahl.`);
  const r = runde(v, nk), s = r.toFixed(nk);
  let [g, d] = s.split('.');
  g = g.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (v < 0 && r !== 0 ? MINUS : '') + g + (d ? ',' + d : '');
}
const fmt = {
  NBSP, MINUS,
  zahl,                                                        // 84000 → „84.000“, −18495 → „−18.495“
  dez: (v, nk = 2) => zahl(v, nk),                             // 6.7659 → „6,77“
  euro: v => zahl(v, 0) + NBSP + '€',                          // 84000 → „84.000 €“
  mioZahl: (v, nk = 1) => zahl(v / 1e6, nk),                   // 5600000 → „5,6“
  mio: (v, nk = 1) => zahl(v / 1e6, nk) + NBSP + 'Mio.' + NBSP + '€',   // 5600000 → „5,6 Mio. €“
  prozent: (anteil, nk = 0) => zahl(anteil * 100, nk) + NBSP + '%',     // 0.8 → „80 %“ (Anteil der Mappe)
  prozentWert: (p, nk = 0) => zahl(p, nk) + NBSP + '%',                 // 3.74 → „3,74 %“ mit nk = 2
  euroQm: v => zahl(v, 2) + NBSP + '€/m²',                     // 6.7659 → „6,77 €/m²“
  euroJeQm: v => zahl(v, 2) + NBSP + '€ je' + NBSP + 'm²',     // 6.7659 → „6,77 € je m²“
  euroDez: v => zahl(v, 2) + NBSP + '€',                       // 6.7659 → „6,77 €“
  qm: v => zahl(v, 0) + NBSP + 'm²',                           // 1400 → „1.400 m²“
  nb: s => String(s).replace(/ /g, NBSP),                      // alle Leerzeichen schützen: „35 Jahre“ bleibt zusammen
};

// ---- Texte: Vergleichsform, Zahlwörter, Platzhalter --------------------------------------------------------------
// Vergleichsform eines Textes: geschützte Leerzeichen und Fettmarken weg, Leerraum einfach (für Gegenproben gegen das Konzept)
const glatt = s => String(s).split(NBSP).join(' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
// Zahlwort für kleine Zahlen im Satz: 3 → „drei“, mit gross „Drei“ (Fristen und Mindestzahlen stehen im Wortlaut der Folien als Wort)
const WORT = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];
function zahlwort(n, gross = false) {
  if (!Number.isInteger(n) || n < 0 || n >= WORT.length) throw new Error(`zahlwort: Für „${n}“ gibt es kein Zahlwort (0 bis ${WORT.length - 1}).`);
  return gross ? WORT[n][0].toLocaleUpperCase('de-DE') + WORT[n].slice(1) : WORT[n];
}
// Platzhalter in Texten der Datendateien füllen: „{name}“ setzt den Wert (ganze Zahlen in deutscher Schreibweise), „{name:wort}“ das Zahlwort.
// Listen und Objekte werden durchlaufen. Bricht ab, wenn ein Platzhalter keinen Wert hat. felder: { name: Text oder ganze Zahl }
function fuelle(v, felder, woher = 'Datendatei') {
  if (typeof v === 'string') {
    return v.replace(/\{(\w+)(?::(\w+))?\}/g, (m, k, art) => {
      if (!(k in felder)) throw new Error(`${woher}: Platzhalter „${m}“ hat keinen Wert (bekannt: ${Object.keys(felder).join(', ')}).`);
      if (art && art !== 'wort') throw new Error(`${woher}: Platzhalter „${m}“: Die Form „${art}“ gibt es nicht (nur „wort“).`);
      const w = felder[k];
      if (art === 'wort') return zahlwort(w);
      if (typeof w === 'number' && !Number.isInteger(w)) throw new Error(`${woher}: Platzhalter „${m}“ trägt die Zahl ${w}; gebrochene Zahlen fertig formatiert übergeben (fmt.*).`);
      return typeof w === 'number' ? zahl(w) : String(w);
    });
  }
  if (Array.isArray(v)) return v.map(x => fuelle(x, felder, woher));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fuelle(x, felder, woher)]));
  return v;
}

// ---- Konzept ---------------------------------------------------------------------------------------------------
function outline() { return _outline || (_outline = lies('outline.json')); }
function folieAusKonzept(id) {
  const f = outline().folien.find(x => x.id === id);
  if (!f) throw new Error(`outline.json: Folie „${id}“ gibt es nicht. Vorhanden: ${outline().folien.map(x => x.id).join(', ')}`);
  return f;
}

// ---- Datendateien der Baugruppen (fehlende Datei = leeres Objekt) ------------------------------------------------
// Baugruppe → Datei: regeln → regeln.json · ueberblick → markt.json · umsetzung → umsetzung.json · rahmen → rahmen.json · rechnung → rechnung.json
// (die Baugruppe rechnung liest fast alles aus werte.json; rechnung.json ist nur für Werte da, die die Mappe nicht führt)
const DATEIEN = ['regeln', 'markt', 'umsetzung', 'rahmen', 'rechnung', 'probe'];   // probe.json gehört nur den Musterfolien
function datei(name) {
  if (!DATEIEN.includes(name)) throw new Error(`Datendatei „${name}“ ist nicht vorgesehen. Erlaubt: ${DATEIEN.join(', ')}`);
  if (!(name in _dateien)) {
    const p = path.join(ORDNER, name + '.json');
    _dateien[name] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  }
  return _dateien[name];
}
// Wert aus einer Datendatei über einen Punktpfad: X('regeln', 'mietpfad.jahr4'). Trägt der Eintrag das Feld „wert“,
// wird dieses geliefert (die übrigen Felder sind Herkunft und Prüfstand). Bricht ab, wenn der Pfad fehlt.
function X(name, pfad) {
  let o = datei(name);
  for (const teil of pfad.split('.')) {
    if (o === null || typeof o !== 'object' || !(teil in o)) throw new Error(`daten/${name}.json: Pfad „${pfad}“ fehlt (bei „${teil}“).`);
    o = o[teil];
  }
  return o !== null && typeof o === 'object' && !Array.isArray(o) && 'wert' in o ? o.wert : o;
}

module.exports = { W, fmt, outline, folieAusKonzept, datei, X, DATEIEN, NBSP, MINUS, glatt, zahlwort, fuelle };
