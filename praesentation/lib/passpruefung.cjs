// Passprüfung: rechnet mit den Zeichenbreiten aus schriftmetrik.json, ob Texte in ihr Feld passen.
// Der Build sammelt die Meldungen je Folie und bricht bei Fehlern ab (Folie und Text werden genannt).
'use strict';
const METRIK = require('./schriftmetrik.json');

const DATEI = {
  'Montserrat Black': ['Montserrat-Black', 'Montserrat-BlackItalic'],
  'Montserrat ExtraBold': ['Montserrat-ExtraBold', 'Montserrat-ExtraBoldItalic'],
  'Montserrat Light': ['Montserrat-Light', 'Montserrat-LightItalic'],
  'Montserrat Medium': ['Montserrat-Medium', 'Montserrat-Medium'],
  'Montserrat SemiBold': ['Montserrat-SemiBold', 'Montserrat-SemiBold'],
  'Montserrat': ['Montserrat-Regular', 'Montserrat-Italic'],
  'Montserrat|fett': ['Montserrat-Bold', 'Montserrat-BoldItalic'],
  'Work Sans': ['WorkSans-Regular', 'WorkSans-Italic'],
  'Work Sans|fett': ['WorkSans-Bold', 'WorkSans-BoldItalic'],
  'Work Sans Medium': ['WorkSans-Medium', 'WorkSans-MediumItalic'],
  'Work Sans SemiBold': ['WorkSans-SemiBold', 'WorkSans-SemiBoldItalic'],
  'Work Sans Light': ['WorkSans-Light', 'WorkSans-Light'],
};

function metrik(stil) {
  const key = stil.fontFace + (stil.bold ? '|fett' : '');
  const paar = DATEI[key] || DATEI[stil.fontFace];
  if (!paar) throw new Error(`Passprüfung: unbekannte Schrift „${stil.fontFace}“ (erlaubt sind nur die Familien aus theme.cjs, F.*)`);
  return METRIK[paar[stil.italic ? 1 : 0]];
}

// Breite eines einzeiligen Textes in Zoll. stil: { fontFace, bold, italic, fontSize, weite (Laufweite in pt) }
function breite(text, stil, unbekannt) {
  const m = metrik(stil), b = m.breiten_em, pt = stil.fontSize;
  let em = 0, n = 0;
  for (const ch of String(text)) {
    n++;
    if (b[ch] === undefined) { if (unbekannt) unbekannt.add(ch); em += 0.62; } else em += b[ch];
  }
  return (em * pt + n * (stil.weite || 0)) / 72;
}
// Läufe: [{ text, stil }] → Summe der Breiten
const breiteLaeufe = (laeufe, unbekannt) => laeufe.reduce((s, l) => s + breite(l.text, l.stil, unbekannt), 0);

// Zeilenzahl eines Fließtextes bei gegebener Feldbreite (Umbruch an Leerzeichen und nach Bindestrich; U+00A0 bricht nicht)
function zeilenzahl(text, stil, feld, unbekannt) {
  let zeilen = 0;
  for (const absatz of String(text).split('\n')) {
    const woerter = absatz.split(/(?<= )|(?<=[-–/])(?=\S)/);   // Leerzeichen bleibt am Wortende
    let zeile = 0; zeilen++;
    for (const w of woerter) {
      const bw = breite(w, stil, unbekannt), ohne = breite(w.replace(/ +$/, ''), stil);
      if (zeile > 0 && zeile + ohne > feld) { zeilen++; zeile = bw; } else zeile += bw;
    }
  }
  return zeilen;
}
// Höhe eines Textblocks in Zoll: Zeilen × Zeilenmaß. stil.zeile = exakter Abstand in pt, stil.zeileMal = Faktor
function zeilenhoehe(stil) {
  if (stil.zeile) return stil.zeile / 72;
  // 1,025: Im gerenderten Bild (LibreOffice) liegt der Zeilenabstand gut 2 % über dem Maß der Schrift; die Prüfung rechnet auf der sicheren Seite
  return stil.fontSize * metrik(stil).zeile_em * (stil.zeileMal || 1) / 72 * 1.025;
}
const blockhoehe = (text, stil, feld) => zeilenzahl(text, stil, feld) * zeilenhoehe(stil);

class Pruefung {
  constructor() { this.fehler = []; this.hinweise = []; this.folie = '?'; }
  setzeFolie(id) { this.folie = id; }
  melde(text) { this.fehler.push({ folie: this.folie, text }); }
  hinweis(text) { this.hinweise.push({ folie: this.folie, text }); }
  zeichen(unbekannt, was, text) {
    if (unbekannt.size) this.melde(`${was}: Zeichen ${[...unbekannt].map(c => `„${c}“ (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`).join(', ')} stehen nicht in der Schriftmetrik und fehlen vermutlich in der Schrift. Text: „${text}“`);
  }
  // Einzeiliger Text gegen die Feldbreite. laeufe: String (mit stil) oder [{ text, stil }]
  zeile(was, laeufe, stil, feld) {
    const l = typeof laeufe === 'string' ? [{ text: laeufe, stil }] : laeufe;
    const u = new Set(), b = breiteLaeufe(l, u), text = l.map(x => x.text).join('');
    this.zeichen(u, was, text);
    if (b > feld + 0.005) this.melde(`${was}: „${text}“ ist ${b.toFixed(2)} Zoll breit, das Feld ${feld.toFixed(2)} Zoll (${Math.round((b / feld - 1) * 100)} % zu breit). Kürzen oder anders brechen.`);
    return b;
  }
  // Mehrzeiliger Text gegen Feldbreite und Feldhöhe. Fehler, sobald der Text höher ist als sein Feld; Hinweis, wenn weniger als 5 % Luft bleiben
  // (andere Schriftbreiten in PowerPoint können eine Zeile mehr ergeben). Den Hinweis gibt es nur mit luft: true, also für Felder fester Höhe;
  // viele Aufrufe prüfen nur die Wortbreite und geben als Höhe die des Textes selbst mit.
  block(was, text, stil, feldB, feldH, { luft = false } = {}) {
    const u = new Set(), n = zeilenzahl(text, stil, feldB, u), h = n * zeilenhoehe(stil);
    this.zeichen(u, was, text);
    // ein einzelnes Wort, das breiter ist als das Feld, würde mitten im Wort brechen
    for (const wort of String(text).split(/[ \n]+/)) {
      const bw = breite(wort, stil);
      if (bw > feldB + 0.005) { this.melde(`${was}: Das Wort „${wort}“ ist ${bw.toFixed(2)} Zoll breit, das Feld ${feldB.toFixed(2)} Zoll; es bräche mitten im Wort. Feld verbreitern oder anders formulieren.`); break; }
    }
    if (h > feldH + 0.005) this.melde(`${was}: Text braucht ${n} Zeilen (${h.toFixed(2)} Zoll), das Feld ist ${feldH.toFixed(2)} Zoll hoch. Text: „${String(text).slice(0, 80)}${String(text).length > 80 ? '…' : ''}“`);
    else if (luft) this.luft(was, h, feldH, n);
    return h;
  }
  // Hinweis bei weniger als 5 % Luft in einem mehrzeiligen Feld fester Höhe (zeilen: Zahl der Zeilen, wenn bekannt; einzeilige Felder zählen nicht)
  luft(was, h, feldH, zeilen) {
    if (zeilen !== 1 && h * 1.05 > feldH + 0.005) this.hinweis(`${was}: ${zeilen ? zeilen + ' Zeilen füllen' : 'Der Text füllt'} das Feld bis auf ${Math.max(0, Math.round((1 - h / feldH) * 1000) / 10).toString().replace('.', ',')} % (${h.toFixed(2)} von ${feldH.toFixed(2)} Zoll). Mit anderen Schriftbreiten kann eine Zeile mehr entstehen.`);
  }
  mindest(was, pt, min) { if (pt < min) this.melde(`${was}: ${pt} pt liegt unter der Mindestgröße ${min} pt (E3).`); }
  bericht() {
    const z = [];
    for (const f of this.fehler) z.push(`  Folie „${f.folie}“ – ${f.text}`);
    return z.join('\n');
  }
}

module.exports = { Pruefung, breite, breiteLaeufe, zeilenzahl, zeilenhoehe, blockhoehe, metrik };
