// Folie 24 · Zusammenfassung der Rechnung (PGN_KENNZAHLEN_MR): drei Kennzahlen des Modellhauses mit ihrer Bedingung, darunter über zwölf
// Spalten die drei Größen, von denen das Ergebnis abhängt. Diese drei Größen nennt der Folientitel; der Block darunter trägt deshalb
// nur die Modulkopf-Linie und keinen eigenen Titel, der den Folientitel wiederholt. Papierton, Daumenregister 2.1. Kein Diagramm, kein wertender Satz.
// Alle Zahlen aus werte.json, Lauf modellhaus; jeder Text wird gegen den Wortlaut des Konzepts geprüft. Die Kacheltexte brechen am Satzanfang
// („Bindung …“, „Höchstmiete …“), damit Bezeichnung und Wert in einer Zeile stehen.
'use strict';

module.exports = {
  id: 'fazit',
  bau(ctx) {
    const { B, W, P, fmt, colX, span, ZONE, Raster } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');

    // Kachel 1: Förderung. „je … Darlehen und Zuschuss“ gilt nur, solange beide gleich hoch sind
    if (M('fin.darlehen_nbank.A') !== M('fin.zuschuss.A')) P.melde('Kachel 1: Darlehen und Zuschuss sind in Gruppe A nicht gleich hoch; der Satz „je … Darlehen und Zuschuss“ stimmt dann nicht.');
    wl(fmt.mio(M('fin.foerderung.A')), 'Kachel 1');
    B.kennzahlFeld(s, 0, { vorsatz: wl('bis zu'), zahl: fmt.mioZahl(M('fin.foerderung.A')), einheit: 'Mio. €', label: wl('Förderung'),
      text: wl(`${fmt.prozent(M('fin.foerderquote.A'))} von ${fmt.mio(M('fin.gesamtkosten.A'))}: je ${fmt.mio(M('fin.zuschuss.A'))} Darlehen und Zuschuss.\nBindung ${M('tab.bindung')} Jahre.`, 'Kachel 1') });

    // Kachel 2: Kapitaldienst in Jahr 1, gefördert gegen frei finanziert
    wl(fmt.euro(M('dscr.kapitaldienst_jahr1.A')), 'Kachel 2');
    B.kennzahlFeld(s, 1, { vorsatz: wl('Kapitaldienst in Jahr 1'), zahl: fmt.zahl(M('dscr.kapitaldienst_jahr1.A')), einheit: '€', label: wl('gefördert, Gruppe A'),
      text: wl(`Frei finanziert: ${fmt.euro(M('dscr.kapitaldienst_jahr1.Frei'))}.`, 'Kachel 2') });

    // Kachel 3: nötige Miete in Jahr 1 (Miete je m² und Monat, bei der der Zahlungsüberschuss null ist) gegen die Höchstmiete
    B.kennzahlFeld(s, 2, { vorsatz: wl('Nötige Miete in Jahr 1'), zahl: wl(fmt.dez(M('dscr.noetige_miete.A')), 'Kachel 3'), einheit: wl('€ je m²', 'Kachel 3'), label: wl('gefördert, Gruppe A'),
      text: wl(`Frei finanziert: ${fmt.euroDez(M('dscr.noetige_miete.Frei'))}.\nHöchstmiete: ${fmt.euroDez(M('fin.miete_jahr1.A'))}.`, 'Kachel 3') });

    // Planlegende über zwölf Spalten: Modulkopf-Linie und drei Einträge im Raster 4 + 4 + 4
    const y = B.modulkopf(s, { x: colX(1), y: ZONE.kennzahlen.darunter, w: Raster.CW });
    // Tilgungssatz: Annahme der Rechnung und die Sätze, bei denen der Zahlungsüberschuss in Jahr 1 null ist (Übersicht 3.8): zuerst in C, zuletzt in A
    const nullA = M('liq.breakeven_tilgung.A'), nullB = M('liq.breakeven_tilgung.B'), nullC = M('liq.breakeven_tilgung.C');
    if (!(M('eingabe.tilgung_nbank') < nullC && nullC < nullB && nullB < nullA)) P.melde('Die Tilgungssätze, bei denen der Zahlungsüberschuss null wird, liegen nicht mehr in der Reihenfolge C, B, A über der Annahme; Eintrag „Tilgungssatz“ der Folie 24 anpassen.');
    [['Tilgungssatz', `Annahme ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)} p. a., null in C bei ${fmt.prozent(nullC, 2)}, in A bei ${fmt.prozent(nullA, 2)}. Den Satz legt die NBank fest.`],
      ['Herstellungskosten je m²', `Zuwendungsfähig bis zur Bemessungsgrenze, seit ${ctx.X('regeln', 'bemessungsgrenze.gilt_seit')} ${fmt.zahl(M('fin.bemessungsgrenze_qm'))} € in Mietenstufe IV–VII.`],
      // Der Betrag der Höchstmiete steht einmal, in Kachel 3 direkt darüber
      ['Höchstmiete', 'Nach Einkommensgruppe und Mietenstufe.']].forEach(([titel, text], i) =>
      B.planlegende(s, { x: colX(1 + 4 * i), y, w: span(4), pt: 14, eintraege: [{ titel: wl(titel, 'Planlegende'), text: wl(text, 'Planlegende') }], name: 'Planlegende ' + titel }));   // ohne h: Die Höhe folgt dem Text
  },
};
