// Folie 14 · PGN_INHALT_MR: Finanzierung des Modellhauses (PGN-Projekt in Neu Wulmstorf). Ein gestapelter Balken (Zuschuss, Darlehen, Eigenmittel)
// mit Maßkette und 80-%-Achse, darunter der Rechenweg und der Hinweiskasten zu den Eigenmitteln, rechts zwei Kennzahlen je Wohnung. Erste Folie der Modellrechnung: oben rechts der Zusatz „Rechenbeispiel, keine Förderzusage“.
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
    // Seit der Änderungsrunde vom 13.11.2026 (F14.1, F14.2) steht der Block enger: Der Rechenweg hat eine Zeile mehr, und unter ihm steht der
    // Hinweiskasten. Das Diagramm beginnt 0,04 höher (die Maßkette bleibt unter dem Modultitel) und ist 0,03 niedriger: Der Balken bleibt
    // 0,46 hoch (Lücke 2 statt 8 %; mit 0,44, dem Mindestmaß für zwei Zeilen, stößt die zweite Zeile im Bild an die Unterkante)
    const d = D.stapelBalken(s, { x: x0, y: y0 + 0.30, w: w8, h: 1.17, kategorien: ['Gruppe A'], name: 'Diagramm Finanzierung Gruppe A', labels: false,
      reihen: teile.map(t => ({ name: t.name, art: t.art, werte: [t.wert / 1e6] })), achse: { min: 0, max: kosten / 1e6, schritt: 0.5, format: 'eins' },
      rand: { l: 0.16, r: 0.16, o: 0.44, u: 0.26 }, luecke: 2 });
    // Ende der Achse: Die Achse läuft bis zu den Gesamtkosten (2,96 Mio. €), die Teilstriche enden deshalb bei 2,5. Am rechten Ende steht
    // der Endwert mit der Einheit („3,0 Mio. €“, gerundet wie im Modultitel und in den Segmenten), in der Zeile der Achsbeschriftung:
    // Darunter schließt der Rechenweg an
    B.achsentitel(s, d, { x: ctx.wortlaut(fmt.mio(kosten), 'Endwert der Achse mit Einheit'), xAusrichtung: 'rechts', xAbstand: 0.055 });
    let lauf = 0;
    for (const t of teile) {
      const xa = d.xWert(lauf / 1e6), xe = d.xWert((lauf + t.wert) / 1e6);
      B.segmenttext(s, { x: xa, y: d.katMitte(0) - d.balkenHoehe / 2, w: xe - xa, h: d.balkenHoehe, name: t.name, wert: `${fmt.mio(t.wert)} · ${fmt.prozent(t.quote)}`, art: t.art });
      lauf += t.wert;
    }
    // Maßkette und 80-%-Achse in Tinte wie auf Folie 11: Rot trägt im Diagramm nur der Zuschuss
    const my = d.plot.y - 0.12, quote = M('fin.foerderquote.A');
    B.masskette(s, { x: d.plot.x, y: my, w: d.plot.w, segmente: [
      { anteil: foerderung, text: `Förderung ${fmt.mio(foerderung)} · ${fmt.prozent(quote)}` }, { anteil: eigen, text: fmt.prozent(M('fin.eigenmittelquote.A')) }] });
    B.achse80(s, { x: d.xWert(foerderung / 1e6), yOben: my, yUnten: d.plot.y + d.plot.h, text: fmt.zahl(quote * 100) });

    // Rechenweg: drei nummerierte Zeilen in 14 pt, Zeile 2 als Summe. Unter Zeile 1 stehen ohne Nummer und ohne Betrag zwei Hinweise: die
    // Bemessungsgrenze (seit der Änderungsrunde vom 13.11.2026, F14.1; oben geprüft: die Herstellungskosten je m² liegen darunter) und an der Stelle
    // der früheren Zeile „Grundstück“ der Hinweis zum Grundstück. Der Titel steht als Text in der leeren Kopfzeile des Rechenblatts (nach der
    // Tabelle angelegt, damit er in PowerPoint obenauf liegt und anklickbar bleibt). Die beiden Hinweise stehen als zwei Zeilen in einer Zeile
    // des Rechenblatts (Hinweiszeilen haben keine Linie; als zwei Tabellenzeilen setzte LibreOffice jede 0,31 hoch, und der Hinweiskasten passte
    // nicht mehr in die Inhaltszone). Zeilen und Abstände sind enger als bis 13.11.2026 (Zeilen 0,34 statt 0,35, Abstand zum Diagramm 0,03 statt
    // 0,12): Darunter steht der Hinweiskasten
    const yT = +(y0 + 0.30 + 1.17 + 0.03).toFixed(3);
    const t = B.rechenblatt(s, { x: x0, y: yT, w: w8, kopf: ['', ''], wertBreite: 1.60, zeilenH: 0.34, name: 'Rechenblatt Rechenweg', zeilen: [
      { nr: 1, text: `Herstellungskosten, ${fmt.qm(M('eingabe.wohnflaeche'))} × ${fmt.euro(kostenQm)}`, werte: [fmt.zahl(M('fin.herstellungskosten'))] },
      { text: ctx.wortlaut(`Bemessungsgrenze ${fmt.euro(grenze)} je m²: eingehalten`, 'Hinweis im Rechenweg') + '\n' +
        ctx.wortlaut('Grundstück im Bestand, nicht angesetzt', 'Hinweis im Rechenweg'), werte: [''], art: 'notiz' },
      { nr: 2, zeichen: '=', text: 'zuwendungsfähige Kosten', werte: [fmt.zahl(M('fin.zuwendungsfaehige_kosten.A'))], art: 'summe' },
      { nr: 3, text: `Eigenmittel, mindestens ${fmt.prozent(M('fin.eigenmittelquote.A'))}`, werte: [fmt.zahl(eigen)] }] });
    B.linie(s, { x: x0, y: yT, w: w8, art: 'modul', name: 'Modulkopf-Linie' });
    // Der Titel steht 0,03 über der Mitte der Kopfzeile: Gemischt gesetzt hat er Unterlängen („g“, Komma), die sonst auf der Kopflinie der Tabelle säßen
    B.text(s, 'Rechenweg, in €', { x: x0, y: yT + 0.03, w: w8 - 1.70, h: 0.26, rolle: 'diagrammtitel', valign: 'middle', einzeilig: true, name: 'Modultitel' });
    // Hinweiskasten direkt unter dem Rechenblatt und so breit wie dieses (G8, F14.2): die beiden Sätze zu den Eigenmitteln, je Satz eine Zeile.
    // Die Regel zur Hälfte der Eigenmittel bleibt; weil das Grundstück nicht angesetzt ist, sind die Eigenmittel der Rechnung ganz Geld (oben
    // geprüft: fin.eigenmittel_bar gleich fin.eigenmittel.A). Der dritte Satz der früheren Notiz (Abstand zur Bemessungsgrenze) entfällt: Die
    // Bemessungsgrenze steht jetzt im Rechenweg
    const h = B.hinweis(s, { x: x0, y: t.unten + 0.04, w: w8, name: 'Eigenmittel', text:
      ctx.wortlaut(`Von den Eigenmitteln sollen mindestens ${fmt.euro(eigen * X('rechnung', 'eigenmittel.anteil_geld_oder_grundstueck'))} Geld oder lastenfreies Grundstück sein.`, 'Hinweiskasten') + '\n' +
      ctx.wortlaut('In dieser Rechnung sind die Eigenmittel ganz Geld, weil das Grundstück nicht angesetzt ist.', 'Hinweiskasten') });
    R.pruefe(h.unten <= Y.inhaltEnde + 0.001, `Folie 14: Der Hinweiskasten endet bei ${h.unten.toFixed(2)} Zoll, unter der Inhaltszone (${Y.inhaltEnde}).`);

    // Kennzahlen je Wohnung: die zweite beginnt auf der Linie unter dem Titel des Rechenblatts
    B.kennzahl(s, { x: colX(9), y: y0, w: span(4), vorsatz: 'bis zu', zahl: fmt.zahl(M('fin.zuschuss_je_wohnung.A')), einheit: '€', label: 'Ø Zuschuss je Wohnung', text: 'plus Darlehen in gleicher Höhe' });
    B.kennzahl(s, { x: colX(9), y: yT + t.kopfH, w: span(4), vorsatz: 'mind.', zahl: fmt.zahl(M('fin.eigenmittel_je_wohnung.A')), einheit: '€', label: 'Ø Eigenmittel je Wohnung',
      text: `${fmt.prozent(M('fin.eigenmittelquote.A'))} von ${fmt.euro(kosten / wohnungen)} je Wohnung` });   // die Summe heißt im Rechenblatt „zuwendungsfähige Kosten“; deshalb hier ohne „Gesamtkosten“
  },
};
