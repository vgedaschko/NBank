// Planwerk 16:9: Theme, Farben, Schriften, Schriftskala und Raster der Vortragsfassung.
// Einzige Stelle für Farbwerte, Schriftnamen und Maße des Folienrahmens. Maße in Zoll, Schrift in Punkt.
'use strict';

const THEME = {
  name: 'PGN Planwerk',
  headFontFace: 'Montserrat Black',
  bodyFontFace: 'Work Sans',
  colors: {
    dk1: '202020', lt1: 'FFFFFF', dk2: '3C3C3B', lt2: 'F4F3F2',
    accent1: 'B71E3F', accent2: '202020', accent3: 'DCD8D3', accent4: '77716B', accent5: '8B2939', accent6: '626160',
    hlink: '8B2939', folHlink: '626160',
  },
};

// Schemafarben (folgen dem Theme). Deutsche Namen und die Namen von pptxgenjs zeigen auf dieselben Werte.
const C = {
  text1: 'tx1', text2: 'tx2', background1: 'bg1', background2: 'bg2',
  accent1: 'accent1', accent2: 'accent2', accent3: 'accent3', accent4: 'accent4', accent5: 'accent5', accent6: 'accent6',
  tinte: 'tx1', anthrazit: 'tx2', weiss: 'bg1', papier: 'bg2',
  rot: 'accent1', darlehen: 'accent2', eigenmittel: 'accent3', referenz: 'accent4', dunkelrot: 'accent5', grau: 'accent6',
};

// Feste Hex-Werte: überall dort, wo pptxgenjs keine Schemafarbe annimmt, und für Töne außerhalb des Themes.
const HEX = {
  rot: 'B71E3F', dunkelrot: '8B2939', rot300: 'E8A3B1', hauch: 'F7E3E7', hauch50: 'FBF1F3', linieAufRot: 'D47E91',
  tinte: '202020', anthrazit: '3C3C3B', grau600: '626160', referenz: '77716B', grau300: 'B4B0AB', linie: 'CFCCC8',
  eigenmittel: 'DCD8D3', schraffur: 'DCD8D2', schraffurLinie: '8E8A85', flaeche3: 'E9E7E4', papier: 'F4F3F2', weiss: 'FFFFFF',
  stufen: ['EFEDEA', 'D8D4CF', 'B3ADA6', '77716B', '4A4642', '2A2826'],
  gruppe: { A: '2A2826', B: '77716B', C: 'D8D4CF' },
  gruppeText: { A: 'FFFFFF', B: 'FFFFFF', C: '202020' },
  dunkel: { flaeche2: '4A4948', linie: '5E5D5C', text: 'EDEBE8', text2: 'E2DFDB', zuschuss: 'E36A82', darlehen: 'F4F3F2', eigenmittel: '5E5D5C' },
  bs: { '2.1': 'B71E3F', '2.2': '3A62A6', '2.3': 'A0581A', '2.4': '0A5372', '2.5': '9A52AE', '2.6': '3C3C3B' },
  bsTon: { '2.1': 'F7E3E7', '2.2': 'E4EAF4', '2.3': 'F4E7DB', '2.4': 'DFEBF0', '2.5': 'F1E6F4', '2.6': 'E9E7E4' },
  matrix23: ['F4E7DB', 'E7CEBB', 'DAB79D', 'CC9F7E', 'BD875F', 'A0581A', '7E4A22'],
};

// Farbrollen der Ströme im Flussdiagramm (D.fluss): Tinte, Referenzgrau und zwei helle Töne. Die hellen Töne sind das Referenzgrau des Themes
// mit Transparenz (50 % ergibt auf Papierton B4B0AB, 70 % CFCCC8) und folgen damit dem Theme. Kein Rot.
// farbe, transparenz: Füllung des Bands · kontur: Linie um das Band (blasse Bänder auf Papierton) · linie: Farbe, wenn der Strom als Linie steht ·
// knoten: Farbe des Balkens am Ziel, wenn sie von der Füllung abweicht (das blasse Band endet in einem dunkleren Balken)
const FLUSSART = {
  tinte: { farbe: C.tinte },
  referenz: { farbe: C.referenz },
  hell: { farbe: C.referenz, transparenz: 50 },
  blass: { farbe: C.referenz, transparenz: 70, kontur: { farbe: C.referenz, transparenz: 45, pt: 0.5 }, linie: { farbe: C.referenz, transparenz: 25 }, knoten: { farbe: C.referenz, transparenz: 25 } },
};

// Feine Säulen (Folien 3, 5, 6 und 22, nur auf weißem Grund): Kontur um jede Säule und jedes Segment wie eine Ansichtslinie im Plan; zwischen
// den Säulen eines Paars eine Fuge in Prozent der Säulenbreite. Einzige Stelle für beide Maße: D.*Saeulen mit fein: true und B.legende mit fein: true
const FEIN = { kontur: { pt: 0.5, farbe: HEX.tinte }, fuge: 12 };

const PROGRAMMTEILE = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'];

// Schriftfamilien, wie PowerPoint sie führt. „fett“ (bold: true) nur zu F.mont und F.text.
const F = {
  black: 'Montserrat Black', xbold: 'Montserrat ExtraBold', mont: 'Montserrat', montLight: 'Montserrat Light',
  text: 'Work Sans', medium: 'Work Sans Medium', semi: 'Work Sans SemiBold', light: 'Work Sans Light',
};

// Raster und feste y-Lagen
const W = 13.333, H = 7.5, X0 = 0.667, X1 = 12.667, CW = 12.0, PITCH = 1.02, GUT = 0.24;
const r3 = v => +v.toFixed(3);
const colX = k => r3(X0 + (k - 1) * PITCH);
const span = n => r3(n * PITCH - GUT);
const Y = {
  // kickerW: Breite des Kickerfelds. Es endet bei x 7,967, 0,15 vor dem Feld „Programmteil“ des Schlüsselplans; der Kicker darf es bis auf
  // 10 % Reserve füllen (6,27 Zoll; der längste, „MODELLRECHNUNG · ZAHLUNGSFLUSS FREI FINANZIERT“, misst 6,21)
  kicker: 0.44, kickerH: 0.30, kickerW: 6.9, titel: 0.86, titelH: 1.06,
  deck: 1.90, deckH: 0.26, inhaltNachDeck: 2.40,
  inhalt: 2.10, inhaltEnde: 6.50, anhangInhalt: 1.50,
  fuss: 6.72, fussH: 0.48,
};
const ZONE = {
  // Layout PGN_DIAGRAMM(_MR). Die Kommentarspalte beginnt 0,07 unter der Modulkopf-Linie: Ihr Modultitel (erste Zeile, oben verankert) steht dann
  // auf derselben Höhe wie der Diagrammtitel links (Feld 2,18 bis 2,44, mittig)
  // spalte: rechte Spalte mit Kennzahlen statt Kommentar (Folien 3 bis 6 und 22): Hauptzahl ab y1, zweites Modul ab y2 (B.hauptzahl, B.nebenzahl, B.zweitesModul)
  diagramm: { kopf: 2.10, titel: 2.18, sub: 2.50, legende: 2.80, chart: { x: colX(1), y: 3.06, w: span(7), h: 3.44 }, kommentar: { x: colX(8), y: 2.19, w: span(5), h: 4.31 },
    spalte: { x: colX(9), w: span(4), y1: 2.10, y2: 4.40, ende: 6.50 } },
  // Layout PGN_TABELLE(_MR)
  tabelle: { kopf: 2.10, titel: 2.18, sub: 2.50, tabelle: 2.84, tabelleEnde: 6.20, notiz: { x: colX(1), y: 6.05, w: CW, h: 0.45 }, kommentar: { x: colX(9), y: 2.17, w: span(4), h: 4.33 } },
  // Layout PGN_ABLAUF
  ablauf: { achse: 2.55, textVon: 3.00, textBis: 5.55, warnband: 5.95, warnbandH: 0.42 },
  // Layout PGN_KENNZAHLEN(_MR)
  // 44 pt, Geometrie wie B.kennzahl (Linie, Vorsatz +0,10, Zahl +0,34, Label +1,10, Text +1,40); darunter ab y 4,70 Platz für eine Planlegende
  kennzahlen: { linie: 2.10, kopf: 2.20, zahl: 2.44, zahlH: 0.72, label: 3.20, labelH: 0.28, text: 3.50, textEnde: 4.45, darunter: 4.70 },
  // Layout PGN_VERGLEICH(_MR)
  // Text 3,35 bis 6,00; die Fläche rechts endet bei 6,12, darunter steht die Fußzeile über beide Seiten (Platzhalter „fuss“, 12 pt)
  vergleich: { links: { x: colX(1), w: 5.60 }, rechts: { x: colX(7) + 0.20, w: 5.40 }, kopf: 2.22, wert: 2.52, wertH: 0.70, text: 3.35, textEnde: 6.00,
    flaecheEnde: 6.12, fuss: { x: colX(1), y: 6.24, w: CW, h: 0.24 } },
  // Layout PGN_AUSSAGE
  aussage: { lead: { x: colX(1), y: 2.10, w: span(8), h: 0.80 }, body: { x: colX(1), y: 3.05, w: span(7), h: 3.45 }, seite: { x: colX(9), y: 2.17, w: span(4), h: 4.33 } },
  // Stelle des Stempels in der Kickerzeile der Layouts mit „_MR“ (rechts am Satzspiegel). Ohne Stempel im Kopf (STEMPEL_IM_KOPF aus) bleibt sie frei;
  // nur die erste Folie der Modellrechnung setzt dort ihren Zusatz (B.stempelZusatz)
  stempel: { x: 10.547, y: 0.385, w: 2.12, h: 0.37 },
  // Schriftfeld der Inhalts- und Anhangfolien (Y.fuss, Höhe Y.fussH): links Projektzeile und Rubrik, ab „logo“ das Logo-Feld, ab „blatt“ die Blatt-Zelle.
  // Dazwischen liegt das freie Feld für die Quellenzeile (B.quelle): rechtsbündig, „quelleRand“ vor dem Logo-Feld, mindestens „quelleAbstand“
  // hinter der längeren der beiden Zeilen links
  schriftfeld: { logoEnde: 2.20, text: 2.40, blatt: 12.033, quelleRand: 0.20, quelleAbstand: 0.30 },
  register: { x: W - 0.42, w: 0.42, h: 0.62, y0: 2.10, schritt: 0.74 },
};
const Raster = { W, H, X0, X1, CW, PITCH, GUT, colX, span, Y, ZONE };

// Farbsätze je Grund (Spezifikation 1.3). Schemafarben, wo das Theme sie führt.
const GRUND = {
  hell: {
    name: 'hell', grund: 'FFFFFF', kasten: C.papier, hervor: C.papier, titel: C.tinte, text: C.anthrazit, sekundaer: C.grau,
    linie: C.tinte, haar: HEX.linie, akzent: C.rot, signatur: C.rot, fuge: 'FFFFFF', achskreis: C.weiss, mass: C.anthrazit, fett: C.tinte,
  },
  papier: {
    name: 'papier', grund: 'F4F3F2', kasten: C.weiss, hervor: C.weiss, titel: C.tinte, text: C.anthrazit, sekundaer: C.grau,
    linie: C.tinte, haar: HEX.linie, akzent: C.rot, signatur: C.rot, fuge: 'F4F3F2', achskreis: C.weiss, mass: C.anthrazit, fett: C.tinte,
  },
  rot: {
    name: 'rot', grund: 'B71E3F', kasten: C.dunkelrot, hervor: C.weiss, titel: C.weiss, text: C.weiss, sekundaer: HEX.hauch,
    linie: C.weiss, haar: HEX.linieAufRot, akzent: C.weiss, signatur: C.weiss, fuge: 'B71E3F', achskreis: C.rot, mass: C.weiss, fett: C.weiss,
  },
  anthrazit: {
    name: 'anthrazit', grund: '3C3C3B', kasten: HEX.dunkel.flaeche2, hervor: HEX.dunkel.flaeche2, titel: C.weiss, text: HEX.dunkel.text, sekundaer: HEX.grau300,
    linie: C.weiss, haar: HEX.dunkel.linie, akzent: HEX.rot300, signatur: HEX.rot300, fuge: '3C3C3B', achskreis: C.anthrazit, mass: C.weiss, fett: C.weiss,
  },
};

// Schriftskala (Spezifikation 2.2). farbe: Schlüssel des Farbsatzes oder fester Wert.
// zeile = exakter Zeilenabstand in pt, zeileMal = Faktor, weite = Laufweite in pt, versal = Großbuchstaben setzen.
const SKALA = {
  vorspann:      { fontFace: F.text, fontSize: 18, zeileMal: 1.10, farbe: 'text' },
  fliess:        { fontFace: F.text, fontSize: 16, zeileMal: 1.12, farbe: 'text' },
  dicht:         { fontFace: F.text, fontSize: 14, zeileMal: 1.12, farbe: 'text' },
  klein:         { fontFace: F.text, fontSize: 12, zeileMal: 1.12, farbe: 'sekundaer' },
  kleinText:     { fontFace: F.text, fontSize: 12, zeileMal: 1.12, farbe: 'text' },
  deck:          { fontFace: F.montLight, fontSize: 14, zeileMal: 1.10, weite: 0.4, farbe: 'text', versal: true },
  kicker:        { fontFace: F.mont, bold: true, fontSize: 12, weite: 1.0, farbe: 'titel', versal: true },
  modultitel:    { fontFace: F.mont, bold: true, fontSize: 16, farbe: 'titel' },
  diagrammtitel: { fontFace: F.mont, bold: true, fontSize: 16, farbe: 'titel' },
  sub:           { fontFace: F.text, fontSize: 12, farbe: 'sekundaer' },
  tabellenkopf:  { fontFace: F.mont, bold: true, fontSize: 12, weite: 0.7, farbe: 'sekundaer', versal: true },
  label:         { fontFace: F.medium, fontSize: 10, farbe: 'sekundaer' },
  achse:         { fontFace: F.text, fontSize: 11, farbe: 'sekundaer' },
  legende:       { fontFace: F.text, fontSize: 11, farbe: 'text' },
  bezeichnung:   { fontFace: F.semi, fontSize: 12, zeileMal: 1.12, farbe: 'titel' },
  wert:          { fontFace: F.mont, bold: true, fontSize: 12, farbe: 'titel' },
  wertGross:     { fontFace: F.mont, bold: true, fontSize: 16, farbe: 'titel' },
  kernwert:      { fontFace: F.xbold, fontSize: 24, zeile: 26, farbe: 'titel' },
  vorsatz:       { fontFace: F.mont, bold: true, fontSize: 12, weite: 1.2, farbe: 'akzent', versal: true },
  kennlabel:     { fontFace: F.mont, bold: true, fontSize: 16, farbe: 'titel' },
  station:       { fontFace: F.xbold, fontSize: 13, weite: 0.5, farbe: 'titel', versal: true },
  stationKlein:  { fontFace: F.xbold, fontSize: 12, weite: 0.5, farbe: 'titel', versal: true },
  zitat:         { fontFace: F.mont, italic: true, fontSize: 24, zeile: 31, farbe: 'titel' },
  zitatName:     { fontFace: F.xbold, fontSize: 12, weite: 1.2, farbe: 'titel', versal: true },
  zitatQuelle:   { fontFace: F.text, fontSize: 12, farbe: 'sekundaer' },
};

// Mindestgrößen (E3): Fließtext 14 pt, Zusätze und Tabellen 12 pt, Beschriftungen und Achsen 10 pt
const MIN = { fliess: 14, tabelle: 12, beschriftung: 10 };
// Mindestgröße je Textrolle; Rollen ohne Eintrag gelten als Beschriftung (10 pt)
const ROLLENMIN = {
  vorspann: 14, fliess: 14, dicht: 14,
  klein: 12, kleinText: 12, sub: 12, tabellenkopf: 12, deck: 12, modultitel: 12, diagrammtitel: 12, station: 12, stationKlein: 12, zitatName: 12, zitatQuelle: 12,
  bezeichnung: 12, wert: 12, wertGross: 12, kernwert: 12, vorsatz: 11, kennlabel: 12, kicker: 11, zitat: 14,
  label: 10, achse: 10, legende: 10,
};

// Versalien als echte Großbuchstaben; Einheiten bleiben klein.
function versal(s) {
  return String(s).toLocaleUpperCase('de-DE')
    .replace(/M²/g, 'm²').replace(/M³/g, 'm³').replace(/KWH/g, 'kWh').replace(/\bKW\b/g, 'kW');
}

const PROJEKT = 'Mietwohnraumförderung Niedersachsen 2026';
const FIRMA = 'Planungsgemeinschaft Nord GmbH';

// Schalter: Stempel „MODELLRECHNUNG“ in der Kickerzeile der Layouts PGN_*_MR. Aus, weil der Kicker das Wort als Abschnittsnamen trägt; an ist der Rückweg (das Wort steht dann doppelt).
const STEMPEL_IM_KOPF = false;

module.exports = { THEME, C, HEX, F, Raster, GRUND, SKALA, MIN, ROLLENMIN, PROGRAMMTEILE, FLUSSART, FEIN, versal, PROJEKT, FIRMA, STEMPEL_IM_KOPF, W, H, X0, X1, CW, colX, span, Y, ZONE };
