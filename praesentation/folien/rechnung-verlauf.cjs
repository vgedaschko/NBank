// Folie 21 · PGN_DIAGRAMM_MR: Zahlungsüberschuss Jahr 1 bis 35 für A, B und C aus den Zeitreihen der Mappe (Blätter Gefördert A, B, C).
// Linien wie auf Folie 20, Werte für Jahr 1 an der Marke links und für Jahr 35 an den Linienenden. Kein Jahr hat einen Fehlbetrag: Die
// Größenachse beginnt bei null, und eine zweite Marke (früher: erstes Jahr mit Überschuss in allen drei Gruppen) gibt es nicht.
// Kein Rot im Diagramm. Die Jahre 36 bis 42 werden nicht gezeigt (W.reihe liefert Jahr 1 bis 35).
// Zahlen aus werte.json (Läufe modellhaus_zeitreihe und modellhaus); „ab Jahr 2“ aus daten/rechnung.json.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'rechnung-verlauf',
  bau(ctx) {
    const { B, D, W, X, fmt } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), G = R.G;
    B.register(s, '2.1');
    const jahre = W.reihe('modellhaus_zeitreihe', 'zr.jahr'), reihe = g => W.reihe('modellhaus_zeitreihe', `zr.zahlungsueberschuss.${g}`), n = jahre.length - 1;
    B.diagrammkopf(s, { titel: `Zahlungsüberschuss Jahr ${jahre[0]} bis ${jahre[n]}`, sub: 'in € p. a. · Modellhaus, Gruppen A, B und C' });
    R.linienLegende(ctx, s);

    // Gegenprobe der Zeitreihe gegen die Übersicht der Mappe und gegen den Titel der Folie
    for (const g of G) {
      R.pruefe(Math.abs(reihe(g)[0] - M(`jr1.zahlungsueberschuss.${g}`)) < 0.005, `Jahr 1 der Zeitreihe ${g} ist nicht Zeile 8 der Jahresrechnung.`);
      R.pruefe(Math.abs(reihe(g)[n] - M(`liq.zahlungsueberschuss_jahr35.${g}`)) < 0.005, `Das letzte Jahr der Zeitreihe ${g} ist nicht Übersicht 3.2 (Jahr 35).`);
    }
    // Aussagen der Folie gegen die Mappe: kein Jahr mit Fehlbetrag in A, B und C (Zeitreihe und Übersicht 3.6, 3.7); der Titel nennt den Wert
    // der Gruppe A im letzten Jahr; in Jahr 1 liegt A vorn, im letzten Jahr C
    const erstes = G.map(g => reihe(g)[0]), letztes = G.map(g => reihe(g)[n]);
    R.pruefe(G.every(g => reihe(g).every(v => v > 0) && M(`liq.jahre_mit_fehlbetrag.${g}`) === 0 && M(`liq.groesster_kumulierter_fehlbetrag.${g}`) === 0),
      'Eine Gruppe hat ein Jahr mit Fehlbetrag; Titel, Kommentar („Kein Jahr mit Fehlbetrag“) und Größenachse der Folie 21 stimmen dann nicht.');
    R.pruefe(ctx.glatt(ctx.o.titel).includes(`bis Jahr ${jahre[n]} `) && ctx.glatt(ctx.o.titel).includes(ctx.glatt(fmt.euro(letztes[0]))),
      `Der Titel der Folie 21 nennt nicht den Zahlungsüberschuss der Gruppe A in Jahr ${jahre[n]} (${fmt.euro(letztes[0])}).`);
    R.pruefe(erstes[0] > Math.max(erstes[1], erstes[2]) && letztes[2] > Math.max(letztes[0], letztes[1]),
      'Die Aussage „in Jahr 1 liegt A vorn, im letzten Jahr C“ trifft nicht mehr zu; Kommentar der Folie 21 anpassen.');

    // Die Jahre an der Achse stehen als Textfelder: Die Daten behalten die Kategorien 1 bis 35, und kein Programm dreht oder bricht die Beschriftung
    const d = D.linien(s, { kategorien: jahre, katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] }, rand: { r: 1.30 }, name: `Diagramm Zahlungsüberschuss Jahr ${jahre[0]} bis ${jahre[n]}`,
      reihen: R.linienReihen(reihe), achse: { min: 0, max: 120000, schritt: 20000, format: 'ganz' } });
    // Die Achse reicht eine Teilung über den größten Wert: Im obersten Band steht die Bezeichnung der Marke, darunter die drei Werte für Jahr 1
    R.pruefe(Math.max(...letztes, ...erstes) < 100000, 'Ein Wert der Folie 21 reicht in das oberste Band der Größenachse (Bezeichnung der Marke); Achse im Modul anpassen.');
    B.achstexte(s, d);
    const band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“

    // Jahr 1: Marke mit den drei Werten in den Bändern darunter
    B.marke(s, { x: d.katMitte(0), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahre[0], textSeite: 'rechts', textBreite: 1.0 });
    B.wertzeilen(s, { x: d.katMitte(0) + 0.10, mitten: [band(100000), band(80000), band(60000)], name: 'Jahr ' + jahre[0], eintraege: G.map(g => ({ kreis: g, text: fmt.zahl(reihe(g)[0]) })) });
    // Jahr 35: Achskreise und Werte an den Linienenden
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: G.map(g => ({ kreis: g, y: d.yWert(reihe(g)[n]), wert: fmt.zahl(reihe(g)[n]) })) });

    const abstand = M('tab.abstand_mieterhoehungen');
    // „+2 % p. a.“ bleibt zusammen (geschützte Leerzeichen), sonst stünde „p. a.“ allein in der letzten Zeile.
    // Zweiter Eintrag: das Ergebnis aller drei Gruppen (oben gegen die Mappe geprüft). Die Zulassung von B und C steht auf den Folien 10 und 15.
    const steigerung = fmt.nb(`+${fmt.prozent(M('eingabe.kostensteigerung'))} p. a.`);
    B.planlegende(s, { platzhalter: 'kommentar', pt: 16, eintraege: [
      { titel: 'Annahmen', text: ctx.wortlaut(`Tilgung ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)} p. a. Miete alle ${ctx.zahlwort(abstand)} Jahre +${fmt.prozent(M('tab.mieterhoehung_in_der_bindung'), 2)} (Höchstwert). ` +
        `Objektverwaltung und Instandhaltung ab Jahr ${X('rechnung', 'kostensteigerung.ab_jahr')} ${steigerung}`, 'Annahmen') },
      { titel: ctx.wortlaut('A, B und C', 'Modultitel'), text: ctx.wortlaut(`Kein Jahr mit Fehlbetrag. In Jahr ${jahre[0]} liegt A vorn, in Jahr ${jahre[n]} C.`, 'A, B und C') }] });
  },
};
