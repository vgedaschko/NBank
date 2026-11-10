// Muster PGN_AUSSAGE: Vorspann, Aufzählung mit eckigem rotem Marker und Planlegende in den Platzhaltern „lead“, „body“ und „seite“;
// dazu der Achtung-Kasten (nur für Vorhabenbeginn und Frist) und ein Verweis-Chip.
'use strict';
module.exports = {
  id: 'p11-aussage',
  o: { nr: '11', layout: 'PGN_AUSSAGE', titel: 'Sechs Voraussetzungen, darunter Bedarf am Standort',
    inhalt: 'Kicker: „UMSETZUNG · VORAUSSETZUNGEN“. Titelzeilen: „Sechs Voraussetzungen,“ | „darunter Bedarf am Standort“ (Signaturwort: „Bedarf am Standort“).' },
  bau(ctx) {
    const { B, colX, span } = ctx, s = ctx.folie();
    B.vorspann(s, 'Grundcheck für Programmteil 2.1: Diese Fragen klärt das Vorgespräch mit der Wohnraumförderstelle.');
    B.aufzaehlung(s, { platzhalter: 'body', punkte: ['Antragsberechtigt, Finanzierung gesichert?', 'Vor der Bewilligung nicht begonnen?', 'Mehrfamilienhaus ab drei Wohnungen?', 'Mindestens 20 % Eigenmittel, bezogen auf die zuwendungsfähigen Kosten?', 'Grundstück gesichert: Eigentum, Erbbaurecht oder gesicherter Erwerb?'] });
    const l = B.planlegende(s, { platzhalter: 'seite', pt: 14, eintraege: [{ titel: 'Bedarf am Standort', text: 'In beiden Fällen nötig: die einfache Bedarfsbestätigung der Wohnraumförderstelle zum Bauort.' }] });
    B.chip(s, { x: colX(9), y: l.unten + 0.14, text: 'Broschüre S. 18' });
    B.achtung(s, { x: colX(9), y: 4.58, w: span(4), h: 1.92, label: 'Vorhabenbeginn', text: 'Vor der Bewilligung begonnene Vorhaben werden nicht gefördert. Als Beginn gilt ein Bau-, Liefer- oder Kaufvertrag oder der erste Spatenstich.' });
  },
};
