// Muster PGN_INHALT_MR im Raster 7 + 5: Balkenpaar gefördert gegen frei finanziert (Tinte und Referenzgrau), Werte als Kernwerte am
// Balkenende, senkrechte Marke; rechts die Vergleichstabelle in dichter Fassung mit einer Kernzeile.
'use strict';
module.exports = {
  id: 'p21-inhalt-mr-balkenpaar',
  o: { nr: '21', layout: 'PGN_INHALT_MR', titel: 'Nötige Miete: 6,77 € gefördert, 20,72 € je m² frei finanziert',
    inhalt: 'Kicker: „MODELLRECHNUNG · NÖTIGE MIETE“. Titelzeilen: „Nötige Miete: 6,77 € gefördert,“ | „20,72 € je m² frei finanziert“ (Signaturwort: „6,77 €“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(7), titel: 'Nötige Miete in Jahr 1', sub: 'Miete je m² und Monat, bei der der Zahlungsüberschuss null ist' });
    const werte = [M('dscr.noetige_miete.A'), M('dscr.noetige_miete.Frei')];
    const d = D.balkenpaar(s, { x: colX(1), y: 2.95, w: span(7), h: 3.30, kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], werte, arten: ['tinte', 'referenz'], reihenname: 'Nötige Miete',
      achse: { min: 0, max: 24, schritt: 4, format: 'roh' }, katBreite: 1.55, rand: { o: 0.50, r: 0.30 }, name: 'Diagramm Nötige Miete' });
    // kurzer Balken: Wert rechts daneben auf einer Fläche in der Grundfarbe (B.textAufPlot unterbricht die Gitterlinie hinter der Zahl);
    // langer Balken: Wert weiß im Balkenende
    B.textAufPlot(s, fmt.euroDez(werte[0]), { x: d.xWert(werte[0]) + 0.14, y: d.katMitte(0) - 0.20, w: 1.5, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert am Balken gefördert' });
    B.text(s, fmt.euroDez(werte[1]), { x: d.xWert(werte[1]) - 1.72, y: d.katMitte(1) - 0.20, w: 1.6, h: 0.40, rolle: 'kernwert', farbe: 'FFFFFF', align: 'right', valign: 'middle', einzeilig: true, name: 'Wert am Balken frei finanziert' });
    const hm = M('fin.miete_jahr1.A');
    B.marke(s, { x: d.xWert(hm), y: d.plot.y - 0.30, h: d.plot.h + 0.30, art: 'mass', text: `Höchstmiete Gruppe A: ${fmt.euroDez(hm)}`, textSeite: 'rechts', textBreite: 2.6 });
    B.modulkopf(s, { x: colX(8), y: Y.inhalt, w: span(5), titel: 'Zum Vergleich: frei finanziert' });
    B.vergleichstabelle(s, { x: colX(8), y: 2.60, w: span(5), dicht: true, wertBreite: 1.62, kopf: ['Jahr 1', 'Gefördert\n(A)', 'Frei\nfinanziert'], zeilen: [
      { text: 'Zuschuss', wert: fmt.mio(M('fin.zuschuss.A')), vergleich: '0' },
      { text: 'Darlehen', wert: fmt.mio(M('fin.darlehen_nbank.A')), vergleich: fmt.mio(M('fin.bankdarlehen.Frei')) },
      { text: 'Kapitaldienst p. a.', wert: fmt.euro(M('dscr.kapitaldienst_jahr1.A')), vergleich: fmt.euro(M('dscr.kapitaldienst_jahr1.Frei')) },
      { text: 'Nötige Miete je m²', wert: fmt.euroDez(werte[0]), vergleich: fmt.euroDez(werte[1]), kern: true }] });
  },
};
