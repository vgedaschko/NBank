// Folie 22 · PGN_INHALT_MR: Spielraum, bis zu dem die Gruppen A und C in Jahr 1 einen Zahlungsüberschuss haben. Links Herstellungskosten je m²
// (Schwelle aus den drei Kostenläufen, folien/_rechnung.cjs, kostenSchwelle), rechts Tilgungssatz (Übersicht 3.8). Der Balken in Tinte reicht bis
// zur Annahme des Modellhauses, der helle Teil bis zur Schwelle ist der Spielraum; beim ARGE-Median eine gestrichelte Marke. Unten der Hinweis
// zur Mietanpassung (Lauf ohne Mietanpassung, daten/kennzahlen.json, n6.mietanpassung_gefoerdert_0).
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-spielraum',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, ZONE, Y } = ctx, wl = (t, was) => ctx.wortlaut(t, was), M = k => W('modellhaus', k);
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
    // Je Modul gestapelte Balken für A und C: bis zur Annahme des Modellhauses in Tinte, darüber der Spielraum bis zur Schwelle hell.
    // Am Balkenende die Schwelle; der helle Teil trägt keine Zahl (die Schwelle steht am Ende, und die Marke des ARGE-Medians liefe durch die Zahl).
    // Beim ARGE-Median eine gestrichelte Marke.
    const modul = (x, titel, sub, annahme, schwellen, achse, fmtWert, achsText, labelFormat, marke) => {
      B.modulkopf(s, { x, y: ZONE.diagramm.kopf, w: W6, titel: wl(titel, 'Modultitel'), sub: wl(sub, 'Untertitel') });
      B.legende(s, { x, y: ZONE.diagramm.legende, eintraege: [{ text: 'Modellhaus', art: 'tinte' }, { text: 'Spielraum bis zur Schwelle', art: 'bisher' }] });
      const d = D.stapelBalken(s, { x, y: yC, w: W6, h: hC, kategorien: ['Gruppe A', 'Gruppe C'], katAchse: true, katBreite: 1.15, labelFormat,
        reihen: [{ name: 'Modellhaus', art: 'tinte', werte: [annahme, annahme] }, { name: 'Spielraum', art: 'bisher', werte: schwellen.map(v => v - annahme), ohneWerte: true }],
        achse, rand: { o: 0.65, r: 1.60, u: 0.50 }, name: 'Diagramm ' + titel });
      B.achsentitel(s, d, { x: wl(achsText, 'Achsentitel') });
      schwellen.forEach((v, i) => B.textAufPlot(s, fmtWert(v), { x: (marke && d.xWert(marke.wert) > d.xWert(v) && d.xWert(marke.wert) < d.xWert(v) + 1.3 ? d.xWert(marke.wert) : d.xWert(v)) + 0.12,
        y: d.katMitte(i) - 0.20, w: 1.45, h: 0.40, rolle: 'kernwert', valign: 'middle', name: `Wert ${titel} ${i}` }));
      if (marke) B.marke(s, { x: d.xWert(marke.wert), y: d.plot.y - 0.30, h: d.plot.h + 0.30, art: 'referenz', strich: 'dash', text: marke.text, textSeite: 'rechts', textBreite: 2.2 });
    };
    modul(colX(1), 'Spielraum bei den Herstellungskosten', 'in € je m² Wohnfläche, Zahlungsüberschuss in Jahr 1', kModell, [kA, kC], { min: 0, max: 6000, schritt: 2000, format: 'ganz' },
      v => fmt.euro(v), 'in € je m²', 'ganz', { wert: kArge, text: `ARGE-Median ${fmt.euro(kArge)}` });
    modul(colX(7), 'Spielraum beim Tilgungssatz', 'in % p. a. auf das NBank-Darlehen, Zahlungsüberschuss in Jahr 1', tAnn * 100, [tA * 100, tC * 100], { min: 0, max: 4, schritt: 1, format: 'roh' },
      v => fmt.prozent(v / 100, 2), 'in % p. a.', 'zwei', null);
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: span(12), name: 'Ohne Mietanpassung', text: hinweis });
  },
};
