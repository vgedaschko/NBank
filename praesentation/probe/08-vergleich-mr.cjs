// Muster PGN_VERGLEICH_MR: dasselbe Layout auf Papier mit Stempel; die rechte Fläche ist weiß. Werte aus werte.json.
'use strict';
module.exports = {
  id: 'p08-vergleich-mr',
  o: { nr: '8', layout: 'PGN_VERGLEICH_MR', titel: 'Kapitaldienst in Jahr 1',
    inhalt: 'Kicker: „IHRE RECHNUNG · KAPITALDIENST“. Titelzeilen: „Kapitaldienst in Jahr 1: 84.000 €“ | „statt 313.703 € frei finanziert“ (Signaturwort: „84.000 €“).' },
  bau(ctx) {
    const { B, W, fmt } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.vergleichFeld(s, 'links', { kopf: 'frei finanziert', wert: fmt.euro(M('dscr.kapitaldienst_jahr1.Frei')),
      text: [`Gleiches Haus, Eigenmittel ${fmt.mio(M('fin.eigenmittel.Frei'))}, Bankdarlehen ${fmt.mio(M('fin.bankdarlehen.Frei'))} zu ${fmt.prozent(M('eingabe.zins_bank'), 2)} Zins, Annuität über ${M('eingabe.laufzeit_bank')} Jahre.`,
        'Objektverwaltung und Instandhaltung wie gefördert.'] });
    B.vergleichFeld(s, 'rechts', { kopf: 'gefördert, Gruppe A', wert: fmt.euro(M('dscr.kapitaldienst_jahr1.A')),
      text: [`Zuschuss ${fmt.mio(M('fin.zuschuss.A'))}, Darlehen ${fmt.mio(M('fin.darlehen_nbank.A'))} zu ${fmt.prozent(M('jr1.satz.zins_nbank'))} Zins.`,
        `Tilgung ${fmt.prozent(M('jr1.satz.tilgung_nbank'), 1)} p. a. (Annahme), Verwaltungskostenbeitrag ${fmt.prozent(M('jr1.satz.verwaltungskostenbeitrag'), 1)}.`] });
  },
};
