// Folie 16 · PGN_INHALT_MR: Zahlungsfluss in Jahr 1 für dasselbe Haus frei finanziert, als Flussdiagramm aus nativen Formen (folien/_fluss.cjs),
// im selben Maßstab und mit derselben Lage der Knoten wie Folie 15. Quelle ist die Sollmiete, bei der der Zahlungsüberschuss null ist:
// nötige Miete je m² und Monat × Wohnfläche × 12. Eine Maßkette links der Quelle misst den Teil, den die Sollmiete zur Höchstmiete der Folie 15 deckt.
// Alle Zahlen aus werte.json (Lauf modellhaus); frei.zins_jahr1 und frei.tilgung_jahr1 stehen dort als Auszahlung negativ.
// Im Modul gerechnet: nötige Sollmiete, Mietausfall dazu, Anteile; Belege mit Formel in daten/pruefung.json. Kein Rot im Diagramm.
'use strict';
const Fl = require('./_fluss.cjs');

module.exports = {
  id: 'rechnung-fluss-frei',
  bau(ctx) {
    const { B, W, fmt } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');

    const mieteQm = M('dscr.noetige_miete.Frei'), miete = mieteQm * M('eingabe.wohnflaeche') * 12, ausfall = M('eingabe.mietausfall') * miete;
    const verwaltung = M('jr1.objektverwaltung.Frei'), instand = M('jr1.instandhaltung.Frei'), kd = M('dscr.kapitaldienst_jahr1.Frei');
    const zins = -M('frei.zins_jahr1'), tilgung = -M('frei.tilgung_jahr1'), vorKd = miete - ausfall - verwaltung - instand, rest = vorKd - kd;
    // Gegenproben: Rechenweg der nötigen Miete, Zerlegung des Kapitaldienstes, Zahlungsüberschuss null
    Fl.probe(ctx, 'nötige Sollmiete = (Kapitaldienst + Objektverwaltung + Instandhaltung) ÷ (1 − Mietausfall)', (kd + verwaltung + instand) / (1 - M('eingabe.mietausfall')), miete);
    Fl.probe(ctx, 'Kapitaldienst = Zins + Tilgung', zins + tilgung, kd);
    Fl.probe(ctx, 'Überschuss vor Kapitaldienst = Kapitaldienst (Zahlungsüberschuss null)', vorKd, kd);
    Fl.probe(ctx, 'Objektverwaltung und Instandhaltung wie gefördert', verwaltung + instand, M('jr1.objektverwaltung.A') + M('jr1.instandhaltung.A'));

    const hoechst = M('jr1.sollmiete.A');
    Fl.zahlungsfluss(ctx, s, {
      art: 'frei finanziert', titel: 'Zahlungsfluss in Jahr 1, frei finanziert', sub: 'in € p. a. und in % der Sollmiete · Miete, bei der der Zahlungsüberschuss null ist · gleicher Maßstab wie gefördert',
      quelle: { name: 'Nötige Sollmiete', wert: miete, zusatz: `${fmt.euroDez(mieteQm)} je m² und Monat` },
      marke: { wert: hoechst, text: ['Sollmiete zur Höchstmiete:', fmt.euro(hoechst)] },
      knoten: { name: 'Überschuss vor Kapitaldienst', wert: kd },
      ziele: [
        { id: 'tilgung', name: 'Tilgung', wert: tilgung, rolle: 'tilgung', ueberKnoten: true },
        { id: 'zins', name: 'Zins Bankdarlehen', wert: zins, rolle: 'zins', ueberKnoten: true },
        { id: 'rest', name: 'Zahlungsüberschuss', wert: Math.abs(rest) < 0.005 ? 0 : rest, rolle: 'ueberschuss', ueberKnoten: true },
        { id: 'instand', name: 'Instandhaltung', wert: instand, rolle: 'bewirtschaftung' },
        { id: 'verwaltung', name: 'Objektverwaltung', wert: verwaltung, rolle: 'bewirtschaftung' },
        { id: 'ausfall', name: 'Mietausfall/Leerstand', wert: ausfall, rolle: 'bewirtschaftung' }],
      klammer: { name: 'Kapitaldienst', wert: kd, ziele: ['tilgung', 'zins'] }, hervor: 'zins' });
  },
};
