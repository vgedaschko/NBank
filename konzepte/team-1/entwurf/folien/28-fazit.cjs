// Folie 28 · Fazit vor der Schlussfolie (PGN_INHALT, weiß; Abschnitt Umsetzung). Blickt auf den ganzen Vortrag: vier gleich breite Spalten
// (je drei Rasterspalten) für die vier Kapitel, je Spalte Achskreis und Kapitelname, eine Kennzahl (44 pt) mit Label und zwei Stichpunkte in
// 14 pt. Unten die Ergebniszeile weiß auf Rot als symmetrischer Vergleich: gefördert und frei finanziert mit denselben Merkmalen in derselben
// Reihenfolge (Zahlungsüberschuss ab Jahr 1 und unter welcher Miete, Eigenkapitalrendite mit Restwert, dieselbe Rendite ohne Mietsteigerung).
// Kein Diagramm.
// Zahlen: Konzepte-Mappe (Lauf konzepte und die Läufe mietanpassung_gefoerdert_0, mietsteigerung_0), Team-1-Mappe Konzepte!D155.
'use strict';
const werte = require('./_werte.cjs');

module.exports = {
  id: 'fazit',
  o: {
    nr: '28', abschnitt: 'Umsetzung', layout: 'PGN_INHALT', kicker: 'UMSETZUNG · FAZIT',
    quellen: 'Quelle: Rechenmappe v3, Kopie mit neuen Blöcken, Blätter Konzepte, Übersicht, Eingaben und Tabellen',
  },
  bau(ctx) {
    const { B, C, fmt, colX, span, Y } = ctx, { K, L, T } = werte(ctx);
    const G = ['A', 'B', 'C'];

    // ---- Zahlen ---------------------------------------------------------------------------------------------------------------------
    const mieteFrei = K('n5.miete_jahr1.frei_dscr');                      // Konzepte!H49
    const marktmiete = K('annahme.marktmiete_jahr1');                     // Eingaben!F25
    const zinsBank = K('annahme.zins_bank');                              // Eingaben!F35
    const quote = K('annahme.quote_darlehen.A') + K('annahme.quote_zuschuss.A');          // Tabellen!D5 + D6
    const foerderung = K('kern.foerderung.A'), gesamt = K('n5.gesamtkosten.A');           // Übersicht!D15, Konzepte!D52
    const zinsfrei = K('annahme.zinsfreie_jahre'), bindung = K('annahme.bindung');           // Tabellen!D20, D26
    const hoechst = G.map(g => K(`annahme.hoechstmiete_VI.${g}`));                       // Tabellen!D14:F14
    const zue1 = [...G, 'frei_dscr'].map(v => K(`n5.zue_jahr1.${v}`));                   // Konzepte!D61:F61, H61
    const kdA = K('n5.kapitaldienst_jahr1.A');                           // Konzepte!D60
    const fehlbetrag = G.map(g => K(`n5.jahre_fehlbetrag_1_35.${g}`));                   // Konzepte!D68:F68
        const schwelle = T('t1.kostenschwelle_zue0.A');                                      // Team-1-Mappe Konzepte!D155
    const eigenmittel = K('kern.eigenmittel.A');                          // Übersicht!D19
    const ekr = [...G, 'frei_dscr'].map(v => K(`n5.ek_vofi_mit_restwert.${v}`));         // Konzepte!D81:F81, H81
    const ekrOhneErhoehung = G.map(g => L('mietanpassung_gefoerdert_0', `ek_vofi_mit_restwert.${g}`));   // Lauf, Konzepte!D81:F81
    const ekrFreiOhneAnpassung = L('mietsteigerung_0', 'ek_vofi_mit_restwert.frei_dscr');              // Lauf, Konzepte!H81

    // ---- Aussagen gegen die Zahlen --------------------------------------------------------------------------------------------------
    ctx.pruefe(zue1.every(v => v > 0) && fehlbetrag.every(v => v === 0), 'Gefördert gibt es ein Jahr mit Fehlbetrag; Titel und Spalte 3 stimmen nicht.');
    ctx.gleich('Förderquote = Förderung ÷ Gesamtkosten', foerderung / gesamt, quote, 6);
    ctx.pruefe(K('annahme.herstellungskosten_qm') < schwelle, 'Das Modellhaus liegt über der Kostenschwelle von A.');
    ctx.pruefe(ekr[3] > Math.max(...ekr.slice(0, 3)), 'Frei liegt bei der Eigenkapitalrendite nicht mehr vorn; Ergebniszeile anpassen.');
    const spanne = (arr, f) => { const a = Math.min(...arr), b = Math.max(...arr); return a === b ? f(a) : `${f(a)} bis ${f(b)}`; };
    const proz = v => fmt.prozent(v, 2).replace(/\s?%$/, ''), mitProz = v => fmt.prozent(v, 2);
    const rund50 = Math.round(schwelle / 50) * 50;   // „rund“: auf 50 € gerundet, wie heute Folie 23

    const s = ctx.folie(ctx.titelzeilen(['Gefördert trägt sich das Modellhaus', 'vom ersten Jahr an'], 'vom ersten Jahr an'));
    B.register(s, '2.1');

    // ---- Vier Spalten: Kapitel, Kennzahl, zwei Stichpunkte -----------------------------------------------------------------------------
    const spalten = [
      { kapitel: 'Ausgangslage', zahl: fmt.dez(mieteFrei), einheit: '€', label: 'Miete je m², die die Bank verlangt',
        punkte: [`Bankdarlehen zu ${fmt.prozent(zinsBank, 2)}`, `Marktmiete nur ${fmt.euroDez(marktmiete)}`] },
      { kapitel: 'Programmteil 2.1', zahl: fmt.zahl(quote * 100), einheit: '%', label: `Förderung: ${fmt.mio(foerderung)} von ${fmt.mio(gesamt)}`,
        punkte: [`Darlehen ${zinsfrei} Jahre zinsfrei`, `Höchstmiete ${fmt.dez(Math.min(...hoechst))}–${fmt.dez(Math.max(...hoechst))} €`] },
      { kapitel: 'Modellrechnung', zahl: fmt.zahl(zue1[0]), einheit: '€', label: 'Zahlungsüberschuss Jahr 1 in Gruppe A',
        punkte: [`Kapitaldienst ${fmt.euro(kdA)} p. a.`, 'kein Jahr mit Fehlbetrag'] },
      { kapitel: 'Umsetzung', vor: 'rund', zahl: fmt.zahl(rund50), einheit: '€', label: 'Herstellungskosten je m², Grenze in A',
        punkte: [`Eigenmittel ${fmt.euro(eigenmittel)}`, 'erst Bewilligung, dann Bau'] },
    ];
    const w = span(3), y0 = Y.inhalt, xs = [1, 4, 7, 10].map(k => colX(k));
    // Kopf und Kennzahl je Spalte; die Stichpunkte beginnen in allen vier Spalten auf derselben Höhe
    const labelUnten = spalten.map((sp, i) => {
      const x = xs[i];
      B.achskreis(s, { cx: x + 0.20, cy: y0 + 0.20, groesse: 'M', text: String(i + 1), name: `Kapitel ${i + 1} Nummer` });
      B.text(s, sp.kapitel, { x: x + 0.52, y: y0 + 0.02, w: w - 0.52, h: 0.36, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: `Kapitel ${i + 1} Name` });
      return B.kennzahl(s, { x, y: y0 + 0.54, w, kompakt: true, vor: sp.vor, zahl: sp.zahl, einheit: sp.einheit, label: sp.label }).unten;
    });
    const yPunkte = +(Math.max(...labelUnten) + 0.10).toFixed(3);
    const punkteUnten = spalten.map((sp, i) => B.aufzaehlung(s, { x: xs[i], y: yPunkte, w, pt: 14, punkte: sp.punkte, name: `Text Kapitel ${i + 1} Stichpunkte` }).unten);

    // ---- Ergebniszeile weiß auf Rot: gefördert und frei finanziert, dieselben Merkmale in derselben Reihenfolge ------------------------
    const seiten = [
      { titel: `Gefördert, Gruppen ${G.join(', ')}`, zeilen: [
        'Zahlungsüberschuss ab Jahr 1 zur Höchstmiete',
        `Eigenkapitalrendite ${spanne(ekr.slice(0, 3), proz)} %`,
        `ohne Mieterhöhung ${spanne(ekrOhneErhoehung, proz)} %`] },
      { titel: 'Frei finanziert, Bank mit DSCR 1,2', zeilen: [
        `Zahlungsüberschuss ab Jahr 1 nur mit ${fmt.euroDez(mieteFrei)} Miete`,
        `Eigenkapitalrendite ${mitProz(ekr[3])}`,
        `ohne Mietanpassung ${mitProz(ekrFreiOhneAnpassung)}`] },
    ];
    // Die Fläche steht an der Unterkante der Inhaltszone und ist so hoch wie ihr Text. Das Textfeld der Stichpunkte reicht rund 0,36 Zoll unter
    // die letzte Zeile (Reserve und Zeilenabstand, wie heute Folie 24); im Bild bleiben so rund 0,35 Zoll Luft über der Fläche
    const textH = Math.max(...seiten.map(sd => B.hoehe(sd.zeilen.join('\n'), { rolle: 'dicht', w: span(6) - 0.40 })));
    const hE = +(0.48 + textH + 0.10).toFixed(3), yE = +(Y.inhaltEnde - hE).toFixed(3);
    ctx.pruefe(yE >= Math.max(...punkteUnten) - 0.10, `Die Ergebniszeile (ab y ${yE.toFixed(2)}) stößt an die Stichpunkte (bis ${Math.max(...punkteUnten).toFixed(2)}).`);
    B.kasten(s, { x: colX(1), y: yE, w: span(12), h: hE, farbe: C.rot, name: 'Ergebniszeile Fläche' });
    seiten.forEach((sd, i) => {
      const x = +(colX(1 + 6 * i) + 0.20).toFixed(3), wi = +(span(6) - 0.40).toFixed(3);
      B.text(s, sd.titel, { x, y: +(yE + 0.12).toFixed(3), w: wi, h: 0.32, rolle: 'modultitel', farbe: 'FFFFFF', valign: 'middle', einzeilig: true, name: `Ergebniszeile Titel ${i + 1}` });
      B.text(s, sd.zeilen.join('\n'), { x, y: +(yE + 0.48).toFixed(3), w: wi, h: textH, rolle: 'dicht', farbe: 'FFFFFF', name: `Text Ergebniszeile ${i + 1}` });
    });
  },
};
