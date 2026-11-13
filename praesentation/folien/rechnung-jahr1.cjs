// Folie 15 · PGN_TABELLE_MR: Jahresrechnung Jahr 1 für A, B und C als Rechenblatt nach Broschüre S. 11. Zeilen 1 bis 9, Mietausfall/Leerstand
// als eigene Zeile 2 (Änderungsrunde vom 13.11.2026, G2; die Rechenmappe zählt weiter 1 bis 8 mit Mietausfall als Unterzeile),
// Ergebniszeile 9 weiß auf Rot, Bearbeitungsentgelte im Hinweiskasten unter der Tabelle (G8, F15.2), rechts die Annahmen als Stichpunkte in
// 14 pt (G9, F15.3). Die Rechnung ist vor Steuern; die
// Rendite über 35 Jahre steht auf der Anhangfolie A6 (anhang-rendite), nicht hier.
// Alle Zahlen aus werte.json (Lauf modellhaus, jr1.*); das Jahr des Kostenstands aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-jahr1',
  bau(ctx) {
    const { B, W, fmt, colX, span, ZONE } = ctx, M = k => W('modellhaus', k), G = R.G;
    // Titel: Die Zahl ist der Zahlungsüberschuss der Gruppe A aus der Mappe (Signaturwort); die Gegenprobe gegen das Konzept macht ctx.titelzeilen
    const ueberschussA = fmt.euro(M('jr1.zahlungsueberschuss.A'));
    const s = ctx.folie(ctx.titelzeilen(['Alle drei Gruppen tragen sich ab Jahr 1,', `in A bleiben ${ueberschussA} Zahlungsüberschuss`], ueberschussA));
    // Annahme der Jahresrechnung: Tilgung 1 ÷ Höchstlaufzeit. Weicht die Mappe davon ab, stimmt der Satz „gleichmäßig über … Jahre“ nicht mehr.
    const laufzeit = M('tab.laufzeit_hoechstens');
    R.pruefe(Math.abs(M('jr1.satz.tilgung_nbank') - 1 / laufzeit) < 1e-9, 'Der Tilgungssatz der Jahresrechnung ist nicht 1 ÷ Höchstlaufzeit; den Satz „Tilgung gleichmäßig über … Jahre“ auf Folie 15 anpassen.');
    // Aussage des Titels: In allen drei Gruppen bleibt in Jahr 1 ein Zahlungsüberschuss; die Zahl im Titel ist die der Gruppe A
    R.pruefe(G.every(g => M(`jr1.zahlungsueberschuss.${g}`) > 0), 'Nicht mehr alle drei Gruppen haben in Jahr 1 einen Zahlungsüberschuss; der Titel der Folie 15 stimmt dann nicht.');
    B.register(s, '2.1');
    const z = k => G.map(g => fmt.zahl(M(`jr1.${k}.${g}`))), satz = k => M('jr1.satz.' + k);
    const miete = G.map(g => fmt.dez(M(`fin.miete_jahr1.${g}`))).join(' | ');
    B.tabellenkopf(s, { titel: 'Jahresrechnung Jahr 1, in € p. a.', sub: `Höchstmiete nettokalt, Mietenstufe ${M('eingabe.mietenstufe')}: ${miete} € je m² und Monat (A | B | C)` });   // die Stufe des Modellhauses, nicht die Klasse IV–VII
    // Seit der Änderungsrunde vom 13.11.2026 steht unter der Tabelle der Hinweiskasten (G8, F15.2); die Tabelle ist dafür niedriger: Zeilen 0,31
    // statt 0,34, Ergebniszeile 0,35 statt 0,38 (12 pt bleibt; so hoch setzt LibreOffice eine Zeile in 12 pt)
    const t = B.rechenblatt(s, { x: colX(1), y: ZONE.tabelle.tabelle, w: span(8), dicht: true, zeilenH: 0.31, ergebnisH: 0.35, name: 'Rechenblatt Jahresrechnung', kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }], zeilen: [
      { nr: 1, text: 'Sollmiete zur Höchstmiete', werte: z('sollmiete') },
      { nr: 2, zeichen: fmt.MINUS, text: `Mietausfall/Leerstand, ${fmt.prozent(satz('mietausfall'))}`, werte: z('mietausfall') },
      { nr: 3, zeichen: fmt.MINUS, text: `Objektverwaltung, ${fmt.euro(satz('objektverwaltung'))} je Wohnung`, werte: z('objektverwaltung') },
      { nr: 4, zeichen: fmt.MINUS, text: `Instandhaltung, ${fmt.euroJeQm(satz('instandhaltung'))}`, werte: z('instandhaltung') },
      { nr: 5, zeichen: '=', text: 'Überschuss vor Kapitaldienst', werte: z('ueberschuss_vor_kapitaldienst'), art: 'summe' },
      { nr: 6, zeichen: fmt.MINUS, text: `Verwaltungskostenbeitrag, ${fmt.prozent(satz('verwaltungskostenbeitrag'), 1)}`, werte: z('verwaltungskostenbeitrag') },
      { nr: 7, zeichen: fmt.MINUS, text: `Zins NBank-Darlehen, ${fmt.prozent(satz('zins_nbank'))}`, werte: z('zins_nbank') },
      { nr: 8, zeichen: fmt.MINUS, text: `Tilgung ${fmt.prozent(satz('tilgung_nbank'), 2)} p. a. (Annahme)`, werte: z('tilgung_nbank') },
      { nr: 9, zeichen: '=', text: 'Zahlungsüberschuss p. a.', werte: z('zahlungsueberschuss'), art: 'ergebnis' }] });
    // Hinweiskasten direkt unter der Tabelle und so breit wie diese (bis 13.11.2026 eine Notiz in 12 pt)
    const h = B.hinweis(s, { x: colX(1), y: t.unten + 0.06, w: span(8), name: 'Bearbeitungsentgelte',
      text: ctx.wortlaut(`Einmalig, außerhalb der Jahresrechnung: Bearbeitungsentgelte ${z('bearbeitungsentgelte').join(' | ')} €`, 'Hinweiskasten') });
    R.pruefe(h.unten <= ctx.Y.inhaltEnde + 0.001, `Folie 15: Der Hinweiskasten endet bei ${h.unten.toFixed(2)} Zoll, unter der Inhaltszone (${ctx.Y.inhaltEnde}).`);
    // Dass die NBank den Tilgungssatz festlegt, steht auf den Folien 12, 20 und 24; hier trägt Zeile 8 der Rechnung den Vermerk „Annahme“.
    // Annahmen als Stichpunkte in 14 pt (G9, F15.3; bis 13.11.2026 drei Sätze in 16 pt)
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [{ titel: ctx.wortlaut('Annahmen', 'Überschrift'), punkte: [
      ctx.wortlaut(`Jahr 1, Kostenstand ${R.kostenstand(ctx)}, vor Steuern`, 'Stichpunkt'),
      // Der Satz der Jahresrechnung ist 1 ÷ Höchstlaufzeit: gleichmäßige Tilgung bis zum Ende der längsten Laufzeit (RL Nr. 5.3.5)
      ctx.wortlaut(`Tilgung gleichmäßig über ${laufzeit} Jahre auf ${G.map(g => fmt.mioZahl(M(`fin.darlehen_nbank.${g}`))).join(' | ')} Mio. € Darlehen`, 'Stichpunkt'),
      ctx.wortlaut('B und C nur mit Zulassung in der Förderentscheidung', 'Stichpunkt')] }] });
  },
};
