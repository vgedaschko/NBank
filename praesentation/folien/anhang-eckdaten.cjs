// Folie A6 · PGN_ANHANG: Eckdaten des Programmteils 2.1 als zwei native Tabellen im Raster 6 + 6, je sechs Zeilen aus Stichwort und Text
// (Broschüre S. 9 über daten/regeln.json). Zahlen, die auch die Mappe führt, füllt werteAusMappe aus werte.json (tab.*).
'use strict';
const { werteAusMappe } = require('./_regeln.cjs');

module.exports = {
  id: 'anhang-eckdaten',
  bau(ctx) {
    const { B, X, colX, span, Y } = ctx, s = ctx.folie();
    B.schluesselplan(s, '2.1');
    const zeilen = X('regeln', 'eckdaten.zeilen'), werte = werteAusMappe(ctx), JE_BLOCK = 6;
    if (zeilen.length !== 2 * JE_BLOCK) throw new Error(`daten/regeln.json: eckdaten.zeilen hat ${zeilen.length} Zeilen, die Folie zeigt ${2 * JE_BLOCK} in zwei Blöcken.`);
    // Beide Blöcke enden auf derselben Höhe: Ein Messlauf rechnet die Höhen, der kürzere Block bekommt die Höhe des längeren als Ziel
    // (B.tabelle hebt dafür seine kurzen Zeilen auf eine gemeinsame Mindesthöhe).
    const block = k => ({ x: colX(1 + 6 * k), y: Y.anhangInhalt + 0.05, w: span(6), pt: 12, kopf: false, name: k ? 'Tabelle Eckdaten rechts' : 'Tabelle Eckdaten links',
      spalten: [{ breite: 1.55, art: 'stichwort' }, { art: 'text' }],
      zeilen: zeilen.slice(k * JE_BLOCK, (k + 1) * JE_BLOCK).map(z => ({ zellen: [z.stichwort, ctx.fuelle(z.text, werte, 'daten/regeln.json')], flaeche: !!z.flaeche })) });
    const ziel = Math.max(...[0, 1].map(k => B.tabelle(s, { ...block(k), messen: true }).h));
    [0, 1].forEach(k => {
      const o = block(k);
      B.linie(s, { x: o.x, y: Y.anhangInhalt, w: o.w, art: 'modul', name: 'Modulkopf-Linie' });
      B.tabelle(s, { ...o, zielHoehe: ziel });
    });
  },
};
