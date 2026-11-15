// Konzept 2 „Bildband und drei Kennzahlen“: oben die Visualisierung als Band über die ganze Breite, darunter drei Kennzahlen (44 pt).
'use strict';
const { fakten, bild } = require('./_modellhaus.cjs');
module.exports = {
  id: 'k2-kennzahlen',
  o: { nr: 'K2', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · MODELLHAUS', quellen: 'Projektdaten PGN, Rechenmappe v3' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, f = fakten(ctx), { fmt } = f;
    const s = ctx.folie(ctx.titelzeilen(['Gerechnet wird ein PGN-Projekt:', `${f.we} Wohnungen in Neu Wulmstorf`], `${f.we} Wohnungen`));
    B.register(s, '2.1');
    const hB = 2.05;
    bild(ctx, s, { x: colX(1), y: Y.inhalt, w: span(12), h: hB });
    const y0 = +(Y.inhalt + hB + 0.22).toFixed(3);
    [[`${f.we}`, 'Wohnungen', 'Wohnungen', `alle für Einkommensgruppe A. ${f.standard}.`],
     [fmt.zahl(f.wf), 'm²', 'Wohnfläche', `im Schnitt ${fmt.qm(Math.round(f.schnitt))}. Mietenstufe ${f.mietenstufe}.`],
     [fmt.dez(f.gk / 1e6, 2), 'Mio. €', 'Gesamtkosten', `${fmt.euro(f.kostenQm)} je m². Grundstück im Bestand.`]].forEach(([zahl, einheit, label, text], i) =>
      B.kennzahl(s, { x: colX(1 + 4 * i), y: y0, w: span(4), zahl, einheit, label, text, kompakt: true }));
  },
};
