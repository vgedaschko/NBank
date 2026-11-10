// Muster PGN_DIAGRAMM: gruppierte Säulen im Platzhalter „chart“, Achskreise als Kategorien, waagerechte Marke, Legende in der
// dritten Kopfzeile, Kommentar im Platzhalter „kommentar“.
'use strict';
module.exports = {
  id: 'p03-diagramm-saeulen',
  o: { nr: '3', layout: 'PGN_DIAGRAMM', titel: 'Höchstmiete in Programmteil 2.1',
    inhalt: 'Kicker: „ERTRAGSSEITE · MIETEN“. Titelzeilen: „Höchstmiete in Programmteil 2.1:“ | „6,50–9,00 € je m², drei Jahre fest“ (Signaturwort: „drei Jahre fest“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie();
    B.schluesselplan(s, '2.1'); B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Höchstmiete nettokalt, Jahre 1–3', sub: '€ je m² und Monat · nach Einkommensgruppe und Mietenstufe' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Mietenstufe I–III', art: 'bisher' }, { text: 'Mietenstufe IV–VII', art: 'tinte' }] });
    const G = ['A', 'B', 'C'], m = (stufe, g) => W('modellhaus', `tab.hoechstmiete.${stufe}.${g}`);
    const d = D.gruppierteSaeulen(s, { kategorien: G, katAchse: false, name: 'Diagramm Höchstmiete', rand: { r: 1.45 },
      reihen: [{ name: 'Mietenstufe I–III', art: 'bisher', werte: G.map(g => m('I', g)) }, { name: 'Mietenstufe IV–VII', art: 'tinte', werte: G.map(g => m('IV', g)) }],
      achse: { min: 0, max: 12, schritt: 2, format: 'roh' }, labelFormat: 'zwei' });
    G.forEach((g, i) => B.achskreis(s, { cx: d.katMitte(i), cy: d.plot.y + d.plot.h + 0.28, groesse: 'M', text: g }));
    B.marke(s, { x: d.plot.x, y: d.yWert(10), w: d.plot.w, art: 'referenz', strich: 'dash', text: 'Marke bei 10,00 €\n(Muster)', textSeite: 'aussen', textBreite: 1.35 });
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, eintraege: [
      { titel: 'Drei Jahre fest', text: `In den ersten ${W('modellhaus', 'tab.jahre_ohne_mieterhoehung')} Jahren keine Mieterhöhung.` },
      { titel: 'Danach', text: `Höchstens ${fmt.prozent(W('modellhaus', 'tab.mieterhoehung_in_der_bindung'), 2)} in drei Jahren, solange die Bindung läuft.` },
      { titel: 'Effizienzhaus 40', text: `Zuschlag von ${fmt.dez(W('modellhaus', 'tab.zuschlag_hoechstmiete_eh40'))} € je m² auf die Höchstmiete.` }] });
  },
};
