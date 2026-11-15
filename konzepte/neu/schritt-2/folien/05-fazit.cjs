// Schritt 2 · Fazit, Richtung B „Vier Sätze“: vier Zeilen über die ganze Breite, je Zeile Nummer, Grund als Modultitel (16 pt) und der
// Satz des Auftraggebers in 14 pt. Keine großen Zahlen. Weißer Grund wie Kapitel 4.
'use strict';
const { gruende } = require('./_daten.cjs');

module.exports = {
  id: 'fazit-richtung-b',
  o: { nr: 'F', abschnitt: 'Fazit', zeichen: '✓', layout: 'PGN_INHALT', kicker: 'FAZIT', rubrik: 'Fazit',
    quellen: 'Quellen: Folien 6, 10, 12, 3.3 und 3.4 dieses Vortrags.' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const g = gruende(ctx);
    const s = ctx.folie({ ...ctx.titelzeilen(['Vier Gründe für geförderten', 'Mietwohnungsbau'], 'Vier Gründe'), kopfzeichen: false });
    const hoehe = +((Y.inhaltEnde - Y.inhalt) / 4).toFixed(3), kreis = 0.42;
    g.forEach((e, i) => {
      const y = +(Y.inhalt + i * hoehe).toFixed(3);
      wl(`${e.titel}: ${e.satz}`, `Grund ${i + 1}`);
      B.linie(s, { x: colX(1), y, w: span(12), art: i === 0 ? 'modul' : 'haar', name: `Grund ${i + 1} Linie` });
      B.achskreis(s, { cx: colX(1) + kreis / 2, cy: y + 0.40, d: kreis, pt: 14, text: String(i + 1), name: `Grund ${i + 1} Nummer` });
      B.text(s, e.titel, { x: colX(1) + kreis + 0.16, y: y + 0.22, w: span(5) - kreis - 0.16, h: 0.36, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: `Grund ${i + 1} Titel` });
      B.text(s, e.satz, { x: colX(6), y: y + 0.24, w: span(7), rolle: 'dicht', name: `Text Grund ${i + 1}` });
    });
  },
};
