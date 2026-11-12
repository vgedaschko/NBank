// Folie 22 · PGN_INHALT (Kopf über zwölf Spalten mit B.modulkopf, auf den Höhen der Diagrammfolien): Kostenspannen je m² Wohnfläche,
// PGN gegen ARGE, alle sieben Kostengruppen in der Reihenfolge der Vorlage des Auftraggebers (Altfassung Folie 12), ein Diagramm mit einer
// Achse über die ganze Inhaltsbreite, ohne Tabelle. Je Gruppe zwei Säulen: unten der Sockel von null bis zum kleinsten Wert als hellste
// Graufläche ohne Kontur (Reihenart „sockel“, kein Eintrag in der Legende), darüber die Spanne vom kleinsten zum größten Wert, ARGE als helle
// Fläche mit Kontur, PGN in Tinte. Der Median ist ein kräftiger Strich quer über der Spanne; sein Wert steht über der Säule. Über jeder Gruppe
// der Abstand des PGN-Medians zum ARGE-Median in %; der Wert der Herstellung ist der eine rote Wert der Folie (die Zahl des Titels).
// Raster wie Folie 3: acht Gruppenplätze (Herstellung, ein leerer Platz als Abstand, sechs Kostengruppen), je Platz vier Kategorien des
// Diagramms [Abstand, ARGE, Abstand, PGN, Abstand]; die Mitte einer Gruppe liegt damit auf derselben Stelle wie auf Folie 3, und zwischen den
// beiden Säulen bleibt Platz: Jeder Medianwert steht mittig über seiner Säule, ohne die Nachbarsäule zu berühren.
// Für das Grundstück gibt es keine PGN-Werte: An der Stelle der Säule und in der Prozentzeile steht ein Halbgeviertstrich.
// Werte aus daten/markt.json, Block kosten (spannen, spanne_herstellung); die Abstände sind im Modul gerechnet. Gemeinsame Teile mit Folie 3:
// folien/_kostengruppen.cjs.
'use strict';
const KG = require('./_kostengruppen.cjs');

module.exports = {
  id: 'pgn-baukosten',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, span, ZONE, P, HEX, C } = ctx, s = ctx.folie(), K = p => X('markt', 'kosten.' + p), wl = (t, was) => ctx.wortlaut(t, was);
    const WER = ['arge', 'pgn'], ART = { arge: 'bezug', pgn: 'tinte' }, z = v => fmt.zahl(v);
    const gruppen = K('alle_gruppen').map(k => {
      const g = { k, name: X('markt', `baukosten.${k}.name`), kurz: X('markt', `baukosten.${k}.kurz`), kg: X('markt', `baukosten.${k}.kg`) };
      for (const w of WER) { const sp = ctx.daten.markt.kosten.spannen[w][k]; g[w] = sp ? Object.fromEntries(['min', 'median', 'max'].map(m => [m, K(`spannen.${w}.${k}.${m}`)])) : null; }
      g.abstand = g.pgn ? g.pgn.median / g.arge.median - 1 : null;
      g.text = g.abstand === null ? '–' : (g.abstand < 0 ? fmt.MINUS : '+') + fmt.zahl(Math.abs(g.abstand) * 100, 1) + ' %';
      return g;
    });
    const H = gruppen[0];
    if (gruppen.length !== 7 || H.k !== 'herstellung') P.melde(`Die Folie zeigt die Herstellung und sechs Kostengruppen; kosten.alle_gruppen nennt ${gruppen.length}.`);

    // ---- Gegenproben ------------------------------------------------------------------------------------------------------------------
    // Spanne der Herstellung gleich dem Block spanne_herstellung; PGN-Median gleich dem Ansatz des Modellhauses, ARGE-Median gleich dem Eingabewert
    // des zweiten Laufs der Folie 23; ARGE-Mediane gleich baukosten (Folie 3); jede Spanne geordnet; der Titel nennt den gerechneten Abstand
    for (const w of WER) for (const m of ['min', 'median', 'max']) ctx.gleich(`${w} Herstellung ${m} gegen spanne_herstellung`, H[w][m], K(`${w}.spanne_herstellung.${m}`), 2);
    ctx.gleich('PGN-Median gegen den Ansatz des Modellhauses (Lauf modellhaus, Eingabe 2.1)', H.pgn.median, W('modellhaus', 'eingabe.herstellungskosten_qm'), 0);
    ctx.gleich('ARGE-Median gegen den Eingabewert des Laufs modellhaus_kosten_4631', H.arge.median, W('modellhaus_kosten_4631', 'eingabe.herstellungskosten_qm'), 0);
    for (const g of gruppen) {
      ctx.gleich(`ARGE-Median ${g.name} gegen baukosten (Q4 2025)`, g.arge.median, X('markt', `baukosten.${g.k}.q4_2025`), 2);
      for (const w of WER) if (g[w] && !(g[w].min <= g[w].median && g[w].median <= g[w].max)) P.melde(`${w} ${g.name}: Spanne nicht geordnet.`);
    }
    const abstand = fmt.zahl(-H.abstand * 100, 1);
    if (H.abstand >= 0) P.melde('Der PGN-Median liegt nicht unter dem ARGE-Median; Titel und Prozentzeile stimmen dann nicht.');
    if (!ctx.o.titel.includes(`${abstand} % unter`)) P.melde(`Titel der Folie nennt den Abstand nicht mit ${abstand} %.`);
    gruppen.forEach(g => wl(`„${g.kurz}“ · „${g.kg}“ ARGE ${z(g.arge.median)} · PGN ${g.pgn ? z(g.pgn.median) : '–'} · ${g.text}`, `Medianwerte ${g.name}`));

    // ---- Kopf und Legende (ohne Eintrag für den Sockel) ---------------------------------------------------------------------------------------
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: span(12), titel: wl('Herstellungs- und Grundstückskosten je m² Wohnfläche, PGN und ARGE', 'Diagrammtitel'),
      sub: wl('in €, Bruttokosten, Kostenstand Q4 2025 · Minimum, Median und Maximum je Kostengruppe', 'Untertitel') });
    const yL = ZONE.diagramm.legende, NAME = { arge: wl('ARGE, deutsche Großstädte', 'Legende'), pgn: wl('PGN, fünf Projekte', 'Legende') };
    const leg = B.legende(s, { x: colX(1), y: yL, fein: true, eintraege: WER.map(w => ({ text: NAME[w], art: ART[w] })) });
    const gx = leg.rechts + 0.30;
    s.addShape(ctx.pres.ShapeType.rect, { x: gx + 0.08, y: yL + 0.01, w: 0.12, h: 0.22, fill: { color: HEX.papier }, line: { color: HEX.tinte, width: 0.5 }, objectName: 'Legende Spanne' });
    B.linie(s, { x: gx + 0.04, y: yL + 0.10, w: 0.20, art: 'tinte', pt: 2, name: 'Legende Medianlinie' });
    B.text(s, wl('Säule: Minimum bis Maximum · Strich und Wert: Median', 'Legende'), { x: gx + 0.36, y: yL, w: 5.0, h: 0.24, rolle: 'legende', valign: 'middle', einzeilig: true, name: 'Legendentext Spanne' });

    // ---- Diagramm über zwölf Spalten: acht Gruppenplätze zu je fünf Kategorien [Abstand, ARGE, Abstand, PGN, Abstand] -------------------------
    const plaetze = [H, null, ...gruppen.slice(1)], SLOT = 5, STELLE = { arge: 1, pgn: 3 }, ACHSE = { min: 0, max: 10000, schritt: 2000, format: 'ganz' };
    const kat = plaetze.flatMap(g => [null, g && { g, w: 'arge' }, null, g && { g, w: 'pgn' }, null]);
    const wert = (c, fn) => (c && c.g[c.w] ? fn(c.g[c.w]) : 0);
    for (const g of gruppen) for (const w of WER) if (g[w] && g[w].max > ACHSE.max) P.melde(`${g.name}: Die Spanne reicht über die Größenachse.`);
    const reihen = [{ name: 'Sockel bis Minimum', art: 'sockel', werte: kat.map(c => wert(c, v => v.min)) }];
    for (const wr of WER) {
      reihen.push({ name: `${wr.toUpperCase()} Minimum bis Median`, art: ART[wr], werte: kat.map(c => (c && c.w === wr ? wert(c, v => v.median - v.min) : 0)) });
      reihen.push({ name: `${wr.toUpperCase()} Median bis Maximum`, art: ART[wr], werte: kat.map(c => (c && c.w === wr ? wert(c, v => v.max - v.median) : 0)) });
    }
    const d = D.stapelSaeulen(s, { x: colX(1), y: KG.LAGE.chartY, w: span(12), h: KG.LAGE.chartH, kategorien: kat.map(c => (c ? `${c.g.name} · ${c.w.toUpperCase()}` : ' ')), katAchse: false, fein: true,
      saeule: 0.26, labels: false, rand: { l: 0.80, r: 0.02, o: KG.LAGE.randO, u: KG.LAGE.randU }, name: 'Diagramm Kostenspannen', achse: ACHSE, reihen,
      altText: 'Säulen mit Spanne: Kosten je m² Wohnfläche in €, kleinster bis größter Wert mit Median, ARGE und PGN. ' +
        gruppen.map(g => `${g.name} (${g.kg}): ARGE ${z(g.arge.min)} bis ${z(g.arge.max)}, Median ${z(g.arge.median)}; PGN ${g.pgn ? `${z(g.pgn.min)} bis ${z(g.pgn.max)}, Median ${z(g.pgn.median)}` : 'keine Werte'}; ${g.text}`).join('. ') + '.' });
    B.achsentitel(s, d, { y: wl('€ je m² Wohnfläche', 'Achsentitel') });

    // ---- Prozentzeile, Trenner, Kategorien: Mitte einer Gruppe = Mitte der Lücke zwischen ARGE- und PGN-Säule ---------------------------------
    const slot = d.plot.w / kat.length, platz = g => plaetze.indexOf(g), mitte = g => d.plot.x + slot * (SLOT * platz(g) + SLOT / 2), unten = d.plot.y + d.plot.h;
    KG.prozentzeile(ctx, s, { label: wl('PGN zu ARGE', 'Prozentzeile'), labelX: colX(1), labelW: 0.95, eintraege: gruppen.map(g => ({ x: mitte(g), text: g.text, akzent: g === H, name: g.name })) });
    KG.trenner(ctx, s, { x: d.plot.x + slot * (SLOT * 1 + SLOT / 2), y0: KG.LAGE.zeile, y1: unten + 0.46 });
    KG.kategorien(ctx, s, { y: unten + 0.05, eintraege: gruppen.map(g => ({ x: mitte(g), w: slot * SLOT + 0.10, name: g.kurz, kg: g.kg })) });

    // ---- Grundlinie über dem Sockel: Die helle Fläche des Sockels läge sonst auf der Linie der Achse und unterbräche sie ---------------------
    B.linie(s, { x: d.plot.x, y: unten, w: d.plot.w, art: 'tinte', name: 'Grundlinie über dem Sockel' });

    // ---- Median: Strich quer über der Spanne, Wert mittig über der Säule im Ton ihrer Reihe -----------------------------------------------------
    // Der Strich steht 0,04 Zoll über die Säule hinaus; auf der Tinte der PGN-Spanne zeichnet eine weiße Linie ihn nach, wenn die Spanne hoch
    // genug ist. Der Wert steht mittig über dem größten Wert seiner Säule
    for (const g of gruppen) for (const w of WER) {
      const links = d.plot.x + slot * (SLOT * platz(g) + STELLE[w]) + (slot - d.saeulenBreite) / 2, cx = links + d.saeulenBreite / 2;
      if (!g[w]) { B.text(s, '–', { x: cx - 0.20, y: unten - 0.27, w: 0.40, h: 0.22, rolle: 'wert', farbe: 'sekundaer', align: 'center', valign: 'middle', einzeilig: true, name: `Wert ${g.name} ${w} leer` }); continue; }
      const ym = d.yWert(g[w].median), hoch = d.yWert(g[w].min) - d.yWert(g[w].max), tw = 0.54;
      B.linie(s, { x: links - 0.04, y: ym, w: d.saeulenBreite + 0.08, art: 'tinte', pt: 2, farbe: C.tinte, name: `Medianstrich ${g.name} ${w}` });
      if (w === 'pgn' && hoch >= 0.16) B.linie(s, { x: links + 0.015, y: ym, w: d.saeulenBreite - 0.03, art: 'tinte', pt: 1, farbe: 'FFFFFF', name: `Medianlinie ${g.name} ${w}` });
      B.textAufPlot(s, z(g[w].median), { x: cx - tw / 2, y: d.yWert(g[w].max) - 0.25, w: tw, h: 0.22, rolle: 'wert', farbe: D.ART[ART[w]].wert, align: 'center', valign: 'middle', name: `Median ${g.name} ${w}` });
    }

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, kosten.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'kosten.quelle_kurz'), 'Quellenzeile'));
  },
};
