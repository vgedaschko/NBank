// Entwurf Folie 16 · Schlüsselfolie „Miete für DSCR 1,2“ (PGN_INHALT_MR, Raster 6 + 6: Der Rechenweg mit zwei Wertspalten braucht sechs Spalten).
// Links: gruppiertes Balkendiagramm je Variante (A, B, C, frei finanziert) mit zwei Reihen: die Miete, bei der die DSCR in Jahr 1 genau 1,2 ist
// (Tinte), und die Miete, die das Haus erzielen darf oder kann (Höchstmiete gefördert, Marktmiete frei finanziert; hell, beschriftet).
// Wo der Tintenbalken länger ist, reicht die Miete nicht für 1,2 (C knapp, frei finanziert deutlich). Darunter der Hinweiskasten: wofür die
// 1,2 gilt und was die NBank stattdessen prüft. Rechts: Rechenweg der Miete frei finanziert als Formel mit DSCR 1,0 (kostendeckende
// Anfangsmiete) und DSCR 1,2 nebeneinander, darunter die Stichpunkte „Ergebnis“.
// Abweichung vom Konzept (KONZEPT.md, Änderungen der Gestaltung): Reihe „kostendeckend, DSCR 1,0“ und Marken der Höchstmiete entfallen im
// Diagramm; die Höchst- und Marktmiete ist eine eigene Reihe, die kostendeckende Anfangsmiete steht im Rechenweg.
'use strict';
const { V, NAME } = require('./_hilfen.cjs');

module.exports = {
  id: 'miete-dscr',
  o: {
    nr: '16', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', kicker: 'MODELLRECHNUNG · MIETE FÜR DSCR 1,2',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blatt Konzepte D6, D10:D14, D19:F23, D50:F50; Übersicht G112; Frei DSCR 1,2 E7.',
  },
  bau(ctx) {
    const { B, D, fmt, colX, span, ZONE, Y, wert } = ctx;

    // ---- Zahlen -------------------------------------------------------------------------------------------------------------------------
    const ziel = wert('konzepte:n1.dscr_ziel_bank_frei');                       // Konzepte!D6, 1,2 (neue Annahme der PGN)
    const noetig = V.map(v => wert(`konzepte:n5.miete_dscr_ziel.${v}`));       // Konzepte!D50:F50, H50
    const hoechst = ['A', 'B', 'C'].map(g => wert(`konzepte:n3.hoechstmiete.${g}`));   // Konzepte!D19:F19
    const markt = wert('konzepte:n2.marktmiete_jahr1');                         // Konzepte!D13
    const grenze = [...hoechst, markt];
    const mieteFrei = wert('konzepte:n2.miete_dscr');                           // Konzepte!D12
    ctx.gleich('Miete frei finanziert, D12 gegen H50', mieteFrei, noetig[3], 6);
    const dscr1 = ['A', 'B', 'C'].map(g => wert(`konzepte:n3.dscr_jahr1.${g}`));      // Konzepte!D21:F21
    const erreicht = ['A', 'B', 'C'].map(g => wert(`konzepte:n3.dscr_ziel_erreicht.${g}`));   // Konzepte!D24:F24
    const abstandC = wert('konzepte:n3.abstand_hoechstmiete.C');                // Konzepte!F23 (negativ: Höchstmiete unter der Miete für 1,2)
    const jahreC = wert('konzepte:n3.jahre_dscr_unter_ziel.C');                 // Konzepte!F26
    const zrC = wert('konzepte:zr.dscr.C');                                     // Konzepte Zeitreihe Z7:Z48
    const aufschlag = wert('konzepte:n2.aufschlag_marktmiete');                 // Konzepte!D14
    // Aussagen der Stichpunkte gegen die Mappe
    ctx.pruefe(erreicht[0] === 'ja' && erreicht[1] === 'ja' && erreicht[2] === 'nein', 'Stichpunkt „A und B erreichen 1,2, C nicht“ stimmt nicht mehr.');
    ctx.pruefe(hoechst[0] > noetig[0] && hoechst[1] > noetig[1] && hoechst[2] < noetig[2] && markt < noetig[3], 'Reihenfolge Höchstmiete gegen Miete für 1,2 hat sich geändert.');
    ctx.pruefe(zrC.slice(0, jahreC).every(x => x < ziel) && zrC[jahreC] >= ziel, `C liegt nicht genau in Jahr 1 bis ${jahreC} unter 1,2.`);
    ctx.gleich('Abstand C = Höchstmiete − Miete für 1,2', hoechst[2] - noetig[2], abstandC, 6);
    ctx.gleich('Aufschlag = Miete frei ÷ Marktmiete − 1', mieteFrei / markt - 1, aufschlag, 6);

    // Rechenweg frei finanziert, Jahr 1: Spalte DSCR 1,0 (kostendeckende Anfangsmiete) und DSCR 1,2 (Miete der Rechnung)
    const kd = wert('konzepte:n2.kapitaldienst_bank_jahr1');                    // Konzepte!D10
    const eins = wert('konzepte:annahme.dscr_ziel_mappe');                      // Eingaben!F54, DSCR-Ziel der Mappe 1,0 (kostendeckend)
    const uevk12 = wert('konzepte:n5.uevk_jahr1.frei_dscr');                    // Konzepte!H59
    const bew = wert('konzepte:n2.bewirtschaftung_jahr1');                      // Konzepte!D11, Objektverwaltung + Instandhaltung
    const ausfall = wert('konzepte:annahme.mietausfall');                       // Eingaben!F29
    const soll12 = wert('team2:jr1.frei_dscr.sollmiete');                       // Frei DSCR 1,2!E7
    const flaeche = wert('konzepte:annahme.wohnflaeche');                       // Eingaben!F8
    const kdam = wert('team2:kdam.frei_markt');                                 // Übersicht!G112, kostendeckende Anfangsmiete frei finanziert
    // gerechnete Größen (Formeln wie Konzepte!D12): Überschuss vor Kapitaldienst = Kapitaldienst × DSCR; Sollmiete = (Überschuss + Bewirtschaftung) ÷ (1 − Mietausfall)
    const uevk10 = kd * eins, soll10 = (uevk10 + bew) / (1 - ausfall);
    ctx.gleich('Überschuss vor Kapitaldienst für 1,2 = Kapitaldienst × 1,2', kd * ziel, uevk12, 4);
    ctx.gleich('Sollmiete für 1,2 = (Überschuss + Bewirtschaftung) ÷ 98 %', (uevk12 + bew) / (1 - ausfall), soll12, 4);
    ctx.gleich('Miete für 1,2 = Sollmiete ÷ m² ÷ 12', soll12 / flaeche / 12, mieteFrei, 6);
    ctx.gleich('kostendeckende Anfangsmiete = Sollmiete DSCR 1,0 ÷ m² ÷ 12', soll10 / flaeche / 12, kdam, 6);

    const s = ctx.folie(ctx.titelzeilen([`Für DSCR ${fmt.dez(ziel, 1)} braucht frei finanziert`, `${fmt.euroDez(mieteFrei)} Miete, der Markt zahlt ${fmt.euroDez(markt)}`], fmt.euroDez(mieteFrei)));
    B.register(s, '2.1');

    // ---- Links: Diagramm über sechs Spalten ------------------------------------------------------------------------------------------
    const WL = span(6), yKopf = ZONE.diagramm.kopf;
    B.modulkopf(s, { x: colX(1), y: yKopf, w: WL, titel: 'Miete in Jahr 1 je Variante', sub: 'was die Bank für DSCR 1,2 verlangt und was das Haus erzielt' });
    const reihe1 = `Miete für DSCR ${fmt.dez(ziel, 1)}`, reihe2 = 'Höchstmiete, frei finanziert: Marktmiete';
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende + 0.06, eintraege: [{ text: reihe1, art: 'tinte' }, { text: reihe2, art: 'bisher' }] });
    const hinweis = 'Die 1,2 gilt für das Bankdarlehen frei finanziert, Annahme der PGN. Gefördert gibt es kein Bankdarlehen, dort ist 1,2 ein Vergleich. '
      + 'Die NBank prüft Eigenmittel, Tilgungssatz und angemessenen Gewinn.';
    const hH = B.hinweisHoehe(hinweis, { w: WL }), yChart = ZONE.diagramm.chart.y + 0.04;
    const d = D.gruppierteBalken(s, { x: colX(1), y: yChart, w: WL, h: +(Y.inhaltEnde - hH - 0.12 - yChart).toFixed(3), name: 'Diagramm Miete für DSCR 1,2',
      kategorien: V.map(v => NAME[v]), katBreite: 1.30, luecke: 45, rand: { u: 0.50, r: 0.30 },
      reihen: [{ name: reihe1, art: 'tinte', werte: noetig }, { name: reihe2, art: 'bisher', werte: grenze }],
      achse: { min: 0, max: 21, schritt: 3, format: 'roh' }, labelFormat: 'zwei',
      altText: `Balkendiagramm: Miete in Jahr 1 in € je m². Miete für DSCR 1,2: ${V.map((v, i) => `${NAME[v]} ${fmt.euroDez(noetig[i])}`).join(', ')}. `
        + `Höchstmiete bzw. Marktmiete: ${V.map((v, i) => `${NAME[v]} ${fmt.euroDez(grenze[i])}`).join(', ')}.` });
    B.achsentitel(s, d, { x: 'Miete in € je m² und Monat' });
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: WL, name: 'DSCR', text: hinweis });

    // ---- Rechts: Rechenweg und Ergebnis über sechs Spalten -----------------------------------------------------------------------------
    const xR = colX(7), WR = span(6);
    const yTab = B.modulkopf(s, { x: xR, y: yKopf, w: WR, titel: 'Rechenweg frei finanziert, Jahr 1', sub: 'DSCR 1,0 ergibt die kostendeckende Anfangsmiete' });
    const t = B.rechenblatt(s, { x: xR, y: yTab + 0.02, w: WR, dicht: true, wertBreite: 1.02, name: 'Rechenweg Miete',
      kopf: ['Position', `DSCR ${fmt.dez(eins, 1)}`, `DSCR ${fmt.dez(ziel, 1)}`],
      zeilen: [
        { nr: 1, text: 'Kapitaldienst Bankdarlehen', werte: [fmt.euro(kd), fmt.euro(kd)] },
        { nr: 2, zeichen: '×', text: 'DSCR: Überschuss vor Kapitaldienst', werte: [fmt.euro(uevk10), fmt.euro(uevk12)] },
        { nr: 3, zeichen: '+', text: 'Bewirtschaftung', werte: [fmt.euro(bew), fmt.euro(bew)] },
        { nr: 4, zeichen: '÷', text: `${fmt.prozent(1 - ausfall)} nach Mietausfall = Sollmiete`, werte: [fmt.euro(soll10), fmt.euro(soll12)] },
        { nr: 5, zeichen: '÷', text: `${fmt.qm(flaeche)} ÷ 12 Monate = Miete je m²`, werte: [fmt.euroDez(kdam), fmt.euroDez(mieteFrei)], art: 'ergebnis' }] });
    B.stichpunkte(s, { x: xR, y: +(t.unten + 0.22).toFixed(3), w: WR, linie: true, punktAbstand: 2, gruppen: [{ titel: 'Ergebnis', punkte: [
      `A und B erreichen ${fmt.dez(ziel, 1)} mit der Höchstmiete`,
      `C fehlen ${fmt.euroDez(Math.abs(abstandC))} je m², DSCR ${fmt.dez(dscr1[2])} in Jahr 1 bis ${jahreC}`,
      `frei finanziert: ${fmt.prozent(aufschlag, 1)} mehr Miete als am Markt`] }] });
  },
};
