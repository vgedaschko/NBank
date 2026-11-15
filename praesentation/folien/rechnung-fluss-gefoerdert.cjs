// Folie 17 · PGN_INHALT_MR: Zahlungsfluss in Jahr 1, gefördert (Gruppe A), als Flussdiagramm (folien/_fluss.cjs, D.fluss). Der gestrichelte
// Umriss an der Quelle zeigt die Sollmiete frei finanziert zur Marktmiete (Folie 18, selber Maßstab). Werte aus werte.json (Lauf modellhaus,
// Jahresrechnung Jahr 1); die Marktmiete aus daten/kennzahlen.json (Kennzahlen G49).
'use strict';
const Fl = require('./_fluss.cjs');
const { quelleMarkt } = require('./_modell.cjs');

module.exports = {
  id: 'rechnung-fluss-gefoerdert',
  bau(ctx) {
    const { B, W, fmt } = ctx, M = k => W('modellhaus', k);
    const zinsA = M('jr1.zins_nbank.A'), anteilZins = zinsA === 0 ? fmt.prozent(0) : fmt.prozent(zinsA / M('jr1.sollmiete.A'), 1);
    const anteilTilgung = fmt.prozent(M('jr1.tilgung_nbank.A') / M('jr1.sollmiete.A'), 1);
    const s = ctx.folie(ctx.titelzeilen([`Gefördert fließen ${anteilZins} der Miete`, `in den Zins, ${anteilTilgung} in die Tilgung`], anteilTilgung));
    B.register(s, '2.1');
    B.quelle(s, quelleMarkt(ctx));
    const miete = M('jr1.sollmiete.A'), ausfall = M('jr1.mietausfall.A'), verwaltung = M('jr1.objektverwaltung.A'), instand = M('jr1.instandhaltung.A');
    const vorKd = M('jr1.ueberschuss_vor_kapitaldienst.A'), beitrag = M('jr1.verwaltungskostenbeitrag.A'), zins = M('jr1.zins_nbank.A'), tilgung = M('jr1.tilgung_nbank.A');
    const rest = M('jr1.zahlungsueberschuss.A'), kd = M('dscr.kapitaldienst_jahr1.A');
    Fl.probe(ctx, 'Sollmiete = Mietausfall + Objektverwaltung + Instandhaltung + Überschuss vor Kapitaldienst', ausfall + verwaltung + instand + vorKd, miete);
    Fl.probe(ctx, 'Überschuss vor Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung + Zahlungsüberschuss', beitrag + zins + tilgung + rest, vorKd);
    Fl.probe(ctx, 'Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung', beitrag + zins + tilgung, kd);
    // Bezug zur Folie 18: Sollmiete frei finanziert zur Marktmiete = Marktmiete × Wohnfläche × 12 (Kennzahlen G49)
    const frei = ctx.wert('n5.miete_jahr1.frei_markt') * M('eingabe.wohnflaeche') * 12;
    Fl.zahlungsfluss(ctx, s, {
      art: 'gefördert', titel: 'Zahlungsfluss in Jahr 1, gefördert', sub: 'in € p. a. und in % der Sollmiete · Modellhaus, Gruppe A · gleicher Maßstab wie frei finanziert',
      quelle: { name: 'Sollmiete zur Höchstmiete', wert: miete, zusatz: `${fmt.euroDez(M('fin.miete_jahr1.A'))} je m² und Monat` },
      umriss: { wert: frei, text: ['frei finanziert', 'zur Marktmiete:', fmt.euro(frei)] },
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
