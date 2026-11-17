// Folie A0 · Trenner vor dem Anhang (PGN_ABSCHNITT, hell): Achskreis XL „A“, Titel, Vorspann mit den Themen der Anhangfolien.
// Ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in drei Zeilen gebrochen: A1 bis A3 | A4 bis A6 | A7; der Zeilenwechsel steht für
// das Trennzeichen. Der Anhang folgt seit 15.11.2026 dem Vortrag: Programmteil 2.1 (A1 bis A3), Modellrechnung (A4), Umsetzung (A5, A6), Quellen (A7).
'use strict';

module.exports = {
  id: 'anhang-trenner',
  bau(ctx) {
    // A1 heißt „Programmteile“, A4 wie ihr Kopf „Annahmen der Modellrechnung“, A7 wie ihr Titel „Quellen und Hinweis“. Die Anhangfolien zu Rendite
    // und Tilgungsschwelle sind mit dem Umbau der Modellrechnung entfallen (Rendite: Folie 21, Spielraum beim Tilgungssatz: Folie 22)
    // Seit 16.11.2026 (Notfassung): ohne Programmteile und Mieterkreis; A1 Eckdaten, A2 Annahmen, A3 und A4 Voraussetzungen und Verträge, A5 Quellen
    const themen = ['Eckdaten und Vergleich', 'Annahmen der Modellrechnung', 'Voraussetzungen und Verträge', 'Quellen und Hinweis'];
    ctx.wortlaut(themen.join(' · '), 'Vorspann');
    ctx.folie({ lead: `${themen[0]} · ${themen[1]}\n${themen[2]} · ${themen[3]}` });
  },
};
