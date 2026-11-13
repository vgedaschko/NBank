// Muster PGN_DIAGRAMM für die Bausteine der Änderungsrunde vom 13.11.2026: Hinweiskasten am Diagramm (B.hinweis, G8: grauer Kasten mit
// Info-Symbol, Work Sans Light 12 pt, so breit wie das Diagramm) und Stichpunkte rechts (B.stichpunkte, G9: Überschriften wie Modultitel,
// Stichpunkte einheitlich 14 pt). Das Diagramm wird um die Höhe des Kastens niedriger und endet über ihm.
'use strict';
module.exports = {
  id: 'p34-diagramm-hinweis-stichpunkte',
  o: { nr: '10', layout: 'PGN_DIAGRAMM', titel: 'Hinweiskasten und Stichpunkte',
    inhalt: 'Kicker: „MUSTER · HINWEIS UND STICHPUNKTE“. Titelzeilen: „Hinweis am Diagramm,“ | „Stichpunkte rechts in 14 pt“ (Signaturwort: „14 pt“).' },
  bau(ctx) {
    const { B, D, W, ZONE } = ctx, s = ctx.folie();
    B.diagrammkopf(s, { titel: 'Höchstmiete nettokalt, Jahre 1–3', sub: '€ je m² und Monat · Mietenstufe IV–VII' });
    const c = ZONE.diagramm.chart, text = 'Ab Effizienzhaus-40-Niveau bis zu +0,30 € je m². Der Kasten steht direkt am Diagramm und ist so breit wie dieses.';
    // Erst die Höhe des Kastens, dann das Diagramm darüber: Es endet 0,12 über dem Kasten
    const hH = B.hinweisHoehe(text, { w: c.w }), unten = c.y + c.h;
    const G = ['A', 'B', 'C'];
    D.gruppierteSaeulen(s, { x: c.x, y: c.y, w: c.w, h: c.h - hH - 0.12, kategorien: G, name: 'Diagramm Muster',
      reihen: [{ name: 'Mietenstufe IV–VII', art: 'tinte', werte: G.map(g => W('modellhaus', `tab.hoechstmiete.IV.${g}`)) }],
      achse: { min: 0, max: 12, schritt: 2, format: 'roh' }, labelFormat: 'zwei' });
    B.hinweis(s, { x: c.x, y: unten, unten: true, w: c.w, text });
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: 'Zulässige Mieterhöhung', punkte: ['Jahr 1 bis 3: keine Mieterhöhung', 'danach höchstens +6,15 % in drei Jahren'] },
      { titel: 'Annahme', punkte: ['Kosten ab Jahr 2 +2 % p. a.', 'eine Zeile, die umbricht, weil sie länger ist als die Spalte breit'] }] });
  },
};
