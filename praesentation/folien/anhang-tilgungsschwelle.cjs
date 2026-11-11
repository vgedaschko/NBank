// Folie A8 · PGN_ANHANG: Tilgungsschwelle gegenüber Gruppe A je Herstellungskosten. Antwort auf die Rückfrage zu Folie 20, ob die
// Reihenfolge der Gruppen auch bei anderen Kosten gilt. Links über acht Spalten ein natives Liniendiagramm: zwei Linien (B gegenüber A
// gestrichelt in Tinte, C gegenüber A in Referenzgrau, wie die Gruppen im ganzen Vortrag) über die Herstellungskosten von 2.500 € je m² bis
// zur Bemessungsgrenze; waagerechte Marke beim Tilgungssatz der Jahresrechnung, Punkt am Schnitt mit der Linie C gegenüber A, Maßhilfslinien
// und Werte bei den drei Kosten der Folie 23. Rechts über vier Spalten die Schwellen dieser drei Läufe als Tabelle (Spalten wie auf Folie 23)
// und drei Absätze.
// Kein Rot im Diagramm, kein Stempel, weißer Grund wie der übrige Anhang.
// Stützpunkte: Schwelle = (Mehr-Sollmiete − Mehr an Mietausfall) ÷ Mehrschuld − Verwaltungskostenbeitrag (Übersicht 4.9 bis 4.15). Die Mehrmiete
// hängt nicht von den Kosten ab, die Mehrschuld wächst im Verhältnis der Kosten: Das Modul rechnet die Stützpunkte aus dem Lauf modellhaus
// und prüft sie gegen die Schwellen der Läufe mit 4.631 € und 5.000 € je m² (werte.json).
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'anhang-tilgungsschwelle',
  bau(ctx) {
    const { B, D, W, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was), M = k => W('modellhaus', k);
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

    // Achse der Kosten: 2.500 € je m² bis zur Bemessungsgrenze in Schritten von 250 €; Größenachse in Prozent
    const SCHRITT = 250, N = 10, kosten = Array.from({ length: N + 1 }, (_, i) => grenze - (N - i) * SCHRITT), ACHSE = { min: 1, max: 3, schritt: 0.5, format: '[$-407]0.0" %"' };
    const reihe = g => kosten.map(k => schwelle(g, k) * 100), p2 = v => fmt.prozent(v, 2);
    R.pruefe(kostenLauf[2] === grenze && kosten[0] < K0, 'Die Achse der Folie A8 endet nicht an der Bemessungsgrenze oder beginnt nicht unter den Kosten des Modellhauses.');
    R.pruefe(['B', 'C'].every(g => reihe(g).every(v => v > ACHSE.min && v < ACHSE.max)) && tJahr * 100 > ACHSE.min && tJahr * 100 < ACHSE.max, 'Ein Stützpunkt oder der Tilgungssatz der Jahresrechnung liegt außerhalb der Größenachse der Folie A8; Achse im Modul anpassen.');
    // Aussagen der Folie: Unter der Linie C gegenüber A liegt C vorn, darüber A; B liegt nie vorn (C gegenüber B > C gegenüber A > B gegenüber A)
    R.pruefe(kosten.every(k => cGegenB(k) > schwelle('C', k) && schwelle('C', k) > schwelle('B', k)), 'Die Aussage „über der Linie C gegenüber A liegt A vorn, darunter C, B in keinem Fall“ trifft nicht mehr für alle Kosten der Achse zu.');
    // Schnitt der Linie C gegenüber A mit dem Tilgungssatz der Jahresrechnung: ab diesen Kosten liegt A vorn. Der Titel nennt ihn auf 100 € gerundet.
    const kSchnitt = netto('C') * K0 / (schuld('C') * (tJahr + vkb)), rund = Math.round(kSchnitt / 100) * 100;
    R.pruefe(kSchnitt > kosten[0] && kSchnitt < K0, 'Der Schnitt der Linie C gegenüber A mit dem Tilgungssatz der Jahresrechnung liegt nicht mehr zwischen dem Achsenanfang und den Kosten des Modellhauses; Titel, Diagramm und Notizen der Folie A8 anpassen.');
    if (ctx.glatt(ctx.o.titel) !== ctx.glatt(`Bei ${p2(tJahr)} Tilgung liegt Gruppe A ab rund ${fmt.euro(rund)} je m² vorn`)) P.melde(`Titel der Folie A8 nennt nicht den Tilgungssatz der Jahresrechnung (${ctx.glatt(p2(tJahr))}) und die gerundeten Kosten am Schnitt (${ctx.glatt(fmt.euro(rund))}).`);

    // ---- Diagramm über acht Spalten -------------------------------------------------------------------------------------------------
    const y0 = Y.anhangInhalt, x0 = colX(1), w0 = span(8);
    const yL = B.modulkopf(s, { x: x0, y: y0, w: w0, titel: wl('Tilgungsschwelle je Herstellungskosten', 'Modultitel'),
      sub: wl('Tilgungssatz p. a., bis zu dem B oder C in Jahr 1 vor A liegt · Kosten in € je m²', 'Untertitel') });
    const LINIE = { B: R.LINIEN.B, C: R.LINIEN.C }, name = g => wl(`${g} gegenüber A`, 'Legende');
    B.legende(s, { x: x0, y: yL + 0.04, eintraege: ['B', 'C'].map(g => ({ text: name(g), art: LINIE[g].art, strich: LINIE[g].strich })) });
    const yD = yL + 0.36, kat = kosten.map(k => fmt.zahl(k));
    const d = D.linien(s, { x: x0, y: yD, w: w0, h: Y.inhaltEnde - yD, kategorien: kat, katLabels: { nur: kat.filter((_, i) => i % 2 === 0) }, name: 'Diagramm Tilgungsschwelle je Herstellungskosten',
      altText: `Liniendiagramm: Die Tilgungsschwelle gegenüber A fällt mit den Herstellungskosten, für C von ${p2(W(laeufe[0], 'tilg.schwelle.C_gegen_A'))} bei ${fmt.euro(K0)} auf ${p2(W(laeufe[2], 'tilg.schwelle.C_gegen_A'))} bei ${fmt.euro(grenze)} je m². Die Linie für B liegt darunter.`,
      rand: { r: 0.62 }, achse: ACHSE, reihen: ['B', 'C'].map(g => ({ name: name(g), werte: reihe(g), art: LINIE[g].art, strich: LINIE[g].strich })) });
    const xK = k => d.katMitte((k - kosten[0]) / SCHRITT), yS = v => d.yWert(v * 100), unten = d.plot.y + d.plot.h;
    const band = oben => (d.yWert(oben) + d.yWert(oben - ACHSE.schritt)) / 2;                                      // Mitte des Bandes unter der Gitterlinie „oben“

    // Welche Gruppe vorn liegt: über der Linie C gegenüber A die Gruppe A (oberstes Band, rechts vom Schnitt), darunter C (unterstes Band, links)
    B.text(s, wl('Gruppe A vorn', 'Feld über der Linie'), { x: xK(rund) + 0.10, y: band(ACHSE.max) - 0.12, w: 1.80, h: 0.24, rolle: 'bezeichnung', valign: 'middle', einzeilig: true, name: 'Feld Gruppe A vorn' });
    B.text(s, wl('Gruppe C vorn', 'Feld unter der Linie'), { x: d.plot.x + 0.14, y: band(ACHSE.min + ACHSE.schritt) - 0.12, w: 1.80, h: 0.24, rolle: 'bezeichnung', valign: 'middle', einzeilig: true, name: 'Feld Gruppe C vorn' });

    // Tilgungssatz der Jahresrechnung als waagerechte Marke; am Schnitt mit der Linie C gegenüber A ein Punkt und die gerundeten Kosten
    B.marke(s, { x: d.plot.x, y: yS(tJahr), w: d.plot.w, art: 'mass', text: wl(`Jahresrechnung: ${p2(tJahr)}`, 'Markentext'), textSeite: 'rechts' });
    B.punkt(s, { cx: xK(kSchnitt), cy: yS(tJahr), art: LINIE.C.art, name: 'Punkt am Schnitt' });
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

    // ---- Rechte Spalte: die Schwellen der drei Läufe als Tabelle, darunter zwei Absätze ---------------------------------------------
    // Spalten wie auf Folie 23: Modellhaus, ARGE-Median, Ausgangswert der Bemessungsgrenze
    const x1 = colX(9), w1 = span(4), kopf = kostenLauf.map(k => fmt.euro(k));
    const yT = B.modulkopf(s, { x: x1, y: y0, w: w1, titel: wl('Schwelle gegenüber A', 'Modultitel'), sub: wl('Tilgungssatz p. a. bei drei Herstellungskosten', 'Untertitel') });
    const t = B.tabelle(s, { x: x1, y: yT, w: w1, pt: 12, name: 'Tabelle Schwellen',
      spalten: [{ kopf: wl('je m²', 'Spaltenkopf'), art: 'text' }, ...kopf.map(k => ({ kopf: k, breite: 0.94, art: 'zahl' }))],
      zeilen: ['B', 'C'].map(g => [wl('Gruppe ' + g, 'Tabelle'), ...laeufe.map(l => p2(W(l, `tilg.schwelle.${g}_gegen_A`)))]) });
    B.planlegende(s, { x: x1, y: t.unten + 0.22, w: w1, pt: 14, eintraege: [
      { text: `Modellhaus: ${kopf[0]}. ARGE-Median: ${kopf[1]}. Ausgangswert der Bemessungsgrenze: ${kopf[2]}.` },
      { text: 'Vorn liegt die Gruppe mit dem höchsten Zahlungsüberschuss in Jahr 1. Über der Linie „C gegenüber A“ ist das A, darunter C, B in keinem Fall.' },
      { text: 'Die Schwelle sinkt mit den Kosten: Die Mehrmiete je m² ist fest vorgegeben, die Mehrschuld wächst mit den Kosten.' }].map(e => ({ text: wl(e.text, 'Kommentar') })) });

    // ---- Notizen: Die Sätze mit Zahlen stehen im Konzept; hier die Gegenprobe gegen die Mappe ----------------------------------------
    const notiz = ctx.glatt(ctx.o.notizen), Nz = (text, was) => { if (!notiz.includes(ctx.glatt(text))) P.melde(`Notizen der Folie A8: „${ctx.glatt(text)}“ steht dort nicht (${was}; Wert aus der Mappe). Notizen im Konzept anpassen.`); };
    const je = g => laeufe.map(l => p2(W(l, `tilg.schwelle.${g}_gegen_A`)));
    Nz(`beim Modellhaus bei ${je('C')[0]}, beim ARGE-Median bei ${je('C')[1]}, an der Bemessungsgrenze bei ${je('C')[2]}`, 'Schwelle C gegenüber A der drei Läufe');
    Nz(`Für B sind es ${je('B')[0]}, ${je('B')[1]} und ${je('B')[2]}`, 'Schwelle B gegenüber A der drei Läufe');
    Nz(`ab ${fmt.euro(kSchnitt)} je m² vorn`, 'Kosten am Schnitt mit dem Tilgungssatz der Jahresrechnung');
    Nz(`C bringt ${fmt.euroDez(M('tab.hoechstmiete.IV.C') - M('tab.hoechstmiete.IV.A'))} je m² mehr Miete als A`, 'Mehrmiete C gegenüber A');
    Nz(`${fmt.prozent(M('tab.quote_darlehen.C') - M('tab.quote_darlehen.A'))} der Kosten mehr als Darlehen`, 'Mehrschuld C gegenüber A');
    R.pruefe(R.mietenstufeKlasse(M('eingabe.mietenstufe')) === 'IV–VII' && Math.abs((M('tab.hoechstmiete.IV.C') - M('tab.hoechstmiete.IV.A')) * 12 * M('eingabe.wohnflaeche') - M('tilg.mehr_sollmiete.C')) < 0.005,
      'Die Mehr-Sollmiete C gegenüber A ist nicht mehr die Differenz der Höchstmieten der Mietenstufe IV–VII; Notizen der Folie A8 anpassen.');
    R.pruefe(Math.abs((M('tab.quote_darlehen.C') - M('tab.quote_darlehen.A')) * M('fin.zuwendungsfaehige_kosten.A') - schuld('C')) < 0.005, 'Die Mehrschuld C gegenüber A ist nicht mehr die Differenz der Darlehensquoten mal zuwendungsfähige Kosten; Notizen der Folie A8 anpassen.');
    Nz(`Mietausfall über ${fmt.prozent(M('eingabe.mietausfall'))}`, 'Mietausfall der Rechnung');
    Nz(`Bemessungsgrenze von ${fmt.euro(grenze)} je m²`, 'Bemessungsgrenze');
  },
};
