// Folie 27 · PGN_INHALT: Fazit des Vortrags, vier Gründe für geförderten Mietwohnungsbau. Seit 16.11.2026 (Wunsch der Geschäftsleitung: nur die
// vier Kernbotschaften, prägnanter) als vier Felder in zwei Reihen: großer Achskreis mit der Nummer, der Grund in Montserrat ExtraBold 24 pt und
// darunter eine Zeile mit der Zahl dahinter (14 pt). Felder auf Papierton, Oberlinie in Tinte. Jede Zahl steht vorher im Vortrag. Der Kopf heißt
// „Fazit“ und trägt kein Zeichen des Abschnitts (wie die Agenda). Weißer Grund wie Kapitel 4.
'use strict';
const { gruende, quelleMarkt } = require('./_modell.cjs');
const { breite } = require('../lib/passpruefung.cjs');

module.exports = {
  id: 'fazit',
  bau(ctx) {
    const { B, colX, span, Y, F, C, P } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const g = gruende(ctx);
    const s = ctx.folie({ ...ctx.titelzeilen(['Vier Gründe für geförderten', 'Mietwohnungsbau'], 'Vier Gründe'), kopfzeichen: false });
    B.quelle(s, quelleMarkt(ctx));
    const fuge = 0.24, w = +((span(12) - fuge) / 2).toFixed(3), h = +((Y.inhaltEnde - Y.inhalt - fuge) / 2).toFixed(3), kreis = 0.78, rand = 0.26;
    // Designtest 17.11.2026: die Zahl des Grundes groß links, daneben Titel (18 pt) und eine Zeile; die Nummernkreise entfallen
    const titelStil = { fontFace: F.xbold, fontSize: 18 }, zahlStil = { fontFace: F.xbold, fontSize: 40 }, ZW = 2.05;
    g.forEach((e, i) => {
      const x = +(colX(1) + (i % 2) * (w + fuge)).toFixed(3), y = +(Y.inhalt + Math.floor(i / 2) * (h + fuge)).toFixed(3);
      wl(e.titel, `Grund ${i + 1}`); wl(e.satz, `Grund ${i + 1}, Zeile`); wl(e.zahl, `Grund ${i + 1}, Zahl`);
      B.kasten(s, { x, y, w, h, farbe: ctx.HEX.papier, name: `Grund ${i + 1} Fläche` });
      B.linie(s, { x, y, w, art: 'modul', name: `Grund ${i + 1} Linie` });
      if (breite(ctx.schutz(e.zahl), zahlStil) > ZW) P.melde(`Fazit, Grund ${i + 1}: Die Zahl „${e.zahl}“ ist breiter als ${ZW} Zoll.`);
      s.addText(ctx.schutz(e.zahl), { x: +(x + rand).toFixed(3), y, w: ZW, h, margin: 0, isTextBox: true, fontFace: F.xbold, fontSize: 40, color: C.tinte, valign: 'middle', objectName: `Grund ${i + 1} Zahl` });
      const tx = +(x + rand + ZW + 0.20).toFixed(3), tw = +(x + w - rand - tx).toFixed(3);
      const zeilen = breite(ctx.schutz(e.titel), titelStil) > tw ? 2 : 1, th = zeilen * 0.31, block = th + 0.10 + 0.52, ty = +(y + (h - block) / 2).toFixed(3);
      if (breite(ctx.schutz(e.titel), titelStil) > 2 * tw * 0.92) P.melde(`Fazit, Grund ${i + 1}: Der Titel passt nicht in zwei Zeilen.`);
      s.addText(ctx.schutz(e.titel), { x: tx, y: ty, w: tw, h: th, margin: 0, isTextBox: true, fontFace: F.xbold, fontSize: 18, color: C.tinte, valign: 'middle', lineSpacingMultiple: 0.95, objectName: `Grund ${i + 1} Titel` });
      B.text(s, e.satz, { x: tx, y: +(ty + th + 0.10).toFixed(3), w: tw, h: 0.52, rolle: 'dicht', valign: 'top', name: `Text Grund ${i + 1}` });
    });
  },
};
