// Folie 17 · PGN_INHALT_MR: Zahlungsfluss in Jahr 1 für das Modellhaus, Gruppe A, als Flussdiagramm aus nativen Formen (folien/_fluss.cjs).
// Von der Sollmiete zur Höchstmiete gehen Mietausfall, Objektverwaltung und Instandhaltung ab; der Überschuss vor Kapitaldienst teilt sich in
// Tilgung, Verwaltungskostenbeitrag und Zahlungsüberschuss. Maßstab, Lage der Knoten und Reihenfolge der Ziele wie auf Folie 18.
// Ein gestrichelter Umriss an der Quelle zeigt im selben Maßstab die Sollmiete, die dasselbe Haus frei finanziert braucht (Quelle der Folie 18).
// Alle Zahlen aus werte.json (Lauf modellhaus); Anteile = Betrag ÷ Sollmiete, Belege mit Formel in daten/pruefung.json. Kein Rot im Diagramm.
'use strict';
const Fl = require('./_fluss.cjs');

module.exports = {
  id: 'rechnung-fluss-gefoerdert',
  bau(ctx) {
    const { B, W, fmt } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');

    const miete = M('jr1.sollmiete.A'), ausfall = M('jr1.mietausfall.A'), verwaltung = M('jr1.objektverwaltung.A'), instand = M('jr1.instandhaltung.A');
    const vorKd = M('jr1.ueberschuss_vor_kapitaldienst.A'), beitrag = M('jr1.verwaltungskostenbeitrag.A'), zins = M('jr1.zins_nbank.A'), tilgung = M('jr1.tilgung_nbank.A');
    const rest = M('jr1.zahlungsueberschuss.A'), kd = M('dscr.kapitaldienst_jahr1.A');
    // Summenproben: Zuflüsse und Abflüsse gehen an jedem Knoten auf
    Fl.probe(ctx, 'Sollmiete = Mietausfall + Objektverwaltung + Instandhaltung + Überschuss vor Kapitaldienst', ausfall + verwaltung + instand + vorKd, miete);
    Fl.probe(ctx, 'Überschuss vor Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung + Zahlungsüberschuss', beitrag + zins + tilgung + rest, vorKd);
    Fl.probe(ctx, 'Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung', beitrag + zins + tilgung, kd);
    Fl.probe(ctx, 'Sollmiete = Höchstmiete × Wohnfläche × 12', M('fin.miete_jahr1.A') * M('eingabe.wohnflaeche') * 12, miete);
    // Bezug zur Folie 18: nötige Sollmiete frei finanziert, gerechnet wie dort
    const frei = M('dscr.noetige_miete.Frei') * M('eingabe.wohnflaeche') * 12;

    Fl.zahlungsfluss(ctx, s, {
      art: 'gefördert', titel: 'Zahlungsfluss in Jahr 1, gefördert', sub: 'in € p. a. und in % der Sollmiete · Modellhaus, Gruppe A · gleicher Maßstab wie frei finanziert',
      quelle: { name: 'Sollmiete zur Höchstmiete', wert: miete, zusatz: `${fmt.euroDez(M('fin.miete_jahr1.A'))} je m² und Monat` },
      umriss: { wert: frei, text: ['frei finanziert nötig:', fmt.euro(frei)] },
      knoten: { name: 'Überschuss vor Kapitaldienst', wert: vorKd },
      ziele: [
        { id: 'tilgung', name: 'Tilgung', wert: tilgung, rolle: 'tilgung', ueberKnoten: true },
        { id: 'zins', name: 'Zins NBank-Darlehen', wert: zins, rolle: 'zins', ueberKnoten: true },
        { id: 'beitrag', name: 'Verwaltungskostenbeitrag', wert: beitrag, rolle: 'beitrag', ueberKnoten: true },
        { id: 'rest', name: 'Zahlungsüberschuss', wert: rest, rolle: 'ueberschuss', ueberKnoten: true },
        { id: 'instand', name: 'Instandhaltung', wert: instand, rolle: 'bewirtschaftung' },
        { id: 'verwaltung', name: 'Objektverwaltung', wert: verwaltung, rolle: 'bewirtschaftung' },
        { id: 'ausfall', name: 'Mietausfall/Leerstand', wert: ausfall, rolle: 'bewirtschaftung' }],
      klammer: { name: 'Kapitaldienst', wert: kd, ziele: ['tilgung', 'zins', 'beitrag'] }, hervor: 'tilgung' });
  },
};
