// Folie 22 · PGN_INHALT (Kopf über zwölf Spalten mit B.modulkopf, auf den Höhen der Diagrammfolien): Kostenspannen je m² Wohnfläche,
// PGN gegen ARGE, alle sieben Kostengruppen in der Reihenfolge der Vorlage des Auftraggebers (Altfassung Folie 12), ohne Tabelle.
// Das Diagramm ist dasselbe wie auf Folie 3 (folien/_kostengruppen.cjs, spannen): je Gruppe zwei Säulen mit Sockel bis zum kleinsten Wert,
// Spanne bis zum größten Wert und Median, ARGE als helle Fläche mit Kontur, PGN in Tinte. Über jeder Gruppe der Abstand des PGN-Medians zum
// ARGE-Median in %; der Wert der Herstellung ist der eine rote Wert der Folie (die Zahl des Titels).
// Für das Grundstück gibt es keine PGN-Werte: An der Stelle der Säule und in der Prozentzeile steht ein Halbgeviertstrich.
// Werte aus daten/markt.json, Block kosten (spannen, spanne_herstellung); die Abstände sind im Modul gerechnet.
'use strict';
const KG = require('./_kostengruppen.cjs');

module.exports = {
  id: 'pgn-baukosten',
  bau(ctx) {
    const { B, X, W, fmt, colX, span, ZONE, P } = ctx, s = ctx.folie(), K = p => X('markt', 'kosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const WER = ['arge', 'pgn'], z = v => fmt.zahl(v);
    const gruppen = K('alle_gruppen').map(k => {
      const g = { k, name: X('markt', `baukosten.${k}.name`), kurz: X('markt', `baukosten.${k}.kurz`), kg: X('markt', `baukosten.${k}.kg`), werte: {} };
      for (const w of WER) { const sp = ctx.daten.markt.kosten.spannen[w][k]; g.werte[w] = sp ? Object.fromEntries(['min', 'median', 'max'].map(m => [m, K(`spannen.${w}.${k}.${m}`)])) : null; }
      g.abstand = g.werte.pgn ? g.werte.pgn.median / g.werte.arge.median - 1 : null;
      g.text = g.abstand === null ? '–' : (g.abstand < 0 ? fmt.MINUS : '+') + fmt.zahl(Math.abs(g.abstand) * 100, 1) + ' %';
      return g;
    });
    const H = gruppen[0];
    H.akzent = true;
    if (gruppen.length !== 7 || H.k !== 'herstellung') P.melde(`Die Folie zeigt die Herstellung und sechs Kostengruppen; kosten.alle_gruppen nennt ${gruppen.length}.`);

    // ---- Gegenproben ------------------------------------------------------------------------------------------------------------------
    // Spanne der Herstellung gleich dem Block spanne_herstellung; PGN-Median gleich dem Ansatz des Modellhauses, ARGE-Median gleich dem Eingabewert
    // des zweiten Laufs der Folie 23; ARGE-Mediane gleich baukosten (Folie 3); der Titel nennt den gerechneten Abstand
    for (const w of WER) for (const m of ['min', 'median', 'max']) ctx.gleich(`${w} Herstellung ${m} gegen spanne_herstellung`, H.werte[w][m], K(`${w}.spanne_herstellung.${m}`), 2);
    ctx.gleich('PGN-Median gegen den Ansatz des Modellhauses (Lauf modellhaus, Eingabe 2.1)', H.werte.pgn.median, W('modellhaus', 'eingabe.herstellungskosten_qm'), 0);
    ctx.gleich('ARGE-Median gegen den Eingabewert des Laufs modellhaus_kosten_4631', H.werte.arge.median, W('modellhaus_kosten_4631', 'eingabe.herstellungskosten_qm'), 0);
    for (const g of gruppen) ctx.gleich(`ARGE-Median ${g.name} gegen baukosten (Q4 2025)`, g.werte.arge.median, X('markt', `baukosten.${g.k}.q4_2025`), 2);
    const abstand = fmt.zahl(-H.abstand * 100, 1);
    if (H.abstand >= 0) P.melde('Der PGN-Median liegt nicht unter dem ARGE-Median; Titel und Prozentzeile stimmen dann nicht.');
    if (!ctx.o.titel.includes(`${abstand} % unter`)) P.melde(`Titel der Folie nennt den Abstand nicht mit ${abstand} %.`);
    gruppen.forEach(g => wl(`„${g.kurz}“ · „${g.kg}“ ARGE ${z(g.werte.arge.median)} · PGN ${g.werte.pgn ? z(g.werte.pgn.median) : '–'} · ${g.text}`, `Medianwerte ${g.name}`));

    // ---- Kopf, Legende, Diagramm ---------------------------------------------------------------------------------------------------------
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: span(12), titel: wl('Herstellungs- und Grundstückskosten je m² Wohnfläche, PGN und ARGE', 'Diagrammtitel'),
      sub: wl('in €, Bruttokosten, Kostenstand Q4 2025', 'Untertitel') });   // „Minimum, Median und Maximum“ nennt die Legende (F22.1, wie F3.2)
    KG.legende(ctx, s, { eintraege: [{ text: wl('ARGE, deutsche Großstädte', 'Legende'), art: 'bezug' }, { text: wl('PGN, fünf Projekte', 'Legende'), art: 'tinte' }],
      spanne: wl('Säule: Minimum bis Maximum · Strich und Wert: Median', 'Legende') });
    KG.spannen(ctx, s, { name: 'Diagramm Kostenspannen', achse: { min: 0, max: 10000, schritt: 2000, format: 'ganz' }, achsentitel: wl('€ je m² Wohnfläche', 'Achsentitel'), label: wl('PGN zu ARGE', 'Prozentzeile'),
      reihen: [{ key: 'arge', name: 'ARGE', art: 'bezug' }, { key: 'pgn', name: 'PGN', art: 'tinte' }], gruppen,
      altText: 'Säulen mit Spanne: Kosten je m² Wohnfläche in €, kleinster bis größter Wert mit Median, ARGE und PGN. ' +
        gruppen.map(g => `${g.name} (${g.kg}): ARGE ${z(g.werte.arge.min)} bis ${z(g.werte.arge.max)}, Median ${z(g.werte.arge.median)}; PGN ${g.werte.pgn ? `${z(g.werte.pgn.min)} bis ${z(g.werte.pgn.max)}, Median ${z(g.werte.pgn.median)}` : 'keine Werte'}; ${g.text}`).join('. ') + '.' });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, kosten.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'kosten.quelle_kurz'), 'Quellenzeile'));
  },
};
