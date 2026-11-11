// Folie A7 · PGN_ANHANG: Eigenkapitalrendite des Modellhauses über 35 Jahre, vor Steuern, für A, B, C und frei finanziert zur Marktmiete.
// Links über acht Spalten ein Rechenblatt (12 pt) mit sieben Zeilen, Ergebniszeile „Rendite mit Restwert“ weiß auf Rot wie Zeile 8 der
// Folie 15; rechts über vier Spalten die Annahmen. Die Folie zeigt die Rendite nur als Paar „mit Restwert / nur Bodenwert“ mit dem Anteil
// des Restwerts am Endvermögen, wie es die Rechenmappe verlangt (Blatt Hinweise Nr. 12); der Titel nennt beide Lesarten für Gruppe A.
// Einzige Folie mit Rendite und Marktmiete des Modellhauses (Entscheidung 24 des Konzepts; E5 gilt für alle anderen Folien). Die Werte kommen
// aus dem Lauf modellhaus_rendite von daten/werte.json, den der Bau nur dieser Folie freigibt; Eigenkapital und die Jahre mit Fehlbetrag der
// Gruppen A, B, C aus dem Lauf modellhaus; die Herkunft der Marktwerte aus daten/rechnung.json. Kein Stempel, kein Papierton, Rot nur im Signaturwort und in der Ergebniszeile.
// Marktmiete und Liegenschaftszins sind amtliche Werte der Gutachterausschüsse für Rotenburg (Wümme), Stichtag 01.01.2026 (Blatt Hinweise
// Nr. 14); die Annahmen nennen den Ort. Renditen und Liegenschaftszins stehen mit zwei Nachkommastellen wie in der Rechenmappe: Auf eine
// Stelle gerundet stünde die Rendite in A als 5,2 %, die Mappe zeigt 5,25 %; der Liegenschaftszins von 3,45 % stünde als 3,4 oder 3,5 %.
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
    const p2 = v => fmt.prozent(v, 2);
    // Der Titel nennt für Gruppe A beide Lesarten: mit Restwert (Signaturwort) und nur Bodenwert
    for (const [zahl, was] of [[p2(mit[0]), 'Rendite mit Restwert'], [p2(boden[0]), 'Rendite nur Bodenwert']]) {
      if (!ctx.o.titel.includes(ctx.glatt(zahl))) P.melde(`Titel der Folie nennt ${ctx.glatt(zahl)} nicht (${was}, Gruppe A, aus der Mappe).`);
    }

    // ---- Rechenblatt über acht Spalten -----------------------------------------------------------------------------------------
    const y0 = Y.anhangInhalt;
    const yT = B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: wl(`Eigenkapitalrendite über ${jahre} Jahre, vor Steuern`, 'Modultitel'),
      sub: wl(`Endvermögen nach ${jahre} Jahren gegen Eigenkapital bei Bezug · frei finanziert zur Marktmiete`, 'Untertitel') });
    const zeile = (nr, text, werte, art) => ({ nr, text: wl(text, `Zeile ${nr}`), werte: werte.map(w => wl(w, `Zeile ${nr}`)), ...(art ? { art } : {}) });
    // Die Spalte „frei“ ist breiter: Dort stehen der tiefste Stand des Projektkontos (siebenstellig mit Minus) und „über 100 %“; die Position
    // behält so ihre Zeile bis auf zwei lange Bezeichnungen.
    // Alle Zeilen sind gleich hoch (zwei Zeilen Bezeichnung passen in jede). Die beiden langen Bezeichnungen brechen an der Sinnfuge: Geschützte
    // Leerzeichen halten „Projektkontos, in €“ und „am Endvermögen“ zusammen (sonst stünde „€“ allein in der zweiten Zeile).
    const nb = t => t.split(' ').join(fmt.NBSP);
    B.rechenblatt(s, { x: colX(1), y: yT, w: span(8), dicht: true, wertBreite: [1.06, 1.06, 1.06, 1.22], zeilenH: 0.51, ergebnisH: 0.51, name: 'Rechenblatt Rendite',
      kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }, wl('frei', 'Spaltenkopf')], zeilen: [
        zeile(1, 'Eigenkapital bei Bezug, in €', ALLE.map(g => fmt.zahl(M(`fin.eigenkapital.${g}`)))),
        zeile(2, `Jahre mit Fehlbetrag, Jahr 1 bis ${jahre}`, fehljahre.map(v => fmt.zahl(v))),
        zeile(3, `Tiefster Stand des ${nb('Projektkontos, in €')}`, konto.map(v => fmt.zahl(v))),
        zeile(4, `Restwert Ende Jahr ${jahre}, in Mio. €`, restwert.map(v => fmt.mioZahl(v, 2))),
        zeile(5, 'Rendite mit Restwert', mit.map(p2), 'ergebnis'),
        zeile(6, 'Rendite, nur Bodenwert', [...boden.map(p2), '–']),
        zeile(7, `Anteil des Restwerts ${nb('am Endvermögen')}`, [...G.map((g, i) => fmt.prozent(anteil[i])), 'über 100 %'])] });

    // ---- Annahmen über vier Spalten ---------------------------------------------------------------------------------------------
    // Vier Absätze in neun Zeilen, so lang wie vor dem Wechsel auf die Werte für Rotenburg (Wümme). Der zweite Absatz nennt die beiden
    // amtlichen Werte mit ihrer Herkunft; der Liegenschaftszins steht vorn, weil der Absatz nur so in drei Zeilen passt („Gutachterausschuss,“
    // und „Rotenburg (Wümme),“ sind zusammen breiter als die Spalte). „Rotenburg (Wümme)“ und „+1,5 % p. a.“ bleiben zusammen (geschützte Leerzeichen).
    // Die Herkunft der beiden Werte steht in daten/rechnung.json (marktwerte); die Quellenzeile der Notizen nennt beide Quellen voll.
    const A = k => V('annahme.' + k), herkunft = ctx.X('rechnung', 'marktwerte.herkunft_kurz').replace('Rotenburg (Wümme)', nb('Rotenburg (Wümme)'));
    for (const k of ['quelle_marktmiete', 'quelle_liegenschaftszins']) {
      const q = ctx.X('rechnung', 'marktwerte.' + k);
      if (!ctx.glatt(ctx.o.quellen).includes(ctx.glatt(q))) P.melde(`Quellenzeile der Folie A7 nennt „${q}“ nicht (daten/rechnung.json, marktwerte.${k}).`);
    }
    B.planlegende(s, { x: colX(9), y: y0, w: span(4), linie: true, pt: 14, eintraege: [
      { titel: wl('Annahmen', 'Modultitel'), text: wl('Vor Steuern, ab Bezug: ohne Bauphase, Abschreibung und Sonder-AfA.', 'Annahmen') },
      { text: wl(`Liegenschaftszins ${p2(zins[0])}, Marktmiete ${fmt.euroJeQm(A('marktmiete_jahr1'))}: ${herkunft}.`, 'Annahmen') },
      { text: wl(`Restwert: Ertragswert Ende Jahr ${jahre}. Marktmiete +${fmt.prozent(A('mietsteigerung'))}, Boden ${nb(`+${fmt.prozent(A('bodenwertsteigerung'), 1)} p. a.`)}`, 'Annahmen') },
      { text: wl(`Fehlbeträge laufen auf ein Projektkonto zu ${fmt.prozent(A('sollzins'))} Sollzins.`, 'Annahmen') }] });

    // ---- Notizen: Die Sätze mit Zahlen stehen im Konzept; hier die Gegenprobe gegen die Mappe ----------------------------------------
    const notiz = ctx.glatt(ctx.o.notizen), N = (t, was) => { if (!notiz.includes(ctx.glatt(t))) P.melde(`Notizen der Folie A7: „${ctx.glatt(t)}“ steht dort nicht (${was}; Wert aus der Mappe). Notizen im Konzept anpassen.`); };
    const d2 = v => fmt.zahl(v * 100, 2), gef = mit.slice(0, 3), teil = [Math.min(...anteil.slice(0, 3)), Math.max(...anteil.slice(0, 3))].map(v => fmt.zahl(v * 100));
    N(`A, B und C bei ${d2(Math.min(...gef))} bis ${d2(Math.max(...gef))} %`, 'Spanne der Rendite mit Restwert in A, B und C');
    N(`frei finanziert sind es ${p2(mit[3])}`, 'Rendite mit Restwert frei finanziert');
    N(`${teil[0]} bis ${teil[1]} % des Endvermögens`, 'Restwertanteil in A, B und C');
    N(`${p2(boden[0])} in A, ${p2(boden[1])} in B und ${p2(boden[2])} in C`, 'Rendite nur mit dem Bodenwert');
    N(`${ctx.zahlwort(fehljahre[1])} und ${ctx.zahlwort(fehljahre[2])} Jahre Fehlbetrag`, 'Jahre mit Fehlbetrag in B und C');
    N(`sind es ${fmt.zahl(fehljahre[3])} Jahre`, 'Jahre mit Fehlbetrag frei finanziert');
    N(`bis auf ${fmt.mio(konto[3], 2)}`, 'tiefster Stand des Projektkontos frei finanziert');
    // Regie-Sätze der Notizen: Eigenkapital bei Bezug = Eigenmittel + Bearbeitungsentgelte; das Projektkonto verzinst die Fehlbeträge und steht
    // deshalb tiefer als die Summe der Fehlbeträge auf Folie 21. Der Satz zur Schwelle der NBank (Swapsatz plus 1 Prozentpunkt) nennt keine Zahl:
    // Der Swapsatz steht auf der Sperrliste und lässt sich hier nicht gegenrechnen.
    R.pruefe(G.every(g => Math.abs(M(`fin.eigenkapital.${g}`) - M(`fin.eigenmittel.${g}`) - M(`fin.bearbeitungsentgelte.${g}`)) < 0.005), 'Eigenkapital bei Bezug ist nicht mehr Eigenmittel plus Bearbeitungsentgelte; Regie-Satz in den Notizen der Folie A7 anpassen.');
    R.pruefe(['B', 'C'].every(g => V(`projektkonto_tiefststand.${g}`) < M(`liq.groesster_kumulierter_fehlbetrag.${g}`)), 'Das Projektkonto steht in B oder C nicht mehr tiefer als die Summe der Fehlbeträge der Folie 21; Regie-Satz in den Notizen der Folie A7 anpassen.');
    N(`Eigenmittel von ${fmt.mio(M('fin.eigenmittel.A'))} plus Bearbeitungsentgelte`, 'Eigenkapital bei Bezug');
    N(`mit ${fmt.prozent(A('sollzins'))} Sollzins`, 'Sollzins des Projektkontos');
  },
};
