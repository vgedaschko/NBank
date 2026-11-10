// Muster PGN_INHALT: Signatur-Diagramm Fördermix. Gestapelte Balken, Achskreise A/B/C, Maßkette, 80-%-Achse, Maßstabsleiste,
// Legende, Planlegende, Schlüsselplan und Daumenregister. Alle Zahlen aus werte.json.
'use strict';
module.exports = {
  id: 'p02-inhalt-foerdermix',
  o: { nr: '2', layout: 'PGN_INHALT', titel: 'In jeder Einkommensgruppe bis zu 80 % Förderquote',
    inhalt: 'Kicker: „FINANZIERUNG · PROGRAMMTEIL 2.1“. Titelzeilen: „In jeder Einkommensgruppe“ | „bis zu 80 % Förderquote“ (Signaturwort: „80 %“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y } = ctx, s = ctx.folie();
    B.schluesselplan(s, '2.1'); B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: span(8), titel: 'Fördermix je Einkommensgruppe', sub: 'Höchstsätze in % der zuwendungsfähigen Kosten' });
    B.legende(s, { x: colX(1), y: 2.70, eintraege: [{ text: 'Zuschuss', art: 'zuschuss' }, { text: 'Darlehen', art: 'darlehen' }, { text: 'Eigenmittel, mind.', art: 'eigenmittel' }] });
    const G = ['A', 'B', 'C'], q = (k, g) => Math.round(W('modellhaus', `tab.quote_${k}.${g}`) * 100), em = Math.round(W('modellhaus', 'tab.eigenmittel_mindestens') * 100);
    const d = D.stapelBalken(s, { x: colX(1), y: 2.95, w: span(8), h: 3.55, kategorien: G, name: 'Diagramm Fördermix',
      reihen: [{ name: 'Zuschuss', art: 'zuschuss', werte: G.map(g => q('zuschuss', g)) }, { name: 'Darlehen', art: 'darlehen', werte: G.map(g => q('darlehen', g)) }, { name: 'Eigenmittel, mind.', art: 'eigenmittel', werte: G.map(() => em) }],
      achse: { min: 0, max: 100, schritt: 20, format: 'roh' }, labelFormat: 'prozent' });
    G.forEach((g, i) => B.achskreis(s, { cx: d.plot.x - 0.36, cy: d.katMitte(i), d: 0.42, pt: 14, text: g }));
    const my = d.plot.y - 0.12;
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [{ anteil: q('zuschuss', 'A'), text: fmt.prozentWert(q('zuschuss', 'A')), akzent: true }, { anteil: q('darlehen', 'A'), text: fmt.prozentWert(q('darlehen', 'A')) }, { anteil: em, text: fmt.prozentWert(em) }] });
    B.achse80(s, { x: d.xWert(100 - em), yOben: my, yUnten: d.plot.y + d.plot.h });
    B.massstab(s, { x: d.plot.x, y: d.plot.y + d.plot.h + 0.02, w: d.plot.w });
    B.planlegende(s, { x: colX(9), y: Y.inhalt, w: span(4), h: 4.40, linie: true, pt: 14, eintraege: [
      { titel: 'Regelfall Gruppe A', text: 'B und C mit Zulassung in der Förderentscheidung. Der Zuschuss wird nur zusammen mit dem Darlehen gewährt.' },
      { titel: 'Eigenmittel', text: `Mindestens ${fmt.prozentWert(em)} der zuwendungsfähigen Kosten; mindestens die Hälfte als Geld oder lastenfreies Grundstück.` },
      { titel: 'Bemessungsgrenze', text: `${fmt.zahl(W('modellhaus', 'tab.bemessungsgrenze.I'))} € je m² Wohnfläche in Mietenstufe I–III, ${fmt.zahl(W('modellhaus', 'tab.bemessungsgrenze.IV'))} € in IV–VII.` }] });
  },
};
