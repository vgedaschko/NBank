// Schritt 2 · Folie 3.4, Richtung B „Das Diagramm ist die Folie“: Liniendiagramm über die ganze Breite, Werte für Jahr 1 und Jahr 35 im
// Diagramm, Marke bei dem Jahr, ab dem C vor A liegt. Der Grund steht in einem Satz im Hinweiskasten darunter.
'use strict';
const { verlauf } = require('../folien/_daten.cjs');

module.exports = {
  id: 'verlauf-richtung-b',
  o: { nr: '3.4', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · VERLAUF',
    quellen: 'Quelle: Rechenmappe v3, Gefördert A und C, Jahr 1 bis 35; Konzepte D61, F61, D64, F64.' },
  bau(ctx) {
    const { B, D, fmt, ZONE, colX, span, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const { jahre, n, A, C, ab, iAb, M } = verlauf(ctx);
    const s = ctx.folie(ctx.titelzeilen(['Kein Jahr mit Fehlbetrag,', `ab Jahr ${ab} liegt Gruppe C vor A`], `ab Jahr ${ab}`));
    B.register(s, '2.1');
    const W12 = span(12);
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: W12, titel: wl(`Zahlungsüberschuss je Jahr, Jahr ${jahre[0]} bis ${jahre[n]}`, 'Modultitel'),
      sub: wl(`in € p. a., nach Kapitaldienst · Miete alle drei Jahre +${fmt.prozent(M('tab.mieterhoehung_in_der_bindung'), 2)}`, 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte', strich: 'solid' }, { text: 'Gruppe C', art: 'referenz', strich: 'solid' }] });

    const kdA = M('dscr.kapitaldienst_jahr1.A'), kdC = M('dscr.kapitaldienst_jahr1.C');
    const hinweis = wl(`A hat mehr Zuschuss und zahlt ${fmt.euro(kdA)} statt ${fmt.euro(kdC)} Kapitaldienst. C hat die höhere Miete, ihr Vorteil wächst mit jeder Mietanpassung.`, 'Hinweiskasten');
    const hH = B.hinweisHoehe(hinweis, { w: W12 }), c = ZONE.diagramm.chart;
    const d = D.linien(s, { x: colX(1), y: c.y, w: W12, h: +(Y.inhaltEnde - c.y - hH - 0.12).toFixed(3), kategorien: jahre,
      katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] }, rand: { l: 1.02, r: 1.30, u: 0.50 }, name: 'Diagramm Zahlungsüberschuss A und C',
      reihen: [{ name: 'Gruppe A', werte: A, art: 'tinte', strich: 'solid' }, { name: 'Gruppe C', werte: C, art: 'referenz', strich: 'solid' }],
      achse: { min: 0, max: 100000, schritt: 20000, format: 'ganz' } });
    ctx.pruefe(Math.max(...A, ...C) < 100000, 'Ein Wert reicht über die Größenachse.');
    B.achstexte(s, d);
    B.achsentitel(s, d, { y: wl('in € p. a.', 'Achsentitel'), x: wl('Jahr', 'Achsentitel'), xAbstand: 0.29 });
    const band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;
    B.marke(s, { x: d.katMitte(0), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahre[0], textSeite: 'rechts', textBreite: 1.0 });
    B.wertzeilen(s, { x: d.katMitte(0) + 0.10, mitten: [band(80000), band(60000)], name: 'Jahr ' + jahre[0],
      eintraege: [{ kreis: 'A', text: fmt.zahl(A[0]) }, { kreis: 'C', text: fmt.zahl(C[0]) }] });
    B.marke(s, { x: d.katMitte(iAb), y: d.plot.y, h: d.plot.h, art: 'mass', text: `Jahr ${ab}`, textSeite: 'rechts', textBreite: 2.6 });
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: [
      { kreis: 'C', y: d.yWert(C[n]), wert: fmt.zahl(C[n]) }, { kreis: 'A', y: d.yWert(A[n]), wert: fmt.zahl(A[n]) }] });
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: W12, name: 'Grund', text: hinweis });
  },
};
