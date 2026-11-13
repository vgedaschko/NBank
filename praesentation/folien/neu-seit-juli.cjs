// Folie 9 · PGN_INHALT: Programmteil 2.1 im Vergleich, Förderkonditionen bis 30.06.2026 gegen die RL Mietwohnraum 2026 seit 01.07.2026.
// Seit der Änderungsrunde vom 13.11.2026 (F9.1, Rückfrage 6) eine native Tabelle über zwölf Spalten mit den Spalten Merkmal, Bis 30.06.2026,
// Seit 01.07.2026 und Wirkung und fünf Zeilen (Förderquote, nicht rückzahlbarer Teil, Eigenmittel, Bemessungsgrenze, Höchstmiete). Bis dahin
// standen die Werte im Layout PGN_VERGLEICH mit dem Wertepaar „75 % Darlehen“ → „80 % Förderung“.
// Werte bis 30.06.2026 aus daten/regeln.json (NBank-Produktinformation, Stand 01.04.2026), Werte seit 01.07.2026 aus werte.json (tab.*).
// Die Wirkung ist aus beiden gerechnet und gegengeprüft; der Wortlaut jeder Zelle steht im Konzept.
'use strict';
module.exports = {
  id: 'neu-seit-juli',
  bau(ctx) {
    const { B, W, X, fmt, colX, Y, Raster, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');   // erste Folie des Abschnitts „Programmteil 2.1“: Daumenregister wie auf den Folien 10 bis 12
    const T = k => W('modellhaus', 'tab.' + k), R = k => X('regeln', k), A = k => R('bis_2026_06_30.' + k);
    const pct = v => fmt.prozent(v), paar = (a, b, nk = 0) => `${fmt.zahl(a, nk)} / ${fmt.zahl(b, nk)} €`;   // Wertepaar Mietenstufe I–III / IV–VII
    const G = ['A', 'B', 'C'], quote = T('quote_darlehen.A') + T('quote_zuschuss.A'), pp = v => fmt.zahl(Math.abs(v) * 100);

    // ---- Gegenproben der Wirkung --------------------------------------------------------------------------------------------------
    if (G.some(g => Math.abs(T(`quote_darlehen.${g}`) + T(`quote_zuschuss.${g}`) - quote) > 1e-9)) P.melde('Darlehen und Zuschuss ergeben nicht in allen Gruppen dieselbe Förderquote.');
    const nachlassAlt = A('tilgungsnachlass') * A('darlehen_anteil');          // nicht rückzahlbar bis 30.06.2026, in Teilen der Gesamtkosten (22,5 %)
    if (!(T('quote_zuschuss.A') > nachlassAlt)) P.melde('Der Zuschuss in A liegt nicht über dem früheren Tilgungsnachlass.');
    const geldNeu = T('eigenmittel_mindestens') * R('eigenmittel_neu.geld_anteil');
    ctx.gleich('Geld oder Grundstück: Anteil seit 01.07.2026 gegen bis 30.06.2026 („weiter mindestens“)', geldNeu, A('eigenmittel_geld'), 6);
    const mieteAlt = ['I', 'IV'].map(st => A('hoechstmiete_geringe_einkommen.' + st)), mieteNeu = ['I', 'IV'].map(st => T(`hoechstmiete.${st}.A`));
    ctx.gleich('Höchstmiete: Anstieg in Mietenstufe I–III gegen IV–VII', mieteNeu[0] - mieteAlt[0], mieteNeu[1] - mieteAlt[1], 6);
    // Titel: bis zu 40 % Zuschuss (Gruppe A) und der Stichtag
    if (!ctx.glatt(ctx.o.titel).includes(`bis zu ${ctx.glatt(pct(T('quote_zuschuss.A')))}`) || !ctx.o.titel.includes(R('stichtage.neu_seit'))) P.melde('Titel der Folie nennt den Zuschuss in A oder den Stichtag nicht.');

    // ---- Kopf und Tabelle ---------------------------------------------------------------------------------------------------------
    const jahre = `Jahr 1 bis ${T('jahre_ohne_mieterhoehung')}`, stufen = 'Mietenstufe I–III / IV–VII';
    const zeilen = [
      ['Förderquote', `Darlehen bis ${pct(A('darlehen_anteil'))} der Gesamtkosten`, `Darlehen und Zuschuss bis ${pct(quote)} der zuwendungsfähigen Kosten`, `+${pp(quote - A('darlehen_anteil'))} Prozentpunkte`],
      ['Nicht rückzahlbar', `Tilgungsnachlass ${pct(A('tilgungsnachlass'))} des Darlehens, nur bei geringen Einkommen`,
        `Zuschuss bis ${G.map(g => `${pct(T('quote_zuschuss.' + g))} (${g})`).join(', ')} der Kosten`,
        `A: von ${fmt.zahl(nachlassAlt * 100, 1)} auf ${pct(T('quote_zuschuss.A'))} der Kosten. B und C: neu`],
      ['Eigenmittel', `${pct(A('eigenmittel'))} der Gesamtkosten`, `${pct(T('eigenmittel_mindestens'))} der zuwendungsfähigen Kosten`,
        `${fmt.MINUS}${pp(T('eigenmittel_mindestens') - A('eigenmittel'))} Prozentpunkte. Geld oder Grundstück weiter mindestens ${pct(A('eigenmittel_geld'))}`],
      [`Bemessungsgrenze je m², ${stufen}`, `${paar(A('bemessung.I'), A('bemessung.IV'))}, Gesamtkosten mit Grundstück`,
        `${paar(T('bemessungsgrenze.I'), T('bemessungsgrenze.IV'))} (Stand ${R('bemessungsgrenze.gilt_seit')}), nur Herstellungskosten. Grundstück zusätzlich bis zum Bodenrichtwert`,
        'Das Grundstück zählt nicht mehr auf die Grenze'],
      [`Höchstmiete ${jahre} je m², ${stufen}`, `${paar(mieteAlt[0], mieteAlt[1], 2)} (geringe Einkommen)`, `${paar(mieteNeu[0], mieteNeu[1], 2)} (Gruppe A)`, `+${fmt.euroDez(mieteNeu[0] - mieteAlt[0])}`]];
    if (A('eigenmittel') - T('eigenmittel_mindestens') <= 0 || quote - A('darlehen_anteil') <= 0) P.melde('Die Vorzeichen der Wirkung (Förderquote, Eigenmittel) stimmen nicht mehr.');
    const koepfe = ['Merkmal', `Bis ${R('stichtage.alt_bis')}`, `Seit ${R('stichtage.neu_seit')}`, 'Wirkung'];
    wl(`Spalten: ${koepfe.map(k => `„${k}“`).join(' · ')}`, 'Spaltenköpfe');
    zeilen.forEach((z, i) => wl(z.map(t => `„${t}“`).join(' · '), `Zeile ${i + 1}`));

    // Satz: „I–III / IV–VII“ steht in einer Zeile (die Merkmale brechen vor „Mietenstufe“), die Gruppe bleibt an ihrem Satz („40 % (A)“), „B und C“ zusammen
    const NB = fmt.NBSP, satz = t => t.replace(/ \/ /g, `${NB}/${NB}`).replace(/ \(([ABC])\)/g, `${NB}($1)`).replace('B und C: neu', `B${NB}und${NB}C:${NB}neu`);
    const x = colX(1), w = Raster.CW;
    const yTab = B.modulkopf(s, { x, y: Y.inhalt, w, titel: wl('Programmteil 2.1 im Vergleich', 'Tabellentitel') });
    // Spaltenbreiten in Zoll (zusammen 12,00), so gewählt, dass die fünf Zeilen mit den wenigsten Textzeilen auskommen (2, 2, 2, 3, 3).
    // 12 pt wie die Tabellen der Folien 15 und A1: In 14 pt bräuchte die Tabelle 4,3 Zoll, die Inhaltszone hat unter dem Modulkopf 3,9.
    // Die Zeilen teilen sich die Höhe bis zur Unterkante der Inhaltszone (zielHoehe)
    const BREITEN = [2.75, 2.85, 3.30, 3.10];
    const tab = B.tabelle(s, { x, y: yTab, w, pt: 12, zielHoehe: +(Y.inhaltEnde - yTab).toFixed(3), name: 'Tabelle Programmteil 2.1 im Vergleich',
      spalten: koepfe.map((k, i) => ({ kopf: k, breite: BREITEN[i], art: 'text', ...(i === koepfe.length - 1 ? { randRechts: 0.02 } : {}) })),
      zeilen: zeilen.map(z => [satz(z[0]).replace(', Mietenstufe', ',\nMietenstufe').split('\n').map(l => `**${l}**`).join('\n'), ...z.slice(1).map(satz)]) });
    if (tab.unten > Y.inhaltEnde + 0.005) P.melde(`Tabelle endet bei y ${tab.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
  },
};
