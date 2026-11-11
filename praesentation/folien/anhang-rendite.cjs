// Folie A7 · PGN_ANHANG: Eigenkapitalrendite des Modellhauses über 35 Jahre, vor Steuern, für A, B, C und frei finanziert zur Marktmiete.
// Links über acht Spalten ein Rechenblatt (12 pt) mit sieben Zeilen, Ergebniszeile „Rendite mit Restwert“ weiß auf Rot wie Zeile 8 der
// Folie 15; rechts über vier Spalten die Annahmen. Die Folie zeigt die Rendite nur als Paar „mit Restwert / nur Bodenwert“ mit dem Anteil
// des Restwerts am Endvermögen, wie es die Rechenmappe verlangt (Blatt Hinweise Nr. 12).
// Einzige Folie mit Rendite und Marktmiete des Modellhauses (Entscheidung 24 des Konzepts; E5 gilt für alle anderen Folien). Die Werte kommen
// aus dem Lauf modellhaus_rendite von daten/werte.json, den der Bau nur dieser Folie freigibt; Eigenkapital und die Jahre mit Fehlbetrag der
// Gruppen A, B, C aus dem Lauf modellhaus. Kein Stempel, kein Papierton, Rot nur im Signaturwort und in der Ergebniszeile.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'anhang-rendite',
  bau(ctx) {
    const { B, W, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    const M = k => W('modellhaus', k), V = k => W('modellhaus_rendite', 'rendite.' + k), G = R.G, ALLE = [...G, 'Frei'], je = k => ALLE.map(g => V(`${k}.${g}`));
    const jahre = M('tab.zinsfreie_jahre');                    // Horizont der Rechnung: Ende der zinsfreien Zeit und der Bindung

    // ---- Werte der Mappe und ihre Gegenproben -----------------------------------------------------------------------------------
    const mit = je('vofi_mit_restwert'), boden = G.map(g => V(`vofi_nur_bodenwert.${g}`)), anteil = je('restwertanteil');
    const fehljahre = [...G.map(g => M(`liq.jahre_mit_fehlbetrag.${g}`)), V('jahre_mit_fehlbetrag.Frei')], konto = je('projektkonto_tiefststand'), restwert = je('restwert_jahr35');
    const zins = je('liegenschaftszins');
    // Frei finanziert bleibt nur mit dem Bodenwert kein Vermögen: Die Mappe führt dort „n. v.“ und einen Restwertanteil über 100 %.
    // Liefert sie einmal einen Wert, stimmen Strich, „über 100 %“ und die Notizen nicht mehr.
    R.pruefe(V('vofi_nur_bodenwert.Frei') === 'n. v.' && anteil[3] > 1, 'Frei finanziert führt die Mappe für „nur Bodenwert“ nicht mehr „n. v.“ oder der Restwertanteil liegt nicht mehr über 100 %; Zeilen 6 und 7 der Folie A7 anpassen.');
    R.pruefe(G.every((g, i) => anteil[i] > 0 && anteil[i] < 1), 'Der Restwertanteil einer geförderten Gruppe liegt nicht zwischen 0 und 100 %; Zeile 7 der Folie A7 anpassen.');
    R.pruefe(new Set(zins).size === 1, 'Der Liegenschaftszins ist nicht für alle vier Spalten gleich; die Annahme „Liegenschaftszins …“ auf Folie A7 anpassen.');
    const p1 = v => fmt.prozent(v, 1), titelzahl = p1(mit[0]);
    if (!ctx.o.titel.includes(ctx.glatt(titelzahl))) P.melde(`Titel der Folie nennt ${ctx.glatt(titelzahl)} nicht (Rendite mit Restwert, Gruppe A, aus der Mappe).`);

    // ---- Rechenblatt über acht Spalten -----------------------------------------------------------------------------------------
    const y0 = Y.anhangInhalt;
    const yT = B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: wl(`Modellhaus über ${jahre} Jahre, vor Steuern`, 'Modultitel'),
      sub: wl(`Endvermögen nach ${jahre} Jahren gegen Eigenkapital bei Bezug · frei finanziert zur Marktmiete`, 'Untertitel') });
    const zeile = (nr, text, werte, art) => ({ nr, text: wl(text, `Zeile ${nr}`), werte: werte.map(w => wl(w, `Zeile ${nr}`)), ...(art ? { art } : {}) });
    // Die Spalte „frei“ ist breiter: Dort stehen „−3.192.817“ und „über 100 %“; die Position behält so ihre Zeile bis auf zwei lange Bezeichnungen.
    // Alle Zeilen sind gleich hoch (zwei Zeilen Bezeichnung passen in jede).
    B.rechenblatt(s, { x: colX(1), y: yT, w: span(8), dicht: true, wertBreite: [1.06, 1.06, 1.06, 1.22], zeilenH: 0.51, ergebnisH: 0.51, name: 'Rechenblatt Rendite',
      kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }, wl('frei', 'Spaltenkopf')], zeilen: [
        zeile(1, 'Eigenkapital bei Bezug, in €', ALLE.map(g => fmt.zahl(M(`fin.eigenkapital.${g}`)))),
        zeile(2, `Jahre mit Fehlbetrag, Jahr 1 bis ${jahre}`, fehljahre.map(v => fmt.zahl(v))),
        zeile(3, 'Tiefster Stand des Projektkontos, in €', konto.map(v => fmt.zahl(v))),
        zeile(4, `Restwert Ende Jahr ${jahre}, in Mio. €`, restwert.map(v => fmt.mioZahl(v, 2))),
        zeile(5, 'Rendite mit Restwert', mit.map(p1), 'ergebnis'),
        zeile(6, 'Rendite, nur Bodenwert', [...boden.map(p1), '–']),
        zeile(7, 'Anteil des Restwerts am Endvermögen', [...G.map((g, i) => fmt.prozent(anteil[i])), 'über 100 %'])] });

    // ---- Annahmen über vier Spalten ---------------------------------------------------------------------------------------------
    const A = k => V('annahme.' + k), plus = v => '+' + v;
    B.planlegende(s, { x: colX(9), y: y0, w: span(4), linie: true, pt: 14, eintraege: [
      { titel: wl('Annahmen', 'Modultitel'), text: wl('Vor Steuern: ohne Abschreibung und Sonder-AfA.', 'Annahmen') },
      { text: wl(`Frei finanziert zur Marktmiete: ${fmt.euroJeQm(A('marktmiete_jahr1'))}, ${plus(fmt.prozent(A('mietsteigerung')))} im Jahr.`, 'Annahmen') },
      { text: wl(`Restwert: Ertragswert Ende Jahr ${jahre}, Liegenschaftszins ${p1(zins[0])}; Boden ${plus(p1(A('bodenwertsteigerung')))} im Jahr.`, 'Annahmen') },
      { text: wl(`Fehlbeträge trägt ein Projektkonto zu ${fmt.prozent(A('sollzins'))} Sollzins.`, 'Annahmen') }] });

    // ---- Notizen: Die Sätze mit Zahlen stehen im Konzept; hier die Gegenprobe gegen die Mappe ----------------------------------------
    const notiz = ctx.glatt(ctx.o.notizen), N = (t, was) => { if (!notiz.includes(ctx.glatt(t))) P.melde(`Notizen der Folie A7: „${ctx.glatt(t)}“ steht dort nicht (${was}; Wert aus der Mappe). Notizen im Konzept anpassen.`); };
    const d1 = v => fmt.zahl(v * 100, 1), spanne = [Math.min(...mit), Math.max(...mit)].map(d1), teil = [Math.min(...anteil.slice(0, 3)), Math.max(...anteil.slice(0, 3))].map(v => fmt.zahl(v * 100));
    N(`zwischen ${spanne[0]} und ${spanne[1]} %`, 'Spanne der Rendite mit Restwert');
    N(`${teil[0]} bis ${teil[1]} % des Endvermögens`, 'Restwertanteil in A, B und C');
    N(G.map((g, i) => `${p1(boden[i])} in ${g}`).join(', '), 'Rendite nur mit dem Bodenwert');
    N(`B und C bringen mit Restwert ${[...new Set([mit[1], mit[2]].map(p1))].join(' und ')}, A bringt ${p1(mit[0])}`, 'Rendite mit Restwert in B, C und A');
    N(`${ctx.zahlwort(fehljahre[1])} und ${ctx.zahlwort(fehljahre[2])} Jahre mit Fehlbetrag`, 'Jahre mit Fehlbetrag in B und C');
    N(`${fmt.zahl(fehljahre[3])} Jahre mit Fehlbetrag`, 'Jahre mit Fehlbetrag frei finanziert');
    N(`bis auf ${fmt.mio(konto[3], 2)}`, 'tiefster Stand des Projektkontos frei finanziert');
  },
};
