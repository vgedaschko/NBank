// Folie 11 · PGN_DIAGRAMM: Signatur-Diagramm der Broschüre S. 8. Gestapelte Balken je Einkommensgruppe, Achskreise A, B, C,
// Maßkette über Balken A, 80-%-Achse, Maßstabsleiste; rechts Stichpunkte in 14 pt (seit 13.11.2026, F11.1). Alle Zahlen aus werte.json (tab.*).
// Seit 13.11.2026 Teilung 6 + 6 im Layout PGN_INHALT (G9).
// Rot ist zugeteilt (Muster 2): im Diagramm nur der Zuschuss (Balken und Feld der Legende), im Titel die 80 %. Maßkette, 80-%-Achse und
// Achskreis stehen in Tinte. Den Programmteil nennen Kopf und Daumenregister; der Schlüsselplan in der Kickerzeile ist entfallen (er
// nannte „2.1“ ein drittes Mal).
'use strict';
module.exports = {
  id: 'foerdermix',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, ZONE } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    // Teilung 6 + 6 (seit 13.11.2026, G9): Die Stichpunkte in 14 pt passen auch mit engeren Abständen nicht in fünf Spalten. Diagramm und
    // Stichpunkte stehen deshalb frei (Layout PGN_INHALT); der Kopf liegt auf den Höhen der Diagrammfolien
    const WD = span(6);
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: WD, titel: 'Fördersätze je Einkommensgruppe', sub: 'Höchstsätze in % der zuwendungsfähigen Kosten' });   // „Fördersätze“ wie die Broschüre S. 8
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'Darlehen', art: 'darlehen' }, { text: 'Eigenmittel, mind.', art: 'eigenmittel' }] });

    const G = ['A', 'B', 'C'], T = k => W('modellhaus', 'tab.' + k);
    const q = (art, g) => Math.round(T(`quote_${art}.${g}`) * 100), em = Math.round(T('eigenmittel_mindestens') * 100);
    const d = D.stapelBalken(s, {               // Kategorien in Lesereihenfolge (A oben); die Bibliothek dreht sie für PowerPoint
      x: colX(1), y: ZONE.diagramm.chart.y, w: WD, h: ZONE.diagramm.chart.h, kategorien: G, name: 'Diagramm Fördersätze', rand: { u: 0.50 }, achse: { min: 0, max: 100, schritt: 20, format: 'roh' }, labelFormat: 'prozent',
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: G.map(g => q('zuschuss', g)) }, { name: 'Darlehen', art: 'darlehen', werte: G.map(g => q('darlehen', g)) }, { name: 'Eigenmittel, mind.', art: 'eigenmittel', werte: G.map(() => em) }] });

    G.forEach((g, i) => B.achskreis(s, { cx: d.plot.x - 0.36, cy: d.katMitte(i), d: 0.42, pt: 14, text: g }));
    const my = d.plot.y - 0.12;
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [{ anteil: q('zuschuss', 'A'), text: fmt.prozentWert(q('zuschuss', 'A')) }, { anteil: q('darlehen', 'A'), text: fmt.prozentWert(q('darlehen', 'A')) }, { anteil: em, text: fmt.prozentWert(em) }] });
    B.achse80(s, { x: d.xWert(100 - em), yOben: my, yUnten: d.plot.y + d.plot.h, text: String(100 - em) });
    B.massstab(s, { x: d.plot.x, y: d.plot.y + d.plot.h + 0.02, w: d.plot.w });
    B.achsentitel(s, d, { x: ctx.wortlaut('% der zuwendungsfähigen Kosten', 'Achsentitel') });

    const [tag1, tag2] = X('regeln', 'bemessungsgrenze.fortschreibung'), wl = (t, was) => ctx.wortlaut(t, was);
    // Seit der Änderungsrunde vom 13.11.2026 (F11.1, G9) Stichpunkte unter drei Überschriften, einheitlich 14 pt (bis dahin Planlegende in 16 pt)
    B.stichpunkte(s, { x: colX(7), y: ZONE.diagramm.kopf, w: span(6), h: ctx.Y.inhaltEnde - ZONE.diagramm.kopf, linie: true, titelAbstand: 6, punktAbstand: 1, gruppen: [
      { titel: wl('Zuschuss', 'Überschrift'), punkte: [wl('nicht rückzahlbar', 'Stichpunkt'), wl('nur zusammen mit dem Darlehen', 'Stichpunkt')] },
      { titel: wl('Eigenmittel', 'Überschrift'), punkte: [wl(`mindestens ${fmt.prozentWert(em)} der zuwendungsfähigen Kosten`, 'Stichpunkt'),
        wl('davon soll mindestens die Hälfte Geld oder lastenfreies Grundstück sein', 'Stichpunkt')] },
      { titel: wl('Bemessungsgrenze', 'Überschrift'), punkte: [wl('Obergrenze der zuwendungsfähigen Herstellungskosten je m² Wohnfläche', 'Stichpunkt'),
        // weicher Umbruch vor dem zweiten Wert: Sonst bräche „IV–VII“ am Halbgeviertstrich
        wl(`seit ${X('regeln', 'bemessungsgrenze.gilt_seit')}: ${fmt.zahl(T('bemessungsgrenze.I'))} € in Mietenstufe I–III, ${fmt.zahl(T('bemessungsgrenze.IV'))} € in IV–VII`, 'Stichpunkt').replace('I–III, ', 'I–III, \n'),
        wl(`Fortschreibung zum ${tag1} und ${tag2}, aktueller Wert auf nbank.de`, 'Stichpunkt')] }] });
  },
};
