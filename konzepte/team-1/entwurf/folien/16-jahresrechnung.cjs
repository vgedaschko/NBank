// Folie 16 · Schlüsselfolie 1 · Jahresrechnung Jahr 1 mit vier Spalten A | B | C | frei (PGN_INHALT_MR, 8 + 4).
// Links das Rechenblatt: Mietzeile als Eingang, Zeilen 1 bis 9 (Ergebniszeile 9 weiß auf Rot), darunter die DSCR-Zeile mit ihrer Formel
// aus den Zeilennummern. Rechts Stichpunkte in 14 pt: wie man liest, was frei finanziert voraussetzt (Miete, Risiko zur Marktmiete), was
// gefördert gilt. Die Mietmarke frei finanziert (Miete für DSCR 1,2 und Marktmiete) steht in den Stichpunkten unter „Frei finanziert“: Für
// einen Hinweiskasten ist unter zwölf Zeilen kein Platz.
// Zahlen: Team-1-Mappe Konzepte!D111:H121 (Block T1), Konzepte-Mappe Konzepte!D62:H62, H49, D14, G61, D57:F57, Eingaben, Tabellen.
'use strict';
const werte = require('./_werte.cjs');

module.exports = {
  id: 'jahresrechnung',
  o: {
    nr: '16', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · JAHRESRECHNUNG',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blatt Konzepte, Zeilen 49 bis 62 und 111 bis 121',
  },
  bau(ctx) {
    const { B, fmt, colX, span, Y } = ctx, { K, T, V } = werte(ctx);

    // ---- Zahlen ---------------------------------------------------------------------------------------------------------------------
    const miete = V.map(v => T(`t1.miete_jahr1.${v}`));                          // Konzepte!D111:H111
    const zeile = k => V.map(v => T(`t1.${k}_jahr1.${v}`));                      // Konzepte!D112:H121 (Abzüge negativ)
    const soll = zeile('sollmiete'), ausfall = zeile('mietausfall'), verw = zeile('objektverwaltung'), inst = zeile('instandhaltung');
    const uevk = zeile('uevk'), vkb = zeile('vkb'), zins = zeile('zins'), tilg = zeile('tilgung'), zue = zeile('zue'), kd = zeile('kapitaldienst');
    const dscr = V.map(v => K(`n5.dscr_jahr1.${v}`));                             // Konzepte!D62:H62
    const marktmiete = K('annahme.marktmiete_jahr1');                             // Eingaben!F25
    const aufschlag = K('n2.aufschlag_marktmiete');                               // Konzepte!D14
    const zueMarkt = K('n5.zue_jahr1.frei_markt');                                // Konzepte!G61, frei zur Marktmiete
    const entgelte = ['A', 'B', 'C'].map(g => K(`n5.bearbeitungsentgelte.${g}`)); // Konzepte!D57:F57
    const satzAusfall = K('annahme.mietausfall'), jeWhg = K('annahme.objektverwaltung_je_wohnung'), jeQm = K('annahme.instandhaltung_je_qm');
    const satzVkb = K('annahme.verwaltungskostenbeitrag'), zinsNbank = K('annahme.zins_nbank_bis_jahr35'), zinsBank = K('annahme.zins_bank');
    const tilgNbank = K('annahme.tilgung_nbank');

    // ---- Aussagen gegen die Zahlen --------------------------------------------------------------------------------------------------
    ctx.pruefe(zue.every(v => v > 0), 'Nicht alle vier haben in Jahr 1 einen Zahlungsüberschuss; der Titel stimmt dann nicht.');
    ctx.pruefe(zue[3] > zue[0], 'Frei finanziert liegt in Jahr 1 nicht mehr vor A; Stichpunkt „frei liegt vorn“ anpassen.');
    ctx.pruefe(zueMarkt < 0, 'Frei zur Marktmiete hat keinen Fehlbetrag mehr; Stichpunkt anpassen.');
    // Gegenproben: Zeile 5 − Kapitaldienst = Zeile 9; DSCR = Zeile 5 ÷ Kapitaldienst (Kapitaldienst = Zeilen 6 + 7 + 8)
    V.forEach((v, i) => {
      ctx.gleich(`Zeile 9 ${v}`, uevk[i] + vkb[i] + zins[i] + tilg[i], zue[i], 2);
      ctx.gleich(`Kapitaldienst ${v}`, vkb[i] + zins[i] + tilg[i], kd[i], 2);
      ctx.gleich(`DSCR ${v}`, uevk[i] / -kd[i], dscr[i], 4);
    });

    const mieteFrei = fmt.euroDez(miete[3]);
    const s = ctx.folie(ctx.titelzeilen(['Alle vier tragen sich in Jahr 1,', `frei finanziert nur mit ${mieteFrei} Miete`], mieteFrei));
    B.register(s, '2.1');

    // ---- Links, acht Spalten: Modulkopf und Rechenblatt ------------------------------------------------------------------------------
    const WL = span(8), y0 = Y.inhalt;
    const yT = B.modulkopf(s, { x: colX(1), y: y0, w: WL, titel: 'Jahresrechnung Jahr 1, in € p. a.' });
    const betrag = arr => arr.map(v => fmt.zahl(Math.abs(v)));   // Abzüge als Betrag, das Rechenzeichen steht in der Zeichenspalte
    const t = B.rechenblatt(s, { x: colX(1), y: yT + 0.02, w: WL, dicht: true, zeilenH: 0.30, ergebnisH: 0.34, wertBreite: [0.95, 0.95, 0.95, 1.05],
      name: 'Rechenblatt Jahresrechnung vier Spalten',
      kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }, 'Frei'],
      zeilen: [
        { text: 'Miete in € je m² und Monat', werte: miete.map(v => fmt.dez(v)) },
        { nr: 1, text: 'Sollmiete', werte: betrag(soll) },
        { nr: 2, zeichen: fmt.MINUS, text: `Mietausfall/Leerstand, ${fmt.prozent(satzAusfall)}`, werte: betrag(ausfall) },
        { nr: 3, zeichen: fmt.MINUS, text: `Objektverwaltung, ${fmt.euro(jeWhg)} je Wohnung`, werte: betrag(verw) },
        { nr: 4, zeichen: fmt.MINUS, text: `Instandhaltung, ${fmt.euroJeQm(jeQm)}`, werte: betrag(inst) },
        { nr: 5, zeichen: '=', text: 'Überschuss vor Kapitaldienst', werte: betrag(uevk), art: 'summe' },
        { nr: 6, zeichen: fmt.MINUS, text: `Verwaltungskostenbeitrag, ${fmt.prozent(satzVkb, 1)}`, werte: betrag(vkb) },
        { nr: 7, zeichen: fmt.MINUS, text: `Zins: NBank ${fmt.prozent(zinsNbank)}, Bank ${fmt.prozent(zinsBank, 2)}`, werte: betrag(zins) },
        { nr: 8, zeichen: fmt.MINUS, text: `Tilgung: NBank ${fmt.prozent(tilgNbank, 2)} p. a.`, werte: betrag(tilg) },
        { nr: 9, zeichen: '=', text: 'Zahlungsüberschuss p. a.', werte: betrag(zue), art: 'ergebnis' },
        { text: 'DSCR = Zeile 5 ÷ (6 + 7 + 8)', werte: dscr.map(v => fmt.dez(v)) },
      ] });
    ctx.pruefe(t.unten <= Y.inhaltEnde + 0.001, `Das Rechenblatt endet bei ${t.unten.toFixed(2)} Zoll, unter der Inhaltszone.`);

    // ---- Rechts, vier Spalten: Stichpunkte ------------------------------------------------------------------------------------------
    B.stichpunkte(s, { x: colX(9), y: y0, w: span(4), linie: true, titelAbstand: 8, gruppen: [
      { titel: 'So lesen', punkte: [
        'Zeile 5 trägt den Kapitaldienst',
        'Zeile 8 tilgt die Schuld und baut Vermögen auf',
        'Zeile 9 geht auf das Projektkonto'] },
      { titel: 'Frei finanziert', punkte: [
        `Bank verlangt DSCR 1,2: Miete ${mieteFrei}, ${fmt.prozent(aufschlag, 1)} über der Marktmiete`,
        `zur Marktmiete ${fmt.euroDez(marktmiete)}: Fehlbetrag ${fmt.euro(Math.abs(zueMarkt))} in Jahr 1`] },
      { titel: 'Gefördert', punkte: [
        `einmalig Bearbeitungsentgelte\n${entgelte.map(v => fmt.zahl(v)).join(' | ')} €`] },
    ] });
  },
};
