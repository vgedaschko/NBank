// Feine Beschriftung für das Liniendiagramm der Folie 4 (ausgangslage-zinsen). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs.
// Alles hier sind Formen über oder neben der Plotfläche; die Lagen kommen aus der Rückgabe von D.linien (plot, yWert, katMitte).
//   STRICH            Linienstärke der Reihen; Legende und Werteblock zeichnen ihre Linienstücke in derselben Stärke und in den Tönen des Diagramms
//   legendeMitWerten  Legendenzeile: Bezeichnung des Stands, dann je Reihe Linienstück, Bezeichnung und Wert
//   feineMarke        senkrechte Marke als feine gestrichelte Linie in Referenzgrau
//   werteblock        Werte an einer Marke untereinander: Kopf, darunter je Reihe Linienstück, Bezeichnung und Wert, rechtsbündig links der Marke
//   blockOben         Oberkante eines Werteblocks, bei der eine Gitterlinie in der Fuge zwischen zwei Zeilen läuft und keine Zahl schneidet
//   endpunkt          Punkt am Ende einer Linie in der Farbe der Reihe (der heutige Stand)
//   jahresstriche     kurze Striche unter der Achse an jedem beschrifteten Jahr (zu B.achstexte)
'use strict';
const { breite } = require('../lib/passpruefung.cjs');

const STRICH = 1.5;                 // Linienstärke der Reihen in pt; Legende und Werteblock zeichnen ihre Linienstücke in derselben Stärke
const KOPF_H = 0.22, ZEILE = 0.23;  // Werteblock: Höhe des Kopfs und Zeilenabstand in Zoll
const GRUNDLINIE_TEXT = 0.012;      // Work Sans steht in gleich hohen, mittig verankerten Feldern etwas tiefer als Montserrat (wie B.bezeichnungMitWert)
// Farbe einer Reihenart, wie das Diagramm sie führt (D.ART)
const farbe = (ctx, art) => (ctx.D.ART[art] || (() => { throw new Error(`Folie 4: Die Reihenart „${art}“ gibt es nicht (${Object.keys(ctx.D.ART).join(', ')}).`); })()).farbe;

function linienstueck(ctx, s, o) {
  s.addShape(ctx.pres.ShapeType.line, { x: o.x, y: o.y, w: o.w, h: 0, line: { color: farbe(ctx, o.art), width: STRICH }, objectName: o.name });
}

// o: { x, y, wMax, kopf (Bezeichnung des Stands, etwa „Juli 2026“), eintraege: [{ name, wert (fertiger Text), art }] }. Rückgabe: { rechts }
// Mit wMax bleibt die Zeile in der Breite des Diagramms: Ein langer Monatsname („November 2026“) zieht die Abstände zwischen den Einträgen
// von 0,30 bis auf 0,16 Zoll zusammen; reicht auch das nicht, meldet der Bau die Stelle.
function legendeMitWerten(ctx, s, o) {
  const { B } = ctx, h = 0.24, st = B.stil('legende'), wt = B.stil('wert'), bk = B.stil('bezeichnung');
  const b = (t, stil) => +(breite(B.schutz(t), stil) + 0.04).toFixed(3);
  let x = o.x, luecke = 0.30, nachKopf = 0.22;
  if (o.wMax) {
    const fest = (o.kopf ? b(o.kopf, bk) : 0) + o.eintraege.reduce((sum, e) => sum + 0.33 + b(e.name, st) + 0.05 + b(e.wert, wt), 0), n = Math.max(1, o.eintraege.length - 1);
    luecke = Math.min(0.30, (o.wMax - fest - (o.kopf ? nachKopf : 0)) / n);
    if (luecke < 0.22 && o.kopf) { nachKopf = 0.18; luecke = Math.min(0.30, (o.wMax - fest - nachKopf) / n); }
    if (luecke < 0.16) { ctx.P.melde(`Legende mit Werten: Die Zeile braucht ${ctx.fmt.zahl(fest + nachKopf + n * 0.16, 2)} Zoll, Platz sind ${ctx.fmt.zahl(o.wMax, 2)} Zoll.`); luecke = 0.16; }
  }
  if (o.kopf) { const w = b(o.kopf, bk); B.text(s, o.kopf, { x, y: o.y - GRUNDLINIE_TEXT, w, h, rolle: 'bezeichnung', valign: 'middle', einzeilig: true, name: 'Legende Stand' }); x += w + nachKopf; }
  for (const e of o.eintraege) {
    const nw = b(e.name, st), ww = b(e.wert, wt);
    linienstueck(ctx, s, { x, y: o.y + h / 2, w: 0.26, art: e.art, name: `Legende Linie ${e.name}` });
    B.text(s, e.name, { x: x + 0.33, y: o.y - GRUNDLINIE_TEXT, w: nw, h, rolle: 'legende', valign: 'middle', einzeilig: true, name: `Legende ${e.name}` });
    B.text(s, e.wert, { x: x + 0.33 + nw + 0.05, y: o.y, w: ww, h, rolle: 'wert', valign: 'middle', einzeilig: true, name: `Legende Wert ${e.name}` });
    x += 0.33 + nw + 0.05 + ww + luecke;
  }
  return { rechts: x - luecke };
}

// o: { x, y, h, name }
function feineMarke(ctx, s, o) {
  ctx.B.linie(s, { x: o.x, y: o.y, h: o.h, art: 'referenz', pt: 0.5, strich: 'dash', name: `${o.name || 'Marke'} Linie` });
}

// Oberkante eines Werteblocks so, dass die Gitterlinie bei yGitter mitten in der Fuge nach der Zeile „nach“ (1 bis 3) läuft
const blockOben = (yGitter, nach) => yGitter - KOPF_H - nach * ZEILE;
const blockHoehe = zeilen => KOPF_H + zeilen * ZEILE;

// o: { xMarke, y (Oberkante), kopf, eintraege: [{ name, wert, art }], name }. Der Block steht rechtsbündig 0,10 Zoll links der Marke.
// Rückgabe: { x, y, w, h, unten }
function werteblock(ctx, s, o) {
  const { B } = ctx, name = o.name || 'Werteblock', nb = 0.68, wb = 0.62, ls = 0.16, w = ls + 0.06 + nb + 0.04 + wb, x = o.xMarke - 0.10 - w, h = 0.20;
  B.text(s, o.kopf, { x, y: o.y, w, h: KOPF_H, rolle: 'bezeichnung', align: 'right', valign: 'middle', einzeilig: true, name: `${name} Kopf` });
  o.eintraege.forEach((e, i) => {
    const y = o.y + KOPF_H + i * ZEILE + (ZEILE - h) / 2;
    linienstueck(ctx, s, { x, y: y + h / 2, w: ls, art: e.art, name: `${name} Linie ${e.name}` });
    B.text(s, e.name, { x: x + ls + 0.06, y: y - GRUNDLINIE_TEXT, w: nb, h, rolle: 'achse', valign: 'middle', einzeilig: true, name: `${name} ${e.name}` });
    B.text(s, e.wert, { x: x + w - wb, y, w: wb, h, rolle: 'wert', align: 'right', valign: 'middle', einzeilig: true, name: `${name} Wert ${e.name}` });
  });
  return { x, y: o.y, w, h: blockHoehe(o.eintraege.length), unten: o.y + blockHoehe(o.eintraege.length) };
}

// o: { cx, cy, art, name }: Scheibe 0,11 Zoll in der Farbe der Reihe mit schmalem Rand in der Grundfarbe
function endpunkt(ctx, s, o) {
  const d = 0.11;
  s.addShape(ctx.pres.ShapeType.ellipse, { x: o.cx - d / 2, y: o.cy - d / 2, w: d, h: d, fill: { color: farbe(ctx, o.art) }, line: { color: ctx.farben.fuge, width: 0.75 }, objectName: o.name || 'Punkt am Linienende' });
}

// d: Rückgabe von D.linien mit katLabels: { formen: [...] }. Je beschriftete Kategorie ein Strich von 0,05 Zoll unter der Achse (0,5 pt, Tinte)
function jahresstriche(ctx, s, d) {
  for (const e of d.katTexte) ctx.B.linie(s, { x: d.katMitte(e.i), y: d.plot.y + d.plot.h, h: 0.05, art: 'tinte', pt: 0.5, name: `Jahresstrich ${e.text}` });
}

module.exports = { STRICH, legendeMitWerten, feineMarke, werteblock, blockOben, endpunkt, jahresstriche };
