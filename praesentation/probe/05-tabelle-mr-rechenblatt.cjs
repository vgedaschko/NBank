// Muster PGN_TABELLE_MR: Rechenblatt in dichter Fassung (12 pt) mit Nummernstreifen, Rechenzeichen, Summenzeilen, roter Ergebniszeile,
// Achskreisen als Spaltenköpfen und der Notiz im Platzhalter „notiz“. Rechts die Planlegende im Platzhalter „kommentar“.
'use strict';
module.exports = {
  id: 'p05-tabelle-mr-rechenblatt',
  o: { nr: '5', layout: 'PGN_TABELLE_MR', titel: 'Jahr 1: Zahlungsüberschuss 455 € in A',
    inhalt: 'Kicker: „MODELLRECHNUNG · WIRTSCHAFTLICHKEIT“. Titelzeilen: „Jahr 1: Zahlungsüberschuss 455 €“ | „in A, Fehlbeträge in B und C“ (Signaturwort: „455 €“).' },
  bau(ctx) {
    const { B, W, fmt, colX, span, ZONE } = ctx, s = ctx.folie();
    B.register(s, '2.1');
    const G = ['A', 'B', 'C'], z = k => G.map(g => fmt.zahl(W('modellhaus', `jr1.${k}.${g}`)));
    const miete = G.map(g => fmt.dez(W('modellhaus', `fin.miete_jahr1.${g}`))).join(' | ');
    B.tabellenkopf(s, { titel: 'Jahresrechnung Jahr 1, in € p. a.', sub: `Höchstmiete nettokalt, Mietenstufe IV–VII: ${miete} € je m² (A | B | C)` });
    B.rechenblatt(s, { x: colX(1), y: ZONE.tabelle.tabelle, w: span(8), dicht: true, kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }], zeilen: [
      { nr: 1, text: 'Sollmiete zur Höchstmiete', werte: z('sollmiete') },
      { zeichen: '−', text: `Mietausfall/Leerstand, ${fmt.prozent(W('modellhaus', 'jr1.satz.mietausfall'))}`, werte: z('mietausfall') },
      { nr: 2, zeichen: '−', text: `Objektverwaltung, ${fmt.zahl(W('modellhaus', 'jr1.satz.objektverwaltung'))} € je Wohnung`, werte: z('objektverwaltung') },
      { nr: 3, zeichen: '−', text: `Instandhaltung, ${fmt.dez(W('modellhaus', 'jr1.satz.instandhaltung'))} € je m²`, werte: z('instandhaltung') },
      { nr: 4, zeichen: '=', text: 'Überschuss vor Kapitaldienst', werte: z('ueberschuss_vor_kapitaldienst'), art: 'summe' },
      { nr: 5, zeichen: '−', text: `Verwaltungskostenbeitrag, ${fmt.prozent(W('modellhaus', 'jr1.satz.verwaltungskostenbeitrag'), 1)}`, werte: z('verwaltungskostenbeitrag') },
      { nr: 6, zeichen: '−', text: `Zins NBank-Darlehen, ${fmt.prozent(W('modellhaus', 'jr1.satz.zins_nbank'))}`, werte: z('zins_nbank') },
      { nr: 7, zeichen: '−', text: `Tilgung ${fmt.prozent(W('modellhaus', 'jr1.satz.tilgung_nbank'), 1)} p. a. (Annahme)`, werte: z('tilgung_nbank') },
      { nr: 8, zeichen: '=', text: 'Zahlungsüberschuss p. a.', werte: z('zahlungsueberschuss'), art: 'ergebnis' }] });
    B.notiz(s, `Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte ${z('bearbeitungsentgelte').join(' | ')} €`);
    B.planlegende(s, { platzhalter: 'kommentar', pt: 14, eintraege: [
      { titel: 'Annahmen', text: 'Liquidität in Jahr 1 bei Kostenstand 2026, keine Rendite.' },
      { text: `Tilgung auf ${G.map(g => fmt.mioZahl(W('modellhaus', `fin.darlehen_nbank.${g}`))).join(' | ')} Mio. € Darlehen. Den Tilgungssatz legt die NBank fest.` },
      { text: 'B und C setzen eine Zulassung in der Förderentscheidung voraus.' }] });
  },
};
