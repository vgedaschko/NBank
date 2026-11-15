// Gemeinsame Teile der Modellrechnung (Folien 14 bis 22) und des Fazits. Kein Folienmodul: Der Build lädt nur folien/<id>.cjs zu den IDs des
// Konzepts.
//   fakten(ctx)         Eckdaten des Modellhauses aus der Rechenmappe (Eingaben über daten/kennzahlen.json, annahme.*)
//   schema(ctx, s, lage)  Schema des Modellhauses aus nativen Formen, ein Fenster je Wohnung
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
    standard: 'Effizienzhaus 55', fmt };
}

// Schema des Modellhauses in freier Lage (seit 15.11.2026 statt der Visualisierung: das Bild der Referenzen zeigt ein anderes PGN-Projekt in
// Neu Wulmstorf). Native Formen: Baukörper mit Attika, drei Geschosse zu je fünf Achsen, im Erdgeschoss mittig der Eingang; ein Fenster je
// Wohnung, also so viele Fenster wie Wohnungen. Kein Rot (Rot = Zuschuss). Das Schema zeigt nicht das Gebäude, Geschosszahl und Fassade sind
// nicht belegt; die Unterzeile sagt das.
function schema(ctx, s, { x, y, w, h, we, name }) {
  const ST = ctx.pres.ShapeType, C = ctx.C, wl = (t) => ctx.wortlaut(t, 'Schema');
  const achsen = 5, geschosse = 3;
  ctx.pruefe(we === achsen * geschosse - 1, `Das Schema hat ${achsen * geschosse - 1} Fenster, das Modellhaus ${we} Wohnungen.`);
  const unterH = 0.42, attH = 0.14, gh = Math.min(1.08, (h - unterH - attH - 0.30) / geschosse);
  const bw = Math.min(w - 1.2, achsen * 1.12), bx = +(x + (w - bw) / 2).toFixed(3);
  const boden = +(y + h - unterH).toFixed(3), oben = +(boden - geschosse * gh).toFixed(3), ax = bw / achsen;
  const r = (v) => +v.toFixed(3), n = name || 'Schema Modellhaus';
  s.addShape(ST.rect, { x: r(bx - 0.06), y: r(oben - attH), w: r(bw + 0.12), h: attH, fill: { color: C.tinte }, line: { type: 'none' }, objectName: `${n} Attika` });
  s.addShape(ST.rect, { x: bx, y: oben, w: bw, h: r(geschosse * gh), fill: { color: C.weiss }, line: { color: C.tinte, width: 1.5 }, objectName: `${n} Baukörper` });
  ctx.B.altText(s, `${n} Baukörper`, `Schema des Modellhauses: Mehrfamilienhaus mit ${we} Fenstern, ein Fenster je Wohnung. Keine Ansicht des Gebäudes.`);
  for (let g = 1; g < geschosse; g++) s.addShape(ST.line, { x: bx, y: r(oben + g * gh), w: bw, h: 0, line: { color: C.grau, width: 0.75 }, objectName: `${n} Geschossdecke ${g}` });
  const fw = r(Math.min(0.36, ax * 0.30)), fh = r(gh * 0.56);
  let k = 0;
  for (let g = 0; g < geschosse; g++) for (let a = 0; a < achsen; a++) {
    const cx = bx + (a + 0.5) * ax, gy = oben + g * gh;
    if (g === geschosse - 1 && a === (achsen - 1) / 2) {          // Eingang im Erdgeschoss
      const tw = r(fw * 1.15), th = r(gh * 0.78);
      s.addShape(ST.rect, { x: r(cx - tw / 2), y: r(boden - th), w: tw, h: th, fill: { color: C.weiss }, line: { color: C.tinte, width: 1.5 }, objectName: `${n} Eingang` });
      s.addShape(ST.rect, { x: r(cx - tw / 2 - 0.12), y: r(boden - th - 0.10), w: r(tw + 0.24), h: 0.06, fill: { color: C.tinte }, line: { type: 'none' }, objectName: `${n} Vordach` });
      continue;
    }
    k++;
    s.addShape(ST.rect, { x: r(cx - fw / 2), y: r(gy + (gh - fh) / 2), w: fw, h: fh, fill: { color: C.tinte }, line: { type: 'none' }, objectName: `${n} Fenster ${k}` });
  }
  s.addShape(ST.line, { x, y: boden, w, h: 0, line: { color: C.tinte, width: 1.5 }, objectName: `${n} Gelände` });
  s.addText(wl('Schema: ein Fenster je Wohnung'), { x, y: r(boden + 0.10), w, h: 0.26, margin: 0, align: 'left', valign: 'top', fontFace: ctx.F.text, fontSize: 12,
    color: C.grau, objectName: `${n} Unterzeile`, isTextBox: true });
  return k;
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
  return [
    { titel: 'Planbare Mieterträge',
      satz: `Höchstmiete ${fmt.euroDez(miete)} in A, drei Jahre fest. Danach höchstens +${fmt.prozent(erh, 2)} in drei Jahren.` },
    { titel: 'Gesicherte Nachfrage',
      satz: `Im Modellhaus liegt die Miete bei ${fmt.prozent(anteil, 0)} der Marktmiete. Bestand gebundener Wohnungen seit ${jahre[0]} um ${fmt.prozent(rueckgang, 1)} gesunken.` },
    { titel: 'Neubau, der sonst nicht entsteht',
      satz: `Frei finanziert braucht das Haus ${fmt.euroDez(noetig)} Miete, der Markt zahlt ${fmt.euroDez(markt)}.` },
    { titel: 'Liquidität über 35 Jahre',
      satz: `In A ${fmt.euro(ue1)} Zahlungsüberschuss in Jahr 1. Kein Jahr mit Fehlbetrag. Zins 0 % für ${zinsfrei} Jahre.` }];
}

// Quellenzeile der Folien mit der Marktmiete (daten/rechnung.json, marktwerte.quelle_kurz), gegen das Konzept geprüft
const quelleMarkt = ctx => ctx.wortlaut(ctx.X('rechnung', 'marktwerte.quelle_kurz'), 'Quellenzeile');

module.exports = { fakten, schema, verlauf, gruende, quelleMarkt };
