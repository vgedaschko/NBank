// Maßzeichen der Spanne für Folie 22 (pgn-baukosten). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
// Die Spanne einer Kostengruppe steht als Maßzeichen neben ihrer Säule: Maßlinie vom kleinsten zum größten Wert mit 45°-Strichen, wie die
// senkrechte Maßkette der Folie 5. Liegt der größte Wert über der Größenachse, endet die Maßlinie über der Plotfläche in einer Pfeilspitze
// und nennt den Wert. Die Säulen selbst zeichnet die Bibliothek (D.gruppierteSaeulen mit fein: true), die Felder der Legende B.legende.
//   spanne(ctx, s, o)          Maßzeichen der Spanne neben einer Säule
//   legendeSpanne(ctx, s, o)   Eintrag der Legende mit dem Maßzeichen im Kleinen statt eines Farbfelds; schließt rechts an B.legende an
// Hier steht keine Zahl mit Aussage; Werte kommen aus dem Modul (daten/markt.json über X). Maße und Lagen sind Angaben der Zeichnung.
'use strict';
const { breite } = require('../lib/passpruefung.cjs');

const MASS = { pt: 0.75, strich: 1.25, ueber: 0.07 };      // Maßlinie, Maßstrich und Überstand wie B.massketteSenkrecht

// Maßstrich unter 45° auf (x, y), wie an den Maßketten der Bibliothek; halb: halbe Länge in Zoll
const massstrich = (ctx, s, x, y, name, halb = 0.05, pt = MASS.strich) => s.addShape(ctx.pres.ShapeType.line, { x: x - halb, y: y - halb, w: 2 * halb, h: 2 * halb, flipV: true,
  line: { color: ctx.farben.mass, width: pt }, objectName: name });

// Maßzeichen der Spanne neben einer Säule: Maßlinie 0,75 pt vom kleinsten zum größten Wert, an beiden Enden ein Maßstrich unter 45°.
// Liegt der größte Wert über der Plotfläche (yMax über yGrenze), läuft die Maßlinie bis über die Plotfläche und endet in einer Pfeilspitze;
// der Wert steht dann als Text neben der Spitze (bis: fertiger Text, „**fett**“ hebt den Wert hervor).
// o: { x, yMin, yMax (Lagen der beiden Werte in Zoll), yGrenze (Oberkante der Plotfläche), spitze: Lage der Pfeilspitze über der Plotfläche,
//      bis, bisBreite, name }
function spanne(ctx, s, o) {
  const { pres, B, farben } = ctx, name = o.name || 'Spanne';
  if (o.yMax >= o.yGrenze - 0.001) { B.massketteSenkrecht(s, { x: o.x, y0: o.yMin, y1: o.yMax, name: name + ' Maßlinie' }); return { oben: o.yMax - MASS.ueber }; }
  if (!o.bis) throw new Error('spanne: Der größte Wert liegt über der Plotfläche; „bis“ (Text an der Pfeilspitze) fehlt.');
  const oben = o.yGrenze - (o.spitze ?? 0.16), kopf = 0.09;
  s.addShape(pres.ShapeType.line, { x: o.x, y: oben + kopf, w: 0, h: o.yMin + MASS.ueber - oben - kopf, line: { color: farben.mass, width: MASS.pt }, objectName: name + ' Maßlinie' });
  massstrich(ctx, s, o.x, o.yMin, name + ' Maßstrich');
  s.addShape(pres.ShapeType.triangle, { x: o.x - 0.04, y: oben, w: 0.08, h: kopf, fill: { color: farben.mass }, line: { type: 'none' }, objectName: name + ' Pfeilspitze' });
  B.text(s, o.bis, { x: o.x + 0.09, y: oben - 0.06, w: o.bisBreite || 1.0, h: 0.20, rolle: 'achse', farbe: 'sekundaer', valign: 'middle', einzeilig: true, name: name + ' Text' });
  return { oben };
}

// Eintrag der Legende mit dem Maßzeichen der Spanne im Kleinen (Maßlinie über die Höhe der Legendenzeile, zwei Maßstriche) und dem Text in der
// Schrift der Legende. o: { x (linke Kante; nach B.legende: rechts + 0,20), y, text }. Rückgabe: { rechts }
function legendeSpanne(ctx, s, o) {
  const { pres, B, farben } = ctx, feld = 0.12, t = B.schutz(o.text), tw = +(breite(t, B.stil('legende')) + 0.06).toFixed(3);
  s.addShape(pres.ShapeType.line, { x: o.x + feld / 2, y: o.y + 0.01, w: 0, h: 0.22, line: { color: farben.mass, width: MASS.pt }, objectName: 'Legende Maßlinie ' + o.text });
  for (const y of [o.y + 0.05, o.y + 0.19]) massstrich(ctx, s, o.x + feld / 2, y, 'Legende Maßstrich ' + o.text, 0.04, 1);
  B.text(s, o.text, { x: o.x + feld + 0.08, y: o.y, w: tw, h: 0.24, rolle: 'legende', valign: 'middle', einzeilig: true, name: 'Legendentext ' + o.text });
  return { rechts: o.x + feld + 0.08 + tw };
}

module.exports = { spanne, legendeSpanne };
