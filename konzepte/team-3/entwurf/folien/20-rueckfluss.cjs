// Schlüsselfolie 2 · Folie 20 · PGN_DIAGRAMM_MR: Rückfluss des eingesetzten Eigenkapitals, Jahr 0 bis 35, für alle fünf Positionen des
// Vergleichsrasters. Größe: kumulierter Zahlungsüberschuss in % des eingesetzten Eigenkapitals (unverzinst, vor Steuern, ohne Restwert).
// Marke 100 %: Eigenkapital zurück; Punkte an den Schnitten, Jahre daneben. Gefördert in Tinte (drei Stricharten), frei in Referenzgrau
// (18,36 € voll, 15,42 € gestrichelt). Kein Rot im Diagramm.
// Zahlen: team-3/mappe/werte_team.json (Team 3 Vergleich D66:H101, D47:H51), konzepte/mappe/werte_konzepte.json (Konzepte D56:H67).
'use strict';
const H = require('./_hilfen.cjs');

module.exports = {
  id: 'rueckfluss',
  o: {
    nr: '20', abschnitt: 'Modellrechnung', layout: 'PGN_DIAGRAMM_MR', kicker: 'MODELLRECHNUNG · EIGENKAPITAL',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken; Team 3 Vergleich D47:H101, Konzepte D56:H67.',
  },
  bau(ctx) {
    const { B, D, fmt, Y, ZONE } = ctx, T = H.TEAM, N = H.namen(ctx), V = H.V, BIS = 35;
    // Reihen Jahr 0 bis 35 (Team 3 Vergleich Zeile 66 = Jahr 0); in Prozent für die Achse
    const reihe = v => ctx.wert(`t3.zr.rueckfluss.${v}`, T).slice(0, BIS + 1);
    const R = Object.fromEntries(V.map(v => [v, reihe(v)]));
    const jahre = Array.from({ length: BIS + 1 }, (_, j) => j);
    const ek = H.fuenf(ctx, 'n5.eigenkapital'), kum = H.fuenf(ctx, 'n5.kum_jahr35'), zurueck = H.fuenf(ctx, 'n5.jahr_ek_erreicht');
    const quote35 = H.fuenf(ctx, 't3.rueckfluss.quote_jahr35', true);

    // Gegenproben: Jahr ≥ 100 % aus der Reihe = Konzepte Zeile 67; Quote Jahr 35 = kumuliert ÷ Eigenkapital
    V.forEach((v, i) => {
      const erstes = R[v].findIndex(q => q >= 1);
      ctx.pruefe(erstes === zurueck[i], `Rückflussjahr ${v}: Reihe ${erstes}, Mappe ${zurueck[i]}.`);
      ctx.gleich(`Quote Jahr 35 ${v}`, R[v][BIS], quote35[i], 9);
      ctx.gleich(`Kumuliert ÷ Eigenkapital ${v}`, kum[i] / ek[i], quote35[i], 9);
    });
    const iD = V.indexOf('frei_dscr'), iM = V.indexOf('frei_markt');
    const gefJ = zurueck.slice(0, 3), gMin = Math.min(...gefJ), gMax = Math.max(...gefJ);
    ctx.pruefe(zurueck[iD] < gMin && zurueck[iM] < gMin, 'Frei finanziert ist nicht in beiden Mieten früher zurück; Titel anpassen.');
    // Letztes Jahr, in dem A mehr zurück hat als frei zur Marktmiete (Hinweiskasten)
    let jA = 0; for (let j = 1; j <= BIS; j++) if (R.A[j] > R.frei_markt[j]) jA = j;
    ctx.pruefe(jA > 0 && R.A.slice(jA + 1).every((q, k) => q <= R.frei_markt[jA + 1 + k]), 'A und frei zur Marktmiete kreuzen sich mehr als einmal.');

    const akzent = `${gMin} bis ${gMax} Jahren`;
    const s = ctx.folie(ctx.titelzeilen(['Eigenkapital zurück: gefördert nach', `${akzent}, frei nach ${zurueck[iD]} bzw. ${zurueck[iM]}`], akzent));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: `Eigenkapital zurück, Jahr 0 bis ${BIS}`, sub: 'kumulierter Zahlungsüberschuss in % des Eigenkapitals' });
    B.legende(s, { x: ZONE.diagramm.chart.x, y: ZONE.diagramm.legende, eintraege: V.map(v => ({ text: N[v], art: H.LINIE[v].art, strich: H.LINIE[v].strich })) });

    const pz = q => fmt.zahl(q * 100) + ' %';
    const hinweis = `Frei zur Marktmiete ist das Eigenkapital erst nach ${zurueck[iM]} Jahren zurück; bis Jahr ${jA} hat A mehr zurück (${pz(R.A[jA])} gegen ${pz(R.frei_markt[jA])}). Unverzinst, vor Steuern, ohne Restwert.`;
    const c = ZONE.diagramm.chart, hH = B.hinweisHoehe(hinweis, { w: c.w });
    const d = D.linien(s, { x: c.x, y: c.y, w: c.w, h: +(c.h - hH - 0.10).toFixed(3), name: 'Diagramm Rückfluss Eigenkapital',
      kategorien: jahre, katLabels: { formen: [0, 5, 10, 15, 20, 25, 30, 35] }, rand: { l: 0.86, r: 1.02, u: 0.50, o: 0.20 },
      reihen: V.map(v => ({ name: N[v], werte: R[v].map(q => q * 100), art: H.LINIE[v].art, strich: H.LINIE[v].strich })),
      achse: { min: 0, max: 700, schritt: 100, format: 'ganz' },
      altText: `Liniendiagramm: kumulierter Zahlungsüberschuss in % des eingesetzten Eigenkapitals, Jahr 0 bis ${BIS}. ` +
        V.map((v, i) => `${N[v]}: 100 % in Jahr ${zurueck[i]}, Jahr ${BIS} ${pz(quote35[i])}`).join('. ') + '.' });
    B.achstexte(s, d);
    B.achsentitel(s, d, { y: '% des Eigenkapitals', x: 'Jahr', xAbstand: 0.29, yVon: d.y + 0.04, yBis: d.plot.y + d.plot.h + 0.24 });

    // Marke 100 %: Eigenkapital zurück
    const y100 = d.yWert(100);
    B.marke(s, { x: d.plot.x, y: +y100.toFixed(3), w: d.plot.w, art: 'mass', text: 'Eigenkapital zurück', textSeite: 'oben', textBreite: 2.0, name: 'Marke 100 Prozent' });
    // Frei finanziert: Bankdarlehen nach 30 Jahren getilgt (jährliche Annuität über 30 Jahre), danach kein Kapitaldienst; daher der Knick
    const lz = ctx.wert('annahme.laufzeit_bank');
    B.marke(s, { x: +d.katMitte(lz).toFixed(3), y: d.plot.y, h: d.plot.h, art: 'referenz', strich: 'dash', text: `Jahr ${lz}: Bankdarlehen\ngetilgt`, textSeite: 'links', textBreite: 1.8, name: 'Marke Bankdarlehen getilgt' });
    // Schnittpunkte: Lage zwischen dem letzten Jahr unter 100 % und dem ersten darüber (aus den beiden Werten der Reihe)
    const xSchnitt = v => { const j = zurueck[V.indexOf(v)], a = R[v][j - 1], b = R[v][j]; return d.katMitte(j - 1) + (d.katMitte(j) - d.katMitte(j - 1)) * (1 - a) / (b - a); };
    V.forEach(v => B.punkt(s, { cx: +xSchnitt(v).toFixed(3), cy: +y100.toFixed(3), art: H.LINIE[v].art === 'tinte' ? 'tinte' : 'referenz', name: `Schnitt ${N[v]}` }));
    // Jahre an den Schnitten: frei über der Marke links vom Punkt, gefördert unter der Marke rechts vom Punkt
    const wb = t => ctx.breite(ctx.schutz(t), { fontFace: ctx.F.mont, bold: true, fontSize: 12 }) + 0.06;
    for (const v of ['frei_dscr', 'frei_markt']) {
      const t = String(zurueck[V.indexOf(v)]), b = wb(t);
      // 13 links vom Punkt; 21 mittig über dem Punkt (links davon läuft die Linie Frei 18,36 €)
      const xl = v === 'frei_dscr' ? xSchnitt(v) - b - 0.04 : xSchnitt(v) - b / 2;
      B.textAufPlot(s, t, { x: +xl.toFixed(3), y: +(y100 - 0.27).toFixed(3), w: +b.toFixed(3), h: 0.22, rolle: 'wert', name: `Jahr zurück ${N[v]}` });
    }
    const tG = `${gMin} bis ${gMax}`, bG = wb(tG), xG = Math.max(...['A', 'B', 'C'].map(xSchnitt));
    B.textAufPlot(s, tG, { x: +(xG + 0.08).toFixed(3), y: +(y100 + 0.05).toFixed(3), w: +bG.toFixed(3), h: 0.22, rolle: 'wert', name: 'Jahr zurück gefördert' });

    // Werte am Ende (Jahr 35): A, B, C mit Achskreis, frei mit der Miete
    const xE = d.katMitte(BIS) + 0.24, lagen = B.entzerre(V.map(v => d.yWert(R[v][BIS] * 100)), 0.30);
    V.forEach((v, i) => {
      if (i < 3) {
        B.achskreis(s, { cx: +xE.toFixed(3), cy: +lagen[i].toFixed(3), groesse: 'S', text: v, name: `Linienende ${v}` });
        B.text(s, pz(R[v][BIS]), { x: +(xE + 0.20).toFixed(3), y: +(lagen[i] - 0.12).toFixed(3), w: 0.62, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: `Endwert ${v}` });
      } else {
        B.text(s, pz(R[v][BIS]), { x: +(xE - 0.10).toFixed(3), y: +(lagen[i] - 0.12).toFixed(3), w: 0.72, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: `Endwert ${N[v]}` });
      }
    });
    B.hinweis(s, { x: c.x, y: Y.inhaltEnde, unten: true, w: c.w, name: 'Frei vorn', text: hinweis });

    B.stichpunkte(s, { platzhalter: 'kommentar', punktAbstand: 3, gruppen: [
      { titel: 'Eingesetzt in Jahr 0', punkte: [
        `Gefördert ${H.balken(ek.slice(0, 3), fmt.zahl)} €`,
        `Frei ${fmt.euro(ek[iD])}`] },
      { titel: `Zurück bis Ende Jahr ${BIS}`, punkte: [
        `Gefördert ${H.balken(kum.slice(0, 3), x => fmt.mioZahl(x, 2))} Mio. €`,
        `Frei ${fmt.mio(kum[iD], 2)} zur Miete für DSCR ${fmt.dez(ctx.wert('n1.dscr_ziel_bank_frei'), 1)} (${N.dscr}, Annahme der PGN), ${fmt.mio(kum[iM], 2)} zur Marktmiete ${N.markt}`] },
      { titel: 'Annahmen und Risiko', punkte: [
        `Gefördert alle ${ctx.wert('annahme.abstand_mieterhoehungen')} Jahre +${fmt.prozent(ctx.wert('annahme.mieterhoehung_in_der_bindung'), 2)} Miete`,
        `Frei jedes Jahr +${fmt.prozent(ctx.wert('annahme.mietsteigerung'))} Miete`,
        `Ohne Mietsteigerung hat frei zur Marktmiete ${ctx.wert('n6.mietsteigerung_0.jahre_fehlbetrag_1_35.frei_markt')} Jahre mit Fehlbetrag`] }] });
  },
};
