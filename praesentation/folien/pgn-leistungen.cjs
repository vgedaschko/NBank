// Folie 27 · PGN_INHALT: Leistungen der PGN über die Leistungsphasen 1 bis 9 (Broschüre S. 20). Dominant der Balkenplan über acht Spalten
// mit der Bewilligungsmarke in Dunkelrot zwischen Leistungsphase 6 und 7; rechts über vier Spalten das Referenzbild Brauerstraße mit Bildecke,
// Bildzeile und Konturstempel und Stichpunkte zur ersten Leistung (seit 13.11.2026, F27.1). Texte, Phasen und Marke aus daten/umsetzung.json.
'use strict';
const { lies } = require('./_umsetzung.cjs');

module.exports = {
  id: 'pgn-leistungen',
  bau(ctx) {
    const { B, P, colX, span, Y, Raster } = ctx, s = ctx.folie(), U = lies(ctx);
    B.text(s, ctx.wortlaut(U('leistungen.deck'), 'Deck'), { x: colX(1), y: Y.deck, w: span(8), h: Y.deckH, rolle: 'deck', valign: 'middle', einzeilig: true, name: 'Deck' });

    // ---- Balkenplan über acht Spalten ---------------------------------------------------------------------------------
    const zeilen = U('leistungen.zeilen'), phasen = U('leistungen.phasen'), nach = U('leistungen.marke.nach');
    for (const z of zeilen) {
      ctx.wortlaut(z.text, `Leistung ${z.nr}`);
      if (z.wort) ctx.wortlaut(z.wort, `Leistung ${z.nr}, Phase im Wortlaut`);
      else ctx.wortlaut(z.bis > z.von ? `Balken ${z.von}–${z.bis}` : `Balken ${z.von}`, `Leistung ${z.nr}, Balken`);
    }
    // Der Satz rechts der Marke hat drei Phasen Breite: Er bricht nach dem Doppelpunkt, damit die Phase allein in der ersten Zeile steht
    const rechts = ctx.wortlaut(U('leistungen.marke.rechts'), 'Satz rechts der Marke').replace(/: /, ':\n');
    // Die Zeilen stehen ohne Nummer: Die Ziffern des Plans sind die Leistungsphasen 1 bis 9; eine zweite Zählung 1 bis 7 daneben verwirrt
    // („6 Bauleitung“ läge unter Leistungsphase 8). labelBreite 3,60 lässt der längsten Bezeichnung und der Achsbezeichnung Luft.
    const plan = B.balkenplan(s, { x: colX(1), y: Y.inhaltNachDeck, w: span(8), labelBreite: 3.60, zeilenH: 0.34, nummern: false,
      kopf: ctx.wortlaut(U('leistungen.kopf'), 'Kopfleiste'), phasen,
      marke: { nach, text: ctx.wortlaut(U('leistungen.marke.text'), 'Marke'), zeichen: U('leistungen.marke.zeichen') },
      links: ctx.wortlaut(U('leistungen.marke.links'), 'Satz links der Marke'), rechts,
      zeilen: zeilen.map(z => (z.wort ? { nr: z.nr, text: z.text, wort: z.wort } : { nr: z.nr, text: z.text, von: z.von, bis: z.bis })) });

    // ---- Rechte Spalte: Referenzbild, Bildzeile, Konturstempel, erste Leistung ------------------------------------------
    // Seit der Änderungsrunde vom 13.11.2026 (F27.1, G9) stehen unter dem Bild Stichpunkte in 14 pt; sie brauchen gut 0,6 Zoll mehr als der Satz
    // davor. Die Spalte beginnt deshalb am Kopf der Inhaltszone neben der Unterzeile (sie gilt dem Plan und steht über acht Spalten), das Bild steht
    // als Ausschnitt 1,26 statt 1,58 Zoll hoch (oben und unten gleich beschnitten), Bildzeile, Konturstempel und Stichpunkte stehen enger.
    const x = colX(9), w = span(4);
    const bild = B.bild(s, { datei: U('referenz.bild'), x, y: Y.inhalt, w, ausschnitt: 1.26, altText: U('referenz.alt_text') });
    // Bildzeile: Der Wortlaut des Konzepts trennt Anschrift und Merkmal mit einem Mittelpunkt. In 10 pt ist die Zeile breiter als vier Spalten;
    // sie bricht deshalb an dieser Stelle, der Mittelpunkt entfällt am Zeilenende (wie in der Bildunterschrift der Broschüre, S. 1).
    const anschrift = U('referenz.anschrift'), merkmal = U('referenz.merkmal');
    ctx.wortlaut(`${anschrift} · ${merkmal}`, 'Bildzeile');
    const zeile = B.text(s, `${anschrift}\n${merkmal}`, { x, y: bild.unten + 0.05, w, rolle: 'label', name: 'Bildzeile' });
    const stempel = { y: zeile.unten + 0.06, h: 0.36 };
    B.konturstempel(s, { x, y: stempel.y, w: 3.0, text: ctx.wortlaut(U('referenz.vermerk'), 'Konturstempel') });
    // Erste Leistung seit der Änderungsrunde vom 13.11.2026 (F27.1, G9) als Stichpunkte in 14 pt; die Überschrift bricht nach dem Doppelpunkt
    const titel = ctx.wortlaut(U('leistungen.erste_leistung.titel'), 'Überschrift der Stichpunkte');
    const legende = B.stichpunkte(s, { x, y: stempel.y + stempel.h + 0.10, w, linie: true, punktAbstand: 3, gruppen: [
      { titel: titel.replace(/: /, ':\n'), punkte: U('leistungen.erste_leistung.punkte').map(p => ctx.wortlaut(p, 'Stichpunkt')) }] });
    if (Math.max(plan.unten, legende.unten) > Y.inhaltEnde) P.melde(`Leistungen: Der Inhalt endet bei y ${Math.max(plan.unten, legende.unten).toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
  },
};
