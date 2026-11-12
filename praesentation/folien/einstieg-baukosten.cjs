// Folie 3 · PGN_INHALT (Kopf über zwölf Spalten mit B.modulkopf, auf den Höhen der Diagrammfolien): Kosten je m² Wohnfläche, Q1 2020 gegen Q4 2025, alle sieben Kostengruppen in der Reihenfolge der Altfassung
// (Folie 23), als natives gruppiertes Säulendiagramm über die ganze Inhaltsbreite. Keine Textspalte, keine Kennzahl rechts, keine Tabelle:
// Die Zahlen der Tabelle stehen an den Säulen. Feine Zeichnung (D.gruppierteSaeulen mit fein: true): Q1 2020 als helle Fläche, Q4 2025 in
// Tinte. Die Summe „Herstellung“ steht links, durch eine leere Kategorie und eine Haarlinie von den sechs Einzelgruppen abgesetzt. Über jeder
// Gruppe die Veränderung in % als eigene Zeile wie in der Altfassung; der Wert der Herstellung ist der eine rote Wert der Folie (die Zahl des
// Titels). Werte aus daten/markt.json, Block baukosten; die Veränderungen sind im Modul gerechnet. Gemeinsame Teile: folien/_kostengruppen.cjs.
'use strict';
const KG = require('./_kostengruppen.cjs');

module.exports = {
  id: 'einstieg-baukosten',
  bau(ctx) {
    const { B, D, X, fmt, colX, span, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'baukosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const staende = K('reihen'), gruppen = K('auf_der_folie').map(k => ({ k, name: K(`${k}.name`), kurz: K(`${k}.kurz`), kg: K(`${k}.kg`), alt: K(`${k}.q1_2020`), neu: K(`${k}.q4_2025`) }));
    for (const g of gruppen) { g.plus = g.neu / g.alt - 1; g.aenderung = (g.plus < 0 ? fmt.MINUS : '+') + fmt.zahl(Math.abs(g.plus) * 100, 1) + ' %'; }
    if (gruppen.length !== 7 || gruppen[0].k !== 'herstellung') P.melde(`Die Folie zeigt die Herstellung und sechs Kostengruppen; baukosten.auf_der_folie nennt ${gruppen.length}.`);

    // Gegenproben: derselbe Median steht im Block kosten (Folie 22); der Titel sagt „gut die Hälfte“; die sechs Kostengruppen ohne Grundstück
    // ergeben die Herstellung (Q4 2025 genau, Q1 2020 bis auf 0,01 €)
    ctx.gleich('Herstellung Q4 2025 gegen den ARGE-Median der Folie 22', K('herstellung.q4_2025'), X('markt', 'kosten.arge.spanne_herstellung.median'), 0);
    if (gruppen[0].plus < 0.5 || gruppen[0].plus >= 0.6) P.melde(`Titel „gut die Hälfte“: Die Herstellung ist um ${fmt.prozent(gruppen[0].plus, 1)} gestiegen.`);
    const teile = gruppen.filter(g => !['herstellung', 'grundstueck'].includes(g.k));
    for (const q of ['alt', 'neu']) ctx.gleich(`Summe KG 200 bis 700 gegen Herstellung (${q === 'alt' ? staende[0] : staende[1]})`, teile.reduce((a, g) => a + g[q], 0), gruppen[0][q], 1);
    gruppen.forEach(g => wl(`„${g.kurz}“ · „${g.kg}“ ${fmt.zahl(g.alt)} | ${fmt.zahl(g.neu)} · ${g.aenderung}`, `Säulenwerte ${g.name}`));

    // ---- Kopf und Legende auf den Höhen der übrigen Diagrammfolien -------------------------------------------------------------------
    const ARTEN = ['bezug', 'tinte'];
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: span(12), titel: wl('Herstellungs- und Grundstückskosten je m² Wohnfläche', 'Diagrammtitel'), sub: wl('in €, Bruttokosten · ARGE-Median deutscher Großstädte', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, fein: true, eintraege: staende.map((t, j) => ({ text: wl(t, 'Legende'), art: ARTEN[j] })) });

    // ---- Diagramm über zwölf Spalten ---------------------------------------------------------------------------------------------------
    // Acht Kategorien: Herstellung, eine leere Kategorie als Abstand, dann die sechs Kostengruppen. Säulen 0,40 Zoll breit
    const kat = [gruppen[0], null, ...gruppen.slice(1)], idx = g => kat.indexOf(g);
    const d = D.gruppierteSaeulen(s, { x: colX(1), y: KG.LAGE.chartY, w: span(12), h: KG.LAGE.chartH, kategorien: kat.map(g => (g ? `${g.name} ${g.kg}` : ' ')), katAchse: false, fein: true, saeule: 0.40, labels: false,
      rand: { l: 0.80, r: 0.02, o: KG.LAGE.randO, u: KG.LAGE.randU }, name: 'Diagramm Baukosten', achse: { min: 0, max: 5000, schritt: 1000, format: 'ganz' },
      altText: `Säulendiagramm: Kosten je m² Wohnfläche in €, ${staende.join(' und ')}, ARGE-Median deutscher Großstädte. ` + gruppen.map(g => `${g.name} (${g.kg}): ${fmt.zahl(g.alt)} und ${fmt.zahl(g.neu)} €, ${g.aenderung}`).join('; ') + '.',
      reihen: staende.map((name, j) => ({ name, art: ARTEN[j], werte: kat.map(g => (g ? (j ? g.neu : g.alt) : 0)) })) });
    B.achsentitel(s, d, { y: wl('€ je m² Wohnfläche', 'Achsentitel') });

    // Prozentzeile über den Gruppen: Q4 2025 gegenüber Q1 2020; die Herstellung in Rot und größer (die Zahl des Titels)
    KG.prozentzeile(ctx, s, { label: wl('Veränderung', 'Prozentzeile'), labelX: colX(1), labelW: 0.90,
      eintraege: gruppen.map((g, i) => ({ x: d.katMitte(idx(g)), text: g.aenderung, akzent: i === 0, name: g.name })) });
    KG.trenner(ctx, s, { x: d.katMitte(1), y0: KG.LAGE.zeile, y1: d.plot.y + d.plot.h + 0.46 });

    // Werte über den Säulen im Ton ihrer Säule, auf einer Fläche in der Grundfarbe (keine Gitterlinie läuft durch die Zahl)
    gruppen.forEach(g => {
      const i = idx(g), x = [0, 1].map(j => d.reiheMitte(i, j)), y = [g.alt, g.neu].map(v => d.yWert(v) - 0.26);
      B.grundZwischenWerten(s, { x0: x[0], x1: x[1], y0: y[0], y1: y[1], name: `Grund Werte ${g.name}` });
      [g.alt, g.neu].forEach((v, j) => B.textAufPlot(s, fmt.zahl(v), { x: x[j] - 0.30, y: y[j], w: 0.60, h: 0.22, rolle: 'wert', farbe: D.ART[ARTEN[j]].wert, align: 'center', valign: 'middle',
        name: `Wert ${g.name} ${staende[j]}` }));
    });
    KG.kategorien(ctx, s, { y: d.plot.y + d.plot.h + 0.05, eintraege: gruppen.map(g => ({ x: d.katMitte(idx(g)), w: d.katBreite + 0.10, name: g.kurz, kg: g.kg })) });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, baukosten.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'baukosten.quelle_kurz'), 'Quellenzeile'));
  },
};
