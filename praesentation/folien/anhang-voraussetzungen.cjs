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
    // Designtest 17.11.2026: zwei Kennzahlen statt des Rings mit zwei Segmenten; der QR-Code steht rechts daneben mit seiner Beschriftung
    const QR = 1.50, wZ = +(w - QR - 0.30).toFixed(3), yZ = +(yKopf + 0.20).toFixed(3);
    let yy = yZ;
    seg.forEach(g => { const k = B.kennzahl(s, { x, y: yy, w: wZ, zahl: fmt.zahl(g.wert), label: g.name, kompakt: true }); yy = +(k.unten + 0.14).toFixed(3); });
    const qx = +(x + w - QR).toFixed(3);
    s.addImage({ path: ctx.asset(U('bedarf.qr.bild')), x: qx, y: yZ, w: QR, h: QR, altText: U('bedarf.qr.alt_text'), objectName: 'QR-Code Aktuelle Karte' });
    B.text(s, ctx.wortlaut(U('bedarf.qr.beschriftung'), 'Beschriftung des QR-Codes'), { x: +(qx - 0.40).toFixed(3), y: +(yZ + QR + 0.06).toFixed(3), w: QR + 0.40, h: 0.22, rolle: 'vorsatz', align: 'right', valign: 'middle', einzeilig: true, name: 'Beschriftung QR-Code' });
    B.hinweis(s, { x, y: liste.unten, w, text: hinweis, unten: true, name: 'Bedarfsbestätigung' });
  },
};
