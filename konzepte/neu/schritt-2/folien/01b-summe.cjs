// Schritt 2 · Folie 3.5 (neu, hinter 3.4): Zahlungsüberschuss aufsummiert, Jahr 1 bis 35, A und C, ohne Zinsen. Waagerechte Linie beim
// Eigenkapital; die Linien schneiden sie im Jahr des Rückflusses. Werte für Jahr 35 an den Linienenden. Rechts Ergebnis und Lesart.
// Das VOFI-Projektkonto (mit Zinsen) steht bewusst nicht hier, sondern auf der Renditefolie.
'use strict';
const { verlauf } = require('./_daten.cjs');

module.exports = {
  id: 'summe',
  o: { nr: '3.5', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · RÜCKFLUSS',
    quellen: 'Quelle: Rechenmappe v3, Gefördert A und C, Jahr 1 bis 35; Konzepte D56, F56, D66, F66, D67, F67.' },
  bau(ctx) {
    const { B, D, fmt, ZONE, colX } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const { jahre, n, A, C } = verlauf(ctx);
    const kum = r => r.reduce((acc, v, i) => (acc.push((i ? acc[i - 1] : 0) + v), acc), []);   // laufende Summe, ohne Zinsen
    const kA = kum(A), kC = kum(C);
    const ekA = ctx.wert('n5.eigenkapital.A'), ekC = ctx.wert('n5.eigenkapital.C');
    const jA = ctx.wert('n5.jahr_ek_erreicht.A'), jC = ctx.wert('n5.jahr_ek_erreicht.C');
    ctx.gleich('Summe A Jahr 35 gegen Konzepte!D66', kA[n], ctx.wert('n5.kum_jahr35.A'), 0);
    ctx.gleich('Summe C Jahr 35 gegen Konzepte!F66', kC[n], ctx.wert('n5.kum_jahr35.C'), 0);
    // Rückflussjahr gegen die Zeitreihe: erstes Jahr, in dem die Summe das Eigenkapital erreicht
    const erstes = (k, ek) => jahre[k.findIndex(v => v >= ek)];
    ctx.pruefe(erstes(kA, ekA) === jA && erstes(kC, ekC) === jC, 'Das Jahr des Rückflusses passt nicht zur Zeitreihe.');
    ctx.pruefe(kC[n] > kA[n], 'In Summe liegt C nicht vor A.');
    const jahrBis = jA === jC ? `${jA} Jahren` : `${Math.min(jA, jC)} bis ${Math.max(jA, jC)} Jahren`;
    const s = ctx.folie(ctx.titelzeilen([`Eigenkapital nach ${jahrBis}`, 'zurück, in Summe liegt C vorn'], jahrBis));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: wl(`Zahlungsüberschuss aufsummiert, Jahr ${jahre[0]} bis ${jahre[n]}`, 'Diagrammtitel'),
      sub: wl('in €, nach Kapitaldienst, ohne Zinsen', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Gruppe A', art: 'tinte', strich: 'solid' }, { text: 'Gruppe C', art: 'referenz', strich: 'solid' }] });

    const cz = ZONE.diagramm.chart, MAX = 1600000;
    ctx.pruefe(Math.max(kA[n], kC[n]) < MAX, 'Ein Wert reicht über die Größenachse.');
    const d = D.linien(s, { x: cz.x, y: cz.y, w: cz.w, h: cz.h, kategorien: jahre, katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] },
      rand: { l: 1.02, r: 1.62, u: 0.50 }, name: 'Diagramm Zahlungsüberschuss aufsummiert A und C',
      reihen: [{ name: 'Gruppe A', werte: kA, art: 'tinte', strich: 'solid' }, { name: 'Gruppe C', werte: kC, art: 'referenz', strich: 'solid' }],
      achse: { min: 0, max: MAX, schritt: 400000, format: 'ganz' } });
    B.achstexte(s, d);
    B.achsentitel(s, d, { y: wl('in €', 'Achsentitel'), x: wl('Jahr', 'Achsentitel'), xAbstand: 0.29 });
    // Eigenkapital als waagerechte Linie: A und C liegen 2.223 € auseinander (Bearbeitungsentgelte), eine Linie beim Mittel trägt beide
    const ek = (ekA + ekC) / 2;
    B.marke(s, { x: d.plot.x, y: d.yWert(ek), w: d.plot.w, art: 'referenz', strich: 'dash', text: `Eigenkapital rund ${fmt.mio(ek, 2)}`, textSeite: 'oben', textBreite: 2.6 });
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: [
      { kreis: 'C', y: d.yWert(kC[n]), wert: fmt.zahl(kC[n]) }, { kreis: 'A', y: d.yWert(kA[n]), wert: fmt.zahl(kA[n]) }] });

    const p = t => wl(t, 'Stichpunkt');
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: wl('Ergebnis', 'Überschrift'), punkte: [
        p(`Eigenkapital zurück: A Jahr ${jA}, C Jahr ${jC}`),
        p(`Summe Jahr ${jahre[0]} bis ${jahre[n]}: A ${fmt.mio(kA[n], 2)}, C ${fmt.mio(kC[n], 2)}`)] },
      { titel: wl('Lesart', 'Überschrift'), punkte: [
        p('Zahlungsüberschüsse ohne Zinsen aufsummiert'),
        p(`Eigenkapital: A ${fmt.euro(ekA)}, C ${fmt.euro(ekC)}`),
        p('darin die Bearbeitungsentgelte der NBank')] }] });
  },
};
