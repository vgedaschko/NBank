// Festlegungen und Hilfsfunktionen der Baugruppe „rechnung“ (Folien 12 bis 14, 17 bis 19 und 21): Reihenfolge der Gruppen und Läufe, Linien der Gruppen,
// Gegenproben des Wortlauts gegen die Mappe. Kein Folienmodul: Der Build lädt nur folien/<id>.cjs zu den IDs des Konzepts.
// Zahlen der Mappe kommen in den Modulen über W(lauf, schluessel); hier steht keine Zahl mit Aussage.
// Beschriftungen an Diagrammen stehen in lib/: B.segmenttext, B.textAufPlot, B.wertzeilen, B.punkt, B.linienenden; Zahlwörter: ctx.zahlwort.
'use strict';

const G = ['A', 'B', 'C'];
// Die drei Läufe der Kostenfolie in Lesereihenfolge: PGN-Median, Modellhaus, über der Bemessungsgrenze
const KOSTENLAEUFE = ['modellhaus_pgn_kosten', 'modellhaus', 'modellhaus_kosten_5200'];
// Linien der Gruppen wie im ganzen Vortrag: A durchgezogen in Tinte, B gestrichelt in Tinte, C in Referenzgrau
const LINIEN = { A: { art: 'tinte', strich: 'solid' }, B: { art: 'tinte', strich: 'dash' }, C: { art: 'referenz', strich: 'solid' } };

// Fester Wortlaut des Konzepts gegen die Zahlen der Mappe: Passt er nicht mehr, bricht der Bau mit dieser Meldung ab.
function pruefe(ok, text) {
  if (!ok) throw new Error(`Baugruppe rechnung: ${text} Wortlaut im Konzept (daten/outline.json) und im Folienmodul anpassen.`);
}

// Klasse der Mietenstufe, wie die Richtlinie sie führt: I–III oder IV–VII
function mietenstufeKlasse(stufe) {
  const i = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].indexOf(String(stufe));
  if (i < 0) throw new Error(`Baugruppe rechnung: Mietenstufe „${stufe}“ gibt es nicht (I bis VII).`);
  return i < 3 ? 'I–III' : 'IV–VII';
}

// Anteil als Prozent: eine Nachkommastelle nur, wenn der Wert nicht auf ganze Prozent aufgeht (80 %, 77,2 %)
function prozentKurz(fmt, anteil) {
  return fmt.prozent(anteil, Math.abs(anteil * 100 - Math.round(anteil * 100)) < 0.05 ? 0 : 1);
}

// Kostenstand der Annahmen: Basisjahr der Broschüre plus Fortschreibung der Mappe
function kostenstand(ctx) {
  return ctx.X('rechnung', 'kostenstand.basisjahr') + ctx.W('modellhaus', 'eingabe.kostenstand_fortschreibung');
}

// Legende der drei Linien in der Legendenzeile des Layouts PGN_DIAGRAMM(_MR)
function linienLegende(ctx, s) {
  const { B, colX, ZONE } = ctx;
  return B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: G.map(g => ({ text: 'Gruppe ' + g, art: LINIEN[g].art, strich: LINIEN[g].strich })) });
}
// Die drei Reihen eines Liniendiagramms aus einer Funktion g → Werte
const linienReihen = werte => G.map(g => ({ name: 'Gruppe ' + g, werte: werte(g), art: LINIEN[g].art, strich: LINIEN[g].strich }));

module.exports = { G, KOSTENLAEUFE, LINIEN, pruefe, mietenstufeKlasse, prozentKurz, kostenstand, linienLegende, linienReihen };
