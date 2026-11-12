// Folie A9 · Quellen und Hinweis (PGN_ANHANG): native Tabelle über zwölf Spalten (Folie | Quelle), darunter der Rechtshinweis im festen
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
    const x = colX(1), w = Raster.CW, spalte = Raster.PITCH + Raster.GUT;   // Spalte „Folie“: eine Rasterspalte und ein Steg, damit „14–24, A7, A8“ in einer Zeile bleibt

    const zeilen = S.quellenZeilen(ctx);
    // dicht: Tabelle, Hinweis und die beiden Sätze füllen die Inhaltszone; mit dem Zuschlag je Zeile der gewöhnlichen Tabelle passten sieben Zeilen nicht
    const t = B.tabelle(s, { x, y: Y.anhangInhalt, w, pt: 12, dicht: true, name: 'Quellentabelle', schlusslinie: false,   // die Linie des Hinweis-Kastens schließt die Tabelle
      // schmaler rechter Zellrand in der Spalte „Folie“; die Quelle beginnt mit eigenem Zellrand um einen Steg rechts von colX(2)
      spalten: [{ kopf: wl('Folie'), breite: spalte, art: 'stichwort', randRechts: 0.02 }, { kopf: wl('Quelle') }], zeilen: zeilen.map(z => [z.folien, z.text]) });

    // Rechtshinweis: genau einmal im Vortrag, Wortlaut der Broschüre S. 23. Der Kasten schließt als Fuß an die Tabelle an (eine Linie statt
    // zweier dicht übereinander): Stichwort in der Spalte „Folie“, Text in der Spalte „Quelle“
    const k = B.hinweisKasten(s, { x, y: t.unten, w, spalte, stichwort: wl('Hinweis'), text: wl(Q('hinweis'), 'Hinweis') });

    // Herausgeber und Bildnachweis: zwei Zeilen in 12 pt an der Unterkante der Inhaltszone (wie die Notiz unter einer Tabelle)
    const saetze = `${wl(Q('herausgeber'), 'Herausgeber')}\n${wl(Q('bildnachweis'), 'Bildnachweis')}`, h = B.hoehe(saetze, { rolle: 'kleinText', w }), y = +(Y.inhaltEnde - h).toFixed(3);
    // Die Zone ist fast voll: Wächst die Tabelle um eine Zeile, liefe der Kasten in die beiden Sätze (die Zonenprüfung sieht keine Überlagerung)
    if (k.unten + 0.12 > y) ctx.P.melde(`Quellenfolie: Tabelle und Hinweis reichen bis y ${k.unten.toFixed(2)}, die Sätze zu Herausgeber und Bildnachweis beginnen bei y ${y.toFixed(2)}. Eine Tabellenzeile kürzen oder zusammenfassen.`);
    B.text(s, saetze, { x, y, w, h, rolle: 'kleinText', name: 'Herausgeber und Bildnachweis' });
  },
};
