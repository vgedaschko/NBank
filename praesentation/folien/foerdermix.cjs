// Folie 9 · PGN_DIAGRAMM: Signatur-Diagramm der Broschüre S. 8. Gestapelte Balken je Einkommensgruppe, Achskreise A, B, C,
// Maßkette über Balken A, 80-%-Achse, Maßstabsleiste; rechts die Planlegende. Alle Zahlen aus werte.json (tab.*).
'use strict';
module.exports = {
  id: 'foerdermix',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, ZONE } = ctx, s = ctx.folie();
    B.schluesselplan(s, '2.1'); B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Fördermix je Einkommensgruppe', sub: 'Höchstsätze in % der zuwendungsfähigen Kosten' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'Darlehen', art: 'darlehen' }, { text: 'Eigenmittel, mind.', art: 'eigenmittel' }] });

    const G = ['A', 'B', 'C'], T = k => W('modellhaus', 'tab.' + k);
    const q = (art, g) => Math.round(T(`quote_${art}.${g}`) * 100), em = Math.round(T('eigenmittel_mindestens') * 100);
    const d = D.stapelBalken(s, {               // Kategorien in Lesereihenfolge (A oben); die Bibliothek dreht sie für PowerPoint
      kategorien: G, name: 'Diagramm Fördermix', achse: { min: 0, max: 100, schritt: 20, format: 'roh' }, labelFormat: 'prozent',
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: G.map(g => q('zuschuss', g)) }, { name: 'Darlehen', art: 'darlehen', werte: G.map(g => q('darlehen', g)) }, { name: 'Eigenmittel, mind.', art: 'eigenmittel', werte: G.map(() => em) }] });

    G.forEach((g, i) => B.achskreis(s, { cx: d.plot.x - 0.36, cy: d.katMitte(i), d: 0.42, pt: 14, text: g }));
    const my = d.plot.y - 0.12;
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [{ anteil: q('zuschuss', 'A'), text: fmt.prozentWert(q('zuschuss', 'A')), akzent: true }, { anteil: q('darlehen', 'A'), text: fmt.prozentWert(q('darlehen', 'A')) }, { anteil: em, text: fmt.prozentWert(em) }] });
    B.achse80(s, { x: d.xWert(100 - em), yOben: my, yUnten: d.plot.y + d.plot.h, text: String(100 - em) });
    B.massstab(s, { x: d.plot.x, y: d.plot.y + d.plot.h + 0.02, w: d.plot.w });

    const [tag1, tag2] = X('regeln', 'bemessungsgrenze.fortschreibung');
    // titelAbstand 4 pt: Die Spalte füllt ihr Feld mit 15 Zeilen; mit 10 pt vor den Zwischentiteln blieben gut 2 % Luft, so sind es gut 5 %
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, titelAbstand: 4, eintraege: [
      { titel: 'Regelfall Gruppe A', text: 'B und C mit Zulassung in der Förderentscheidung. Der Zuschuss wird nur zusammen mit dem Darlehen gewährt.' },
      { titel: 'Eigenmittel', text: `Mindestens ${fmt.prozentWert(em)} der zuwendungsfähigen Kosten; mindestens die Hälfte als Geld oder lastenfreies Grundstück.` },
      { titel: 'Bemessungsgrenze', text: `${fmt.zahl(T('bemessungsgrenze.I'))} € je m² Wohnfläche in Mietenstufe I–III, ${fmt.zahl(T('bemessungsgrenze.IV'))} € in IV–VII; Ausgangswerte, fortgeschrieben zum ${tag1} und ${tag2}; aktuell auf nbank.de.` }] });   // gekürzt um ein Wort („aktueller Wert auf“), sonst eine Zeile zu viel
  },
};
