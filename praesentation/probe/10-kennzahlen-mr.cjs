// Muster PGN_KENNZAHLEN_MR im Wortlaut der Folie 22 des Konzepts: drei Kennzahlen (44 pt) auf Papier mit Stempel, darunter ab y 4,70
// (ZONE.kennzahlen.darunter) eine Planlegende über zwölf Spalten: Modulkopf und drei Einträge im Raster 4 + 4 + 4.
'use strict';
module.exports = {
  id: 'p10-kennzahlen-mr',
  o: { nr: '10', layout: 'PGN_KENNZAHLEN_MR', titel: 'Tilgungssatz, Kosten und Höchstmiete bestimmen das Ergebnis',
    inhalt: 'Kicker: „IHRE RECHNUNG · ZUSAMMENFASSUNG“. Titelzeilen: „Tilgungssatz, Kosten und“ | „Höchstmiete bestimmen das Ergebnis“ (Signaturwort: „das Ergebnis“).' },
  bau(ctx) {
    const { B, W, fmt, colX, span, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.kennzahlFeld(s, 0, { vorsatz: 'bis zu', zahl: fmt.mioZahl(M('fin.foerderung.A')), einheit: 'Mio. €', label: 'Förderung',
      text: `${fmt.prozent(M('fin.foerderquote.A'))} von ${fmt.mio(M('fin.gesamtkosten.A'))}: je ${fmt.mio(M('fin.zuschuss.A'))} Darlehen und Zuschuss. Bindung ${M('tab.bindung')} Jahre.` });
    B.kennzahlFeld(s, 1, { vorsatz: 'Kapitaldienst in Jahr 1', zahl: fmt.zahl(M('dscr.kapitaldienst_jahr1.A')), einheit: '€', label: 'gefördert, Gruppe A', text: `Frei finanziert: ${fmt.euro(M('dscr.kapitaldienst_jahr1.Frei'))}.` });
    B.kennzahlFeld(s, 2, { vorsatz: 'Nötige Miete in Jahr 1', zahl: fmt.dez(M('dscr.noetige_miete.A')), einheit: '€ je m²', label: 'gefördert, Gruppe A', text: `Frei finanziert: ${fmt.euroDez(M('dscr.noetige_miete.Frei'))}. Höchstmiete: ${fmt.euroDez(M('fin.miete_jahr1.A'))}.` });
    const y = B.modulkopf(s, { x: colX(1), y: ZONE.kennzahlen.darunter, w: 12.0, titel: 'Das Ergebnis hängt ab von' });
    [['Tilgungssatz', `Annahme ${fmt.prozent(M('eingabe.tilgung_nbank'), 1)} p. a.; den Satz legt die NBank fest.`],
      ['Herstellungskosten je m²', `Zuwendungsfähig bis zur Bemessungsgrenze, Ausgangswert ${fmt.zahl(M('fin.bemessungsgrenze_qm'))} € in Mietenstufe IV–VII.`],
      ['Höchstmiete', `Nach Einkommensgruppe und Mietenstufe; im Modellhaus ${fmt.euroDez(M('fin.miete_jahr1.A'))}.`]].forEach(([titel, text], i) =>
      B.planlegende(s, { x: colX(1 + 4 * i), y, w: span(4), pt: 14, eintraege: [{ titel, text }], name: 'Planlegende ' + titel }));   // ohne h: Höhe folgt dem Text
  },
};
