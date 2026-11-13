// Folie A2 · PGN_ANHANG: sechs Voraussetzungen für Programmteil 2.1 als Prüfliste über sieben Spalten (Broschüre S. 4), rechts über fünf Spalten
// die Bedarfslage der NBank-Karte als Ringdiagramm mit direkter Beschriftung (Broschüre S. 18). Kein Rot, keine Karte, kein QR-Code.
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
    // Der Ring steht mittig zwischen dem Modulkopf und der Zeile darunter
    const RING = 2.90, H_HINWEIS = 0.50, yHinweis = liste.unten - H_HINWEIS, yRing = +((yKopf + yHinweis - RING) / 2).toFixed(3);
    // Die Reihe heißt nach dem, was sie zählt (Einheits- und Samtgemeinden); der Name steht im Datenblatt von PowerPoint
    const ring = D.ring(s, { x, y: yRing, w: RING, h: RING, segmente: seg, name: 'Ringdiagramm Bedarfslage', reihenname: U('bedarf.bezug'),
      altText: `Ringdiagramm: ${seg.map(g => `${fmt.zahl(g.wert)} ${g.name}`).join(', ')}` });
    B.ringWerte(s, { x: x + RING + 0.14, cy: ring.cy, w: w - RING - 0.14, eintraege: seg.map(g => ({ wert: fmt.zahl(g.wert), text: g.name, art: g.art })) });
    // Die Zeile unter dem Ring schließt mit der Unterkante der Prüfliste
    const hinweis = ctx.wortlaut(U('bedarf.hinweis'), 'Zeile unter dem Ring');
    B.text(s, hinweis, { x, y: yHinweis, w, h: H_HINWEIS, rolle: 'kleinText', valign: 'bottom', name: 'Zeile unter dem Ring' });
  },
};
