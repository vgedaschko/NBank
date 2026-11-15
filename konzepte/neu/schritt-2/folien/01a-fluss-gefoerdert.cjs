// Folie 3.3: heutige Folie 17 (Zahlungsfluss in Jahr 1, gefördert), unverändert bis auf den Umriss an der Quelle: Er zeigt jetzt die Sollmiete
// frei finanziert zur Marktmiete (wie auf Folie 3.4), nicht mehr die kostendeckende Sollmiete. So hat frei finanziert im Kapitel eine Miete.
'use strict';
const Fl = require('./_fluss.cjs');
const { QUELLE_MARKT } = require('./_daten.cjs');

module.exports = {
  id: 'fluss-gefoerdert',
  o: { nr: '3.4', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · ZAHLUNGSFLUSS GEFÖRDERT', rubrik: 'Zahlungsfluss gefördert',
    quellen: QUELLE_MARKT },
  bau(ctx) {
    const { B, W, fmt } = ctx, M = k => W('modellhaus', k);
    const zinsA = M('jr1.zins_nbank.A'), anteilZins = zinsA === 0 ? fmt.prozent(0) : fmt.prozent(zinsA / M('jr1.sollmiete.A'), 1);
    const anteilTilgung = fmt.prozent(M('jr1.tilgung_nbank.A') / M('jr1.sollmiete.A'), 1);
    const s = ctx.folie(ctx.titelzeilen([`Gefördert fließen ${anteilZins} der Miete`, `in den Zins, ${anteilTilgung} in die Tilgung`], anteilTilgung));
    B.register(s, '2.1');
    B.quelle(s, QUELLE_MARKT);
    const miete = M('jr1.sollmiete.A'), ausfall = M('jr1.mietausfall.A'), verwaltung = M('jr1.objektverwaltung.A'), instand = M('jr1.instandhaltung.A');
    const vorKd = M('jr1.ueberschuss_vor_kapitaldienst.A'), beitrag = M('jr1.verwaltungskostenbeitrag.A'), zins = M('jr1.zins_nbank.A'), tilgung = M('jr1.tilgung_nbank.A');
    const rest = M('jr1.zahlungsueberschuss.A'), kd = M('dscr.kapitaldienst_jahr1.A');
    Fl.probe(ctx, 'Sollmiete = Mietausfall + Objektverwaltung + Instandhaltung + Überschuss vor Kapitaldienst', ausfall + verwaltung + instand + vorKd, miete);
    Fl.probe(ctx, 'Überschuss vor Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung + Zahlungsüberschuss', beitrag + zins + tilgung + rest, vorKd);
    Fl.probe(ctx, 'Kapitaldienst = Verwaltungskostenbeitrag + Zins + Tilgung', beitrag + zins + tilgung, kd);
    // Bezug zur Folie 3.4: Sollmiete frei finanziert zur Marktmiete = Marktmiete × Wohnfläche × 12 (Konzepte G49)
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
