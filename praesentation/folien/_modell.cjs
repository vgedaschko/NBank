// Gemeinsame Teile der Modellrechnung (Folien 14 bis 22) und des Fazits. Kein Folienmodul: Der Build lädt nur folien/<id>.cjs zu den IDs des
// Konzepts.
//   fakten(ctx)         Eckdaten des Modellhauses aus der Rechenmappe (Eingaben über daten/kennzahlen.json, annahme.*)
//   axonometrie(ctx, s, lage)  Linienzeichnung des Titels ohne Förderkette, mit Unterzeile
//   verlauf(ctx)        Zahlungsüberschuss je Jahr in A und C (Jahr 1 bis 35) mit den Aussagen der Folie 20
//   gruende(ctx)        die vier Gründe des Fazits mit ihren Zahlen
//   quelleMarkt(ctx)    Quellenzeile der Folien mit der Marktmiete
// Jede Aussage wird hier gegen die Zahlen geprüft (ctx.pruefe, ctx.gleich). Zeitreihen und Jahr-1-Werte aus daten/werte.json (Läufe modellhaus und
// modellhaus_zeitreihe), frei finanziert, DSCR und Rendite aus daten/kennzahlen.json (Blätter Kennzahlen, Frei DSCR 1,2 und Zeitreihe der Mappe).
'use strict';

// ---- Modellhaus ----------------------------------------------------------------------------------------------------------------------------
function fakten(ctx) {
  const { fmt } = ctx, a = k => ctx.wert('annahme.' + k);
  const we = a('wohnungen'), wf = a('wohnflaeche'), gk = ctx.wert('n5.gesamtkosten.A');
  ctx.gleich('Gesamtkosten = Herstellungskosten je m² × Wohnfläche (Grundstück 0, KG 800 0)', a('herstellungskosten_qm') * wf, gk, 0);
  ctx.pruefe(a('grundstueck') === 0 && a('eh40') === 'nein' && a('mietenstufe') === 'VI', 'Grundstück, Standard oder Mietenstufe stimmen nicht mehr.');
  return { we, wf, schnitt: wf / we, kostenQm: a('herstellungskosten_qm'), gk, bezug: a('bezugsjahr'), bindung: a('bindung'), mietenstufe: a('mietenstufe'),
    standard: 'Energiestandard gemäß GModG', fmt };
}

// Axonometrie in freier Lage (seit 15.11.2026, Wunsch des Auftraggebers): die Linienzeichnung des Titels nach dem Referenzprojekt Brauerstraße,
// helle Fassung ohne Förderkette, Nordpfeil und Maßstab (assets/axo-modellhaus.png aus lib/assets.cjs, Verhältnis 190 : 134). Die Visualisierung „Neu Wulmstorf“
// der Referenzen zeigt ein anderes Projekt und steht nicht mehr auf der Folie. Die Zeichnung zeigt nicht das Modellhaus; die Unterzeile nennt
// das Projekt wie die Bildzeile des Titels. Links am Raster, so hoch wie möglich; Unterzeile an der linken Kante.
function axonometrie(ctx, s, { x, y, w, h, name }) {
  const r = (v) => +v.toFixed(3), n = name || 'Axonometrie Modellhaus', unterH = 0.34;
  const ih = r(Math.min(h - unterH, w * 134 / 190)), iw = r(ih * 190 / 134), ix = x;
  s.addImage({ path: ctx.asset('axo-modellhaus.png'), x: ix, y, w: iw, h: ih, objectName: n,
    altText: 'Axonometrische Linienzeichnung nach dem PGN-Referenzprojekt Brauerstraße in Rotenburg (Wümme): dreigeschossiger Klinkerbau mit '
      + 'Walmdach, Balkonen und zweigeschossigem Kopfbau mit Photovoltaik. Illustration, nicht das Modellhaus.' });
  s.addText(ctx.wortlaut('Illustration: Referenzprojekt Brauerstraße, Rotenburg (Wümme)', 'Unterzeile'), { x: ix, y: r(y + ih + 0.08), w: r(x + w - ix), h: 0.26,
    margin: 0, align: 'left', valign: 'top', fontFace: ctx.F.text, fontSize: 12, color: ctx.C.grau, objectName: `${n} Unterzeile`, isTextBox: true });
}

// ---- Verlauf A und C -----------------------------------------------------------------------------------------------------------------------
function verlauf(ctx) {
  const { W } = ctx, M = k => W('modellhaus', k);
  const jahre = W.reihe('modellhaus_zeitreihe', 'zr.jahr'), reihe = g => W.reihe('modellhaus_zeitreihe', `zr.zahlungsueberschuss.${g}`);
  const n = jahre.length - 1, A = reihe('A'), C = reihe('C');
  ctx.pruefe(jahre[0] === 1 && jahre[n] === 35, 'Die Zeitreihe läuft nicht von Jahr 1 bis 35.');
  ctx.gleich('Jahr 1 A gegen Kennzahlen!D61', A[0], ctx.wert('n5.zue_jahr1.A'), 2);
  ctx.gleich('Jahr 1 C gegen Kennzahlen!F61', C[0], ctx.wert('n5.zue_jahr1.C'), 2);
  ctx.gleich('Jahr 35 A gegen Kennzahlen!D64', A[n], ctx.wert('n5.zue_jahr35.A'), 2);
  ctx.gleich('Jahr 35 C gegen Kennzahlen!F64', C[n], ctx.wert('n5.zue_jahr35.C'), 2);
  // Aussage „kein Jahr mit Fehlbetrag“ in A und C
  ctx.pruefe(A.every(v => v > 0) && C.every(v => v > 0) && M('liq.jahre_mit_fehlbetrag.A') === 0 && M('liq.jahre_mit_fehlbetrag.C') === 0,
    'A oder C hat ein Jahr mit Fehlbetrag.');
  // Aussage „ab Jahr k liegt C vor A“: erstes Jahr, ab dem C in jedem folgenden Jahr bis 35 über A liegt; in Jahr 1 liegt A vorn
  ctx.pruefe(A[0] > C[0] && C[n] > A[n], 'In Jahr 1 liegt A nicht vorn oder in Jahr 35 nicht C.');
  let k = n;
  while (k > 0 && C[k - 1] > A[k - 1]) k--;
  return { jahre, n, A, C, ab: jahre[k], iAb: k, M };
}

// ---- Fazit ---------------------------------------------------------------------------------------------------------------------------------
// Die vier Gründe mit ihren Zahlen (Wortlaut vom Auftraggeber, 15.11.2026). Jede Zahl steht vorher im Vortrag.
function gruende(ctx) {
  const { W, X, fmt } = ctx, M = k => W('modellhaus', k);
  const miete = M('fin.miete_jahr1.A'), fest = M('tab.jahre_ohne_mieterhoehung'), erh = M('tab.mieterhoehung_in_der_bindung'), takt = M('tab.abstand_mieterhoehungen');
  const markt = ctx.wert('n2.marktmiete_jahr1'), noetig = ctx.wert('n2.miete_dscr');
  ctx.gleich('Höchstmiete A gegen Kennzahlen!D49', miete, ctx.wert('n5.miete_jahr1.A'), 2);
  const anteil = miete / markt;                                    // Höchstmiete A ÷ Marktmiete (Kennzahlen D49 ÷ D13)
  const jahre = X('markt', 'bestand.jahre'), reihe = X('markt', 'bestand.reihe'), nb = jahre.length - 1;
  const rueckgang = 1 - reihe[jahre[nb]] / reihe[jahre[0]];         // wie Folie 6
  const ue1 = M('jr1.zahlungsueberschuss.A'), zinsfrei = M('tab.zinsfreie_jahre');
  ctx.pruefe(M('liq.jahre_mit_fehlbetrag.A') === 0 && M('tab.zins_nbank_bis_jahr35') === 0, 'A hat ein Jahr mit Fehlbetrag oder das Darlehen ist nicht zinsfrei.');
  ctx.pruefe(fest === 3 && takt === 3, '„drei Jahre fest“ oder „in drei Jahren“ stimmt nicht mehr.');
  // Seit 16.11.2026 (Wunsch der Geschäftsleitung): je Grund nur die Kernbotschaft und eine kurze Zeile mit der Zahl dahinter. Grund 2 sagt
  // ausdrücklich, dass die Wohnungen dauerhaft vermietbar sind (Abstand zur Marktmiete, sinkender Bestand gebundener Wohnungen)
  const luecke = noetig - markt;
  ctx.pruefe(anteil < 1 && luecke > 0, 'Höchstmiete liegt nicht unter der Marktmiete oder frei finanziert fehlt keine Miete.');
  return [
    { titel: 'Planbare Mieterträge', zahl: fmt.euroDez(miete),
      satz: `Höchstmiete, höchstens +${fmt.prozent(erh, 2)} alle drei Jahre` },
    { titel: 'Gesicherte Nachfrage', zahl: fmt.prozent(1 - anteil, 0),
      satz: 'unter der Marktmiete: dauerhaft vermietbar' },
    { titel: 'Neubau, der sonst nicht entsteht', zahl: fmt.euroDez(luecke),
      satz: 'Miete je m² fehlen frei finanziert' },
    { titel: 'Liquidität über 35 Jahre', zahl: fmt.prozent(0, 0),
      satz: `Zins für ${zinsfrei} Jahre, kein Jahr mit Fehlbetrag` }];
}

// Quellenzeile der Folien mit der Marktmiete (daten/rechnung.json, marktwerte.quelle_kurz), gegen das Konzept geprüft
const quelleMarkt = ctx => ctx.wortlaut(ctx.X('rechnung', 'marktwerte.quelle_kurz'), 'Quellenzeile');

module.exports = { fakten, axonometrie, verlauf, gruende, quelleMarkt };
