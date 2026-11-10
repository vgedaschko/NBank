// Folie 11 · Trenner „Ihre Rechnung: das Modellhaus“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel, Vorspann,
// Achsleiste der vier Abschnitte auf der oberen Rahmenlinie. Zählung und Reihenfolge sind die der Agenda (Folie 6): beide lesen die Abschnitte
// des Hauptteils aus dem Konzept. Einziger roter Trenner; ohne Stempel, weil die Folie keine Ergebniszahl trägt.
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'trenner-rechnung',
  bau(ctx) {
    const { B, W, P, o } = ctx;
    // Vorspann im Wortlaut des Konzepts; die Zahl der Wohnungen kommt aus der Mappe. Der Satz zur Liquidität („keine Rendite“) steht bei den
    // Annahmen der Jahresrechnung (Folie 13) und nicht ein zweites Mal hier.
    const lead = `Ein Neubau mit ${W('modellhaus', 'eingabe.wohnungen')} Wohnungen nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet.`;
    ctx.wortlaut(lead, 'Vorspann');
    const s = ctx.folie({ lead });

    // Achsleiste: ein Achskreis je Abschnitt des Hauptteils in der Reihenfolge des Konzepts, der eigene gefüllt
    const abschnitte = S.abschnitte(ctx), aktiv = abschnitte.indexOf(o.abschnitt) + 1;
    if (!o.inhalt.includes(`Achskreis XL: „${aktiv}“`)) P.melde(`Abschnitt „${o.abschnitt}“ ist der ${aktiv}. des Hauptteils; das Konzept nennt im Achskreis XL eine andere Nummer.`);
    B.abschnittsleiste(s, { n: abschnitte.length, aktiv });
  },
};
