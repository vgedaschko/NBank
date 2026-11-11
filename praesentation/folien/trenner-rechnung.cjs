// Folie 13 · Trenner „Modellrechnung: Neubau mit 14 Wohnungen“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel, Vorspann,
// Achsleiste der vier Abschnitte auf der oberen Rahmenlinie. Aufbau und Zählung: S.trenner in folien/_struktur.cjs, wie die Trenner der
// anderen Abschnitte und die Agenda (Folie 7).
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'trenner-rechnung',
  bau(ctx) {
    const { W } = ctx;
    // Titel im Wortlaut des Konzepts; die Zahl der Wohnungen kommt aus der Mappe. Der Vorspann steht im Konzept: Das Modellhaus ist ein
    // PGN-Projekt in Neu Wulmstorf (Projekt 2 der Mappe); die Straße nennt der Vortrag nicht. Der Satz zur Liquidität („vor Steuern“) steht bei
    // den Annahmen der Jahresrechnung (Folie 15) und nicht ein zweites Mal hier.
    const wohnungen = `${W('modellhaus', 'eingabe.wohnungen')} Wohnungen`, titel = ['Modellrechnung:', `Neubau mit ${wohnungen}`];
    titel.forEach((z, i) => ctx.wortlaut(`„${z}“`, `Titelzeile ${i + 1}`));
    ctx.wortlaut(`Signaturwort: „${wohnungen}“`, 'Signaturwort');
    S.trenner(ctx, { titel, akzent: wohnungen });
  },
};
