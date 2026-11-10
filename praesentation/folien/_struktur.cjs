// Hilfsfunktionen der Baugruppe „struktur“ (Folien 2, 7, 8, 13, 22, 25, A0, A7). Kein Folienmodul: build.cjs lädt nur folien/<id>.cjs der Folien des Konzepts.
//   abschnitte             Abschnitte des Hauptteils in der Reihenfolge des Konzepts: eine Zählung für Agenda (Folie 7) und Trenner (Folien 2, 8, 13, 25)
//   trenner                Roter Trenner vor einem Abschnitt: Achskreis XL, Titel und Vorspann aus dem Konzept, Achsleiste
//   achsreihe              Achse der Agenda: waagerechte Achse, je Abschnitt ein Achskreis mit senkrechter Achslinie, Name und Inhalt
//   register               Register der sechs Programmteile: der Schlüsselplan in groß (Programm-Chip, Name, Verweis), ein Feld hervorgehoben
//   kostenFelder, liesKosten  Texte der Folie 22 aus daten/markt.json (Block kosten) mit gefüllten Platzhaltern
//   bereiche, quellenZeilen   Quellentabelle der Folie A7: Blattnummern aus den Quellenzeilen aller Folien des Konzepts
// Allgemeine Helfer stehen in lib/: B.achskreis mit der Größe G, B.zweizeilig, B.hauptzahl und B.zweitesModul (rechte Spalte der Folie 22),
// B.hinweisKasten, B.hoehe. Hier steht keine Zahl mit Aussage: Werte kommen aus den Modulen (W, X), Lagen und Maße sind Angaben der Zeichnung.
'use strict';
const { zeilenzahl, zeilenhoehe } = require('../lib/passpruefung.cjs');

// ---- Abschnitte -------------------------------------------------------------------------------------------------------------------
// Namen der Abschnitte des Hauptteils (Feld „abschnitt“ der Folien, ohne „Anhang“) in der Reihenfolge des Konzepts
const abschnitte = ctx => [...new Set(ctx.outline.folien.map(f => f.abschnitt))].filter(a => a !== 'Anhang');

// ---- Trenner ----------------------------------------------------------------------------------------------------------------------------
// Roter Trenner vor einem Abschnitt des Hauptteils (PGN_ABSCHNITT_ROT): Achskreis XL mit der Nummer des Abschnitts, Titel und Vorspann aus dem
// Konzept, Achsleiste mit einem Achskreis je Abschnitt, der eigene gefüllt. Die Nummer folgt aus dem Feld „abschnitt“; das Konzept muss sie im
// Achskreis XL nennen. opt: { lead } für einen Vorspann mit Werten aus der Mappe (sonst der Wortlaut des Konzepts).
function trenner(ctx, opt = {}) {
  const { B, P, o } = ctx, alle = abschnitte(ctx), aktiv = alle.indexOf(o.abschnitt) + 1;
  const s = ctx.folie(opt.lead === undefined ? {} : { lead: opt.lead });
  if (!o.inhalt.includes(`Achskreis XL: „${aktiv}“`)) P.melde(`Abschnitt „${o.abschnitt}“ ist der ${aktiv}. des Hauptteils; das Konzept nennt im Achskreis XL eine andere Nummer.`);
  B.abschnittsleiste(s, { n: alle.length, aktiv });
  return s;
}

// ---- Agenda: Achse mit vier Achskreisen ---------------------------------------------------------------------------------------------
// Die Achskreise haben die Größe G der Bibliothek (0,90 Zoll, Montserrat Black 32 pt, Kontur 1,5 pt, Ziffer in Tinte): Rot bleibt auf der
// Agenda dem Programmteil 2.1 vorbehalten.
// Achse der Agenda über die Breite w: waagerechte Achse (1 pt, Tinte), je Station ein Achskreis im Abstand „schritt“ (drei Rasterspalten); der
// erste Kreis beginnt bei x (Kreise ragen um den halben Durchmesser über die Achse). Von jedem Kreis läuft eine Achslinie (Strichpunkt) nach
// unten wie die Achsen eines Grundrisses; rechts daneben stehen Name (Montserrat ExtraBold, Versalien, einzeilig) und Inhalt (14 pt, höchstens
// zwei Zeilen, an der Wortfuge mit den ausgeglichensten Zeilen gebrochen).
// o: { x, y (Oberkante der Achskreise), w, schritt, d, stationen: [{ nr, name, inhalt }], namePt, einzug, steg }
// Rückgabe: { achse (y der Achse), unten (Ende der Achslinien), felder: [{ cx, x, w }] }
function achsreihe(ctx, s, o) {
  const { B, P, F } = ctx, n = o.stationen.length, d = o.d ?? 0.90, schritt = o.schritt ?? o.w / n, einzug = o.einzug ?? 0.20, steg = o.steg ?? 0.22;
  const yAchse = o.y + d / 2, yName = o.y + d + 0.14, nameH = 0.30, yInhalt = yName + nameH + 0.04;
  const st = B.stil('dicht'), zh = zeilenhoehe(st), namenStil = { fontFace: F.xbold, fontSize: o.namePt ?? 16, weite: 0.5 };
  // Felder: Text von der Achslinie bis vor die nächste Achslinie; das letzte Feld endet am Satzspiegel
  const felder = o.stationen.map((_, i) => {
    const cx = o.x + d / 2 + i * schritt, x = cx + einzug, ende = i < n - 1 ? cx + schritt - steg : o.x + o.w;
    return { cx, x, w: +(ende - x).toFixed(3) };
  });
  const texte = o.stationen.map((t, i) => B.zweizeilig(t.inhalt, { w: felder[i].w, rolle: 'dicht' }));
  const zeilen = Math.max(...texte.map((t, i) => zeilenzahl(t, st, felder[i].w)));
  if (zeilen > 2) P.melde(`Agenda: Die Zeile Inhalt eines Abschnitts braucht ${zeilen} Zeilen (höchstens zwei). Kürzen.`);
  const unten = +(yInhalt + zeilen * zh + 0.06).toFixed(3);

  // Linien zuerst (Schmuck), dann je Abschnitt Kreis, Name und Inhalt in Leserichtung
  B.linie(s, { x: o.x, y: yAchse, w: o.w, art: 'kraeftig', name: 'Achse der Abschnitte' });
  felder.forEach((f, i) => B.linie(s, { x: f.cx, y: o.y + d, h: unten - o.y - d, art: 'tinte', strich: 'lgDashDot', name: 'Achslinie ' + o.stationen[i].nr }));
  o.stationen.forEach((t, i) => {
    const f = felder[i];
    B.achskreis(s, { cx: f.cx, cy: yAchse, groesse: 'G', d, text: t.nr, name: 'Achskreis ' + t.nr });
    P.zeile(`Abschnitt ${t.nr}, Name`, ctx.versal(ctx.schutz(t.name)), namenStil, f.w);
    B.text(s, t.name, { x: f.x, y: yName, w: f.w, h: nameH, rolle: 'station', pt: namenStil.fontSize, valign: 'middle', einzeilig: true, name: `Abschnitt ${t.nr} Name` });
    B.text(s, texte[i], { x: f.x, y: yInhalt, w: f.w, rolle: 'dicht', name: `Abschnitt ${t.nr} Inhalt` });
  });
  return { achse: yAchse, unten, felder };
}

// ---- Agenda: Register der Programmteile ---------------------------------------------------------------------------------------------
// Der Schlüsselplan der Kickerzeile in groß: sechs gleich breite Felder über die Breite w mit schmaler Fuge. Je Feld Programm-Chip in der
// Programmfarbe, Name (Work Sans SemiBold 12 pt) und an der Unterkante unter einer Haarlinie der Verweis (12 pt, grau). Das Feld „aktiv“ liegt
// auf dem hellen Ton seiner Programmfarbe, sein Verweis steht halbfett in Tinte; die übrigen Felder liegen auf der Kastenfläche.
// o: { x, y, w, h, felder: [{ nr, name, verweis }], aktiv, fuge, rand }
function register(ctx, s, o) {
  const { B, P, HEX, F } = ctx, n = o.felder.length, fuge = o.fuge ?? 0.06, rand = o.rand ?? 0.10, w = +((o.w - (n - 1) * fuge) / n).toFixed(4), tw = +(w - 2 * rand).toFixed(3);
  const semi = { fontFace: F.semi, fontSize: 12, zeileMal: 1.12 }, zh = zeilenhoehe(semi), yName = o.y + rand + 0.24 + 0.08, verweisH = 0.22;
  const yVerweis = +(o.y + o.h - rand - verweisH + 0.03).toFixed(3), yLinie = +(yVerweis - 0.06).toFixed(3);
  o.felder.forEach((f, i) => {
    const x = +(o.x + i * (w + fuge)).toFixed(4), an = f.nr === o.aktiv, name = ctx.schutz(f.name), z = zeilenzahl(name, semi, tw), nameH = +(z * zh + 0.04).toFixed(3);
    B.kasten(s, { x, y: o.y, w, h: o.h, ...(an ? { farbe: HEX.bsTon[f.nr] } : {}), name: `Register ${f.nr} Fläche` });
    B.linie(s, { x: x + rand, y: yLinie, w: tw, art: 'haar', farbe: an ? HEX.rot300 : HEX.grau300, name: `Register ${f.nr} Linie` });
    B.programmChip(s, { x: x + rand, y: o.y + rand, nr: f.nr });
    P.block(`Register ${f.nr}, Name`, name, semi, tw, nameH);
    if (yName + nameH > yLinie - 0.04) P.melde(`Register ${f.nr}: Der Name braucht ${z} Zeilen und läuft in den Verweis; dem Feld (${o.h.toFixed(2)} Zoll hoch) fehlen ${(yName + nameH + 0.04 - yLinie).toFixed(2)} Zoll.`);
    B.text(s, name, { x: x + rand, y: yName, w: tw, h: nameH, rolle: 'bezeichnung', pruefen: false, name: `Register ${f.nr} Name` });
    P.zeile(`Register ${f.nr}, Verweis`, ctx.schutz(f.verweis), an ? semi : { fontFace: F.text, fontSize: 12 }, tw);
    B.text(s, f.verweis, { x: x + rand, y: yVerweis, w: tw, h: verweisH, rolle: an ? 'bezeichnung' : 'klein', valign: 'middle', einzeilig: true, pruefen: false, name: `Register ${f.nr} Verweis` });
  });
  return { unten: o.y + o.h };
}

// ---- Folie 22: Texte ----------------------------------------------------------------------------------------------------------------------
// Zahlen, die in den Texten des Blocks kosten (daten/markt.json) als Platzhalter stehen. Jede Zahl hat genau eine Quelle:
// daten/markt.json (Altfassung, mit Herkunft) oder daten/werte.json (Vorsatz „mappe_“, Lauf modellhaus).
function kostenFelder(ctx) {
  const { X, W, fmt } = ctx, sp = (wer, m) => fmt.zahl(X('markt', `kosten.${wer}.spanne_herstellung.${m}`));
  return { kg_herstellung: X('markt', 'kosten.gruppen')[0].kg, mappe_herstellungskosten_qm: fmt.zahl(W('modellhaus', 'eingabe.herstellungskosten_qm')),
    pgn_median: sp('pgn', 'median'), arge_median: sp('arge', 'median'), pgn_min: sp('pgn', 'min'), pgn_max: sp('pgn', 'max'), arge_min: sp('arge', 'min'), arge_max: sp('arge', 'max') };
}
const liesKosten = ctx => { const U = ctx.lies('markt', kostenFelder(ctx)); return k => U('kosten.texte.' + k); };

// ---- Folie A7: Quellentabelle ---------------------------------------------------------------------------------------------------------
// Blattnummern in der Reihenfolge des Konzepts zusammenfassen: drei und mehr aufeinanderfolgende Blätter als Bereich mit Halbgeviertstrich,
// Hauptteil und Anhang getrennt („12–22“, „2, 4, 20, 21“). ids: Folien-IDs; folien: Folienliste des Konzepts.
function bereiche(ids, folien) {
  const lage = new Map(folien.map((f, i) => [f.id, i]));
  const reihe = [...ids].sort((a, b) => lage.get(a) - lage.get(b)).map(id => folien[lage.get(id)]);
  const anhang = f => /^A/.test(String(f.nr));
  const gruppen = [];
  for (const f of reihe) {
    const g = gruppen[gruppen.length - 1], letzte = g && g[g.length - 1];
    if (letzte && lage.get(f.id) === lage.get(letzte.id) + 1 && anhang(f) === anhang(letzte)) g.push(f); else gruppen.push([f]);
  }
  return gruppen.map(g => (g.length >= 3 ? `${g[0].nr}–${g[g.length - 1].nr}` : g.map(f => f.nr).join(', '))).join(', ');
}

// Zeilen der Quellentabelle: [{ folien, text, ids }]. Eine Folie zählt zu einer Zeile, wenn ihre Quellenzeile eine Kennung der Zeile enthält;
// Rahmenfolien (Titel, Trenner, Schluss) zählen nicht. „folien“ in der Datendatei setzt die Bezeichnung fest („alle“).
// Geprüft wird: Jeder Teil jeder Quellenzeile des Konzepts gehört zu einer Tabellenzeile oder zu den Teilen ohne Zeile (Verweise auf die
// Broschüre, Bildnachweis); jede Tabellenzeile hat mindestens eine Folie; Text und Blattnummern stehen so im Konzept der Folie; die
// Foliennummern in den Texten („Folie 5: …“) sind die der Folien, deren Quellenzeile die Angabe nennt.
function quellenZeilen(ctx) {
  const { X, P, W, outline, glatt } = ctx, Q = k => X('rahmen', 'quellen.' + k), gross = t => glatt(t).toLocaleUpperCase('de-DE');
  const rahmenfolien = new Set(Q('rahmenfolien')), ohne = Q('ohne_zeile'), zeilen = Q('zeilen');
  const meta = W.meta(), version = (String(meta.mappe).match(/_(v\d+)\.xlsx$/) || [])[1], stand = (String(meta.mappe_stand).match(/Stand (\d{2}\/\d{4})/) || [])[1];
  if (!version || !stand) throw new Error(`Quellen: Version oder Stand der Mappe nicht lesbar (werte.json meta.mappe „${meta.mappe}“, meta.mappe_stand „${meta.mappe_stand}“).`);
  // Vollständigkeit: kein Teil einer Quellenzeile ohne Tabellenzeile. Teile trennt ein Semikolon oder ein Satzende (Punkt vor Großbuchstabe,
  // außer nach Abkürzungen wie „Nds.“, „Nr.“, „S.“, „Dr.“, „e. V.“)
  const kennungen = zeilen.flatMap(z => z.kennung), TEILER = /;\s*|(?<!\b(?:Nds|MBl|Nr|Abs|Abb|RdErl|Dr|S|d|v|V|e))\.\s+(?=[A-ZÄÖÜ])/;
  for (const f of outline.folien) {
    for (const teil of String(f.quellen || '').replace(/^Quellen?:\s*/, '').split(TEILER).map(t => t.trim()).filter(Boolean)) {
      if (![...kennungen, ...ohne].some(k => teil.includes(k))) P.melde(`Quellen: „${teil}“ (Folie ${f.nr}, ${f.id}) gehört zu keiner Zeile der Quellentabelle. Zeile oder Kennung in daten/rahmen.json ergänzen.`);
    }
  }
  // Folien einer Kennung in der Reihenfolge des Konzepts (ohne Rahmenfolien)
  const folienMit = kennung => outline.folien.filter(f => !rahmenfolien.has(f.layout) && String(f.quellen || '').includes(kennung));
  return zeilen.map(z => {
    // Gilt eine Angabe nur für einen Teil der Folien ihrer Zeile, steht die Folie davor („Folie 5: …“, „Folien 22 und 23: …“). Diese Nummern
    // stehen als Text in der Datendatei; hier werden sie gegen die Quellenzeilen des Konzepts gerechnet, damit sie einer neuen Zählung folgen.
    for (const k of z.angaben) {
      const angabe = Q('angaben.' + k), vor = (angabe.match(/^(Folien? [^:]+): /) || [])[1];
      if (!vor) continue;
      const kennung = z.kennung.find(kn => angabe.includes(kn)), treffer = kennung ? folienMit(kennung) : [], nrn = treffer.map(f => f.nr);
      const soll = nrn.length === 1 ? `Folie ${nrn[0]}` : nrn.length === 2 ? `Folien ${nrn[0]} und ${nrn[1]}` : `Folien ${bereiche(treffer.map(f => f.id), outline.folien)}`;
      if (!kennung || !nrn.length) P.melde(`Quellen: Die Angabe „${k}“ nennt „${vor}“, aber keine Kennung ihrer Zeile steht in ihrem Text (daten/rahmen.json, quellen.zeilen).`);
      else if (vor !== soll) P.melde(`Quellen: Die Angabe „${k}“ nennt „${vor}“; nach den Quellenzeilen des Konzepts ist es „${soll}“ (Kennung „${kennung}“). Text in daten/rahmen.json (quellen.angaben.${k}) und im Konzept nachführen.`);
    }
    const text = ctx.fuelle(z.angaben.map(k => Q('angaben.' + k)).join('; '), { version, stand }, 'daten/rahmen.json');
    const ids = outline.folien.filter(f => !rahmenfolien.has(f.layout) && z.kennung.some(k => String(f.quellen || '').includes(k))).map(f => f.id);
    if (!ids.length) P.melde(`Quellen: Keine Folie nennt „${z.kennung.join('“ oder „')}“; die Zeile „${text.slice(0, 60)}…“ stünde ohne Blattnummer.`);
    const folien = z.folien || bereiche(ids, outline.folien);
    ctx.wortlaut(text, 'Quellentabelle');
    if (!gross(ctx.o.inhalt).includes(gross(`„${folien}“ · „${text}“`))) P.hinweis(`Quellentabelle: Blattnummern „${folien}“ für „${text.slice(0, 50)}…“ weichen vom Konzept ab (gerechnet aus den Quellenzeilen der Folien).`);
    return { folien, text, ids };   // die Fundstelle „Nds. MBl. 2026 Nr. 319“ hält die Bibliothek zusammen (schutz)
  });
}

module.exports = { abschnitte, trenner, achsreihe, register, kostenFelder, liesKosten, bereiche, quellenZeilen };
