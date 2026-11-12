// Folie 16 · PGN_DIAGRAMM_MR: Kapitaldienst in Jahr 1, gefördert (Gruppe A) gegen frei finanziert, als gestapelte Balken aus Tilgung,
// Zins und Verwaltungskostenbeitrag in Tinte, Referenzgrau und Hellgrau. Die Summen stehen als Kernwerte am Balkenende. Kein Rot im Diagramm.
// Alle Zahlen aus werte.json (Lauf modellhaus); frei.zins_jahr1 und frei.tilgung_jahr1 stehen dort als Auszahlung negativ.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-kapitaldienst',
  bau(ctx) {
    const { B, D, W, fmt, colX, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: 'Kapitaldienst in Jahr 1', sub: ctx.wortlaut('in € p. a. · gleiches Haus, gefördert und frei finanziert', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Tilgung', art: 'tinte' }, { text: 'Zins', art: 'referenz' }, { text: 'Verwaltungskostenbeitrag', art: 'bisher' }] });

    // Kategorien in Lesereihenfolge: gefördert oben, frei finanziert unten
    const reihen = [
      { name: 'Tilgung', art: 'tinte', werte: [M('jr1.tilgung_nbank.A'), -M('frei.tilgung_jahr1')] },
      { name: 'Zins', art: 'referenz', werte: [M('jr1.zins_nbank.A'), -M('frei.zins_jahr1')] },
      { name: 'Verwaltungskostenbeitrag', art: 'bisher', werte: [M('jr1.verwaltungskostenbeitrag.A'), 0] }];
    const summen = [M('dscr.kapitaldienst_jahr1.A'), M('dscr.kapitaldienst_jahr1.Frei')];
    summen.forEach((v, i) => R.pruefe(Math.abs(reihen.reduce((a, r) => a + r.werte[i], 0) - v) < 0.005, 'Tilgung, Zins und Verwaltungskostenbeitrag ergeben nicht den Kapitaldienst der Mappe.'));
    const d = D.stapelBalken(s, { kategorien: ['Gefördert, Gruppe A', 'Frei finanziert'], katAchse: true, katBreite: 1.55, rand: { o: 0.30, r: 0.30, u: 0.50 }, luecke: 80, name: 'Diagramm Kapitaldienst',
      reihen, achse: { min: 0, max: 150000, schritt: 25000, format: 'ganz' } });
    B.achsentitel(s, d, { x: ctx.wortlaut('Kapitaldienst in € p. a.', 'Achsentitel') });

    // Summen am Balkenende: gefördert rechts neben dem Balken in Tinte, frei finanziert über dem Balkenende in Grau (jeweils auf einer Fläche
    // in der Grundfarbe, die die Gitterlinien hinter der Zahl unterbricht)
    const oben = i => d.katMitte(i) - d.balkenHoehe / 2;
    B.textAufPlot(s, fmt.euro(summen[0]), { x: d.xWert(summen[0]) + 0.14, y: d.katMitte(0) - 0.20, w: 1.75, h: 0.40, rolle: 'kernwert', valign: 'middle', name: 'Summe gefördert' });
    B.textAufPlot(s, fmt.euro(summen[1]), { x: d.xWert(summen[1]) - 1.75, y: oben(1) - 0.45, w: 1.75, h: 0.40, rolle: 'kernwert', farbe: 'sekundaer', align: 'right', valign: 'middle', name: 'Summe frei finanziert' });
    // Segmente, deren Wert nicht hineinpasst (Verwaltungskostenbeitrag): Wert über dem Segment
    for (const o of d.ohneLabel) {
      const vor = reihen.slice(0, reihen.findIndex(r => r.name === o.reihe)).reduce((a, r) => a + r.werte[o.i], 0), mitte = d.xWert(vor + o.wert / 2);
      B.textAufPlot(s, fmt.zahl(o.wert), { x: mitte - 0.40, y: oben(o.i) - 0.27, w: 0.80, h: 0.24, rolle: 'wert', align: 'center', valign: 'middle', name: 'Wert ' + o.reihe });
    }

    B.planlegende(s, { platzhalter: 'kommentar', pt: 16, eintraege: [
      { titel: 'Annahmen', text: `Frei finanziert: gleiches Haus, Eigenmittel ${fmt.mio(M('fin.eigenmittel.Frei'))}, Bankdarlehen ${fmt.mio(M('fin.bankdarlehen.Frei'))} zu ${fmt.prozent(M('eingabe.zins_bank'), 2)} Zins, Annuität über ${M('eingabe.laufzeit_bank')} Jahre. Objektverwaltung und Instandhaltung wie gefördert.` },
      { text: `Gefördert: Zuschuss ${fmt.mio(M('fin.zuschuss.A'))}, Darlehen ${fmt.mio(M('fin.darlehen_nbank.A'))} zu ${fmt.prozent(M('jr1.satz.zins_nbank'))} Zins, Tilgung ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)} p. a.` }].map(e => ({ ...e, text: ctx.wortlaut(e.text, 'Annahmen') })) });
  },
};
