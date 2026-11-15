// Folie 3.4: heutige Folie 18 (Zahlungsfluss in Jahr 1, frei finanziert), jetzt zur Marktmiete 15,42 € statt zur kostendeckenden Miete. Die
// Sollmiete deckt den Kapitaldienst nicht: Der Fehlbetrag fließt als eigener Zufluss über das Projektkonto (Kontokorrent, Sollzins
// Eingabe 7.3) in den Knoten, der Zahlungsüberschuss
// steht als negativer Betrag. Alle Zahlen aus der Mappe (Blatt Frei finanziert über werte.json, Konzepte G40, G49, G60, G61).
'use strict';
const Fl = require('./_fluss.cjs');
const { QUELLE_MARKT } = require('./_daten.cjs');

module.exports = {
  id: 'fluss-frei',
  o: { nr: '3.4', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · ZAHLUNGSFLUSS FREI FINANZIERT', rubrik: 'Zahlungsfluss frei finanziert',
    quellen: QUELLE_MARKT },
  bau(ctx) {
    const { B, W, fmt } = ctx, M = k => W('modellhaus', k);
    const mieteQm = ctx.wert('n5.miete_jahr1.frei_markt'), miete = mieteQm * M('eingabe.wohnflaeche') * 12, ausfall = M('eingabe.mietausfall') * miete;
    const verwaltung = M('jr1.objektverwaltung.Frei'), instand = M('jr1.instandhaltung.Frei'), kd = ctx.wert('n5.kapitaldienst_jahr1.frei_markt');
    const zins = -M('frei.zins_jahr1'), tilgung = -M('frei.tilgung_jahr1'), vorKd = miete - ausfall - verwaltung - instand, rest = vorKd - kd;
    Fl.probe(ctx, 'Überschuss vor Kapitaldienst gegen Konzepte G40', vorKd, ctx.wert('n5.uevk_jahr1.frei_markt'));
    Fl.probe(ctx, 'Zahlungsüberschuss gegen Konzepte G61', rest, ctx.wert('n5.zue_jahr1.frei_markt'));
    Fl.probe(ctx, 'Kapitaldienst = Zins + Tilgung', zins + tilgung, kd);
    ctx.pruefe(rest < 0, 'Frei finanziert hat zur Marktmiete keinen Fehlbetrag mehr; Folie anpassen.');
    const anteilZins = fmt.prozent(zins / miete, 1), anteilTilgung = fmt.prozent(tilgung / miete, 1);
    const s = ctx.folie(ctx.titelzeilen([`Frei finanziert fließen ${anteilZins} der Miete`, `in den Zins, ${anteilTilgung} in die Tilgung`], anteilZins));
    B.register(s, '2.1');
    B.quelle(s, QUELLE_MARKT);
    const hoechst = M('jr1.sollmiete.A');
    Fl.zahlungsfluss(ctx, s, {
      art: 'frei finanziert', titel: 'Zahlungsfluss in Jahr 1, frei finanziert', sub: 'in € p. a. und in % der Sollmiete · zur Marktmiete · gleicher Maßstab wie gefördert',
      quelle: { name: 'Sollmiete zur Marktmiete', wert: miete, zusatz: `${fmt.euroDez(mieteQm)} je m² und Monat` },
      marke: { wert: hoechst, text: ['Sollmiete zur Höchstmiete:', fmt.euro(hoechst)] },
      knoten: { name: 'Überschuss vor Kapitaldienst', wert: kd, anzeige: vorKd },   // Balken mit Fehlbetrag so hoch wie der Kapitaldienst, Betrag ohne
      // Der Fehlbetrag läuft in der Mappe über das Projektkonto (VOFI) zum Sollzins der Eingabe 7.3, wie ein Kontokorrentkredit
      fehlbetrag: { name: 'Fehlbetrag, Kontokorrent', wert: -rest, betrag: `${fmt.euro(-rest)} zu ${fmt.prozent(ctx.wert('annahme.sollzins'), 0)} Sollzins` },
      ziele: [
        { id: 'tilgung', name: 'Tilgung', wert: tilgung, rolle: 'tilgung', ueberKnoten: true },
        { id: 'zins', name: 'Zins Bankdarlehen', wert: zins, rolle: 'zins', ueberKnoten: true },
        { id: 'rest', name: 'Zahlungsüberschuss', wert: 0, anzeige: fmt.euro(rest), rolle: 'ueberschuss', ueberKnoten: true },
        { id: 'instand', name: 'Instandhaltung', wert: instand, rolle: 'bewirtschaftung' },
        { id: 'verwaltung', name: 'Objektverwaltung', wert: verwaltung, rolle: 'bewirtschaftung' },
        { id: 'ausfall', name: 'Mietausfall/Leerstand', wert: ausfall, rolle: 'bewirtschaftung' }],
      klammer: { name: 'Kapitaldienst', wert: kd, ziele: ['tilgung', 'zins'] }, hervor: 'zins' });
  },
};
