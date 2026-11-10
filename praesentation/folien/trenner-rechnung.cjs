// Folie 13 · Trenner „Ihre Rechnung: das Modellhaus“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel, Vorspann,
// Achsleiste der vier Abschnitte auf der oberen Rahmenlinie. Aufbau und Zählung: S.trenner in folien/_struktur.cjs, wie die Trenner der
// anderen Abschnitte und die Agenda (Folie 7). Ohne Stempel, weil die Folie keine Ergebniszahl trägt.
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'trenner-rechnung',
  bau(ctx) {
    const { W } = ctx;
    // Vorspann im Wortlaut des Konzepts; die Zahl der Wohnungen kommt aus der Mappe. Der Satz zur Liquidität („keine Rendite“) steht bei den
    // Annahmen der Jahresrechnung (Folie 15) und nicht ein zweites Mal hier.
    const lead = `Ein Neubau mit ${W('modellhaus', 'eingabe.wohnungen')} Wohnungen nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet.`;
    ctx.wortlaut(lead, 'Vorspann');
    S.trenner(ctx, { lead });
  },
};
