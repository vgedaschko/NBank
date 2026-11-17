// Baugruppe „vergleich“ (Folie 9 und Anhang): Programmteil 2.1 im Vergleich, Förderkonditionen bis 30.06.2026 gegen die RL Mietwohnraum 2026.
// Kein Folienmodul. Seit dem Designtest vom 17.11.2026 zeigt die Folie 9 nur die Zeilen, die die Aussage tragen (in 14 pt), der Anhang die
// ganze Tabelle. o: { auswahl: [Zeilennummern ab 0] (Vorgabe alle), gross: true (14 pt), ohneKopf: true (Anhang: ohne Modulkopf), titelPruefen }
// Seit der Änderungsrunde vom 13.11.2026 (F9.1, Rückfrage 6) eine native Tabelle über zwölf Spalten mit den Spalten Merkmal, Bis 30.06.2026,
// Seit 01.07.2026 und Wirkung und fünf Zeilen (Förderquote, nicht rückzahlbarer Teil, Eigenmittel, Bemessungsgrenze, Höchstmiete). Bis dahin
// standen die Werte im Layout PGN_VERGLEICH mit dem Wertepaar „75 % Darlehen“ → „80 % Förderung“.
// Werte bis 30.06.2026 aus daten/regeln.json (NBank-Produktinformation, Stand 01.04.2026), Werte seit 01.07.2026 aus werte.json (tab.*).
// Die Wirkung ist aus beiden gerechnet und gegengeprüft; der Wortlaut jeder Zelle steht im Konzept.
'use strict';
function vergleich(ctx, s, o = {}) {
    const { B, W, X, fmt, colX, Y, Raster, P } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
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
    if (o.titelPruefen && (!ctx.glatt(ctx.o.titel).includes(`bis zu ${ctx.glatt(pct(T('quote_zuschuss.A')))}`) || !ctx.o.titel.includes(R('stichtage.neu_seit')))) P.melde('Titel der Folie nennt den Zuschuss in A oder den Stichtag nicht.');

    // ---- Kopf und Tabelle ---------------------------------------------------------------------------------------------------------
    const jahre = `Jahr 1 bis ${T('jahre_ohne_mieterhoehung')}`, stufen = 'Mietenstufe I–III / IV–VII', bindung = ctx.wert('annahme.bindung');
    const zeilen = [
      ['Förderquote', `Darlehen bis ${pct(A('darlehen_anteil'))} der Gesamtkosten`, `Darlehen und Zuschuss bis ${pct(quote)} der zuwendungsfähigen Kosten`, `+${pp(quote - A('darlehen_anteil'))} Prozentpunkte`],
      ['Nicht rückzahlbar', `Tilgungsnachlass ${pct(A('tilgungsnachlass'))} des Darlehens, das sind ${fmt.zahl(nachlassAlt * 100, 1)} % der Gesamtkosten. Nur bei geringen Einkommen`,
        `Zuschuss bis ${G.map(g => pct(T('quote_zuschuss.' + g))).join(', ').replace(/, ([^,]*)$/, ' oder $1')} der zuwendungsfähigen Kosten, je nach Einkommensgruppe ${G.slice(0, -1).join(', ')} oder ${G[G.length - 1]}`,
        `A: von ${fmt.zahl(nachlassAlt * 100, 1)} auf ${pct(T('quote_zuschuss.A'))} der Kosten. B und C: neu`],
      ['Eigenmittel', `${pct(A('eigenmittel'))} der Gesamtkosten`, `${pct(T('eigenmittel_mindestens'))} der zuwendungsfähigen Kosten`,
        `${fmt.MINUS}${pp(T('eigenmittel_mindestens') - A('eigenmittel'))} Prozentpunkte. Geld oder Grundstück weiter mindestens ${pct(A('eigenmittel_geld'))}`],
      [`Bemessungsgrenze je m², ${stufen}`, `${paar(A('bemessung.I'), A('bemessung.IV'))}, Gesamtkosten mit Grundstück`,
        `${paar(T('bemessungsgrenze.I'), T('bemessungsgrenze.IV'))} (Stand ${R('bemessungsgrenze.gilt_seit')}), nur Herstellungskosten. Grundstück zusätzlich bis zum Bodenrichtwert`,
        'Das Grundstück zählt nicht mehr auf die Grenze'],
      [`Höchstmiete ${jahre} je m², ${stufen}`, `${paar(mieteAlt[0], mieteAlt[1], 2)} (geringe Einkommen)`, `${paar(mieteNeu[0], mieteNeu[1], 2)} (Gruppe A)`, `+${fmt.euroDez(mieteNeu[0] - mieteAlt[0])}`],
      // Seit 16.11.2026 (Frage aus dem Kundengespräch): Bindung. Bis 30.06.2026 35 Jahre bei geringen und 30 Jahre bei mittleren Einkommen
      // (NBank-Produktinformation Stand 01.04.2026, „Zweckbestimmung“; WFB 2024 Nr. 19.2, 20.2), seit 01.07.2026 35 Jahre für alle Gruppen (RL Nr. 5.4.1, 5.4.2)
      ['Belegungs- und Mietbindung', `${bindung} Jahre bei geringen, 30 Jahre bei mittleren Einkommen`, `${bindung} Jahre in allen Einkommensgruppen`, 'A: unverändert. B und C: +5 Jahre']];
    if (bindung !== 35) P.melde('Bindung: Die Zeile der Folie 9 nennt 35 Jahre; die Mappe führt einen anderen Wert.');
    if (A('eigenmittel') - T('eigenmittel_mindestens') <= 0 || quote - A('darlehen_anteil') <= 0) P.melde('Die Vorzeichen der Wirkung (Förderquote, Eigenmittel) stimmen nicht mehr.');
    const koepfe = ['Merkmal', `Bis ${R('stichtage.alt_bis')}`, `Seit ${R('stichtage.neu_seit')}`, 'Wirkung'];
    wl(`Spalten: ${koepfe.map(k => `„${k}“`).join(' · ')}`, 'Spaltenköpfe');
    zeilen.forEach((z, i) => wl(z.map(t => `„${t}“`).join(' · '), `Zeile ${i + 1}`));

    // Satz: „I–III / IV–VII“ steht in einer Zeile (die Merkmale brechen vor „Mietenstufe“), die Gruppe bleibt an ihrem Satz („40 % (A)“), „B und C“ zusammen
    const NB = fmt.NBSP, satz = t => t.replace(/ \/ /g, `${NB}/${NB}`).replace(/ \(([ABC])\)/g, `${NB}($1)`).replace('B und C: neu', `B${NB}und${NB}C:${NB}neu`);
    // Seit 15.11.2026 wie die Vergleichstabelle der Broschüre S. 4 (Wunsch des Auftraggebers, besserer Lesefluss): In „Bis“ und „Seit“ stehen die
    // Werte der Regel halbfett (Quoten, Grenzen, Mieten), der Rest der Zelle normal; die Wirkung bleibt normal. Im Merkmal ist nur die erste Zeile
    // halbfett, „Mietenstufe I–III / IV–VII“ normal. Die Spalte „Seit“ steht auf Fläche, ihr Kopf trägt das Datum groß in Rot, „Bis“ in Grau.
    // Fett gesetzt wird jeder genannte Wert einmal, an seiner ersten Stelle; fehlt er im Text, bricht der Bau ab
    const fett = (t, ...werte) => werte.reduce((acc, v) => { const i = acc.indexOf(v); if (i < 0) throw new Error(`Folie 9: „${v}“ steht nicht in „${acc}“`); return acc.slice(0, i) + `**${v}**` + acc.slice(i + v.length); }, t);
    const q = k => pct(T('quote_zuschuss.' + k));
    const FETT = [
      [[pct(A('darlehen_anteil'))], [pct(quote)]],
      [[pct(A('tilgungsnachlass'))], G.map(q)],
      [[pct(A('eigenmittel'))], [pct(T('eigenmittel_mindestens'))]],
      [[paar(A('bemessung.I'), A('bemessung.IV'))], [paar(T('bemessungsgrenze.I'), T('bemessungsgrenze.IV'))]],
      [[paar(mieteAlt[0], mieteAlt[1], 2)], [paar(mieteNeu[0], mieteNeu[1], 2)]],
      [[`${bindung} Jahre`, '30 Jahre'], [`${bindung} Jahre`]]];
    const merkmal = t => satz(t).replace(', Mietenstufe', ',\nMietenstufe').split('\n').map((l, i) => (i ? l : `**${l}**`)).join('\n');
    const x = colX(1), w = Raster.CW;
    const yTab = o.ohneKopf ? Y.anhangInhalt : B.modulkopf(s, { x, y: Y.inhalt, w, titel: wl('Programmteil 2.1 im Vergleich', 'Tabellentitel') });
    const idx = o.auswahl || zeilen.map((_, i) => i), Z = idx.map(i => zeilen[i]), FT = idx.map(i => FETT[i]);
    // Spaltenbreiten in Zoll (zusammen 12,00), so gewählt, dass die fünf Zeilen mit den wenigsten Textzeilen auskommen.
    // 12 pt wie die Tabellen der Folien 15 und A1: In 14 pt bräuchte die Tabelle 4,3 Zoll, die Inhaltszone hat unter dem Modulkopf 3,9.
    // Jede Zeile folgt ihrem Text, mit demselben Innenabstand unten in allen Zeilen (LUFT_UNTEN zusätzlich zum Zellrand; Prüfrunde 2 vom 13.11.2026).
    // Seit 15.11.2026 trägt der Kopf das Datum groß (0,33 Zoll höher). Dafür steht die Tabelle im dichten Satz (Zeilenmaß ohne Zuschlag) mit
    // Zellrändern 0,05 | 0,04 statt 0,06 | 0,05; die Spaltenbreiten bleiben
    const BREITEN = o.gross ? [2.30, 3.05, 3.50, 3.15] : [2.75, 2.85, 3.30, 3.10], LUFT_UNTEN = 0.02;
    const spalten = koepfe.map((k, i) => ({ kopf: k, breite: BREITEN[i], art: 'text', ...(i === koepfe.length - 1 ? { randRechts: 0.02 } : {}) }));
    spalten[1].kopf = { text: 'Bis', gross: R('stichtage.alt_bis') };
    spalten[2].kopf = { text: 'Seit', gross: R('stichtage.neu_seit'), akzent: true }; spalten[2].flaeche = true;
    const tab = B.tabelle(s, { x, y: yTab, w, ...(o.gross ? { pt: 13, kopfGross: 18 } : { pt: 11, minPt: 11, kopfGross: 18, dicht: true, zellrand: [0.04, 0.03], luftUnten: 0 }), name: 'Tabelle Programmteil 2.1 im Vergleich', spalten,
      zeilen: Z.map((z, zi) => [merkmal(z[0]), satz(fett(z[1], ...FT[zi][0])), satz(fett(z[2], ...FT[zi][1])), satz(z[3])]) });
    if (tab.unten > Y.inhaltEnde + 0.005) P.melde(`Tabelle endet bei y ${tab.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
}
module.exports = { vergleich };
