// Folie 20 · PGN_DIAGRAMM_MR: Zahlungsüberschuss je Jahr in A und C, Jahr 1 bis 35 (Liniendiagramm über sieben Spalten), rechts Stichpunkte
// unter „Grund“ und „Annahmen“. Marken bei Jahr 1 (Werte A und C) und bei dem Jahr, ab dem C vor A liegt; Werte für Jahr 35 an den
// Linienenden, dazwischen der Abstand als Maßkette. Zeitreihe aus werte.json (Lauf modellhaus_zeitreihe), gegen Blatt Kennzahlen geprüft.
'use strict';
const { verlauf } = require('./_modell.cjs');

module.exports = {
  id: 'rechnung-verlauf',
  bau(ctx) {
    const { B, D, fmt, ZONE, colX } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const { jahre, n, A, C, ab, iAb, M } = verlauf(ctx);
    const s = ctx.folie(ctx.titelzeilen(['Kein Jahr mit Fehlbetrag,', 'jede Mietanpassung hebt den Überschuss'], 'Kein Jahr'));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: wl(`Zahlungsüberschuss je Jahr, Jahr ${jahre[0]} bis ${jahre[n]}`, 'Diagrammtitel'),
      sub: wl('in € p. a., nach Kapitaldienst', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte', strich: 'solid' }, { text: 'Gruppe C', art: 'referenz', strich: 'solid' }] });

    const cz = ZONE.diagramm.chart;
    const d = D.linien(s, { x: cz.x, y: cz.y, w: cz.w, h: cz.h, kategorien: jahre, katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] },
      rand: { l: 1.02, r: 1.30, u: 0.50 }, name: 'Diagramm Zahlungsüberschuss A und C',
      reihen: [{ name: 'Gruppe A', werte: A, art: 'tinte', strich: 'solid' }, { name: 'Gruppe C', werte: C, art: 'referenz', strich: 'solid' }],
      flaeche: { reihe: 'Gruppe C', name: 'Fläche Gruppe C', deckung: 26 },
      achse: { min: 0, max: 100000, schritt: 20000, format: 'ganz' } });
    ctx.pruefe(Math.max(...A, ...C) < 100000, 'Ein Wert reicht über die Größenachse.');
    B.achstexte(s, d);
    B.achsentitel(s, d, { y: wl('Zahlungsüberschuss in € p. a.', 'Achsentitel'), x: wl('Jahr', 'Achsentitel'), xAbstand: 0.29, yVon: d.y + 0.04, yBis: d.plot.y + d.plot.h + 0.24 });
    const band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“
    B.marke(s, { x: d.katMitte(0), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahre[0], textSeite: 'rechts', textBreite: 0.8 });
    B.wertzeilen(s, { x: d.katMitte(0) + 0.10, mitten: [band(80000), band(60000)], name: 'Jahr ' + jahre[0],
      eintraege: [{ kreis: 'A', text: fmt.zahl(A[0]) }, { kreis: 'C', text: fmt.zahl(C[0]) }] });
    B.marke(s, { x: d.katMitte(iAb), y: d.plot.y, h: d.plot.h, art: 'mass', text: `Jahr ${ab}`, textSeite: 'rechts', textBreite: 1.3 });
    // Abstand in Jahr 35 als senkrechte Maßkette zwischen den Linienenden, der Wert links davon zwischen den Linien
    B.massketteSenkrecht(s, { x: d.katMitte(n), y0: d.yWert(C[n]), y1: d.yWert(A[n]), text: `+${fmt.euro(C[n] - A[n])}`, seite: 'links', name: 'Abstand Jahr 35' });
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: [
      { kreis: 'C', y: d.yWert(C[n]), wert: fmt.zahl(C[n]) }, { kreis: 'A', y: d.yWert(A[n]), wert: fmt.zahl(A[n]) }] });

    const kdA = M('dscr.kapitaldienst_jahr1.A'), kdC = M('dscr.kapitaldienst_jahr1.C'), mA = M('fin.miete_jahr1.A'), mC = M('fin.miete_jahr1.C');
    const p = t => wl(t, 'Stichpunkt');
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: wl('Grund', 'Überschrift'), punkte: [
        p(`A: mehr Zuschuss, Kapitaldienst ${fmt.euro(kdA)} statt ${fmt.euro(kdC)}. Der Vorteil bleibt etwa gleich.`),
        p(`C: Miete ${fmt.euroDez(mC)} statt ${fmt.euroDez(mA)}. Der Vorteil wächst mit jeder Mietanpassung.`)] },
      { titel: wl('Annahmen', 'Überschrift'), punkte: [
        p(`Miete alle drei Jahre +${fmt.prozent(M('tab.mieterhoehung_in_der_bindung'), 2)}, Höchstwert`),
        p(`Tilgung ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)} p. a.`)] }] });
  },
};
