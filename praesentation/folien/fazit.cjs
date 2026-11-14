// Folie 24 · Zusammenfassung der Rechnung (PGN_INHALT_MR), seit der Änderungsrunde vom 13.11.2026 neu aufgebaut (F24.1, bis dahin drei
// Kennzahl-Kacheln im Layout PGN_KENNZAHLEN_MR): oben drei Schritte nebeneinander (Förderung, Kapitaldienst, Miete), mit Pfeilen verbunden;
// darunter die Ergebniszeile über die ganze Breite (weiß auf Rot), unten die zwei Bedingungen (Herstellungskosten, Tilgungssatz) und der
// Schlusssatz. Alle Zahlen gelten für das Modellhaus in Gruppe A und kommen aus werte.json (Lauf modellhaus; die Kostenschwelle aus den drei
// Kostenläufen wie auf Folie 23). Jeder Text wird gegen den Wortlaut des Konzepts geprüft. Papierton, Daumenregister 2.1. Kein Diagramm.
'use strict';
const R = require('./_rechnung.cjs');
const { breite } = require('../lib/passpruefung.cjs');

module.exports = {
  id: 'fazit',
  bau(ctx) {
    const { B, W, F, C, fmt, colX, span, Y, Raster } = ctx, s = ctx.folie(), M = k => W('modellhaus', k), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');

    // Aussagen der Folie gegen die Mappe: Die Förderquote bezieht sich auf die Herstellungskosten (Grundstück nicht angesetzt, unter der
    // Bemessungsgrenze); das Darlehen ist bis Jahr 35 zinsfrei; in Gruppe A gibt es kein Jahr mit Fehlbetrag
    R.pruefe(M('fin.zuwendungsfaehige_kosten.A') === M('fin.herstellungskosten') && M('fin.grundstueck') === 0,
      'Die zuwendungsfähigen Kosten sind nicht mehr die Herstellungskosten; „80 % der Herstellungskosten“ auf Folie 24 stimmt dann nicht.');
    R.pruefe(M('tab.zins_nbank_bis_jahr35') === 0, 'Das NBank-Darlehen ist in den ersten Jahren nicht mehr zinsfrei; Schritt 1 der Folie 24 anpassen.');
    R.pruefe(M('liq.jahre_mit_fehlbetrag.A') === 0 && M('jr1.zahlungsueberschuss.A') > 0, 'Gruppe A hat ein Jahr mit Fehlbetrag; die Ergebniszeile der Folie 24 stimmt dann nicht.');

    // ---- Drei Schritte nebeneinander, mit Pfeilen verbunden: je Schritt Oberlinie, Achskreis mit der Nummer, Titel (Modultitel 16 pt) und Text
    // (14 pt, je Satz eine Zeile). Drei gleich breite Felder über die ganze Breite des Satzspiegels, zwischen ihnen 0,60 Zoll für den Pfeil
    const schritte = [
      { titel: 'Förderung', saetze: [`${fmt.prozent(M('fin.foerderquote.A'))} der Herstellungskosten.`, `${fmt.mio(M('fin.foerderung.A'))}, davon ${fmt.mio(M('fin.zuschuss.A'))} Zuschuss.`,
        `Darlehen ${M('tab.zinsfreie_jahre')} Jahre zinsfrei.`] },
      { titel: 'Kapitaldienst', saetze: [`${fmt.euro(M('dscr.kapitaldienst_jahr1.A'))} p. a. in Jahr 1.`, `Frei finanziert: ${fmt.euro(M('dscr.kapitaldienst_jahr1.Frei'))}.`] },
      { titel: 'Miete', saetze: [`${fmt.euroDez(M('dscr.noetige_miete.A'))} je m², kostendeckend.`, `Höchstmiete: ${fmt.euroDez(M('fin.miete_jahr1.A'))}.`,
        `Frei finanziert: ${fmt.euroDez(M('dscr.noetige_miete.Frei'))}.`] }];
    const steg = 0.60, w = +((Raster.CW - 2 * steg) / 3).toFixed(3), y0 = Y.inhalt, kreis = 0.42, zeileTitel = y0 + 0.30;
    let unten = 0;
    schritte.forEach((st, i) => {
      const x = +(colX(1) + i * (w + steg)).toFixed(3);
      wl(`${i + 1}. ${st.titel}: ${st.saetze.join(' ')}`, `Schritt ${i + 1}`);
      B.linie(s, { x, y: y0, w, art: 'modul', name: `Schritt ${i + 1} Linie` });
      B.achskreis(s, { cx: x + kreis / 2, cy: zeileTitel, d: kreis, pt: 14, text: String(i + 1), name: `Schritt ${i + 1} Nummer` });
      B.text(s, st.titel, { x: x + kreis + 0.14, y: zeileTitel - 0.18, w: w - kreis - 0.14, h: 0.36, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: `Schritt ${i + 1} Titel` });
      const r = B.text(s, st.saetze.join('\n'), { x, y: y0 + 0.62, w, rolle: 'dicht', name: `Text Schritt ${i + 1}` });
      unten = Math.max(unten, r.unten);
      // Pfeil zum nächsten Schritt: mittig im Steg, auf der Höhe der Titelzeile
      if (i < schritte.length - 1) B.icon(s, { name: 'pfeil', farbe: 'tinte', x: +(x + w + (steg - 0.30) / 2).toFixed(3), y: +(zeileTitel - 0.15).toFixed(3), d: 0.30, altText: 'Pfeil zum nächsten Schritt' });
    });

    // ---- Ergebniszeile über die ganze Breite, weiß auf Rot: der Betrag als Kernwert (24 pt), der Rest in Montserrat Bold 16 pt, auf einer Grundlinie
    // Abstände (Prüfrunde 1 zur Änderungsrunde vom 13.11.2026): Schritte, Ergebniszeile, Bedingungen und Schlusssatz stehen mit gleichem sichtbarem
    // Abstand von rund 0,43 Zoll untereinander. Das Textfeld der Schritte reicht im Bild rund 0,36 Zoll unter die letzte Zeile (es rechnet eine
    // Zeile Reserve und den Zeilenabstand mit); bis dahin lag die Ergebniszeile 0,30 Zoll unter dem Feld und darüber ein Loch von 0,66 Zoll
    const yE = +(unten + 0.07).toFixed(3), hE = 0.62, betrag = fmt.euro(M('jr1.zahlungsueberschuss.A')), rest = 'Zahlungsüberschuss in Jahr 1, kein Jahr mit Fehlbetrag';
    wl(`${betrag} ${rest}`, 'Ergebniszeile');
    B.kasten(s, { x: colX(1), y: yE, w: Raster.CW, h: hE, farbe: C.rot, name: 'Ergebniszeile Fläche' });
    const bb = breite(ctx.schutz(betrag), { fontFace: F.xbold, fontSize: 24 }) + 0.06, innen = 0.20;
    B.text(s, betrag, { x: colX(1) + innen, y: yE, w: bb, h: hE, rolle: 'kernwert', farbe: 'FFFFFF', valign: 'middle', einzeilig: true, name: 'Ergebniszeile Betrag' });
    B.text(s, rest, { x: colX(1) + innen + bb + 0.10, y: yE + 0.035, w: Raster.CW - 2 * innen - bb - 0.10, h: hE, rolle: 'kennlabel', farbe: 'FFFFFF', valign: 'middle', einzeilig: true, name: 'Ergebniszeile Text' });

    // ---- Zwei Bedingungen in 6 + 6: Tilgung und Herstellungskosten, unter denen das Ergebnis gilt. Die Kostenschwelle ist die der Gruppe A
    // (R.kostenSchwelle, wie Folie 23), die Tilgungsschwelle der Satz, bei dem der Zahlungsüberschuss in A null ist (Übersicht 3.8; Entscheidung
    // zu Rückfrage 5: Die Folie zeigt durchgehend Gruppe A)
    const kostenA = R.kostenSchwelle(ctx, 'A').rund, yB = +(yE + hE + 0.43).toFixed(3);
    const bedingungen = [
      ['Herstellungskosten', `bis rund ${fmt.euro(kostenA)} je m². Modellhaus: ${fmt.euro(M('eingabe.herstellungskosten_qm'))}.`],
      ['Tilgungssatz', `bis rund ${fmt.prozent(M('liq.breakeven_tilgung.A'), 2)} p. a. Annahme: ${fmt.prozent(M('eingabe.tilgung_nbank'), 2)}.\nDen Satz legt die NBank fest.`]];
    R.pruefe(M('eingabe.herstellungskosten_qm') < kostenA && M('eingabe.tilgung_nbank') < M('liq.breakeven_tilgung.A'), 'Das Modellhaus liegt nicht mehr unter den Schwellen der Folie 24.');
    let untenB = 0;
    bedingungen.forEach(([titel, text], i) => {
      wl(`${titel}: ${text.replace('\n', ' ')}`, `Bedingung ${i + 1}`);
      const r = B.planlegende(s, { x: colX(1 + 6 * i), y: yB, w: span(6), pt: 14, linie: true, eintraege: [{ titel, text }], name: 'Planlegende ' + titel });
      untenB = Math.max(untenB, r.unten);
    });

    // ---- Schlusssatz (Entscheidung zu Rückfrage 5: bleibt), an der Unterkante der Inhaltszone
    const schluss = wl('Alle Zahlen gelten für das Modellhaus in Gruppe A und stehen auf den Folien davor.', 'Schlusssatz');
    const hS = B.hoehe(schluss, { rolle: 'dicht', w: Raster.CW });
    R.pruefe(untenB + 0.20 <= Y.inhaltEnde - hS, 'Folie 24: Der Schlusssatz stößt an die Bedingungen.');
    B.text(s, schluss, { x: colX(1), y: +(Y.inhaltEnde - hS).toFixed(3), w: Raster.CW, h: hS, rolle: 'dicht', farbe: 'sekundaer', name: 'Text Schlusssatz' });
  },
};
