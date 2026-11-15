// Schritt 2 · Fazit, Richtung A „Vier Kennzahlen“: vier Kacheln im Raster 2 × 2, je Grund eine Zahl in 44 pt, darunter der Grund als
// Label (16 pt) und ein Satz (14 pt). Weißer Grund wie Kapitel 4.
'use strict';
const { gruende } = require('./_daten.cjs');

module.exports = {
  id: 'fazit-richtung-a',
  o: { nr: 'F', abschnitt: 'Fazit', zeichen: '✓', layout: 'PGN_INHALT', kicker: 'FAZIT', rubrik: 'Fazit',
    quellen: 'Quellen: Folien 6, 10, 12, 3.3 und 3.4 dieses Vortrags.' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const g = gruende(ctx);
    const s = ctx.folie({ ...ctx.titelzeilen(['Vier Gründe für geförderten', 'Mietwohnungsbau'], 'Vier Gründe'), kopfzeichen: false });
    const zeilenY = [Y.inhalt, +(Y.inhalt + 2.20).toFixed(3)];
    g.forEach((e, i) => {
      wl(`${e.titel}: ${e.satz}`, `Grund ${i + 1}`);
      B.kennzahl(s, { x: colX(1 + 6 * (i % 2)), y: zeilenY[Math.floor(i / 2)], w: span(6), vorsatz: e.vorsatz, zahl: e.zahl, einheit: e.einheit,
        label: e.titel, text: e.kurz });
    });
  },
};
