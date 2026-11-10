// Folie 17 · PGN_INHALT_MR im Raster 6 + 6 (die Bezeichnungen der Tabelle „Kapitaldienst p. a.“ und „Nötige Miete je m²“ stehen so einzeilig): nötige Miete in Jahr 1 als Balkenpaar (gefördert in Tinte, frei finanziert in Referenzgrau,
// Reihenfolge und Farben wie Folie 14), Werte als Kernwerte am Balkenende, Maßlinie bei der Höchstmiete der Gruppe A.
// Rechts die Vergleichstabelle der Broschüre S. 11 mit den Annahmen der freien Finanzierung als Untertitel. Kein Rot im Diagramm. Alle Zahlen aus werte.json (Lauf modellhaus).
'use strict';

module.exports = {
  id: 'rechnung-miete',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');

    // Balkenpaar über sechs Spalten
    const yInhalt = B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(6), titel: 'Nötige Miete in Jahr 1', sub: 'Miete je m² und Monat, bei der der Zahlungsüberschuss null ist' });
    const werte = [M('dscr.noetige_miete.A'), M('dscr.noetige_miete.Frei')];
    const d = D.balkenpaar(s, { x: colX(1), y: yInhalt + 0.10, w: span(6), h: 3.40, kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], werte, arten: ['tinte', 'referenz'], reihenname: 'Nötige Miete',
      achse: { min: 0, max: 24, schritt: 4, format: 'roh' }, katBreite: 1.55, rand: { o: 0.52, r: 0.30 }, name: 'Diagramm Nötige Miete' });
    // kurzer Balken: Wert rechts daneben (auf einer Fläche in der Grundfarbe, die die Gitterlinie hinter der Zahl unterbricht);
    // langer Balken: Wert weiß im Balkenende
    B.textAufPlot(s, fmt.euroDez(werte[0]), { x: d.xWert(werte[0]) + 0.14, y: d.katMitte(0) - 0.20, w: 1.5, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert am Balken gefördert' });
    B.text(s, fmt.euroDez(werte[1]), { x: d.xWert(werte[1]) - 1.74, y: d.katMitte(1) - 0.20, w: 1.6, h: 0.40, rolle: 'kernwert', farbe: 'FFFFFF', align: 'right', valign: 'middle', einzeilig: true, name: 'Wert am Balken frei finanziert' });
    const hm = M('fin.miete_jahr1.A');
    B.marke(s, { x: d.xWert(hm), y: d.plot.y - 0.32, h: d.plot.h + 0.32, art: 'mass', text: `Höchstmiete Gruppe A: ${fmt.euroDez(hm)}`, textSeite: 'rechts', textBreite: 2.4 });

    // Vergleichstabelle über sechs Spalten; die Unterkante steht auf der Grundlinie des Diagramms. Der Untertitel nennt Zins und Laufzeit des
    // Bankdarlehens, an denen Kapitaldienst und nötige Miete der Spalte „Frei finanziert“ hängen (Broschüre S. 11 führt beides auf einer Seite)
    const annahme = ctx.wortlaut(`Bankdarlehen zu ${fmt.prozent(M('eingabe.zins_bank'), 2)} Zins, Annuität über ${M('eingabe.laufzeit_bank')} Jahre`, 'Untertitel der Vergleichstabelle');
    const yTab = B.modulkopf(s, { x: colX(7), y: Y.inhalt, w: span(6), titel: 'Zum Vergleich: frei finanziert', sub: annahme }) - 0.06;
    // frei finanziert bleibt nach Bankdarlehen und Eigenmitteln kein Zuschuss: Gesamtkosten − Bankdarlehen − Eigenmittel
    const zuschussFrei = M('fin.gesamtkosten.Frei') - M('fin.bankdarlehen.Frei') - M('fin.eigenmittel.Frei');
    const zeilen = [
      { text: 'Zuschuss', wert: fmt.mio(M('fin.zuschuss.A')), vergleich: fmt.zahl(zuschussFrei) },
      { text: 'Darlehen', wert: fmt.mio(M('fin.darlehen_nbank.A')), vergleich: fmt.mio(M('fin.bankdarlehen.Frei')) },
      { text: 'Kapitaldienst p. a.', wert: fmt.euro(M('dscr.kapitaldienst_jahr1.A')), vergleich: fmt.euro(M('dscr.kapitaldienst_jahr1.Frei')) },
      { text: 'Nötige Miete je m²', wert: fmt.euroDez(werte[0]), vergleich: fmt.euroDez(werte[1]), kern: true }];
    const kopfH = 0.56, frei = d.plot.y + d.plot.h - yTab - kopfH, teil = [0.21, 0.21, 0.21, 0.37];   // Zeilenhöhen als Anteile der freien Höhe
    zeilen.forEach((z, i) => { z.h = +(frei * teil[i]).toFixed(3); });
    B.vergleichstabelle(s, { x: colX(7), y: yTab, w: span(6), wertBreite: 1.74, kopf: ['Jahr 1', 'Gefördert\n(A)', 'Frei\nfinanziert'], zeilen, name: 'Vergleichstabelle frei finanziert' });
  },
};
