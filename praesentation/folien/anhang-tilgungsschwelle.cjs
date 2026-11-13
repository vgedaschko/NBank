// Folie A7 · PGN_ANHANG: Tilgungsschwelle gegenüber Gruppe A je Herstellungskosten. Antwort auf die Rückfrage zu Folie 20, ob die
// Reihenfolge der Gruppen auch bei anderen Kosten gilt. Links über sieben Spalten ein natives Liniendiagramm: zwei Linien (B gegenüber A
// gestrichelt in Tinte, C gegenüber A in Referenzgrau, wie die Gruppen im ganzen Vortrag) über die Herstellungskosten von 2.500 € je m² bis
// zur Bemessungsgrenze; die Fläche über der Linie C gegenüber A (Gruppe A vorn) in Hauch; waagerechte Marke beim Tilgungssatz der
// Jahresrechnung in Rot, Punkt am Schnitt mit der Linie C gegenüber A, Maßhilfslinien
// und Werte bei den drei Kosten der Folie 23. Rechts über fünf Spalten die Schwellen dieser drei Läufe als Tabelle (Spalten wie auf Folie 23)
// und Stichpunkte in 14 pt (seit 13.11.2026; bis dahin 8 + 4 mit drei Absätzen).
// Farbe auf Wunsch des Auftraggebers (11.11.2026), anders als auf den Folien 16 bis 23: Hier steht kein Zuschuss, Rot ist frei. Rot tragen die
// Marke der Jahresrechnung mit ihrer Beschriftung, der Punkt am Schnitt und das Feld „Gruppe A vorn“; die Fläche dazu ist Hauch F7E3E7.
// Kein Stempel, weißer Grund wie der übrige Anhang.
// Stützpunkte: Schwelle = (Mehr-Sollmiete − Mehr an Mietausfall) ÷ Mehrschuld − Verwaltungskostenbeitrag (Übersicht 4.9 bis 4.15). Die Mehrmiete
// hängt nicht von den Kosten ab, die Mehrschuld wächst im Verhältnis der Kosten: Das Modul rechnet die Stützpunkte aus dem Lauf modellhaus
// und prüft sie gegen die Schwellen der Läufe mit 4.631 € und 5.460 € je m² (werte.json).
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'anhang-tilgungsschwelle',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y, P, HEX } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was), M = k => W('modellhaus', k);
    const laeufe = R.KOSTENLAEUFE, kostenLauf = laeufe.map(l => W(l, 'eingabe.herstellungskosten_qm')), K0 = kostenLauf[0];
    const vkb = M('tab.verwaltungskostenbeitrag'), tJahr = M('eingabe.tilgung_nbank'), grenze = M('fin.bemessungsgrenze_qm');

    // ---- Schwelle als Funktion der Herstellungskosten je m² und ihre Gegenproben gegen die Mappe -----------------------------------
    const netto = g => M(`tilg.mehr_sollmiete.${g}`) - M(`tilg.mehr_mietausfall.${g}`), schuld = g => M(`tilg.mehrschuld.${g}`);
    const schwelle = (g, k) => netto(g) * K0 / (schuld(g) * k) - vkb;                                              // B oder C gegenüber A
    const cGegenB = k => (netto('C') - netto('B')) * K0 / ((schuld('C') - schuld('B')) * k) - vkb;                 // C gegenüber B
    laeufe.forEach((l, i) => {
      for (const g of ['B', 'C']) R.pruefe(Math.abs(schwelle(g, kostenLauf[i]) - W(l, `tilg.schwelle.${g}_gegen_A`)) < 1e-9, `Die Schwelle ${g} gegenüber A bei ${fmt.euro(kostenLauf[i])} je m² weicht von der Mappe ab (Lauf ${l}).`);
      R.pruefe(Math.abs(cGegenB(kostenLauf[i]) - W(l, 'tilg.schwelle.C_gegen_B')) < 1e-9, `Die Schwelle C gegenüber B bei ${fmt.euro(kostenLauf[i])} je m² weicht von der Mappe ab (Lauf ${l}).`);
      R.pruefe(['A', 'B', 'C'].every(g => W(l, `fin.ueber_bemessungsgrenze.${g}`) === 0), `Der Lauf ${l} liegt über der Bemessungsgrenze; die Mehrschuld wächst dort nicht mehr mit den Kosten.`);
    });

    // Achse der Kosten: zwölf Schritte von 250 € bis zur Bemessungsgrenze (seit 01.10.2026 5.460 €, also ab 2.460 €); Größenachse in Prozent
    const SCHRITT = 250, N = 12, kosten = Array.from({ length: N + 1 }, (_, i) => grenze - (N - i) * SCHRITT), ACHSE = { min: 0.5, max: 3.5, schritt: 0.5, format: '[$-407]0.0" %"' };
    const reihe = g => kosten.map(k => schwelle(g, k) * 100), p2 = v => fmt.prozent(v, 2);
    R.pruefe(kostenLauf[2] === grenze && kosten[0] < K0, 'Die Achse der Folie A7 endet nicht an der Bemessungsgrenze oder beginnt nicht unter den Kosten des Modellhauses.');
    R.pruefe(['B', 'C'].every(g => reihe(g).every(v => v > ACHSE.min && v < ACHSE.max)) && tJahr * 100 > ACHSE.min && tJahr * 100 < ACHSE.max, 'Ein Stützpunkt oder der Tilgungssatz der Jahresrechnung liegt außerhalb der Größenachse der Folie A7; Achse im Modul anpassen.');
    // Aussagen der Folie: Unter der Linie C gegenüber A liegt C vorn, darüber A; B liegt nie vorn (C gegenüber B > C gegenüber A > B gegenüber A)
    R.pruefe(kosten.every(k => cGegenB(k) > schwelle('C', k) && schwelle('C', k) > schwelle('B', k)), 'Die Aussage „über der Linie C gegenüber A liegt A vorn, darunter C, B in keinem Fall“ trifft nicht mehr für alle Kosten der Achse zu.');
    // Schnitt der Linie C gegenüber A mit dem Tilgungssatz der Jahresrechnung: ab diesen Kosten liegt A vorn. Der Titel nennt ihn auf 100 € gerundet.
    const kSchnitt = netto('C') * K0 / (schuld('C') * (tJahr + vkb)), rund = Math.round(kSchnitt / 100) * 100;
    R.pruefe(kSchnitt > kosten[0] && kSchnitt < K0, 'Der Schnitt der Linie C gegenüber A mit dem Tilgungssatz der Jahresrechnung liegt nicht mehr zwischen dem Achsenanfang und den Kosten des Modellhauses; Titel und Diagramm der Folie A7 anpassen.');
    if (ctx.glatt(ctx.o.titel) !== ctx.glatt(`Bei ${p2(tJahr)} Tilgung liegt Gruppe A ab rund ${fmt.euro(rund)} je m² vorn`)) P.melde(`Titel der Folie A7 nennt nicht den Tilgungssatz der Jahresrechnung (${ctx.glatt(p2(tJahr))}) und die gerundeten Kosten am Schnitt (${ctx.glatt(fmt.euro(rund))}).`);

    // ---- Diagramm über sieben Spalten ------------------------------------------------------------------------------------------------
    // Seit der Änderungsrunde vom 13.11.2026 (F37.1, G9) in der Teilung 7 + 5 (bis dahin 8 + 4): Die Stichpunkte in 14 pt passen auch mit
    // engeren Abständen nicht in vier Spalten
    const y0 = Y.anhangInhalt, x0 = colX(1), w0 = span(7);
    const yL = B.modulkopf(s, { x: x0, y: y0, w: w0, titel: wl('Tilgungsschwelle je Herstellungskosten', 'Modultitel'),
      sub: wl('Tilgungssatz p. a., bis zu dem B oder C in Jahr 1 vor A liegt · Kosten in € je m²', 'Untertitel') });
    const LINIE = { B: R.LINIEN.B, C: R.LINIEN.C }, name = g => wl(`${g} gegenüber A`, 'Legende');
    B.legende(s, { x: x0, y: yL + 0.04, eintraege: ['B', 'C'].map(g => ({ text: name(g), art: LINIE[g].art, strich: LINIE[g].strich })) });
    const yD = yL + 0.36, hD = Y.inhaltEnde - yD, kat = kosten.map(k => fmt.zahl(k)), RAND = { l: 0.86, r: 0.62, o: 0.20, u: 0.50 };
    // Plotfläche vorab, wie D.linien sie rechnet: Die Fläche „Gruppe A vorn“ liegt unter dem Diagramm und wird deshalb vor ihm angelegt
    const plot = { x: x0 + RAND.l, y: yD + RAND.o, w: w0 - RAND.l - RAND.r, h: hD - RAND.o - RAND.u }, kb = plot.w / kat.length;
    const xK = k => plot.x + kb * ((k - kosten[0]) / SCHRITT + 0.5), yS = v => plot.y + plot.h * (1 - (v * 100 - ACHSE.min) / (ACHSE.max - ACHSE.min)), unten = plot.y + plot.h;
    const xA = xK(kosten[0]), xE = xK(grenze);
    // Fläche über der Linie C gegenüber A, vom ersten bis zum letzten Stützpunkt: dort hat Gruppe A den höchsten Zahlungsüberschuss
    B.vieleck(s, { farbe: HEX.hauch, name: 'Fläche Gruppe A vorn', punkte: [{ x: xA, y: plot.y }, { x: xE, y: plot.y }, ...[...kosten].reverse().map(k => ({ x: xK(k), y: yS(schwelle('C', k)) }))] });
    const d = D.linien(s, { x: x0, y: yD, w: w0, h: hD, kategorien: kat, katLabels: { formen: kat.filter((_, i) => i % 2 === 0) }, name: 'Diagramm Tilgungsschwelle je Herstellungskosten',
      altText: `Liniendiagramm: Die Tilgungsschwelle gegenüber A fällt mit den Herstellungskosten, für C von ${p2(W(laeufe[0], 'tilg.schwelle.C_gegen_A'))} bei ${fmt.euro(K0)} auf ${p2(W(laeufe[2], 'tilg.schwelle.C_gegen_A'))} bei ${fmt.euro(grenze)} je m². Die Linie für B liegt darunter.`,
      rand: RAND, achse: ACHSE, reihen: ['B', 'C'].map(g => ({ name: name(g), werte: reihe(g), art: LINIE[g].art, strich: LINIE[g].strich })) });
    if (['x', 'y', 'w', 'h'].some(k => Math.abs(d.plot[k] - plot[k]) > 1e-6) || Math.abs(d.katMitte(N) - xE) > 1e-6 || Math.abs(d.yWert(2) - yS(0.02)) > 1e-6) throw new Error('Folie A7: Die vorab gerechnete Plotfläche weicht von der des Diagramms ab; die Fläche „Gruppe A vorn“ läge neben den Linien.');
    // Jede zweite Kosten als Textfeld unter der Achse (seit 13.11.2026): In sieben Spalten liefen die Beschriftungen des Diagramms in LibreOffice,
    // das den Abstand der Beschriftungen nicht liest, ineinander
    B.achstexte(s, d);
    B.achsentitel(s, d, { y: wl('Tilgungssatz p. a.', 'Achsentitel'), x: wl('Herstellungskosten in € je m² Wohnfläche', 'Achsentitel') });
    const band = oben => (d.yWert(oben) + d.yWert(oben - ACHSE.schritt)) / 2;                                      // Mitte des Bandes unter der Gitterlinie „oben“

    // Welche Gruppe vorn liegt: über der Linie C gegenüber A die Gruppe A (oberstes Band, rechts vom Schnitt), darunter C (unterstes Band, links)
    // Rote Schrift im Diagramm nur in Montserrat Bold ab 12 pt: beide Felder in der Rolle „wert“, das Feld der Gruppe A in Rot
    B.text(s, wl('Gruppe A vorn', 'Feld über der Linie'), { x: xK(rund) + 0.10, y: band(ACHSE.max) - 0.12, w: 1.80, h: 0.24, rolle: 'wert', farbe: 'akzent', valign: 'middle', einzeilig: true, name: 'Feld Gruppe A vorn' });
    B.text(s, wl('Gruppe C vorn', 'Feld unter der Linie'), { x: d.plot.x + 0.14, y: band(ACHSE.min + ACHSE.schritt) - 0.12, w: 1.80, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Feld Gruppe C vorn' });

    // Tilgungssatz der Jahresrechnung als waagerechte Marke in Rot, so lang wie die Linien; am Schnitt mit der Linie C gegenüber A ein Punkt
    // und die gerundeten Kosten
    B.linie(s, { x: xA, y: yS(tJahr), w: xE - xA, art: 'akzent', name: 'Marke Jahresrechnung' });
    B.text(s, wl(`Jahresrechnung: ${p2(tJahr)}`, 'Markentext'), { x: xE - 2.60, y: yS(tJahr) - 0.27, w: 2.60, h: 0.24, rolle: 'wert', farbe: 'akzent', align: 'right', valign: 'middle', einzeilig: true, name: 'Markentext' });
    B.punkt(s, { cx: xK(kSchnitt), cy: yS(tJahr), art: 'akzent', name: 'Punkt am Schnitt' });
    B.text(s, wl(`ab rund ${fmt.euro(rund)}`, 'Wert am Schnitt'), { x: xK(kSchnitt) + 0.10, y: yS(tJahr) - 0.27, w: 1.70, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Wert am Schnitt' });

    // Die drei Kosten der Folie 23: Maßhilfslinie von der Achse bis zur Linie C gegenüber A, Punkt und Schwelle; unter der Linie stehen die Kosten
    // der beiden Läufe, die keine Achsteilung treffen
    kostenLauf.forEach((k, i) => {
      const v = W(laeufe[i], 'tilg.schwelle.C_gegen_A'), x = xK(k), y = yS(v);
      B.linie(s, { x, y, h: unten - y, art: 'mass', pt: 0.5, name: 'Maßhilfslinie ' + fmt.zahl(k) });
      B.punkt(s, { cx: x, cy: y, art: LINIE.C.art, name: 'Punkt ' + fmt.zahl(k) });
      B.text(s, p2(v), { x: x + 0.08, y: y - 0.28, w: 0.70, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Schwelle C bei ' + fmt.zahl(k) });
      if (!kosten.includes(k)) B.text(s, fmt.euro(k), { x: x + 0.07, y: unten - 0.25, w: 0.80, h: 0.20, rolle: 'achse', farbe: 'text', valign: 'middle', einzeilig: true, name: 'Kosten ' + fmt.zahl(k) });
    });

    // ---- Rechte Spalte: die Schwellen der drei Läufe als Tabelle, darunter Stichpunkte unter zwei Überschriften ------------------------
    // Spalten wie auf Folie 23: Modellhaus, ARGE-Median, Bemessungsgrenze. Seit der Prüfrunde 1 zur Änderungsrunde vom 13.11.2026 (Entscheidung
    // nach der Rückfragerunde zu A7) stehen die Namen über den Beträgen wie auf Folie 23: gemischt in Work Sans SemiBold 12 pt (Rolle „bezeichnung“),
    // „Bemessungs-/grenze“ zweizeilig (Rückfrage 23). Wertspalten 1,27 Zoll wie auf Folie 23: „ARGE-Median“ braucht in 12 pt gut 1,13 Zoll.
    // Der Kopf hat drei Zeilen; die Namen stehen als Textfelder über dem Betrag, unten bündig, ganz im Kopf (darüber steht der Untertitel)
    const x1 = colX(8), w1 = span(5), kopf = kostenLauf.map(k => fmt.euro(k)), wb = 1.27;
    const namen = [[wl('Modellhaus', 'Spaltenkopf')], [wl('ARGE-Median', 'Spaltenkopf')], ['Bemessungs-', 'grenze']];
    wl('Bemessungs-/grenze', 'Spaltenkopf');
    const yK = B.modulkopf(s, { x: x1, y: y0, w: w1, titel: wl('Schwelle gegenüber A', 'Modultitel'), sub: wl('Tilgungssatz p. a. bei drei Herstellungskosten', 'Untertitel') });
    // Die Tabelle beginnt 0,06 Zoll unter dem Untertitel statt 0,12 (B.modulkopf rechnet 0,12 Luft): Mit dem dreizeiligen Kopf hätten die
    // Stichpunkte in 14 pt sonst keinen Platz. Die erste Zeile des Kopfs trägt nur „Bemessungs-“, rechts unter dem Ende des Untertitels
    const yT = +(yK - 0.06).toFixed(3);
    // dicht: Zeilenhöhe genau nach dem Text (seit 13.11.2026), Zellränder enger wie auf Folie A1 (Rückfrage 19: Abstände enger), damit die
    // Stichpunkte darunter Platz haben. Die Schrift bleibt 12 pt
    const t = B.tabelle(s, { x: x1, y: yT, w: w1, pt: 12, dicht: true, zellrand: [0.04, 0.03], name: 'Tabelle Schwellen',
      spalten: [{ kopf: wl('je m²', 'Spaltenkopf'), art: 'text' }, ...kopf.map(k => ({ kopf: `\n\n${k}`, breite: wb, art: 'zahl' }))],
      zeilen: ['B', 'C'].map(g => [wl('Gruppe ' + g, 'Tabelle'), ...laeufe.map(l => p2(W(l, `tilg.schwelle.${g}_gegen_A`)))]) });
    // Namen über den Beträgen: unten bündig eine Zeile (0,20) über dem Betrag, rechtsbündig mit dem rechten Zellrand der Tabelle (wie Folie 23)
    namen.forEach((zeilen, i) => { const sp = t.spalten[i + 1], h = +(0.235 * zeilen.length).toFixed(3);
      B.text(s, zeilen.join('\n'), { x: sp.x + 0.04, y: +(yT + t.kopfH - 0.03 - 0.20 - h).toFixed(3), w: sp.w - 0.12, h, rolle: 'bezeichnung', align: 'right', valign: 'bottom', name: `Spaltenkopf ${zeilen.join('')}` }); });
    // Seit der Änderungsrunde vom 13.11.2026 (F37.1, G9) Stichpunkte in 14 pt unter zwei Überschriften im Wortlaut der Änderungsdatei; bis dahin drei
    // Absätze (der erste nannte, wofür die drei Kosten stehen; die Datei führt ihn nicht mehr). Seit den Spaltenköpfen (Prüfrunde 1) ohne Abstand
    // nach den Stichpunkten und mit 2 pt vor der zweiten Überschrift (Rückfrage 19: Abstände enger)
    const yS1 = +(t.unten + 0.08).toFixed(3);
    B.stichpunkte(s, { x: x1, y: yS1, w: w1, h: Y.inhaltEnde - yS1, titelAbstand: 2, punktAbstand: 0, gruppen: [
      { titel: wl('Lesehilfe', 'Überschrift'), punkte: ['über der Linie „C gegenüber A“ hat A den höchsten Zahlungsüberschuss in Jahr 1', 'unter der Linie hat C den höchsten',
        'B hat ihn bei keinem Tilgungssatz'].map(p => wl(p, 'Stichpunkt')) },
      // die Überschrift bricht vor „mit den Kosten sinkt“: In einer Zeile ist sie breiter als fünf Spalten
      { titel: wl('Warum die Schwelle mit den Kosten sinkt', 'Überschrift').replace(' mit den', '\nmit den'), punkte: ['die Mehrmiete je m² ist fest vorgegeben', 'die Mehrschuld wächst mit den Herstellungskosten'].map(p => wl(p, 'Stichpunkt')) }] });

    // ---- Gegenproben zu „Warum die Schwelle mit den Kosten sinkt“: Mehrmiete aus den Höchstmieten, Mehrschuld aus den Darlehenssätzen ------
    R.pruefe(R.mietenstufeKlasse(M('eingabe.mietenstufe')) === 'IV–VII' && Math.abs((M('tab.hoechstmiete.IV.C') - M('tab.hoechstmiete.IV.A')) * 12 * M('eingabe.wohnflaeche') - M('tilg.mehr_sollmiete.C')) < 0.005,
      'Die Mehr-Sollmiete C gegenüber A ist nicht mehr die Differenz der Höchstmieten der Mietenstufe IV–VII; die Stichpunkte „Warum die Schwelle mit den Kosten sinkt“ der Folie A7 prüfen.');
    R.pruefe(Math.abs((M('tab.quote_darlehen.C') - M('tab.quote_darlehen.A')) * M('fin.zuwendungsfaehige_kosten.A') - schuld('C')) < 0.005, 'Die Mehrschuld C gegenüber A ist nicht mehr die Differenz der Darlehensquoten mal zuwendungsfähige Kosten; die Stichpunkte „Warum die Schwelle mit den Kosten sinkt“ der Folie A7 prüfen.');
  },
};
