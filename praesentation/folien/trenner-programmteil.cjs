// Folie 8 · Trenner „Programmteil 2.1: die Konditionen“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel und Vorspann im
// Wortlaut des Konzepts, Achsleiste der vier Abschnitte. Aufbau und Zählung: S.trenner in folien/_struktur.cjs. Keine Zahlen.
// Der Vorspann ist von Hand in zwei Zeilen gebrochen: Sonst stünde „Darlehens.“ allein in der zweiten Zeile.
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'trenner-programmteil',
  bau(ctx) {
    const zeilen = ['Was neu ist, dazu Höchstmiete, Fördersätze', 'und Eckdaten des Darlehens.'];
    ctx.wortlaut(zeilen.join(' '), 'Vorspann');
    S.trenner(ctx, { lead: zeilen.join('\n') });
  },
};
