// Folie 7 · Trenner „Ihre Rechnung: das Modellhaus“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel, Vorspann,
// Achsleiste der sechs Abschnitte auf der oberen Rahmenlinie. Einziger roter Trenner; ohne Stempel, weil die Folie keine Ergebniszahl trägt.
'use strict';

module.exports = {
  id: 'trenner-rechnung',
  bau(ctx) {
    const { B, W, P, o, outline } = ctx;
    // Vorspann im Wortlaut des Konzepts; die Zahl der Wohnungen kommt aus der Mappe. Der Satz zur Liquidität („keine Rendite“) steht bei den
    // Annahmen der Jahresrechnung (Folie 9) und nicht ein zweites Mal hier.
    const lead = `Ein Neubau mit ${W('modellhaus', 'eingabe.wohnungen')} Wohnungen nach Programmteil 2.1, einmal gefördert und einmal frei finanziert gerechnet.`;
    ctx.wortlaut(lead, 'Vorspann');
    const s = ctx.folie({ lead });

    // Achsleiste: ein Achskreis je Abschnitt des Hauptteils in der Reihenfolge des Konzepts, der eigene gefüllt
    const abschnitte = [...new Set(outline.folien.map(f => f.abschnitt))].filter(a => a !== 'Anhang'), aktiv = abschnitte.indexOf(o.abschnitt) + 1;
    if (!o.inhalt.includes(`Achskreis XL: „${aktiv}“`)) P.melde(`Abschnitt „${o.abschnitt}“ ist der ${aktiv}. des Hauptteils; das Konzept nennt im Achskreis XL eine andere Nummer.`);
    B.abschnittsleiste(s, { n: abschnitte.length, aktiv });
  },
};
