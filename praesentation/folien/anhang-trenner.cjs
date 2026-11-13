// Folie A0 · Trenner vor dem Anhang (PGN_ABSCHNITT, hell): Achskreis XL „A“, Titel, Vorspann mit den Themen der Anhangfolien.
// Ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in drei Zeilen gebrochen: A1 bis A3 | A4 bis A7 | A8; der Zeilenwechsel steht für
// das Trennzeichen.
'use strict';

module.exports = {
  id: 'anhang-trenner',
  bau(ctx) {
    // A6 heißt hier „Eigenkapital“: Das Wort „Rendite“ steht nur auf A6 selbst (E5). A7 heißt wie in ihrem Kopf „Tilgungsschwelle“ (bis 12.11.2026
    // „Tilgung“), A8 wie ihr Titel „Quellen und Hinweis“
    const themen = ['Programmteile und Frist', 'Voraussetzungen und Verträge', 'Mieterkreis und Eckdaten', 'Eigenkapital und Tilgungsschwelle', 'Quellen und Hinweis'];
    ctx.wortlaut(themen.join(' · '), 'Vorspann');
    ctx.folie({ lead: `${themen[0]} · ${themen[1]}\n${themen[2]} · ${themen[3]}\n${themen[4]}` });
  },
};
