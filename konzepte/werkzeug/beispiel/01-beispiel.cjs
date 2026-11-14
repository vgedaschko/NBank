// Beispielfolie des Entwurfswerkzeugs (kein Konzept): links ein natives Säulendiagramm mit Modulkopf, Legende, Achsentitel und Hinweiskasten,
// rechts eine native Tabelle und Stichpunkte in 14 pt. Alle Zahlen sind Platzhalter aus beispiel/werte.json (Blatt „Beispiel“), keine Werte
// der Rechenmappe. Der Wortlaut steht in beispiel/konzept.json; ctx.wortlaut prüft jeden Text dagegen.
'use strict';
module.exports = {
  id: 'beispiel',
  o: { nr: 'E1', abschnitt: 'Modellrechnung', layout: 'PGN_INHALT_MR', quellen: 'Quelle: Platzhalterzahlen, beispiel/werte.json (Blatt Beispiel, C4:F5).' },
  bau(ctx) {
    const { B, D, fmt, colX, span, Y, ZONE, wert } = ctx, wl = (t, was) => ctx.wortlaut(t, was);
    const s = ctx.folie(ctx.titelzeilen(['Beispielfolie für Entwürfe', 'mit Tabelle und Säulendiagramm'], 'Beispielfolie'));

    // ---- Zahlen: jede über ctx.wert (Datei, Schlüssel, Blatt und Zelle stehen danach in <ausgabe>.belege.json) --------------------------------
    const G = ['A', 'B', 'C', 'Frei'], NAME = { A: 'Gruppe A', B: 'Gruppe B', C: 'Gruppe C', Frei: 'Frei finanziert' };
    const ue = G.map(g => wert(`beispiel.ueberschuss.${g}`)), kd = G.map(g => wert(`beispiel.kapitaldienst.${g}`));
    const verh = G.map((g, i) => ue[i] / kd[i]);   // gerechnete Größe: Überschuss vor Kapitaldienst ÷ Kapitaldienst
    ctx.pruefe(ue.every((v, i) => v > kd[i]), 'In einer Variante deckt der Überschuss den Kapitaldienst nicht.');

    // ---- Links, sieben Spalten: Modulkopf, Legende, Diagramm, Hinweiskasten an der Unterkante -----------------------------------------------
    const WL = span(7), yKopf = ZONE.diagramm.kopf;
    B.modulkopf(s, { x: colX(1), y: yKopf, w: WL, titel: wl('Überschuss und Kapitaldienst in Jahr 1', 'Modultitel'), sub: wl('in Tsd. € p. a., Platzhalterzahlen', 'Untertitel') });
    B.legende(s, { x: colX(1), y: ZONE.diagramm.legende, eintraege: [{ text: 'Überschuss vor Kapitaldienst', art: 'tinte' }, { text: 'Kapitaldienst', art: 'referenz' }] });
    const hinweis = wl('Beispiel für das Entwurfswerkzeug. Alle Zahlen sind Platzhalter, keine Werte der Rechenmappe.', 'Hinweiskasten');
    const hH = B.hinweisHoehe(hinweis, { w: WL }), c = ZONE.diagramm.chart;
    const d = D.gruppierteSaeulen(s, { x: colX(1), y: c.y, w: WL, h: +(Y.inhaltEnde - c.y - hH - 0.12).toFixed(3), name: 'Diagramm Beispiel',
      kategorien: G.map(g => NAME[g]), rand: { l: 0.80 },
      // Werte in Tsd. €: kurze Beschriftungen passen über die Säulen
      reihen: [{ name: 'Überschuss vor Kapitaldienst', art: 'tinte', werte: ue.map(v => v / 1000) }, { name: 'Kapitaldienst', art: 'referenz', werte: kd.map(v => v / 1000) }],
      achse: { min: 0, max: 175, schritt: 25, format: 'ganz' }, labelFormat: 'ganz' });
    B.achsentitel(s, d, { y: wl('Betrag in Tsd. € p. a.', 'Achsentitel') });
    B.hinweis(s, { x: colX(1), y: Y.inhaltEnde, unten: true, w: WL, name: 'Beispiel', text: hinweis });

    // ---- Rechts, fünf Spalten: Tabelle mit Modulkopf, darunter Stichpunkte --------------------------------------------------------------------
    const xR = colX(8), WR = span(5);
    const kopfY = B.modulkopf(s, { x: xR, y: yKopf, w: WR, titel: wl('Verhältnis je Variante', 'Modultitel'), sub: wl('Überschuss in € p. a., Verhältnis zum Kapitaldienst', 'Untertitel') });
    const t = B.tabelle(s, { x: xR, y: kopfY + 0.04, w: WR, pt: 12, name: 'Tabelle Beispiel',
      spalten: [{ kopf: 'Variante', art: 'text' }, { kopf: 'Überschuss', breite: 1.55, art: 'zahl' }, { kopf: 'Verhältnis', breite: 1.50, art: 'zahl' }],
      zeilen: G.map((g, i) => [NAME[g], fmt.zahl(ue[i]), fmt.dez(verh[i])]) });
    B.stichpunkte(s, { x: xR, y: +(t.unten + 0.30).toFixed(3), w: WR, linie: true, gruppen: [
      { titel: wl('So ist die Folie gebaut', 'Überschrift'), punkte: [
        wl('Diagramm und Tabelle nativ und editierbar', 'Stichpunkt'),
        wl('Zahlen aus einer JSON-Datei über ctx.wert', 'Stichpunkt'),
        wl('Hinweis im grauen Kasten, Stichpunkte in 14 pt', 'Stichpunkt')] }] });
  },
};
