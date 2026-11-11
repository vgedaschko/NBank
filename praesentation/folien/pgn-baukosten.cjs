// Folie 22 · PGN_DIAGRAMM: Herstellungskosten je m² Wohnfläche, Median, PGN gegen ARGE, als natives gruppiertes Säulendiagramm über acht
// Spalten (vier Kostengruppen). Feine Zeichnung wie auf Folie 3 (D.gruppierteSaeulen mit fein: true): schlanke Säulen mit feiner Kontur, PGN in
// Tinte, ARGE als helle Fläche, zwischen beiden eine schmale Fuge; die Werte stehen über den Säulen (PGN in Tinte, ARGE in Grau). Neben den
// Säulen der Herstellung steht die Spanne als Maßzeichen (kleinster bis größter Wert, folien/_fein_pgn-baukosten.cjs); die Spanne der ARGE
// reicht über die Größenachse hinaus, ihre Maßlinie endet in einer Pfeilspitze mit dem Wert. Rechts die Hauptzahl der Folie (Abstand der Mediane)
// in 60 pt wie auf den Folien 3 bis 6, darunter Grundlage und Spanne. Die Marke „Ansatz im Modellhaus“ über dem Säulenpaar der Herstellung ist
// am 11.11.2026 entfallen: Das Modellhaus rechnet seither mit dem PGN-Median selbst (Gegenprobe unten).
// Werte aus daten/markt.json, Block kosten (Altfassung Folie 12, nicht nachgeprüft); der Abstand ist im Modul gerechnet.
// Weißer Grund, kein Papierton: Die Folie zeigt Kostenkennwerte und kein Modellhaus. Kein Rot im Diagramm.
'use strict';
const S = require('./_struktur.cjs');
const FEIN = require('./_fein_pgn-baukosten.cjs');

module.exports = {
  id: 'pgn-baukosten',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'kosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const U = S.liesKosten(ctx), T = k => wl(U(k), k);
    // PGN ist die Aussage (Tinte), ARGE der Bezugswert (helle Fläche mit Kontur)
    const gruppen = K('gruppen'), wer = ['pgn', 'arge'].map((k, i) => ({ k, name: wl(K(`${k}.name`), 'Legende'), art: i ? 'bezug' : 'tinte',
      median: K(`${k}.median`), spanne: Object.fromEntries(['min', 'median', 'max'].map(m => [m, K(`${k}.spanne_herstellung.${m}`)])) }));
    const [pgn, arge] = wer, unter = 1 - pgn.spanne.median / arge.spanne.median;

    // ---- Gegenproben ------------------------------------------------------------------------------------------------------------------
    // Median der Herstellung steht in Reihe und Spanne gleich; der PGN-Median ist der Ansatz des Modellhauses, der ARGE-Median der Eingabewert des
    // zweiten Laufs der Folie 23 (beide gerundet auf ganze Euro, wie die Rechenmappe sie führt); die ARGE-Mediane stehen mit
    // denselben Werten im Block baukosten (Folie 3 und ihre Notizen); jede Spanne ist geordnet (kleinster Wert, Median, größter Wert)
    for (const r of wer) {
      if (r.median[0] !== r.spanne.median) P.melde(`${r.name}: Der Median der Herstellung steht in Reihe (${r.median[0]}) und Spanne (${r.spanne.median}) verschieden.`);
      if (!(r.spanne.min <= r.spanne.median && r.spanne.median <= r.spanne.max)) P.melde(`${r.name}: Die Spanne der Herstellung ist nicht geordnet (${r.spanne.min}, ${r.spanne.median}, ${r.spanne.max}).`);
    }
    ctx.gleich('PGN-Median gegen den Ansatz des Modellhauses (Lauf modellhaus, Eingabe 2.1)', pgn.spanne.median, W('modellhaus', 'eingabe.herstellungskosten_qm'), 0);
    ctx.gleich('ARGE-Median gegen den Eingabewert des Laufs modellhaus_kosten_4631', arge.spanne.median, W('modellhaus_kosten_4631', 'eingabe.herstellungskosten_qm'), 0);
    if (!ctx.glatt(ctx.o.notizen).includes('Das Modellhaus rechnet mit diesem Wert.')) P.melde('Notizen der Folie 22: Der Satz „Das Modellhaus rechnet mit diesem Wert.“ fehlt.');
    const baukosten = Object.values(ctx.daten.markt.baukosten || {}).filter(g => g && g.kg && g.q4_2025);
    gruppen.forEach((g, i) => {
      const b = baukosten.find(x => x.kg === g.kg);
      if (!b) P.melde(`Kostengruppe ${g.kg} fehlt im Block baukosten (daten/markt.json).`); else ctx.gleich(`ARGE-Median ${g.name} gegen baukosten (Q4 2025)`, arge.median[i], b.q4_2025.wert, 2);
      wl(`„${g.name} ${g.kg}“ ${wer.map(r => fmt.zahl(r.median[i])).join(' | ')}`, `Säulenwerte ${g.name}`);
    });
    if (unter <= 0) P.melde('Der PGN-Median liegt nicht unter dem ARGE-Median; Titel und Kennzahl stimmen dann nicht.');
    const abstand = fmt.zahl(unter * 100, 1);
    if (!ctx.o.titel.includes(`${abstand} % unter`)) P.melde(`Titel der Folie nennt den Abstand nicht mit ${abstand} %.`);

    // ---- Diagramm über acht Spalten: schlanke Säulen, Werte als Text darüber --------------------------------------------------------------
    B.diagrammkopf(s, { titel: T('diagrammtitel'), sub: T('untertitel') });
    // Legende: zwei Felder in der Kontur der Säulen, dahinter das Maßzeichen der Spanne
    const chart = ZONE.diagramm.chart, yL = ZONE.diagramm.legende;
    const felder = B.legende(s, { x: colX(1), y: yL, fein: true, eintraege: wer.map(r => ({ text: r.name, art: r.art })) });
    const legende = FEIN.legendeSpanne(ctx, s, { x: felder.rechts + 0.20, y: yL, text: T('legende_spanne') });
    if (legende.rechts > chart.x + chart.w + 0.005) P.melde(`Legende endet bei x ${legende.rechts.toFixed(2)} und läuft über das Diagramm (bis ${(chart.x + chart.w).toFixed(2)}).`);
    // Säulen 0,48 Zoll breit. Der Rand oben lässt Platz für die Pfeilspitze der ARGE-Spanne und ihren Wert
    const ACHSE = { min: 0, max: 5000, schritt: 1000, format: 'ganz' }, sp = r => `${r.name} ${fmt.zahl(r.spanne.min)} bis ${fmt.euro(r.spanne.max)}`;
    const d = D.gruppierteSaeulen(s, { kategorien: gruppen.map(g => `${g.name} ${g.kg}`), katAchse: false, fein: true, saeule: 0.48, labels: false, rand: { o: 0.34 }, name: 'Diagramm Herstellungskosten', achse: ACHSE,
      altText: `Säulendiagramm: Herstellungskosten je m² Wohnfläche in €, Median, ${wer.map(r => r.name).join(' und ')} für ${gruppen.map(g => `${g.name} (${g.kg})`).join(', ')}. ` +
        `Spanne der Herstellung vom kleinsten zum größten Wert: ${wer.map(sp).join(', ')}.`,
      reihen: wer.map(r => ({ name: r.name, art: r.art, werte: r.median })) });
    B.kategorien(s, d, gruppen.map(g => ({ name: g.name, zusatz: g.kg })));
    // Werte über den Säulen im Ton ihrer Säule, als Text auf einer Fläche in der Grundfarbe (keine Gitterlinie läuft durch die Zahl)
    wer.forEach((r, j) => r.median.forEach((v, i) => B.textAufPlot(s, fmt.zahl(v), { x: d.reiheMitte(i, j) - 0.45, y: d.yWert(v) - 0.26, w: 0.90, h: 0.22, rolle: 'wert', farbe: D.ART[r.art].wert,
      align: 'center', valign: 'middle', name: `Wert ${gruppen[i].name} ${r.name}` })));

    // ---- Spanne der Herstellung: Maßzeichen neben den beiden Säulen (PGN links, ARGE rechts des Paars) ---------------------------------------
    // Die ARGE-Spanne reicht über die Größenachse hinaus: Ihre Maßlinie endet über der Plotfläche in einer Pfeilspitze, daneben steht „Maximum“ mit dem Wert
    // (nicht „bis“: Direkt neben dem Wert der ARGE-Säule läse sich das als „4.631 bis 8.592“)
    const breite = d.saeulenBreite, ABSTAND = 0.13, xSpanne = [d.reiheLinks(0, 0) - ABSTAND, d.reiheLinks(0, 1) + breite + ABSTAND];
    if (arge.spanne.max <= ACHSE.max) P.melde('Die ARGE-Spanne endet in der Plotfläche; der Text „Maximum …“ an der Pfeilspitze entfiele. Konzept und Modul nachführen.');
    wer.forEach((r, j) => FEIN.spanne(ctx, s, { x: xSpanne[j], yMin: d.yWert(r.spanne.min), yMax: d.yWert(r.spanne.max), yGrenze: d.plot.y, name: `Spanne ${r.name}`,
      bis: j ? T('spanne_bis').replace(/ (\S+)$/, ' **$1**') : undefined, bisBreite: 1.3 }));

    // ---- Rechte Spalte: Hauptzahl, darunter Grundlage und Spanne ---------------------------------------------------------------------------
    // 60 pt: „−22,7 %“ hat sieben Zeichen. Für einen Text unter dem Label ist in 60 pt kein Platz; das Label nennt deshalb das Wertepaar der Mediane.
    const h = B.hauptzahl(s, { gross: true, vorsatz: T('kennzahl_vorsatz'), zahl: wl(fmt.MINUS + abstand, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });
    // Die Spanne bricht hinter dem Komma: je Zeile ein Absender
    B.zweitesModul(s, { name: 'Grundlage und Spanne', eintraege: [{ titel: T('grundlage_titel'), text: T('grundlage') },
      { titel: T('spanne_titel'), text: B.zweizeilig(T('spanne'), { w: h.w, rolle: 'dicht', nach: /[,;]$/ }) }] });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, kosten.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'kosten.quelle_kurz'), 'Quellenzeile'));
  },
};
