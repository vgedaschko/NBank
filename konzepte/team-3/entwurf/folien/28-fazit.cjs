// Fazit-Folie · Folie 28 (vor der Schlussfolie Kontakt) · PGN_INHALT (weißer Grund: blickt über die Modellrechnung hinaus).
// Oben eine Achsleiste mit den vier Abschnitten des Vortrags (Achskreise 1 bis 4 wie Agenda und Trenner), je Station ein fetter Kernsatz und
// drei kurze Zeilen. Darunter ein symmetrischer Vergleich der Bedingungen: dieselben drei Merkmale (Miete, Mietanpassung, Finanzierung) für
// gefördert und frei finanziert, in derselben Reihenfolge. Dort steht auch, warum frei finanziert bei der Rendite vorn liegt.
// Zahlen: konzepte/mappe/werte_konzepte.json (Eingaben, Tabellen, Konzepte) und team-3/mappe/werte_team.json (Team 3 Vergleich D55:D62).
// Ohne Mappenzahl: Umsetzung (Bewilligung vor Vorhabenbeginn, Leistungsphase 6 nach HOAI; heutige Folien 26 und 27).
'use strict';
const H = require('./_hilfen.cjs');

module.exports = {
  id: 'fazit',
  o: {
    nr: '28', abschnitt: 'Umsetzung', layout: 'PGN_INHALT', kicker: 'UMSETZUNG · FAZIT',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken; Team 3 Vergleich D55:D62, Konzepte D12:H81, Eingaben, Tabellen.',
  },
  bau(ctx) {
    const { B, fmt, colX, span, Y, wert } = ctx, T = H.TEAM, N = H.namen(ctx), V = H.V;
    const iD = V.indexOf('frei_dscr'), iM = V.indexOf('frei_markt');
    const hoechst = H.drei(ctx, 'annahme.hoechstmiete_VI'), fehl = H.fuenf(ctx, 'n5.jahre_fehlbetrag_1_35'), zur = H.fuenf(ctx, 'n5.jahr_ek_erreicht');
    const rendite = H.fuenf(ctx, 'n5.ek_vofi_mit_restwert');
    ctx.pruefe(fehl.slice(0, 3).every(f => f === 0), 'Gefördert gibt es ein Jahr mit Fehlbetrag; Station 3 anpassen.');
    ctx.pruefe(rendite[iD] > Math.max(...rendite.slice(0, 3)) && rendite[iM] > Math.max(...rendite.slice(0, 3)), 'Frei liegt bei der Rendite nicht mehr vorn; Text anpassen.');

    const m0 = fmt.euroDez(hoechst[0]);
    const s = ctx.folie({ ...ctx.titelzeilen([`Gefördert trägt sich das Haus mit ${m0},`, `frei finanziert verlangt die Bank ${N.dscr}`], m0) });

    const pz = (a, nk = 0) => fmt.prozent(a, nk), g = H.drei;
    const gMin = Math.min(...zur.slice(0, 3)), gMax = Math.max(...zur.slice(0, 3));
    const rG = rendite.slice(0, 3), rF = [rendite[iM], rendite[iD]];
    const stationen = [
      { titel: 'Teurer als 2020', text: [
        `Herstellungskosten +${pz(wert('t3.fazit.hk_anstieg', T), 1)}.`,
        `Zins von ${pz(wert('t3.fazit.zins_2020', T), 2)} auf ${pz(wert('t3.fazit.zins_heute', T), 2)}.`,
        `Kapitaldienst von ${fmt.dez(wert('t3.fazit.kd_qm_2020', T))} auf ${fmt.euroDez(wert('t3.fazit.kd_qm_heute', T))} je m² und Monat.`].join('\n') },
      { titel: `${pz(wert('t3.fazit.foerderquote', T))} Förderung`, text: [
        `Bis zu ${pz(wert('annahme.quote_zuschuss.A'))} Zuschuss.`,
        `Darlehen ${wert('annahme.zinsfreie_jahre')} Jahre zinsfrei.`,
        `Höchstmiete ${fmt.euroDez(Math.min(...hoechst))} bis ${fmt.euroDez(Math.max(...hoechst))}.`].join('\n') },
      { titel: 'Ein Haus, vier Varianten', text: [
        'Kein Fehlbetrag in A, B, C.',
        `Eigenkapital nach ${gMin} bis ${gMax} Jahren zurück.`].join('\n') },
      { titel: 'Erst die Bewilligung', text: [
        'Dann Verträge und Baubeginn.',
        'Vorher planen bis Leistungsphase 6.',
        'PGN plant und begleitet.'].join('\n') },
    ];
    const leiste = B.achsleiste(s, { x: colX(1), y: +(Y.inhalt + 0.20).toFixed(3), w: ctx.Raster.CW, groesse: 'M', dicht: true, stationen: stationen.map((st, i) => ({ nr: i + 1, ...st })) });

    // Vergleich der Bedingungen: gleiche Merkmale, gleiche Reihenfolge, gefördert vor frei finanziert. Ohne Mietanpassung: gefördert Lauf
    // mietanpassung_gefoerdert_0 (Tabellen T20 = 0), frei Lauf mietsteigerung_0 (Eingaben E26 = 0), je Konzepte Zeile 81
    const ohneG = H.GEF.map(v => wert(`n6.mietanpassung_gefoerdert_0.ek_vofi_mit_restwert.${v}`));
    const ohneF = ['frei_markt', 'frei_dscr'].map(v => wert(`n6.mietsteigerung_0.ek_vofi_mit_restwert.${v}`));
    const spanne = a => `${fmt.prozent(Math.min(...a), 2)} bis ${fmt.prozent(Math.max(...a), 2)}`;
    const yK = +(leiste.unten + 0.18).toFixed(3);
    const yT = B.modulkopf(s, { x: colX(1), y: yK, w: ctx.Raster.CW, titel: 'Unter diesen Annahmen', rechts: 'Rechenbeispiel, keine Förderzusage' });
    const t = B.tabelle(s, { x: colX(1), y: +(yT - 0.02).toFixed(3), w: ctx.Raster.CW, pt: 12, zellrand: [0.04, 0.03], name: 'Tabelle Bedingungen',
      spalten: [{ kopf: 'Merkmal', breite: 3.1, art: 'stichwort' }, { kopf: 'Gefördert, Gruppe A bis C', breite: 3.4, art: 'text' }, { kopf: 'Frei finanziert', art: 'text' }],
      zeilen: [
        ['Miete Jahr 1', `Höchstmiete ${H.balken(hoechst, fmt.dez)} € je m²`, `${N.dscr} für DSCR ${fmt.dez(wert('n1.dscr_ziel_bank_frei'), 1)} (Annahme der PGN), Marktmiete ${N.markt}`],
        ['Mietanpassung', `alle ${wert('annahme.abstand_mieterhoehungen')} Jahre +${pz(wert('annahme.mieterhoehung_in_der_bindung'), 2)} (Höchstwert)`, `jedes Jahr +${pz(wert('annahme.mietsteigerung'))} (Annahme der PGN)`],
        ['Eigenkapitalrendite mit Restwert', spanne(rG), `${spanne(rF)} (Marktmiete bis Miete für DSCR ${fmt.dez(wert('n1.dscr_ziel_bank_frei'), 1)})`],
        ['dieselbe ohne Mietanpassung', spanne(ohneG), spanne(ohneF)],
      ] });
    ctx.pruefe(t.unten <= Y.inhaltEnde, `Fazit: Tabelle endet bei ${t.unten.toFixed(2)}.`);
  },
};
