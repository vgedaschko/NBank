// Konzept 1 „Bild und Steckbrief“: links die Visualisierung über sieben Spalten in voller Höhe, rechts vier Zeilen Steckbrief (Planlegende 14 pt).
'use strict';
const { fakten, bild } = require('./_modellhaus.cjs');
module.exports = {
  id: 'k1-steckbrief',
  o: { nr: 'K1', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · MODELLHAUS', quellen: 'Projektdaten PGN, Rechenmappe v3' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, f = fakten(ctx), { fmt } = f;
    const s = ctx.folie(ctx.titelzeilen(['Gerechnet wird ein PGN-Projekt:', `${f.we} Wohnungen in Neu Wulmstorf`], `${f.we} Wohnungen`));
    B.register(s, '2.1');
    bild(ctx, s, { x: colX(1), y: Y.inhalt, w: span(7), h: Y.inhaltEnde - Y.inhalt });
    B.planlegende(s, { x: colX(8), y: Y.inhalt, w: span(5), pt: 14, linie: true, eintraege: [
      { titel: 'Lage', text: `${f.ort}, Mietenstufe ${f.mietenstufe}` },
      { titel: 'Haus', text: `${f.we} Wohnungen, ${fmt.qm(f.wf)}, im Schnitt ${fmt.qm(Math.round(f.schnitt))}. ${f.standard}.` },
      { titel: 'Kosten', text: `${fmt.euro(f.kostenQm)} je m², zusammen ${fmt.mio(f.gk, 2)}. Grundstück im Bestand, nicht angesetzt.` },
      { titel: 'Rechnung', text: `Bezug ${f.bezug}, ${f.bindung} Jahre. Gefördert in Gruppe A und frei finanziert.` }] });
  },
};
