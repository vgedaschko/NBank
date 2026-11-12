// Die 19 Layouts des Planwerks (Spezifikation Abschnitt 5). Ein defineSlideMaster je Layout.
// Text steht in benannten Platzhaltern; Fußzeile (Schriftfeld), Logo und Foliennummer liegen im Layout.
'use strict';
const { C, HEX, F, W, X0, CW, colX, span, Y, ZONE, PROJEKT, FIRMA, STEMPEL_IM_KOPF } = require('./theme.cjs');
const { RAHMEN } = require('./bausteine.cjs');
const { asset } = require('./assets.cjs');
const { X } = require('./daten.cjs');

// Feste Texte der Titel- und der Schlussfolie (Herausgeber, Stand, Anschrift, Kontakt): eine Quelle, daten/rahmen.json, je Eintrag mit Herkunft
const R = pfad => X('rahmen', pfad);
if (R('titel.kopfleiste') !== PROJEKT) throw new Error(`daten/rahmen.json: titel.kopfleiste („${R('titel.kopfleiste')}“) und die Projektzeile des Schriftfelds („${PROJEKT}“, lib/theme.cjs) sind verschieden.`);
if (R('titel.herausgeber') !== FIRMA || R('kontakt.firma') !== FIRMA) throw new Error(`daten/rahmen.json: Herausgeber und Firma müssen „${FIRMA}“ heißen (lib/theme.cjs, auch Autor und Firma der Mappe).`);

// Beschreibung der Layouts für build.cjs und die Passprüfung.
// art: titel | abschnitt | inhalt | anhang | schluss · titel: Schriftgrad, Zeilenzahl (min, max) und größte Zeilenbreite in Zoll;
// zeile: Zeilenabstand des Titel-Platzhalters in pt (Inhaltsfolien seit Muster 2: 37; ein Komma über einem Umlaut berührt dessen Punkte dann nicht)
const T32 = { pt: 32, min: 2, max: 2, breite: 11.6, zeile: 37 };
const LAYOUTS = {
  PGN_TITEL:          { grund: 'rot', art: 'titel', titel: { pt: 44, min: 1, max: 2, breite: 6.7 }, felder: ['title', 'untertitel', 'anlass'] },
  PGN_ABSCHNITT:      { grund: 'hell', art: 'abschnitt', titel: { pt: 40, min: 1, max: 3, breite: 9.6 }, felder: ['nr', 'title', 'lead', 'rubrik', 'blatt'] },
  PGN_ABSCHNITT_ROT:  { grund: 'rot', art: 'abschnitt', titel: { pt: 40, min: 1, max: 3, breite: 9.6 }, felder: ['nr', 'title', 'lead', 'rubrik', 'blatt'] },
  PGN_INHALT:         { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'rubrik', 'blatt'] },
  PGN_AUSSAGE:        { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'lead', 'body', 'seite', 'rubrik', 'blatt'] },
  PGN_KENNZAHLEN:     { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'kf0_kopf', 'kf0_zahl', 'kf0_label', 'kf0_text', 'kf1_kopf', 'kf1_zahl', 'kf1_label', 'kf1_text', 'kf2_kopf', 'kf2_zahl', 'kf2_label', 'kf2_text', 'rubrik', 'blatt'] },
  PGN_DIAGRAMM:       { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'diagrammtitel', 'diagrammsub', 'chart', 'kommentar', 'rubrik', 'blatt'] },
  PGN_TABELLE:        { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'tabellentitel', 'tabellensub', 'kommentar', 'notiz', 'rubrik', 'blatt'] },
  PGN_VERGLEICH:      { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'links_kopf', 'links_wert', 'links_text', 'rechts_kopf', 'rechts_wert', 'rechts_text', 'fuss', 'rubrik', 'blatt'] },
  PGN_ABLAUF:         { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'rubrik', 'blatt'] },
  PGN_ZITAT:          { grund: 'hell', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'zitat', 'name', 'quelle', 'rubrik', 'blatt'] },
  PGN_SCHLUSS:        { grund: 'rot', art: 'schluss', titel: { pt: 40, min: 1, max: 3, breite: 6.0 }, felder: ['title', 'untertitel'] },
  PGN_ANHANG:         { grund: 'hell', art: 'anhang', titel: { pt: 22, min: 1, max: 1, breite: 12.0 }, felder: ['kicker', 'title', 'rubrik', 'blatt'] },
  PGN_AUSSAGE_DUNKEL: { grund: 'anthrazit', art: 'inhalt', titel: T32, felder: ['kicker', 'title', 'rubrik', 'blatt'] },
};
// Fassung der Modellrechnung auf Papierton. stempel: Das Layout trägt den Stempel in der Kickerzeile (nur mit STEMPEL_IM_KOPF, lib/theme.cjs)
for (const n of ['INHALT', 'KENNZAHLEN', 'DIAGRAMM', 'TABELLE', 'VERGLEICH']) LAYOUTS[`PGN_${n}_MR`] = { ...LAYOUTS[`PGN_${n}`], grund: 'papier', stempel: STEMPEL_IM_KOPF };

// Feste Nummer (idx) je Platzhalter, gleich in allen Layouts: Wechselt jemand in PowerPoint das Layout einer Folie, findet jeder Text sein Feld wieder.
// pptxgenjs zählt die Objekte eines Layouts durch; die Nachbearbeitung setzt diese Nummern ein. Der Titel trägt keine Nummer (Typ „title“).
const IDX = { kicker: 10, rubrik: 11, blatt: 12, untertitel: 13, kommentar: 14, anlass: 15, nr: 16, lead: 17, body: 18, seite: 19,
  diagrammtitel: 20, diagrammsub: 21, chart: 22, tabellentitel: 23, tabellensub: 24, notiz: 25, zitat: 26, name: 27, quelle: 28, fuss: 29,
  links_kopf: 30, links_wert: 31, links_text: 32, rechts_kopf: 33, rechts_wert: 34, rechts_text: 35,
  kf0_kopf: 40, kf0_zahl: 41, kf0_label: 42, kf0_text: 43, kf1_kopf: 44, kf1_zahl: 45, kf1_label: 46, kf1_text: 47, kf2_kopf: 48, kf2_zahl: 49, kf2_label: 50, kf2_text: 51 };
// Namen der Layouts im Layout-Menü von PowerPoint (eine Quelle mit pruefe_folien.py)
const ANZEIGE = require('./layoutnamen.json');

// Beschreibung der fertigen Layouts für die Nachbearbeitung: je Layout der Name im Menü und je Platzhalter (Schlüssel: idx von pptxgenjs, Titel „title“)
// Name, Anker und feste Nummer. pres: die Mappe nach definiereLayouts
function layoutBeschreibung(pres) {
  const out = {};
  for (const l of pres.slideLayouts) {
    if (!ANZEIGE[l._name]) throw new Error(`lib/layoutnamen.json: Für das Layout „${l._name}“ fehlt der Name im Layout-Menü.`);
    const platzhalter = {};
    for (const x of l._slideObjects.filter(x => x._type === 'placeholder')) {
      const name = x.options.placeholder, titel = x.options._placeholderType === 'title';
      if (!titel && !IDX[name]) throw new Error(`lib/layouts.cjs: Für den Platzhalter „${name}“ (Layout ${l._name}) fehlt die feste Nummer in IDX.`);
      platzhalter[titel ? 'title' : x.options._placeholderIdx] = { name, anker: x.options.valign || null, idx: titel ? null : IDX[name] };
    }
    out[l._name] = { anzeige: ANZEIGE[l._name], platzhalter };
  }
  return out;
}

// Namen der Platzhalter im Auswahlbereich von PowerPoint
const NAMEN = { title: 'Titel', kicker: 'Kicker', rubrik: 'Rubrik', blatt: 'Blattnummer', untertitel: 'Untertitel', anlass: 'Ort und Datum', nr: 'Abschnittsnummer', lead: 'Vorspann', body: 'Text',
  seite: 'Planlegende', kommentar: 'Kommentar', notiz: 'Notiz', diagrammtitel: 'Diagrammtitel', diagrammsub: 'Diagramm-Untertitel', tabellentitel: 'Tabellentitel', tabellensub: 'Tabellen-Untertitel',
  zitat: 'Zitat', name: 'Zitat Name', quelle: 'Zitat Quelle', fuss: 'Fußzeile Vergleich', links_kopf: 'Links Kopf', links_wert: 'Links Wert', links_text: 'Links Text', rechts_kopf: 'Rechts Kopf', rechts_wert: 'Rechts Wert', rechts_text: 'Rechts Text' };
const phName = name => NAMEN[name] || name.replace(/^kf(\d)_(\w+)$/, (m, i, t) => `Kennzahl ${Number(i) + 1} ${{ kopf: 'Vorsatz', zahl: 'Zahl', label: 'Bezeichnung', text: 'Text' }[t]}`);
const ph = (name, o, text, type = 'body') => ({ placeholder: { options: { name, type, margin: 0, valign: 'top', objectName: phName(name), ...o }, text } });
const linie = (x, y, w, h, color, width, objectName) => ({ line: { x, y, w, h, line: { color, width }, objectName } });
const txt = (text, o) => ({ text: { text, options: { margin: 0, valign: 'middle', ...o } } });

function definiereLayouts(pres) {
  const rand = [Y.inhalt, 0.666, 1.0, X0];
  // Inhaltslayouts in zwei Fassungen: hell und Papier (Modellrechnung). Der Papierton ist das Zeichen der Modellfolien; das Wort steht im Kicker.
  // Den Stempel in der Kickerzeile trägt das Layout nur mit STEMPEL_IM_KOPF (lib/theme.cjs)
  function paar(name, inhalt) {
    pres.defineSlideMaster({ title: `PGN_${name}`, background: { color: 'FFFFFF' }, margin: rand, objects: [...RAHMEN.kopf('hell'), ...inhalt('hell'), ...RAHMEN.schriftfeld('hell')] });
    pres.defineSlideMaster({ title: `PGN_${name}_MR`, background: { color: 'F4F3F2' }, margin: rand, objects: [...RAHMEN.kopf('papier'), ...(STEMPEL_IM_KOPF ? RAHMEN.stempel() : []), ...inhalt('papier'), ...RAHMEN.schriftfeld('papier')] });
  }
  const flaeche = g => (g === 'papier' ? C.weiss : C.papier);

  // --- PGN_TITEL ------------------------------------------------------------------------------------------------
  pres.defineSlideMaster({ title: 'PGN_TITEL', background: { path: asset('bg-titel.png') }, objects: [
    ...RAHMEN.planrahmen(C.weiss),
    linie(0.30, 0.80, W - 0.60, 0, C.weiss, 0.5, 'Kopfleiste'),
    { rect: { x: 0.60, y: 0.535, w: 0.28, h: 0.03, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Kickerstrich' } },
    txt(PROJEKT.toLocaleUpperCase('de-DE'), { x: 1.0, y: 0.40, w: 8, h: 0.30, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.6, color: C.weiss, objectName: 'Kopfleiste Projekt' }),
    // Titel in zwei Zeilen (Claim der Broschüre): Titellinie von der Versalhöhe der ersten bis zur Grundlinie der zweiten Zeile; Titel und
    // Untertitel stehen als Block mittig zur Zeichnung
    RAHMEN.titellinie(0.375, 1.95, 1.06, C.weiss, 0.055),
    ph('title', { x: 0.60, y: 1.86, w: 6.7, h: 1.42, fontFace: F.black, bold: false, fontSize: 44, lineSpacing: 45, color: C.weiss, align: 'left' }, 'TITEL IN ZWEI ZEILEN', 'title'),
    ph('untertitel', { x: 0.60, y: 3.54, w: 6.3, h: 1.15, fontFace: F.text, fontSize: 18, lineSpacingMultiple: 1.1, color: C.weiss }, 'Untertitel'),
    // Schriftfeld groß
    linie(0.30, 5.70, W - 0.60, 0, C.weiss, 1, 'Schriftfeld Oberlinie'),
    { rect: { x: 0.30, y: 5.70, w: 3.20, h: 1.50, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Logofeld' } },
    { image: { path: asset('logo-rot.png'), x: 0.60, y: 6.23, w: 2.50, h: 0.44, objectName: 'Logo PGN', altText: 'PGN Architekten, Stadtplaner, Ingenieure' } },
    linie(7.60, 5.70, 0, 1.50, C.weiss, 0.5, 'Schriftfeld Teilung'),
    txt('Herausgeber', { x: 3.72, y: 5.84, w: 3.6, h: 0.20, fontFace: F.medium, fontSize: 10, color: HEX.hauch, objectName: 'Schriftfeld Herausgeber' }),
    txt(`${R('titel.herausgeber')}\n${R('titel.sitz')}`, { x: 3.72, y: 6.08, w: 3.7, h: 0.50, fontFace: F.mont, bold: true, fontSize: 12, color: C.weiss, valign: 'top', objectName: 'Schriftfeld Firma' }),
    // Zelle rechts: Stand der Inhalte; darunter das Eingabefeld für Ort und Datum des Vortrags (bleibt leer, bis jemand es in PowerPoint füllt).
    // Bis Muster 2 stand hier nur die Bezeichnung „Vortrag“ über dem leeren Eingabefeld; die Zelle wirkte leer
    txt('Stand', { x: 7.82, y: 5.84, w: 2.4, h: 0.20, fontFace: F.medium, fontSize: 10, color: HEX.hauch, objectName: 'Schriftfeld Stand' }),
    txt(R('titel.stand'), { x: 7.82, y: 6.08, w: 2.4, h: 0.24, fontFace: F.mont, bold: true, fontSize: 12, color: C.weiss, valign: 'top', objectName: 'Schriftfeld Stand Datum' }),
    ph('anlass', { x: 7.82, y: 6.34, w: 2.5, h: 0.50, fontFace: F.mont, bold: true, fontSize: 12, color: C.weiss }, 'Ort, Datum'),
    { rect: { x: 10.433, y: 5.70, w: 2.60, h: 1.50, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Kennzahlfeld' } },
  ] });

  // --- PGN_ABSCHNITT, PGN_ABSCHNITT_ROT ----------------------------------------------------------------------------
  for (const rot of [false, true]) {
    const fg = rot ? C.weiss : C.tinte, sek = rot ? HEX.hauch : C.grau;
    pres.defineSlideMaster({ title: rot ? 'PGN_ABSCHNITT_ROT' : 'PGN_ABSCHNITT', background: rot ? { path: asset('bg-rot.png') } : { color: 'FFFFFF' }, objects: [
      ...RAHMEN.planrahmen(fg),
      { text: { text: '', options: { shape: pres.ShapeType.ellipse, x: 0.85, y: 1.75, w: 1.40, h: 1.40, fill: rot ? { type: 'none' } : { color: C.weiss }, line: { color: fg, width: 1.5 }, objectName: 'Achskreis Abschnitt' } } },
      ph('nr', { x: 0.85, y: 1.75, w: 1.40, h: 1.40, fontFace: F.black, fontSize: 54, color: rot ? C.weiss : C.rot, align: 'center', valign: 'middle' }, '1'),
      // Titel in der Höhe des Achskreises, senkrecht mittig: Ein-, zwei- und dreizeilige Titel stehen alle auf der Mitte des Kreises
      ph('title', { x: 2.65, y: 1.75, w: 9.6, h: 1.40, fontFace: F.black, bold: false, fontSize: 40, lineSpacing: 41, color: fg, align: 'left', valign: 'middle' }, 'TITEL DES ABSCHNITTS', 'title'),
      // vier Zeilen 18 pt brauchen 1,32 Zoll; das Feld lässt ihnen Luft
      ph('lead', { x: 2.65, y: 3.75, w: 8.0, h: 1.40, fontFace: F.text, fontSize: 18, lineSpacingMultiple: 1.1, color: rot ? C.weiss : C.anthrazit }, 'Vorspann'),
      linie(0.30, 6.50, W - 0.60, 0, fg, 1, 'Schriftfeld Oberlinie'),
      ...(rot ? [{ rect: { x: 0.30, y: 6.50, w: 2.35, h: 0.70, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Logofeld' } }] : []),
      { image: { path: asset('logo-rot.png'), x: 0.56, y: 6.692, w: 1.80, h: 0.317, objectName: 'Logo PGN', altText: 'PGN Architekten, Stadtplaner, Ingenieure' } },
      ...(rot ? [] : [linie(2.65, 6.50, 0, 0.70, HEX.linie, 0.5, 'Schriftfeld Teilung 1')]),
      txt(PROJEKT, { x: 2.85, y: 6.62, w: 7, h: 0.20, fontFace: F.medium, fontSize: 10, color: sek, objectName: 'Schriftfeld Projekt' }),
      ph('rubrik', { x: 2.85, y: 6.86, w: 7, h: 0.20, fontFace: F.mont, bold: true, fontSize: 10, charSpacing: 0.6, color: fg, valign: 'middle' }, 'RUBRIK'),
      { rect: { x: 12.033, y: 6.51, w: 0.99, h: 0.68, fill: { color: rot ? C.dunkelrot : C.papier }, line: { type: 'none' }, objectName: 'Blatt-Zelle' } },
      ...(rot ? [] : [linie(12.033, 6.50, 0, 0.70, HEX.linie, 0.5, 'Schriftfeld Teilung 2')]),
      txt('Blatt', { x: 12.13, y: 6.60, w: 0.80, h: 0.18, fontFace: F.medium, fontSize: 10, color: sek, align: 'right', objectName: 'Schriftfeld Blatt' }),
      ph('blatt', { x: 12.13, y: 6.80, w: 0.80, h: 0.30, fontFace: F.black, fontSize: 18, color: fg, align: 'right', valign: 'middle' }, 'Nr.'),
    ] });
  }

  // --- PGN_INHALT(_MR), PGN_ABLAUF: nur Kopf und Fuß -----------------------------------------------------------------
  paar('INHALT', () => []);
  pres.defineSlideMaster({ title: 'PGN_ABLAUF', background: { color: 'FFFFFF' }, margin: rand, objects: [...RAHMEN.kopf('hell'), ...RAHMEN.schriftfeld('hell')] });

  // --- PGN_AUSSAGE ---------------------------------------------------------------------------------------------------
  {
    const z = ZONE.aussage;
    pres.defineSlideMaster({ title: 'PGN_AUSSAGE', background: { color: 'FFFFFF' }, margin: rand, objects: [...RAHMEN.kopf('hell'),
      ph('lead', { ...z.lead, fontFace: F.text, fontSize: 18, lineSpacingMultiple: 1.1, color: C.anthrazit }, 'Vorspann, höchstens 30 Wörter'),
      ph('body', { ...z.body, fontFace: F.text, fontSize: 16, lineSpacingMultiple: 1.12, color: C.anthrazit }, 'Text oder Aufzählung'),
      linie(colX(9), Y.inhalt, span(4), 0, C.tinte, 1.5, 'Modulkopf-Linie'),
      ph('seite', { ...z.seite, fontFace: F.text, fontSize: 14, lineSpacingMultiple: 1.12, color: C.anthrazit }, 'Planlegende'),
      ...RAHMEN.schriftfeld('hell')] });
  }

  // --- PGN_KENNZAHLEN(_MR): drei Kacheln in 44 pt (Geometrie wie B.kennzahl); darunter bleibt ab y 4,70 Platz für eine Planlegende ----
  paar('KENNZAHLEN', () => [0, 1, 2].flatMap(i => {
    const x = colX(1 + 4 * i), w = span(4), z = ZONE.kennzahlen;
    return [
      linie(x, z.linie, w, 0, C.tinte, 0.75, `Kennzahl ${i + 1} Oberlinie`),
      ph(`kf${i}_kopf`, { x, y: z.kopf, w, h: 0.22, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.2, color: C.tinte, valign: 'middle' }, 'VORSATZ'),
      ph(`kf${i}_zahl`, { x, y: z.zahl, w, h: z.zahlH, fontFace: F.xbold, fontSize: 44, lineSpacing: 44, color: C.tinte, valign: 'middle' }, '00'),
      ph(`kf${i}_label`, { x, y: z.label, w, h: z.labelH, fontFace: F.mont, bold: true, fontSize: 14, color: C.tinte }, 'Bezeichnung'),
      ph(`kf${i}_text`, { x, y: z.text, w, h: z.textEnde - z.text, fontFace: F.text, fontSize: 14, lineSpacingMultiple: 1.12, color: C.anthrazit }, 'Text'),
    ];
  }));

  // --- PGN_DIAGRAMM(_MR) ---------------------------------------------------------------------------------------------
  paar('DIAGRAMM', () => {
    const z = ZONE.diagramm;
    return [
      linie(colX(1), z.kopf, span(7), 0, C.tinte, 1.5, 'Modulkopf-Linie Diagramm'),
      ph('diagrammtitel', { x: colX(1), y: z.titel, w: span(7), h: 0.30, fontFace: F.mont, bold: true, fontSize: 16, color: C.tinte, valign: 'middle' }, 'Diagrammtitel'),
      // oben verankert: Ein Untertitel in zwei Zeilen wächst nach unten (B.diagrammkopf rückt Legende und Diagramm dann tiefer)
      ph('diagrammsub', { x: colX(1), y: z.sub, w: span(7), h: 0.22, fontFace: F.text, fontSize: 12, color: C.grau, valign: 'top' }, 'Untertitel mit Einheit'),
      { placeholder: { options: { name: 'chart', type: 'chart', objectName: 'Diagramm', ...z.chart, color: C.tinte } } },
      linie(colX(8), z.kopf, span(5), 0, C.tinte, 1.5, 'Modulkopf-Linie Kommentar'),
      ph('kommentar', { ...z.kommentar, fontFace: F.text, fontSize: 16, lineSpacingMultiple: 1.12, color: C.anthrazit }, 'Kommentar, höchstens 45 Wörter'),
    ];
  });

  // --- PGN_TABELLE(_MR) ----------------------------------------------------------------------------------------------
  paar('TABELLE', () => {
    const z = ZONE.tabelle;
    return [
      linie(colX(1), z.kopf, CW, 0, C.tinte, 1.5, 'Modulkopf-Linie'),
      ph('tabellentitel', { x: colX(1), y: z.titel, w: span(8), h: 0.30, fontFace: F.mont, bold: true, fontSize: 16, color: C.tinte, valign: 'middle' }, 'Tabellentitel'),
      ph('tabellensub', { x: colX(1), y: z.sub, w: span(8), h: 0.24, fontFace: F.text, fontSize: 12, color: C.grau, valign: 'middle' }, 'Untertitel mit Einheit'),
      ph('kommentar', { ...z.kommentar, fontFace: F.text, fontSize: 14, lineSpacingMultiple: 1.12, color: C.anthrazit }, 'Kommentar neben einer Tabelle über acht Spalten'),
      ph('notiz', { ...z.notiz, fontFace: F.text, fontSize: 12, color: C.grau, valign: 'bottom' }, 'Notiz unter der Tabelle'),
    ];
  });

  // --- PGN_VERGLEICH(_MR) ----------------------------------------------------------------------------------------------
  paar('VERGLEICH', g => {
    const z = ZONE.vergleich, t = { fontFace: F.text, fontSize: 16, lineSpacingMultiple: 1.12, color: C.anthrazit };
    return [
      { rect: { x: colX(7), y: 2.10, w: span(6), h: z.flaecheEnde - 2.10, fill: { color: flaeche(g) }, line: { type: 'none' }, objectName: 'Fläche rechts' } },
      linie(colX(1), 2.10, span(6), 0, HEX.grau300, 1.5, 'Modulkopf-Linie links'),
      linie(colX(7), 2.10, span(6), 0, C.tinte, 1.5, 'Modulkopf-Linie rechts'),
      txt('→', { x: colX(7) - 0.24, y: z.wert + z.wertH / 2 - 0.20, w: 0.24, h: 0.40, align: 'center', fontFace: F.mont, bold: true, fontSize: 20, color: C.tinte, objectName: 'Pfeil' }),
      ph('links_kopf', { x: z.links.x, y: z.kopf, w: z.links.w, h: 0.24, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.2, color: C.grau, valign: 'middle' }, 'BISHER'),
      ph('links_wert', { x: z.links.x, y: z.wert, w: z.links.w, h: z.wertH, fontFace: F.xbold, fontSize: 36, lineSpacing: 36, color: C.grau, valign: 'middle' }, 'Wert'),
      ph('links_text', { x: z.links.x, y: z.text, w: z.links.w, h: z.textEnde - z.text, ...t }, 'Text'),
      ph('rechts_kopf', { x: z.rechts.x, y: z.kopf, w: z.rechts.w, h: 0.24, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.2, color: C.tinte, valign: 'middle' }, 'NEU'),
      ph('rechts_wert', { x: z.rechts.x, y: z.wert, w: z.rechts.w, h: z.wertH, fontFace: F.xbold, fontSize: 36, lineSpacing: 36, color: C.tinte, valign: 'middle' }, 'Wert'),
      ph('rechts_text', { x: z.rechts.x, y: z.text, w: z.rechts.w, h: z.textEnde - z.text, ...t }, 'Text'),
      ph('fuss', { ...z.fuss, fontFace: F.text, fontSize: 12, color: C.grau, valign: 'middle' }, 'Fußzeile unter beiden Seiten'),
    ];
  });

  // --- PGN_ZITAT -------------------------------------------------------------------------------------------------------
  pres.defineSlideMaster({ title: 'PGN_ZITAT', background: { color: 'FFFFFF' }, margin: rand, objects: [...RAHMEN.kopf('hell'),
    ph('zitat', { x: colX(1) + 0.30, y: 2.25, w: span(9) - 0.30, h: 2.70, fontFace: F.mont, italic: true, fontSize: 28, lineSpacing: 36, color: C.tinte }, '„Zitat“'),
    ph('name', { x: colX(1) + 0.30, y: 5.10, w: 8.0, h: 0.24, fontFace: F.xbold, fontSize: 12, charSpacing: 1.2, color: C.tinte, valign: 'middle' }, 'NAME'),
    ph('quelle', { x: colX(1) + 0.30, y: 5.36, w: 8.0, h: 0.24, fontFace: F.text, fontSize: 12, color: C.grau, valign: 'middle' }, 'Quelle'),
    ...RAHMEN.schriftfeld('hell')] });

  // --- PGN_SCHLUSS -------------------------------------------------------------------------------------------------------
  pres.defineSlideMaster({ title: 'PGN_SCHLUSS', background: { path: asset('bg-schluss.png') }, objects: [
    ...RAHMEN.planrahmen(C.weiss),
    RAHMEN.titellinie(0.375, 1.87, 1.20, C.weiss, 0.055),
    // 6,0 Zoll breit: „MACHEN WIR DEN“ (5,54 Zoll) hat gut 7 % Luft und bricht auch mit etwas breiterer Schrift nicht; das Feld endet bei x 6,60
    // vor den Achskreisen des Grundrisses im Hintergrund (ab x 6,64)
    ph('title', { x: 0.60, y: 1.30, w: 6.0, h: 1.85, fontFace: F.black, bold: false, fontSize: 40, lineSpacing: 41, color: C.weiss, align: 'left' }, 'SCHLUSS', 'title'),
    ph('untertitel', { x: 0.60, y: 3.45, w: 5.4, h: 1.2, fontFace: F.text, fontSize: 18, lineSpacingMultiple: 1.1, color: C.weiss }, 'Einladung'),
    linie(0.30, 5.45, W - 0.60, 0, C.weiss, 1, 'Schriftfeld Oberlinie'),
    { rect: { x: 0.30, y: 5.45, w: 3.20, h: 1.75, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Logofeld' } },
    { image: { path: asset('logo-rot.png'), x: 0.60, y: 6.105, w: 2.50, h: 0.44, objectName: 'Logo PGN', altText: 'PGN Architekten, Stadtplaner, Ingenieure' } },
    txt(R('kontakt.firma').toLocaleUpperCase('de-DE'), { x: 3.78, y: 5.66, w: 7, h: 0.26, fontFace: F.xbold, fontSize: 13, charSpacing: 0.8, color: C.weiss, objectName: 'Firma' }),
    txt(R('kontakt.anschrift'), { x: 3.78, y: 5.94, w: 7, h: 0.26, fontFace: F.semi, fontSize: 14, color: C.weiss, objectName: 'Anschrift' }),
    linie(3.78, 6.36, 7.2, 0, HEX.linieAufRot, 0.5, 'Haarlinie'),
    ...[['Telefon', R('kontakt.telefon'), 3.78], ['E-Mail', R('kontakt.email'), 5.80], ['Web', R('kontakt.web'), 8.45]].flatMap(([l, v, x]) => [
      txt(l, { x, y: 6.46, w: 2.5, h: 0.20, fontFace: F.medium, fontSize: 10, color: HEX.hauch, objectName: 'Bezeichnung ' + l }),
      txt(v, { x, y: 6.68, w: 2.6, h: 0.26, fontFace: F.mont, bold: true, fontSize: 12, color: C.weiss, objectName: l })]),
    { rect: { x: 11.283, y: 5.45, w: 1.75, h: 1.75, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'QR-Feld' } },
    { image: { path: asset('qr-pgn.png'), x: 11.533, y: 5.70, w: 1.25, h: 1.25, objectName: 'QR-Code', altText: 'QR-Code zu ' + R('kontakt.web') } },
  ] });

  // --- PGN_ANHANG ----------------------------------------------------------------------------------------------------------
  pres.defineSlideMaster({ title: 'PGN_ANHANG', background: { color: 'FFFFFF' }, margin: [Y.anhangInhalt, 0.666, 1.0, X0], objects: [...RAHMEN.kopf('hell', { anhang: true }), ...RAHMEN.schriftfeld('hell', 'Anhang')] });

  // --- PGN_AUSSAGE_DUNKEL ------------------------------------------------------------------------------------------------------
  pres.defineSlideMaster({ title: 'PGN_AUSSAGE_DUNKEL', background: { path: asset('bg-anthrazit.png') }, margin: rand, objects: [...RAHMEN.kopf('anthrazit'), ...RAHMEN.schriftfeld('anthrazit')] });

  return LAYOUTS;
}

module.exports = { definiereLayouts, layoutBeschreibung, LAYOUTS, IDX };
