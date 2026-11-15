// Gemeinsame Bausteine der Einstiegsfolie zum Modellhaus: Fakten aus der Konzepte-Mappe (Eingaben, Konzepte) und das Bild der Visualisierung
// (PGN-Projekt in Neu Wulmstorf, Datei aus den Assets der Broschüre, hier kopiert). Die Bildecke „Visualisierung“ wie B.bild im Vortrag.
'use strict';
const path = require('path');
const BILD = path.join(__dirname, '..', 'bilder', 'modellhaus-neu-wulmstorf.jpg');   // 1800 × 740

function fakten(ctx) {
  const { fmt } = ctx, a = k => ctx.wert('annahme.' + k);
  const we = a('wohnungen'), wf = a('wohnflaeche'), gk = ctx.wert('n5.gesamtkosten.A');
  ctx.gleich('Gesamtkosten = Herstellungskosten je m² × Wohnfläche (Grundstück 0, KG 800 0)', a('herstellungskosten_qm') * wf, gk, 0);
  ctx.pruefe(a('grundstueck') === 0 && a('eh40') === 'nein' && a('mietenstufe') === 'VI', 'Grundstück, Standard oder Mietenstufe stimmen nicht mehr.');
  return { we, wf, schnitt: wf / we, kostenQm: a('herstellungskosten_qm'), gk, bezug: a('bezugsjahr'), bindung: a('bindung'), mietenstufe: a('mietenstufe'),
    ort: 'Neu Wulmstorf, Landkreis Harburg', standard: 'Effizienzhaus 55', fmt };
}

// Bild in freier Lage, auf w × h beschnitten (mittig), mit Bildecke
function bild(ctx, s, { x, y, w, h, name }) {
  const hVoll = +(w * 740 / 1800).toFixed(3), hoch = h > hVoll;
  // Bei einem Ausschnitt höher als das Bildverhältnis wird das Bild in der Höhe gefüllt und seitlich beschnitten
  const wVoll = hoch ? +(h * 1800 / 740).toFixed(3) : w;
  // Das Bild trägt seine volle Höhe (Verhältnis 1800 : 740); sichtbar ist nur der Ausschnitt w × h. Die Zonenprüfung sieht die volle Höhe
  if (!hoch && h < hVoll) ctx.zoneAusnahme(name || 'Bild Modellhaus', 'Bild auf einen Ausschnitt beschnitten; sichtbar bis zur Unterkante des Ausschnitts');
  s.addImage({ path: BILD, x, y, w: hoch ? wVoll : w, h: hoch ? h : hVoll, sizing: { type: 'cover', w, h }, objectName: name || 'Bild Modellhaus',
    altText: 'Visualisierung des Modellhauses: dreigeschossiges Mehrfamilienhaus aus rotem Klinker mit Flachdach und Balkonen, davor Stellplätze und Grün.' });
  s.addText('Visualisierung', { shape: ctx.pres.ShapeType.rect, x: x + w - 1.25, y: y + h - 0.26, w: 1.25, h: 0.26, margin: 0, align: 'center', valign: 'middle',
    fontFace: ctx.F.medium, fontSize: 10, color: ctx.C.grau, fill: { color: ctx.C.weiss }, line: { type: 'none' }, objectName: 'Bildecke Visualisierung' });
}

module.exports = { fakten, bild };
