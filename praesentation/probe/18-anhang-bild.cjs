// Muster PGN_ANHANG (Titel einzeilig, 22 pt, Inhaltszone ab y 1,50): Bild mit Bildecke „Visualisierung“ und Beschnittmarken,
// Konturstempel, Kennzahl-Kachel, Aufzählung mit eckigem rotem Marker, Programm-Chips, Icons, Verweis-Chip, Stempel in Kurzfassung.
'use strict';
module.exports = {
  id: 'p18-anhang-bild',
  o: { nr: 'A1', layout: 'PGN_ANHANG', titel: 'Referenz Brauerstraße, Rotenburg (Wümme)', inhalt: 'Kicker: „ANHANG · REFERENZ“.' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, s = ctx.folie();
    const bild = B.bild(s, { datei: 'ref-brauerstrasse.jpg', x: colX(1), y: Y.anhangInhalt + 0.06, w: span(7), marken: true, altText: 'Visualisierung des Mehrfamilienhauses Brauerstraße in Rotenburg (Wümme)' });
    B.aufzaehlung(s, { x: colX(1), y: bild.unten + 0.30, w: span(7), h: 1.30, punkte: ['19 barrierefreie Wohnungen mit Aufzug', 'Luft-Wasser-Wärmepumpe und Photovoltaik', 'Zahl und Einheit bleiben zusammen: 5,6 Mio. €'] });
    const k = B.kennzahl(s, { x: colX(9), y: Y.anhangInhalt, w: span(4), vorsatz: 'Referenzprojekt', zahl: '19', einheit: 'Wohnungen', label: 'Brauerstraße, Rotenburg (Wümme)' });
    B.konturstempel(s, { x: colX(9), y: k.unten + 0.16, w: 3.2, text: 'Mit Förderung der NBank' });
    let y = k.unten + 0.80;
    B.linie(s, { x: colX(9), y, w: span(4), art: 'haar' });
    B.text(s, 'Chips, Icons und Verweis', { x: colX(9), y: y + 0.10, w: span(4), h: 0.24, rolle: 'modultitel', valign: 'middle', einzeilig: true });
    y += 0.46;
    ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'].forEach((nr, i) => B.programmChip(s, { x: colX(9) + i * 0.52, y, nr }));
    y += 0.42;
    [['check', 'tinte'], ['hinweis', 'tinte'], ['stopp', 'dunkelrot'], ['frist', 'rot'], ['rechner', 'tinte']].forEach(([name, farbe], i) => B.icon(s, { name, farbe, x: colX(9) + i * 0.46, y, d: 0.32, altText: name }));
    y += 0.50;
    const c = B.chip(s, { x: colX(9), y, text: 'Broschüre S. 22' });
    B.stempel(s, { x: c.rechts + 0.20, y, kurz: true });
  },
};
