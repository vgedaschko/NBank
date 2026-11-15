// Gemeinsame Zahlen der Entwürfe aus Schritt 2. Zeitreihen und Jahr-1-Werte aus praesentation/daten/werte.json (Rechenmappe v3, Läufe
// modellhaus und modellhaus_zeitreihe), die Miete für DSCR 1,2 aus konzepte/mappe/werte_konzepte.json (Konzepte!D12). Jede Aussage der
// Folien wird hier gegen die Zahlen geprüft.
'use strict';

function verlauf(ctx) {
  const { W } = ctx, M = k => W('modellhaus', k);
  const jahre = W.reihe('modellhaus_zeitreihe', 'zr.jahr'), reihe = g => W.reihe('modellhaus_zeitreihe', `zr.zahlungsueberschuss.${g}`);
  const n = jahre.length - 1, A = reihe('A'), C = reihe('C');
  ctx.pruefe(jahre[0] === 1 && jahre[n] === 35, 'Die Zeitreihe läuft nicht von Jahr 1 bis 35.');
  ctx.gleich('Jahr 1 A gegen Konzepte!D61', A[0], ctx.wert('n5.zue_jahr1.A'), 2);
  ctx.gleich('Jahr 1 C gegen Konzepte!F61', C[0], ctx.wert('n5.zue_jahr1.C'), 2);
  ctx.gleich('Jahr 35 A gegen Konzepte!D64', A[n], ctx.wert('n5.zue_jahr35.A'), 2);
  ctx.gleich('Jahr 35 C gegen Konzepte!F64', C[n], ctx.wert('n5.zue_jahr35.C'), 2);
  // Aussage „kein Jahr mit Fehlbetrag“ in A und C
  ctx.pruefe(A.every(v => v > 0) && C.every(v => v > 0) && M('liq.jahre_mit_fehlbetrag.A') === 0 && M('liq.jahre_mit_fehlbetrag.C') === 0,
    'A oder C hat ein Jahr mit Fehlbetrag.');
  // Aussage „ab Jahr k liegt C vor A“: erstes Jahr, ab dem C in jedem folgenden Jahr bis 35 über A liegt; in Jahr 1 liegt A vorn
  ctx.pruefe(A[0] > C[0] && C[n] > A[n], 'In Jahr 1 liegt A nicht vorn oder in Jahr 35 nicht C.');
  let k = n;
  while (k > 0 && C[k - 1] > A[k - 1]) k--;
  return { jahre, n, A, C, ab: jahre[k], iAb: k, M };
}

module.exports = { verlauf };

// Die vier Gründe des Fazits mit ihren Zahlen (Wortlaut vom Auftraggeber, 15.11.2026). Jede Zahl steht vorher im Vortrag.
function gruende(ctx) {
  const { W, X, fmt } = ctx, M = k => W('modellhaus', k);
  const miete = M('fin.miete_jahr1.A'), fest = M('tab.jahre_ohne_mieterhoehung'), erh = M('tab.mieterhoehung_in_der_bindung'), takt = M('tab.abstand_mieterhoehungen');
  const markt = ctx.wert('n2.marktmiete_jahr1'), noetig = ctx.wert('n2.miete_dscr');
  ctx.gleich('Höchstmiete A gegen Konzepte!D49', miete, ctx.wert('n5.miete_jahr1.A'), 2);
  const anteil = miete / markt;                                    // Höchstmiete A ÷ Marktmiete (Konzepte D49 ÷ D13)
  const jahre = X('markt', 'bestand.jahre'), reihe = X('markt', 'bestand.reihe'), nb = jahre.length - 1;
  const rueckgang = 1 - reihe[jahre[nb]] / reihe[jahre[0]];         // wie Folie 6
  const ue1 = M('jr1.zahlungsueberschuss.A'), zinsfrei = M('tab.zinsfreie_jahre');
  ctx.pruefe(M('liq.jahre_mit_fehlbetrag.A') === 0 && M('tab.zins_nbank_bis_jahr35') === 0, 'A hat ein Jahr mit Fehlbetrag oder das Darlehen ist nicht zinsfrei.');
  ctx.pruefe(fest === 3 && takt === 3, '„drei Jahre fest“ oder „in drei Jahren“ stimmt nicht mehr.');
  return [
    { titel: 'Planbare Mieterträge', vorsatz: 'Höchstmiete in A', zahl: fmt.dez(miete, 2), einheit: '€ je m²',
      satz: `Höchstmiete ${fmt.euroDez(miete)} in A, drei Jahre fest. Danach höchstens +${fmt.prozent(erh, 2)} in drei Jahren.`,
      kurz: `Drei Jahre fest. Danach höchstens +${fmt.prozent(erh, 2)} in drei Jahren.` },
    { titel: 'Gesicherte Nachfrage', vorsatz: 'Miete im Modellhaus', zahl: fmt.zahl(anteil * 100, 0), einheit: '% der Marktmiete',
      satz: `Im Modellhaus liegt die Miete bei ${fmt.prozent(anteil, 0)} der Marktmiete. Bestand gebundener Wohnungen seit ${jahre[0]} um ${fmt.prozent(rueckgang, 1)} gesunken.`,
      kurz: `Bestand gebundener Wohnungen seit ${jahre[0]} um ${fmt.prozent(rueckgang, 1)} gesunken.` },
    { titel: 'Neubau, der sonst nicht entsteht', vorsatz: 'Frei finanziert nötig', zahl: fmt.dez(noetig, 2), einheit: '€ je m²',
      satz: `Frei finanziert braucht das Haus ${fmt.euroDez(noetig)} Miete, der Markt zahlt ${fmt.euroDez(markt)}.`,
      kurz: `So viel Miete braucht das Haus frei finanziert. Der Markt zahlt ${fmt.euroDez(markt)}.` },
    { titel: 'Liquidität über 35 Jahre', vorsatz: 'Zahlungsüberschuss Jahr 1, A', zahl: fmt.zahl(ue1), einheit: '€',
      satz: `In A ${fmt.euro(ue1)} Zahlungsüberschuss in Jahr 1. Kein Jahr mit Fehlbetrag. Zins 0 % für ${zinsfrei} Jahre.`,
      kurz: `Kein Jahr mit Fehlbetrag. Zins 0 % für ${zinsfrei} Jahre.` }];
}

module.exports.gruende = gruende;
