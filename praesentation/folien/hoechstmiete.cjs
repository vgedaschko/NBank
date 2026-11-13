// Folie 10 · PGN_DIAGRAMM: Höchstmiete nach Einkommensgruppe und Mietenstufe als gruppierte Säulen (werte.json, tab.hoechstmiete.*),
// zwei Marken der landesweiten Angebotsmieten und rechts die Mietentwicklung für Gruppe A (Broschüre S. 7 über daten/regeln.json, Block mietpfad). Kein Rot im Diagramm.
// Muster 2: Diagramm über sieben Spalten, rechts fünf Spalten; seit 13.11.2026 sechs und sechs Spalten (G9). Den Programmteil nennen Kopf und Daumenregister; der Schlüsselplan in der
// Kickerzeile ist entfallen (er nannte „2.1“ ein drittes Mal).
// Änderungsrunde vom 13.11.2026: Titel ohne Programmteil (F10.1), der EH-40-Zuschlag im Hinweiskasten unter dem Diagramm (F10.2, G8), rechts
// Stichpunkte in 14 pt unter „Zulässige Mieterhöhung“ und „Gruppen“ (F10.4, G9), Quellenzeile im Schriftfeld (F10.3, daten/regeln.json).
'use strict';

module.exports = {
  id: 'hoechstmiete',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, ZONE, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    const T = k => W('modellhaus', 'tab.' + k), R = k => X('regeln', k);
    const G = ['A', 'B', 'C'], STUFEN = ['I', 'IV'], m = (stufe, g) => T(`hoechstmiete.${stufe}.${g}`);
    B.register(s, '2.1');
    // Titel: kleinste und größte Höchstmiete (A in I–III, C in IV–VII)
    const alle = G.flatMap(g => STUFEN.map(st => m(st, g)));
    if (!ctx.glatt(ctx.o.titel).includes(`von ${fmt.dez(Math.min(...alle))} bis ${fmt.dez(Math.max(...alle))} €`)) P.melde('Titel der Folie nennt die kleinste und die größte Höchstmiete nicht.');

    // ---- Diagramm über sieben Spalten ---------------------------------------------------------------------------
    const fest = T('jahre_ohne_mieterhoehung');
    // Teilung 6 + 6 (seit 13.11.2026, G9): Die Stichpunkte in 14 pt passen nicht in fünf Spalten; Diagramm und Textspalte stehen deshalb frei
    // (Layout PGN_INHALT) unter je einem Modulkopf auf den Höhen der Diagrammfolien
    const WD = span(6), kx = colX(7), kw = span(6);
    B.modulkopf(s, { x: colX(1), y: ZONE.diagramm.kopf, w: WD, titel: `Höchstmiete nettokalt, Jahre 1–${fest}`, sub: '€ je m² und Monat · nach Einkommensgruppe und Mietenstufe' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Mietenstufe I–III', art: 'bisher' }, { text: 'Mietenstufe IV–VII', art: 'tinte' }] });
    // Freie Lage statt Platzhalter: unter dem Diagramm steht der Hinweiskasten (so breit wie das Diagramm, an der Unterkante der Inhaltszone;
    // das Diagramm endet 0,12 darüber), rechts in der Diagrammfläche stehen die Texte der Marken
    const hinweis = wl(`Ab Effizienzhaus-40-Niveau bis zu +${fmt.dez(T('zuschlag_hoechstmiete_eh40'))} €.`, 'Hinweiskasten');
    const yHinweis = +(Y.inhaltEnde - B.hinweisHoehe(hinweis, { w: WD })).toFixed(3);
    const ACHSE = { min: 0, max: 12, schritt: 2, format: 'roh' }, RAND_RECHTS = 2.15, LUECKE = 50;
    const d = D.gruppierteSaeulen(s, { x: colX(1), y: ZONE.diagramm.chart.y, w: WD, h: +(yHinweis - 0.12 - ZONE.diagramm.chart.y).toFixed(3), kategorien: G, katAchse: false, name: 'Diagramm Höchstmiete',
      rand: { r: RAND_RECHTS, o: 0.44 }, luecke: LUECKE, achse: ACHSE, labelFormat: 'zwei',
      reihen: [{ name: 'Mietenstufe I–III', art: 'bisher', werte: G.map(g => m('I', g)) }, { name: 'Mietenstufe IV–VII', art: 'tinte', werte: G.map(g => m('IV', g)) }] });
    B.achsentitel(s, d, { y: ctx.wortlaut('€ je m² und Monat', 'Achsentitel') });
    G.forEach((g, i) => B.achskreis(s, { cx: d.katMitte(i), cy: d.plot.y + d.plot.h + 0.28, groesse: 'M', text: g }));

    // ---- Marken der Angebotsmieten ---------------------------------------------------------------------------------
    // Die Linie setzt an den Datenbeschriftungen aus, die auf ihrer Höhe stehen (Säule endet bis 0,30 Zoll unter der Linie),
    // und über einer Säule, die bis an die Linie reicht.
    const zoll = d.plot.h / (ACHSE.max - ACHSE.min), breite = d.saeulenBreite;
    const luecken = wert => G.flatMap((g, i) => STUFEN.map((st, j) => {
      const dy = (wert - m(st, g)) * zoll, halb = ctx.P.zeile('Datenbeschriftung', fmt.dez(m(st, g)), { fontFace: ctx.F.mont, bold: true, fontSize: 12 }, breite) / 2 + 0.09;
      if (dy >= 0.30) return null;                                                                  // Säule und Beschriftung enden unter der Linie
      return dy > 0.02 ? [d.reiheMitte(i, j) - halb, d.reiheMitte(i, j) + halb] : [d.reiheLinks(i, j) - 0.02, d.reiheLinks(i, j) + breite + 0.02];
    })).filter(Boolean);
    const jahr = R('angebotsmiete.jahr'), mittel = R('angebotsmiete.mittel'), neubau = R('angebotsmiete.neubau_median');
    const xText = d.plot.x + d.plot.w + 0.10, x1 = d.x + d.w;
    B.markeMitLuecken(s, { y: d.yWert(neubau), x0: d.plot.x, x1, luecken: luecken(neubau), textX: xText, textBreite: x1 - xText, lage: 'ueber', name: 'Marke Angebotsmiete Neubau',
      text: `Angebotsmiete Neubau\nNiedersachsen ${jahr},\nMedian (landesweit): **${fmt.dez(neubau)}**` });
    B.markeMitLuecken(s, { y: d.yWert(mittel), x0: d.plot.x, x1, luecken: luecken(mittel), textX: xText, textBreite: x1 - xText, lage: 'unter', name: 'Marke Angebotsmiete',
      text: `Angebotsmiete\nNiedersachsen ${jahr},\nMittel (landesweit): **${fmt.dez(mittel)}**` });

    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, w: WD, text: hinweis, unten: true });

    // ---- Kommentarspalte: Mietentwicklung als drei Stufenwerte, darunter Stichpunkte zur zulässigen Mieterhöhung und zu den Gruppen ----
    // Der Modultitel „Mietentwicklung“ (Wort der Broschüre S. 7) steht im Modulkopf auf der Höhe des Diagrammtitels links. Die Spalte liegt seit
    // 13.11.2026 in den sechs Spalten rechts (vorher fünf)
    const erste = fest + 1, zweite = erste + T('abstand_mieterhoehungen');
    B.modulkopf(s, { x: kx, y: ZONE.diagramm.kopf, w: kw, titel: 'Mietentwicklung', sub: 'Gruppe A · Mietenstufe IV–VII' });
    const rechts = t => ({ text: t, align: 'right' });
    const pfad = B.tabelle(s, { x: kx, y: ZONE.diagramm.legende, w: kw, pt: 14, kopf: false, name: 'Tabelle Mietentwicklung',
      spalten: [{ art: 'text' }, { breite: 1.32, art: 'text' }, { breite: 1.05, art: 'zahl' }], zeilen: [
        [`Jahre 1–${fest}`, '', fmt.euroDez(m('IV', 'A'))],
        [`ab Jahr ${erste}`, rechts('höchstens'), fmt.euroDez(R('mietpfad.jahr4'))],
        [`ab Jahr ${zweite}`, rechts('höchstens'), fmt.euroDez(R('mietpfad.jahr7'))]] });
    // Tabelle und Stichpunkte in einer Größe (14 pt, G9); die Spalte endet über der Unterkante der Inhaltszone. Die Stichpunkte sind die Sätze der
    // bisherigen Planlegende, an Semikolon und Komma geteilt; „(Betriebskosten ausgenommen)“ wie die Broschüre S. 7 (RL Nr. 5.4.5). Was A, B und C
    // sind, steht hier zum ersten Mal auf einer Folie; die Zuschläge kommen aus daten/regeln.json (Broschüre S. 6)
    const stp = B.stichpunkte(s, { x: kx, y: pfad.unten + 0.10, w: kw, titelAbstand: 6, punktAbstand: 1, name: 'Stichpunkte', gruppen: [
      { titel: wl('Zulässige Mieterhöhung', 'Überschrift'), punkte: [
        wl(`ab Jahr ${erste} höchstens +${fmt.prozent(T('mieterhoehung_in_der_bindung'), 2)} in drei Jahren (Betriebskosten ausgenommen)`, 'Stichpunkt'),
        wl('auch bei Wiedervermietung', 'Stichpunkt'), wl('keine Staffel- oder Indexmiete', 'Stichpunkt')] },
      { titel: wl('Gruppen', 'Überschrift'), punkte: [
        wl(`A bis Einkommensgrenze, B bis +${fmt.prozent(R('einkommensgrenze.zuschlag_B'))}, C bis +${fmt.prozent(R('einkommensgrenze.zuschlag_C'))}`, 'Stichpunkt'),
        wl('B und C nur mit Zulassung', 'Stichpunkt')] }] });
    if (stp.unten > Y.inhaltEnde + 0.005) P.melde(`Stichpunkte enden bei y ${stp.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);

    // ---- Schriftfeld: Quellenzeile in Kurzform (daten/regeln.json, hoechstmiete.quelle_kurz; F10.3); die volle Angabe steht auf der Quellenfolie ----
    B.quelle(s, wl(X('regeln', 'hoechstmiete.quelle_kurz'), 'Quellenzeile'));
  },
};
