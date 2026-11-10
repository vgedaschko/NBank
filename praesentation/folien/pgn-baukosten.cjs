// Folie 22 · PGN_DIAGRAMM: Herstellungskosten je m² Wohnfläche, Median, PGN gegen ARGE, als natives gruppiertes Säulendiagramm über acht
// Spalten (vier Kostengruppen; PGN in Tinte, ARGE in Referenzgrau, Werte über den Säulen). Über dem Säulenpaar der Herstellung die Marke mit
// dem Ansatz des Modellhauses. Rechts die Hauptzahl der Folie (Abstand der Mediane) in 60 pt wie auf den Folien 3 bis 6, darunter Grundlage und Spanne.
// Werte aus daten/markt.json, Block kosten (Altfassung Folie 12, nicht nachgeprüft); der Abstand ist im Modul gerechnet. Ansatz des Modellhauses
// aus daten/werte.json. Weißer Grund und kein Stempel: Die Folie zeigt Kostenkennwerte und kein Modellhaus. Kein Rot im Diagramm.
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'pgn-baukosten',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'kosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const U = S.liesKosten(ctx), T = k => wl(U(k), k);
    const gruppen = K('gruppen'), wer = ['pgn', 'arge'].map((k, i) => ({ k, name: wl(K(`${k}.name`), 'Legende'), art: i ? 'referenz' : 'tinte',
      median: K(`${k}.median`), spanne: Object.fromEntries(['min', 'median', 'max'].map(m => [m, K(`${k}.spanne_herstellung.${m}`)])) }));
    const [pgn, arge] = wer, ansatz = W('modellhaus', 'eingabe.herstellungskosten_qm'), unter = 1 - pgn.spanne.median / arge.spanne.median;

    // ---- Gegenproben ------------------------------------------------------------------------------------------------------------------
    // Median der Herstellung steht in Reihe und Spanne gleich; der PGN-Median ist der Eingabewert der Folie 23; die ARGE-Mediane stehen mit
    // denselben Werten im Block baukosten (Folie 3 und ihre Notizen)
    for (const r of wer) if (r.median[0] !== r.spanne.median) P.melde(`${r.name}: Der Median der Herstellung steht in Reihe (${r.median[0]}) und Spanne (${r.spanne.median}) verschieden.`);
    ctx.gleich('PGN-Median gegen den Eingabewert des Laufs modellhaus_pgn_kosten', pgn.spanne.median, W('modellhaus_pgn_kosten', 'eingabe.herstellungskosten_qm'), 0);
    const baukosten = Object.values(ctx.daten.markt.baukosten || {}).filter(g => g && g.kg && g.q4_2025);
    gruppen.forEach((g, i) => {
      const b = baukosten.find(x => x.kg === g.kg);
      if (!b) P.melde(`Kostengruppe ${g.kg} fehlt im Block baukosten (daten/markt.json).`); else ctx.gleich(`ARGE-Median ${g.name} gegen baukosten (Q4 2025)`, arge.median[i], b.q4_2025.wert, 2);
      wl(`„${g.name} ${g.kg}“ ${wer.map(r => fmt.zahl(r.median[i])).join(' | ')}`, `Säulenwerte ${g.name}`);
    });
    if (unter <= 0) P.melde('Der PGN-Median liegt nicht unter dem ARGE-Median; Titel und Kennzahl stimmen dann nicht.');
    const abstand = fmt.zahl(unter * 100, 1);
    if (!ctx.o.titel.includes(`${abstand} % unter`)) P.melde(`Titel der Folie nennt den Abstand nicht mit ${abstand} %.`);

    // ---- Diagramm über acht Spalten ------------------------------------------------------------------------------------------------------
    B.diagrammkopf(s, { titel: T('diagrammtitel'), sub: T('untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: wer.map(r => ({ text: r.name, art: r.art })) });
    const ACHSE = { min: 0, max: 5000, schritt: 1000, format: 'ganz' };
    const d = D.gruppierteSaeulen(s, { kategorien: gruppen.map(g => `${g.name} ${g.kg}`), katAchse: false, luecke: 70, name: 'Diagramm Herstellungskosten', achse: ACHSE, labelFormat: 'ganz',
      altText: `Säulendiagramm: Herstellungskosten je m² Wohnfläche in €, Median, ${wer.map(r => r.name).join(' und ')} für ${gruppen.map(g => `${g.name} (${g.kg})`).join(', ')}`,
      reihen: wer.map(r => ({ name: r.name, art: r.art, werte: r.median })) });
    B.kategorien(s, d, gruppen.map(g => ({ name: g.name, zusatz: g.kg })));

    // ---- Marke: Ansatz des Modellhauses, nur über dem Säulenpaar der Herstellung ------------------------------------------------------------
    // Die Linie setzt über einer Säule aus, die bis an die Linie reicht, und an einer Datenbeschriftung auf ihrer Höhe. Der Text steht rechts
    // neben dem Linienende auf der Höhe der Linie.
    const yM = d.yWert(ansatz), zoll = d.plot.h / (ACHSE.max - ACHSE.min), breite = d.saeulenBreite;
    const luecken = wer.map((r, j) => {
      const dy = (ansatz - r.median[0]) * zoll, halb = P.zeile('Datenbeschriftung', fmt.zahl(r.median[0]), { fontFace: ctx.F.mont, bold: true, fontSize: 12 }, breite) / 2 + 0.09;
      if (dy >= 0.30) return null;
      return dy > 0.02 ? [d.reiheMitte(0, j) - halb, d.reiheMitte(0, j) + halb] : [d.reiheLinks(0, j) - 0.03, d.reiheLinks(0, j) + breite + 0.03];
    }).filter(Boolean);
    const x1 = d.reiheLinks(0, 1) + breite + 0.36, xText = x1 + 0.08;
    B.markeMitLuecken(s, { y: yM, x0: d.reiheLinks(0, 0) - 0.12, x1, luecken, lage: 'aussen', text: T('marke_modellhaus').replace(/: (.+)$/, ': **$1**'), textX: xText, textBreite: d.plot.x + d.plot.w - xText,
      name: 'Marke Ansatz Modellhaus' });

    // ---- Rechte Spalte: Hauptzahl, darunter Grundlage und Spanne ---------------------------------------------------------------------------
    // 60 pt: „−22,7 %“ hat sieben Zeichen. Für einen Text unter dem Label ist in 60 pt kein Platz; das Label nennt deshalb das Wertepaar der Mediane.
    const h = B.hauptzahl(s, { gross: true, vorsatz: T('kennzahl_vorsatz'), zahl: wl(fmt.MINUS + abstand, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });
    // Die Spanne bricht hinter dem Komma: je Zeile ein Absender
    B.zweitesModul(s, { name: 'Grundlage und Spanne', eintraege: [{ titel: T('grundlage_titel'), text: T('grundlage') },
      { titel: T('spanne_titel'), text: B.zweizeilig(T('spanne'), { w: h.w, rolle: 'dicht', nach: /[,;]$/ }) }] });
  },
};
