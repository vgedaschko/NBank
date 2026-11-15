// Folie 3.6: Schwellen, bis zu denen die Gruppen A und C in Jahr 1 einen Zahlungsüberschuss haben. Links Herstellungskosten je m²
// (Schwelle aus den drei Kostenläufen wie Folie 23 heute), rechts Tilgungssatz (Übersicht 3.8 wie Folie 20 heute). Marken bei der Annahme
// des Modellhauses; der Abstand zum Balkenende ist der Puffer. Unten der Hinweis zur Mietanpassung (Lauf ohne Mietanpassung).
'use strict';

module.exports = {
  id: 'puffer',
  o: { nr: '3.6', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · PUFFER',
    quellen: 'Quelle: Rechenmappe v3, Kostenläufe 3.579, 4.631 und 5.460 € je m², Übersicht 3.8; Konzepte D68, D81 (Lauf ohne Mietanpassung).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, span, ZONE, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was), M = k => W('modellhaus', k);
    const R = ctx.vortrag('_rechnung');
    const kA = R.kostenSchwelle(ctx, 'A').rund, kC = R.kostenSchwelle(ctx, 'C').rund;
    const kModell = M('eingabe.herstellungskosten_qm'), kArge = ctx.X('markt', 'kosten.arge.spanne_herstellung.median');
    const tA = M('liq.breakeven_tilgung.A'), tC = M('liq.breakeven_tilgung.C'), tAnn = M('eingabe.tilgung_nbank');
    const ohneFb = ctx.wert('n6.mietanpassung_gefoerdert_0.jahre_fehlbetrag_1_35.A'), ohneR = ctx.wert('n6.mietanpassung_gefoerdert_0.ek_vofi_mit_restwert.A');
    const mitR = ctx.wert('n5.ek_vofi_mit_restwert.A');
    ctx.pruefe(kModell < kC && kC < kA && tAnn < tC && tC < tA && ohneFb === 0, 'Die Reihenfolge der Schwellen oder die Aussage ohne Mietanpassung stimmt nicht mehr.');
    const s = ctx.folie(ctx.titelzeilen(['Gruppe A trägt sich bis rund', `${fmt.euro(kA)} je m², C bis ${fmt.euro(kC)}`], `${fmt.euro(kA)} je m²`));
    B.register(s, '2.1');

    const hinweis = wl(`Ohne Mietanpassung bleibt in A in jedem Jahr ein Zahlungsüberschuss. Die Eigenkapitalrendite sinkt dann von ${fmt.prozent(mitR, 2)} auf ${fmt.prozent(ohneR, 2)}.`, 'Hinweiskasten');
    const hH = B.hinweisHoehe(hinweis, { w: span(12) });
    const W6 = span(6), yC = ZONE.diagramm.chart.y - 0.26, hC = +(Y.inhaltEnde - hH - 0.16 - yC).toFixed(3);
    const modul = (x, titel, sub, werte, achse, marken, fmtWert, achsText) => {
      B.modulkopf(s, { x, y: ZONE.diagramm.kopf, w: W6, titel: wl(titel, 'Modultitel'), sub: wl(sub, 'Untertitel') });
      const d = D.balkenpaar(s, { x, y: yC, w: W6, h: hC, kategorien: ['Gruppe A', 'Gruppe C'], werte, arten: ['tinte', 'referenz'], reihenname: titel,
        achse, katBreite: 1.15, rand: { o: 0.62, r: 1.60, u: 0.50 }, name: 'Diagramm ' + titel });
      B.achsentitel(s, d, { x: wl(achsText, 'Achsentitel') });
      // Wert rechts neben dem Balken; liegt eine Marke direkt dahinter, steht der Wert rechts der Marke
      const xWertText = v => marken.reduce((x0, m) => (d.xWert(m.wert) >= d.xWert(v) && d.xWert(m.wert) < x0 + 1.3 ? d.xWert(m.wert) + 0.12 : x0), d.xWert(v) + 0.12);
      werte.forEach((v, i) => B.textAufPlot(s, fmtWert(v), { x: xWertText(v), y: d.katMitte(i) - 0.20, w: 1.45, h: 0.40, rolle: 'kernwert', valign: 'middle', name: `Wert ${titel} ${i}` }));
      marken.forEach(m => B.marke(s, { x: d.xWert(m.wert), y: d.plot.y - 0.34, h: d.plot.h + 0.34, art: m.art || 'mass', strich: m.strich, text: m.text, textSeite: m.seite, textBreite: 2.2 }));
    };
    modul(colX(1), 'Schwelle Herstellungskosten', 'in € je m² Wohnfläche, Zahlungsüberschuss in Jahr 1', [kA, kC], { min: 0, max: 6000, schritt: 2000, format: 'ganz' },
      [{ wert: kModell, text: `Modellhaus ${fmt.euro(kModell)}`, seite: 'links' }, { wert: kArge, text: `ARGE-Median ${fmt.euro(kArge)}`, seite: 'rechts', art: 'referenz', strich: 'dash' }],
      v => fmt.euro(v), 'in € je m²');
    modul(colX(7), 'Schwelle Tilgungssatz', 'in % p. a. auf das NBank-Darlehen, Zahlungsüberschuss in Jahr 1', [tA * 100, tC * 100], { min: 0, max: 4, schritt: 1, format: 'roh' },
      [{ wert: tAnn * 100, text: `Annahme ${fmt.prozent(tAnn, 2)}`, seite: 'links' }], v => fmt.prozent(v / 100, 2), 'in % p. a.');
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: span(12), name: 'Ohne Mietanpassung', text: hinweis });
  },
};
