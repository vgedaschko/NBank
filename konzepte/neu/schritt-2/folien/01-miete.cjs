// Folie 3.3: Miete für eine DSCR von 1,2 in Jahr 1, Gruppe A gegen frei finanziert, als Balkenpaar (gefördert in Tinte, frei finanziert in
// Referenzgrau, wie Folie 19 heute). Marken: Höchstmiete am Balken A, Marktmiete am Balken frei finanziert. Der Abstand zwischen Balkenende
// und Marke ist die Luft (A) oder die Lücke (frei finanziert). Rechts Ergebnis und Lesart.
'use strict';

module.exports = {
  id: 'miete',
  o: { nr: '3.3', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · MIETE',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Konzepte D12, D13, D19, D22, D62, G62.' },
  bau(ctx) {
    const { B, D, fmt, ZONE } = ctx, wl = (t, was) => ctx.wortlaut(t, was), p = t => wl(t, 'Stichpunkt');
    const nA = ctx.wert('n3.miete_dscr.A'), hm = ctx.wert('n3.hoechstmiete.A'), nF = ctx.wert('n2.miete_dscr'), markt = ctx.wert('n2.marktmiete_jahr1');
    const dA = ctx.wert('n5.dscr_jahr1.A'), dF = ctx.wert('n5.dscr_jahr1.frei_markt'), ziel = ctx.wert('n1.dscr_ziel_bank_frei');
    ctx.pruefe(nA < hm && nF > markt && dA >= ziel && dF < ziel, 'A erreicht die DSCR von 1,2 zur Höchstmiete nicht, oder frei finanziert erreicht sie zur Marktmiete.');
    const anteil = hm / markt;   // Höchstmiete A ÷ Marktmiete (Konzepte D19 ÷ D13)
    const s = ctx.folie(ctx.titelzeilen([`Frei finanziert braucht ${fmt.euroDez(nF)}`, `Miete, der Markt zahlt ${fmt.euroDez(markt)}`], fmt.euroDez(nF)));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: wl(`Miete für eine DSCR von ${fmt.dez(ziel, 1)} in Jahr 1`, 'Diagrammtitel'), sub: wl('in € je m² und Monat · Balken: Miete für DSCR 1,2 · Linie: erzielbare Miete', 'Untertitel') });
    const cz = ZONE.diagramm.chart;
    const d = D.balkenpaar(s, { x: cz.x, y: cz.y, w: cz.w, h: cz.h, kategorien: ['Gruppe A', 'Frei finanziert'], werte: [nA, nF], arten: ['tinte', 'referenz'],
      reihenname: 'Miete für DSCR 1,2', achse: { min: 0, max: 21, schritt: 3, format: 'roh' }, katBreite: 1.55, rand: { o: 0.60, r: 1.20, u: 0.50 }, name: 'Diagramm Miete für DSCR 1,2' });
    B.achsentitel(s, d, { x: wl('Miete in € je m² und Monat', 'Achsentitel') });
    const bh = d.balkenHoehe;
    // Werte rechts neben dem Balken; bei A rechts der Marke, wenn die Marke dicht hinter dem Balken steht
    B.textAufPlot(s, fmt.euroDez(nA), { x: Math.max(d.xWert(nA), d.xWert(hm)) + 0.12, y: d.katMitte(0) - 0.20, w: 1.3, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert Gruppe A' });
    B.textAufPlot(s, fmt.euroDez(nF), { x: d.xWert(nF) + 0.12, y: d.katMitte(1) - 0.20, w: 1.3, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Wert frei finanziert' });
    B.marke(s, { x: d.xWert(hm), y: d.katMitte(0) - bh / 2 - 0.32, h: bh + 0.44, art: 'mass', text: `Höchstmiete ${fmt.euroDez(hm)}`, textSeite: 'oben', textBreite: 2.0 });
    B.marke(s, { x: d.xWert(markt), y: d.katMitte(1) - bh / 2 - 0.32, h: bh + 0.44, art: 'mass', text: `Marktmiete ${fmt.euroDez(markt)}`, textSeite: 'oben', textBreite: 2.0 });

    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: wl('Ergebnis', 'Überschrift'), punkte: [
        p(`A zur Höchstmiete: DSCR ${fmt.dez(dA, 2)}`), p(`frei finanziert zur Marktmiete: DSCR ${fmt.dez(dF, 2)}`),
        p(`Höchstmiete A: ${fmt.prozent(anteil, 0)} der Marktmiete`)] },
      { titel: wl('Lesart', 'Überschrift'), punkte: [
        p('DSCR = Überschuss vor Kapitaldienst ÷ Kapitaldienst'),
        p(`${fmt.dez(ziel, 1)} verlangt die Bank für ihr Darlehen, Annahme der PGN`),
        p('gefördert gibt es kein Bankdarlehen. Die NBank prüft Eigenmittel und angemessenen Gewinn.')] }] });
  },
};
