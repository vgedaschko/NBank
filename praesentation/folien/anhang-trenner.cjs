// Folie A0 · Trenner vor dem Anhang (PGN_ABSCHNITT, hell): Achskreis XL „A“, Titel, Vorspann mit den Themen der Anhangfolien.
// Ohne Achsleiste der Abschnitte. Der Vorspann ist von Hand in drei Zeilen gebrochen: A1 bis A3 | A4 bis A7 | A8; der Zeilenwechsel steht für
// das Trennzeichen.
'use strict';

module.exports = {
  id: 'anhang-trenner',
  bau(ctx) {
    // Seit der Änderungsrunde vom 13.11.2026 (F29.1): A1 heißt „Programmteile“ (die Frist 31.12.2026 ist mit der Anhangfolie dazu entfallen), A6
    // „Rendite“ (bis dahin „Eigenkapital“). Das Wort „Rendite“ steht damit außer auf A6 nur hier, als Ausnahme auf Wunsch des Auftraggebers
    // (Rückfrage 16; pruefe_folien.py: RENDITE_TRENNER). A7 heißt wie in ihrem Kopf „Tilgungsschwelle“, A8 wie ihr Titel „Quellen und Hinweis“
    const themen = ['Programmteile', 'Voraussetzungen und Verträge', 'Mieterkreis und Eckdaten', 'Rendite und Tilgungsschwelle', 'Quellen und Hinweis'];
    ctx.wortlaut(themen.join(' · '), 'Vorspann');
    ctx.folie({ lead: `${themen[0]} · ${themen[1]}\n${themen[2]} · ${themen[3]}\n${themen[4]}` });
  },
};
