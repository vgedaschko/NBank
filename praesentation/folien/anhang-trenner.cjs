// Folie A0 · Trenner vor dem Anhang (PGN_ABSCHNITT, hell): Achskreis XL „A“, Titel, Vorspann mit den Themen der Anhangfolien.
// Ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in drei Zeilen gebrochen: A1 bis A4 | A5 bis A8 | A9; der Zeilenwechsel steht für
// das Trennzeichen.
'use strict';

module.exports = {
  id: 'anhang-trenner',
  bau(ctx) {
    // A7 heißt hier „Eigenkapital“: Das Wort „Rendite“ steht nur auf A7 selbst (E5). A8 heißt wie in ihrem Kopf „Tilgungsschwelle“ (bis 12.11.2026
    // „Tilgung“), A9 wie ihr Titel „Quellen und Hinweis“
    const themen = ['Programmteile und Frist', 'Voraussetzungen und Verträge', 'Mieterkreis und Eckdaten', 'Eigenkapital und Tilgungsschwelle', 'Quellen und Hinweis'];
    ctx.wortlaut(themen.join(' · '), 'Vorspann');
    ctx.folie({ lead: `${themen[0]} · ${themen[1]}\n${themen[2]} · ${themen[3]}\n${themen[4]}` });
  },
};
