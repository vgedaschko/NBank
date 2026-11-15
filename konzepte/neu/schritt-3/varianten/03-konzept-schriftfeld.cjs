// Konzept 3 „Plankopf“: ohne Bild, ein Schriftfeld wie auf einem Bauplan (Tabelle 14 pt über sieben Spalten), rechts die Gegenüberstellung,
// mit der gerechnet wird: dasselbe Haus gefördert in Gruppe A und frei finanziert.
'use strict';
const { fakten } = require('./_modellhaus.cjs');
module.exports = {
  id: 'k3-schriftfeld',
  o: { nr: 'K3', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · MODELLHAUS', quellen: 'Projektdaten PGN, Rechenmappe v3' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, f = fakten(ctx), { fmt } = f;
    const s = ctx.folie(ctx.titelzeilen(['Gerechnet wird ein PGN-Projekt:', `${f.we} Wohnungen in Neu Wulmstorf`], `${f.we} Wohnungen`));
    B.register(s, '2.1');
    const yT = B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(7), titel: 'Das Modellhaus', sub: 'Projektdaten PGN' });
    B.tabelle(s, { x: colX(1), y: yT + 0.02, w: span(7), pt: 14, kopf: false, name: 'Tabelle Modellhaus',
      spalten: [{ kopf: 'Merkmal', breite: 2.30, art: 'stichwort' }, { kopf: 'Angabe', art: 'text' }],
      zeilen: [['Ort', f.ort], ['Wohnungen', `${f.we}, im Schnitt ${fmt.qm(Math.round(f.schnitt))}`], ['Wohnfläche', fmt.qm(f.wf)], ['Standard', f.standard],
        ['Mietenstufe', f.mietenstufe], ['Herstellungskosten', `${fmt.euro(f.kostenQm)} je m²`], ['Gesamtkosten', fmt.mio(f.gk, 2)], ['Grundstück', 'im Bestand, nicht angesetzt'], ['Bezug', String(f.bezug)]] });
    B.planlegende(s, { x: colX(9), y: Y.inhalt, w: span(4), pt: 14, linie: true, eintraege: [
      { titel: 'Gerechnet wird zweimal', text: 'Dasselbe Haus, dieselben Kosten, dasselbe Eigenkapital.' },
      { titel: 'Gefördert', text: 'Programmteil 2.1, Einkommensgruppe A, Höchstmiete.' },
      { titel: 'Frei finanziert', text: 'Bankdarlehen, Marktmiete.' },
      { titel: 'Zeitraum', text: `${f.bindung} Jahre ab Bezug ${f.bezug}.` }] });
  },
};
