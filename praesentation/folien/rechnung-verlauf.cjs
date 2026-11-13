// Folie 21 · PGN_DIAGRAMM_MR: Zahlungsüberschuss Jahr 1 bis 35 für A, B und C aus den Zeitreihen der Mappe (Blätter Gefördert A, B, C).
// Linien wie auf Folie 20, Werte für Jahr 1 an der Marke links und für Jahr 35 an den Linienenden. Kein Jahr hat einen Fehlbetrag: Die
// Größenachse beginnt bei null, und eine zweite Marke (früher: erstes Jahr mit Überschuss in allen drei Gruppen) gibt es nicht.
// Kein Rot im Diagramm. Die Jahre 36 bis 42 werden nicht gezeigt (W.reihe liefert Jahr 1 bis 35).
// Zahlen aus werte.json (Läufe modellhaus_zeitreihe und modellhaus); „ab Jahr 2“ aus daten/rechnung.json.
// Seit der Änderungsrunde vom 13.11.2026 (F21.1 bis F21.5): Titel „Bei voller Mietanpassung …“, Diagrammtitel und Unterzeile neu, rechts
// Stichpunkte in 14 pt unter „Annahmen“ und „Ergebnis“ (G9), unter dem Diagramm der Hinweiskasten zur Gegenprobe ohne Mieterhöhung (G8; Lauf
// modellhaus_ohne_mieterhoehung, Tabellen!D28 = 0); das Diagramm ist dafür niedriger.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-verlauf',
  bau(ctx) {
    const { B, D, W, X, fmt, ZONE } = ctx, M = k => W('modellhaus', k), G = R.G;
    const jahre = W.reihe('modellhaus_zeitreihe', 'zr.jahr'), reihe = g => W.reihe('modellhaus_zeitreihe', `zr.zahlungsueberschuss.${g}`), n = jahre.length - 1;
    // Titel: Zahlungsüberschuss der Gruppe A im letzten Jahr der Bindung aus der Mappe (Signaturwort); Gegenprobe gegen das Konzept in ctx.titelzeilen.
    // „bis Jahr 35“ steht im Diagrammtitel (F21.1, Rückfrage 18)
    const endeA = fmt.euro(reihe('A')[n]);
    const s = ctx.folie(ctx.titelzeilen(['Bei voller Mietanpassung wächst der', `Zahlungsüberschuss in A auf ${endeA}`], endeA));
    B.register(s, '2.1');
    B.diagrammkopf(s, { titel: ctx.wortlaut(`Zahlungsüberschuss je Jahr, Jahr ${jahre[0]} bis ${jahre[n]}`, 'Diagrammtitel'), sub: ctx.wortlaut('in € p. a., nach Kapitaldienst, vor Steuern, nicht kumuliert', 'Untertitel') });
    R.linienLegende(ctx, s);

    // Gegenprobe der Zeitreihe gegen die Übersicht der Mappe und gegen den Titel der Folie
    for (const g of G) {
      R.pruefe(Math.abs(reihe(g)[0] - M(`jr1.zahlungsueberschuss.${g}`)) < 0.005, `Jahr 1 der Zeitreihe ${g} ist nicht Zeile 9 der Jahresrechnung.`);
      R.pruefe(Math.abs(reihe(g)[n] - M(`liq.zahlungsueberschuss_jahr35.${g}`)) < 0.005, `Das letzte Jahr der Zeitreihe ${g} ist nicht Übersicht 3.2 (Jahr 35).`);
    }
    // Aussagen der Folie gegen die Mappe: kein Jahr mit Fehlbetrag in A, B und C (Zeitreihe und Übersicht 3.6, 3.7); der Titel nennt den Wert
    // der Gruppe A im letzten Jahr; in Jahr 1 liegt A vorn, im letzten Jahr C
    const erstes = G.map(g => reihe(g)[0]), letztes = G.map(g => reihe(g)[n]);
    R.pruefe(G.every(g => reihe(g).every(v => v > 0) && M(`liq.jahre_mit_fehlbetrag.${g}`) === 0 && M(`liq.groesster_kumulierter_fehlbetrag.${g}`) === 0),
      'Eine Gruppe hat ein Jahr mit Fehlbetrag; Titel, Kommentar („Kein Jahr mit Fehlbetrag“) und Größenachse der Folie 21 stimmen dann nicht.');
    R.pruefe(erstes[0] > Math.max(erstes[1], erstes[2]) && letztes[2] > Math.max(letztes[0], letztes[1]),
      'Die Aussage „in Jahr 1 liegt A vorn, im letzten Jahr C“ trifft nicht mehr zu; Kommentar der Folie 21 anpassen.');

    // Gegenprobe ohne Mieterhöhung (F21.5, Lauf modellhaus_ohne_mieterhoehung: Tabellen!D28 = 0, Kosten weiter +2 % p. a.): In allen drei Gruppen
    // bleibt bis zum letzten Jahr der Bindung in jedem Jahr ein Zahlungsüberschuss. Ab Jahr 36 kostet das NBank-Darlehen Zins; darüber sagt der
    // Kasten nichts
    const OHNE = 'modellhaus_ohne_mieterhoehung', ohne = g => W.reihe(OHNE, `zr.zahlungsueberschuss.${g}`, jahre[0], jahre[n]);
    R.pruefe(W(OHNE, 'tab.mieterhoehung_in_der_bindung') === 0 && G.every(g => ohne(g).length === jahre.length && ohne(g).every(v => v > 0)),
      `Ohne Mieterhöhung hat eine Gruppe bis Jahr ${jahre[n]} ein Jahr mit Fehlbetrag; der Hinweiskasten der Folie 21 stimmt dann nicht.`);
    const hinweis = ctx.wortlaut(`Ohne jede Mieterhöhung bleibt in allen drei Gruppen bis Jahr ${jahre[n]} in jedem Jahr ein Zahlungsüberschuss.`, 'Hinweiskasten');
    const cz = ZONE.diagramm.chart, hh = B.hinweisHoehe(hinweis, { w: cz.w });

    // Die Jahre an der Achse stehen als Textfelder: Die Daten behalten die Kategorien 1 bis 35, und kein Programm dreht oder bricht die Beschriftung.
    // Das Diagramm endet um die Höhe des Hinweiskastens und 0,10 Zoll Abstand höher
    const d = D.linien(s, { x: cz.x, y: cz.y, w: cz.w, h: +(cz.h - hh - 0.10).toFixed(3), kategorien: jahre, katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] }, rand: { l: 1.02, r: 1.30, u: 0.50 }, name: `Diagramm Zahlungsüberschuss Jahr ${jahre[0]} bis ${jahre[n]}`,
      reihen: R.linienReihen(reihe), achse: { min: 0, max: 120000, schritt: 20000, format: 'ganz' } });
    // Die Achse reicht eine Teilung über den größten Wert: Im obersten Band steht die Bezeichnung der Marke, darunter die drei Werte für Jahr 1
    R.pruefe(Math.max(...letztes, ...erstes) < 100000, 'Ein Wert der Folie 21 reicht in das oberste Band der Größenachse (Bezeichnung der Marke); Achse im Modul anpassen.');
    B.achstexte(s, d);
    // Der senkrechte Achsentitel ist länger als die niedrigere Plotfläche: Er läuft in die Ränder darüber und darunter (wie Folie 20)
    B.achsentitel(s, d, { y: ctx.wortlaut('Zahlungsüberschuss in € p. a.', 'Achsentitel'), x: ctx.wortlaut('Jahr', 'Achsentitel'), xAbstand: 0.29, yVon: d.y + 0.04, yBis: d.plot.y + d.plot.h + 0.24 });
    const band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“

    // Jahr 1: Marke mit den drei Werten in den Bändern darunter
    B.marke(s, { x: d.katMitte(0), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahre[0], textSeite: 'rechts', textBreite: 1.0 });
    B.wertzeilen(s, { x: d.katMitte(0) + 0.10, mitten: [band(100000), band(80000), band(60000)], name: 'Jahr ' + jahre[0], eintraege: G.map(g => ({ kreis: g, text: fmt.zahl(reihe(g)[0]) })) });
    // Jahr 35: Achskreise und Werte an den Linienenden
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: G.map(g => ({ kreis: g, y: d.yWert(reihe(g)[n]), wert: fmt.zahl(reihe(g)[n]) })) });
    B.hinweis(s, { x: cz.x, y: ctx.Y.inhaltEnde, unten: true, w: cz.w, name: 'Ohne Mieterhöhung', text: hinweis });

    const abstand = M('tab.abstand_mieterhoehungen');
    // Stichpunkte unter „Annahmen“ und „Ergebnis“ (F21.4, G9; bis 13.11.2026 zwei Absätze in 16 pt unter „Annahmen“ und „A, B und C“). Das Ergebnis
    // aller drei Gruppen ist oben gegen die Mappe geprüft. Die Zulassung von B und C steht auf den Folien 10 und 15.
    const wl = t => ctx.wortlaut(t, 'Stichpunkt');
    B.stichpunkte(s, { platzhalter: 'kommentar', gruppen: [
      { titel: ctx.wortlaut('Annahmen', 'Überschrift'), punkte: [
        wl(`Tilgung ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)} p. a.`),
        wl(`Miete alle ${ctx.zahlwort(abstand)} Jahre +${fmt.prozent(M('tab.mieterhoehung_in_der_bindung'), 2)}: Höchstwert, bester Fall`),
        wl(`Objektverwaltung und Instandhaltung ab Jahr ${X('rechnung', 'kostensteigerung.ab_jahr')} +${fmt.prozent(M('eingabe.kostensteigerung'))} p. a.`)] },
      { titel: ctx.wortlaut('Ergebnis', 'Überschrift'), punkte: [
        wl('kein Jahr mit Fehlbetrag'),
        wl(`Jahr ${jahre[0]}: A hat den höchsten Zahlungsüberschuss`),
        wl(`Jahr ${jahre[n]}: C hat den höchsten Zahlungsüberschuss`)] }] });
  },
};
