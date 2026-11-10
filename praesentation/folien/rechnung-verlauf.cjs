// Folie 13 · PGN_DIAGRAMM_MR: Zahlungsüberschuss Jahr 1 bis 35 für A, B und C aus den Zeitreihen der Mappe (Blätter Gefördert A, B, C).
// Linien wie auf Folie 12, Werte für Jahr 1 an der Marke links und für Jahr 35 an den Linienenden, Marke im ersten Jahr, in dem alle
// drei Gruppen einen Überschuss haben. Kein Rot im Diagramm. Die Jahre 36 bis 42 werden nicht gezeigt (W.reihe liefert Jahr 1 bis 35).
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
    const iAlle = jahre.findIndex((j, i) => G.every(g => reihe(g).slice(i).every(v => v >= 0))), jahrAlle = jahre[iAlle];
    const fehljahre = M('liq.jahre_mit_fehlbetrag.B');
    R.pruefe(ctx.o.titel.includes(`Ab Jahr ${jahrAlle} `) && fehljahre === M('liq.jahre_mit_fehlbetrag.C') && fehljahre === iAlle && M('liq.jahre_mit_fehlbetrag.A') === 0,
      `Alle drei Gruppen haben ab Jahr ${jahrAlle} einen Überschuss; Titel oder Kommentar der Folie 13 nennen etwas anderes.`);

    // Die Jahre an der Achse stehen als Textfelder: Die Daten behalten die Kategorien 1 bis 35, und kein Programm dreht oder bricht die Beschriftung
    const d = D.linien(s, { kategorien: jahre, katLabels: { formen: [1, 5, 10, 15, 20, 25, 30, 35] }, rand: { r: 1.30 }, name: `Diagramm Zahlungsüberschuss Jahr ${jahre[0]} bis ${jahre[n]}`,
      reihen: R.linienReihen(reihe), achse: { min: -40000, max: 120000, schritt: 20000, format: 'ganz' } });
    B.achstexte(s, d);
    const band = oben => (d.yWert(oben) + d.yWert(oben - 20000)) / 2;   // Mitte des Bandes unter der Gitterlinie „oben“

    // Jahr 1: Marke mit den drei Werten in den Bändern darunter
    B.marke(s, { x: d.katMitte(0), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahre[0], textSeite: 'rechts', textBreite: 1.0 });
    B.wertzeilen(s, { x: d.katMitte(0) + 0.10, mitten: [band(100000), band(80000), band(60000)], name: 'Jahr ' + jahre[0], eintraege: G.map(g => ({ kreis: g, text: fmt.zahl(reihe(g)[0]) })) });
    // Marke im ersten Jahr mit Überschuss in allen drei Gruppen
    B.marke(s, { x: d.katMitte(iAlle), y: d.plot.y, h: d.plot.h, art: 'mass', text: 'Jahr ' + jahrAlle, textSeite: 'rechts', textBreite: 1.0 });
    // Jahr 35: Achskreise und Werte an den Linienenden
    B.linienenden(s, { x: d.katMitte(n) + 0.26, abstand: 0.30, eintraege: G.map(g => ({ kreis: g, y: d.yWert(reihe(g)[n]), wert: fmt.zahl(reihe(g)[n]) })) });

    const abstand = M('tab.abstand_mieterhoehungen');
    // „+2 % p. a.“ bleibt zusammen (geschützte Leerzeichen), sonst stünde „p. a.“ allein in der letzten Zeile.
    // Die Beträge unter „B und C“ sind die Summe der Fehlbeträge der Jahre 1 bis 9 (Übersicht 3.x, größter kumulierter Fehlbetrag), kein Höchstwert.
    const steigerung = fmt.nb(`+${fmt.prozent(M('eingabe.kostensteigerung'))} p. a.`);
    B.planlegende(s, { platzhalter: 'kommentar', pt: 16, eintraege: [
      { titel: 'Annahmen', text: ctx.wortlaut(`Tilgung ${fmt.prozent(M('eingabe.tilgung_nbank'), 1)} p. a. Miete alle ${ctx.zahlwort(abstand)} Jahre +${fmt.prozent(M('tab.mieterhoehung_in_der_bindung'), 2)} (Höchstwert). ` +
        `Objektverwaltung und Instandhaltung ab Jahr ${X('rechnung', 'kostensteigerung.ab_jahr')} ${steigerung}`, 'Annahmen') },
      { titel: 'B und C', text: ctx.wortlaut(`Nur mit Zulassung in der Förderentscheidung. ${ctx.zahlwort(fehljahre, true)} Jahre mit Fehlbetrag, zusammen ${fmt.euro(-M('liq.groesster_kumulierter_fehlbetrag.B'))} (B) und ${fmt.euro(-M('liq.groesster_kumulierter_fehlbetrag.C'))} (C).`, 'B und C') }] });
  },
};
