// Folie 4 · PGN_INHALT (Kopf über zwölf Spalten mit B.modulkopf, auf den Höhen der Diagrammfolien): Sollzins p. a. nach Zinsbindung als natives
// Liniendiagramm über die ganze Breite mit drei Reihen zu je 131 Monatswerten (01/2016 bis 11/2026),
// die Jahre als Textfelder an kurzen Jahresstrichen unter der Achse. Die Linien sind fein (1,5 pt) und im Ton gestuft: 10 Jahre in PGN-Rot mit einer weichen Fläche
// darunter (die Reihe, von der der Titel spricht), 20 Jahre in Referenzgrau, 30 Jahre in Tinte. Die Legende nennt nur die Zinsbindungen; ein Punkt
// markiert das Ende der Reihe „10 Jahre“. Zwei feine gestrichelte Marken tragen ihre Werte untereinander: das Mittel Q1 2020 (zinsen.marken) und
// der letzte Monat der Reihe (seit 12.11.2026 an der Stelle des Mittels Q4 2025, Wunsch des Auftraggebers).
// Eine Kennzahlenspalte gibt es seit 12.11.2026 nicht mehr (Wunsch des Auftraggebers): Der Titel nennt beide Werte (Sollzins im letzten Monat
// der Reihe und Mittel Q1 2020) und die Zinsbindung (10 Jahre); mit beiden Werten rechnet die Folie 5. Die Legende trägt die Zinsbindung.
// Zinsreihe aus daten/markt.json (Dr. Klein Wowi Finanz AG, an der Quelle gelesen am 12.11.2026), Zins des Bankdarlehens und Zinsbindung aus daten/werte.json.
'use strict';
const E = require('./_einstieg.cjs');
const FEIN = require('./_fein_ausgangslage-zinsen.cjs');

module.exports = {
  id: 'ausgangslage-zinsen',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, span, ZONE, P, mittel } = ctx, { monatKurz, monatWort } = fmt, s = ctx.folie(), U = E.lies(ctx), T = k => ctx.wortlaut(U('zinsen.texte.' + k), k);
    const monate = X('markt', 'zinsen.monate'), n = monate.length - 1, K = ['z10', 'z20', 'z30'];
    const reihen = [{ k: 'z10', art: 'akzent' }, { k: 'z20', art: 'referenz' }, { k: 'z30', art: 'tinte' }]
      .map(r => ({ ...r, name: ctx.wortlaut(X('markt', `zinsen.${r.k}.name`), 'Legende'), werte: X('markt', `zinsen.${r.k}`) }));
    const wert = v => ctx.wortlaut(fmt.prozentWert(v, 2), 'Wert');
    if (!monate[0].endsWith('-01')) throw new Error('Zinsreihe: Der erste Monat muss ein Januar sein, sonst trägt nicht jeder zwölfte Punkt die Jahreszahl.');

    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: span(12), titel: T('diagrammtitel'), sub: T('untertitel') });
    // Legende: nur die Zinsbindungen; die Werte des letzten Monats stehen am zweiten Werteblock
    FEIN.legendeMitWerten(ctx, s, { x: colX(1), y: ZONE.diagramm.legende, wMax: span(12), eintraege: reihen.map(r => ({ name: r.name, art: r.art })) });

    // Kategorien: Der Januar trägt die Jahreszahl. Die Jahre stehen als Textfelder unter der Achse (katLabels.formen), jedes an einem kurzen
    // Jahresstrich: Eine Beschriftung der Achse selbst dünnen die Programme nach der Breite der Plotfläche aus, und es stünden Monate statt der
    // Jahre da. Die Plotfläche reicht bis an den rechten Rand des Diagramms; der Rand unten legt die Achse wie auf den Folien 5 und 6 auf y 6,04.
    const kat = monate.map(m => (m.endsWith('-01') ? m.slice(0, 4) : monatKurz(m))), jahre = kat.filter(k => /^\d{4}$/.test(k));
    const d = D.linien(s, { x: colX(1), y: ZONE.diagramm.chart.y, w: span(12), h: ZONE.diagramm.chart.h, kategorien: kat, katLabels: { formen: jahre }, staerke: FEIN.STRICH, rand: { l: 0.52, r: 0.14, o: 0.20, u: 0.46 }, achse: { min: 0, max: 5, schritt: 1, format: 'roh' },
      name: 'Diagramm Sollzins nach Zinsbindung', altText: `Liniendiagramm: Sollzins p. a. für ${reihen.map(r => r.name).join(', ')} Zinsbindung, Monatswerte ${monatKurz(monate[0])} bis ${monatKurz(monate[n])}`,
      reihen: reihen.map(r => ({ name: r.name, werte: r.werte, art: r.art })), flaeche: { reihe: reihen[0].name, name: `${reihen[0].name}, Fläche`, deckung: 26 } });

    B.achsentitel(s, d, { y: ctx.wortlaut('Sollzins in % p. a.', 'Achsentitel') });
    FEIN.jahresstriche(ctx, s, d);
    B.achstexte(s, d);

    // Marken mit den Quartalsmitteln untereinander; die Mittel sind aus den Monatswerten nachgerechnet. Der Block der ersten Marke steht oben
    // über den Linien, der Block der zweiten unten darunter; je eine Gitterlinie läuft in der Fuge zwischen erster und zweiter Zeile.
    // Marke 1: Mittel Q1 2020 aus zinsen.marken. Marke 2: der letzte Monat der Reihe, mit seinen drei Werten
    const mittelMarken = X('markt', 'zinsen.marken'), letzter = { monat: monate[n], bezeichnung: monatWort(monate[n]), monate: [monate[n]], ...Object.fromEntries(reihen.map(r => [r.k, r.werte[n]])) };
    if (mittelMarken.length !== 1) P.melde(`zinsen.marken nennt ${mittelMarken.length} Marken; die Folie zeigt das Mittel Q1 2020 und dazu den letzten Monat der Reihe.`);
    const marken = [mittelMarken[0], letzter], lagen = [FEIN.blockOben(d.yWert(4), 1), FEIN.blockOben(d.yWert(1), 1)], LUFT = 0.05;
    if (marken.length !== lagen.length) P.melde(`Die Folie hat Platz für ${lagen.length} Marken (ein Werteblock über, einer unter den Linien); zinsen.marken nennt ${marken.length}.`);
    marken.slice(0, lagen.length).forEach((m, i) => {
      for (const r of reihen) ctx.gleich(`${m.bezeichnung}, ${r.name}`, mittel(monate, r.werte, m.monate), m[r.k]);
      const x = d.katMitte(monate.indexOf(m.monat));
      FEIN.feineMarke(ctx, s, { x, y: d.plot.y, h: d.plot.h, name: `Marke ${i + 1}` });
      const block = FEIN.werteblock(ctx, s, { xMarke: x, y: lagen[i], kopf: ctx.wortlaut(m.bezeichnung, 'Marke'), name: `Marke ${i + 1}`,
        eintraege: reihen.map(r => ({ name: r.name, wert: wert(m[r.k]), art: r.art })) });
      // Keine Linie läuft durch den Werteblock: In den Monaten unter dem Block bleibt jede Reihe mit etwas Luft unter dem ersten Block und über
      // dem zweiten. Eine neue Zinsreihe, die den Block schneidet, bricht den Bau ab
      const schneidet = reihen.filter(r => monate.some((_, k) => {
        const xk = d.katMitte(k), y = d.yWert(r.werte[k]);
        return xk >= block.x - LUFT && xk <= x && (i === 0 ? y < block.unten + LUFT : y > block.y - LUFT);
      }));
      if (schneidet.length) P.melde(`Marke „${m.bezeichnung}“: Die Reihe ${schneidet.map(r => `„${r.name}“`).join(', ')} läuft durch den Werteblock oder näher als ${fmt.zahl(LUFT, 2)} Zoll daran vorbei. Lage des Blocks ändern.`);
    });
    // Heutiger Stand: Punkt am Ende der Reihe „10 Jahre“
    FEIN.endpunkt(ctx, s, { cx: d.katMitte(n), cy: d.yWert(reihen[0].werte[n]), art: reihen[0].art, name: 'Linienende Punkt 10 Jahre' });

    // Der Zins des Bankdarlehens kommt aus der Mappe und ist der letzte Wert der Reihe „10 Jahre“. Der Titel nennt ihn, das Mittel Q1 2020 und die
    // Zinsbindung der Mappe (seit 13.11.2026: „Sollzins bei 10 Jahren Zinsbindung seit 2020 von 0,46 auf 3,86 % gestiegen“, F4.1)
    const zinsBank = W('modellhaus', 'eingabe.zins_bank'), bindung = W('modellhaus', 'eingabe.zinsbindung');
    ctx.gleich('Zins des Bankdarlehens (Mappe) gegen den letzten Monatswert der Reihe „10 Jahre“', zinsBank * 100, reihen[0].werte[n]);
    if (!ctx.glatt(ctx.o.titel).includes(`von ${fmt.dez(marken[0].z10)} auf ${fmt.dez(zinsBank * 100)} %`)) P.melde(`Titel der Folie nennt nicht „von ${fmt.dez(marken[0].z10)} auf ${fmt.dez(zinsBank * 100)} %“ (Mittel Q1 2020 und Wert des letzten Monats).`);
    if (!ctx.o.titel.includes(`${bindung} Jahren Zinsbindung`)) P.melde(`Titel der Folie nennt die Zinsbindung der Mappe (${bindung} Jahre) nicht.`);

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, zinsen.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'zinsen.quelle_kurz'), 'Quellenzeile'));
  },
};
