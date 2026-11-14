// Hilfsdatei Team 1 (keine Folie): Zugriff auf die beiden Zahlenquellen.
//   K(schluessel): Konzepte-Mappe, Lauf „konzepte“ (konzepte/mappe/werte_konzepte.json)
//   L(lauf, schluessel): Konzepte-Mappe, Laufkopie (konzepte/mappe/laeufe/<lauf>.xlsx, gleiche Datei, Schlüssel n6.<lauf>.…)
//   T(schluessel): Team-1-Mappe, Block T1 (konzepte/team-1/mappe/werte_team.json)
// Jede Zahl landet mit Blatt und Zelle in der Belegdatei neben der pptx.
'use strict';
const path = require('path');
const TEAM = path.resolve(__dirname, '..', '..', 'mappe', 'werte_team.json');
// Variantenspalten in fester Reihenfolge: A | B | C | frei (frei = frei finanziert zur Miete für DSCR 1,2, Spalte H)
const V = ['A', 'B', 'C', 'frei_dscr'];
module.exports = ctx => {
  const K = k => ctx.wert('konzepte:' + k);
  const L = (lauf, k) => ctx.wert(`${lauf}:n6.${lauf}.${k}`);
  const T = k => ctx.wert(k, TEAM);
  return { K, L, T, V };
};
