// Folie A8 · Quellen und Hinweis (PGN_ANHANG): native Tabelle über zwölf Spalten (Folie | Quelle), darunter der Rechtshinweis im festen
// Wortlaut als Kasten auf Fläche mit Modulkopf-Linie und zwei Sätze zu Herausgeber und Bildnachweis.
// Texte und Kennungen stehen in daten/rahmen.json (quellen.*); die Blattnummern rechnet _struktur.cjs aus dem Feld „quellen“ aller Folien
// des Konzepts, Version und Stand der Mappe kommen aus werte.json (meta). Kein Prüfvermerk auf der Folienfläche (er steht in INHALT.md, in der README und in den Datendateien).
// Die Folien 3 bis 6 und 22 tragen dazu eine Kurzform ihrer Quelle im Schriftfeld (B.quelle); die volle Angabe steht nur hier.
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'quellen',
  bau(ctx) {
    const { B, X, colX, Y, Raster } = ctx, s = ctx.folie(), Q = k => X('rahmen', 'quellen.' + k), wl = (t, was) => ctx.wortlaut(t, was);
    const x = colX(1), w = Raster.CW, spalte = Raster.PITCH + Raster.GUT;   // Spalte „Folie“: eine Rasterspalte und ein Steg, damit „14–24, A6, A7“ in einer Zeile bleibt

    const zeilen = S.quellenZeilen(ctx);
    // dicht: Tabelle, Hinweis und die beiden Sätze füllen die Inhaltszone; mit dem Zuschlag je Zeile der gewöhnlichen Tabelle passten sieben Zeilen nicht
    // Zellränder 0,03 statt 0,06 und 0,05 (seit der Änderungsrunde vom 13.11.2026): Die Tabelle hat mit den Quellen der Folie A6 eine Zeile mehr
    // (F38.2); die Schrift bleibt 12 pt
    const t = B.tabelle(s, { x, y: Y.anhangInhalt, w, pt: 12, dicht: true, zellrand: [0.03, 0.03], name: 'Quellentabelle', schlusslinie: false,   // die Linie des Hinweis-Kastens schließt die Tabelle
      // schmaler rechter Zellrand in der Spalte „Folie“; die Quelle beginnt mit eigenem Zellrand um einen Steg rechts von colX(2)
      spalten: [{ kopf: wl('Folie'), breite: spalte, art: 'stichwort', randRechts: 0.02 }, { kopf: wl('Quelle') }], zeilen: zeilen.map(z => [z.folien, z.text]) });

    // Rechtshinweis: genau einmal im Vortrag, Wortlaut der Broschüre S. 23. Der Kasten schließt als Fuß an die Tabelle an (eine Linie statt
    // zweier dicht übereinander): Stichwort in der Spalte „Folie“, Text in der Spalte „Quelle“
    // Innenrand 0,05 statt 0,18 (Änderungsrunde vom 13.11.2026): Die Zeile „alle“ nennt seitdem auch die NBank-Produktinformation, Stand 05.11.2026
    // (Quelle der Folie 9, F9.1), die Zeile „4, 5“ die GdW-Präsentation, und die Zeile „A6“ ist neu (F38.2)
    // Herausgeber und Bildnachweis stehen seit der Prüfrunde vom 13.11.2026 als eigene Absätze im Hinweisblock (kein frei hängender kleiner Text)
    const text = [wl(Q('hinweis'), 'Hinweis'), wl(Q('herausgeber'), 'Herausgeber'), wl(Q('bildnachweis'), 'Bildnachweis')].join('\n');
    const k = B.hinweisKasten(s, { x, y: t.unten, w, spalte, rand: 0.05, stichwort: wl('Hinweis'), text });
    if (k.unten > Y.inhaltEnde) ctx.P.melde(`Quellenfolie: Tabelle und Hinweisblock reichen bis y ${k.unten.toFixed(2)}, die Inhaltszone endet bei ${Y.inhaltEnde}. Eine Tabellenzeile kürzen oder zusammenfassen.`);

  },
};
