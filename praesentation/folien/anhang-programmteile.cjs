// Folie A1 · PGN_ANHANG: die sechs Programmteile als native Tabelle über zwölf Spalten (Broschüre S. 5): Programmteil mit Programm-Chip, Instrument,
// Bis zu, Bindung, Eigenmittel. Kräftige Linien nach 2.4, 2.3 und 2.5 trennen die vier Ausgangslagen; die Zeile im Kopf nennt sie.
// Texte aus daten/markt.json; die Sätze des Programmteils 2.1 aus daten/werte.json. Programmfarben nur am Chip.
// Die Tabelle füllt die Inhaltszone: Sie steht deshalb mit dicht: true (Zeilenhöhe genau nach dem Text).
'use strict';
const { lies } = require('./_ueberblick.cjs');

// Spaltenbreiten in Zoll: Chip · Programmteil · Instrument · Bis zu · Bindung · Eigenmittel (zusammen 12,00)
const BREITEN = [0.44, 2.25, 2.90, 3.35, 1.64, 1.42];
const FELDER = ['name', 'instrument', 'bis_zu', 'bindung', 'eigenmittel'];
const ZEILEN_HOECHSTENS = 15;   // mehr Textzeilen fasst die Inhaltszone neben Kopf und Fußzeile nicht

module.exports = {
  id: 'anhang-programmteile',
  bau(ctx) {
    const { B, W, colX, Y, P, F } = ctx, s = ctx.folie(), U = lies(ctx), T = k => ctx.wortlaut(U('programmteile.texte.' + k), k);
    const x = colX(1), y0 = Y.anhangInhalt, w = 12.0, zeilen = U('programmteile.zeilen'), lagen = U('programmteile.ausgangslagen');

    // „zusammen 80 %“ gilt nur, wenn Darlehen und Zuschuss in allen drei Gruppen dieselbe Summe ergeben
    const summe = g => W('modellhaus', `tab.quote_darlehen.${g}`) + W('modellhaus', `tab.quote_zuschuss.${g}`);
    if (['B', 'C'].some(g => Math.abs(summe(g) - summe('A')) > 1e-9)) P.melde('Programmteil 2.1: Darlehen und Zuschuss ergeben nicht in allen Gruppen dieselbe Summe; „zusammen … %“ stimmt dann nicht.');

    // ---- Kopf: Titel, rechts die Angabe zu den Sätzen, darunter die vier Ausgangslagen mit ihren Programmteilen ---------------------
    ctx.wortlaut(lagen.map(l => `${l.text}: ${l.teile.join(', ')}`).join(' · '), 'Zeile über der Tabelle');
    if (lagen.flatMap(l => l.teile).join() !== zeilen.map(z => z.nr).join()) P.melde('Die Programmteile der Ausgangslagen und die Zeilen der Tabelle stehen nicht in derselben Reihenfolge.');
    const zeile = lagen.map(l => `**${l.text}:** ${l.teile.join(', ')}`).join(' · ');
    P.zeile('Zeile über der Tabelle', B.schutz(zeile).replace(/\*\*/g, ''), { fontFace: F.semi, fontSize: 12 }, w);   // mit der halbfetten Schrift gerechnet
    // Die Tabelle beginnt 0,64 unter der Kopflinie, dicht unter der Zeile der Ausgangslagen: Sie füllt die Inhaltszone bis zur Fußzeile
    const yTab = B.modulkopf(s, { x, y: y0, w, titel: T('tabellentitel'), rechts: T('untertitel'), sub: zeile }) - 0.12;

    // ---- Tabelle: Der Chip steht in einer eigenen schmalen Spalte ohne Kopf, die Bezeichnung in Work Sans SemiBold -----------------------
    const koepfe = U('programmteile.texte.spalten').map(k => ctx.wortlaut(k, 'Spaltenkopf'));
    // Sätze je Gruppe, „+ 100 % der Grundstückskosten“ und kurze Zellen („+ bis zu 20 Jahre“) bleiben zusammen; der Mittelpunkt bleibt am Zeilenende
    const NB = ctx.fmt.NBSP, fest = t => String(t).split(' ').join(NB);
    // „zusammen 80 %:“ bricht nach dem Doppelpunkt: Die Sätze der drei Gruppen stehen zusammen in der zweiten Zeile (kein Trennpunkt am Zeilenende)
    const nb = t => { const u = String(t).replace(/^(zusammen \d+ %:) (?=A \d)/, '$1\n').replace(/([ABC]) (\d+) \+ (\d+)/g, `$1${NB}$2${NB}+${NB}$3`).replace(/([ABC]) (\d+)(?= ·| %)/g, `$1${NB}$2`).replace(/\+ \d[^·;,]*$/, fest).split(' · ').join(`${NB}· `); return u.length <= 18 ? fest(u) : u; };
    const tab = B.tabelle(s, { dicht: true, x, y: yTab, w, name: 'Tabelle Programmteile',
      spalten: [{ kopf: '', breite: BREITEN[0] }, ...koepfe.map((k, i) => ({ kopf: k, breite: BREITEN[i + 1], ...(i === koepfe.length - 1 ? { randRechts: 0.02 } : {}) }))],
      zeilen: zeilen.map(z => {
        // Gegenprobe gegen das Konzept. Felder, die gegenüber der Broschüre gekürzt sind, führt daten/markt.json mit beiden Fassungen
        // (gekuerzt, broschuere); das Konzept trägt die gekürzte.
        ctx.wortlaut(`${z.nr} ${z.name}`, `Programmteil ${z.nr}`);
        for (const f of FELDER.slice(1)) ctx.wortlaut(z[f], `Programmteil ${z.nr}, ${f}`);
        for (const f of z.gekuerzt || []) if (!z.broschuere || !z.broschuere[f]) P.melde(`Programmteil ${z.nr}, ${f}: als gekürzt geführt, aber die Fassung der Broschüre fehlt in daten/markt.json.`);
        return { zellen: ['', `**${z.name}**`, ...FELDER.slice(1).map(f => nb(z[f]))], trennlinie: !!z.trennlinie };
      }) });
    if (tab.zeilenzahl > ZEILEN_HOECHSTENS) P.melde(`Tabelle braucht ${tab.zeilenzahl} Textzeilen (${tab.zeilen.map(z => z.n).join(', ')}); die Inhaltszone fasst ${ZEILEN_HOECHSTENS}.`);
    // Chip auf der ersten Textzeile jeder Zeile
    zeilen.forEach((z, i) => B.programmChip(s, { x, y: tab.zeilen[i].y + tab.rand.oben + (tab.zeilenmass - 0.24) / 2, nr: z.nr }));

    // ---- Fußzeile unten in der Inhaltszone ------------------------------------------------------------------------------------------
    const yFuss = Y.inhaltEnde - 0.20;   // die Zeile schließt mit der Inhaltszone; die Tabelle darüber hat so 0,04 Zoll mehr Platz
    B.text(s, T('fusszeile'), { x, y: yFuss, w, h: 0.20, rolle: 'kleinText', valign: 'middle', einzeilig: true, name: 'Fußzeile' });
    if (tab.unten > yFuss - 0.10) P.melde(`Tabelle endet bei y ${tab.unten.toFixed(2)} und reicht an die Fußzeile (ab y ${yFuss.toFixed(2)}).`);
  },
};
