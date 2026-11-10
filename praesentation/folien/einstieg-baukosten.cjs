// Folie 3 · PGN_DIAGRAMM: Herstellung und Grundstück je m² Wohnfläche, Q1 2020 gegen Q4 2025, als natives gruppiertes Säulendiagramm über
// acht Spalten. Feine Zeichnung (D.gruppierteSaeulen mit fein: true): schlanke Säulen mit feiner Kontur, Q1 2020 als helle Fläche, Q4 2025 in
// Tinte, zwischen beiden eine schmale Fuge; die Werte stehen über den Säulen (Q1 2020 in Grau, Q4 2025 in Tinte). Über jedem Paar misst eine
// Maßkette von der früheren zur heutigen Säule und trägt die Veränderung, wie die Maßkette der Folie 6. Rechts die Hauptzahl der Folie (Anstieg
// der Herstellung) und darunter der Anstieg des Grundstücks. Werte aus daten/markt.json, Block baukosten (ARGE-Mediane, Altfassung Folie 23,
// nicht nachgeprüft); die Veränderungen sind im Modul gerechnet. Rot im Diagramm nur am Maßkettenwert der Herstellung: Das ist die Zahl des
// Titels. Kein Schlüsselplan: Die Folie behandelt keinen Programmteil.
'use strict';

module.exports = {
  id: 'einstieg-baukosten',
  bau(ctx) {
    const { B, D, X, fmt, colX, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'baukosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const staende = K('reihen'), gruppen = K('auf_der_folie').map(k => ({ name: K(`${k}.name`), kg: K(`${k}.kg`), alt: K(`${k}.q1_2020`), neu: K(`${k}.q4_2025`) }));
    for (const g of gruppen) { g.plus = g.neu / g.alt - 1; g.aenderung = (g.plus < 0 ? fmt.MINUS : '+') + fmt.zahl(Math.abs(g.plus) * 100, 1); }
    if (gruppen.length !== 2) P.melde(`Die Folie zeigt zwei Kostengruppen (Hauptzahl und zweite Kennzahl); baukosten.auf_der_folie nennt ${gruppen.length}.`);

    // Gegenproben: derselbe Median steht im Block kosten (Folie 22); der Titel sagt „gut die Hälfte“
    ctx.gleich('Herstellung Q4 2025 gegen den ARGE-Median der Folie 22', K('herstellung.q4_2025'), X('markt', 'kosten.arge.spanne_herstellung.median'), 0);
    if (gruppen[0].plus < 0.5 || gruppen[0].plus >= 0.6) P.melde(`Titel „gut die Hälfte“: Die Herstellung ist um ${fmt.prozent(gruppen[0].plus, 1)} gestiegen.`);
    gruppen.forEach(g => wl(`„${g.name}“ · „${g.kg}“ ${fmt.zahl(g.alt)} | ${fmt.zahl(g.neu)}`, `Säulenwerte ${g.name}`));

    // ---- Diagramm über acht Spalten ------------------------------------------------------------------------------------------
    // Q1 2020 ist der Bezugswert (helle Fläche mit Kontur), Q4 2025 die Aussage (Tinte)
    const ARTEN = ['bezug', 'tinte'];
    B.diagrammkopf(s, { titel: wl('Herstellung und Grundstück je m² Wohnfläche', 'Diagrammtitel'), sub: wl('in €, Bruttokosten · ARGE-Median deutscher Großstädte', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, fein: true, eintraege: staende.map((t, j) => ({ text: wl(t, 'Legende'), art: ARTEN[j] })) });
    // Säulen 0,56 Zoll breit; der Rand oben lässt Platz für die Maßkette über dem höchsten Paar
    const d = D.gruppierteSaeulen(s, { kategorien: gruppen.map(g => `${g.name} ${g.kg}`), katAchse: false, fein: true, saeule: 0.56, labels: false, rand: { o: 0.66 }, name: 'Diagramm Baukosten',
      achse: { min: 0, max: 5000, schritt: 1000, format: 'ganz' },
      altText: `Säulendiagramm: Kosten je m² Wohnfläche in €, ${staende.join(' und ')}, für ${gruppen.map(g => `${g.name} (${g.kg})`).join(' und ')}`,
      reihen: staende.map((name, j) => ({ name, art: ARTEN[j], werte: gruppen.map(g => (j ? g.neu : g.alt)) })) });
    B.kategorien(s, d, gruppen.map(g => ({ name: g.name, zusatz: g.kg })));

    gruppen.forEach((g, i) => {
      // Werte über den Säulen als Text auf einer Fläche in der Grundfarbe: Die Datenbeschriftung des Diagramms stünde bei 726 und 761 auf der Gitterlinie
      const x = [0, 1].map(j => d.reiheMitte(i, j)), y = [g.alt, g.neu].map(v => d.yWert(v) - 0.26), yOben = Math.min(...y);
      // Stehen beide Werte eines Paars auf einer Höhe (726 und 761), deckt eine Fläche in der Grundfarbe die Gitterlinie zwischen ihnen: Ein Stummel läse sich als Bis-Strich
      B.grundZwischenWerten(s, { x0: x[0], x1: x[1], y0: y[0], y1: y[1], name: `Grund Werte ${g.name}` });
      [g.alt, g.neu].forEach((v, j) => B.textAufPlot(s, fmt.zahl(v), { x: x[j] - 0.45, y: y[j], w: 0.90, h: 0.22, rolle: 'wert', farbe: D.ART[ARTEN[j]].wert, align: 'center', valign: 'middle',
        name: `Wert ${g.name} ${staende[j]}` }));
      // Maßkette über dem Paar: von der Mitte der früheren zur Mitte der heutigen Säule, darüber die Veränderung. Eine Maßhilfslinie läuft bis über
      // den Wert der Säule, wenn diese deutlich tiefer endet (Herstellung Q1 2020); kurze Stummel unter den Maßstrichen entfallen
      const yM = yOben - 0.14;
      y.forEach((yj, j) => { const bis = yj - 0.05; if (bis > yM + 0.20) B.linie(s, { x: x[j], y: yM, h: bis - yM, art: 'mass', pt: 0.5, name: `Maßhilfslinie ${g.name} ${staende[j]}` }); });
      B.masskette(s, { x: x[0], y: yM, w: x[1] - x[0], grund: true, segmente: [{ anteil: 1, text: wl(`${g.aenderung} %`, 'Maßkette'), akzent: i === 0 }] });
    });

    // ---- Rechte Spalte: Hauptzahl und zweite Kennzahl ---------------------------------------------------------------------------
    const kachel = g => ({ vorsatz: wl(`${g.name}, ${g.kg}`, 'Vorsatz'), zahl: wl(g.aenderung, 'Kennzahl'), einheit: '%', label: wl(`${staende[0]} bis ${staende[1]}`, 'Label') });
    B.hauptzahl(s, { ...kachel(gruppen[0]), gross: true });
    B.nebenzahl(s, kachel(gruppen[1]));
  },
};
