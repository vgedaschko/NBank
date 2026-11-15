// Folie 14 · PGN_INHALT_MR: Einstieg in die Modellrechnung, das Modellhaus (PGN-Projekt in Neu Wulmstorf). Links die Visualisierung über sieben
// Spalten in voller Höhe, rechts zwei Kennzahlen (Wohnungen, Gesamtkosten) wie in Kapitel 1 und darunter der Satz, wie gerechnet wird. Erste
// Folie der Modellrechnung: oben rechts der Zusatz „Rechenbeispiel, keine Förderzusage“. Die Straße nennt der Vortrag nicht (Entscheidung 29).
// Fakten aus der Rechenmappe (Eingaben, Blatt Kennzahlen D52; daten/kennzahlen.json).
'use strict';
const { fakten, bild } = require('./_modell.cjs');

module.exports = {
  id: 'rechnung-modellhaus',
  bau(ctx) {
    const { B, colX, span, Y } = ctx, f = fakten(ctx), { fmt } = f, wl = (t, was) => ctx.wortlaut(t, was);
    const s = ctx.folie(ctx.titelzeilen([`Modellhaus: ${f.we} Wohnungen`, 'in Neu Wulmstorf'], `${f.we} Wohnungen`));
    wl(B.stempelZusatz(s).text, 'Zusatz'); B.register(s, '2.1');
    bild(ctx, s, { x: colX(1), y: Y.inhalt, w: span(7), h: Y.inhaltEnde - Y.inhalt });
    const x = colX(8), w = span(5);
    const k1 = B.kennzahl(s, { x, y: Y.inhalt, w, zahl: String(f.we), einheit: 'Wohnungen', label: wl(`Gruppe A, Mietenstufe ${f.mietenstufe}`, 'Kennzahl'),
      text: wl(`${fmt.qm(f.wf)}, im Schnitt ${fmt.qm(Math.round(f.schnitt))}. ${f.standard}.`, 'Kennzahl'), kompakt: true });
    const k2 = B.kennzahl(s, { x, y: +(k1.unten + 0.12).toFixed(3), w, zahl: fmt.dez(f.gk / 1e6, 2), einheit: 'Mio. €', label: wl('Gesamtkosten', 'Kennzahl'),
      text: wl(`${fmt.euro(f.kostenQm)} je m². Grundstück im Bestand, nicht angesetzt.`, 'Kennzahl'), kompakt: true });
    B.planlegende(s, { x, y: +(k2.unten + 0.12).toFixed(3), w, pt: 14, linie: true, eintraege: [
      { text: wl(`Vergleichsrechnung gefördert Gruppe A vs. frei finanziert. Bezug ${f.bezug}, betrachtet über ${f.bindung} Jahre.`, 'Text') }] });
  },
};
