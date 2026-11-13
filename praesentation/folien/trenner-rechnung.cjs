// Folie 13 · Trenner „Modellrechnung: 14 Wohnungen, gefördert und frei finanziert“ (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des
// Abschnitts, Titel, Vorspann, Achsleiste der vier Abschnitte auf der oberen Rahmenlinie. Aufbau und Zählung: S.trenner in folien/_struktur.cjs,
// wie die Trenner der anderen Abschnitte und die Agenda (Folie 7).
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'trenner-rechnung',
  bau(ctx) {
    const { W, fmt } = ctx;
    // Titel und Vorspann im Wortlaut des Konzepts; Zahl der Wohnungen und Wohnfläche kommen aus der Mappe. Seit der Änderungsrunde vom
    // 13.11.2026 (F13.1, G10) nennt der Titel Kapitel und Themen; das Signaturwort sind die Themen nach dem Doppelpunkt. Der Vorspann (F13.2)
    // nennt das Modellhaus (PGN-Projekt in Neu Wulmstorf, Projekt 2 der Mappe; die Straße nennt der Vortrag nicht).
    const wohnungen = `${W('modellhaus', 'eingabe.wohnungen')} Wohnungen`;
    const titel = ['Modellrechnung:', `${wohnungen}, gefördert`, 'und frei finanziert'], akzent = `${wohnungen}, gefördert und frei finanziert`;
    titel.forEach((z, i) => ctx.wortlaut(`„${z}“`, `Titelzeile ${i + 1}`));
    ctx.wortlaut(`Signaturwort: „${akzent}“`, 'Signaturwort');
    const lead = ctx.wortlaut(`Modellhaus: PGN-Projekt in Neu Wulmstorf mit ${fmt.qm(W('modellhaus', 'eingabe.wohnflaeche'))} Wohnfläche. ` +
      'Vergleich der Förderung nach Programmteil 2.1 mit der freien Finanzierung.', 'Vorspann');
    S.trenner(ctx, { titel, akzent, lead });
  },
};
