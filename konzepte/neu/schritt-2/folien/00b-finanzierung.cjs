// Folie 3.2 (neu, ersetzt die heutige Folie 14): Mittelherkunft der Gesamtkosten, gefördert (Gruppe A) neben frei finanziert, als gestapelte
// Balken in Mio. €: Zuschuss (Rot, Zuschuss in Daten), NBank-Darlehen, Bankdarlehen, Eigenkapital (Schraffur). Darüber eine Maßkette 80 %
// Fremdkapital, 20 % Eigenkapital (gilt für beide). Rechts wie in Kapitel 1 Hauptzahl (Zuschuss je Wohnung) und Nebenzahl (Eigenkapital je Wohnung).
'use strict';

module.exports = {
  id: 'finanzierung',
  o: { nr: '3.2', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · FINANZIERUNG',
    quellen: 'Quelle: Rechenmappe v3, Konzepte D52 bis D57, G52 bis G56.' },
  bau(ctx) {
    const { B, D, fmt, ZONE, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const gk = ctx.wert('n5.gesamtkosten.A'), zu = ctx.wert('n5.zuschuss.A'), dl = ctx.wert('n5.darlehen_nbank.A'), bank = ctx.wert('n5.bankdarlehen.frei_markt');
    const ekA = ctx.wert('n5.eigenkapital.A'), ent = ctx.wert('n5.bearbeitungsentgelte.A'), ekF = ctx.wert('n5.eigenkapital.frei_markt'), we = ctx.wert('annahme.wohnungen');
    const ekKostenA = ekA - ent;   // Eigenkapital in den Gesamtkosten; die Bearbeitungsentgelte trägt das Eigenkapital zusätzlich
    ctx.gleich('Gesamtkosten gleich', gk, ctx.wert('n5.gesamtkosten.frei_markt'), 0);
    ctx.gleich('Mittelherkunft A geht auf', zu + dl + ekKostenA, gk, 0);
    ctx.gleich('Mittelherkunft frei geht auf', bank + ekF, gk, 0);
    ctx.gleich('Eigenkapital gleich', ekKostenA, ekF, 0);
    const qZu = zu / gk, qEk = ekF / gk;
    ctx.pruefe(Math.abs(qEk - 0.2) < 1e-9 && Math.abs(qZu - 0.4) < 1e-9, 'Die Quoten 20 % Eigenkapital und 40 % Zuschuss stimmen nicht mehr.');
    const s = ctx.folie(ctx.titelzeilen(['Gleiches Eigenkapital, gefördert', `sind ${fmt.prozent(qZu, 0)} der Kosten Zuschuss`], fmt.prozent(qZu, 0)));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: wl(`Mittelherkunft, Gesamtkosten ${fmt.mio(gk, 2)}`, 'Diagrammtitel'), sub: wl(`in Mio. € · ${we} Wohnungen, ${fmt.zahl(ctx.wert('annahme.wohnflaeche'))} m² Wohnfläche`, 'Untertitel') });
    B.legende(s, { x: ZONE.diagramm.chart.x, y: ZONE.diagramm.legende, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'NBank-Darlehen', art: 'darlehen' },
      { text: 'Bankdarlehen', art: 'referenz' }, { text: 'Eigenkapital', art: 'eigenmittel' }] });
    const hinweis = wl(`Gefördert kommen ${fmt.euro(ent)} Bearbeitungsentgelte der NBank dazu. Sie trägt das Eigenkapital.`, 'Hinweiskasten');
    const cz = ZONE.diagramm.chart, hH = B.hinweisHoehe(hinweis, { w: cz.w });
    const M = v => v / 1e6;
    const d = D.stapelBalken(s, { x: cz.x, y: cz.y, w: cz.w, h: +(Y.inhaltEnde - cz.y - hH - 0.12).toFixed(3), kategorien: ['Gruppe A', 'Frei finanziert'], katAchse: true, katBreite: 1.55,
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: [M(zu), 0] }, { name: 'NBank-Darlehen', art: 'darlehen', werte: [M(dl), 0] },
        { name: 'Bankdarlehen', art: 'referenz', werte: [0, M(bank)] }, { name: 'Eigenkapital', art: 'eigenmittel', werte: [M(ekKostenA), M(ekF)] }],
      achse: { min: 0, max: 3, schritt: 0.5, format: 'eins' }, labelFormat: 'zwei', rand: { o: 0.62, r: 0.30, u: 0.50 }, name: 'Diagramm Mittelherkunft' });
    B.achsentitel(s, d, { x: wl('in Mio. €', 'Achsentitel') });
    B.masskette(s, { x: d.plot.x, y: d.plot.y - 0.12, w: d.xWert(M(gk)) - d.plot.x, segmente: [
      { anteil: 1 - qEk, text: `Fremdkapital ${fmt.prozent(1 - qEk, 0)}` }, { anteil: qEk, text: fmt.prozent(qEk, 0) }] });   // 20 %: Eigenkapital laut Legende
    B.hinweis(s, { x: cz.x, y: Y.inhaltEnde, unten: true, w: cz.w, name: 'Bearbeitungsentgelte', text: hinweis });

    B.hauptzahl(s, { vorsatz: 'Gefördert, je Wohnung', zahl: fmt.zahl(zu / we), einheit: '€', label: wl('Zuschuss, nicht rückzahlbar', 'Hauptzahl'), gross: true });
    B.nebenzahl(s, { vorsatz: 'Beide, je Wohnung', zahl: fmt.zahl(ekF / we), einheit: '€', label: wl('Eigenkapital', 'Nebenzahl'),
      text: wl(`${fmt.prozent(qEk, 0)} der Kosten. Gefördert ist das die Mindestquote der Richtlinie.`, 'Nebenzahl') });
  },
};
