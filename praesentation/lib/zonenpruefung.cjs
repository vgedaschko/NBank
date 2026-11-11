// Zonenprüfung: rechnet jede Form einer Folie gegen Folienfläche, Satzspiegel und Inhaltszone.
// Der Build überwacht dazu addText, addShape, addImage, addTable und addChart der Folie. So sind auch direkte Aufrufe von pptxgenjs aus
// den Folienmodulen erfasst, und Lage und Größe stehen in Zoll fest, bevor pptxgenjs die Optionen umrechnet.
// Geprüft wird nach bau(ctx):
//   alle Layouts          Lage und Größe sind Zahlen, die Form liegt auf der Folie, sie trägt einen Namen, Schrift und Schriftgröße sind erlaubt
//   Inhalt und Anhang     Satzspiegel x 0,667 bis 12,667 · unten bis y 6,50 (0,28 Abstand zum Schriftfeld) · oben ab y 1,90 (Anhang 1,50)
// Ausnahmen über den Objektnamen: Daumenregister (rechter Rand); in der Kickerzeile Schlüsselplan, Zusatz der ersten Folie der Modellrechnung und
// Stempel (ein frei gesetzter Stempel in der Inhaltszone ist damit ebenfalls ausgenommen). Maßketten und Beschnittmarken
// dürfen 0,08 Zoll überstehen. Die Quellenzeile (B.quelle, Name „Quellenzeile“) steht im Schriftfeld: Für sie gilt statt der Inhaltszone das freie
// Feld zwischen Satzspiegel und Logo-Feld in der Höhe des Schriftfelds. Weitere Ausnahmen meldet ein Modul mit ctx.zoneAusnahme(name, grund) an;
// der Build nennt sie als Hinweis.
'use strict';
const { W, H, X0, X1, Y, F, ZONE } = require('./theme.cjs');
const { breite } = require('./passpruefung.cjs');

const AUSSEN = /^(Daumenregister|Schlüsselplan|Stempel|Zusatz Modellrechnung)/;
const KNAPP = /^(Maßkette|Maßstrich|Maßhilfslinie|Beschnittmarke)/;
const IM_SCHRIFTFELD = /^Quellenzeile$/;
const SCHRIFTEN = new Set(Object.values(F));
const istZahl = v => typeof v === 'number' && isFinite(v);
const k2 = v => v.toFixed(2).replace('.', ',');

// Breite eines einzeiligen, freien Textes (ohne Fläche und Kontur) in Zoll; null, wenn der Text mehrzeilig ist oder sich nicht rechnen lässt
function einzeiligeBreite(text, o) {
  try {
    const basis = { fontFace: o.fontFace || F.text, bold: !!o.bold, italic: !!o.italic, fontSize: o.fontSize || 18, weite: o.charSpacing || 0 };
    const runs = Array.isArray(text) ? text : [{ text: String(text ?? ''), options: {} }];
    let b = 0;
    for (let i = 0; i < runs.length; i++) {
      const r = runs[i] || {}, ro = r.options || {}, t = String(r.text ?? '');
      if (t.includes('\n') || ro.bullet || (ro.breakLine && i < runs.length - 1)) return null;
      b += breite(t, { fontFace: ro.fontFace || basis.fontFace, bold: ro.bold ?? basis.bold, italic: ro.italic ?? basis.italic, fontSize: ro.fontSize || basis.fontSize, weite: ro.charSpacing ?? basis.weite });
    }
    return b;
  } catch (e) { return null; }
}

// Schrift und Größe eines Textes (Textfeld, Läufe, Tabellenzellen) gegen E3
function schriftFehler(text, o, fehler) {
  const sieh = op => {
    if (!op) return;
    if (op.fontFace && !SCHRIFTEN.has(op.fontFace)) fehler.add(`Schrift „${op.fontFace}“ ist nicht erlaubt (nur F.* aus theme.cjs: Montserrat und Work Sans)`);
    if (istZahl(op.fontSize) && op.fontSize < 10) fehler.add(`${op.fontSize} pt liegt unter der Mindestgröße 10 pt (E3)`);
  };
  sieh(o);
  if (Array.isArray(text)) for (const r of text) if (r && typeof r === 'object') { sieh(r.options); if (Array.isArray(r.text)) schriftFehler(r.text, null, fehler); }
}

// Hängt sich an die Folie und liefert die Liste der Formen: [{ typ, name, benannt, platzhalter, x, y, w, h, linie, ink, schrift }]
function ueberwache(slide) {
  const liste = [];
  const halte = (typ, o, mehr = {}) => {
    const r = { typ, name: o && o.objectName ? String(o.objectName) : null, platzhalter: o && o.placeholder ? String(o.placeholder) : null,
      x: o ? o.x : undefined, y: o ? o.y : undefined, w: o ? o.w : undefined, h: o ? o.h : undefined, schrift: new Set(), ...mehr };
    liste.push(r);
    return r;
  };
  const alt = { addText: slide.addText, addShape: slide.addShape, addImage: slide.addImage, addTable: slide.addTable, addChart: slide.addChart };
  slide.addText = function (text, o) {
    const op = o || {};
    // freie Textfelder gelten als Textfeld (Vorleseprogramme nennen sie sonst „Grafik“)
    if (!op.placeholder && !op.shape && op.isTextBox === undefined) op.isTextBox = true;
    const r = halte(op.shape ? 'Form' : 'Text', op);
    schriftFehler(text, op, r.schrift);
    if (!op.placeholder && !op.shape && !op.fill && !op.line && (op.margin === 0 || (Array.isArray(op.margin) && op.margin.every(m => m === 0))) && istZahl(op.w)) {
      const b = einzeiligeBreite(text, op);
      if (b !== null && b <= op.w + 0.005) r.ink = { b, align: op.align || 'left' };
    }
    const kaputt = t => /undefined/i.test(t) || /\bnan\b/i.test(t);    // „UNDEFINED“ entsteht, wenn ein fehlender Wert in Versalien gesetzt wird
    r.leer = text === undefined || text === null || (typeof text !== 'object' && kaputt(String(text))) || (Array.isArray(text) && text.some(t => t && kaputt(String(t.text))));
    return alt.addText.call(this, text, op);
  };
  slide.addShape = function (form, o) {
    const op = o || {};
    halte('Form', op, { linie: form === 'line' });
    return alt.addShape.call(this, form, op);
  };
  slide.addImage = function (o) { halte('Bild', o || {}); return alt.addImage.call(this, o); };
  slide.addTable = function (zeilen, o) {
    const op = o || {};
    const h = Array.isArray(op.rowH) ? op.rowH.reduce((a, b) => a + b, 0) : istZahl(op.rowH) && Array.isArray(zeilen) ? op.rowH * zeilen.length : op.h;
    const r = halte('Tabelle', op, { h, ohneHoehe: !istZahl(h) });
    schriftFehler(null, op, r.schrift);
    if (Array.isArray(zeilen)) for (const z of zeilen) if (Array.isArray(z)) for (const c of z) if (c && typeof c === 'object') schriftFehler(c.text, c.options, r.schrift);
    return alt.addTable.call(this, zeilen, op);
  };
  slide.addChart = function (typ, daten, o) { halte('Diagramm', o || {}); return alt.addChart.call(this, typ, daten, o); };
  return liste;
}

// lay: { art, layout } · ausnahmen: Map(Objektname → Grund)
function pruefeZonen(liste, lay, P, ausnahmen = new Map()) {
  const inhalt = ['inhalt', 'anhang'].includes(lay.art), oben = lay.art === 'anhang' ? Y.anhangInhalt : Y.deck;
  const benutzt = new Set();
  liste.forEach((r, i) => {
    const was = `${r.typ} „${r.name || 'ohne Namen'}“`;
    for (const f of r.schrift) P.melde(`${was}: ${f}.`);
    if (r.leer) P.melde(`${was}: Der Text fehlt oder enthält „undefined“ oder „NaN“.`);
    if (r.platzhalter) return;                                   // Lage und Größe setzt das Layout
    if (!r.name) P.melde(`${r.typ} Nr. ${i + 1} der Folie trägt keinen objectName. Jede Form bekommt einen Namen (Auswahlbereich in PowerPoint, Vorleseprogramme).`);
    const fehlt = ['x', 'y', 'w', 'h'].filter(k => !istZahl(r[k]) && !(k === 'h' && r.ohneHoehe));
    if (fehlt.length) { P.melde(`${was}: ${fehlt.join(', ')} fehlt oder ist keine Zahl. Lage und Größe in Zoll angeben (pptxgenjs setzt sonst stillschweigend 1 Zoll).`); return; }
    if (r.ohneHoehe) { P.hinweis(`${was}: ohne rowH lässt sich die Höhe nicht prüfen. B.tabelle oder B.rechenblatt verwenden oder rowH angeben.`); r.h = 0; }
    if (r.w < 0 || r.h < 0) { P.melde(`${was}: Breite oder Höhe ist negativ (${k2(r.w)} × ${k2(r.h)}).`); return; }
    if (!r.linie && r.typ !== 'Tabelle' && (r.w === 0 || r.h === 0)) { P.melde(`${was}: ${r.w === 0 ? 'Breite' : 'Höhe'} ist 0. Maß angeben oder vom Baustein rechnen lassen.`); return; }
    const x1 = r.x + r.w, y1 = r.y + r.h;
    // einzeiliger freier Text: Es zählt die Breite der Schrift, nicht die des Textfelds
    let xl = r.x, xr = x1;
    if (r.ink) { xl = r.ink.align === 'center' ? r.x + (r.w - r.ink.b) / 2 : r.ink.align === 'right' ? x1 - r.ink.b : r.x; xr = xl + r.ink.b; }
    if (xl < -0.005 || xr > W + 0.005 || r.y < -0.005 || y1 > H + 0.005) { P.melde(`${was}: liegt mit x ${k2(xl)} bis ${k2(xr)}, y ${k2(r.y)} bis ${k2(y1)} außerhalb der Folie (13,33 × 7,50).`); return; }
    if (!inhalt || !r.name || AUSSEN.test(r.name)) return;
    if (IM_SCHRIFTFELD.test(r.name)) {
      // Quellenzeile: im Schriftfeld, links im Satzspiegel, rechts vor dem Logo-Feld
      if (r.y < Y.fuss - 0.005 || y1 > Y.fuss + Y.fussH + 0.005 || xl < X0 - 0.02 || xr > ZONE.schriftfeld.logo + 0.005)
        P.melde(`${was}: liegt mit x ${k2(xl)} bis ${k2(xr)}, y ${k2(r.y)} bis ${k2(y1)} nicht im freien Feld des Schriftfelds (x ${k2(X0)} bis ${k2(ZONE.schriftfeld.logo)}, y ${k2(Y.fuss)} bis ${k2(Y.fuss + Y.fussH)}).`);
      return;
    }
    if (ausnahmen.has(r.name)) { benutzt.add(r.name); return; }
    const tol = KNAPP.test(r.name) ? 0.085 : 0.02;
    if (xl < X0 - tol || xr > X1 + tol) P.melde(`${was}: liegt mit x ${k2(xl)} bis ${k2(xr)} außerhalb des Satzspiegels (0,667 bis 12,667).`);
    if (y1 > Y.inhaltEnde + tol) P.melde(`${was}: reicht bis y ${k2(y1)} und läuft über die Inhaltszone (bis 6,50; darunter steht das Schriftfeld).`);
    if (r.y < oben - tol) P.melde(`${was}: beginnt bei y ${k2(r.y)} und liegt im Folienkopf (Inhalt ab y ${k2(oben)}).`);
  });
  for (const [name, grund] of ausnahmen) {
    if (benutzt.has(name)) P.hinweis(`Zonenprüfung ausgesetzt für „${name}“: ${grund}`);
    else P.melde(`ctx.zoneAusnahme: Eine Form mit dem Namen „${name}“ gibt es auf der Folie nicht.`);
  }
}

module.exports = { ueberwache, pruefeZonen, einzeiligeBreite };
