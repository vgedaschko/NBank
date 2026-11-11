// Planwerk-Elemente als PowerPoint-Formen (Spezifikation Abschnitt 4).
// Teil 1 (RAHMEN): Bausteine des Folienrahmens als Objekte für die Layouts (Planrahmen, Kopf, Titellinie, Schriftfeld, Stempel).
// Teil 2 (bausteine): Funktionen B.* für die Inhaltszone einer Folie. Jede Form trägt einen objectName.
// Maße in Zoll, Schrift in Punkt. Farben kommen aus dem Farbsatz des Grundes (hell, papier, rot, anthrazit).
'use strict';
const { C, HEX, F, GRUND, SKALA, ROLLENMIN, PROGRAMMTEILE, FEIN, versal, PROJEKT, STEMPEL_IM_KOPF, W, H, X0, X1, CW, colX, span, Y, ZONE } = require('./theme.cjs');
const { breite, zeilenzahl, zeilenhoehe } = require('./passpruefung.cjs');
const { asset } = require('./assets.cjs');
const { NBSP } = require('./daten.cjs');

// Leerzeichen zwischen Zahl und Einheit sowie in festen Abkürzungen schützen (kein Umbruch): „5,6 Mio. €“, „80 %“, „S. 8“, „p. a.“, „e. V.“
function schutz(s) {
  return String(s)
    .replace(/(\d) (?=(?:%|€|Mio\.|Mrd\.|m²|m³|kWh|Jahren?\b|Prozentpunkte?n?\b|Wohnungen\b|Monate?n?\b|pt\b))/g, '$1' + NBSP)
    .replace(/Mio\. €/g, 'Mio.' + NBSP + '€').replace(/€ je m²/g, '€ je' + NBSP + 'm²').replace(/\bje m²/g, 'je' + NBSP + 'm²')
    .replace(/\bp\. a\./g, 'p.' + NBSP + 'a.').replace(/\bP\. A\./g, 'P.' + NBSP + 'A.').replace(/\bz\. B\./g, 'z.' + NBSP + 'B.').replace(/\be\. V\./g, 'e.' + NBSP + 'V.')
    .replace(/\b(S\.|Nr\.|Abs\.|§|Folie|Blatt|Jahr|Gruppe|Programmteil|Mietenstufe|Leistungsphase|Leistungsphasen|bis zu|mind\.) (?=[\dIVXA-C])/g, '$1' + NBSP)
    .replace(/Nds\. MBl\. \d{4} Nr\.\s\d+/g, m => m.replace(/\s/g, NBSP));   // Fundstelle „Nds. MBl. 2026 Nr. 319“ bleibt in einer Zeile
}

// Schriftfeld der Inhalts- und Anhangfolien: Lage der Teilungen (lib/theme.cjs) und Schrift der beiden Zeilen links. Layout (RAHMEN.schriftfeld)
// und Quellenzeile (B.quelle) rechnen mit denselben Angaben.
const SF = ZONE.schriftfeld;
const SF_PROJEKT = { fontFace: F.medium, fontSize: 10 }, SF_RUBRIK = { fontFace: F.mont, bold: true, fontSize: 10, weite: 0.6 };
// Quellenzeile im Schriftfeld (B.quelle): Work Sans 10 pt in Grau, höchstens zwei Zeilen
const QUELLE = { fontFace: F.text, fontSize: 10, zeileMal: 1.1 }, QUELLE_NAME = 'Quellenzeile';

// ================================================================================================================
// Teil 1: Rahmenteile für die Layouts (Objekte für defineSlideMaster)
// ================================================================================================================
const RAHMEN = {
  // 4.1 Planrahmen mit zwei Falzmarken (nur Titel, Abschnitt, Schluss)
  planrahmen(farbe) {
    return [
      { rect: { x: 0.30, y: 0.30, w: W - 0.60, h: H - 0.60, fill: { type: 'none' }, line: { color: farbe, width: 1 }, objectName: 'Planrahmen' } },
      { line: { x: 0.10, y: 2.50, w: 0.20, h: 0, line: { color: farbe, width: 0.5 }, objectName: 'Falzmarke 1' } },
      { line: { x: 0.10, y: 5.00, w: 0.20, h: 0, line: { color: farbe, width: 0.5 }, objectName: 'Falzmarke 2' } },
    ];
  },
  // 4.3 rote Linie am Titel
  titellinie(x, y, h, farbe = C.rot, b = 0.045) {
    return { rect: { x, y, w: b, h, fill: { color: farbe }, line: { type: 'none' }, objectName: 'Titellinie' } };
  },
  // 4.4 Kicker und Titel der Inhaltsfolien (zwei Zeilen 32 pt) bzw. des Anhangs (eine Zeile 22 pt)
  kopf(grund = 'hell', { anhang = false } = {}) {
    const cs = GRUND[grund];
    return [
      { rect: { x: X0, y: Y.kicker + 0.135, w: 0.28, h: 0.03, fill: { color: C.rot }, line: { type: 'none' }, objectName: 'Kickerstrich' } },
      { placeholder: { options: { name: 'kicker', type: 'body', objectName: 'Kicker', x: X0 + 0.40, y: Y.kicker, w: Y.kickerW, h: Y.kickerH, margin: 0, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.9, color: anhang ? cs.titel : cs.akzent, valign: 'middle' }, text: 'KICKER' } },
      anhang ? RAHMEN.titellinie(X0 - 0.22, Y.titel + 0.045, 0.27) : RAHMEN.titellinie(X0 - 0.22, Y.titel + 0.065, 0.78),
      anhang
        ? { placeholder: { options: { name: 'title', type: 'title', objectName: 'Titel', x: X0, y: Y.titel, w: CW, h: 0.38, margin: 0, fontFace: F.black, bold: false, fontSize: 22, lineSpacing: 24, color: cs.titel, valign: 'top', align: 'left' }, text: 'TITEL DES ANHANGS, EINE ZEILE' } }
        : { placeholder: { options: { name: 'title', type: 'title', objectName: 'Titel', x: X0, y: Y.titel, w: CW, h: Y.titelH, margin: 0, fontFace: F.black, bold: false, fontSize: 32, lineSpacing: 33, color: cs.titel, valign: 'top', align: 'left' }, text: 'DER TITEL IST DIE AUSSAGE, ZWEI ZEILEN' } },
    ];
  },
  // 4.2 Schriftfeld klein (Mini-Plankopf): Projektzeile, Rubrik, Wortmarke, Blatt-Zelle mit Nummer
  schriftfeld(grund = 'hell', label = 'Blatt') {
    const cs = GRUND[grund], dunkel = grund === 'anthrazit';
    const zelle = grund === 'papier' ? C.weiss : dunkel ? HEX.dunkel.flaeche2 : C.papier;
    const sek = dunkel ? HEX.dunkel.text2 : cs.sekundaer;
    return [
      { line: { x: X0, y: Y.fuss, w: CW, h: 0, line: { color: cs.linie, width: 0.75 }, objectName: 'Schriftfeld Oberlinie' } },
      { line: { x: X0, y: Y.fuss + Y.fussH, w: CW, h: 0, line: { color: cs.haar, width: 0.5 }, objectName: 'Schriftfeld Unterlinie' } },
      { rect: { x: SF.blatt, y: Y.fuss + 0.01, w: 0.85, h: Y.fussH - 0.015, fill: { color: zelle }, line: { type: 'none' }, objectName: 'Blatt-Zelle' } },
      ...(dunkel ? [{ rect: { x: SF.logo, y: Y.fuss + 0.01, w: 0.95, h: Y.fussH - 0.015, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Logofeld' } }] : []),
      { line: { x: SF.logo, y: Y.fuss, w: 0, h: Y.fussH, line: { color: cs.haar, width: 0.5 }, objectName: 'Schriftfeld Teilung 1' } },
      { line: { x: SF.blatt, y: Y.fuss, w: 0, h: Y.fussH, line: { color: cs.haar, width: 0.5 }, objectName: 'Schriftfeld Teilung 2' } },
      { text: { text: PROJEKT, options: { x: X0, y: Y.fuss + 0.045, w: 8, h: 0.17, margin: 0, fontFace: SF_PROJEKT.fontFace, fontSize: SF_PROJEKT.fontSize, color: sek, valign: 'middle', objectName: 'Schriftfeld Projekt' } } },
      { placeholder: { options: { name: 'rubrik', type: 'body', objectName: 'Rubrik', x: X0, y: Y.fuss + 0.225, w: 8, h: 0.17, margin: 0, fontFace: SF_RUBRIK.fontFace, bold: SF_RUBRIK.bold, fontSize: SF_RUBRIK.fontSize, charSpacing: SF_RUBRIK.weite, color: cs.titel, valign: 'middle' }, text: 'RUBRIK' } },
      { image: { path: asset('logo-mark-rot.png'), x: 11.032, y: Y.fuss + 0.124, w: 0.62, h: 0.192, objectName: 'Wortmarke PGN', altText: 'PGN' } },
      { text: { text: label, options: { x: 11.90, y: Y.fuss + 0.04, w: 0.70, h: 0.15, margin: 0, fontFace: F.medium, fontSize: 10, color: sek, align: 'right', valign: 'middle', objectName: 'Schriftfeld ' + label } } },
      // Foliennummer als Text aus dem Konzept (1 bis 28, A0 bis A9); ein Feld „Foliennummer“ könnte „A3“ nicht zeigen
      { placeholder: { options: { name: 'blatt', type: 'body', objectName: 'Blattnummer', x: 11.90, y: Y.fuss + 0.19, w: 0.70, h: 0.23, margin: 0, fontFace: F.black, fontSize: 15, color: cs.titel, align: 'right', valign: 'middle' }, text: 'Nr.' } },
    ];
  },
  // 4.7 Stempel „Modellrechnung“, doppelte Kontur, 2,12 × 0,37. Die Layouts mit „_MR“ nehmen ihn nur mit STEMPEL_IM_KOPF (lib/theme.cjs)
  stempel(x = ZONE.stempel.x, y = ZONE.stempel.y) {
    return [
      { rect: { x, y, w: 2.12, h: 0.37, fill: { type: 'none' }, line: { color: C.rot, width: 0.5 }, objectName: 'Stempel Außenkontur' } },
      { text: { text: 'MODELLRECHNUNG', options: { x: x + 0.04, y: y + 0.04, w: 2.04, h: 0.29, margin: 0, fontFace: F.xbold, fontSize: 11, charSpacing: 1.3, color: C.rot, align: 'center', valign: 'middle', line: { color: C.rot, width: 0.75 }, objectName: 'Stempel Modellrechnung' } } },
    ];
  },
};

// Titel-Läufe: Zeilen von Hand gebrochen, Versalien, genau ein Signaturwort in Montserrat ExtraBold kursiv.
// o: { akzent, akzentFarbe, stimme (Index der Zeile in zweiter Stimme, Montserrat Light 20 pt),
//      abstand: { 1: 36 } (Zeilenabstand in pt für einzelne Zeilen, Index ab 0; sonst gilt der des Platzhalters) }
function titelLaeufe(zeilen, o = {}) {
  const alle = [];
  let gesetzt = false;
  zeilen.forEach((z, i) => {
    const runs = [];
    // geschützte Leerzeichen zwischen Zahl und Einheit auch im Titel („84.000 €“, „80 %“, „7,0 Mio. €“): Mit Ersatzschriften bräche die Zeile sonst dort
    const last = i === zeilen.length - 1, Z = versal(schutz(z));
    if (o.stimme === i) { alle.push({ text: Z, options: { fontFace: F.montLight, fontSize: 20, charSpacing: 1.0, breakLine: !last } }); return; }
    const Ak = o.akzent ? versal(schutz(o.akzent)) : null, p = Ak && !gesetzt ? Z.indexOf(Ak) : -1;
    if (p >= 0) {
      gesetzt = true;
      const a = Z.slice(0, p), b = Z.slice(p + Ak.length), ak = { fontFace: F.xbold, italic: true, breakLine: !last && !b };
      if (o.akzentFarbe) ak.color = o.akzentFarbe;
      if (a) runs.push({ text: a, options: {} });
      runs.push({ text: Ak, options: ak });
      if (b) runs.push({ text: b, options: { breakLine: !last } });
    } else runs.push({ text: Z, options: { breakLine: !last } });
    // Zeilenabstand dieser Zeile: an allen Läufen des Absatzes gleich
    if (o.abstand && o.abstand[i]) for (const r of runs) r.options.lineSpacing = o.abstand[i];
    alle.push(...runs);
  });
  if (o.akzent && !gesetzt) throw new Error(`Signaturwort „${o.akzent}“ steht in keiner Titelzeile: ${zeilen.join(' | ')}`);
  return alle;
}
// Zeichen mit Unterlänge (Komma, Semikolon, Klammern) in einer Titelzeile, die über einem Umlaut der nächsten Zeile stehen:
// Bei dem engen Zeilenabstand der Titel berührt die Unterlänge die Umlautpunkte. Rückgabe: [{ zeile (Index der unteren Zeile), oben, unten }]
function titelKollisionen(pruefzeilen) {
  const lagen = runs => { const out = []; let x = 0; for (const r of runs) for (const ch of r.text) { const b = breite(ch, r.stil); out.push({ ch, x0: x, x1: x + b }); x += b; } return out; };
  const z = pruefzeilen.map(lagen), treffer = [];
  for (let i = 0; i + 1 < z.length; i++) for (const a of z[i]) if (/[,;()]/.test(a.ch)) for (const b of z[i + 1]) if (/[ÄÖÜ]/.test(b.ch) && a.x0 < b.x1 - 0.02 && a.x1 > b.x0 + 0.02) treffer.push({ zeile: i + 1, oben: a.ch, unten: b.ch });
  return treffer;
}
// Dieselben Zeilen für die Passprüfung: je Zeile die Läufe mit ihrem Stil
function titelPruefzeilen(zeilen, o, basis) {
  let gesetzt = false;
  return zeilen.map((z, i) => {
    const Z = versal(schutz(z));
    if (o.stimme === i) return [{ text: Z, stil: { fontFace: F.montLight, fontSize: 20, weite: 1.0 } }];
    const Ak = o.akzent ? versal(schutz(o.akzent)) : null, p = Ak && !gesetzt ? Z.indexOf(Ak) : -1;
    if (p < 0) return [{ text: Z, stil: basis }];
    gesetzt = true;
    return [{ text: Z.slice(0, p), stil: basis }, { text: Ak, stil: { fontFace: F.xbold, italic: true, fontSize: basis.fontSize } }, { text: Z.slice(p + Ak.length), stil: basis }].filter(l => l.text);
  });
}

// ================================================================================================================
// Teil 2: Bausteine für die Inhaltszone
// ================================================================================================================
// kx: { grund: 'hell' | 'papier' | 'rot' | 'anthrazit', P: Pruefung, layout: Name des Layouts }
// Zusatz der ersten Folie der Modellrechnung in der Kickerzeile (B.stempelZusatz): Work Sans Medium in Grau, Schriftgrad in pt
const ZUSATZ_PT = 11;

function bausteine(pres, kx) {
  const cs = GRUND[kx.grund || 'hell'], P = kx.P, ST = pres.ShapeType, B = {};
  const istMR = /_MR$/.test(kx.layout || '');
  // Die Lage jeder Form (Satzspiegel, Inhaltszone, Folienfläche) prüft der Build nach bau(ctx) für alle Formen der Folie: lib/zonenpruefung.cjs.
  // Hier nur die Pflichtmaße: Fehlt eine Lage oder Größe oder ist sie keine Zahl, bricht der Baustein mit klarer Meldung ab.
  const brauche = (was, o, felder) => {
    if (!o || typeof o !== 'object') throw new Error(`${was}: Optionen fehlen.`);
    for (const k of felder) if (typeof o[k] !== 'number' || !isFinite(o[k])) throw new Error(`${was}: „${k}“ fehlt oder ist keine Zahl (${o[k]}). Lage und Größe in Zoll angeben.`);
  };

  // ---- Stil und Text ------------------------------------------------------------------------------------------
  const farbe = f => (f in cs ? cs[f] : f);
  function stil(rolle, o = {}) {
    const s = SKALA[rolle];
    if (!s) throw new Error(`Textrolle „${rolle}“ gibt es nicht. Rollen: ${Object.keys(SKALA).join(', ')}`);
    const r = { ...s, rolle };
    if (o.pt) { r.fontSize = o.pt; if (r.zeile) r.zeile = Math.round(o.pt * s.zeile / s.fontSize); }
    r.color = farbe(o.farbe || s.farbe);
    return r;
  }
  function opt(st, geo = {}, mehr = {}) {
    const o = { margin: 0, isTextBox: true, fontFace: st.fontFace, bold: !!st.bold, italic: !!st.italic, fontSize: st.fontSize, color: st.color, align: 'left', valign: 'top', ...geo, ...mehr };
    if (st.weite) o.charSpacing = st.weite;
    if (st.zeile) o.lineSpacing = st.zeile; else if (st.zeileMal) o.lineSpacingMultiple = st.zeileMal;
    return o;
  }
  const fettStil = st => (st.fontFace === F.text || st.fontFace === F.medium ? { fontFace: F.semi, color: cs.fett } : { fontFace: F.mont, bold: true, color: cs.fett });
  // Text → Läufe. „**fett**“ setzt Work Sans SemiBold in Titelfarbe, „\n“ beginnt einen neuen Absatz.
  function laeufe(text, st, o = {}) {
    if (Array.isArray(text)) return text;
    let t = schutz(text); if (st.versal && o.versal !== false) t = versal(t);
    const runs = [], abs = t.split('\n');
    abs.forEach((a, ai) => {
      const teile = a.split('**');
      teile.forEach((teil, ti) => {
        const letzter = ti === teile.length - 1;
        if (!teil && !letzter) return;
        const ro = ti % 2 ? fettStil(st) : {};
        if (letzter && ai < abs.length - 1) ro.breakLine = true;
        if (o.absatz) Object.assign(ro, o.absatz);
        runs.push({ text: teil, options: ro });
      });
    });
    return runs;
  }
  const klar = t => (Array.isArray(t) ? t.map(r => r.text).join('') : schutz(t).replace(/\*\*/g, ''));

  // Freier Text in einer Rolle der Schriftskala. Ohne h wird die Höhe aus dem Text gerechnet. Rückgabe: { x, y, w, h, unten }
  B.text = (s, text, o) => {
    brauche('B.text', o, ['x', 'y', 'w']);
    if (text === undefined || text === null) throw new Error('B.text: Text fehlt.');
    const st = stil(o.rolle || 'fliess', o);
    let t = klar(text); if (st.versal && o.versal !== false) t = versal(t);
    const zh = zeilenhoehe(st);
    const h = o.h || +(zeilenzahl(t, st, o.w) * zh + 0.04).toFixed(3);
    if (P && o.pruefen !== false) {
      if (o.einzeilig) P.zeile(o.name || `Text (${st.rolle})`, t, st, o.w); else P.block(o.name || `Text (${st.rolle})`, t, st, o.w, Math.max(h, zh), { luft: !!o.h });
    }
    // Mindestgröße je Rolle (E3): Fließtext 14 pt, Zusätze 12 pt, Beschriftungen 10 pt
    if (P) P.mindest(o.name || `Text (${st.rolle})`, st.fontSize, ROLLENMIN[st.rolle] || 10);
    // Einzeilige Felder brechen nie um (wrap="none"): Ist die Schrift auf einem anderen Rechner etwas breiter, läuft der Text über sein Feld,
    // statt in eine zweite Zeile zu fallen. Die Passprüfung rechnet die Breite weiter gegen das Feld.
    s.addText(laeufe(text, st, o), opt(st, { x: o.x, y: o.y, w: o.w, h }, { align: o.align || 'left', valign: o.valign || 'top', objectName: o.name || 'Text ' + st.rolle, ...(o.einzeilig ? { wrap: false } : {}) }));
    return { x: o.x, y: o.y, w: o.w, h, unten: o.y + h };
  };

  // Höhe eines Textes in einer Rolle der Schriftskala bei gegebener Breite, gerechnet wie B.text ohne h (Zeilen × Zeilenmaß + 0,04).
  // Zum Ausrichten an einer Unterkante oder zum Stapeln, bevor gezeichnet wird. o: { w, rolle, pt }
  B.hoehe = (text, o) => {
    brauche('B.hoehe', o, ['w']);
    const st = stil(o.rolle || 'fliess', o);
    let t = klar(text); if (st.versal && o.versal !== false) t = versal(t);
    return +(zeilenzahl(t, st, o.w) * zeilenhoehe(st) + 0.04).toFixed(3);
  };

  // Bricht einen Text, der nicht in eine Zeile der Breite w passt, an der Wortfuge mit den zwei ausgeglichensten Zeilen („\n“). Geschützte
  // Leerzeichen (Zahl und Einheit) brechen nicht. nach: Muster für das Ende der ersten Zeile (etwa /[,;]$/: nur hinter Komma oder Semikolon).
  // Passt keine Teilung in zwei Zeilen, bleibt der Text, wie er ist, und bricht im Textfeld von selbst. o: { w, rolle, pt, nach }
  B.zweizeilig = (text, o) => {
    brauche('B.zweizeilig', o, ['w']);
    const st = stil(o.rolle || 'fliess', o), t = schutz(String(text)), mass = z => breite(z.replace(/\*\*/g, ''), st);
    if (mass(t) <= o.w) return t;
    let beste = null;
    for (let i = t.indexOf(' '); i >= 0; i = t.indexOf(' ', i + 1)) {
      if (o.nach && !o.nach.test(t.slice(0, i))) continue;
      const a = mass(t.slice(0, i)), b = mass(t.slice(i + 1));
      if (a <= o.w && b <= o.w && (!beste || Math.max(a, b) < beste.laenge)) beste = { i, laenge: Math.max(a, b) };
    }
    return beste ? `${t.slice(0, beste.i)}\n${t.slice(beste.i + 1)}` : t;
  };

  // Einzeiliger Text auf der Plotfläche eines Diagramms (Summe am Balkenende, Wert an einer Säule): Dahinter liegt eine Fläche in der Grundfarbe,
  // so breit wie die Schrift, damit keine Gitterlinie durch die Zahl läuft. o wie bei B.text (x, y, w, h, rolle, pt, align, valign, farbe, name);
  // grund: Farbe der Fläche, wenn der Text nicht auf dem Grund der Folie steht (zum Beispiel auf einer hervorgehobenen Spalte).
  B.textAufPlot = (s, text, o) => {
    brauche('B.textAufPlot', o, ['x', 'y', 'w', 'h']);
    const rand = 0.05, name = o.name || 'Text auf der Plotfläche', b = breite(schutz(String(text)), stil(o.rolle || 'wert', { pt: o.pt }));
    const x = o.align === 'right' ? o.x + o.w - b - rand : o.align === 'center' ? o.x + (o.w - b) / 2 - rand : o.x - rand;
    B.kasten(s, { x, y: o.y, w: b + 2 * rand, h: o.h, farbe: o.grund || (kx.grund === 'papier' ? C.papier : cs.grund), name: 'Grund hinter ' + name });
    return B.text(s, text, { ...o, name, einzeilig: true });
  };
  // Fläche in der Grundfarbe zwischen zwei Werten, die nebeneinander auf fast gleicher Höhe über ihren Säulen stehen (B.textAufPlot): Sie deckt
  // die Gitterlinie zwischen den beiden Zahlen. Ein Stück Linie dort läse sich als Bis-Strich („726–761“). Vor den beiden Texten anlegen.
  // o: { x0, x1 (Mitten der beiden Texte; am Rand der Plotfläche deren Kante), y0, y1 (Oberkanten der beiden Textfelder), h: 0.22 (Höhe der
  //      Textfelder), name }. Liegen die Oberkanten um die Höhe der Felder oder mehr auseinander, entfällt die Fläche. Sie endet 0,02 Zoll über
  // der höheren Säule (die Werte stehen 0,04 über ihrer Säule). Rückgabe: true, wenn die Fläche gezeichnet ist
  B.grundZwischenWerten = (s, o) => {
    brauche('B.grundZwischenWerten', o, ['x0', 'x1', 'y0', 'y1']);
    const h = o.h || 0.22, dy = Math.abs(o.y0 - o.y1);
    if (dy >= h || o.x1 <= o.x0) return false;
    B.kasten(s, { x: o.x0, y: Math.min(o.y0, o.y1), w: o.x1 - o.x0, h: Math.min(h + dy, h + 0.02), farbe: kx.grund === 'papier' ? C.papier : cs.grund, name: o.name || 'Grund zwischen den Werten' });
    return true;
  };

  // Linie. art: haar | tinte | kraeftig | modul | mass | referenz | grau | signal | akzent. Waagerecht mit w, senkrecht mit h.
  const LINIEN = { haar: [cs.haar, 0.5], tinte: [cs.linie, 0.75], kraeftig: [cs.linie, 1], modul: [cs.linie, 1.5], mass: [cs.mass, 0.75], referenz: [C.referenz, 0.75], grau: [HEX.grau300, 1.5], signal: [C.dunkelrot, 1], akzent: [C.rot, 1] };
  B.linie = (s, o) => {
    brauche('B.linie', o, ['x', 'y']);
    if (typeof o.w !== 'number' && typeof o.h !== 'number') throw new Error('B.linie: w (waagerecht) oder h (senkrecht) fehlt.');
    const [col, pt] = LINIEN[o.art || 'haar'] || (() => { throw new Error(`Linienart „${o.art}“ gibt es nicht: ${Object.keys(LINIEN).join(', ')}`); })();
    const line = { color: o.farbe || col, width: o.pt || pt };
    if (o.strich && o.strich !== 'solid') line.dashType = o.strich;
    s.addShape(ST.line, { x: o.x, y: o.y, w: o.w || 0, h: o.h || 0, line, objectName: o.name || 'Linie ' + (o.art || 'haar') });
  };

  // Kasten. art: kasten (Papier auf Weiß, Weiß auf Papier) | rahmen (ohne Füllung, Linie 0,75 pt) | hauch (FBF1F3)
  B.kasten = (s, o) => {
    const art = o.art || 'kasten';
    brauche('B.kasten', o, ['x', 'y', 'w', 'h']);
    const fill = art === 'rahmen' ? { type: 'none' } : { color: art === 'hauch' ? HEX.hauch50 : o.farbe || cs.kasten };
    s.addShape(ST.rect, { x: o.x, y: o.y, w: o.w, h: o.h, fill, line: art === 'rahmen' ? { color: cs.linie, width: 0.75 } : { type: 'none' }, objectName: o.name || 'Kasten' });
    return { x: o.x + 0.20, y: o.y + 0.16, w: o.w - 0.40, h: o.h - 0.32 };
  };

  // 4.15 Modulkopf: Linie 1,5 pt, Titel 0,08 darunter, optional Untertitel. Rückgabe: y, ab dem der Inhalt beginnt
  // o: { x, y, w, titel, sub, signal: true (Linie und Titel in Dunkelrot; nur mit Wort, zum Beispiel „Förderschädlich“),
  //      icon: Name eines Linien-Icons vor dem Titel (0,24 Zoll), altText: Alternativtext des Icons, art: Linienart statt „modul“, farbe: Titelfarbe,
  //      rechts: zweite Angabe rechts in der Titelzeile (12 pt, grau, rechtsbündig; für Köpfe, unter denen jede Zeile Höhe zählt) }
  B.modulkopf = (s, o) => {
    brauche('B.modulkopf', o, ['x', 'y', 'w']);
    const sig = !!o.signal, dunkel = kx.grund === 'anthrazit' || kx.grund === 'rot';
    B.linie(s, { x: o.x, y: o.y, w: o.w, art: o.art || 'modul', ...(sig ? { farbe: C.dunkelrot, pt: 1.5 } : {}), name: 'Modulkopf-Linie' });
    if (!o.titel) return o.y + 0.14;
    const dx = o.icon ? 0.32 : 0;
    if (o.icon) B.icon(s, { name: o.icon, farbe: sig ? 'dunkelrot' : dunkel ? 'weiss' : 'tinte', x: o.x, y: o.y + 0.09, d: 0.24, altText: o.altText });
    let wTitel = o.w - dx;
    if (o.rechts) {
      // Titel und Angabe teilen sich die Zeile: zusammen höchstens die Breite des Kopfs abzüglich eines Stegs
      const bt = breite(versal(schutz(o.titel)), stil('diagrammtitel')), br = breite(schutz(o.rechts), stil('sub'));
      if (P && dx + bt + br + 0.24 > o.w) P.melde(`Modulkopf: Titel (${bt.toFixed(2)} Zoll) und Angabe rechts (${br.toFixed(2)} Zoll) passen nicht nebeneinander in ${o.w.toFixed(2)} Zoll.`);
      B.text(s, o.rechts, { x: o.x + o.w - br - 0.04, y: o.y + 0.09, w: br + 0.04, h: 0.24, rolle: 'sub', align: 'right', valign: 'middle', einzeilig: true, name: 'Modulkopf Angabe rechts' });
      wTitel = Math.max(0.5, o.w - dx - br - 0.24);
    }
    B.text(s, o.titel, { x: o.x + dx, y: o.y + 0.08, w: wTitel, h: 0.26, rolle: 'diagrammtitel', valign: 'middle', einzeilig: true, farbe: sig ? C.dunkelrot : o.farbe, name: 'Modultitel' });
    if (!o.sub) return o.y + 0.46;
    B.text(s, o.sub, { x: o.x, y: o.y + 0.34, w: o.w, h: 0.24, rolle: 'sub', valign: 'middle', einzeilig: true, name: 'Modul-Untertitel' });
    return o.y + 0.70;
  };

  // 4.15 Planlegende / Kommentarspalte: Einträge aus Modultitel und Text in einem Textfeld.
  // o: { x, y, w, h, eintraege: [{ titel, text }], pt: 16 | 14 | 12, platzhalter: 'kommentar' | 'seite', linie: true (Modulkopf-Linie bei y),
  //      titelAbstand: 10 (Abstand vor den Zwischentiteln in pt; 4 für Spalten, die ihr Feld sonst bis auf die letzte Zeile füllen) }
  // Ein Eintrag braucht titel oder text; ohne titel ist er ein Absatz (8 pt Abstand zum vorigen). Freie Lage ohne h: Die Höhe folgt dem Text.
  // Mit linie steht der Text 0,07 unter der Linie: Der Modultitel der ersten Zeile hat dann die Höhe eines Titels aus B.modulkopf.
  B.planlegende = (s, o) => {
    if (!o || !Array.isArray(o.eintraege) || !o.eintraege.length) throw new Error('B.planlegende: eintraege fehlt (Liste aus { titel, text }).');
    const pt = o.pt || 16, st = stil(pt >= 16 ? 'fliess' : pt >= 14 ? 'dicht' : 'kleinText', { pt }), tt = stil('modultitel'), vor = o.titelAbstand ?? 10;
    let geo;
    if (o.platzhalter) {
      const z = { kommentar: /TABELLE/.test(kx.layout) ? ZONE.tabelle.kommentar : /DIAGRAMM/.test(kx.layout) ? ZONE.diagramm.kommentar : null, seite: /^PGN_AUSSAGE$/.test(kx.layout) ? ZONE.aussage.seite : null }[o.platzhalter];
      if (z === undefined) throw new Error(`Planlegende: Platzhalter „${o.platzhalter}“ kennt nur kommentar und seite`);
      if (!z) throw new Error(`Planlegende: Das Layout ${kx.layout} hat keinen Platzhalter „${o.platzhalter}“ (kommentar: PGN_DIAGRAMM und PGN_TABELLE, seite: PGN_AUSSAGE). Sonst freie Lage mit x, y, w.`);
      geo = { ...z };
    } else {
      brauche('B.planlegende', o, ['x', 'y', 'w']);
      geo = { x: o.x, y: o.y, w: o.w, h: o.h > 0 ? o.h : 0 };
      if (o.linie) { B.linie(s, { x: o.x, y: o.y, w: o.w, art: 'modul', name: 'Modulkopf-Linie' }); geo.y = o.y + 0.07; if (geo.h) geo.h = +(geo.h - 0.07).toFixed(3); }
    }
    const runs = [];
    let hoehe = 0;
    o.eintraege.forEach((e, i) => {
      if (!e || (!e.titel && !e.text)) throw new Error(`B.planlegende: Eintrag ${i + 1} hat weder titel noch text.`);
      const letzter = i === o.eintraege.length - 1;
      if (e.titel) {
        runs.push({ text: versal(schutz(e.titel)), options: { fontFace: tt.fontFace, fontSize: tt.fontSize, charSpacing: tt.weite, color: tt.color, breakLine: !!e.text || !letzter, paraSpaceBefore: i ? vor : 0, paraSpaceAfter: 2 } });
        hoehe += zeilenzahl(versal(schutz(e.titel)), tt, geo.w) * zeilenhoehe({ ...tt, zeileMal: st.zeileMal }) + (i ? vor : 0) / 72 + 2 / 72;
      }
      if (!e.text) return;
      const lr = laeufe(e.text, st, { absatz: { fontSize: pt, ...(!e.titel && i ? { paraSpaceBefore: 8 } : {}) } });
      if (!letzter) lr[lr.length - 1].options.breakLine = true;
      runs.push(...lr);
      hoehe += zeilenzahl(klar(e.text), st, geo.w) * zeilenhoehe(st) + (!e.titel && i ? 8 / 72 : 0);
    });
    const fest = !!geo.h;                                    // Feld fester Höhe (Platzhalter oder h): Luft wird geprüft
    if (!geo.h) geo.h = +(hoehe + 0.04).toFixed(3);        // freie Lage ohne h: Höhe aus dem Text
    if (P) {
      if (hoehe > geo.h + 0.005) P.melde(`Planlegende: Text braucht ${hoehe.toFixed(2)} Zoll, das Feld ist ${geo.h.toFixed(2)} Zoll hoch (Breite ${geo.w.toFixed(2)}, ${pt} pt). Kürzen oder kleinere Stufe wählen.`);
      else if (fest) P.luft(o.name || 'Planlegende', hoehe, geo.h);
      P.mindest('Planlegende', pt, 12);
    }
    if (o.platzhalter) s.addText(runs, { placeholder: o.platzhalter });
    else s.addText(runs, opt(st, geo, { objectName: o.name || 'Planlegende' }));
    return { ...geo, unten: geo.y + hoehe };
  };

  // Aufzählung mit eckigem Marker (die Nachbearbeitung färbt ihn rot). o: { x, y, w, h, punkte: [], pt: 16 | 14 (Anhang auch 12), platzhalter: 'body' }
  // Freie Lage ohne h: Die Höhe folgt dem Text. „**“ wird entfernt (keine Fettung in Aufzählungen). Rückgabe: { x, y, w, h, unten }
  B.aufzaehlung = (s, o) => {
    if (!o || !Array.isArray(o.punkte) || !o.punkte.length) throw new Error('B.aufzaehlung: punkte fehlt (Liste von Texten).');
    if (o.platzhalter && (o.platzhalter !== 'body' || kx.layout !== 'PGN_AUSSAGE')) throw new Error('B.aufzaehlung: platzhalter kennt nur „body“ im Layout PGN_AUSSAGE. Sonst freie Lage mit x, y, w.');
    if (!o.platzhalter) brauche('B.aufzaehlung', o, ['x', 'y', 'w']);
    const pt = o.pt || 16, st = stil(pt >= 16 ? 'fliess' : pt >= 14 ? 'dicht' : 'kleinText', { pt });
    const texte = o.punkte.map(p => schutz(p).replace(/\*\*/g, ''));
    // die Größe steht an jedem Lauf: In einem Platzhalter gewinnt sonst dessen Größe
    const runs = texte.map((t, i) => ({ text: t, options: { fontSize: pt, bullet: { characterCode: '25A0', indent: 16 }, paraSpaceAfter: 6, breakLine: i < texte.length - 1 } }));
    const z = o.platzhalter ? ZONE.aussage.body : null, w = (z ? z.w : o.w) - 16 / 72;
    const hoehe = texte.reduce((a, t) => a + zeilenzahl(t, st, w) * zeilenhoehe(st) + 6 / 72, 0);
    const geo = z ? { ...z } : { x: o.x, y: o.y, w: o.w, h: o.h > 0 ? o.h : +(hoehe + 0.04).toFixed(3) };
    if (P) {
      if (o.punkte.length > 5) P.hinweis(`Aufzählung mit ${o.punkte.length} Punkten (Planwerk: höchstens fünf)`);
      for (const t of texte) P.block('Aufzählungspunkt', t, st, w, geo.h);
      if (hoehe > geo.h + 0.005) P.melde(`Aufzählung: Text braucht ${hoehe.toFixed(2)} Zoll, das Feld ist ${geo.h.toFixed(2)} Zoll hoch (${pt} pt).`);
      else if (z || o.h > 0) P.luft('Aufzählung', hoehe, geo.h);
      P.mindest('Aufzählung', pt, kx.art === 'anhang' ? 12 : 14);
    }
    if (o.platzhalter) s.addText(runs, { placeholder: o.platzhalter });
    else s.addText(runs, opt(st, geo, { objectName: o.name || 'Aufzählung' }));
    return { ...geo, unten: geo.y + hoehe };
  };

  // ---- 4.5 Achskreis ------------------------------------------------------------------------------------------
  // o: { cx, cy, text, groesse: 'S' | 'M' | 'L' | 'G' | 'XL', d, pt, variante: standard | akzent | gefuellt | signal | gruppe, gruppe: 'A' | 'B' | 'C' }
  // G und XL stehen in Montserrat Black mit Kontur 1,5 pt: XL trägt die Nummer des Abschnitts in Rot (Trenner), G die Ziffer in Tinte (Agenda)
  const KREIS = { S: [0.30, 10], M: [0.40, 12], L: [0.46, 14], G: [0.90, 32], XL: [1.40, 54] };
  B.achskreis = (s, o) => {
    brauche('B.achskreis', o, ['cx', 'cy']);
    if (o.text === undefined || o.text === null) throw new Error('B.achskreis: text fehlt (Achskreise tragen immer ein Zeichen).');
    if (!KREIS[o.groesse || 'M']) throw new Error(`B.achskreis: Größe „${o.groesse}“ gibt es nicht (S, M, L, G, XL).`);
    const [d0, pt0] = KREIS[o.groesse || 'M'], d = o.d || d0, pt = o.pt || pt0, v = o.variante || 'standard', xl = o.groesse === 'XL', gross = xl || o.groesse === 'G';
    let fill = { color: C.weiss }, line = { color: cs.linie, width: gross ? 1.5 : 0.75 }, col = xl ? C.rot : C.tinte;
    if (kx.grund === 'rot') { fill = { color: C.rot }; line = { color: C.weiss, width: gross ? 1.5 : 0.75 }; col = C.weiss; }
    if (kx.grund === 'anthrazit') { fill = { color: C.anthrazit }; line = { color: C.weiss, width: 0.75 }; col = C.weiss; }
    if (v === 'akzent') { line = { color: C.rot, width: 1 }; col = C.rot; fill = { color: C.weiss }; }
    if (v === 'gefuellt') { fill = { color: kx.grund === 'rot' ? C.weiss : C.rot }; line = { color: kx.grund === 'rot' ? C.weiss : C.rot, width: 0.75 }; col = kx.grund === 'rot' ? C.rot : C.weiss; }
    if (v === 'signal') { fill = { color: C.dunkelrot }; line = { color: C.dunkelrot, width: 0.75 }; col = C.weiss; }
    if (v === 'tinte') { fill = { color: C.tinte }; line = { color: C.tinte, width: 0.75 }; col = C.weiss; }
    if (v === 'gruppe') {
      const g = o.gruppe || String(o.text);
      if (!HEX.gruppe[g]) throw new Error(`Achskreis: Gruppe „${g}“ gibt es nicht (A, B, C)`);
      fill = { color: HEX.gruppe[g] }; line = { color: HEX.gruppe[g], width: 0.75 }; col = HEX.gruppeText[g];
    }
    s.addText(String(o.text), { shape: ST.ellipse, x: o.cx - d / 2, y: o.cy - d / 2, w: d, h: d, margin: 0, align: 'center', valign: 'middle',
      fontFace: gross ? F.black : F.xbold, fontSize: pt, color: col, fill, line, objectName: o.name || 'Achskreis ' + o.text });
  };

  // ---- 4.6 Maßkette --------------------------------------------------------------------------------------------
  // o: { x, y, w, segmente: [{ anteil, text, akzent, ausrichtung: 'links' }], hilfslinienBis: y, farbe, grund }. Anteile in beliebiger Einheit, die Summe ist die Länge.
  // Der Wert steht mittig über dem Segment; mit ausrichtung „links“ beginnt er am Segmentanfang (für Texte, die breiter sind als das Segment).
  // grund: true legt hinter jeden Wert eine Fläche in der Grundfarbe (Maßkette auf der Plotfläche eines Diagramms, Folie 3).
  const tick = (s, x, y, col) => s.addShape(ST.line, { x: x - 0.05, y: y - 0.05, w: 0.10, h: 0.10, flipV: true, line: { color: col, width: 1.25 }, objectName: 'Maßstrich' });
  B.masskette = (s, o) => {
    brauche('B.masskette', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.segmente) || !o.segmente.length) throw new Error('B.masskette: segmente fehlt (Liste aus { anteil, text }).');
    for (const g of o.segmente) if (typeof g.anteil !== 'number' || !isFinite(g.anteil) || g.anteil < 0) throw new Error(`B.masskette: anteil „${g.anteil}“ ist keine Zahl.`);
    const col = o.farbe || cs.mass, ges = o.segmente.reduce((a, g) => a + g.anteil, 0), st = stil('wert');
    s.addShape(ST.line, { x: o.x - 0.07, y: o.y, w: o.w + 0.14, h: 0, line: { color: col, width: 0.75 }, objectName: 'Maßkette' });
    let cx = o.x;
    const punkte = [cx];
    for (const g of o.segmente) {
      const sw = o.w * g.anteil / ges;
      if (g.text) {
        const t = schutz(g.text);
        const links = g.ausrichtung === 'links', tb = links ? breite(t, st) + 0.1 : sw + 0.5;
        if (P && !links) P.zeile('Maßkettenwert', t, st, Math.max(sw, 0.2) + 0.5);
        // grund: Fläche in der Grundfarbe hinter dem Wert, so breit wie die Schrift (Maßkette auf der Plotfläche: keine Gitterlinie läuft durch die Zahl)
        if (o.grund) { const b = breite(t, st), xm = links ? cx + 0.08 + b / 2 : cx + sw / 2; B.kasten(s, { x: xm - b / 2 - 0.05, y: o.y - 0.28, w: b + 0.10, h: 0.22, farbe: kx.grund === 'papier' ? C.papier : cs.grund, name: 'Grund hinter Maßkettenwert ' + g.text }); }
        s.addText(t, opt(st, { x: links ? cx + 0.08 : cx - 0.25, y: o.y - 0.28, w: tb, h: 0.24 }, { align: links ? 'left' : 'center', valign: 'bottom', color: g.akzent ? cs.akzent : kx.grund === 'hell' || kx.grund === 'papier' ? C.tinte : C.weiss, objectName: 'Maßkettenwert ' + g.text }));
      }
      cx += sw; punkte.push(cx);
    }
    for (const px of punkte) {
      if (o.hilfslinienBis) s.addShape(ST.line, { x: px, y: o.y, w: 0, h: o.hilfslinienBis - o.y, line: { color: col, width: 0.5 }, objectName: 'Maßhilfslinie' });
      tick(s, px, o.y, col);
    }
    return { punkte };
  };
  // Senkrechte Maßkette von y0 bis y1 mit 45°-Strichen an beiden Enden (Anstieg zwischen zwei Säulen); der Wert steht mittig links oder rechts
  // daneben auf einer Fläche in der Grundfarbe. o: { x, y0, y1, text, seite: 'links' | 'rechts', name }. Die Linie steht 0,07 über
  B.massketteSenkrecht = (s, o) => {
    brauche('B.massketteSenkrecht', o, ['x', 'y0', 'y1']);
    const oben = Math.min(o.y0, o.y1), unten = Math.max(o.y0, o.y1), U = 0.07;
    s.addShape(ST.line, { x: o.x, y: oben - U, w: 0, h: unten - oben + 2 * U, line: { color: cs.mass, width: 0.75 }, objectName: o.name || 'Maßkette senkrecht' });
    for (const y of [oben, unten]) tick(s, o.x, y, cs.mass);
    if (!o.text) return { oben, unten };
    const w = 1.10, links = o.seite !== 'rechts';
    B.textAufPlot(s, o.text, { x: links ? o.x - 0.11 - w : o.x + 0.11, y: (oben + unten) / 2 - 0.12, w, h: 0.24, rolle: 'wert', align: links ? 'right' : 'left', valign: 'middle', name: 'Maßkettenwert ' + o.text });
    return { oben, unten };
  };
  // Zuleitung von der Kante eines Segments (x0, y0) zu seiner Beschriftung (x1, y1): Haarlinie 0,5 pt in Referenzgrau 77716B (hält auch am Beamer), waagerecht; liegen beide Enden
  // auf verschiedener Höhe, läuft sie mit einem Knick bei xKnick (Vorgabe: Mitte). o: { x0, y0, x1, y1, xKnick, name }
  B.zuleitung = (s, o) => {
    brauche('B.zuleitung', o, ['x0', 'y0', 'x1', 'y1']);
    const name = o.name || 'Zuleitung', strich = { art: 'haar', farbe: C.referenz, pt: 0.5 };
    if (Math.abs(o.y1 - o.y0) < 0.012) { B.linie(s, { x: o.x0, y: o.y1, w: o.x1 - o.x0, ...strich, name }); return; }
    const xk = o.xKnick ?? (o.x0 + o.x1) / 2;
    B.linie(s, { x: o.x0, y: o.y0, w: xk - o.x0, ...strich, name: name + ' 1' });
    B.linie(s, { x: xk, y: Math.min(o.y0, o.y1), h: Math.abs(o.y1 - o.y0), ...strich, name: name + ' 2' });
    B.linie(s, { x: xk, y: o.y1, w: o.x1 - xk, ...strich, name: name + ' 3' });
  };
  // 80-%-Achse: Strichpunktlinie in Rot mit Achskreis „80“ auf der Maßkette. o: { x, yOben (Lage der Maßkette), yUnten, text }
  B.achse80 = (s, o) => {
    brauche('B.achse80', o, ['x', 'yOben', 'yUnten']);
    s.addShape(ST.line, { x: o.x, y: o.yOben, w: 0, h: o.yUnten - o.yOben, line: { color: C.rot, width: 1, dashType: 'lgDashDot' }, objectName: 'Achse 80 %' });
    B.achskreis(s, { cx: o.x, cy: o.yOben - 0.15, d: 0.36, pt: 11, text: o.text || '80', variante: 'akzent', name: 'Achskreis 80' });
  };
  // Maßstabsleiste: fünf Felder abwechselnd Tinte und Weiß, direkt unter der Plotfläche. o: { x, y, w }
  B.massstab = (s, o) => {
    brauche('B.massstab', o, ['x', 'y', 'w']);
    for (let i = 0; i < 5; i++) s.addShape(ST.rect, { x: o.x + i * o.w / 5, y: o.y, w: o.w / 5, h: 0.05, fill: { color: i % 2 ? C.weiss : C.tinte }, line: { color: C.tinte, width: 0.5 }, objectName: 'Maßstabsleiste ' + (i + 1) });
  };
  // Schnittlinie A–A: Strichpunktlinie zwischen zwei Buchstaben (höchstens einmal je Folie). o: { x, y, w, text }
  B.schnittlinie = (s, o) => {
    brauche('B.schnittlinie', o, ['x', 'y', 'w']);
    const t = o.text || 'A', st = stil('wert');
    s.addText(t, opt(st, { x: o.x, y: o.y - 0.12, w: 0.2, h: 0.24 }, { valign: 'middle', objectName: 'Schnitt ' + t }));
    s.addShape(ST.line, { x: o.x + 0.22, y: o.y, w: o.w - 0.44, h: 0, line: { color: cs.linie, width: 0.5, dashType: 'lgDashDot' }, objectName: 'Schnittlinie' });
    s.addText(t, opt(st, { x: o.x + o.w - 0.2, y: o.y - 0.12, w: 0.2, h: 0.24 }, { align: 'right', valign: 'middle', objectName: 'Schnitt ' + t }));
  };
  // 4.12 Höhenkote: Dreieck mit Spitze nach unten auf (x, y), Wert daneben. o: { x, y, text, seite: 'rechts' | 'links', signal }
  B.kote = (s, o) => {
    brauche('B.kote', o, ['x', 'y']);
    const col = o.signal ? C.dunkelrot : C.rot, st = stil('wert');
    s.addShape(ST.flowChartMerge, { x: o.x - 0.06, y: o.y - 0.10, w: 0.12, h: 0.10, fill: { color: col }, line: { type: 'none' }, objectName: 'Höhenkote' });
    const links = o.seite === 'links', w = +Math.min(o.w || 1.6, breite(schutz(String(o.text)), st) + 0.08).toFixed(3);
    if (P) P.zeile('Kotenwert', schutz(String(o.text)), st, o.w || 1.6);
    s.addText(schutz(o.text), opt(st, { x: links ? o.x - 0.12 - w : o.x + 0.12, y: o.y - 0.17, w, h: 0.22 }, { align: links ? 'right' : 'left', valign: 'middle', color: o.signal ? C.dunkelrot : cs.titel, objectName: 'Kotenwert ' + o.text }));
  };
  // Marke im Diagramm: senkrechte oder waagerechte Maßlinie mit Beschriftung.
  // o: { x, y, h (senkrecht) oder w (waagerecht), text, art: mass | referenz | signal, strich, textBreite, rolle: 'achse' (11 pt) | 'wert' (Montserrat Bold 12),
  //      textSeite: senkrecht 'rechts' | 'links' | 'oben'; waagerecht 'oben' (über dem Anfang) | 'rechts' (über dem Ende) | 'aussen' (rechts neben dem Ende) }
  B.marke = (s, o) => {
    brauche('B.marke', o, ['x', 'y']);
    if (typeof o.h !== 'number' && typeof o.w !== 'number') throw new Error('B.marke: h (senkrechte Marke) oder w (waagerechte Marke) fehlt.');
    const art = o.art || 'mass', senkrecht = !!o.h;
    B.linie(s, { x: o.x, y: o.y, w: o.w, h: o.h, art, strich: o.strich, name: 'Marke' });
    if (!o.text) return;
    const st = stil(o.rolle || 'achse', { farbe: art === 'signal' ? C.dunkelrot : art === 'referenz' ? 'sekundaer' : 'text' }), seite = o.textSeite || (senkrecht ? 'rechts' : 'oben');
    // Das Textfeld ist so breit wie die längste Zeile, höchstens textBreite (Vorgabe 2,4). Zeilen bricht man mit „\n“.
    const zeilen = schutz(String(o.text)).replace(/\*\*/g, '').split('\n'), grenze = o.textBreite || 2.4, bt = Math.max(...zeilen.map(z => breite(z, st))) + 0.08;
    if (P) for (const z of zeilen) P.zeile('Markentext', z, st, grenze);
    const tw = +Math.min(grenze, bt).toFixed(3), n = zeilen.length, th = n * 0.19 + 0.02;
    let geo, align = 'left', valign = 'top';
    if (senkrecht && seite === 'rechts') geo = { x: o.x + 0.07, y: o.y, w: tw, h: th };
    else if (senkrecht && seite === 'links') { geo = { x: o.x - 0.07 - tw, y: o.y, w: tw, h: th }; align = 'right'; }
    else if (senkrecht) { geo = { x: o.x - tw / 2, y: o.y - th - 0.03, w: tw, h: th }; align = 'center'; valign = 'bottom'; }
    else if (seite === 'aussen') { geo = { x: o.x + o.w + 0.08, y: o.y - th / 2, w: tw, h: th }; valign = 'middle'; }
    else if (seite === 'rechts') { geo = { x: o.x + o.w - tw, y: o.y - th - 0.02, w: tw, h: th }; align = 'right'; valign = 'bottom'; }
    else { geo = { x: o.x, y: o.y - th - 0.02, w: tw, h: th }; valign = 'bottom'; }
    // Der Text bricht nur an „\n“: ohne Umbruch im Feld (wrap="none"), wie die einzeiligen Felder aus B.text
    s.addText(laeufe(o.text, st), opt(st, geo, { align, valign, objectName: 'Markentext', wrap: false }));
  };

  // Waagerechte Marke über einem Säulendiagramm: gestrichelte Linie in Referenzgrau von x0 bis x1, an den genannten Lücken unterbrochen
  // (dort stehen Datenbeschriftungen oder Säulen, die bis an die Linie reichen). Rechts der Plotfläche läuft die Linie weiter; die Beschriftung
  // steht auf dieser Verlängerung über oder unter der Linie, wie ein Maß auf der Maßlinie. Zeilen bricht man mit „\n“; „**fett**“ hebt den Wert hervor.
  // Mit lage „aussen“ steht der Text einzeilig rechts neben dem Linienende auf der Höhe der Linie (textX: Vorgabe x1 + 0,08), wenn die Marke
  // nur über einem Teil der Plotfläche liegt.
  // o: { y, x0, x1, luecken: [[von, bis]], text, textX, textBreite, lage: 'ueber' | 'unter' | 'aussen', name }. Rückgabe: { stuecke, textOben, textUnten }
  B.markeMitLuecken = (s, o) => {
    brauche('B.markeMitLuecken', o, ['y', 'x0', 'x1']);
    const name = o.name || 'Marke';
    // Lücken ordnen und zusammenlegen, dann die Stücke dazwischen zeichnen
    const luecken = (o.luecken || []).map(l => [Math.max(o.x0, l[0]), Math.min(o.x1, l[1])]).filter(l => l[1] > l[0]).sort((a, b) => a[0] - b[0]);
    const stuecke = [], KURZ = 0.30;   // kürzere Stücke zwischen zwei Lücken entfallen: Sie sähen aus wie einzelne Striche
    let x = o.x0;
    for (const [a, b] of luecken) { if (a - x >= KURZ) stuecke.push([x, a]); x = Math.max(x, b); }
    if (o.x1 - x >= KURZ) stuecke.push([x, o.x1]);
    stuecke.forEach(([a, b], i) => B.linie(s, { x: a, y: o.y, w: b - a, art: 'referenz', strich: 'dash', pt: 1, name: `${name} Linie ${i + 1}` }));
    if (!o.text) return { stuecke };
    const aussen = o.lage === 'aussen', textX = aussen && typeof o.textX !== 'number' ? o.x1 + 0.08 : o.textX;
    brauche('B.markeMitLuecken', { ...o, textX }, ['textX', 'textBreite']);
    const st = stil('achse', { farbe: 'sekundaer' }), zeilen = schutz(o.text).replace(/\*\*/g, '').split('\n');
    if (aussen && zeilen.length > 1) throw new Error('B.markeMitLuecken: Mit lage „aussen“ steht der Text in einer Zeile.');
    if (P) for (const z of zeilen) P.zeile('Markentext', z, st, o.textBreite);
    const h = +(zeilen.length * 0.19 + 0.03).toFixed(3), ueber = o.lage !== 'unter', y = aussen ? o.y - h / 2 : ueber ? o.y - 0.03 - h : o.y + 0.04;
    B.text(s, o.text, { x: textX, y, w: o.textBreite, h, rolle: 'achse', farbe: 'sekundaer', valign: aussen ? 'middle' : ueber ? 'bottom' : 'top', name: `${name} Text` });
    return { stuecke, textOben: y, textUnten: y + h };
  };

  // ---- 4.7 Stempel ----------------------------------------------------------------------------------------------
  // Zusatz „Rechenbeispiel, keine Förderzusage“ (nur erste Folie der Modellrechnung; bis 11.11.2026 „Fiktives Beispiel, …“: Das Modellhaus ist seither ein Projekt der PGN). Ohne Lage auf einem Layout mit „_MR“: schlichte Zeile
  // ohne Rahmen an der Stelle des Stempels, in der Kickerzeile rechtsbündig am Satzspiegel. Mit STEMPEL_IM_KOPF (lib/theme.cjs) oder mit Lage
  // (o.x, o.y: Ecke eines frei gesetzten Stempels) steht er wie früher klein links neben dem Stempel. Rückgabe: { text }
  B.stempelZusatz = (s, o = {}) => {
    const neben = STEMPEL_IM_KOPF || o.x !== undefined, name = 'Zusatz Modellrechnung';
    if (neben) {
      const x = o.x ?? ZONE.stempel.x, y = o.y ?? ZONE.stempel.y;
      const t = o.text || 'Rechenbeispiel, keine Förderzusage';
      s.addText(t, opt(stil('label'), { x: x - 3.35, y: y + 0.035, w: 3.2, h: 0.30 }, { align: 'right', valign: 'middle', objectName: name }));
      return { text: t };
    }
    const st = stil('label', { pt: ZUSATZ_PT }), t = o.text || 'Rechenbeispiel, keine Förderzusage', w = 3.6;
    if (P) { P.zeile(name, t, st, w); P.mindest(name, st.fontSize, ROLLENMIN.label); }
    s.addText(t, opt(st, { x: X1 - w, y: Y.kicker, w, h: Y.kickerH }, { align: 'right', valign: 'middle', wrap: false, objectName: name }));
    return { text: t };
  };
  // Stempel frei gesetzt, in der Inhaltszone einer Folie ohne „_MR“. o: { x, y, kurz: true (einfache Kontur, 1,95 × 0,26), zusatz: true }
  B.stempel = (s, o = {}) => {
    const x = o.x ?? ZONE.stempel.x, y = o.y ?? ZONE.stempel.y;
    if (o.kurz) {
      s.addText('MODELLRECHNUNG', { x, y, w: 1.95, h: 0.26, margin: 0, fontFace: F.xbold, fontSize: 10, charSpacing: 1.2, color: C.rot, align: 'center', valign: 'middle', line: { color: C.rot, width: 0.75 }, isTextBox: true, objectName: 'Stempel Modellrechnung kurz' });
      return;
    }
    if (istMR && o.x === undefined) throw new Error('B.stempel: Im Kopf einer Folie der Modellrechnung steht das Wort schon (im Kicker, mit STEMPEL_IM_KOPF auch als Stempel des Layouts). Für den Zusatz B.stempelZusatz(slide) verwenden.');
    s.addShape(ST.rect, { x, y, w: 2.12, h: 0.37, fill: { type: 'none' }, line: { color: C.rot, width: 0.5 }, objectName: 'Stempel Außenkontur' });
    s.addText('MODELLRECHNUNG', { x: x + 0.04, y: y + 0.04, w: 2.04, h: 0.29, margin: 0, fontFace: F.xbold, fontSize: 11, charSpacing: 1.3, color: C.rot, align: 'center', valign: 'middle', line: { color: C.rot, width: 0.75 }, isTextBox: true, objectName: 'Stempel Modellrechnung' });
    if (o.zusatz) B.stempelZusatz(s, { x, y });
  };
  // ---- Quellenzeile im Schriftfeld --------------------------------------------------------------------------------
  // Kurze Quellenangabe auf Folien mit fremden Daten (Folien 3 bis 6 und 22); die volle Angabe steht auf der Quellenfolie im Anhang.
  // Sie steht im freien Feld des Schriftfelds zwischen den beiden Zeilen links (Projekt, Rubrik) und dem Logo-Feld: rechtsbündig mit
  // 0,16 Zoll Abstand vor dem Logo-Feld, senkrecht mittig, Work Sans 10 pt in Grau, eine Zeile oder zwei. Passt der Text nicht in eine
  // Zeile, bricht der Baustein ihn in zwei ausgeglichene Zeilen: zuerst hinter einem Semikolon, sonst hinter einem Komma, sonst an einer
  // Wortfuge (geschützte Leerzeichen brechen nicht). Geprüft wird: höchstens zwei Zeilen; mindestens 0,30 Zoll Abstand zur längeren der
  // beiden Zeilen links (die Breite der Rubrik ist gerechnet); die Zeilen passen in die Höhe des Schriftfelds. Höchstens eine je Folie.
  // Die Form heißt „Quellenzeile“; die Zonenprüfung lässt sie im Schriftfeld zu (lib/zonenpruefung.cjs).
  // Rückgabe: { x, y, w, h, zeilen: [Text je Zeile], links (Ende der Zeilen links), breite (längste Zeile) }
  B.quelle = (s, text) => {
    if (!['inhalt', 'anhang'].includes(kx.art)) throw new Error(`B.quelle: Das Layout ${kx.layout} hat kein Schriftfeld mit freiem Feld (nur Inhalts- und Anhangfolien).`);
    if (typeof text !== 'string' || !text.trim()) throw new Error('B.quelle(s, text): Der Text fehlt.');
    if (typeof kx.rubrik !== 'string') throw new Error('B.quelle: Die Rubrik der Folie ist nicht bekannt; erst ctx.folie() aufrufen.');
    if (kx.quelle) throw new Error('B.quelle: Die Folie trägt schon eine Quellenzeile.');
    kx.quelle = true;
    const t = schutz(text.trim()), mass = z => breite(z, QUELLE), zh = zeilenhoehe(QUELLE);
    const links = X0 + Math.max(breite(PROJEKT, SF_PROJEKT), breite(kx.rubrik, SF_RUBRIK)), rechts = SF.logo - SF.quelleRand, feld = +(rechts - links - SF.quelleAbstand).toFixed(3);
    // Teilung in zwei Zeilen: die ausgeglichenste, deren erste Zeile auf das Muster endet
    const teile = muster => {
      let beste = null;
      for (let i = t.indexOf(' '); i >= 0; i = t.indexOf(' ', i + 1)) {
        if (muster && !muster.test(t.slice(0, i))) continue;
        const a = mass(t.slice(0, i)), b = mass(t.slice(i + 1));
        if (a <= feld && b <= feld && (!beste || Math.max(a, b) < beste.laenge)) beste = { i, laenge: Math.max(a, b) };
      }
      return beste;
    };
    let zeilen = [t];
    if (mass(t) > feld) {
      const b = teile(/;$/) || teile(/,$/) || teile(null);
      if (b) zeilen = [t.slice(0, b.i), t.slice(b.i + 1)];
    }
    const laenge = Math.max(...zeilen.map(mass)), hoehe = zeilen.length * zh;
    if (P) {
      const u = new Set(); zeilen.forEach(z => breite(z, QUELLE, u)); P.zeichen(u, QUELLE_NAME, t);
      if (feld < 1) P.melde(`${QUELLE_NAME}: Neben der Rubrik „${kx.rubrik}“ bleiben im Schriftfeld nur ${feld.toFixed(2)} Zoll. Rubrik kürzen.`);
      // Jede Zeile ist höchstens so breit wie das Feld; damit bleibt der Abstand zur Rubrik gewahrt (das Feld beginnt quelleAbstand hinter ihr)
      else if (laenge > feld + 0.005) P.melde(`${QUELLE_NAME}: „${t}“ passt nicht in zwei Zeilen zu ${feld.toFixed(2)} Zoll und stieße an die Rubrik (Rubrik und Projektzeile enden bei x ${links.toFixed(2)}, verlangt sind ${SF.quelleAbstand.toFixed(2)} Zoll Abstand; die Zeile misst ${mass(t).toFixed(2)} Zoll). Kürzen; die volle Angabe steht auf der Quellenfolie.`);
      if (hoehe > Y.fussH - 0.04) P.melde(`${QUELLE_NAME}: ${zeilen.length} Zeilen brauchen ${hoehe.toFixed(2)} Zoll, das Schriftfeld ist ${Y.fussH.toFixed(2)} Zoll hoch.`);
      P.mindest(QUELLE_NAME, QUELLE.fontSize, 10);
    }
    // Das Textfeld reicht vom Ende der Zeilen links (plus Abstand) bis vor das Logo-Feld und bricht nicht um: Die Zeilen stehen fest
    const x = +(links + SF.quelleAbstand).toFixed(3), w = +(rechts - x).toFixed(3), sek = kx.grund === 'anthrazit' ? HEX.dunkel.text2 : cs.sekundaer;
    const runs = zeilen.map((z, i) => ({ text: z, options: { breakLine: i < zeilen.length - 1 } }));
    s.addText(runs, { x, y: Y.fuss, w, h: Y.fussH, margin: 0, isTextBox: true, fontFace: QUELLE.fontFace, fontSize: QUELLE.fontSize, lineSpacingMultiple: QUELLE.zeileMal, color: sek,
      align: 'right', valign: 'middle', wrap: false, objectName: QUELLE_NAME });
    return { x, y: Y.fuss, w, h: Y.fussH, zeilen, links, breite: laenge };
  };

  // Fördervermerk und andere Konturstempel. o: { x, y, w, text }
  B.konturstempel = (s, o) => {
    brauche('B.konturstempel', o, ['x', 'y', 'w']);
    const t = versal(o.text), st = { fontFace: F.xbold, fontSize: 11, weite: 1.1 };
    if (P) P.zeile('Konturstempel', t, st, o.w - 0.2);
    s.addText(t, { x: o.x, y: o.y, w: o.w, h: 0.36, margin: 0, align: 'center', valign: 'middle', fontFace: F.xbold, fontSize: 11, charSpacing: 1.1, color: C.rot, line: { color: C.rot, width: 0.75 }, isTextBox: true, objectName: 'Konturstempel' });
  };

  // ---- 4.14 Programmteil-Register --------------------------------------------------------------------------------
  const pruefeNr = nr => { if (!PROGRAMMTEILE.includes(nr)) throw new Error(`Programmteil „${nr}“ gibt es nicht (${PROGRAMMTEILE.join(', ')})`); };
  B.register = (s, nr = '2.1') => {
    pruefeNr(nr);
    const z = ZONE.register, i = PROGRAMMTEILE.indexOf(nr);
    s.addText(nr, { shape: ST.rect, x: z.x, y: z.y0 + i * z.schritt, w: z.w, h: z.h, margin: 0, align: 'center', valign: 'middle', fontFace: F.xbold, fontSize: 11, color: 'FFFFFF', fill: { color: HEX.bs[nr] }, line: { type: 'none' }, objectName: 'Daumenregister ' + nr });
  };
  B.schluesselplan = (s, aktiv = '2.1') => {
    pruefeNr(aktiv);
    if (istMR) throw new Error('B.schluesselplan: Auf Folien der Modellrechnung bleibt die Kickerzeile rechts frei (erste Folie: Zusatz; mit STEMPEL_IM_KOPF: Stempel). Die Programmnummer trägt das Daumenregister.');
    const bw = 0.50, gap = 0.06, x0 = X1 - 6 * bw - 5 * gap, y = Y.kicker;
    s.addText('Programmteil', opt(stil('label'), { x: x0 - 1.25, y, w: 1.15, h: 0.30 }, { align: 'right', valign: 'middle', objectName: 'Schlüsselplan Bezeichnung' }));
    PROGRAMMTEILE.forEach((nr, i) => {
      const on = nr === aktiv, x = x0 + i * (bw + gap);
      s.addText(nr, { shape: ST.rect, x, y, w: bw, h: 0.30, margin: 0, align: 'center', valign: 'middle', fontFace: on ? F.xbold : F.mont, bold: !on, fontSize: 10, color: on ? 'FFFFFF' : C.tinte, fill: { color: on ? HEX.bs[nr] : C.weiss }, line: { color: on ? HEX.bs[nr] : C.tinte, width: 0.5 }, objectName: 'Schlüsselplan ' + nr });
      if (!on) s.addShape(ST.rect, { x, y, w: bw, h: 0.045, fill: { color: HEX.bs[nr] }, line: { type: 'none' }, objectName: 'Schlüsselplan Kappe ' + nr });
    });
  };
  // Programm-Chip im Text: Rechteck 0,42 × 0,24 in der Programmfarbe. o: { x, y, nr }
  B.programmChip = (s, o) => {
    brauche('B.programmChip', o, ['x', 'y']);
    pruefeNr(o.nr);
    s.addText(o.nr, { shape: ST.rect, x: o.x, y: o.y, w: 0.42, h: 0.24, margin: 0, align: 'center', valign: 'middle', fontFace: F.xbold, fontSize: 11, color: 'FFFFFF', fill: { color: HEX.bs[o.nr] }, line: { type: 'none' }, objectName: 'Programm-Chip ' + o.nr });
    return { rechts: o.x + 0.42 };
  };
  // 4.18 Verweis-Chip „Broschüre S. N“ (sparsam). o: { x, y, text }. Breite folgt dem Text.
  B.chip = (s, o) => {
    brauche('B.chip', o, ['x', 'y']);
    const t = schutz(o.text), st = { fontFace: F.mont, bold: true, fontSize: 11 }, w = +(breite(t, st) + 0.24).toFixed(3);
    s.addText(t, { shape: ST.rect, x: o.x, y: o.y, w, h: 0.26, margin: 0, align: 'center', valign: 'middle', fontFace: F.mont, bold: true, fontSize: 11, color: HEX.dunkelrot, fill: { color: HEX.hauch }, line: { type: 'none' }, objectName: 'Verweis-Chip' });
    return { w, rechts: o.x + w };
  };

  // ---- 4.17 Legende ----------------------------------------------------------------------------------------------
  // o: { x, y, eintraege: [{ text, art, strich, kreis }], fein }. art: zuschuss | darlehen | eigenmittel | tinte | referenz | bisher | bezug | licht | A | B | C | Hex.
  // strich: 'solid' | 'dash' zeichnet ein Linienmuster statt des Farbfelds. fein: true gibt den Feldern die Kontur der feinen Säulen
  // (D.*Saeulen mit fein: true; ohne sie wäre das helle Feld des Bezugswerts auf Weiß nicht zu sehen). Rückgabe: { rechts }
  const FELD = { zuschuss: C.rot, darlehen: C.darlehen, tinte: C.tinte, referenz: C.referenz, bisher: HEX.grau300, bezug: HEX.papier, licht: HEX.flaeche3, eigenmittel: HEX.schraffur, signal: C.dunkelrot,
    A: HEX.gruppe.A, B: HEX.gruppe.B, C: HEX.gruppe.C };
  B.legende = (s, o) => {
    brauche('B.legende', o, ['x', 'y']);
    const st = stil('legende'), kontur = o.fein ? { color: FEIN.kontur.farbe, width: FEIN.kontur.pt } : { type: 'none' };
    let cx = o.x;
    for (const e of o.eintraege) {
      const col = FELD[e.art] || e.art, t = schutz(e.text), tw = +(breite(t, st) + 0.06).toFixed(3);
      if (P && !o.fein && (e.art === 'bezug' || e.art === 'licht')) P.melde(`B.legende: Das Feld „${e.text}“ ist eine helle Fläche und braucht die Kontur (fein: true).`);
      if (e.strich) s.addShape(ST.line, { x: cx, y: o.y + 0.12, w: 0.28, h: 0, line: { color: col, width: 2.25, ...(e.strich !== 'solid' ? { dashType: e.strich } : {}) }, objectName: 'Legende Linie ' + e.text });
      else s.addShape(ST.rect, { x: cx, y: o.y + 0.035, w: 0.28, h: 0.17, fill: { color: col }, line: e.art === 'eigenmittel' ? { color: HEX.schraffurLinie, width: 0.5 } : kontur, objectName: 'Legende ' + e.text });
      s.addText(t, opt(st, { x: cx + 0.36, y: o.y, w: tw, h: 0.24 }, { valign: 'middle', objectName: 'Legendentext ' + e.text, wrap: false }));   // einzeilig, ohne Umbruch
      cx += 0.36 + tw + 0.20;
    }
    return { rechts: cx - 0.20 };
  };

  // ---- 4.9 Kennzahl-Kachel -----------------------------------------------------------------------------------------
  // o: { x, y, w, vorsatz, zahl, einheit, label, text, gross: true (60 pt) }. Rückgabe: { unten }
  // Mehrere Zahlen mit je eigener Einheit („1 % / 0,75 %“): statt zahl und einheit teile: [{ zahl, einheit }], trenner: '/'
  B.kennzahl = (s, o) => {
    brauche('B.kennzahl', o, ['x', 'y', 'w']);
    const teile = Array.isArray(o.teile) && o.teile.length ? o.teile : o.zahl === undefined || o.zahl === null ? null : [{ zahl: o.zahl, einheit: o.einheit }];
    if (!teile) throw new Error('B.kennzahl: zahl fehlt (oder teile: [{ zahl, einheit }]).');
    const gross = !!o.gross, pt = gross ? 60 : 44, zs = { fontFace: F.xbold, fontSize: pt }, es = { fontFace: F.xbold, fontSize: pt / 2 };
    const runs = [], pruef = [], lauf = (text, zahl) => { runs.push({ text, options: zahl ? {} : { fontSize: pt / 2, color: cs.akzent } }); pruef.push({ text, stil: zahl ? zs : es }); };
    teile.forEach((t, i) => {
      if (t.zahl === undefined || t.zahl === null) throw new Error('B.kennzahl: Ein Teil hat keine zahl.');
      if (i) lauf(NBSP + (o.trenner || '/') + NBSP, true);
      lauf(schutz(String(t.zahl)), true);
      if (t.einheit) lauf(NBSP + schutz(t.einheit).replace(/ /g, NBSP), false);
    });
    if (P) P.zeile(`Kennzahl ${pt} pt`, pruef, null, o.w);
    B.linie(s, { x: o.x, y: o.y, w: o.w, art: 'tinte', name: 'Kennzahl Oberlinie' });
    if (o.vorsatz) B.text(s, o.vorsatz, { x: o.x, y: o.y + 0.10, w: o.w, h: 0.22, rolle: 'vorsatz', valign: 'middle', einzeilig: true, name: 'Kennzahl Vorsatz' });
    s.addText(runs, { x: o.x, y: o.y + (gross ? 0.60 : 0.34), w: o.w, h: gross ? 1.05 : 0.72, margin: 0, isTextBox: true, fontFace: F.xbold, fontSize: pt, lineSpacing: pt, color: cs.titel, valign: 'middle', objectName: 'Kennzahl ' + teile.map(t => t.zahl).join(' / ') });
    let y = o.y + (gross ? 1.80 : 1.10);
    if (o.label) { const r = B.text(s, o.label, { x: o.x, y, w: o.w, rolle: 'kennlabel', pt: gross ? 16 : 14, name: 'Kennzahl Label' }); y = Math.max(r.unten + 0.02, y + 0.30); }
    if (o.text) { const r = B.text(s, o.text, { x: o.x, y, w: o.w, h: o.textH, rolle: 'dicht', name: 'Kennzahl Text' }); y = r.unten; }
    return { unten: y };
  };
  // ---- Rechte Spalte der Diagrammfolien mit Kennzahlen statt Kommentar (ZONE.diagramm.spalte: Spalte 9 bis 12, Hauptzahl ab y 2,10, zweites
  //      Modul ab y 4,40). Der Platzhalter „kommentar“ bleibt leer; die Modulkopf-Linie des Layouts liegt unter der Oberlinie der Kachel.
  // Hauptzahl der Folie: die Zahl des Titels als Kennzahl-Kachel. gross: true setzt 60 pt mit Vorsatz, Zahl und einer Zeile Label (für einen
  // Text ist bis zum zweiten Modul kein Platz); ohne gross 44 pt, der Text darunter wird in zwei ausgeglichene Zeilen gebrochen.
  // o: { vorsatz, zahl, einheit, label, text, gross }. Rückgabe: { x, w, unten }
  B.hauptzahl = (s, o) => {
    const g = ZONE.diagramm.spalte;
    if (o.gross && o.text) throw new Error('B.hauptzahl: Die Kachel in 60 pt trägt Vorsatz, Zahl und Label; für einen Text ist bis zum zweiten Modul kein Platz.');
    const r = B.kennzahl(s, { ...o, x: g.x, y: g.y1, w: g.w, text: o.text ? B.zweizeilig(o.text, { w: g.w, rolle: 'dicht' }) : undefined });
    if (P && r.unten > g.y2 - 0.12) P.melde(`Hauptzahl endet bei y ${r.unten.toFixed(2)} und läuft in das zweite Modul (ab ${g.y2.toFixed(2)}). Label in eine Zeile, Text in höchstens zwei Zeilen fassen.`);
    return { x: g.x, w: g.w, unten: r.unten };
  };
  // Zweite Kennzahl der rechten Spalte: 44 pt ab y 4,40. o: { vorsatz, zahl, einheit, label, text }. Rückgabe: { x, w, unten }
  B.nebenzahl = (s, o) => {
    const g = ZONE.diagramm.spalte, r = B.kennzahl(s, { ...o, x: g.x, y: g.y2, w: g.w, gross: false });
    if (P && r.unten > g.ende + 0.005) P.melde(`Zweite Kennzahl endet bei y ${r.unten.toFixed(2)}, die Inhaltszone bei ${g.ende.toFixed(2)}. Text kürzen.`);
    return { x: g.x, w: g.w, unten: r.unten };
  };
  // Zweites Modul der rechten Spalte ab y 4,40 statt einer zweiten Kennzahl: Oberlinie wie eine Kennzahl-Kachel (0,75 pt), darunter entweder
  // Einträge aus Modultitel und Text in 14 pt (eintraege: [{ titel, text }]) oder nur ein Modultitel (titel), unter dem das Modul selbst
  // weiterbaut (Tabelle ab y + 0,30, Text ab inhalt). o: { eintraege | titel, name }. Rückgabe: { x, w, y, inhalt, ende, unten }
  B.zweitesModul = (s, o) => {
    const g = ZONE.diagramm.spalte, name = o.name || 'Zweites Modul';
    B.linie(s, { x: g.x, y: g.y2, w: g.w, art: 'tinte', name: name + ' Oberlinie' });
    if (!o.eintraege) {
      if (!o.titel) throw new Error('B.zweitesModul: eintraege (Liste aus { titel, text }) oder titel fehlt.');
      B.text(s, o.titel, { x: g.x, y: g.y2 + 0.08, w: g.w, h: 0.26, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: 'Modultitel ' + name });
      return { x: g.x, w: g.w, y: g.y2, inhalt: g.y2 + 0.42, ende: g.ende, unten: g.y2 + 0.34 };
    }
    const r = B.planlegende(s, { x: g.x, y: g.y2 + 0.10, w: g.w, pt: 14, eintraege: o.eintraege, name: 'Planlegende ' + name });
    if (P && r.unten > g.ende + 0.005) P.melde(`Rechte Spalte endet bei y ${r.unten.toFixed(2)}, die Inhaltszone bei ${g.ende.toFixed(2)}. Text kürzen.`);
    return { x: g.x, w: g.w, y: g.y2, inhalt: g.y2 + 0.10, ende: g.ende, unten: r.unten };
  };
  // Kennzahl in den Platzhaltern des Layouts PGN_KENNZAHLEN(_MR). i = 0, 1, 2. Zahl 44 pt, Einheit 22 pt in Rot, Label 14 pt einzeilig,
  // Text 14 pt bis y 4,45 (höchstens drei Zeilen). o: { vorsatz, zahl, einheit, label, text }. Rückgabe: { unten: 4,45, darunter: 4,70 (Beginn einer Planlegende) }
  B.kennzahlFeld = (s, i, o) => {
    if (!/KENNZAHLEN/.test(kx.layout || '')) throw new Error('B.kennzahlFeld braucht das Layout PGN_KENNZAHLEN oder PGN_KENNZAHLEN_MR; sonst B.kennzahl verwenden.');
    if (![0, 1, 2].includes(i)) throw new Error(`B.kennzahlFeld: Kachel „${i}“ gibt es nicht (0, 1, 2).`);
    if (!o || o.zahl === undefined || o.zahl === null) throw new Error('B.kennzahlFeld: zahl fehlt.');
    if (o.pt && o.pt !== 44) throw new Error('B.kennzahlFeld: Das Layout setzt die Zahl in 44 pt. Für 60 pt B.kennzahl mit gross: true in freier Lage verwenden.');
    const K = ZONE.kennzahlen, pt = 44, z = schutz(String(o.zahl)), e = o.einheit ? NBSP + schutz(o.einheit).replace(/ /g, NBSP) : '', w = span(4);
    if (P) P.zeile(`Kennzahl ${pt} pt`, [{ text: z, stil: { fontFace: F.xbold, fontSize: pt } }, { text: e, stil: { fontFace: F.xbold, fontSize: pt / 2 } }].filter(l => l.text), null, w);
    if (o.vorsatz) { const v = versal(schutz(o.vorsatz)); if (P) P.zeile('Kennzahl Vorsatz', v, stil('vorsatz'), w); s.addText(v, { placeholder: `kf${i}_kopf` }); }
    const runs = [{ text: z, options: { fontSize: pt } }];
    if (e) runs.push({ text: e, options: { fontSize: pt / 2, color: cs.akzent } });
    s.addText(runs, { placeholder: `kf${i}_zahl` });
    if (o.label) { const l = schutz(o.label); if (P) P.zeile('Kennzahl Label (14 pt, einzeilig)', l, { fontFace: F.mont, bold: true, fontSize: 14 }, w); s.addText(l, { placeholder: `kf${i}_label` }); }
    if (o.text) { if (P) P.block('Kennzahl Text', klar(o.text), stil('dicht'), w, K.textEnde - K.text, { luft: true }); s.addText(laeufe(o.text, stil('dicht'), { absatz: { fontSize: 14 } }), { placeholder: `kf${i}_text` }); }
    return { unten: K.textEnde, darunter: K.darunter };
  };
  // Hero-Kennzahl: Montserrat Black 96 pt, höchstens eine je Folie. o: { x, y, w, zahl, einheit, flaeche: true (Fläche in Rot), text }
  B.hero = (s, o) => {
    brauche('B.hero', o, ['x', 'y', 'w']);
    const z = schutz(o.zahl), e = o.einheit ? NBSP + o.einheit : '', dunkel = kx.grund === 'anthrazit' || kx.grund === 'rot' || o.flaeche;
    if (P) P.zeile('Hero-Kennzahl', [{ text: z, stil: { fontFace: F.black, fontSize: 96 } }, { text: e, stil: { fontFace: F.black, fontSize: 48 } }].filter(l => l.text), null, o.w - (o.flaeche ? 0.5 : 0));
    const pad = o.flaeche ? 0.25 : 0;
    if (o.flaeche) s.addShape(ST.rect, { x: o.x, y: o.y, w: o.w, h: o.h || 2.6, fill: { color: C.rot }, line: { type: 'none' }, objectName: 'Hero-Fläche' });
    const runs = [{ text: z, options: {} }];
    if (e) runs.push({ text: e, options: { fontSize: 48, color: o.flaeche ? C.weiss : kx.grund === 'anthrazit' ? HEX.rot300 : cs.akzent } });
    s.addText(runs, { x: o.x + pad, y: o.y + pad, w: o.w - 2 * pad, h: 1.5, margin: 0, isTextBox: true, fontFace: F.black, fontSize: 96, lineSpacing: 96, color: dunkel ? C.weiss : cs.titel, valign: 'middle', objectName: 'Hero-Kennzahl ' + o.zahl });
    if (o.text) s.addText(laeufe(o.text, stil('fliess')), opt(stil('fliess', { farbe: o.flaeche ? C.weiss : 'text' }), { x: o.x + pad, y: o.y + pad + 1.60, w: o.w - 2 * pad, h: 0.8 }, { objectName: 'Hero-Text' }));
    return { unten: o.y + pad + (o.text ? 2.40 : 1.50) };
  };
  // Vergleich alt → neu in den Platzhaltern des Layouts PGN_VERGLEICH(_MR). seite: 'links' | 'rechts'; o: { kopf, wert, text, pt }
  B.vergleichFeld = (s, seite, o) => {
    if (!/VERGLEICH/.test(kx.layout || '')) throw new Error('B.vergleichFeld braucht das Layout PGN_VERGLEICH oder PGN_VERGLEICH_MR.');
    const z = ZONE.vergleich[seite];
    if (!z || !['links', 'rechts'].includes(seite)) throw new Error('B.vergleichFeld: seite ist „links“ oder „rechts“');
    let unten = ZONE.vergleich.text;
    if (o.kopf) { if (P) P.zeile('Vergleich Kopf', versal(o.kopf), { fontFace: F.mont, bold: true, fontSize: 12, weite: 1.2 }, z.w); s.addText(versal(schutz(o.kopf)), { placeholder: `${seite}_kopf` }); }
    if (o.wert) { if (P) P.zeile('Vergleich Wert 36 pt', schutz(o.wert), { fontFace: F.xbold, fontSize: 36 }, z.w); s.addText(schutz(o.wert), { placeholder: `${seite}_wert` }); }
    if (o.text) {
      const pt = o.pt || 16, st = stil(pt >= 16 ? 'fliess' : 'dicht', { pt });
      const absaetze = Array.isArray(o.text) ? o.text : [o.text];
      const runs = [];
      // die Größe steht an jedem Lauf: Der Platzhalter setzt 16 pt und gewinnt gegen eine Größe am Textfeld
      absaetze.forEach((a, i) => { const lr = laeufe(a, st, { absatz: { paraSpaceAfter: 8, fontSize: pt } }); if (i < absaetze.length - 1) lr[lr.length - 1].options.breakLine = true; runs.push(...lr); });
      const feldH = ZONE.vergleich.textEnde - ZONE.vergleich.text, hh = absaetze.reduce((a, t) => a + zeilenzahl(klar(t), st, z.w) * zeilenhoehe(st) + 8 / 72, 0) - 8 / 72;
      if (P) {
        if (hh > feldH + 0.005) P.melde(`Vergleich ${seite}: Text braucht ${hh.toFixed(2)} Zoll, das Feld ist ${feldH.toFixed(2)} Zoll hoch (${pt} pt).`);
        else P.luft(`Vergleich ${seite}`, hh, feldH);
        P.mindest(`Vergleich ${seite}`, pt, 14);
      }
      s.addText(runs, { placeholder: `${seite}_text` });
      unten = ZONE.vergleich.text + hh;
    }
    return { x: z.x, w: z.w, unten };
  };

  // Fußzeile unter beiden Seiten des Vergleichs (Platzhalter „fuss“, 12 pt, eine Zeile über zwölf Spalten)
  B.vergleichFuss = (s, text) => {
    if (!/VERGLEICH/.test(kx.layout || '')) throw new Error('B.vergleichFuss braucht das Layout PGN_VERGLEICH oder PGN_VERGLEICH_MR.');
    const t = schutz(text);
    if (P) P.zeile('Fußzeile Vergleich', t, { fontFace: F.text, fontSize: 12 }, ZONE.vergleich.fuss.w);
    s.addText(t, { placeholder: 'fuss' });
  };

  // ---- Tabellen (nativ, addTable) ------------------------------------------------------------------------------------
  const no = () => ({ type: 'none' }), hair = () => ({ type: 'solid', pt: 0.5, color: HEX.linie }), ink = () => ({ type: 'solid', pt: 0.75, color: HEX.tinte });
  // Kopfzelle: Versalien, Montserrat Bold 12 pt; „\n“ bricht den Kopf in zwei Zeilen
  const kopfzelle = (t, al, o = {}) => {
    const zeilen = versal(schutz(t || '')).split('\n');
    return { text: zeilen.length > 1 ? zeilen.map((z, i) => ({ text: z, options: { breakLine: i < zeilen.length - 1 } })) : zeilen[0], options: { fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 0.7, color: o.farbe || cs.sekundaer, align: al, valign: 'bottom', border: [no(), no(), ink(), no()], ...(o.fill ? { fill: { color: o.fill } } : {}) } };
  };
  const pruefeKopf = (t, w, rand = 0.18) => { if (P && t) for (const z of versal(schutz(t)).split('\n')) P.zeile('Tabellenkopf', z, { fontFace: F.mont, bold: true, fontSize: 12, weite: 0.7 }, w - rand); };
  const kopfHoehe = (koepfe, basis) => { const n = Math.max(1, ...koepfe.map(k => (typeof k === 'string' ? k.split('\n').length : 1))); return +(basis + (n - 1) * 0.20).toFixed(3); };

  // 4.10 Rechenblatt mit Nummernstreifen, Rechenzeichen, Summen- und roter Ergebniszeile.
  // o: { x, y, w, kopf: ['Position', 'A', 'B', 'C'] (Einträge als Text oder { kreis: 'A' }), zeilen: [{ nr, zeichen, text, werte: [], art }],
  //      wertBreite: 1.20 (oder je Wertspalte eine Breite: [1.06, 1.06, 1.06, 1.22]), dicht: false (14 pt, Zeile 0,42) | true (12 pt, Zeile 0,34),
  //      zeilenH, ergebnisH (Mindesthöhe der Zeilen und der Ergebniszeile), hervor: Index der hervorgehobenen Wertspalte, zeichenSpalte }
  // art: normal | summe (Oberlinie, halbfett) | ergebnis (weiß auf Rot) | notiz (12 pt, ohne Linie, für Zusätze unter dem Ergebnis)
  // Rückgabe: { x, y, w, h, unten, spalten: [{ x, w }] (nur Wertspalten), zeilen: [{ y, h }], kopfH }
  B.rechenblatt = (s, o) => {
    brauche('B.rechenblatt', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.zeilen) || !o.zeilen.length) throw new Error('B.rechenblatt: zeilen fehlt.');
    const dicht = !!o.dicht, pt = dicht ? 12 : 14, zh = o.zeilenH || (dicht ? 0.34 : 0.42), kh = dicht ? 0.30 : 0.34, eh = o.ergebnisH || (dicht ? 0.38 : 0.46);
    const nW = o.werte ?? Math.max(...o.zeilen.map(z => (z.werte || []).length)), je = Array.isArray(o.wertBreite), wb = je ? null : o.wertBreite || 1.20;
    // Breite je Wertspalte: eine für alle oder eine Liste (eine Spalte mit längeren Werten bekommt mehr, die Position behält ihre Zeile)
    const wbs = je ? o.wertBreite : Array(nW).fill(wb);
    if (wbs.length !== nW || wbs.some(b => typeof b !== 'number' || !(b > 0))) throw new Error(`Rechenblatt: wertBreite nennt ${wbs.length} Breiten, die Tabelle hat ${nW} Wertspalten.`);
    const mitZeichen = o.zeichenSpalte ?? o.zeilen.some(z => z.zeichen), nrW = 0.42, zW = mitZeichen ? 0.30 : 0;
    const posW = +(o.w - nrW - zW - (je ? wbs.reduce((a, b) => a + b, 0) : nW * wb)).toFixed(3);
    if (posW < 1.5) throw new Error(`Rechenblatt: Für die Position bleiben nur ${posW} Zoll. Breite erhöhen oder wertBreite senken.`);
    const kopf = o.kopf || [], rows = [];
    const khoch = kopfHoehe(kopf, kh), rowH = [khoch];
    const kz = [kopfzelle('', 'center')];
    if (mitZeichen) kz.push(kopfzelle('', 'center'));
    const k0 = kopf[0]; pruefeKopf(typeof k0 === 'string' ? k0 : '', posW); kz.push(kopfzelle(typeof k0 === 'string' ? k0 : '', 'left'));
    for (let i = 0; i < nW; i++) { const k = kopf[i + 1]; const t = typeof k === 'string' ? k : ''; pruefeKopf(t, wbs[i]); kz.push(kopfzelle(t, 'right', { fill: o.hervor === i ? cs.hervor : null, farbe: o.hervor === i ? cs.akzent : null })); }
    rows.push(kz);
    o.zeilen.forEach((z, zi) => {
      const art = z.art || 'normal', erg = art === 'ergebnis', sum = art === 'summe', notiz = art === 'notiz', letzte = zi === o.zeilen.length - 1;
      const b = () => [erg || sum ? ink() : no(), no(), erg || notiz ? no() : letzte ? ink() : hair(), no()];
      const fill = erg ? { fill: { color: C.rot } } : {};
      const t = schutz(z.text || '');
      const nz = zeilenzahl(t, { fontFace: sum ? F.semi : F.text, fontSize: notiz ? 12 : pt }, posW - 0.17);
      const hoch = Math.max(erg ? eh : zh, +(nz * zeilenhoehe({ fontFace: F.text, fontSize: notiz ? 12 : pt }) + 0.10).toFixed(3));
      if (P && nz > 2) P.melde(`Rechenblatt: Position braucht ${nz} Zeilen (höchstens zwei): „${t}“`);
      const row = [{ text: z.nr === undefined || z.nr === null ? '' : String(z.nr), options: { fontFace: F.mont, bold: true, fontSize: 12, color: erg ? 'FFFFFF' : cs.sekundaer, align: 'center', border: b(), ...(notiz ? {} : { fill: { color: erg ? C.rot : HEX.flaeche3 } }) } }];
      if (mitZeichen) row.push({ text: z.zeichen || '', options: { fontFace: F.xbold, fontSize: pt, color: erg ? 'FFFFFF' : cs.titel, align: 'center', border: b(), ...fill } });
      row.push({ text: t, options: { fontFace: erg ? F.mont : sum ? F.semi : F.text, bold: erg, fontSize: notiz ? 12 : pt, color: erg ? 'FFFFFF' : sum ? cs.titel : notiz ? cs.sekundaer : cs.text, align: 'left', border: b(), ...fill } });
      for (let i = 0; i < nW; i++) {
        const v = (z.werte || [])[i];
        // ein Wert, der breiter ist als seine Zelle, bräche in der Zelle um und höbe die Zeile
        if (P && v !== undefined && v !== null && v !== '') P.zeile(`Rechenblatt, Wert in Zeile ${zi + 1}, Spalte ${i + 1}`, String(v), { fontFace: F.mont, bold: !notiz, fontSize: notiz ? 12 : pt }, wbs[i] - 0.16);
        const zelle = { text: v === undefined || v === null ? '' : String(v), options: { fontFace: F.mont, bold: !notiz, fontSize: notiz ? 12 : pt, color: erg ? 'FFFFFF' : notiz ? cs.sekundaer : cs.titel, align: 'right', border: b(), ...fill } };
        if (!erg && o.hervor === i) zelle.options.fill = { color: cs.hervor };
        row.push(zelle);
      }
      rows.push(row); rowH.push(z.h || hoch);
    });
    const colW = [nrW, ...(mitZeichen ? [zW] : []), posW, ...wbs];
    const h = rowH.reduce((a, b) => a + b, 0), x0 = o.x + nrW + zW + posW;
    s.addTable(rows, { x: o.x, y: o.y, w: o.w, h, colW, rowH, margin: [0.04, 0.08, 0.04, 0.08], valign: 'middle', objectName: o.name || 'Rechenblatt' });
    if (kx.tabelle) kx.tabelle({ kopfzeile: true });
    const spalten = Array.from({ length: nW }, (_, i) => ({ x: +(x0 + (je ? wbs.slice(0, i).reduce((a, b) => a + b, 0) : i * wb)).toFixed(3), w: wbs[i] }));
    const zeilen = []; let yy = o.y + khoch; for (let i = 1; i < rowH.length; i++) { zeilen.push({ y: +yy.toFixed(3), h: rowH[i] }); yy += rowH[i]; }
    kopf.slice(1).forEach((k, i) => { if (k && typeof k === 'object' && k.kreis) B.achskreis(s, { cx: spalten[i].x + spalten[i].w - 0.08 - 0.13, cy: o.y + khoch - 0.17, d: 0.26, pt: 10, text: k.kreis, name: 'Spaltenkopf ' + k.kreis }); });
    return { x: o.x, y: o.y, w: o.w, h, unten: o.y + h, spalten, zeilen, kopfH: khoch, positionX: o.x + nrW + zW, positionW: posW };
  };

  // 4.11 Vergleichstabelle: Position, hervorgehobene Spalte, Vergleichsspalte.
  // o: { x, y, w, kopf: ['Jahr 1', 'Gefördert (A)', 'Frei finanziert'], zeilen: [{ text, wert, vergleich, kern }], wertBreite: 2.20, dicht }
  B.vergleichstabelle = (s, o) => {
    brauche('B.vergleichstabelle', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.zeilen) || !o.zeilen.length) throw new Error('B.vergleichstabelle: zeilen fehlt.');
    const dicht = !!o.dicht, pt = dicht ? 14 : 16, wb = o.wertBreite || 2.20, posW = +(o.w - 2 * wb).toFixed(3), zh = dicht ? 0.44 : 0.50, kernH = dicht ? 0.62 : 0.70;
    if (posW < 1.3) throw new Error(`Vergleichstabelle: Für die Position bleiben nur ${posW} Zoll.`);
    const k = o.kopf || ['', '', ''], kh = kopfHoehe(k, 0.36);
    pruefeKopf(k[0], posW, 0.22); pruefeKopf(k[1], wb, 0.22); pruefeKopf(k[2], wb, 0.22);
    if (o.zeilen.filter(z => z.kern).length > 2 && P) P.hinweis('Vergleichstabelle mit mehr als zwei Kernzeilen');
    const rows = [[kopfzelle(k[0], 'left'), kopfzelle(k[1], 'right', { farbe: cs.akzent, fill: cs.hervor }), kopfzelle(k[2], 'right')]], rowH = [kh];
    o.zeilen.forEach((z, zi) => {
      const letzte = zi === o.zeilen.length - 1, b = () => [z.kern ? ink() : no(), no(), letzte ? ink() : hair(), no()];
      const t = schutz(z.text), pst = { fontFace: z.kern ? F.semi : F.text, fontSize: pt };
      // Zeilenhöhe folgt dem Text der Position (höchstens drei Zeilen)
      const nz = zeilenzahl(t, pst, posW - 0.21), hoch = Math.max(z.kern ? kernH : zh, +(nz * zeilenhoehe(pst) + 0.10).toFixed(3));
      if (P) {
        P.block('Vergleichstabelle Position', t, pst, posW - 0.21, 3 * zeilenhoehe(pst));
        for (const v of [z.wert, z.vergleich]) P.zeile('Vergleichstabelle Wert', schutz(v), z.kern ? { fontFace: F.xbold, fontSize: 24 } : { fontFace: F.mont, bold: true, fontSize: pt }, wb - 0.20);
      }
      const wert = (v, alt) => ({ text: schutz(v), options: { fontFace: z.kern ? F.xbold : F.mont, bold: !z.kern, fontSize: z.kern ? 24 : pt, color: alt ? cs.sekundaer : cs.titel, align: 'right', border: b(), ...(alt ? {} : { fill: { color: cs.hervor } }) } });
      rows.push([{ text: t, options: { fontFace: z.kern ? F.semi : F.text, fontSize: pt, color: z.kern ? cs.titel : cs.text, align: 'left', border: b() } }, wert(z.wert, false), wert(z.vergleich, true)]);
      rowH.push(z.h || hoch);
    });
    const h = rowH.reduce((a, b) => a + b, 0);
    s.addTable(rows, { x: o.x, y: o.y, w: o.w, h, colW: [posW, wb, wb], rowH, margin: [0.04, 0.10, 0.04, 0.10], valign: 'middle', objectName: o.name || 'Vergleichstabelle' });
    if (kx.tabelle) kx.tabelle({ kopfzeile: true });
    return { x: o.x, y: o.y, w: o.w, h, unten: o.y + h };
  };

  // Allgemeine Tabelle (Anhang, Quellen, Eckdaten). Zeilenhöhen folgen dem Text.
  // o: { x, y, w, spalten: [{ kopf, breite, art: text | zahl | stichwort, randRechts }], zeilen: [[Zelle, …] | { zellen: [], trennlinie: true, flaeche: true }],
  //      pt: 12 | 14, kopf: true, dicht, zeilenH, zielHoehe, schlusslinie: true, messen }
  // Zelle: Text (mit **fett**) oder { text, fett, farbe, align }. Eine Spalte ohne Breite nimmt den Rest.
  // dicht: true      Zeilenhöhe Zeilenzahl × Zeilenmaß + Zellränder + 0,01 (nur 12 pt) für Tabellen, die die Inhaltszone füllen
  // zeilenH          Mindesthöhe je Zeile · zielHoehe: Gesamthöhe mit Kopf; kürzere Tabellen bekommen dafür eine gemeinsame Mindesthöhe je Zeile
  // schlusslinie     false lässt die Linie unter der letzten Zeile weg (wenn ein Kasten oder eine Linie direkt anschließt)
  // messen: true     rechnet nur und zeichnet nichts (Höhen vorab, zum Beispiel für zwei Tabellen, die auf gleicher Höhe enden)
  // randRechts       rechter Zellrand einer Spalte in Zoll (Vorgabe 0,08); die letzte Spalte kommt mit weniger aus
  // Rückgabe: { x, y, w, h, unten, kopfH, zeilen: [{ y, h, n }], spalten: [{ x, w }], zeilenzahl, zeilenmass, rand: { oben, seite } }
  B.tabelle = (s, o) => {
    brauche('B.tabelle', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.spalten) || !o.spalten.length || !Array.isArray(o.zeilen) || !o.zeilen.length) throw new Error('B.tabelle: spalten und zeilen fehlen.');
    const dicht = !!o.dicht, pt = o.pt || 12, OBEN = 0.06, UNTEN = 0.05, SEITE = 0.08, mitKopf = o.kopf !== false && o.spalten.some(c => c.kopf);
    if (dicht && pt !== 12) throw new Error('B.tabelle: dicht gibt es nur in 12 pt.');
    // dicht: Zellränder und 0,01 Zoll Zuschlag je Zeile (ohne ihn füllt die Schrift die Zeile bis auf 2 %, und die Zeile wüchse in PowerPoint)
    const st = { fontFace: F.text, fontSize: pt, ...(dicht ? {} : { zeileMal: 1.08 }) }, zh = zeilenhoehe(st), zuschlag = dicht ? OBEN + UNTEN + 0.01 : 0.13;
    if (P) P.mindest('Tabelle', pt, 12);
    const fest = o.spalten.reduce((a, c) => a + (c.breite || 0), 0), offen = o.spalten.filter(c => !c.breite).length;
    const colW = o.spalten.map(c => +(c.breite || (o.w - fest) / offen).toFixed(3)), rechts = o.spalten.map(c => (typeof c.randRechts === 'number' ? c.randRechts : SEITE));
    if (colW.some(w => !(w > 0)) || Math.abs(colW.reduce((a, b) => a + b, 0) - o.w) > 0.01) throw new Error(`B.tabelle: Spaltenbreiten (${colW.join(' + ')}) ergeben nicht die Breite ${o.w}.`);
    const rows = [], rowH = [], rand = i => [OBEN, rechts[i], UNTEN, SEITE];
    if (mitKopf) {
      rows.push(o.spalten.map((c, i) => { pruefeKopf(c.kopf, colW[i], SEITE + rechts[i] + 0.02); const z = kopfzelle(c.kopf, c.art === 'zahl' ? 'right' : 'left'); z.options.margin = rand(i); return z; }));
      // Kopfzeile aus der Schrift: Montserrat Bold 12 pt (0,203 Zoll je Zeile) und die Zellränder, mit Luft 0,33 Zoll; je weitere Zeile 0,20
      rowH.push(kopfHoehe(o.spalten.map(c => c.kopf || ''), 0.33));
    }
    const kopfH = mitKopf ? rowH[0] : 0, zahlen = [];
    o.zeilen.forEach((z, zi) => {
      const zellen = Array.isArray(z) ? z : z.zellen, letzte = zi === o.zeilen.length - 1, stark = !Array.isArray(z) && z.trennlinie, fl = !Array.isArray(z) && z.flaeche;
      if (!Array.isArray(zellen) || zellen.length !== o.spalten.length) throw new Error(`B.tabelle: Zeile ${zi + 1} hat ${zellen ? zellen.length : 0} Zellen, die Tabelle ${o.spalten.length} Spalten.`);
      const unten = letzte ? (o.schlusslinie === false ? no() : ink()) : stark ? ink() : hair();
      let n = 1;
      const row = zellen.map((c, i) => {
        const sp = o.spalten[i], obj = c !== null && typeof c === 'object' ? c : { text: c ?? '' }, zahl = sp.art === 'zahl', stich = sp.art === 'stichwort' || obj.fett;
        const cst = zahl || stich ? { fontFace: F.mont, bold: true, fontSize: pt, zeileMal: st.zeileMal } : st, text = String(obj.text), t = klar(text), feld = colW[i] - SEITE - rechts[i] - 0.01;
        // halbfette Zellen („**…**“) werden mit der halbfetten Schrift gerechnet; ein Wort, das breiter ist als die Zelle, meldet die Prüfung
        const mst = !zahl && !stich && text.includes('**') ? { ...cst, fontFace: F.semi } : cst, nz = t ? zeilenzahl(t, mst, feld) : 1;
        if (P && t) P.block(`Tabellenzelle (Zeile ${zi + 1}, Spalte ${i + 1})`, t, mst, feld, nz * zeilenhoehe(mst));
        n = Math.max(n, nz);
        return { text: laeufe(text, cst), options: { fontFace: cst.fontFace, bold: !!cst.bold, fontSize: pt, color: obj.farbe || (zahl || stich ? cs.titel : cs.text), align: obj.align || (zahl ? 'right' : 'left'), valign: 'top', margin: rand(i), border: [no(), no(), unten, no()], ...(fl ? { fill: { color: cs.kasten } } : {}) } };
      });
      rows.push(row); rowH.push(Math.max(o.zeilenH || 0, +(n * zh + zuschlag).toFixed(3))); zahlen.push(n);
    });
    // Zielhöhe: gemeinsame Mindesthöhe je Zeile, mit der die Tabelle genau die verlangte Höhe erreicht (längere Zeilen bleiben, wie sie sind)
    if (typeof o.zielHoehe === 'number') {
      const k0 = mitKopf ? 1 : 0, summe = min => kopfH + rowH.slice(k0).reduce((a, h) => a + Math.max(h, min), 0);
      if (summe(0) > o.zielHoehe + 0.005) { if (P) P.melde(`Tabelle „${o.name || 'Tabelle'}“ ist ${summe(0).toFixed(2)} Zoll hoch und passt nicht in die Zielhöhe ${o.zielHoehe.toFixed(2)} Zoll.`); }
      else if (summe(0) < o.zielHoehe - 0.005) {
        let lo = 0, hi = o.zielHoehe;
        for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (summe(m) < o.zielHoehe) lo = m; else hi = m; }
        for (let i = k0; i < rowH.length; i++) rowH[i] = Math.max(rowH[i], +hi.toFixed(3));
      }
    }
    const h = rowH.reduce((a, b) => a + b, 0), zeilen = [], spalten = [];
    if (!o.messen) {
      s.addTable(rows, { x: o.x, y: o.y, w: o.w, h, colW, rowH, margin: [OBEN, SEITE, UNTEN, SEITE], valign: 'top', objectName: o.name || 'Tabelle' });
      // Kopfzeile oder, ohne Kopf, die Stichwortspalte: für Vorleseprogramme als Kopf gekennzeichnet (Nachbearbeitung, Schritt 14)
      if (kx.tabelle) kx.tabelle({ kopfzeile: mitKopf, kopfspalte: !mitKopf && o.spalten[0].art === 'stichwort' });
    }
    let yy = o.y + kopfH; rowH.slice(mitKopf ? 1 : 0).forEach((r, i) => { zeilen.push({ y: +yy.toFixed(3), h: r, n: zahlen[i] }); yy += r; });
    let xx = o.x; colW.forEach(c => { spalten.push({ x: +xx.toFixed(3), w: c }); xx += c; });
    return { x: o.x, y: o.y, w: o.w, h, unten: +(o.y + h).toFixed(3), kopfH, zeilen, spalten, zeilenzahl: zahlen.reduce((a, b) => a + b, 0), zeilenmass: zh, rand: { oben: OBEN, seite: SEITE } };
  };

  // Hinweis als Kasten auf Fläche (Papier auf Weiß, Weiß auf Papier) mit Modulkopf-Linie auf der Oberkante. Das Stichwort steht links in einer
  // Spalte, der Text rechts davon: So kostet der Titel keine eigene Zeile, und der Kasten schließt als Fuß an eine Tabelle an, deren erste Spalte
  // so breit ist wie „spalte“. o: { x, y, w, stichwort, text, spalte (Breite der Stichwortspalte), pt: 14, innen: 0.08 (Zelleneinzug der Tabelle), rand: 0.18 }
  // Rückgabe: { x, y, w, h, unten }
  B.hinweisKasten = (s, o) => {
    brauche('B.hinweisKasten', o, ['x', 'y', 'w', 'spalte']);
    if (!o.stichwort || !o.text) throw new Error('B.hinweisKasten: stichwort und text sind Pflicht.');
    const pt = o.pt || 14, st = stil('dicht', { pt }), innen = o.innen ?? 0.08, rand = o.rand ?? 0.18;
    const tx = o.x + o.spalte + innen, tw = +(o.x + o.w - 0.14 - tx).toFixed(3), th = B.hoehe(o.text, { rolle: 'dicht', w: tw, pt }), h = +(th + 2 * rand).toFixed(3);
    B.kasten(s, { x: o.x, y: o.y, w: o.w, h, name: 'Hinweis Fläche' });
    B.linie(s, { x: o.x, y: o.y, w: o.w, art: 'modul', name: 'Modulkopf-Linie Hinweis' });
    // Stichwort in 12 pt auf der Höhe der ersten Textzeile; in 13 pt stieße es an den Text der zweiten Spalte
    B.text(s, o.stichwort, { x: o.x + innen, y: o.y + rand, w: o.spalte - innen, h: +zeilenhoehe(st).toFixed(3), rolle: 'modultitel', pt: 12, valign: 'middle', einzeilig: true, name: 'Hinweis Stichwort' });
    B.text(s, o.text, { x: tx, y: o.y + rand, w: tw, h: th, rolle: 'dicht', pt, name: 'Hinweis Text' });
    return { x: o.x, y: o.y, w: o.w, h, unten: o.y + h };
  };

  // ---- 4.12 Ablauf ------------------------------------------------------------------------------------------------------
  // Achsleiste. o: { x, y, w, stationen: [{ nr, titel, zustaendig, text, zusatz, signal }], art: 'reihe' | 'text', groesse: 'S' | 'M' | 'L', versalTitel: true,
  //      pt: 14 | 12, abstand: 0.12, anteile: [Breite je Station im Verhältnis] }
  // art „reihe“: bis sechs Stationen mit Titel mittig unter dem Kreis (ohne Titel bis zwölf). art „text“: bis vier Stationen je Reihe mit Titel,
  // Zuständigkeit (12 pt), Text und Zusatz (12 pt, grau) linksbündig ab Kreis. Alle Texte sind wahlfrei. Rückgabe: { punkte: [x der Kreismitten], unten }
  B.achsleiste = (s, o) => {
    brauche('B.achsleiste', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.stationen) || !o.stationen.length) throw new Error('B.achsleiste: stationen fehlt.');
    if (o.groesse && !KREIS[o.groesse]) throw new Error(`B.achsleiste: Größe „${o.groesse}“ gibt es nicht (S, M, L).`);
    const n = o.stationen.length, art = o.art || (o.stationen.some(t => t.text) ? 'text' : 'reihe'), gr = o.groesse || 'L', d = KREIS[gr][0];
    if (P && art === 'reihe' && n > 6 && o.stationen.some(t => t.titel)) P.melde(`Achsleiste: ${n} Stationen mit Titel in einer Reihe (höchstens sechs; ohne Titel bis zwölf).`);
    if (P && art === 'text' && n > 4) P.hinweis(`Achsleiste mit Text: ${n} Stationen in einer Reihe (Planwerk: höchstens vier).`);
    const punkte = [];
    let unten = o.y + d / 2;
    if (art === 'reihe') {
      const x0 = o.x + 0.9, dx = n > 1 ? (o.w - 1.8) / (n - 1) : 0;
      s.addShape(ST.line, { x: x0, y: o.y, w: dx * (n - 1), h: 0, line: { color: cs.linie, width: 1 }, objectName: 'Ablaufachse' });
      o.stationen.forEach((t, i) => {
        const cx = x0 + i * dx; punkte.push(cx);
        B.achskreis(s, { cx, cy: o.y, groesse: gr, text: t.nr ?? i + 1, variante: t.signal ? 'signal' : 'standard' });
        if (!t.titel) return;                                      // Station ohne Titel: nur der Achskreis
        const st = stil('stationKlein', { farbe: t.signal ? C.dunkelrot : 'titel' }), tw = Math.min(1.8, dx || 1.8), tt = versal(schutz(t.titel));
        if (P) P.zeile('Station', tt, st, tw);
        s.addText(tt, opt(st, { x: cx - tw / 2, y: o.y + d / 2 + 0.09, w: tw, h: 0.26 }, { align: 'center', valign: 'middle', objectName: 'Station ' + t.titel }));
        unten = o.y + d / 2 + 0.35;
      });
    } else {
      // anteile: Breite je Station im Verhältnis (Vorgabe: alle gleich), zum Beispiel für eine Station mit langem Wort
      const ant = o.anteile || o.stationen.map(() => 1), summe = ant.reduce((a, b) => a + b, 0), ptT = o.pt || 14;
      if (ant.length !== n || ant.some(a => !(a > 0))) throw new Error(`B.achsleiste: anteile braucht je Station eine Zahl größer null (${n} Stationen).`);
      s.addShape(ST.line, { x: o.x, y: o.y, w: o.w, h: 0, line: { color: cs.linie, width: 1 }, objectName: 'Ablaufachse' });
      let xLauf = o.x;
      o.stationen.forEach((t, i) => {
        const sw = o.w * ant[i] / summe, tw = sw - (o.abstand ?? 0.12), x = xLauf, cx = x + d / 2; punkte.push(cx); xLauf += sw;
        B.achskreis(s, { cx, cy: o.y, groesse: gr, text: t.nr ?? i + 1, variante: t.signal ? 'signal' : 'standard' });
        let y = o.y + d / 2 + 0.08;
        if (t.titel) {
          const st = stil(o.versalTitel === false ? 'wert' : 'station', { farbe: t.signal ? C.dunkelrot : 'titel' });
          const tt = o.versalTitel === false ? schutz(t.titel) : versal(schutz(t.titel));
          if (P) P.zeile('Station', tt, st, tw);
          s.addText(tt, opt(st, { x, y, w: tw, h: 0.24 }, { valign: 'middle', objectName: 'Station ' + t.titel })); y += 0.24;
        }
        // Zuständigkeit: 12 pt. Wer handelt, ist Inhalt der Station und muss im Saal lesbar sein (10 pt ist Randbeschriftungen vorbehalten)
        if (t.zustaendig) { const zs = stil('label', { pt: 12 }); if (P) P.zeile('Zuständigkeit', schutz(t.zustaendig), zs, tw); s.addText(schutz(t.zustaendig), opt(zs, { x, y, w: tw, h: 0.20 }, { valign: 'middle', objectName: 'Zuständigkeit' })); y += 0.22; }
        if (t.text) { const r = B.text(s, t.text, { x, y: y + 0.01, w: tw, rolle: ptT >= 14 ? 'dicht' : 'kleinText', pt: ptT, name: 'Stationstext' }); y = r.unten; }
        if (t.zusatz) { const r = B.text(s, t.zusatz, { x, y: y - 0.02, w: tw, rolle: 'klein', name: 'Stationszusatz' }); y = r.unten; }
        unten = Math.max(unten, y);
      });
    }
    return { punkte, unten };
  };
  // Achsleiste der Abschnitte auf der oberen Rahmenlinie (nur PGN_ABSCHNITT, PGN_ABSCHNITT_ROT). o: { n, aktiv (1 … n) }
  B.abschnittsleiste = (s, o) => {
    const dx = 0.78, x0 = 12.02 - (o.n - 1) * dx;
    for (let i = 0; i < o.n; i++) B.achskreis(s, { cx: x0 + i * dx, cy: 0.30, groesse: 'M', text: i + 1, variante: i + 1 === o.aktiv ? 'gefuellt' : 'standard', name: 'Abschnitt ' + (i + 1) });
  };
  // Warnband: volle Breite × 0,42 in Dunkelrot, höchstens eines je Folie. o: { x, y, w, kopf, text }
  B.warnband = (s, o = {}) => {
    const x = o.x ?? X0, w = o.w ?? CW, y = o.y ?? ZONE.ablauf.warnband, k = versal(schutz(o.kopf || '')), t = schutz(o.text || '');
    if (P) P.zeile('Warnband', [{ text: k + '  ', stil: { fontFace: F.xbold, fontSize: 14, weite: 0.8 } }, { text: t, stil: { fontFace: F.text, fontSize: 14 } }], null, w - 0.30);
    s.addText([{ text: k + '  ', options: { fontFace: F.xbold, charSpacing: 0.8 } }, { text: t, options: { fontFace: F.text } }],
      { shape: ST.rect, x, y, w, h: 0.42, margin: [11, 11, 0, 0], fontSize: 14, color: 'FFFFFF', fill: { color: C.dunkelrot }, line: { type: 'none' }, align: 'left', valign: 'middle', objectName: 'Warnband' });
    return { unten: y + 0.42 };
  };
  // Achtung-Kasten (nur Vorhabenbeginn und Frist 31.12.2026; im Vortrag höchstens zweimal). o: { x, y, w, h, label, text, pt }
  B.achtung = (s, o) => {
    brauche('B.achtung', o, ['x', 'y', 'w', 'h']);
    if (!o.text) throw new Error('B.achtung: text fehlt.');
    s.addShape(ST.rect, { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: HEX.hauch50 }, line: { type: 'none' }, objectName: 'Achtung-Kasten' });
    s.addShape(ST.line, { x: o.x, y: o.y, w: o.w, h: 0, line: { color: C.rot, width: 1.5 }, objectName: 'Achtung-Oberlinie' });
    const lst = { fontFace: F.mont, bold: true, fontSize: 12, weite: 1.2 }, pad = 0.20;
    if (P) P.zeile('Achtung Label', versal(o.label || 'Achtung'), lst, o.w - 2 * pad);
    s.addText(versal(o.label || 'Achtung'), { x: o.x + pad, y: o.y + 0.14, w: o.w - 2 * pad, h: 0.22, margin: 0, isTextBox: true, fontFace: F.mont, bold: true, fontSize: 12, charSpacing: 1.2, color: C.rot, valign: 'middle', objectName: 'Achtung Label' });
    B.text(s, o.text, { x: o.x + pad, y: o.y + 0.44, w: o.w - 2 * pad, h: o.h - 0.58, rolle: (o.pt || 14) >= 16 ? 'fliess' : 'dicht', pt: o.pt || 14, farbe: C.anthrazit, name: 'Achtung Text' });
  };

  // ---- Zeitstrahl und Bänder ----------------------------------------------------------------------------------------------
  // Band oder Balken in fester Datenfarbe mit Beschriftung im Band.
  // o: { x, y, w, h, art: tinte | referenz | bisher | papier | rahmen | zuschuss | eigenmittel | signal | A | B | C, text, align, pt }
  B.balken = (s, o) => {
    brauche('B.balken', o, ['x', 'y', 'w']);
    const art = o.art || 'tinte', h = o.h || 0.36;
    const FILL = { tinte: C.tinte, referenz: C.referenz, bisher: HEX.grau300, papier: cs.kasten, zuschuss: C.rot, eigenmittel: HEX.schraffur, signal: C.dunkelrot, A: HEX.gruppe.A, B: HEX.gruppe.B, C: HEX.gruppe.C };
    const TEXT = { tinte: 'FFFFFF', referenz: 'FFFFFF', bisher: HEX.tinte, papier: HEX.tinte, rahmen: HEX.tinte, zuschuss: 'FFFFFF', eigenmittel: HEX.tinte, signal: 'FFFFFF', A: 'FFFFFF', B: 'FFFFFF', C: HEX.tinte };
    if (art !== 'rahmen' && !FILL[art]) throw new Error(`B.balken: Art „${art}“ gibt es nicht (${Object.keys(FILL).join(', ')}, rahmen)`);
    const line = art === 'rahmen' || art === 'papier' ? { color: cs.linie, width: 0.75 } : art === 'eigenmittel' ? { color: HEX.schraffurLinie, width: 0.5 } : { type: 'none' };
    const fill = art === 'rahmen' ? { type: 'none' } : { color: FILL[art] };
    if (o.strich) line.dashType = o.strich;
    if (!o.text) { s.addShape(ST.rect, { x: o.x, y: o.y, w: o.w, h, fill, line, objectName: o.name || 'Band ' + art }); return { rechts: o.x + o.w, unten: o.y + h }; }
    const pt = o.pt || 12, t = schutz(o.text), st = { fontFace: F.mont, bold: true, fontSize: pt };
    if (P) P.zeile('Bandtext', t, st, o.w - 0.20);
    s.addText(t, { shape: ST.rect, x: o.x, y: o.y, w: o.w, h, margin: [7, 7, 0, 0], fontFace: F.mont, bold: true, fontSize: pt, color: TEXT[art], fill, line, align: o.align || 'left', valign: 'middle', objectName: o.name || 'Band ' + o.text });
    return { rechts: o.x + o.w, unten: o.y + h };
  };
  // Zeitstrahl: Jahresachse mit Achskreisen an den Marken und Bändern darüber.
  // o: { x, y (Lage der Achse), w, von, bis, marken: [{ wert, text, signal }], ticks: [Werte], baender: [{ von, bis, zeile, art, text, strich }], bandH: 0.36, achsText }
  // Zeile 0 liegt direkt über der Achse, höhere Zeilen darüber. Rückgabe: { xVon(wert), yBand(zeile), oben, unten }
  // Achskreise an den Achsenden ragen 0,20 Zoll über die Achse: Bei einer Marke am Ende die Achse um 0,20 kürzer ansetzen (x + 0,20 bzw. w − 0,20).
  B.zeitstrahl = (s, o) => {
    brauche('B.zeitstrahl', o, ['x', 'y', 'w', 'von', 'bis']);
    if (!(o.bis > o.von)) throw new Error('B.zeitstrahl: bis muss größer sein als von.');
    const xVon = v => o.x + o.w * (v - o.von) / (o.bis - o.von), bh = o.bandH || 0.36, gap = 0.08, d = KREIS.M[0];
    const yBand = z => o.y - d / 2 - 0.10 - (z + 1) * bh - z * gap;
    s.addShape(ST.line, { x: o.x, y: o.y, w: o.w, h: 0, line: { color: cs.linie, width: 1 }, objectName: 'Zeitachse' });
    for (const t of o.ticks || []) s.addShape(ST.line, { x: xVon(t), y: o.y - 0.05, w: 0, h: 0.10, line: { color: cs.linie, width: 0.75 }, objectName: 'Zeitmarke ' + t });
    let maxZ = -1;
    for (const b of o.baender || []) {
      const z = b.zeile || 0; maxZ = Math.max(maxZ, z);
      B.balken(s, { x: xVon(b.von), y: yBand(z), w: xVon(b.bis) - xVon(b.von), h: bh, art: b.art, text: b.text, strich: b.strich, align: b.align });
    }
    for (const m of o.marken || []) B.achskreis(s, { cx: xVon(m.wert), cy: o.y, groesse: 'M', pt: String(m.text ?? m.wert).length > 2 ? 10 : 12, text: m.text ?? m.wert, variante: m.signal ? 'signal' : 'standard' });
    if (o.achsText) s.addText(schutz(o.achsText), opt(stil('achse'), { x: o.x, y: o.y + d / 2 + 0.06, w: o.w, h: 0.20 }, { valign: 'middle', objectName: 'Achsenbezeichnung' }));
    return { xVon, yBand, oben: maxZ >= 0 ? yBand(maxZ) : o.y - d / 2, unten: o.y + d / 2 + (o.achsText ? 0.26 : 0) };
  };

  // ---- 4.16 Bild ----------------------------------------------------------------------------------------------------------------
  // o: { datei (Name in assets/), x, y, w, h (Vorgabe: Seitenverhältnis 1800 : 740), altText, ecke: 'Visualisierung' | false, marken: true (Beschnittmarken) }
  B.bild = (s, o) => {
    if (!o.altText) throw new Error('B.bild: altText fehlt (Bildbeschreibung für Vorleseprogramme).');
    brauche('B.bild', o, ['x', 'y', 'w']);
    const h = o.h || +(o.w * 740 / 1800).toFixed(3);
    if (P && o.w > span(7) + 0.01) P.hinweis(`Bild ist ${o.w} Zoll breit (Planwerk: höchstens sieben Spalten = ${span(7)}).`);
    s.addImage({ path: asset(o.datei), x: o.x, y: o.y, w: o.w, h, altText: o.altText, objectName: o.name || 'Bild ' + o.datei });
    const ecke = o.ecke === undefined ? 'Visualisierung' : o.ecke;
    if (ecke) s.addText(ecke, { shape: ST.rect, x: o.x + o.w - 1.25, y: o.y + h - 0.26, w: 1.25, h: 0.26, margin: 0, align: 'center', valign: 'middle', fontFace: F.medium, fontSize: 10, color: C.grau, fill: { color: C.weiss }, line: { type: 'none' }, objectName: 'Bildecke ' + ecke });
    if (o.marken) {
      [[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].forEach(([fx, fy, sx, sy], i) => {
        const ex = o.x + fx * o.w + (fx ? 0.06 : -0.06), ey = o.y + fy * h + (fy ? 0.06 : -0.06);
        s.addShape(ST.line, { x: Math.min(ex, ex + sx * 0.14), y: ey, w: 0.14, h: 0, line: { color: C.rot, width: 1 }, objectName: `Beschnittmarke ${i + 1} waagerecht` });
        s.addShape(ST.line, { x: ex, y: Math.min(ey, ey + sy * 0.14), w: 0, h: 0.14, line: { color: C.rot, width: 1 }, objectName: `Beschnittmarke ${i + 1} senkrecht` });
      });
    }
    return { x: o.x, y: o.y, w: o.w, h, unten: o.y + h };
  };
  // Linien-Icon der Broschüre. o: { name: check | kreuz | stopp | hinweis | …, farbe: tinte | rot | dunkelrot | weiss, x, y, d: 0.30, altText }
  // Ohne altText trägt das Icon seine Bezeichnung als Alternativtext (kein Bild ohne Beschreibung; pptxgenjs schriebe sonst den Dateipfad).
  const ICONTEXT = { check: 'Haken', kreuz: 'Kreuz', stopp: 'Stopp', hinweis: 'Hinweis', achtung: 'Achtung', frist: 'Frist', kalender: 'Kalender', rechner: 'Rechner', telefon: 'Telefon', mail: 'E-Mail', web: 'Web', standort: 'Standort', dokument: 'Dokument', pfeil: 'Pfeil' };
  B.icon = (s, o) => {
    brauche('B.icon', o, ['x', 'y']);
    if (!ICONTEXT[o.name]) throw new Error(`B.icon: Icon „${o.name}“ gibt es nicht (${Object.keys(ICONTEXT).join(', ')}).`);
    const d = o.d || 0.30;
    s.addImage({ path: asset(`ui-${o.name}-${o.farbe || 'tinte'}.png`), x: o.x, y: o.y, w: d, h: d, altText: o.altText || 'Symbol: ' + ICONTEXT[o.name], objectName: 'Icon ' + o.name });
  };

  // ---- 4.13 Zitat ----------------------------------------------------------------------------------------------------------------
  // Layout PGN_ZITAT: o = { zeilen: [], name, quelle }. Frei (mit x, y, w): 24 pt, dieselben Felder.
  B.zitat = (s, o) => {
    const frei = o.x !== undefined, pt = frei ? 24 : 28, zl = frei ? 31 : 36, st = { fontFace: F.mont, italic: true, fontSize: pt };
    if (frei) brauche('B.zitat', o, ['x', 'y', 'w']); else if (kx.layout !== 'PGN_ZITAT') throw new Error('B.zitat ohne x, y, w braucht das Layout PGN_ZITAT.');
    if (!Array.isArray(o.zeilen) || !o.zeilen.length) throw new Error('B.zitat: zeilen fehlt (von Hand gebrochen).');
    const x = frei ? o.x : colX(1), y = frei ? o.y : 2.25, w = frei ? o.w : span(9), zh = zl / 72;
    if (P) { for (const z of o.zeilen) P.zeile('Zitatzeile', z, st, w - 0.30); if (o.zeilen.length > 4) P.melde('Zitat mit mehr als vier Zeilen'); }
    s.addShape(ST.rect, { x, y: y + 0.07, w: 0.045, h: o.zeilen.length * zh + 0.02, fill: { color: C.rot }, line: { type: 'none' }, objectName: 'Zitatlinie' });
    const runs = o.zeilen.map((t, i) => ({ text: t, options: { breakLine: i < o.zeilen.length - 1 } }));
    if (!frei) {
      s.addText(runs, { placeholder: 'zitat' });
      if (o.name) s.addText(versal(o.name), { placeholder: 'name' });
      if (o.quelle) s.addText(o.quelle, { placeholder: 'quelle' });
      return { unten: 5.60 };
    }
    s.addText(runs, { x: x + 0.30, y, w: w - 0.30, h: o.zeilen.length * zh + 0.05, margin: 0, isTextBox: true, fontFace: F.mont, italic: true, fontSize: pt, lineSpacing: zl, color: cs.titel, valign: 'top', objectName: 'Zitat' });
    let yy = y + o.zeilen.length * zh + 0.18;
    if (o.name) { B.text(s, o.name, { x: x + 0.30, y: yy, w: w - 0.30, h: 0.22, rolle: 'zitatName', valign: 'middle', einzeilig: true, name: 'Zitat Name' }); yy += 0.24; }
    if (o.quelle) { B.text(s, o.quelle, { x: x + 0.30, y: yy, w: w - 0.30, h: 0.22, rolle: 'zitatQuelle', valign: 'middle', name: 'Zitat Quelle' }); yy += 0.24; }
    return { unten: yy };
  };

  // ---- 4.18 Einheitenquadrate ------------------------------------------------------------------------------------------------------
  // o: { x, y, n, gefuellt, reihen: 2, q: 0.20, fuge: 0.045, art: 'tinte' | 'zuschuss', rest: 'bisher' | 'kontur' }. Rückgabe: { w, h, xNach(k) }
  B.einheiten = (s, o) => {
    brauche('B.einheiten', o, ['x', 'y', 'n', 'gefuellt']);
    const q = o.q || 0.20, g = o.fuge ?? 0.045, reihen = o.reihen || 2, spalten = Math.ceil(o.n / reihen), dunkel = kx.grund === 'anthrazit';
    const voll = o.art === 'zuschuss' ? (dunkel ? HEX.dunkel.zuschuss : C.rot) : dunkel ? C.weiss : C.tinte;
    for (let i = 0; i < o.n; i++) {
      const c = Math.floor(i / reihen), r = i % reihen, an = i < o.gefuellt;
      const fill = an ? { color: voll } : o.rest === 'kontur' || dunkel ? { type: 'none' } : { color: HEX.grau300 };
      const line = an ? { color: voll, width: 0.5 } : o.rest === 'kontur' || dunkel ? { color: HEX.grau300, width: 0.5 } : { type: 'none' };
      s.addShape(ST.rect, { x: o.x + c * (q + g), y: o.y + r * (q + g), w: q, h: q, fill, line, objectName: 'Einheit ' + (i + 1) });
    }
    return { w: spalten * (q + g) - g, h: reihen * (q + g) - g, xNach: k => o.x + Math.ceil(k / reihen) * (q + g) - g / 2 };
  };

  // ---- Titelfolie: Kennzahl im weißen Feld des Schriftfelds (Layout PGN_TITEL) ------------------------------------------------------------
  // o: { vorsatz, zahl, einheit, bezug, zusatz }
  B.titelKennzahl = (s, o) => {
    if (kx.layout !== 'PGN_TITEL') throw new Error('B.titelKennzahl braucht das Layout PGN_TITEL.');
    if (!o || o.zahl === undefined) throw new Error('B.titelKennzahl: zahl fehlt.');
    const x = 10.63, w = 2.27, zeilen = [o.bezug, o.zusatz].filter(Boolean), st = { fontFace: F.semi, fontSize: 10, zeileMal: 1.0 };
    if (P) {
      P.zeile('Titel-Kennzahl', [{ text: o.zahl, stil: { fontFace: F.black, fontSize: 44 } }, { text: NBSP + (o.einheit || ''), stil: { fontFace: F.black, fontSize: 24 } }], null, w);
      const n = zeilen.reduce((a, t) => a + zeilenzahl(schutz(t), st, w), 0);   // „\n“ zählt als Zeilenwechsel
      if (n > 4) P.melde(`Titel-Kennzahl: Bezug und Zusatz brauchen ${n} Zeilen, das Feld fasst vier.`);
    }
    // Lagen im Feld 5,70 bis 7,20: Vorsatz 5,77, Zahl 6,00, Bezug 6,49 bis 7,14. Zwischen Vorsatz, Zahl und Bezug stehen damit gleiche Abstände
    // (bei 5,96 stieß die Oberkante der Zahl an den Vorsatz). „\n“ im Bezug bricht die Zeile von Hand (kein einzelnes Wort in der zweiten Zeile).
    if (o.vorsatz) s.addText(versal(o.vorsatz), { x, y: 5.77, w, h: 0.17, margin: 0, isTextBox: true, fontFace: F.xbold, fontSize: 11, charSpacing: 1.5, color: C.rot, valign: 'middle', objectName: 'Titel-Kennzahl Vorsatz' });
    s.addText([{ text: o.zahl, options: {} }, { text: NBSP + (o.einheit || ''), options: { fontSize: 24 } }], { x: x - 0.03, y: 6.00, w: w + 0.03, h: 0.50, margin: 0, isTextBox: true, fontFace: F.black, fontSize: 44, lineSpacing: 44, color: C.rot, valign: 'middle', objectName: 'Titel-Kennzahl' });
    if (zeilen.length) {
      const laeufe = zeilen.flatMap((t, i) => schutz(t).split('\n').map((teil, k, alle) => ({ text: teil, options: { fontFace: i ? F.medium : F.semi, color: i ? C.grau : C.tinte, breakLine: k < alle.length - 1 || i < zeilen.length - 1 } })));
      s.addText(laeufe, { x, y: 6.49, w, h: 0.65, margin: 0, isTextBox: true, fontSize: 10, lineSpacingMultiple: 0.95, valign: 'top', objectName: 'Titel-Kennzahl Bezug' });
    }
  };

  // Notiz unter der Tabelle im Platzhalter „notiz“ der Layouts PGN_TABELLE(_MR): eine Zeile, 12 pt, unten in der Inhaltszone
  B.notiz = (s, text) => {
    if (!/TABELLE/.test(kx.layout || '')) throw new Error('B.notiz braucht das Layout PGN_TABELLE oder PGN_TABELLE_MR; sonst B.text mit rolle „klein“.');
    const t = schutz(text);
    if (P) P.zeile('Notiz unter der Tabelle', t, { fontFace: F.text, fontSize: 12 }, CW);
    s.addText(t, { placeholder: 'notiz' });
  };

  // ---- Kopf von Diagramm und Tabelle, Vorspann (Platzhalter der Layouts) ---------------------------------------------------------------
  // Titel in Versalien (Montserrat ExtraBold 13 pt), Untertitel mit Einheit (Work Sans 12 pt); beide einzeilig über acht Spalten (7,92 Zoll).
  // Leerzeichen vor Einheiten schützt der Baustein. o: { titel, sub }
  const kopfFeld = (wort, re, felder) => (s, o) => {
    if (!re.test(kx.layout || '')) throw new Error(`B.${wort.toLowerCase()}kopf braucht das Layout PGN_${wort.toUpperCase()} oder PGN_${wort.toUpperCase()}_MR. Auf anderen Layouts B.modulkopf verwenden.`);
    if (!o || !o.titel) throw new Error(`B.${wort.toLowerCase()}kopf: titel fehlt.`);
    const t = versal(schutz(o.titel)), w = span(8);
    if (P) P.zeile(`${wort}titel`, t, stil('diagrammtitel'), w);
    s.addText(t, { placeholder: felder[0] });
    if (o.sub) { const u = schutz(o.sub); if (P) P.zeile(`${wort}-Untertitel`, u, stil('sub'), w); s.addText(u, { placeholder: felder[1] }); }
    return { unten: wort === 'Diagramm' ? ZONE.diagramm.legende : ZONE.tabelle.tabelle };
  };
  B.diagrammkopf = kopfFeld('Diagramm', /^PGN_DIAGRAMM/, ['diagrammtitel', 'diagrammsub']);
  B.tabellenkopf = kopfFeld('Tabelle', /^PGN_TABELLE/, ['tabellentitel', 'tabellensub']);
  // Vorspann im Platzhalter „lead“ des Layouts PGN_AUSSAGE (18 pt, 7,92 × 0,80 Zoll, höchstens 30 Wörter)
  B.vorspann = (s, text) => {
    if (kx.layout !== 'PGN_AUSSAGE') throw new Error('B.vorspann braucht das Layout PGN_AUSSAGE; sonst B.text mit rolle „vorspann“.');
    const t = schutz(text), z = ZONE.aussage.lead;
    if (P) P.block('Vorspann', t, stil('vorspann'), z.w, z.h, { luft: true });
    s.addText(t, { placeholder: 'lead' });
  };

  // ---- Prüfliste ------------------------------------------------------------------------------------------------------------------------
  // Nummerierte Fragen mit Achskreis M: Frage in Work Sans SemiBold 14 pt, Zusatz darunter in 12 pt; spaltenweise gefüllt, Haarlinie über jedem Punkt.
  // o: { x, y, w, spalten: 2, punkte: [{ nr, frage, zusatz, signal }], zeilenH (Vorgabe: höchster Punkt + 0,26), steg: 0.24, linien: true }
  // Rückgabe: { unten, zeilenH, felder: [{ x, y, w, h }] }
  B.pruefliste = (s, o) => {
    brauche('B.pruefliste', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.punkte) || !o.punkte.length) throw new Error('B.pruefliste: punkte fehlt (Liste aus { frage, zusatz }).');
    const sp = o.spalten || 2, n = o.punkte.length, je = Math.ceil(n / sp), steg = o.steg ?? 0.24, sw = (o.w - (sp - 1) * steg) / sp, d = KREIS.M[0], tx = d + 0.16, tw = sw - tx;
    const fs = { ...stil('dicht'), fontFace: F.semi, color: cs.titel }, zs = stil('klein'), fh = zeilenhoehe(fs), zh0 = zeilenhoehe(zs);
    const mass = o.punkte.map((p, i) => {
      if (!p || !p.frage) throw new Error(`B.pruefliste: Punkt ${i + 1} hat keine frage.`);
      const f = schutz(p.frage), z = p.zusatz ? schutz(p.zusatz) : '';
      const hf = zeilenzahl(f, fs, tw) * fh, hz = z ? zeilenzahl(z, zs, tw) * zh0 : 0;
      return { f, z, hf, hz, h: hf + (z ? 0.04 + hz : 0) };
    });
    const zh = o.zeilenH || +(Math.max(d, ...mass.map(m => m.h)) + 0.26).toFixed(3), felder = [];
    o.punkte.forEach((p, i) => {
      const m = mass[i], x = o.x + Math.floor(i / je) * (sw + steg), y = o.y + (i % je) * zh, ty = y + 0.13 + (d - fh) / 2;
      if (o.linien !== false) B.linie(s, { x, y, w: sw, art: 'haar', name: 'Prüfliste Linie' });
      B.achskreis(s, { cx: x + d / 2, cy: y + 0.13 + d / 2, groesse: 'M', text: p.nr ?? i + 1, variante: p.signal ? 'signal' : 'standard', name: 'Prüfpunkt ' + (p.nr ?? i + 1) });
      if (P) { P.block('Prüfliste Frage', m.f, fs, tw, m.hf); if (ty - y + m.h > zh + 0.01) P.melde(`Prüfliste: Punkt ${i + 1} braucht ${(ty - y + m.h).toFixed(2)} Zoll, die Zeile ist ${zh.toFixed(2)} Zoll hoch. zeilenH erhöhen oder kürzen.`); }
      s.addText(m.f, opt(fs, { x: x + tx, y: ty, w: tw, h: +(m.hf + 0.02).toFixed(3) }, { objectName: 'Prüffrage ' + (p.nr ?? i + 1) }));
      if (m.z) { if (P) P.block('Prüfliste Zusatz', m.z, zs, tw, m.hz); s.addText(m.z, opt(zs, { x: x + tx, y: +(ty + m.hf + 0.04).toFixed(3), w: tw, h: +(m.hz + 0.02).toFixed(3) }, { objectName: 'Prüfzusatz ' + (p.nr ?? i + 1) })); }
      felder.push({ x, y, w: sw, h: zh });
    });
    return { unten: o.y + je * zh, zeilenH: zh, felder };
  };

  // ---- Balkenplan (Leistungen über Phasen) -------------------------------------------------------------------------------------------------
  // Kopfleiste mit einem Achskreis S je Phase, davor rechtsbündig die Bezeichnung der Achse; darunter je Zeile Nummer und Bezeichnung (14 pt)
  // und ein Balken in Tinte über die Phasen von … bis. nummern: false lässt die Nummern der Zeilen weg: Dann zählen im Plan nur die Phasen.
  // Zeilen ohne Balken tragen ihr Wort in der Planfläche (12 pt, Tinte: Das Wort hat das Gewicht eines Balkens). Senkrechte Marke in Dunkelrot zwischen zwei Phasen mit gefülltem Achskreis
  // und Wort; unter dem Plan je ein Satz links und rechts der Marke (12 pt; „\n“ bricht die Zeile).
  // o: { x, y, w, labelBreite: 3.30, phasen: 9 | ['1', …], kopf: 'Leistungsphase', zeilen: [{ nr, text, von, bis } | { nr, text, wort }], zeilenH: 0.38,
  //      nummern: true, marke: { nach: 6, text: 'Bewilligung', zeichen: '±0' }, links, rechts }
  // y ist die Oberkante (dort steht das Markenwort); die Kopfleiste liegt bei y + 0,50.
  // Rückgabe: { unten, kopfY, planX, planW, xPhase(n) (Mitte der Phase n, ab 1), xMarke, zeilen: [{ y, h }] }
  B.balkenplan = (s, o) => {
    brauche('B.balkenplan', o, ['x', 'y', 'w']);
    if (!Array.isArray(o.zeilen) || !o.zeilen.length) throw new Error('B.balkenplan: zeilen fehlt.');
    const ph = Array.isArray(o.phasen) ? o.phasen.map(String) : Array.from({ length: o.phasen || 9 }, (_, i) => String(i + 1)), n = ph.length;
    const lb = o.labelBreite ?? 3.30, xp = o.x + lb, wp = o.w - lb, dx = wp / n, zh = o.zeilenH || 0.38, dS = KREIS.S[0];
    if (dx < dS + 0.08) throw new Error(`B.balkenplan: Je Phase bleiben ${dx.toFixed(2)} Zoll, die Achskreise brauchen ${(dS + 0.08).toFixed(2)}. labelBreite senken oder w erhöhen.`);
    const m = o.marke || null, kopfY = o.y + (m ? 0.50 : dS / 2), xPhase = k => xp + (k - 0.5) * dx, xm = m ? xp + m.nach * dx : null;
    if (m && !(m.nach >= 1 && m.nach < n)) throw new Error(`B.balkenplan: marke.nach ist ${m.nach}; erlaubt ist 1 bis ${n - 1} (die Marke steht zwischen zwei Phasen).`);
    // Bezeichnung der Achse: rechtsbündig vor dem ersten Achskreis (linksbündig über den Zeilen läse sie sich als Kopf der Zeilenspalte)
    if (o.kopf) B.text(s, o.kopf, { x: o.x, y: kopfY - 0.10, w: lb - 0.10, h: 0.20, rolle: 'label', align: 'right', valign: 'middle', einzeilig: true, name: 'Balkenplan Kopf' });
    B.linie(s, { x: xp, y: kopfY, w: wp, art: 'kraeftig', name: 'Balkenplan Achse' });
    ph.forEach((t, i) => B.achskreis(s, { cx: xPhase(i + 1), cy: kopfY, groesse: 'S', text: t, name: 'Phase ' + t }));
    const y0 = kopfY + dS / 2 + 0.17, zeilen = [];
    o.zeilen.forEach((z, i) => {
      const y = y0 + i * zh, name = z.nr ?? i + 1;
      if (!z.text) throw new Error(`B.balkenplan: Zeile ${i + 1} hat keinen text.`);
      B.text(s, o.nummern === false ? z.text : `**${name}** ${z.text}`, { x: o.x, y: y + (zh - 0.28) / 2, w: lb - 0.10, h: 0.28, rolle: 'dicht', valign: 'middle', einzeilig: true, name: 'Leistung ' + name });
      if (typeof z.von === 'number') {
        const bis = z.bis ?? z.von;
        if (!(z.von >= 1 && bis <= n && bis >= z.von)) throw new Error(`B.balkenplan: Zeile ${i + 1} läuft von ${z.von} bis ${bis}; es gibt die Phasen 1 bis ${n}.`);
        B.balken(s, { x: xp + (z.von - 1) * dx + 0.04, y: y + (zh - 0.24) / 2, w: (bis - z.von + 1) * dx - 0.08, h: 0.24, art: z.art || 'tinte', name: `Balken ${name}` });
      } else if (z.wort) B.text(s, z.wort, { x: xp + 0.04, y: y + (zh - 0.28) / 2, w: wp - 0.08, h: 0.28, rolle: 'klein', farbe: 'titel', valign: 'middle', einzeilig: true, name: 'Phase im Wortlaut ' + name });
      B.linie(s, { x: o.x, y: y + zh, w: o.w, art: 'haar', name: 'Balkenplan Zeilenlinie' });
      zeilen.push({ y, h: zh });
    });
    const yEnde = y0 + o.zeilen.length * zh;
    let unten = yEnde;
    if (m) {
      // Marke: gefüllter Achskreis über der Kopfleiste, Wort rechts daneben, Linie zwischen den Phasenkreisen hindurch bis unter die letzte Zeile
      B.linie(s, { x: xm, y: o.y + dS, h: yEnde - o.y - dS, art: 'signal', name: 'Marke ' + (m.text || '') });
      B.achskreis(s, { cx: xm, cy: o.y + dS / 2, groesse: 'S', text: m.zeichen || '±0', variante: 'signal', name: 'Achskreis Marke' });
      if (m.text) {
        const st = stil('wert'), tb = breite(schutz(m.text), st) + 0.06, rechts = xm + dS / 2 + 0.08 + tb <= o.x + o.w + 0.01;
        B.text(s, m.text, { x: rechts ? xm + dS / 2 + 0.08 : xm - dS / 2 - 0.08 - tb, y: o.y + dS / 2 - 0.12, w: tb, h: 0.24, rolle: 'wert', farbe: C.dunkelrot, align: rechts ? 'left' : 'right', valign: 'middle', einzeilig: true, name: 'Markenwort' });
      }
      const ks = stil('klein'), hoehe = (t, w) => +(zeilenzahl(schutz(t), ks, w) * zeilenhoehe(ks) + 0.04).toFixed(3);
      if (o.links) { const w = xm - o.x - 0.10, r = B.text(s, o.links, { x: o.x, y: yEnde + 0.10, w, h: hoehe(o.links, w), rolle: 'klein', align: 'right', name: 'Satz links der Marke' }); unten = Math.max(unten, r.unten); }
      if (o.rechts) { const w = o.x + o.w - xm - 0.10, r = B.text(s, o.rechts, { x: xm + 0.10, y: yEnde + 0.10, w, h: hoehe(o.rechts, w), rolle: 'klein', name: 'Satz rechts der Marke' }); unten = Math.max(unten, r.unten); }
    }
    return { unten, kopfY, planX: xp, planW: wp, xPhase, xMarke: xm, zeilen };
  };

  // ---- Beschriftungen an Diagrammen (Formen über der Plotfläche; Lagen aus der Rückgabe von D.*) --------------------------------------------
  // Bezeichnung (Work Sans SemiBold 12 pt) und Wert (Montserrat Bold 12 pt) in einer Zeile auf gemeinsamer Grundlinie, jede in ihrem Feld:
  // Work Sans steht in gleich hohen, mittig verankerten Feldern 0,012 Zoll tiefer als Montserrat; die Bezeichnung rückt um dieses Maß nach oben.
  // o: { y (Oberkante der Zeile), h: 0.22, bezeichnung: { text, x, w, align, name }, wert: { text, x, w, align, name },
  //      grau: true (Zeile ohne Betrag: Bezeichnung in Work Sans Regular, beide in Grau) }. Beide Texte sind einzeilig und werden gegen ihr Feld geprüft.
  const GRUNDLINIE_TEXT = 0.012;
  B.bezeichnungMitWert = (s, o) => {
    brauche('B.bezeichnungMitWert', o, ['y']);
    const h = o.h || 0.22, b = o.bezeichnung, w = o.wert;
    for (const [was, f] of [['bezeichnung', b], ['wert', w]]) { if (!f || f.text === undefined || f.text === null) throw new Error(`B.bezeichnungMitWert: ${was}.text fehlt.`); brauche(`B.bezeichnungMitWert, ${was}`, f, ['x', 'w']); }
    B.text(s, b.text, { x: b.x, y: o.y - GRUNDLINIE_TEXT, w: b.w, h, rolle: o.grau ? 'klein' : 'bezeichnung', align: b.align, valign: 'middle', einzeilig: true, name: b.name || 'Bezeichnung ' + b.text });
    B.text(s, w.text, { x: w.x, y: o.y, w: w.w, h, rolle: 'wert', farbe: o.grau ? 'sekundaer' : undefined, align: w.align, valign: 'middle', einzeilig: true, name: w.name || 'Wert ' + b.text });
    return { unten: o.y + h };
  };
  // Beschriftung in einem Segment eines gestapelten Balkens: Name (Work Sans SemiBold 11 pt) über Wert und Anteil (Montserrat Bold 12 pt),
  // mittig im Segment; weiß auf Zuschuss und Darlehen, Tinte auf der Schraffur der Eigenmittel. Ersetzt die Datenbeschriftung des Diagramms,
  // die nur den Wert zeigen kann (Diagramm mit labels: false). o: { x, y, w, h (Fläche des Segments), name, wert (fertiger Text), art }
  B.segmenttext = (s, o) => {
    brauche('B.segmenttext', o, ['x', 'y', 'w', 'h']);
    const name = schutz(o.name), wert = String(o.wert).replace(/ /g, NBSP), ns = { fontFace: F.semi, fontSize: 11 }, ws = { fontFace: F.mont, bold: true, fontSize: 12 };
    if (P) {
      P.zeile(`Segment ${o.name}, Name`, name, ns, o.w - 0.10);
      P.zeile(`Segment ${o.name}, Wert`, wert, ws, o.w - 0.10);
      if (o.h < 0.44) P.melde(`Segment ${o.name}: Der Balken ist ${o.h.toFixed(2)} Zoll hoch, zwei Zeilen brauchen 0,44 Zoll.`);
    }
    const hell = ['eigenmittel', 'bisher', 'papier', 'C'].includes(o.art);
    s.addText([{ text: name, options: { fontFace: F.semi, fontSize: 11, bold: false, breakLine: true } }, { text: wert, options: { fontFace: F.mont, bold: true, fontSize: 12 } }],
      { x: o.x, y: o.y, w: o.w, h: o.h, margin: 0, isTextBox: true, fontFace: F.semi, fontSize: 11, color: hell ? C.tinte : C.weiss, align: 'center', valign: 'middle', objectName: 'Segment ' + o.name });
  };
  // Beschriftung der Kategorienachse als Textfelder unter der Plotfläche (Work Sans 11 pt, grau, mittig unter der Kategorie), für Liniendiagramme
  // mit katLabels: { formen: [...] }. d: Rückgabe von D.linien. Die Texte folgen einer späteren Änderung der Diagrammdaten in PowerPoint nicht.
  B.achstexte = (s, d) => {
    if (!d || !Array.isArray(d.katTexte) || !d.katTexte.length) throw new Error('B.achstexte: Das Diagramm trägt keine Beschriftungen (D.linien mit katLabels: { formen: [...] }).');
    const st = stil('achse'), w = 0.60;
    for (const e of d.katTexte) {
      if (P) P.zeile('Achsbeschriftung', e.text, st, w);
      s.addText(e.text, opt(st, { x: d.katMitte(e.i) - w / 2, y: d.plot.y + d.plot.h + 0.08, w, h: 0.20 }, { align: 'center', valign: 'middle', objectName: 'Achsbeschriftung ' + e.text }));
    }
    return { unten: d.plot.y + d.plot.h + 0.28 };
  };
  // Werte an einer Marke im Liniendiagramm: je Zeile ein Achskreis (0,26 Zoll) und der Wert in Montserrat Bold 12 pt.
  // Die Zeilen stehen in den Bändern zwischen den Gitterlinien (mitten: y je Zeile), damit keine Gitterlinie durch eine Zahl läuft.
  // o: { x (linke Kante), mitten: [y], eintraege: [{ kreis, text }], name }. Rückgabe: { rechts }
  B.wertzeilen = (s, o) => {
    brauche('B.wertzeilen', o, ['x']);
    if (!Array.isArray(o.eintraege) || !Array.isArray(o.mitten) || o.mitten.length < o.eintraege.length) throw new Error('B.wertzeilen: Je Eintrag wird eine Lage in „mitten“ gebraucht.');
    const d = 0.26, name = o.name || 'Wertzeile';
    o.eintraege.forEach((e, i) => {
      B.achskreis(s, { cx: o.x + d / 2, cy: o.mitten[i], d, pt: 10, text: e.kreis, name: `${name} Achskreis ${e.kreis}` });
      B.text(s, e.text, { x: o.x + d + 0.07, y: o.mitten[i] - 0.12, w: 0.80, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: `${name} Wert ${e.kreis}` });
    });
    return { rechts: o.x + d + 0.87 };
  };
  // Punkt auf einer Linie (Schnitt mit einer Marke): Scheibe 0,10 Zoll in der Farbe der Linie mit schmalem Rand in der Grundfarbe. o: { cx, cy, art: tinte | referenz, name }
  B.punkt = (s, o) => {
    brauche('B.punkt', o, ['cx', 'cy']);
    const d = 0.10;
    s.addShape(ST.ellipse, { x: o.cx - d / 2, y: o.cy - d / 2, w: d, h: d, fill: { color: o.art === 'referenz' ? C.referenz : C.tinte }, line: { color: cs.fuge, width: 0.75 }, objectName: o.name || 'Punkt auf der Linie' });
  };
  // Achskreise S an den Linienenden, auf Mindestabstand entzerrt; wahlweise mit dem Endwert daneben (Montserrat Bold 12 pt).
  // o: { x (Mitte der Kreise), eintraege: [{ kreis, y (Lage des Linienendes), wert (fertiger Text, wahlfrei) }], abstand: 0.32 }. Rückgabe: Lagen der Kreise
  B.linienenden = (s, o) => {
    brauche('B.linienenden', o, ['x']);
    if (!Array.isArray(o.eintraege) || !o.eintraege.length) throw new Error('B.linienenden: eintraege fehlt (Liste aus { kreis, y, wert }).');
    const lagen = B.entzerre(o.eintraege.map(e => e.y), o.abstand || 0.32);
    o.eintraege.forEach((e, i) => {
      B.achskreis(s, { cx: o.x, cy: lagen[i], groesse: 'S', text: e.kreis, name: 'Linienende ' + e.kreis });
      if (e.wert !== undefined && e.wert !== null) B.text(s, e.wert, { x: o.x + 0.20, y: lagen[i] - 0.12, w: 0.85, h: 0.24, rolle: 'wert', valign: 'middle', einzeilig: true, name: 'Endwert ' + e.kreis });
    });
    return lagen;
  };
  // Direkte Beschriftung eines Ringdiagramms rechts neben dem Ring: je Segment ein Farbfeld, die Zahl als Kernwert (Montserrat ExtraBold 24 pt)
  // und die Bezeichnung in 12 pt darunter. Die Einträge stehen als Block mittig zur Ringmitte.
  // o: { x, cy, w, eintraege: [{ wert (fertiger Text), text, art }], schritt: 0.86 }. Rückgabe: { oben, unten }
  B.ringWerte = (s, o) => {
    brauche('B.ringWerte', o, ['x', 'cy', 'w']);
    if (!Array.isArray(o.eintraege) || !o.eintraege.length) throw new Error('B.ringWerte: eintraege fehlt (Liste aus { wert, text, art }).');
    const schritt = o.schritt || 0.86, FELD = 0.16, dx = FELD + 0.12, hoehe = (o.eintraege.length - 1) * schritt + 0.62, oben = o.cy - hoehe / 2;
    let unten = oben;
    o.eintraege.forEach((e, i) => {
      const y = oben + i * schritt;
      B.balken(s, { x: o.x, y: y + 0.10, w: FELD, h: FELD, art: e.art, name: 'Farbfeld ' + e.text });
      B.text(s, e.wert, { x: o.x + dx, y, w: o.w - dx, h: 0.36, rolle: 'kernwert', valign: 'middle', einzeilig: true, name: 'Wert ' + e.text });
      unten = B.text(s, e.text, { x: o.x + dx, y: y + 0.38, w: o.w - dx, rolle: 'klein', name: 'Bezeichnung ' + e.text }).unten;
    });
    return { oben, unten };
  };
  // Kategorientexte unter einem Säulendiagramm, das mit katAchse: false gebaut ist: Bezeichnung (Work Sans SemiBold 12 pt) und darunter ein
  // Zusatz (11 pt, grau), beide mittig unter der Kategorie. d: Rückgabe von D.gruppierteSaeulen oder D.saeulen; texte: [{ name, zusatz }]. Rückgabe: { unten }
  B.kategorien = (s, d, texte) => {
    if (!d || !d.plot || typeof d.katMitte !== 'function' || !Array.isArray(texte)) throw new Error('B.kategorien(s, d, texte): d ist die Rückgabe eines Säulendiagramms, texte eine Liste aus { name, zusatz }.');
    const w = d.katBreite - 0.10, y = d.plot.y + d.plot.h + 0.07;
    texte.forEach((t, i) => {
      if (P) P.zeile('Kategorie', schutz(t.name), { fontFace: F.semi, fontSize: 12 }, w);
      B.text(s, t.name, { x: d.katMitte(i) - w / 2, y, w, h: 0.22, rolle: 'bezeichnung', align: 'center', valign: 'middle', pruefen: false, name: 'Kategorie ' + t.name });
      if (t.zusatz) B.text(s, t.zusatz, { x: d.katMitte(i) - w / 2, y: y + 0.21, w, h: 0.20, rolle: 'achse', align: 'center', valign: 'middle', einzeilig: true, name: 'Kategorie Zusatz ' + t.name });
    });
    return { unten: y + 0.41 };
  };

  // Lagen entzerren: schiebt Werte (zum Beispiel y der Achskreise an Linienenden) auf den Mindestabstand auseinander, Reihenfolge bleibt
  B.entzerre = (werte, abstand) => {
    const idx = werte.map((v, i) => i).sort((a, b) => werte[a] - werte[b]), out = [...werte];
    for (let lauf = 0; lauf < 60; lauf++) {
      let bewegt = false;
      for (let k = 1; k < idx.length; k++) { const a = idx[k - 1], b = idx[k], d = out[b] - out[a]; if (d < abstand - 1e-6) { const m = (abstand - d) / 2; out[a] -= m; out[b] += m; bewegt = true; } }
      if (!bewegt) break;
    }
    return out;
  };

  // Alternativtext an einer Form (pptxgenjs schreibt ihn nur für Bilder und Diagramme): Die Form mit diesem objectName auf der Folie bekommt
  // den Text in der Nachbearbeitung als „descr“ und gilt dann nicht als Schmuck. Der Name muss auf der Folie eindeutig sein.
  B.altText = (s, name, text) => {
    if (!name || !text || !String(text).trim()) throw new Error('B.altText(s, name, text): Objektname und Text sind Pflicht.');
    if (typeof kx.altText !== 'function') throw new Error('B.altText: Der Bau nimmt keine Alternativtexte für Formen an (kx.altText fehlt).');
    kx.altText(String(name), String(text));
  };

  B.schutz = schutz; B.versal = versal; B.stil = stil; B.farben = cs;
  return B;
}

module.exports = { RAHMEN, bausteine, titelLaeufe, titelPruefzeilen, titelKollisionen, schutz };
