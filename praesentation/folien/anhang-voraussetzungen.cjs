// Folie A2 · PGN_ANHANG: sechs Voraussetzungen für Programmteil 2.1 als Prüfliste über sieben Spalten (Broschüre S. 4), rechts über fünf Spalten
// die Bedarfslage der NBank-Karte als Ringdiagramm mit direkter Beschriftung (Broschüre S. 18). In der Ringmitte der QR-Code zur aktuellen Karte
// (seit der Änderungsrunde vom 13.11.2026, F32.1; derselbe Code wie in der Broschüre), darunter „Aktuelle Karte“ und der Hinweiskasten (G8).
// Kein Rot, keine Karte.
// Texte und Zahlen aus daten/umsetzung.json; der Eigenmittelsatz aus daten/werte.json.
'use strict';
const { lies } = require('./_umsetzung.cjs');

module.exports = {
  id: 'anhang-voraussetzungen',
  bau(ctx) {
    const { B, D, X, fmt, colX, span, Y } = ctx, s = ctx.folie(), U = lies(ctx), y0 = Y.anhangInhalt;

    // ---- Prüfliste über sieben Spalten: zwei Spalten zu je drei Fragen ---------------------------------------------------
    const fragen = U('voraussetzungen.fragen');
    fragen.forEach((f, i) => { ctx.wortlaut(f.frage, `Frage ${i + 1}`); if (f.zusatz) ctx.wortlaut(f.zusatz, `Frage ${i + 1}, Zusatz`); });
    const yListe = B.modulkopf(s, { x: colX(1), y: y0, w: span(7), titel: ctx.wortlaut(U('voraussetzungen.titel'), 'Modultitel') }) + 0.10;
    const ZEILE = 1.40;                                       // drei Zeilen füllen die Inhaltszone bis y 6,26
    const liste = B.pruefliste(s, { x: colX(1), y: yListe, w: span(7), spalten: 2, zeilenH: ZEILE, punkte: fragen.map(f => ({ frage: f.frage, zusatz: f.zusatz })) });

    // ---- Ringdiagramm über fünf Spalten -------------------------------------------------------------------------------
    const x = colX(8), w = span(5);
    const yKopf = B.modulkopf(s, { x, y: y0, w, titel: ctx.wortlaut(U('bedarf.titel'), 'Diagrammtitel'), sub: ctx.wortlaut(U('bedarf.bezug'), 'Untertitel') });
    const seg = ['gegeben', 'nachweis'].map((k, i) => ({ wert: X('umsetzung', 'bedarf.' + k), name: ctx.wortlaut(X('umsetzung', `bedarf.${k}.bezeichnung`), 'Segment'), art: i ? 'referenz' : 'tinte' }));
    seg.forEach(g => ctx.wortlaut(fmt.zahl(g.wert), 'Segmentwert'));
    // Unter dem Ring stehen die Beschriftung des QR-Codes und der Hinweiskasten (G8, so breit wie die Spalte des Diagramms); der Kasten schließt mit
    // der Unterkante der Prüfliste, die Beschriftung steht direkt unter dem Ring. Feld des Rings 3,00 statt 2,90 Zoll (seit 13.11.2026): Der
    // QR-Code in der Mitte braucht die Fläche
    const hinweis = ctx.wortlaut(U('bedarf.hinweis'), 'Hinweiskasten unter dem Ring');
    const RING = 3.00, LOCH = 71, H_KARTE = 0.22, hHinweis = B.hinweisHoehe(hinweis, { w }), yHinweis = +(liste.unten - hHinweis).toFixed(3);
    const yKarte = +(yHinweis - 0.16 - H_KARTE).toFixed(3), ringD = RING * 0.80;   // D.ring: Ringdurchmesser 80 % des Felds (Rand 10 % je Seite)
    const yRing = +(yKarte - 0.08 - RING * 0.90).toFixed(3);
    if (yRing + RING * 0.10 < yKopf + 0.15) ctx.P.melde(`Ring: Er beginnt bei y ${(yRing + RING * 0.10).toFixed(2)} und rückt an den Modulkopf (bis y ${yKopf.toFixed(2)}).`);
    // Die Reihe heißt nach dem, was sie zählt (Einheits- und Samtgemeinden); der Name steht im Datenblatt von PowerPoint. Loch 71 % wie in der
    // Broschüre (bis 13.11.2026 62 %): Der QR-Code braucht die Fläche
    const ring = D.ring(s, { x, y: yRing, w: RING, h: RING, loch: LOCH, segmente: seg, name: 'Ringdiagramm Bedarfslage', reihenname: U('bedarf.bezug'),
      altText: `Ringdiagramm: ${seg.map(g => `${fmt.zahl(g.wert)} ${g.name}`).join(', ')}` });
    B.ringWerte(s, { x: x + RING + 0.10, cy: ring.cy, w: w - RING - 0.10, eintraege: seg.map(g => ({ wert: fmt.zahl(g.wert), text: g.name, art: g.art })) });
    // Weiße Scheibe in der Größe des Lochs: In PowerPoint deckt sie sich mit dem Loch des Diagramms; Programme, die die Lochgröße des Diagramms
    // nicht lesen (LibreOffice zeichnet immer 50 %), zeigen so denselben Ring. Sie trägt keinen Text und gilt als Schmuck
    const loch = ringD * LOCH / 100, QR = 1.14;
    s.addShape(ctx.pres.ShapeType.ellipse, { x: +(ring.cx - loch / 2).toFixed(3), y: +(ring.cy - loch / 2).toFixed(3), w: +loch.toFixed(3), h: +loch.toFixed(3), fill: { color: ctx.HEX.weiss }, line: { type: 'none' }, objectName: 'Ringmitte' });
    // QR-Code in der Ringmitte: Das Bild (mit Ruhezone) steht ganz im weißen Loch, auch mit seinen Ecken (halbe Diagonale unter dem Lochradius)
    if (QR * Math.SQRT2 / 2 > loch / 2 - 0.02) ctx.P.melde(`QR-Code: ${QR} Zoll Kante passen nicht in das Loch des Rings (${loch.toFixed(2)} Zoll).`);
    s.addImage({ path: ctx.asset(U('bedarf.qr.bild')), x: +(ring.cx - QR / 2).toFixed(3), y: +(ring.cy - QR / 2).toFixed(3), w: QR, h: QR, altText: U('bedarf.qr.alt_text'), objectName: 'QR-Code Aktuelle Karte' });
    // Beschriftung unter dem Ring, mittig (wie die Broschüre)
    B.text(s, ctx.wortlaut(U('bedarf.qr.beschriftung'), 'Beschriftung des QR-Codes'), { x: +(ring.cx - ringD / 2).toFixed(3), y: yKarte, w: ringD, h: H_KARTE, rolle: 'vorsatz', align: 'center', valign: 'middle', einzeilig: true, name: 'Beschriftung QR-Code' });
    B.hinweis(s, { x, y: liste.unten, w, text: hinweis, unten: true, name: 'Bedarfsbestätigung' });
  },
};
