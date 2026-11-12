// Folie 10 · PGN_DIAGRAMM: Höchstmiete nach Einkommensgruppe und Mietenstufe als gruppierte Säulen (werte.json, tab.hoechstmiete.*),
// zwei Marken der landesweiten Angebotsmieten und rechts die Mietentwicklung für Gruppe A (Broschüre S. 7 über daten/regeln.json, Block mietpfad). Kein Rot im Diagramm.
// Muster 2: Diagramm über sieben Spalten, rechts fünf Spalten. Den Programmteil nennen Kopf und Daumenregister; der Schlüsselplan in der
// Kickerzeile ist entfallen (er nannte „2.1“ ein drittes Mal).
'use strict';

module.exports = {
  id: 'hoechstmiete',
  bau(ctx) {
    const { B, D, W, X, fmt, colX, span, ZONE } = ctx, s = ctx.folie();
    const T = k => W('modellhaus', 'tab.' + k), R = k => X('regeln', k);
    const G = ['A', 'B', 'C'], STUFEN = ['I', 'IV'], m = (stufe, g) => T(`hoechstmiete.${stufe}.${g}`);
    B.register(s, '2.1');

    // ---- Diagramm über sieben Spalten ---------------------------------------------------------------------------
    const fest = T('jahre_ohne_mieterhoehung');
    B.diagrammkopf(s, { titel: `Höchstmiete nettokalt, Jahre 1–${fest}`, sub: '€ je m² und Monat · nach Einkommensgruppe und Mietenstufe' });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Mietenstufe I–III', art: 'bisher' }, { text: 'Mietenstufe IV–VII', art: 'tinte' }] });
    // Freie Lage statt Platzhalter: unter dem Diagramm steht eine Zeile, rechts in der Diagrammfläche stehen die Texte der Marken
    const ACHSE = { min: 0, max: 12, schritt: 2, format: 'roh' }, RAND_RECHTS = 2.15, LUECKE = 50;
    const d = D.gruppierteSaeulen(s, { x: colX(1), y: ZONE.diagramm.chart.y, w: span(7), h: 3.16, kategorien: G, katAchse: false, name: 'Diagramm Höchstmiete',
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

    B.text(s, `Ab Effizienzhaus-40-Niveau bis zu +${fmt.dez(T('zuschlag_hoechstmiete_eh40'))} €.`, { x: colX(1), y: 6.26, w: span(7), h: 0.24, rolle: 'klein', valign: 'middle', einzeilig: true, name: 'Zeile unter dem Diagramm' });

    // ---- Kommentarspalte: Mietentwicklung als drei Stufenwerte, darunter Regel und Gruppen ------------------------------
    // Der Modultitel „Mietentwicklung“ (Wort der Broschüre S. 7; Feld 0,30 hoch, mittig) steht auf der Höhe des Diagrammtitels links (Feld 2,18 bis 2,48).
    // Die Spalte liegt in den fünf Spalten rechts, unter der Modulkopf-Linie des Layouts
    const sp = ZONE.diagramm.kommentar, kx = sp.x, kw = sp.w, k0 = ZONE.diagramm.titel;
    const erste = fest + 1, zweite = erste + T('abstand_mieterhoehungen');
    B.text(s, 'Mietentwicklung', { x: kx, y: k0, w: kw, h: 0.30, rolle: 'modultitel', valign: 'middle', einzeilig: true, name: 'Modultitel Mietentwicklung' });
    B.text(s, 'Gruppe A · Mietenstufe IV–VII', { x: kx, y: ZONE.diagramm.sub, w: kw, h: 0.22, rolle: 'sub', einzeilig: true, name: 'Modul-Untertitel Mietentwicklung' });
    const rechts = t => ({ text: t, align: 'right' });
    const pfad = B.tabelle(s, { x: kx, y: ZONE.diagramm.legende, w: kw, pt: 14, kopf: false, name: 'Tabelle Mietentwicklung',
      spalten: [{ art: 'text' }, { breite: 1.32, art: 'text' }, { breite: 1.05, art: 'zahl' }], zeilen: [
        [`Jahre 1–${fest}`, '', fmt.euroDez(m('IV', 'A'))],
        [`ab Jahr ${erste}`, rechts('höchstens'), fmt.euroDez(R('mietpfad.jahr4'))],
        [`ab Jahr ${zweite}`, rechts('höchstens'), fmt.euroDez(R('mietpfad.jahr7'))]] });
    // Tabelle und Text in einer Größe (14 pt); in den fünf Spalten steht die Regel in drei Zeilen, und die Spalte endet über der Unterkante der Inhaltszone
    B.planlegende(s, { x: kx, y: pfad.unten + 0.16, w: kw, pt: 14, name: 'Planlegende Regel und Gruppen', eintraege: [
      // „(Betriebskosten ausgenommen)“ wie die Broschüre S. 7 (RL Nr. 5.4.5)
      { titel: 'Regel', text: `Ab Jahr ${erste} höchstens +${fmt.prozent(T('mieterhoehung_in_der_bindung'), 2)} in drei Jahren (Betriebskosten ausgenommen), auch bei Wiedervermietung; keine Staffel- oder Indexmiete.` },
      // Was A, B und C sind, steht hier zum ersten Mal auf einer Folie; die Zuschläge kommen aus daten/regeln.json (Broschüre S. 6)
      { titel: 'Gruppen', text: `A bis Einkommensgrenze, B bis +${fmt.prozent(R('einkommensgrenze.zuschlag_B'))}, C bis +${fmt.prozent(R('einkommensgrenze.zuschlag_C'))}. B und C nur mit Zulassung.` }] });
  },
};
