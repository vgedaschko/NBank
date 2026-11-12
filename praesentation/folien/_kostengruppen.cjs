// Gemeinsame Teile der Folien 3 (einstieg-baukosten) und 22 (pgn-baukosten) in der Fassung mit allen sieben Kostengruppen. Kein Folienmodul.
// Beide Folien zeigen die Kostengruppen in der Reihenfolge der Altfassung über die ganze Inhaltsbreite: über jeder Gruppe eine Zeile mit der
// Veränderung in %, darunter das Diagramm, unter der Achse Name und Kostengruppe in zwei Zeilen. Keine Tabelle.
//   LAGE                         feste Höhen: Prozentzeile, Diagramm, Plotfläche
//   prozentzeile(ctx, s, o)      Zeile der Veränderungen über den Gruppen, mit Bezeichnung links und Haarlinie darunter
//   kategorien(ctx, s, o)        Name (12 pt) und Kostengruppe (11 pt grau) unter der Achse
//   trenner(ctx, s, o)           senkrechte Haarlinie, die die Summe (Herstellung) von den Einzelgruppen absetzt
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

module.exports = { LAGE, prozentzeile, kategorien, trenner };
