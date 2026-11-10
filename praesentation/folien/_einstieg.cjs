// Hilfsfunktionen der Baugruppe „einstieg“ (Folien 3 bis 6). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
// Die vier Folien haben denselben Aufbau: links über acht Spalten das Diagramm, rechts über vier Spalten die Hauptzahl (60 pt) an fester
// Stelle und darunter ab y 4,40 ein zweites Modul (zweite Kennzahl oder Rechenweg). Lage und Bausteine dazu stehen in lib/:
// ZONE.diagramm.spalte, B.hauptzahl, B.nebenzahl, B.zweitesModul; dazu B.massketteSenkrecht, B.zuleitung, D.saeulen mit arten,
// fmt.monatKurz, fmt.monatWort und ctx.mittel. Die Diagramme sind fein gezeichnet: Säulen mit fein: true (Kontur, helle Fläche für den
// Bezugswert; Folien 3, 5 und 6), Linien in 1,5 pt mit weicher Fläche (Folie 4; ihre Beschriftung steht in _fein_ausgangslage-zinsen.cjs).
// Je Diagramm trägt genau eine Größe Rot: die, die das Signaturwort des Titels nennt.
//   felder, lies   Zugriff auf daten/markt.json mit gefüllten Platzhaltern ({name}) für die Folien 4 und 6; „mappe_…“ kommt aus daten/werte.json
'use strict';

// Zahlen, die in den Texten von daten/markt.json (Blöcke zinsen und markt) als Platzhalter stehen. Jede Zahl hat genau eine Quelle:
// daten/markt.json (Broschüre oder Altfassung, mit Herkunft) oder daten/werte.json (Vorsatz „mappe_“, Lauf modellhaus).
function felder(ctx) {
  const { X, W, fmt } = ctx, K = p => X('markt', p), monate = K('zinsen.monate'), je = K('markt.je_quadrat');
  return {
    // Folie 4
    zins_von: fmt.monatKurz(monate[0]), zins_bis: fmt.monatKurz(monate[monate.length - 1]), mappe_zinsbindung: String(W('modellhaus', 'eingabe.zinsbindung')),
    // Folie 6 (Jahreszahlen ohne Tausenderpunkt)
    seit: String(K('markt.seit')), bis: String(K('markt.bis')), von_jahr: String(K('bestand.von')), bis_jahr: String(K('bestand.bis')),
    ausgelaufen: fmt.zahl(K('markt.ausgelaufen')), neu_rund: fmt.zahl(Math.round(K('markt.neu_gefoerdert') / je) * je),
  };
}
// const U = lies(ctx); U('markt.texte.kennzahl_text'). Der zweite Parameter gibt weitere Felder mit (zum Beispiel die Werte einer Marke).
const lies = ctx => ctx.lies('markt', felder(ctx));

module.exports = { felder, lies };
