// Folie A0 · Trenner vor dem Anhang (PGN_ABSCHNITT, hell): Achskreis XL „A“, Titel, Vorspann mit den Themen der Anhangfolien.
// Ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in zwei Zeilen gebrochen: A1 bis A4 | A5 bis A8; der Zeilenwechsel steht für
// das Trennzeichen.
'use strict';

module.exports = {
  id: 'anhang-trenner',
  bau(ctx) {
    const themen = ['Programmteile und Frist', 'Voraussetzungen und Verträge', 'Mieterkreis und Eckdaten', 'Eigenkapital und Quellen'];   // A7 heißt hier „Eigenkapital“: Das Wort „Rendite“ steht nur auf A7 selbst (E5)
    ctx.wortlaut(themen.join(' · '), 'Vorspann');
    ctx.folie({ lead: `${themen[0]} · ${themen[1]}\n${themen[2]} · ${themen[3]}` });
  },
};
