// Entwurf Folie 29 · Fazit vor der Schlussfolie (PGN_INHALT, weißer Grund: blickt über alle Abschnitte).
// Oben die Achse der Agenda (Folie 7) mit den vier Achskreisen 1 bis 4 im Abstand von drei Rasterspalten, von jedem Kreis eine Achslinie nach unten;
// rechts daneben je Abschnitt Name (Modultitel 16 pt) und drei Stichpunkte in 14 pt, jeder mit einer Zahl. Unten über zwölf Spalten die
// Ergebniszeile weiß auf Rot: gefördert und frei finanziert mit derselben Frage (trägt sich das Haus, unter welcher Miete).
// Abschnitt 3 nennt A und frei finanziert mit denselben Merkmalen in derselben Reihenfolge (Eigenkapital zurück, Eigenkapitalrendite).
'use strict';

module.exports = {
  id: 'fazit',
  o: {
    nr: '29', abschnitt: 'Umsetzung', layout: 'PGN_INHALT', kicker: 'UMSETZUNG · FAZIT',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Eingaben, Tabellen, Übersicht, Konzepte; Team 2 C49, G49.',
  },
  bau(ctx) {
    const { B, fmt, colX, span, Raster, Y, C, wert } = ctx;
    const K = k => wert(`konzepte:${k}`), T = k => wert(`team2:${k}`);

    // ---- Zahlen -------------------------------------------------------------------------------------------------------------------------
    const zins = K('annahme.zins_bank'), bindung = K('annahme.zinsbindung');               // Eingaben!F35, F36
    const kdam = T('kdam.frei_markt'), markt = K('annahme.marktmiete_jahr1');              // Übersicht!G112, Eingaben!F25
    const zuA = K('annahme.quote_zuschuss.A'), daA = K('annahme.quote_darlehen.A');       // Tabellen!D6, D5
    const jahre0 = K('annahme.zinsfreie_jahre'), zins0 = K('annahme.zins_nbank_bis_jahr35'), hmA = K('annahme.hoechstmiete_VI.A');   // Tabellen!D20, D19, D14
    const ek = ['A', 'B', 'C', 'frei_dscr'].map(v => K(`n5.eigenkapital.${v}`));        // Konzepte!D56:F56, H56
    const zurueck = { A: T('t2.jahr_frei.A'), frei: T('t2.jahr_frei.frei_dscr') };         // Team 2!C49, G49
    ctx.gleich('Eigenkapital zurück A, T2 gegen Konzepte!D67', zurueck.A, K('n5.jahr_ek_erreicht.A'), 0);
    ctx.gleich('Eigenkapital zurück frei, T2 gegen Konzepte!H67', zurueck.frei, K('n5.jahr_ek_erreicht.frei_dscr'), 0);
    const ekr = { A: K('n5.ek_vofi_mit_restwert.A'), frei: K('n5.ek_vofi_mit_restwert.frei_dscr') };   // Konzepte!D81, H81
    const tragbar = K('kern.tragbare_tilgung.A');                                         // Übersicht!D49, Zahlungsüberschuss Jahr 1 in A = 0
    const tilgung = K('annahme.tilgung_nbank');                                           // Eingaben!F17
    const entgeltA = K('n5.bearbeitungsentgelte.A');                                      // Konzepte!D57
    const mieteFrei = K('n2.miete_dscr'), aufschlag = K('n2.aufschlag_marktmiete');       // Konzepte!D12, D14
    const fehl = ['A', 'B', 'C'].map(g => K(`n5.jahre_fehlbetrag_1_35.${g}`));          // Konzepte!D68:F68
    const zueMin = ['A', 'B', 'C'].map(g => K(`n5.zue_min_1_35.${g}`));                  // Konzepte!D65:F65
    // Aussagen gegen die Mappe
    ctx.pruefe(fehl.every(n => n === 0) && zueMin.every(x => x > 0), 'Gefördert gibt es ein Jahr ohne Zahlungsüberschuss; Titel und Ergebniszeile stimmen nicht.');
    ctx.pruefe(new Set(ek.map(x => fmt.mio(x, 1))).size === 1, 'Das Eigenkapital ist nicht in allen Varianten rund gleich.');
    ctx.pruefe(tilgung < tragbar, 'Die Tilgung der Rechnung liegt über der tragbaren Tilgung in A.');
    ctx.pruefe(mieteFrei > markt, 'Die Miete frei finanziert liegt nicht über der Marktmiete.');
    // „bis 3,64 %“: tragbare Tilgung abgerundet auf zwei Nachkommastellen (3,6466 % → 3,64 %), damit die Zahl auf der sicheren Seite liegt
    const tragbarText = fmt.prozentWert(Math.floor(tragbar * 10000) / 100, 2);

    const s = ctx.folie({ titel: ['Gefördert trägt sich das Haus ab Jahr 1,', 'frei finanziert nur über der Marktmiete'], akzent: 'ab Jahr 1' });
    B.register(s, '2.1');

    const abschnitte = [
      { nr: '1', name: 'Ausgangslage', punkte: [
        `${fmt.prozent(zins, 2)} Zins bei ${bindung} Jahren Zinsbindung`,
        `kostendeckende Anfangsmiete frei finanziert: ${fmt.euroDez(kdam)} je m²`,
        `Marktmiete: ${fmt.euroDez(markt)} je m²`] },
      { nr: '2', name: 'Programmteil 2.1', punkte: [
        `in A ${fmt.prozent(zuA)} Zuschuss und ${fmt.prozent(daA)} Darlehen`,
        `Darlehen ${jahre0} Jahre zu ${fmt.prozent(zins0)} Zins`,
        `Höchstmiete in A: ${fmt.euroDez(hmA)} je m²`] },
      { nr: '3', name: 'Modellrechnung', punkte: [
        `${fmt.mio(ek[0], 1)} Eigenkapital in jeder Variante`,
        `A: zurück in Jahr ${zurueck.A}, Eigenkapitalrendite ${fmt.prozent(ekr.A, 2)}`,
        `frei: zurück in Jahr ${zurueck.frei}, Eigenkapitalrendite ${fmt.prozent(ekr.frei, 2)}`] },
      { nr: '4', name: 'Umsetzung', punkte: [
        `Tilgungssatz mit der NBank klären: A trägt bis ${tragbarText}`,
        `Bearbeitungsentgelte in A: ${fmt.euro(entgeltA)} einmalig`,
        'bis Leistungsphase 6 planen, Verträge erst nach der Bewilligung'] }];

    // ---- Achse wie auf der Agenda: Achskreise G im Abstand von drei Spalten. Abweichung von Folie 7: Die Stichpunkte stehen unter dem Kreis über
    // die ganzen drei Spalten (2,82 Zoll statt 2,17 bis 2,76 Zoll rechts der Achslinie), alle vier Felder sind gleich breit; ohne Achslinien
    const d = 0.72, y0 = Y.inhalt - 0.04, yAchse = y0 + d / 2;
    const hE = 0.80, yE = +(Y.inhaltEnde - hE).toFixed(3), yText = +(y0 + d + 0.16).toFixed(3), untenText = yE - 0.14;
    B.linie(s, { x: colX(1), y: yAchse, w: Raster.CW, art: 'kraeftig', name: 'Achse der Abschnitte' });
    abschnitte.forEach((a, i) => {
      const x = colX(1 + 3 * i);
      B.achskreis(s, { cx: x + d / 2, cy: yAchse, groesse: 'G', d, pt: 28, text: a.nr, name: 'Achskreis ' + a.nr });
      B.stichpunkte(s, { x, y: yText, w: span(3), h: +(untenText - yText).toFixed(3), titelAbstand: 4, punktAbstand: 4,
        gruppen: [{ titel: a.name, punkte: a.punkte }], name: 'Stichpunkte ' + a.name });
    });

    // ---- Ergebniszeile über zwölf Spalten, weiß auf Rot --------------------------------------------------------------------------------
    B.kasten(s, { x: colX(1), y: yE, w: Raster.CW, h: hE, farbe: C.rot, name: 'Ergebniszeile Fläche' });
    const ergebnis = `Gefördert: in A, B und C ab Jahr 1 ein Zahlungsüberschuss, kein Jahr mit Fehlbetrag.\n`
      + `Frei finanziert: nur mit ${fmt.euroDez(mieteFrei)} Miete, ${fmt.prozent(aufschlag, 1)} über dem Markt.`;
    B.text(s, ergebnis, { x: colX(1) + 0.20, y: yE, w: Raster.CW - 0.40, h: hE, rolle: 'kennlabel', farbe: 'FFFFFF', valign: 'middle', name: 'Ergebniszeile Text' });
  },
};
