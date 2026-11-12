// Folie A7 · PGN_ANHANG: Eigenkapitalrendite des Modellhauses über 35 Jahre, vor Steuern, für A, B, C und frei finanziert zur Marktmiete.
// Links über acht Spalten ein Rechenblatt (12 pt) mit sieben Zeilen, Ergebniszeile „Rendite mit Restwert“ weiß auf Rot wie Zeile 8 der
// Folie 15; rechts über vier Spalten die Annahmen. Die Folie zeigt die Rendite nur als Paar mit dem Anteil des Restwerts am Endvermögen, wie
// es die Rechenmappe verlangt (Blatt Hinweise Nr. 12); der Titel nennt beide Lesarten für Gruppe A.
// Das Gegenstück zur Rendite mit Restwert heißt hier „ohne Restwert“: Das Grundstück des Modellhauses ist im Bestand und nicht angesetzt, der
// Bodenwert der Rechenmappe ist deshalb null, und ihre Lesart „nur Bodenwert“ (Übersicht 6.4) rechnet ohne Restwert (Blatt Hinweise Nr. 15).
// „Nur Bodenwert“ stünde für einen Wert, den es bei diesem Projekt nicht gibt. Das Modul prüft die Voraussetzung (Eingabe 2.3 = 0).
// Einzige Folie mit Rendite und Marktmiete des Modellhauses (Entscheidung 24 des Konzepts; E5 gilt für alle anderen Folien). Die Werte kommen
// aus dem Lauf modellhaus_rendite von daten/werte.json, den der Bau nur dieser Folie freigibt; Eigenkapital und die Jahre mit Fehlbetrag der
// Gruppen A, B, C aus dem Lauf modellhaus; die Herkunft der Marktwerte aus daten/rechnung.json. Kein Stempel, kein Papierton, Rot nur im Signaturwort und in der Ergebniszeile.
// Marktmiete und Liegenschaftszins gelten für Neu Wulmstorf (Mietübersicht des Gutachterausschusses Lüneburg, Hamburger Umland; Landesmodell des Oberen Gutachterausschusses); die Annahmen
// nennen Wert und Herkunft. Renditen und Liegenschaftszins stehen mit zwei Nachkommastellen wie in der Rechenmappe.
'use strict';
const R = require('./_rechnung.cjs');

module.exports = {
  id: 'anhang-rendite',
  bau(ctx) {
    const { B, W, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    const M = k => W('modellhaus', k), V = k => W('modellhaus_rendite', 'rendite.' + k), G = R.G, ALLE = [...G, 'Frei'], je = k => ALLE.map(g => V(`${k}.${g}`));
    const jahre = M('tab.zinsfreie_jahre');                    // Horizont der Rechnung: Ende der zinsfreien Zeit und der Bindung

    // ---- Werte der Mappe und ihre Gegenproben -----------------------------------------------------------------------------------
    const mit = je('vofi_mit_restwert'), ohne = je('vofi_nur_bodenwert'), anteil = je('restwertanteil');
    const fehljahre = [...G.map(g => M(`liq.jahre_mit_fehlbetrag.${g}`)), V('jahre_mit_fehlbetrag.Frei')], konto = je('projektkonto_tiefststand'), restwert = je('restwert_jahr35');
    const zins = je('liegenschaftszins');
    // Grundstück im Bestand, nicht angesetzt: Nur dann ist der Bodenwert der Mappe null und ihre Lesart „nur Bodenwert“ gleich „ohne Restwert“.
    // Setzt die Mappe wieder ein Grundstück an, heißt Zeile 6 „Rendite, nur Bodenwert“, und Titel und Annahmen sind anzupassen.
    R.pruefe(M('eingabe.grundstueck') === 0, 'Die Mappe setzt für das Modellhaus ein Grundstück an; Zeile 6 („Rendite ohne Restwert“), Titel und Annahmen der Folie A7 stimmen dann nicht.');
    R.pruefe(ALLE.every((g, i) => typeof ohne[i] === 'number' && anteil[i] > 0 && anteil[i] < 1 && ohne[i] < mit[i]),
      'Die Rendite ohne Restwert ist in einer Spalte kein Wert, liegt nicht unter der Rendite mit Restwert, oder der Restwertanteil liegt nicht zwischen 0 und 100 %; Zeilen 6 und 7 der Folie A7 anpassen.');
    R.pruefe(new Set(zins).size === 1, 'Der Liegenschaftszins ist nicht für alle vier Spalten gleich; die Annahme „Liegenschaftszins …“ auf Folie A7 anpassen.');
    const p2 = v => fmt.prozent(v, 2);
    // Der Titel nennt für Gruppe A beide Lesarten: mit Restwert (Signaturwort) und ohne Restwert
    if (ctx.glatt(ctx.o.titel) !== ctx.glatt(`Rendite in A: ${p2(mit[0])} mit Restwert, ${p2(ohne[0])} ohne Restwert`)) P.melde(`Titel der Folie nennt nicht die Rendite in A mit Restwert (${ctx.glatt(p2(mit[0]))}) und ohne Restwert (${ctx.glatt(p2(ohne[0]))}) aus der Mappe.`);

    // ---- Rechenblatt über acht Spalten -----------------------------------------------------------------------------------------
    const y0 = Y.anhangInhalt;
    const yT = B.modulkopf(s, { x: colX(1), y: y0, w: span(8), titel: wl(`Eigenkapitalrendite über ${jahre} Jahre, vor Steuern`, 'Modultitel'),
      sub: wl(`Endvermögen nach ${jahre} Jahren gegen Eigenkapital bei Bezug · frei finanziert zur Marktmiete`, 'Untertitel') });
    const zeile = (nr, text, werte, art) => ({ nr, text: wl(text, `Zeile ${nr}`), werte: werte.map(w => wl(w, `Zeile ${nr}`)), ...(art ? { art } : {}) });
    // Die Spalte „frei“ ist breiter als die drei anderen (Platz für einen langen Betrag des Projektkontos); die Position behält so ihre Zeile bis
    // auf zwei lange Bezeichnungen.
    // Alle Zeilen sind gleich hoch (zwei Zeilen Bezeichnung passen in jede). Die beiden langen Bezeichnungen brechen an der Sinnfuge: Geschützte
    // Leerzeichen halten „Projektkontos, in €“ und „am Endvermögen“ zusammen (sonst stünde „€“ allein in der zweiten Zeile).
    const nb = t => t.split(' ').join(fmt.NBSP);
    B.rechenblatt(s, { x: colX(1), y: yT, w: span(8), dicht: true, wertBreite: [1.06, 1.06, 1.06, 1.22], zeilenH: 0.51, ergebnisH: 0.51, name: 'Rechenblatt Rendite',
      kopf: ['Position', { kreis: 'A' }, { kreis: 'B' }, { kreis: 'C' }, wl('frei', 'Spaltenkopf')], zeilen: [
        zeile(1, 'Eigenkapital bei Bezug, in €', ALLE.map(g => fmt.zahl(M(`fin.eigenkapital.${g}`)))),
        zeile(2, `Jahre mit Fehlbetrag, Jahr 1 bis ${jahre}`, fehljahre.map(v => fmt.zahl(v))),
        zeile(3, `Tiefster Stand des ${nb('Projektkontos, in €')}`, konto.map(v => fmt.zahl(v))),
        zeile(4, `Restwert Ende Jahr ${jahre}, in Mio. €`, restwert.map(v => fmt.mioZahl(v, 2))),
        zeile(5, 'Rendite mit Restwert', mit.map(p2), 'ergebnis'),
        zeile(6, 'Rendite ohne Restwert', ohne.map(p2)),
        zeile(7, `Anteil des Restwerts ${nb('am Endvermögen')}`, anteil.map(v => fmt.prozent(v)))] });

    // ---- Annahmen über vier Spalten ---------------------------------------------------------------------------------------------
    // Fünf Absätze: Steuern und Bauphase; das Grundstück (im Bestand, nicht angesetzt); Marktmiete und Liegenschaftszins mit Wert und knapper
    // Herkunft; Restwert; Projektkonto. „+2 % p. a.“ bleibt zusammen (geschützte Leerzeichen).
    // Die Herkunft der beiden Marktwerte steht in daten/rechnung.json (marktwerte); die Quellenangabe im Konzept (Feld „quellen“) nennt beide Quellen voll.
    const A = k => V('annahme.' + k), Q = k => ctx.X('rechnung', 'marktwerte.' + k);
    for (const k of ['quelle_marktmiete', 'quelle_liegenschaftszins']) {
      if (!ctx.glatt(ctx.o.quellen).includes(ctx.glatt(Q(k)))) P.melde(`Quellenangabe der Folie A7 (Konzept, Feld „quellen“) nennt „${Q(k)}“ nicht (daten/rechnung.json, marktwerte.${k}).`);
    }
    B.planlegende(s, { x: colX(9), y: y0, w: span(4), linie: true, pt: 14, eintraege: [
      { titel: wl('Annahmen', 'Modultitel'), text: wl('Vor Steuern, ab Bezug: ohne Bauphase, Abschreibung und Sonder-AfA.', 'Annahmen') },
      { text: wl('Grundstück im Bestand, nicht angesetzt: weder im Eigenkapital noch im Restwert.', 'Annahmen') },
      { text: wl(`Marktmiete ${fmt.euroJeQm(A('marktmiete_jahr1'))}: ${Q('herkunft_marktmiete_kurz')}. Liegenschaftszins ${p2(zins[0])}: ${Q('herkunft_liegenschaftszins_kurz')}.`, 'Annahmen') },
      { text: wl(`Restwert: Ertragswert Ende Jahr ${jahre}. Marktmiete ${nb(`+${fmt.prozent(A('mietsteigerung'))} p. a.`)}`, 'Annahmen') },
      { text: wl(`Fehlbeträge laufen auf ein Projektkonto zu ${fmt.prozent(A('sollzins'))} Sollzins.`, 'Annahmen') }] });

    // ---- Gegenproben zu den Zeilen 1 bis 3: In A, B und C gibt es kein Jahr mit Fehlbetrag, das Projektkonto fällt dort nie unter null; frei
    // finanziert gibt es beides. Eigenkapital bei Bezug = Eigenmittel + Bearbeitungsentgelte ---------------------------------------------
    R.pruefe(G.every((g, i) => fehljahre[i] === 0 && konto[i] === 0) && fehljahre[3] > 0 && konto[3] < 0,
      'In A, B oder C gibt es ein Jahr mit Fehlbetrag oder ein Projektkonto unter null, oder frei finanziert keines mehr; Zeilen 2 und 3 der Folie A7 anpassen.');
    R.pruefe(G.every(g => Math.abs(M(`fin.eigenkapital.${g}`) - M(`fin.eigenmittel.${g}`) - M(`fin.bearbeitungsentgelte.${g}`)) < 0.005), 'Eigenkapital bei Bezug ist nicht mehr Eigenmittel plus Bearbeitungsentgelte; Zeile 1 der Folie A7 prüfen.');
  },
};
