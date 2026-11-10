// Folie 2 · PGN_DIAGRAMM: Herstellung und Grundstück je m² Wohnfläche, Q1 2020 gegen Q4 2025, als natives gruppiertes Säulendiagramm über
// acht Spalten (Q1 2020 in Grau, Q4 2025 in Tinte, Werte als Text über den Säulen). Rechts die Hauptzahl der Folie (Anstieg der Herstellung) und
// darunter der Anstieg des Grundstücks. Werte aus daten/markt.json, Block baukosten (ARGE-Mediane, Altfassung Folie 23, nicht nachgeprüft);
// die Veränderungen sind im Modul gerechnet. Kein Rot im Diagramm, kein Schlüsselplan: Die Folie behandelt keinen Programmteil.
'use strict';

module.exports = {
  id: 'einstieg-baukosten',
  bau(ctx) {
    const { B, D, X, fmt, colX, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'baukosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const staende = K('reihen'), gruppen = K('auf_der_folie').map(k => ({ name: K(`${k}.name`), kg: K(`${k}.kg`), alt: K(`${k}.q1_2020`), neu: K(`${k}.q4_2025`) }));
    for (const g of gruppen) g.plus = g.neu / g.alt - 1;
    if (gruppen.length !== 2) P.melde(`Die Folie zeigt zwei Kostengruppen (Hauptzahl und zweite Kennzahl); baukosten.auf_der_folie nennt ${gruppen.length}.`);

    // Gegenproben: derselbe Median steht im Block kosten (Folie 20); der Titel sagt „gut die Hälfte“
    ctx.gleich('Herstellung Q4 2025 gegen den ARGE-Median der Folie 20', K('herstellung.q4_2025'), X('markt', 'kosten.arge.spanne_herstellung.median'), 0);
    if (gruppen[0].plus < 0.5 || gruppen[0].plus >= 0.6) P.melde(`Titel „gut die Hälfte“: Die Herstellung ist um ${fmt.prozent(gruppen[0].plus, 1)} gestiegen.`);
    gruppen.forEach(g => wl(`„${g.name}“ · „${g.kg}“ ${fmt.zahl(g.alt)} | ${fmt.zahl(g.neu)}`, `Säulenwerte ${g.name}`));

    // ---- Diagramm über acht Spalten ------------------------------------------------------------------------------------------
    B.diagrammkopf(s, { titel: wl('Herstellung und Grundstück je m² Wohnfläche', 'Diagrammtitel'), sub: wl('in €, Bruttokosten · ARGE-Median deutscher Großstädte', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: wl(staende[0], 'Legende'), art: 'bisher' }, { text: wl(staende[1], 'Legende'), art: 'tinte' }] });
    // Lücke 185 %: Eine Säule ist 0,92 Zoll breit, so breit wie die Säulen der Folie 4
    const d = D.gruppierteSaeulen(s, { kategorien: gruppen.map(g => `${g.name} ${g.kg}`), katAchse: false, luecke: 185, labels: false, name: 'Diagramm Baukosten',
      achse: { min: 0, max: 5000, schritt: 1000, format: 'ganz' },
      altText: `Säulendiagramm: Kosten je m² Wohnfläche in €, ${staende.join(' und ')}, für ${gruppen.map(g => `${g.name} (${g.kg})`).join(' und ')}`,
      reihen: [{ name: staende[0], art: 'bisher', werte: gruppen.map(g => g.alt) }, { name: staende[1], art: 'tinte', werte: gruppen.map(g => g.neu) }] });
    B.kategorien(s, d, gruppen.map(g => ({ name: g.name, zusatz: g.kg })));
    // Werte über den Säulen als Text auf einer Fläche in der Grundfarbe: Die Datenbeschriftung des Diagramms stünde bei 726 und 761 auf der Gitterlinie
    gruppen.forEach((g, i) => [g.alt, g.neu].forEach((v, j) => B.textAufPlot(s, fmt.zahl(v), { x: d.reiheMitte(i, j) - 0.45, y: d.yWert(v) - 0.26, w: 0.90, h: 0.22, rolle: 'wert', align: 'center', valign: 'middle',
      name: `Wert ${g.name} ${staende[j]}` })));

    // ---- Rechte Spalte: Hauptzahl und zweite Kennzahl ---------------------------------------------------------------------------
    const kachel = g => ({ vorsatz: wl(`${g.name}, ${g.kg}`, 'Vorsatz'), zahl: wl('+' + fmt.zahl(g.plus * 100, 1), 'Kennzahl'), einheit: '%', label: wl(`${staende[0]} bis ${staende[1]}`, 'Label') });
    B.hauptzahl(s, { ...kachel(gruppen[0]), gross: true });
    B.nebenzahl(s, kachel(gruppen[1]));
  },
};
