// Gemeinsame Teile der Folien 3 (einstieg-baukosten) und 22 (pgn-baukosten) in der Fassung mit allen sieben Kostengruppen. Kein Folienmodul.
// Beide Folien zeigen die Kostengruppen in der Reihenfolge der Altfassung über die ganze Inhaltsbreite: über jeder Gruppe eine Zeile mit der
// Veränderung in %, darunter das Diagramm, unter der Achse Name und Kostengruppe in zwei Zeilen. Keine Tabelle. Beide Folien zeichnen
// dasselbe Diagramm (spannen): je Gruppe zwei Säulen mit Sockel, Spanne und Median.
//   LAGE                         feste Höhen: Prozentzeile, Diagramm, Plotfläche
//   prozentzeile(ctx, s, o)      Zeile der Veränderungen über den Gruppen, mit Bezeichnung links und Haarlinie darunter
//   kategorien(ctx, s, o)        Name (12 pt) und Kostengruppe (11 pt grau) unter der Achse
//   trenner(ctx, s, o)           senkrechte Haarlinie, die die Summe (Herstellung) von den Einzelgruppen absetzt
//   spannen(ctx, s, o)           das Diagramm der Kostenspannen mit Sockel, Spanne und Median, auf beiden Folien dasselbe
//   legende(ctx, s, o)           Legende mit zwei Reihen und dem Zeichen für Spanne und Median
// Hier steht keine Zahl mit Aussage; Werte und Texte kommen aus den Modulen.
'use strict';

// Höhen in Zoll: Die Legende steht bei ZONE.diagramm.legende (2,80) wie auf den übrigen Diagrammfolien; das Diagramm beginnt bei 3,06 und
// endet mit der Inhaltszone (6,50). Prozentzeile 3,10 bis 3,40, Haarlinie bei 3,44, Plotfläche ab 3,52; unter der Plotfläche 0,46 für
// die zwei Zeilen der Kategorien.
const LAGE = { zeile: 3.10, zeileH: 0.30, linie: 3.44, chartY: 3.06, chartH: 3.44, randO: 0.46, randU: 0.46 };

function prozentzeile(ctx, s, o) {
  const { B } = ctx;
  if (o.label) B.text(s, o.label, { x: o.labelX, y: LAGE.zeile, w: o.labelW, h: LAGE.zeileH, rolle: 'label', valign: 'middle', einzeilig: true, name: 'Prozentzeile Bezeichnung' });
  for (const e of o.eintraege) {
    const w = 1.10;
    B.text(s, e.text, { x: e.x - w / 2, y: LAGE.zeile, w, h: LAGE.zeileH, rolle: e.akzent ? 'wertGross' : 'wert', farbe: e.akzent ? 'akzent' : 'titel', align: 'center', valign: 'middle', einzeilig: true,
      name: 'Veränderung ' + e.name });
  }
  if (o.linie) B.linie(s, { x: o.linie.x0, y: LAGE.linie, w: o.linie.x1 - o.linie.x0, art: 'haar', name: 'Prozentzeile Linie' });
}

function kategorien(ctx, s, o) {
  const { B } = ctx;
  for (const e of o.eintraege) {
    B.text(s, e.name, { x: e.x - e.w / 2, y: o.y, w: e.w, h: 0.22, rolle: 'bezeichnung', align: 'center', valign: 'middle', einzeilig: true, name: 'Kategorie ' + e.name });
    B.text(s, e.kg, { x: e.x - e.w / 2, y: o.y + 0.21, w: e.w, h: 0.20, rolle: 'achse', align: 'center', valign: 'middle', einzeilig: true, name: 'Kategorie Zusatz ' + e.name });
  }
  return { unten: o.y + 0.41 };
}

function trenner(ctx, s, o) {
  ctx.B.linie(s, { x: o.x, y: o.y0, h: o.y1 - o.y0, art: 'haar', farbe: ctx.HEX.grau300, pt: 0.75, name: o.name || 'Trenner Summe' });
}

// Diagramm der Kostenspannen, auf beiden Folien dasselbe: über zwölf Spalten, eine Größenachse, acht Gruppenplätze (Summe, ein leerer Platz als
// Abstand, sechs Kostengruppen) zu je fünf Kategorien [Abstand, Reihe 1, Abstand, Reihe 2, Abstand]. Je Säule unten der Sockel von null bis zum
// kleinsten Wert (hellste Graufläche ohne Kontur, kein Eintrag in der Legende), darüber die Spanne vom kleinsten zum größten Wert in der Art
// ihrer Reihe; der Median als Strich in Tinte quer über der Spanne, sein Wert mittig über der Säule. Darüber die Prozentzeile, darunter Name und
// Kostengruppe. Die Grundlinie liegt über dem Sockel.
// o: { name, achse, achsentitel, label (Bezeichnung der Prozentzeile), altText,
//      reihen: [{ key, name (Reihenname im Diagramm), art }, …zwei],
//      gruppen: [{ name, kurz, kg, werte: { [key]: { min, median, max } | null }, text (Prozentwert), akzent }] }
function spannen(ctx, s, o) {
  const { B, D, fmt, colX, span, P, C } = ctx, z = v => fmt.zahl(v), { gruppen, reihen } = o;
  const plaetze = [gruppen[0], null, ...gruppen.slice(1)], SLOT = 5, STELLE = [1, 3];
  const kat = plaetze.flatMap(g => [null, g && { g, r: 0 }, null, g && { g, r: 1 }, null]);
  const sp = c => (c ? c.g.werte[reihen[c.r].key] : null), wert = (c, fn) => (sp(c) ? fn(sp(c)) : 0);
  for (const g of gruppen) for (const r of reihen) {
    const v = g.werte[r.key];
    if (v && !(v.min <= v.median && v.median <= v.max)) P.melde(`${g.name}, ${r.name}: Spanne nicht geordnet.`);
    if (v && v.max > o.achse.max) P.melde(`${g.name}, ${r.name}: Die Spanne reicht über die Größenachse.`);
  }
  const dr = [{ name: 'Sockel bis Minimum', art: 'sockel', werte: kat.map(c => wert(c, v => v.min)) }];
  reihen.forEach((r, j) => {
    dr.push({ name: `${r.name} Minimum bis Median`, art: r.art, werte: kat.map(c => (c && c.r === j ? wert(c, v => v.median - v.min) : 0)) });
    dr.push({ name: `${r.name} Median bis Maximum`, art: r.art, werte: kat.map(c => (c && c.r === j ? wert(c, v => v.max - v.median) : 0)) });
  });
  const d = D.stapelSaeulen(s, { x: colX(1), y: LAGE.chartY, w: span(12), h: LAGE.chartH, kategorien: kat.map(c => (c ? `${c.g.name} · ${reihen[c.r].name}` : ' ')), katAchse: false, fein: true,
    saeule: 0.26, labels: false, rand: { l: 0.80, r: 0.02, o: LAGE.randO, u: LAGE.randU }, name: o.name, achse: o.achse, reihen: dr, altText: o.altText });
  B.achsentitel(s, d, { y: o.achsentitel });

  // Mitte einer Gruppe = Mitte der Lücke zwischen ihren beiden Säulen
  const slot = d.plot.w / kat.length, platz = g => plaetze.indexOf(g), mitte = g => d.plot.x + slot * (SLOT * platz(g) + SLOT / 2), unten = d.plot.y + d.plot.h;
  prozentzeile(ctx, s, { label: o.label, labelX: colX(1), labelW: 0.95, eintraege: gruppen.map(g => ({ x: mitte(g), text: g.text, akzent: !!g.akzent, name: g.name })) });
  trenner(ctx, s, { x: d.plot.x + slot * (SLOT * 1 + SLOT / 2), y0: LAGE.zeile, y1: unten + 0.46 });
  kategorien(ctx, s, { y: unten + 0.05, eintraege: gruppen.map(g => ({ x: mitte(g), w: slot * SLOT + 0.10, name: g.kurz, kg: g.kg })) });
  // Grundlinie über dem Sockel: Die helle Fläche des Sockels läge sonst auf der Linie der Achse und unterbräche sie
  B.linie(s, { x: d.plot.x, y: unten, w: d.plot.w, art: 'tinte', name: 'Grundlinie über dem Sockel' });

  // Median: Strich quer über der Spanne (0,04 Zoll über die Säule hinaus; auf einer Spanne in Tinte zeichnet eine weiße Linie ihn nach, wenn
  // die Spanne hoch genug ist), Wert mittig über dem größten Wert der Säule im Ton ihrer Reihe. Ohne Werte steht ein Halbgeviertstrich
  for (const g of gruppen) reihen.forEach((r, j) => {
    const v = g.werte[r.key], links = d.plot.x + slot * (SLOT * platz(g) + STELLE[j]) + (slot - d.saeulenBreite) / 2, cx = links + d.saeulenBreite / 2;
    if (!v) { B.text(s, '–', { x: cx - 0.20, y: unten - 0.27, w: 0.40, h: 0.22, rolle: 'wert', farbe: 'sekundaer', align: 'center', valign: 'middle', einzeilig: true, name: `Wert ${g.name} ${r.key} leer` }); return; }
    const ym = d.yWert(v.median), hoch = d.yWert(v.min) - d.yWert(v.max), tw = 0.54;
    B.linie(s, { x: links - 0.04, y: ym, w: d.saeulenBreite + 0.08, art: 'tinte', pt: 2, farbe: C.tinte, name: `Medianstrich ${g.name} ${r.key}` });
    if (r.art === 'tinte' && hoch >= 0.16) B.linie(s, { x: links + 0.015, y: ym, w: d.saeulenBreite - 0.03, art: 'tinte', pt: 1, farbe: 'FFFFFF', name: `Medianlinie ${g.name} ${r.key}` });
    B.textAufPlot(s, z(v.median), { x: cx - tw / 2, y: d.yWert(v.max) - 0.25, w: tw, h: 0.22, rolle: 'wert', farbe: D.ART[r.art].wert, align: 'center', valign: 'middle', name: `Median ${g.name} ${r.key}` });
  });
  return d;
}

// Legende beider Folien: zwei Felder in der Art der Reihen und das Zeichen für Spanne und Median; der Sockel hat keinen Eintrag
function legende(ctx, s, o) {
  const { B, HEX, ZONE, colX } = ctx, yL = ZONE.diagramm.legende;
  const leg = B.legende(s, { x: colX(1), y: yL, fein: true, eintraege: o.eintraege }), gx = leg.rechts + 0.30;
  s.addShape(ctx.pres.ShapeType.rect, { x: gx + 0.08, y: yL + 0.01, w: 0.12, h: 0.22, fill: { color: HEX.papier }, line: { color: HEX.tinte, width: 0.5 }, objectName: 'Legende Spanne' });
  B.linie(s, { x: gx + 0.04, y: yL + 0.10, w: 0.20, art: 'tinte', pt: 2, name: 'Legende Medianlinie' });
  B.text(s, o.spanne, { x: gx + 0.36, y: yL, w: 5.0, h: 0.24, rolle: 'legende', valign: 'middle', einzeilig: true, name: 'Legendentext Spanne' });
}

module.exports = { LAGE, prozentzeile, kategorien, trenner, spannen, legende };
