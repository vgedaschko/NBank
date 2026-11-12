// Folie 4 · PGN_DIAGRAMM: Sollzins p. a. nach Zinsbindung als natives Liniendiagramm mit drei Reihen zu je 127 Monatswerten (01/2016 bis 07/2026),
// die Jahre als Textfelder an kurzen Jahresstrichen unter der Achse. Die Linien sind fein (1,5 pt) und im Ton gestuft: 10 Jahre in PGN-Rot mit einer weichen Fläche
// darunter (die Reihe, von der Titel und Hauptzahl sprechen), 20 Jahre in Referenzgrau, 30 Jahre in Tinte. Die Legende trägt die Werte des letzten
// Monats; ein Punkt markiert das Ende der Reihe „10 Jahre“. Zwei feine gestrichelte Marken tragen die Quartalsmittel untereinander.
// Rechts wie auf den Folien 3, 5 und 6 die Hauptzahl (Sollzins im letzten Monat der Reihe, 10 Jahre Zinsbindung) und darunter der Wert für
// Q1 2020; mit beiden rechnet die Folie 5, und beide nennt der Titel.
// Zinsreihe aus daten/markt.json (Altfassung Folie 24, nicht nachgeprüft), Zins des Bankdarlehens und Zinsbindung aus daten/werte.json.
'use strict';
const E = require('./_einstieg.cjs');
const FEIN = require('./_fein_ausgangslage-zinsen.cjs');

module.exports = {
  id: 'ausgangslage-zinsen',
  bau(ctx) {
    const { B, D, X, W, fmt, colX, ZONE, P, mittel } = ctx, { monatKurz, monatWort } = fmt, s = ctx.folie(), U = E.lies(ctx), T = k => ctx.wortlaut(U('zinsen.texte.' + k), k);
    const monate = X('markt', 'zinsen.monate'), n = monate.length - 1, K = ['z10', 'z20', 'z30'];
    const reihen = [{ k: 'z10', art: 'akzent' }, { k: 'z20', art: 'referenz' }, { k: 'z30', art: 'tinte' }]
      .map(r => ({ ...r, name: ctx.wortlaut(X('markt', `zinsen.${r.k}.name`), 'Legende'), werte: X('markt', `zinsen.${r.k}`) }));
    const wert = v => ctx.wortlaut(fmt.prozentWert(v, 2), 'Wert');
    if (!monate[0].endsWith('-01')) throw new Error('Zinsreihe: Der erste Monat muss ein Januar sein, sonst trägt nicht jeder zwölfte Punkt die Jahreszahl.');

    B.diagrammkopf(s, { titel: T('diagrammtitel'), sub: T('untertitel') });
    // Legende mit den Werten des letzten Monats
    FEIN.legendeMitWerten(ctx, s, { x: colX(1), y: ZONE.diagramm.legende, kopf: ctx.wortlaut(monatWort(monate[n]), 'Bezeichnung der Legende'),
      eintraege: reihen.map(r => ({ name: r.name, wert: wert(r.werte[n]), art: r.art })) });

    // Kategorien: Der Januar trägt die Jahreszahl. Die Jahre stehen als Textfelder unter der Achse (katLabels.formen), jedes an einem kurzen
    // Jahresstrich: Eine Beschriftung der Achse selbst dünnen die Programme nach der Breite der Plotfläche aus, und es stünden Monate statt der
    // Jahre da. Die Plotfläche reicht bis an den rechten Rand des Diagramms; der Rand unten legt die Achse wie auf den Folien 5 und 6 auf y 6,04.
    const kat = monate.map(m => (m.endsWith('-01') ? m.slice(0, 4) : monatKurz(m))), jahre = kat.filter(k => /^\d{4}$/.test(k));
    const d = D.linien(s, { kategorien: kat, katLabels: { formen: jahre }, staerke: FEIN.STRICH, rand: { l: 0.52, r: 0.14, o: 0.20, u: 0.46 }, achse: { min: 0, max: 5, schritt: 1, format: 'roh' },
      name: 'Diagramm Sollzins nach Zinsbindung', altText: `Liniendiagramm: Sollzins p. a. für ${reihen.map(r => r.name).join(', ')} Zinsbindung, Monatswerte ${monatKurz(monate[0])} bis ${monatKurz(monate[n])}`,
      reihen: reihen.map(r => ({ name: r.name, werte: r.werte, art: r.art })), flaeche: { reihe: reihen[0].name, name: `${reihen[0].name}, Fläche`, deckung: 26 } });

    B.achsentitel(s, d, { y: ctx.wortlaut('Sollzins in % p. a.', 'Achsentitel') });
    FEIN.jahresstriche(ctx, s, d);
    B.achstexte(s, d);

    // Marken mit den Quartalsmitteln untereinander; die Mittel sind aus den Monatswerten nachgerechnet. Der Block der ersten Marke steht oben
    // über den Linien, der Block der zweiten unten darunter; je eine Gitterlinie läuft in der Fuge zwischen erster und zweiter Zeile.
    const marken = X('markt', 'zinsen.marken'), lagen = [FEIN.blockOben(d.yWert(4), 1), FEIN.blockOben(d.yWert(1), 1)], LUFT = 0.05;
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

    // Rechte Spalte. Der Zins des Bankdarlehens kommt aus der Mappe und ist der letzte Wert der Reihe „10 Jahre“.
    const zinsBank = W('modellhaus', 'eingabe.zins_bank');
    ctx.gleich('Zins des Bankdarlehens (Mappe) gegen den letzten Monatswert der Reihe „10 Jahre“', zinsBank * 100, reihen[0].werte[n]);
    // Der Titel nennt die beiden Kennzahlen
    const hauptzahl = fmt.dez(zinsBank * 100), zweite = fmt.dez(marken[0].z10);
    for (const v of [hauptzahl, zweite]) if (!ctx.o.titel.includes(`${v} %`)) P.melde(`Titel der Folie nennt ${v} % nicht; Hauptzahl und zweite Kennzahl stehen dann nicht im Titel.`);
    B.hauptzahl(s, { gross: true, vorsatz: ctx.wortlaut(monatWort(monate[n]), 'Vorsatz'), zahl: ctx.wortlaut(hauptzahl, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });
    B.nebenzahl(s, { vorsatz: ctx.wortlaut(marken[0].bezeichnung, 'Vorsatz'), zahl: ctx.wortlaut(zweite, 'Kennzahl'), einheit: '%', label: T('kennzahl_label') });

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/markt.json, zinsen.quelle_kurz); die volle Angabe steht auf der Quellenfolie im Anhang ----
    B.quelle(s, ctx.wortlaut(X('markt', 'zinsen.quelle_kurz'), 'Quellenzeile'));
  },
};
