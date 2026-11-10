// Muster PGN_ANHANG im Wortlaut der Folie A3 des Konzepts: Prüfliste (B.pruefliste) über sieben Spalten mit sechs Fragen in zwei Spalten,
// rechts über fünf Spalten ein Ringdiagramm mit direkter Beschriftung (Zahl als Kernwert, Bezeichnung 12 pt). Werte aus einer Datendatei.
'use strict';
module.exports = {
  id: 'p29-anhang-pruefliste',
  o: { nr: 'A3', layout: 'PGN_ANHANG', titel: 'Sechs Voraussetzungen, darunter Bedarf am Standort', inhalt: 'Kicker: „ANHANG · VORAUSSETZUNGEN“.' },
  bau(ctx) {
    const { B, D, X, W, fmt, colX, span, Y } = ctx, s = ctx.folie(), y0 = Y.anhangInhalt;
    const y = B.modulkopf(s, { x: colX(1), y: y0, w: span(7), titel: 'Grundcheck für Programmteil 2.1' });
    B.pruefliste(s, { x: colX(1), y: y + 0.10, w: span(7), spalten: 2, punkte: [
      { frage: 'Antragsberechtigt, Finanzierung gesichert?' },
      { frage: 'Vor der Bewilligung nicht begonnen?' },
      { frage: 'Mehrfamilienhaus ab drei Wohnungen?' },
      { frage: 'Bedarf am Standort?' },
      { frage: `Mindestens ${fmt.prozent(W('modellhaus', 'tab.eigenmittel_mindestens'))} Eigenmittel?`, zusatz: 'Bezogen auf die zuwendungsfähigen Kosten.' },
      { frage: 'Grundstück gesichert?', zusatz: 'Eigentum, Erbbaurecht oder gesicherter Erwerb.' }] });
    const yr = B.modulkopf(s, { x: colX(8), y: y0, w: span(5), titel: 'Bedarfslage auf der NBank-Karte', sub: 'Einheits- und Samtgemeinden' });
    const a = X('probe', 'bedarf.gegeben'), b = X('probe', 'bedarf.nachweis');
    const r = D.ring(s, { x: colX(8), y: yr + 0.15, w: 2.60, h: 2.60, segmente: [{ name: 'Bedarf gegeben', wert: a, art: 'tinte' }, { name: 'Bedarf gesondert nachweisen', wert: b, art: 'referenz' }], name: 'Ringdiagramm Bedarfslage' });
    B.ringWerte(s, { x: colX(8) + 2.74, cy: r.cy, w: span(5) - 2.74, eintraege: [{ wert: fmt.zahl(a), text: 'Bedarf gegeben', art: 'tinte' }, { wert: fmt.zahl(b), text: 'Bedarf gesondert nachweisen', art: 'referenz' }] });
    B.text(s, 'In beiden Fällen nötig: die einfache Bedarfsbestätigung der Wohnraumförderstelle zum Bauort.', { x: colX(8), y: r.y + r.h + 0.20, w: span(5), rolle: 'kleinText', name: 'Zeile unter dem Ring' });
  },
};
