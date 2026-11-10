// Baugruppe „fluss“ (Folien 15 und 16): gemeinsame Anlage der beiden Flussdiagramme. Kein Folienmodul: Der Build lädt nur folien/<id>.cjs
// zu den IDs des Konzepts. Das Flussdiagramm selbst ist ein Baustein der Bibliothek (D.fluss in lib/diagramme.cjs).
//   zahlungsfluss(ctx, s, o)   legt eine der beiden Folien an: Modulkopf, Diagramm und Beschriftung. Maßstab, Lage der drei Knotenspalten,
//                              Oberkante, Zeilenabstand der Ziele und Farbrollen stehen hier einmal und gelten für beide Folien: Beim
//                              Blättern wechseln nur die Höhen.
//   betragUndAnteil, probe     Schreibweise an den Zielen („70.000 € · 61,3 %“) und Summenprobe
// Hier steht keine Zahl mit Aussage; Beträge kommen aus den Modulen (werte.json über W). Maßstab, Lagen und Maße sind Angaben der Zeichnung.
'use strict';
const { breite } = require('../lib/passpruefung.cjs');

// ---- Festlegungen für beide Folien ----------------------------------------------------------------------------------------------------------
const MASSSTAB = 160000;   // Euro je Zoll Höhe: 348.167 € sind 2,18 Zoll, 114.240 € sind 0,71 Zoll
// Farbrollen wie auf Folie 14: Tilgung in Tinte, Zins im Referenzgrau, Verwaltungskostenbeitrag hell, Bewirtschaftung blass (Töne der
// Bibliothek, FLUSSART in lib/theme.cjs). Kein Rot.
const ROLLEN = { tilgung: 'tinte', zins: 'referenz', beitrag: 'hell', bewirtschaftung: 'blass', ueberschuss: 'tinte', knoten: 'tinte' };
// Lagen in Zoll. Drei Knotenspalten (Quelle, Knoten, Ziele), rechts die Zeilen der Ziele mit Betrag und Anteil, ganz rechts die Klammer.
const LAGE = {
  oben: 3.24,            // Oberkante von Quelle, Knoten und erstem Ziel
  quelle: 3.07, knoten: 5.235, ziele: 7.40, knotenBreite: 0.12,
  name: 7.60,            // Beginn der Bezeichnungen der Ziele
  betrag: 11.36,         // rechte Kante von Betrag und Anteil
  klammer: 11.46, klammerText: 11.54,
  zeile: 0.22, abstand: 0.07,   // Höhe einer Zielzeile (12 pt) und Abstand zwischen zwei Zielen
  betragTiefer: 0.006,   // die Zeile aus Bezeichnung und Betrag steht um dieses Maß tiefer als ihre Mitte: Die Bezeichnung rückt um das Doppelte nach oben (B.bezeichnungMitWert)
};
const art = rolle => ROLLEN[rolle] || (() => { throw new Error(`zahlungsfluss: Farbrolle „${rolle}“ gibt es nicht: ${Object.keys(ROLLEN).join(', ')}`); })();

// Betrag und Anteil am Bezug, wie sie an den Zielen stehen: „70.000 € · 61,3 %“; ein Strom mit 0 € heißt „0 €“
function betragUndAnteil(fmt, wert, bezug) {
  return fmt.zahl(wert) === '0' ? fmt.euro(0) : `${fmt.euro(wert)} · ${fmt.prozent(wert / bezug, 1)}`;
}

// ---- Teil 2: Zahlungsfluss in Jahr 1 (Folien 15 und 16) -------------------------------------------------------------------------------------
// o: { art: 'gefördert' | 'frei finanziert', titel, sub (Modulkopf),
//      quelle: { name, wert, zusatz },                          Sollmiete links
//      marke:  { wert, text } (nur Folie 16)                     Maßlinie an der Quelle auf der Höhe dieses Betrags
//      knoten: { name, wert },                                   Überschuss vor Kapitaldienst
//      ziele:  [{ id, name, wert, rolle, ueberKnoten }]          von oben; ueberKnoten: Der Strom läuft über den Knoten in der Mitte
//      klammer: { name, wert, ziele: [id, …] },                  fasst Ziele zum Kapitaldienst
//      hervor: id }                                               Ziel, dessen Anteil der Folientitel nennt: Der Anteil steht als Kernwert im Band
// Rückgabe: Rückgabe von D.fluss, dazu { ziele (mit Lage der Zeilen), unten }
function zahlungsfluss(ctx, s, o) {
  const { B, fmt, colX, Y, Raster, F } = ctx, L = LAGE, zoll = v => v / MASSSTAB, wl = (t, was) => ctx.wortlaut(t, was);
  const semi = { fontFace: F.semi, fontSize: 12 }, fett = { fontFace: F.mont, bold: true, fontSize: 12 }, nb = t => ctx.schutz(t);
  B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: Raster.CW, titel: wl(o.titel, 'Modultitel'), sub: wl(o.sub, 'Untertitel') });

  // Zeilen der Ziele: das erste Ziel an der Oberkante, die übrigen mit festem Abstand darunter; jedes Band steht mittig in seiner Zeile
  let y = L.oben;
  const ziele = o.ziele.map((z, i) => {
    const h = zoll(z.wert), zeile = Math.max(h, L.zeile), r = { ...z, h, zeileOben: y, zeileUnten: y + zeile, y: i === 0 ? y : y + (zeile - h) / 2, mitte: i === 0 ? y + Math.max(h, L.zeile) / 2 : y + zeile / 2 };
    y += zeile + L.abstand;
    return r;
  });
  const unten = y - L.abstand;

  // Knoten und Ströme. Die Ströme über den Knoten tragen schon von der Quelle an die Farbe ihres Ziels: So ist an der Quelle abzulesen,
  // welcher Teil der Miete wohin fließt. Reihenfolge an der Quelle wie rechts die Ziele.
  const ueber = ziele.filter(z => z.ueberKnoten), direkt = ziele.filter(z => !z.ueberKnoten);
  // Alternativtext des Diagramms: jeder Strom mit Betrag und Anteil, in der Reihenfolge der Zeichnung
  const mitAnteil = z => (fmt.zahl(z.wert) === '0' ? `${z.name} ${fmt.euro(0)}` : `${z.name} ${fmt.euro(z.wert)} (${fmt.prozent(z.wert / o.quelle.wert, 1)})`);
  const altText = [`Flussdiagramm: ${o.titel}, in € p. a. und in % der Sollmiete.`, `${o.quelle.name} ${fmt.euro(o.quelle.wert)} (${o.quelle.zusatz}).`,
    `Davon ${o.knoten.name} ${fmt.euro(o.knoten.wert)}: ${ueber.map(mitAnteil).join(', ')}.`, `Vorher gehen ab: ${direkt.map(mitAnteil).join(', ')}.`,
    o.klammer ? `${o.klammer.name} ${fmt.euro(o.klammer.wert)}.` : '', o.marke ? `${o.marke.text.join(' ')}.` : '',
    'Die Stärke der Bänder entspricht dem Betrag. Die Flussdiagramme für gefördert und frei finanziert haben denselben Maßstab.'].filter(Boolean).join(' ');
  const d = ctx.D.fluss(s, { name: `Flussdiagramm Zahlungsfluss ${o.art}`, altText, massstab: MASSSTAB, knotenBreite: L.knotenBreite,
    knoten: [{ id: 'quelle', x: L.quelle, y: L.oben, name: o.quelle.name, art: art('knoten'), wert: o.quelle.wert }, { id: 'knoten', x: L.knoten, y: L.oben, name: o.knoten.name, art: art('knoten'), wert: o.knoten.wert },
      ...ziele.map(z => ({ id: z.id, x: L.ziele, y: z.y, name: z.name, art: art(z.rolle) }))],
    stroeme: [...ueber.map(z => ({ von: 'quelle', nach: 'knoten', wert: z.wert, art: art(z.rolle), name: `${z.name} bis ${o.knoten.name}` })),
      ...direkt.map(z => ({ von: 'quelle', nach: z.id, wert: z.wert, art: art(z.rolle), name: z.name })),
      ...ueber.map(z => ({ von: 'knoten', nach: z.id, wert: z.wert, art: art(z.rolle), name: z.name }))] });

  // ---- Beschriftung in Leserichtung: Quelle, Marke, Knoten, Ziele, Klammer ----------------------------------------------------------------
  // Quelle: Bezeichnung, Betrag als Kernwert, Zusatz; rechtsbündig vor dem Balken. Mit Marke steht der Block unter der Maßlinie.
  const lx = colX(1), lw = L.quelle - 0.14 - lx;
  let qy = L.oben - 0.01;
  if (o.marke) {
    const my = L.oben + zoll(o.marke.wert), [zeile1, zeile2] = o.marke.text;
    wl(`${zeile1} ${zeile2}`, 'Marke an der Quelle');
    B.text(s, zeile1, { x: lx, y: my - 0.47, w: lw, h: 0.21, rolle: 'kleinText', align: 'right', valign: 'middle', einzeilig: true, name: 'Marke Höchstmiete Bezeichnung' });
    B.text(s, zeile2, { x: lx, y: my - 0.26, w: lw, h: 0.21, rolle: 'wert', align: 'right', valign: 'middle', einzeilig: true, name: 'Marke Höchstmiete Betrag' });
    B.linie(s, { x: lx, y: my, w: L.quelle - 0.03 - lx, art: 'mass', name: 'Maßlinie Höchstmiete' });
    // Fuge im Balken der Quelle auf derselben Höhe: Der Teil darüber ist die Sollmiete zur Höchstmiete
    B.linie(s, { x: L.quelle, y: my, w: L.knotenBreite, farbe: ctx.grund === 'papier' ? ctx.C.papier : ctx.farben.fuge, pt: 1.5, name: 'Fuge Höchstmiete' });
    qy = my + 0.10;
  }
  B.text(s, wl(o.quelle.name, 'Quelle'), { x: lx, y: qy, w: lw, h: 0.21, rolle: 'bezeichnung', align: 'right', valign: 'middle', einzeilig: true, name: 'Quelle Bezeichnung' });
  B.text(s, wl(fmt.euro(o.quelle.wert), 'Quelle'), { x: lx, y: qy + 0.21, w: lw, h: 0.37, rolle: 'kernwert', align: 'right', valign: 'middle', einzeilig: true, name: 'Quelle Betrag' });
  B.text(s, wl(o.quelle.zusatz, 'Quelle'), { x: lx, y: qy + 0.58, w: lw, h: 0.21, rolle: 'klein', align: 'right', valign: 'middle', einzeilig: true, name: 'Quelle Zusatz' });

  // Knoten: Bezeichnung und Betrag in einer Zeile, mittig über dem Balken
  const kn = wl(o.knoten.name, 'Knoten'), kw = wl(fmt.euro(o.knoten.wert), 'Knoten'), bn = breite(nb(kn), semi) + 0.03, bw = breite(nb(kw), fett) + 0.03, steg = 0.10;
  const kx = L.knoten + L.knotenBreite / 2 - (bn + steg + bw) / 2, ky = L.oben - 0.30;
  B.bezeichnungMitWert(s, { y: ky + L.betragTiefer, bezeichnung: { text: kn, x: kx, w: bn, name: 'Knoten Bezeichnung' }, wert: { text: kw, x: kx + bn + steg, w: bw, name: 'Knoten Betrag' } });

  // Anteil des Ziels aus dem Folientitel: als Kernwert weiß im Band, rechtsbündig vor dem Balken des Ziels (wie die Werte in den Balken der Folie 17)
  if (o.hervor) {
    const z = ziele.find(k => k.id === o.hervor);
    if (!z || !z.ueberKnoten) throw new Error(`zahlungsfluss: hervor „${o.hervor}“ ist kein Ziel hinter dem Knoten.`);
    if (z.h < 0.40) ctx.P.melde(`Anteil im Band „${z.name}“: Das Band ist ${z.h.toFixed(2)} Zoll hoch, der Kernwert braucht 0,40 Zoll.`);
    const x0 = L.knoten + L.knotenBreite + 0.12, x1 = L.ziele - 0.14;
    B.text(s, wl(fmt.prozent(z.wert / o.quelle.wert, 1), 'Anteil im Band'), { x: x0, y: z.y + z.h / 2 - 0.18, w: x1 - x0, h: 0.36, rolle: 'kernwert', farbe: 'FFFFFF', align: 'right', valign: 'middle', einzeilig: true, name: `Anteil im Band ${z.name}` });
  }

  // Ziele: Bezeichnung am Balken, Betrag und Anteil rechtsbündig in einer Spalte. Ziele mit 0 € stehen als Zeile ohne Band in Grau.
  for (const z of ziele) {
    const null0 = fmt.zahl(z.wert) === '0', wert = wl(betragUndAnteil(fmt, z.wert, o.quelle.wert), `Ziel ${z.name}`), ty = z.mitte - L.zeile / 2;
    const bn = breite(nb(z.name), semi) + 0.03, bw = breite(nb(wert), fett) + 0.03;
    // Bezeichnung und Betrag stehen in einer Zeile: zusammen nicht breiter als die Spalte
    if (bn + 0.10 + bw > L.betrag - L.name) ctx.P.melde(`Ziel „${z.name}“: Bezeichnung und Betrag passen nicht nebeneinander in ${(L.betrag - L.name).toFixed(2)} Zoll.`);
    if (null0) B.linie(s, { x: L.ziele, y: z.mitte, w: L.knotenBreite, art: 'grau', pt: 0.75, name: `Leerer Knoten ${z.name}` });
    B.bezeichnungMitWert(s, { y: ty + L.betragTiefer, h: L.zeile, grau: null0, bezeichnung: { text: wl(z.name, 'Ziel'), x: L.name, w: bn, name: `Ziel ${z.name}` },
      wert: { text: wert, x: L.betrag - bw, w: bw, align: 'right', name: `Betrag ${z.name}` } });
  }

  // Klammer: senkrechte Maßlinie mit kurzen Querstrichen über die Zeilen der genannten Ziele, rechts daneben Bezeichnung und Betrag
  if (o.klammer) {
    const teil = ziele.filter(z => o.klammer.ziele.includes(z.id));
    if (teil.length !== o.klammer.ziele.length) throw new Error('zahlungsfluss: Die Klammer nennt ein Ziel, das es nicht gibt.');
    const y0 = Math.min(...teil.map(z => z.zeileOben)), y1 = Math.max(...teil.map(z => z.zeileUnten)), mitte = (y0 + y1) / 2, tw = Raster.X1 - L.klammerText;
    B.linie(s, { x: L.klammer, y: y0, h: y1 - y0, art: 'mass', name: 'Maßlinie ' + o.klammer.name });
    for (const [i, yy] of [y0, y1].entries()) B.linie(s, { x: L.klammer - 0.07, y: yy, w: 0.07, art: 'mass', name: `Maßlinie ${o.klammer.name} Querstrich ${i + 1}` });
    B.text(s, wl(o.klammer.name, 'Klammer'), { x: L.klammerText, y: mitte - 0.21, w: tw, h: 0.21, rolle: 'bezeichnung', valign: 'middle', einzeilig: true, name: `Klammer ${o.klammer.name} Bezeichnung` });
    B.text(s, wl(fmt.euro(o.klammer.wert), 'Klammer'), { x: L.klammerText, y: mitte, w: tw, h: 0.21, rolle: 'wert', valign: 'middle', einzeilig: true, name: `Klammer ${o.klammer.name} Betrag` });
  }
  return { ...d, ziele, unten };
}

// Summenprobe einer Folie: Abweichung bricht den Bau ab (ctx.gleich meldet auf zwei Nachkommastellen)
function probe(ctx, was, summe, soll) { ctx.gleich(was, summe, soll, 2); }

module.exports = { MASSSTAB, ROLLEN, LAGE, zahlungsfluss, betragUndAnteil, probe };
