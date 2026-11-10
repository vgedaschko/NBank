// Muster PGN_DIAGRAMM_MR: gestapelte Balken mit zwei Kategorien (gefördert oben, frei finanziert unten) und drei Reihen in Tinte,
// Referenzgrau und Hellgrau; Nullwerte bleiben ohne Beschriftung, die Summen stehen als Kernwerte am Balkenende. Kein Rot im Diagramm.
'use strict';
module.exports = {
  id: 'p24-diagramm-mr-kapitaldienst',
  o: { nr: '24', layout: 'PGN_DIAGRAMM_MR', titel: 'Kapitaldienst in Jahr 1: 84.000 € statt 313.703 € frei finanziert',
    inhalt: 'Kicker: „MODELLRECHNUNG · KAPITALDIENST“. Titelzeilen: „Kapitaldienst in Jahr 1: 84.000 €“ | „statt 313.703 € frei finanziert“ (Signaturwort: „84.000 €“).' },
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Kapitaldienst in Jahr 1', sub: 'in € p. a. · dasselbe Haus, gefördert und frei finanziert' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Tilgung', art: 'tinte' }, { text: 'Zins', art: 'referenz' }, { text: 'Verwaltungskostenbeitrag', art: 'bisher' }] });
    const tilgung = [M('jr1.tilgung_nbank.A'), -M('frei.tilgung_jahr1')], zins = [M('jr1.zins_nbank.A'), -M('frei.zins_jahr1')], vkb = [M('jr1.verwaltungskostenbeitrag.A'), 0];
    const d = D.stapelBalken(s, { kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], katAchse: true, katBreite: 1.55, rand: { o: 0.25, r: 0.30 }, luecke: 70, name: 'Diagramm Kapitaldienst',
      reihen: [{ name: 'Tilgung', art: 'tinte', werte: tilgung }, { name: 'Zins', art: 'referenz', werte: zins }, { name: 'Verwaltungskostenbeitrag', art: 'bisher', werte: vkb }],
      achse: { min: 0, max: 400000, schritt: 100000, format: 'ganz' } });
    [M('dscr.kapitaldienst_jahr1.A'), M('dscr.kapitaldienst_jahr1.Frei')].forEach((v, i) =>
      B.textAufPlot(s, fmt.euro(v), { x: i ? d.xWert(v) - 1.75 : d.xWert(v) + 0.14, y: i ? d.katMitte(i) - d.balkenHoehe / 2 - 0.45 : d.katMitte(i) - 0.20, w: 1.75, h: 0.40, rolle: 'kernwert', align: i ? 'right' : 'left', farbe: i ? 'sekundaer' : 'titel', valign: 'middle', name: i ? 'Summe frei finanziert' : 'Summe gefördert' }));   // Fläche in Grundfarbe hinter der Zahl
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, eintraege: [
      { titel: 'Annahmen', text: `Frei finanziert: gleiches Haus, Eigenmittel ${fmt.mio(M('fin.eigenmittel.Frei'))}, Bankdarlehen ${fmt.mio(M('fin.bankdarlehen.Frei'))} zu ${fmt.prozent(M('eingabe.zins_bank'), 2)} Zins, Annuität über ${M('eingabe.laufzeit_bank')} Jahre.` },
      { text: `Gefördert: Zuschuss ${fmt.mio(M('fin.zuschuss.A'))}, Darlehen ${fmt.mio(M('fin.darlehen_nbank.A'))} zu ${fmt.prozent(M('jr1.satz.zins_nbank'))} Zins, Tilgung ${fmt.prozent(M('jr1.satz.tilgung_nbank'), 1)} p. a. (Annahme).` }] });
  },
};
