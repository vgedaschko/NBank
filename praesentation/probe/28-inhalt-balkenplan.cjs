// Muster PGN_INHALT im Wortlaut der Folie 24 des Konzepts: Deck, Balkenplan der Leistungsphasen (B.balkenplan) über acht Spalten mit
// Bewilligungsmarke in Dunkelrot; rechts Bild mit Bildecke, Bildzeile, Konturstempel und ein Eintrag der Planlegende (Höhe folgt dem Text).
'use strict';
module.exports = {
  id: 'p28-inhalt-balkenplan',
  o: { nr: '28', layout: 'PGN_INHALT', titel: 'Planung bis Leistungsphase 6 ist vor der Bewilligung möglich',
    inhalt: 'Kicker: „UMSETZUNG · MIT PGN“. Titelzeilen: „Planung bis Leistungsphase 6 ist“ | „vor der Bewilligung möglich“ (Signaturwort: „vor der Bewilligung“).' },
  bau(ctx) {
    const { B, colX, span, Y } = ctx, s = ctx.folie();
    B.text(s, 'Leistungen der PGN nach Leistungsphasen 1 bis 9', { x: colX(1), y: Y.deck, w: 12.0, h: Y.deckH, rolle: 'deck', valign: 'middle', einzeilig: true, name: 'Deck' });
    B.balkenplan(s, { x: colX(1), y: Y.inhaltNachDeck, w: span(8), labelBreite: 3.50, zeilenH: 0.34, kopf: 'Leistungsphase', phasen: 9, nummern: false,   // ohne Nummern: Im Plan zählen nur die Leistungsphasen
      marke: { nach: 6, text: 'Bewilligung', zeichen: '±0' },
      links: 'Planungsauftrag LPH 1–6: vor der Bewilligung möglich', rechts: 'ab LPH 7: erst nach der Bewilligung',
      zeilen: [
        { nr: 1, text: 'Förderung und Machbarkeit', wort: 'vor dem Vorgespräch' },
        { nr: 2, text: 'Förderkonforme Planung', von: 1, bis: 4 },
        { nr: 3, text: 'Kostenplanung', von: 2, bis: 8 },
        { nr: 4, text: 'Antragsunterlagen', wort: 'Vorgespräch und Antrag' },
        { nr: 5, text: 'Ausführungsplanung und Vergabe', von: 5, bis: 7 },
        { nr: 6, text: 'Bauleitung', von: 8 },
        { nr: 7, text: 'Fertigstellung und Nachweis', von: 8, bis: 9 }] });
    const b = B.bild(s, { datei: 'ref-brauerstrasse.jpg', x: colX(9), y: Y.inhaltNachDeck, w: span(4), altText: 'Visualisierung des Mehrfamilienhauses Brauerstraße in Rotenburg (Wümme)' });
    const z = B.text(s, 'Brauerstraße, Rotenburg (Wümme) · 19 barrierefreie Wohnungen', { x: colX(9), y: b.unten + 0.05, w: span(4), rolle: 'label', name: 'Bildzeile' });
    B.konturstempel(s, { x: colX(9), y: z.unten + 0.08, w: 3.0, text: 'Mit Förderung der NBank' });
    B.planlegende(s, { x: colX(9), y: z.unten + 0.56, w: span(4), linie: true, pt: 14, eintraege: [
      { titel: 'Förderung und Machbarkeit', text: 'Wir klären Programmteil, Standort und Mieterkreis und ermitteln Flächen und Kosten für Ihre Wirtschaftlichkeitsberechnung.' }] });
  },
};
