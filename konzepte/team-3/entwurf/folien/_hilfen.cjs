// Hilfen für die Entwürfe von Team 3 (Vergleich): Reihenfolge der Varianten, Namen, Linienarten, Zugriff auf beide Zahlenquellen.
// Keine Folie (Dateiname mit „_“). Zahlen kommen nur aus konzepte/mappe/werte_konzepte.json (Vorgabe von ctx.wert) und
// team-3/mappe/werte_team.json (Block T3, Blatt „Team 3 Vergleich“); jede gelesene Zahl steht mit Blatt und Zelle in den Belegen.
'use strict';

// Pfad relativ zum Folienordner (ctx.wert löst relative Pfade gegen den Ordner der Module auf)
const TEAM = '../../mappe/werte_team.json';

// Reihenfolge des Vergleichsrasters: A, B, C, frei zur Miete für DSCR 1,2, frei zur Marktmiete. Nie umsortieren.
const V = ['A', 'B', 'C', 'frei_dscr', 'frei_markt'];
const GEF = ['A', 'B', 'C'];

// Linien im Zeitverlauf: gefördert in Tinte (drei Stricharten), frei finanziert in Referenzgrau (18,36 € voll, 15,42 € gestrichelt).
const LINIE = {
  A: { art: 'tinte', strich: 'solid' }, B: { art: 'tinte', strich: 'dash' }, C: { art: 'tinte', strich: 'sysDash' },
  frei_dscr: { art: 'referenz', strich: 'solid' }, frei_markt: { art: 'referenz', strich: 'dash' },
};

// Namen der Varianten; die Mieten frei finanziert kommen aus der Mappe (Konzepte!D12, Konzepte!D13)
function namen(ctx) {
  const { fmt, wert } = ctx;
  const dscr = fmt.euroDez(wert('n2.miete_dscr')), markt = fmt.euroDez(wert('n2.marktmiete_jahr1'));
  return { A: 'Gruppe A', B: 'Gruppe B', C: 'Gruppe C', frei_dscr: `Frei ${dscr}`, frei_markt: `Frei ${markt}`, dscr, markt };
}

// Fünf Werte eines Schlüssels in der Reihenfolge V (Team-Datei oder gemeinsame Datei)
const fuenf = (ctx, praefix, team = false) => V.map(v => ctx.wert(`${praefix}.${v}`, team ? TEAM : undefined));
const drei = (ctx, praefix, team = false) => GEF.map(v => ctx.wert(`${praefix}.${v}`, team ? TEAM : undefined));

// „a | b | c“ wie im Vortrag
const balken = (werte, f) => werte.map(v => f(v)).join(' | ');

module.exports = { TEAM, V, GEF, LINIE, namen, fuenf, drei, balken };
