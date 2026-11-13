// Folie 3 · PGN_INHALT (Kopf über zwölf Spalten mit B.modulkopf, auf den Höhen der Diagrammfolien): Kosten je m² Wohnfläche, Q1 2020 gegen
// Q4 2025, alle sieben Kostengruppen in der Reihenfolge der Vorlage des Auftraggebers (Altfassung Folie 23), ohne Tabelle.
// Das Diagramm ist dasselbe wie auf Folie 22 (folien/_kostengruppen.cjs, spannen): je Gruppe zwei Säulen mit Sockel bis zum kleinsten Wert,
// Spanne bis zum größten Wert und Median, Q1 2020 als helle Fläche mit Kontur, Q4 2025 in Tinte. Über jeder Gruppe die Veränderung des Medians
// in %; der Wert der Herstellung ist der eine rote Wert der Folie (die Zahl des Titels).
// Werte aus daten/markt.json: Mediane im Block baukosten (q1_2020, q4_2025), Spannen Q1 2020 in baukosten.*.spanne_q1_2020 (ARGE, Abb. 22),
// Spannen Q4 2025 im Block kosten.spannen.arge (ARGE, Abb. 20). Die Veränderungen sind im Modul gerechnet.
'use strict';
const KG = require('./_kostengruppen.cjs');

module.exports = {
  id: 'einstieg-baukosten',
  bau(ctx) {
    const { B, X, fmt, colX, span, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'baukosten.' + p), wl = (t, was) => ctx.wortlaut(t, was), z = v => fmt.zahl(v);
    const staende = K('reihen');
    const gruppen = K('auf_der_folie').map(k => {
      const g = { k, name: K(`${k}.name`), kurz: K(`${k}.kurz`), kg: K(`${k}.kg`), alt: K(`${k}.q1_2020`), neu: K(`${k}.q4_2025`) };
      g.werte = { [staende[0]]: { min: K(`${k}.spanne_q1_2020.min`), median: g.alt, max: K(`${k}.spanne_q1_2020.max`) },
        [staende[1]]: { min: X('markt', `kosten.spannen.arge.${k}.min`), median: g.neu, max: X('markt', `kosten.spannen.arge.${k}.max`) } };
      g.plus = g.neu / g.alt - 1;
      g.text = g.aenderung = (g.plus < 0 ? fmt.MINUS : '+') + fmt.zahl(Math.abs(g.plus) * 100, 1) + ' %';
      return g;
    });
    gruppen[0].akzent = true;
    if (gruppen.length !== 7 || gruppen[0].k !== 'herstellung') P.melde(`Die Folie zeigt die Herstellung und sechs Kostengruppen; baukosten.auf_der_folie nennt ${gruppen.length}.`);

    // Gegenproben: derselbe Median steht im Block kosten (Folie 22); der Titel sagt „gut die Hälfte“; die sechs Kostengruppen ohne Grundstück
    // ergeben die Herstellung (Q4 2025 genau, Q1 2020 bis auf 0,01 €)
    for (const g of gruppen) ctx.gleich(`Median ${g.name} Q4 2025 gegen kosten.spannen.arge`, g.neu, X('markt', `kosten.spannen.arge.${g.k}.median`), 2);
    if (gruppen[0].plus < 0.5 || gruppen[0].plus >= 0.6) P.melde(`Titel „gut die Hälfte“: Die Herstellung ist um ${fmt.prozent(gruppen[0].plus, 1)} gestiegen.`);
    const teile = gruppen.filter(g => !['herstellung', 'grundstueck'].includes(g.k));
    for (const q of ['alt', 'neu']) ctx.gleich(`Summe KG 200 bis 700 gegen Herstellung (${q === 'alt' ? staende[0] : staende[1]})`, teile.reduce((a, g) => a + g[q], 0), gruppen[0][q], 1);
    gruppen.forEach(g => wl(`„${g.kurz}“ · „${g.kg}“ ${z(g.alt)} | ${z(g.neu)} · ${g.aenderung}`, `Medianwerte ${g.name}`));

    // ---- Kopf, Legende, Diagramm ---------------------------------------------------------------------------------------------------------
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: span(12), titel: wl('Herstellungs- und Grundstückskosten je m² Wohnfläche', 'Diagrammtitel'),
      sub: wl('in €, Bruttokosten, deutsche Großstädte · Minimum, Median und Maximum je Kostengruppe', 'Untertitel') });
    KG.legende(ctx, s, { eintraege: [{ text: wl(staende[0], 'Legende'), art: 'bezug' }, { text: wl(staende[1], 'Legende'), art: 'tinte' }],
      spanne: wl('Säule: Minimum bis Maximum · Strich und Wert: Median', 'Legende') });
    KG.spannen(ctx, s, { name: 'Diagramm Herstellungskosten', achse: { min: 0, max: 10000, schritt: 2000, format: 'ganz' }, achsentitel: wl('€ je m² Wohnfläche', 'Achsentitel'), label: wl('Veränderung', 'Prozentzeile'),
      reihen: [{ key: staende[0], name: staende[0], art: 'bezug' }, { key: staende[1], name: staende[1], art: 'tinte' }], gruppen,
      altText: `Säulen mit Spanne: Kosten je m² Wohnfläche in €, kleinster bis größter Wert mit Median, ${staende.join(' und ')}, deutsche Großstädte. ` +
        gruppen.map(g => `${g.name} (${g.kg}): Median ${z(g.alt)} und ${z(g.neu)} €, ${g.aenderung}`).join('; ') + '.' });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, baukosten.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'baukosten.quelle_kurz'), 'Quellenzeile'));
  },
};
