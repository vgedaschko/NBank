// Folie 4 · PGN_DIAGRAMM: Sollzins p. a. nach Zinsbindung als natives Liniendiagramm mit drei Reihen zu je 127 Monatswerten (01/2016 bis 07/2026),
// Jahresbeschriftung an jedem zwölften Punkt, zwei senkrechte Marken mit den Quartalsmitteln, Endwerte an den Linienenden. Rechts wie auf den
// Folien 3, 5 und 6 die Hauptzahl (Sollzins im letzten Monat der Reihe, 10 Jahre Zinsbindung) und darunter der Wert für Q1 2020; mit beiden
// rechnet die Folie 5, und beide nennt der Titel.
// Zinsreihe aus daten/markt.json (Altfassung Folie 24, nicht nachgeprüft), Zins des Bankdarlehens und Zinsbindung aus daten/werte.json.
// Kein Rot im Diagramm: 10 Jahre in Tinte, 20 Jahre in Tinte gestrichelt, 30 Jahre in Referenzgrau.
'use strict';
const E = require('./_einstieg.cjs');

module.exports = {
  id: 'ausgangslage-zinsen',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, ZONE, P, mittel } = ctx, { monatKurz, monatWort } = fmt, s = ctx.folie(), U = E.lies(ctx), T = k => ctx.wortlaut(U('zinsen.texte.' + k), k);
    const monate = X('markt', 'zinsen.monate'), n = monate.length - 1, K = ['z10', 'z20', 'z30'];
    const reihen = [{ k: 'z10', art: 'tinte', strich: 'solid' }, { k: 'z20', art: 'tinte', strich: 'dash' }, { k: 'z30', art: 'referenz', strich: 'solid' }]
      .map(r => ({ ...r, name: ctx.wortlaut(X('markt', `zinsen.${r.k}.name`), 'Legende'), werte: X('markt', `zinsen.${r.k}`) }));
    if (!monate[0].endsWith('-01')) throw new Error('Zinsreihe: Der erste Monat muss ein Januar sein, sonst trägt nicht jeder zwölfte Punkt die Jahreszahl.');

    B.diagrammkopf(s, { titel: T('diagrammtitel'), sub: T('untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: reihen.map(r => ({ text: r.name, art: r.art, strich: r.strich })) });

    // Kategorien: Der Januar trägt die Jahreszahl; die Achse beschriftet jeden zwölften Punkt
    const kat = monate.map(m => (m.endsWith('-01') ? m.slice(0, 4) : monatKurz(m)));
    const d = D.linien(s, { kategorien: kat, katLabels: { jede: 12 }, rand: { r: 0.85 }, achse: { min: 0, max: 5, schritt: 1, format: 'roh' },
      name: 'Diagramm Sollzins nach Zinsbindung', altText: `Liniendiagramm: Sollzins p. a. für ${reihen.map(r => r.name).join(', ')} Zinsbindung, Monatswerte ${monatKurz(monate[0])} bis ${monatKurz(monate[n])}`,
      reihen: reihen.map(r => ({ name: r.name, werte: r.werte, art: r.art, strich: r.strich })) });

    // Endwerte an den Linienenden, darüber der Monat; die Lagen sind auf Zeilenabstand entzerrt
    const enden = B.entzerre(reihen.map(r => d.yWert(r.werte[n])), 0.21), xEnde = d.katMitte(n) + 0.09;
    reihen.forEach((r, i) => B.text(s, ctx.wortlaut(fmt.prozentWert(r.werte[n], 2), 'Endwert'), { x: xEnde, y: enden[i] - 0.11, w: 0.74, h: 0.22, rolle: 'wert', farbe: r.art === 'referenz' ? 'sekundaer' : 'titel', valign: 'middle', einzeilig: true, name: `Endwert ${r.name}` }));
    B.text(s, ctx.wortlaut(monatWort(monate[n]), 'Bezeichnung der Endwerte'), { x: xEnde, y: Math.min(...enden) - 0.11 - 0.20, w: 0.74, h: 0.18, rolle: 'label', valign: 'middle', einzeilig: true, name: 'Endwerte Monat' });

    // Marken mit den Quartalsmitteln; die Mittel sind aus den Monatswerten nachgerechnet
    const marken = X('markt', 'zinsen.marken');
    for (const m of marken) {
      for (const r of reihen) ctx.gleich(`${m.bezeichnung}, ${r.name}`, mittel(monate, r.werte, m.monate), m[r.k]);
      const text = ctx.wortlaut(U('zinsen.texte.marke', { bezeichnung: m.bezeichnung, ...Object.fromEntries(K.map(k => [k, fmt.dez(m[k])])) }), 'Marke');
      B.marke(s, { x: d.katMitte(monate.indexOf(m.monat)), y: d.plot.y, h: d.plot.h, art: 'mass', text, textSeite: 'links', textBreite: 2.6 });
    }

    // Rechte Spalte. Der Zins des Bankdarlehens kommt aus der Mappe und ist der letzte Wert der Reihe „10 Jahre“.
    const zinsBank = W('modellhaus', 'eingabe.zins_bank');
    ctx.gleich('Zins des Bankdarlehens (Mappe) gegen den letzten Monatswert der Reihe „10 Jahre“', zinsBank * 100, reihen[0].werte[n]);
    // Der Titel nennt die beiden Kennzahlen; der Satz der Broschüre („Ende 2025 drei bis vier Prozent“) steht in den Notizen
    const hauptzahl = fmt.dez(zinsBank * 100), zweite = fmt.dez(marken[0].z10);
    for (const v of [hauptzahl, zweite]) if (!ctx.o.titel.includes(`${v} %`)) P.melde(`Titel der Folie nennt ${v} % nicht; Hauptzahl und zweite Kennzahl stehen dann nicht im Titel.`);
    const ende2025 = marken[1];
    if (/drei bis vier Prozent/.test(ctx.o.notizen) && K.some(k => ende2025[k] < 3 || ende2025[k] > 4)) P.melde('Notizen „Ende 2025 drei bis vier Prozent“: Ein Quartalsmittel Q4 2025 liegt außerhalb von 3 bis 4 %.');
    B.hauptzahl(s, { gross: true, vorsatz: ctx.wortlaut(monatWort(monate[n]), 'Vorsatz'), zahl: ctx.wortlaut(hauptzahl, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });
    B.nebenzahl(s, { vorsatz: ctx.wortlaut(marken[0].bezeichnung, 'Vorsatz'), zahl: ctx.wortlaut(zweite, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });
  },
};
