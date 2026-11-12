// Folie 14 · PGN_INHALT_MR: Finanzierung des Modellhauses (PGN-Projekt in Neu Wulmstorf). Ein gestapelter Balken (Zuschuss, Darlehen, Eigenmittel)
// mit Maßkette und 80-%-Achse, darunter der Rechenweg, rechts zwei Kennzahlen je Wohnung. Erste Folie der Modellrechnung: oben rechts der Zusatz „Rechenbeispiel, keine Förderzusage“.
// Das Grundstück gehört dem Bauherrn schon und ist in Kosten und Förderung nicht angesetzt: Der Rechenweg hat keine Zeile Grundstück, an ihrer Stelle steht der Hinweis.
// Alle Zahlen aus werte.json (Lauf modellhaus); der Anteil „Geld oder lastenfreies Grundstück“ aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-finanzierung',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, Y } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    ctx.wortlaut(B.stempelZusatz(s).text, 'Zusatz'); B.register(s, '2.1');

    const wohnungen = M('eingabe.wohnungen'), kosten = M('fin.gesamtkosten.A'), foerderung = M('fin.foerderung.A'), eigen = M('fin.eigenmittel.A');
    const kostenQm = M('eingabe.herstellungskosten_qm'), grenze = M('fin.bemessungsgrenze_qm');
    R.pruefe(kosten === M('fin.zuwendungsfaehige_kosten.A') && kostenQm < grenze, 'Das Modellhaus liegt nicht mehr unter der Bemessungsgrenze; Rechenweg und Notiz der Folie 14 stimmen dann nicht.');
    // Grundstück im Bestand: nicht angesetzt (Eingabe 2.3 = 0). Dann sind Herstellungskosten, zuwendungsfähige Kosten und Gesamtkosten gleich,
    // und die Eigenmittel der Rechnung sind ganz Geld. Trägt die Mappe wieder ein Grundstück, braucht der Rechenweg seine Zeile zurück.
    R.pruefe(M('eingabe.grundstueck') === 0 && M('fin.grundstueck') === 0 && M('fin.herstellungskosten') === kosten && Math.abs(M('fin.eigenmittel_bar') - eigen) < 0.005,
      'Die Mappe setzt für das Modellhaus ein Grundstück an; Rechenweg („Grundstück im Bestand, nicht angesetzt“) und Notiz der Folie 14 stimmen dann nicht.');

    // Deck unter dem Titel
    B.text(s, ctx.wortlaut(`PGN-Projekt in Neu Wulmstorf · ${wohnungen} Wohnungen · ${fmt.qm(M('eingabe.wohnflaeche'))} Wohnfläche · Gruppe A · Mietenstufe ${M('eingabe.mietenstufe')}`, 'Deck'),
      { x: colX(1), y: Y.deck, w: span(12), h: Y.deckH, rolle: 'deck', valign: 'middle', einzeilig: true, name: 'Deck' });

    // Balken über acht Spalten: Beschriftung als Text im Segment (Name, Betrag, Anteil), Maßkette und 80-%-Achse wie auf Folie 11
    const y0 = Y.inhaltNachDeck, x0 = colX(1), w8 = span(8);
    B.modulkopf(s, { x: x0, y: y0, w: w8, titel: `Finanzierung ${fmt.mio(kosten)}, Höchstsätze` });
    const teile = [
      { name: 'Zuschuss', art: 'zuschuss', wert: M('fin.zuschuss.A'), quote: M('fin.zuschussquote.A') },
      { name: 'Darlehen', art: 'darlehen', wert: M('fin.darlehen_nbank.A'), quote: M('fin.darlehensquote.A') },
      { name: 'Eigenmittel, mind.', art: 'eigenmittel', wert: eigen, quote: M('fin.eigenmittelquote.A') }];
    const d = D.stapelBalken(s, { x: x0, y: y0 + 0.34, w: w8, h: 1.20, kategorien: ['Gruppe A'], name: 'Diagramm Finanzierung Gruppe A', labels: false,
      reihen: teile.map(t => ({ name: t.name, art: t.art, werte: [t.wert / 1e6] })), achse: { min: 0, max: kosten / 1e6, schritt: 0.5, format: 'eins' },
      rand: { l: 0.16, r: 0.16, o: 0.44, u: 0.26 }, luecke: 8 });
    // Einheit der Achse in der Zeile der Achsbeschriftung, rechts vom letzten Wert: Darunter schließt der Rechenweg an
    B.achsentitel(s, d, { x: ctx.wortlaut('Mio. €', 'Achsentitel'), xAusrichtung: 'rechts', xAbstand: 0.04 });
    let lauf = 0;
    for (const t of teile) {
      const xa = d.xWert(lauf / 1e6), xe = d.xWert((lauf + t.wert) / 1e6);
      B.segmenttext(s, { x: xa, y: d.katMitte(0) - d.balkenHoehe / 2, w: xe - xa, h: d.balkenHoehe, name: t.name, wert: `${fmt.mio(t.wert)} · ${fmt.prozent(t.quote)}`, art: t.art });
      lauf += t.wert;
    }
    // Maßkettentext in Tinte: Rot tragen auf dieser Folie schon Zuschuss, 80-%-Achse und die Kennzahlen (ein Akzentmodul je Folie)
    const my = d.plot.y - 0.12, quote = M('fin.foerderquote.A');
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [
      { anteil: foerderung, text: `Förderung ${fmt.mio(foerderung)} · ${fmt.prozent(quote)}` }, { anteil: eigen, text: fmt.prozent(M('fin.eigenmittelquote.A')) }] });
    B.achse80(s, { x: d.xWert(foerderung / 1e6), yOben: my, yUnten: d.plot.y + d.plot.h, text: fmt.zahl(quote * 100) });

    // Rechenweg: drei nummerierte Zeilen in 14 pt, Zeile 2 als Summe; an der Stelle der früheren Zeile „Grundstück“ steht der Hinweis ohne Nummer
    // und ohne Betrag. Der Titel steht als Text in der leeren Kopfzeile des Rechenblatts (nach der Tabelle angelegt, damit er in PowerPoint
    // obenauf liegt und anklickbar bleibt).
    // Balken und Tabelle stehen 0,08 Zoll enger als mit vier vollen Zeilen: Die Notiz unter dem Rechenblatt hat drei Zeilen
    const yT = y0 + 1.66;
    const t = B.rechenblatt(s, { x: x0, y: yT, w: w8, kopf: ['', ''], wertBreite: 1.60, zeilenH: 0.35, name: 'Rechenblatt Rechenweg', zeilen: [
      { nr: 1, text: `Herstellungskosten, ${fmt.qm(M('eingabe.wohnflaeche'))} × ${fmt.euro(kostenQm)}`, werte: [fmt.zahl(M('fin.herstellungskosten'))] },
      { text: ctx.wortlaut('Grundstück im Bestand, nicht angesetzt', 'Hinweis im Rechenweg'), werte: [''], art: 'notiz', h: 0.27 },
      { nr: 2, zeichen: '=', text: 'zuwendungsfähige Kosten', werte: [fmt.zahl(M('fin.zuwendungsfaehige_kosten.A'))], art: 'summe' },
      { nr: 3, text: `Eigenmittel, mindestens ${fmt.prozent(M('fin.eigenmittelquote.A'))}`, werte: [fmt.zahl(eigen)] }] });
    B.linie(s, { x: x0, y: yT, w: w8, art: 'modul', name: 'Modulkopf-Linie' });
    B.text(s, 'Rechenweg, in €', { x: x0, y: yT + 0.06, w: w8 - 1.70, h: 0.26, rolle: 'diagrammtitel', valign: 'middle', einzeilig: true, name: 'Modultitel' });
    // Notiz in drei Zeilen, je Zeile ein Satz: Die Regel zur Hälfte der Eigenmittel bleibt; weil das Grundstück nicht angesetzt ist, sind die
    // Eigenmittel der Rechnung ganz Geld (oben geprüft: fin.eigenmittel_bar gleich fin.eigenmittel.A)
    B.text(s, ctx.wortlaut(`Von den Eigenmitteln sollen mindestens ${fmt.euro(eigen * X('rechnung', 'eigenmittel.anteil_geld_oder_grundstueck'))} Geld oder lastenfreies Grundstück sein.`, 'Notiz unter dem Rechenblatt') + '\n' +
      ctx.wortlaut('In dieser Rechnung sind die Eigenmittel ganz Geld, weil das Grundstück nicht angesetzt ist.', 'Notiz unter dem Rechenblatt') + '\n' +
      ctx.wortlaut(`${fmt.euro(kostenQm)} je m² liegen ${fmt.euro(grenze - kostenQm)} unter dem Ausgangswert der Bemessungsgrenze von ${fmt.euro(grenze)}.`, 'Notiz unter dem Rechenblatt'),
      { x: x0, y: t.unten + 0.07, w: w8, rolle: 'klein', name: 'Notiz unter dem Rechenblatt' });

    // Kennzahlen je Wohnung: die zweite beginnt auf der Linie unter dem Titel des Rechenblatts
    B.kennzahl(s, { x: colX(9), y: y0, w: span(4), vorsatz: 'bis zu', zahl: fmt.zahl(M('fin.zuschuss_je_wohnung.A')), einheit: '€', label: 'Ø Zuschuss je Wohnung', text: 'plus Darlehen in gleicher Höhe' });
    B.kennzahl(s, { x: colX(9), y: yT + t.kopfH, w: span(4), vorsatz: 'mind.', zahl: fmt.zahl(M('fin.eigenmittel_je_wohnung.A')), einheit: '€', label: 'Ø Eigenmittel je Wohnung',
      text: `${fmt.prozent(M('fin.eigenmittelquote.A'))} von ${fmt.euro(kosten / wohnungen)} je Wohnung` });   // die Summe heißt im Rechenblatt „zuwendungsfähige Kosten“; deshalb hier ohne „Gesamtkosten“
  },
};
