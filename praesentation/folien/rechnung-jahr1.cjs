// Folie 15 · PGN_TABELLE_MR: Jahresrechnung Jahr 1 für A, B und C als Rechenblatt nach Broschüre S. 11 (Zeilennummern wie dort),
// Ergebniszeile 8 weiß auf Rot, Bearbeitungsentgelte als Notiz unter der Tabelle, rechts die Annahmen. Die Rechnung ist vor Steuern; die
// Rendite über 35 Jahre steht auf der Anhangfolie A7 (anhang-rendite), nicht hier.
// Alle Zahlen aus werte.json (Lauf modellhaus, jr1.*); das Jahr des Kostenstands aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-jahr1',
  bau(ctx) {
    const { B, W, fmt, colX, span, ZONE } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), G = R.G;
    // Annahme der Jahresrechnung: Tilgung 1 ÷ Höchstlaufzeit. Weicht die Mappe davon ab, stimmt der Satz „gleichmäßig über … Jahre“ nicht mehr.
    const laufzeit = M('tab.laufzeit_hoechstens');
    R.pruefe(Math.abs(M('jr1.satz.tilgung_nbank') - 1 / laufzeit) < 1e-9, 'Der Tilgungssatz der Jahresrechnung ist nicht 1 ÷ Höchstlaufzeit; den Satz „Tilgung gleichmäßig über … Jahre“ auf Folie 15 anpassen.');
    B.register(s, '2.1');
    const z = k => G.map(g => fmt.zahl(M(`jr1.${k}.${g}`))), satz = k => M('jr1.satz.' + k);
    const miete = G.map(g => fmt.dez(M(`fin.miete_jahr1.${g}`))).join(' | ');
    B.tabellenkopf(s, { titel: 'Jahresrechnung Jahr 1, in € p. a.', sub: `Höchstmiete nettokalt, Mietenstufe ${R.mietenstufeKlasse(M('eingabe.mietenstufe'))}: ${miete} € je m² und Monat (A | B | C)` });
    B.rechenblatt(s, { x: colX(1), y: ZONE.tabelle.tabelle, w: span(8), dicht: true, name: 'Rechenblatt Jahresrechnung', kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }], zeilen: [
      { nr: 1, text: 'Sollmiete zur Höchstmiete', werte: z('sollmiete') },
      { zeichen: fmt.MINUS, text: `Mietausfall/Leerstand, ${fmt.prozent(satz('mietausfall'))}`, werte: z('mietausfall') },
      { nr: 2, zeichen: fmt.MINUS, text: `Objektverwaltung, ${fmt.euro(satz('objektverwaltung'))} je Wohnung`, werte: z('objektverwaltung') },
      { nr: 3, zeichen: fmt.MINUS, text: `Instandhaltung, ${fmt.euroJeQm(satz('instandhaltung'))}`, werte: z('instandhaltung') },
      { nr: 4, zeichen: '=', text: 'Überschuss vor Kapitaldienst', werte: z('ueberschuss_vor_kapitaldienst'), art: 'summe' },
      { nr: 5, zeichen: fmt.MINUS, text: `Verwaltungskostenbeitrag, ${fmt.prozent(satz('verwaltungskostenbeitrag'), 1)}`, werte: z('verwaltungskostenbeitrag') },
      { nr: 6, zeichen: fmt.MINUS, text: `Zins NBank-Darlehen, ${fmt.prozent(satz('zins_nbank'))}`, werte: z('zins_nbank') },
      { nr: 7, zeichen: fmt.MINUS, text: `Tilgung ${fmt.prozent(satz('tilgung_nbank'), 2)} p. a. (Annahme)`, werte: z('tilgung_nbank') },
      { nr: 8, zeichen: '=', text: 'Zahlungsüberschuss p. a.', werte: z('zahlungsueberschuss'), art: 'ergebnis' }] });
    B.notiz(s, `Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte ${z('bearbeitungsentgelte').join(' | ')} €`);
    // Dass die NBank den Tilgungssatz festlegt, steht auf den Folien 12, 20 und 24; hier trägt Zeile 7 der Rechnung den Vermerk „Annahme“
    B.planlegende(s, { platzhalter: 'kommentar', pt: 16, eintraege: [
      { titel: 'Annahmen', text: ctx.wortlaut(`Gerechnet ist Jahr 1 zum Kostenstand ${R.kostenstand(ctx)}, vor Steuern.`, 'Annahmen') },
      // Der Satz der Jahresrechnung ist 1 ÷ Höchstlaufzeit: gleichmäßige Tilgung bis zum Ende der längsten Laufzeit (RL Nr. 5.3.5)
      { text: ctx.wortlaut(`Tilgung gleichmäßig über ${laufzeit} Jahre auf ${G.map(g => fmt.mioZahl(M(`fin.darlehen_nbank.${g}`))).join(' | ')} Mio. € Darlehen.`, 'Annahmen') },
      { text: ctx.wortlaut('B und C setzen eine Zulassung in der Förderentscheidung voraus.', 'Annahmen') }] });
  },
};
