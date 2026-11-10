// Folie A8 · PGN_ANHANG: Markt in Niedersachsen (Broschüre S. 3). Links über vier Spalten die Kennzahl 28 % mit Label, rechts über acht
// Spalten 58 Einheitenquadrate in vier Reihen (1 Quadrat = 1.000 Wohnungen): 16 gefüllt in Tinte (vier volle Spalten), 42 in Grau, mit Maßkette
// darüber; darunter als zweite Kennzahl der Bestand. Zahlen aus daten/markt.json; Quote und Zahl der Quadrate sind aus den beiden Zahlen nachgerechnet.
// Die Aussage „28 %“ steht im Titel und in der Kennzahl; einen dritten Satz dazu trägt die Folie nicht.
'use strict';
const { lies } = require('./_ueberblick.cjs');

module.exports = {
  id: 'anhang-markt',
  bau(ctx) {
    const { B, X, fmt, colX, span, Y, P } = ctx, s = ctx.folie(), U = lies(ctx), T = k => ctx.wortlaut(U('markt.texte.' + k), k), y0 = Y.anhangInhalt;
    const aus = X('markt', 'markt.ausgelaufen'), neu = X('markt', 'markt.neu_gefoerdert'), je = X('markt', 'markt.je_quadrat'), quote = X('markt', 'markt.quote');
    const n = Math.round(aus / je), voll = Math.round(neu / je);
    ctx.gleich('Quote der neu geförderten Bindungen', neu / aus, quote, 2);
    ctx.wortlaut(`${n} Quadrate, davon ${voll} gefüllt`, 'Einheitenquadrate');
    if (!ctx.o.titel.includes(ctx.glatt(fmt.prozent(quote)))) P.melde(`Titel der Folie nennt die Quote nicht mit ${fmt.prozent(quote)}.`);

    // ---- Kennzahl über vier Spalten -----------------------------------------------------------------------------------------
    B.kennzahl(s, { x: colX(1), y: y0, w: span(4), gross: true, zahl: fmt.zahl(quote * 100), einheit: '%', label: T('kennzahl_label') });

    // ---- Einheitenquadrate über acht Spalten: vier Reihen, 15 Spalten füllen die Breite (Fuge 0,06) -------------------------------------
    // Die Quadrate sind das dominante Element der Folie und reichen so hoch wie die Kennzahl mit Label und Satz. Oberlinie wie an der Kennzahl.
    const x = colX(5), REIHEN = 4, fuge = 0.06, spalten = Math.ceil(n / REIHEN), q = +((span(8) - (spalten - 1) * fuge) / spalten).toFixed(4), yQ = y0 + 0.62;
    if (voll % REIHEN) P.melde(`Einheitenquadrate: ${voll} gefüllte Quadrate ergeben in ${REIHEN} Reihen keine vollen Spalten; die Maßkette träfe die Grenze nicht.`);
    B.linie(s, { x, y: y0, w: span(8), art: 'tinte', name: 'Oberlinie Einheiten' });
    const e = B.einheiten(s, { x, y: yQ, n, gefuellt: voll, reihen: REIHEN, q, fuge, art: 'tinte', rest: 'bisher' });
    // Maßkette ohne Werte, Teilung in der Fuge nach der letzten gefüllten Spalte; die beiden Bezeichnungen stehen 0,10 über der Linie.
    // „rund 16.000 neu gefördert“ ist breiter als sein Segment und liefe auf der Höhe der Maßstriche in den mittleren Strich.
    const yM = yQ - 0.14, xGrenze = e.xNach(voll);
    B.masskette(s, { x, y: yM, w: e.w, segmente: [{ anteil: xGrenze - x }, { anteil: x + e.w - xGrenze }] });
    B.text(s, T('mass_neu'), { x: x + 0.06, y: yM - 0.34, w: 3.0, h: 0.24, rolle: 'wert', valign: 'bottom', einzeilig: true, name: 'Maßkettenwert neu gefördert' });
    B.text(s, T('mass_rest'), { x: xGrenze, y: yM - 0.34, w: x + e.w - xGrenze, h: 0.24, rolle: 'wert', align: 'center', valign: 'bottom', einzeilig: true, name: 'Maßkettenwert nicht ersetzt' });
    B.text(s, T('legende'), { x, y: yQ + e.h + 0.12, w: e.w, h: 0.24, rolle: 'legende', farbe: 'sekundaer', valign: 'middle', einzeilig: true, name: 'Legende Einheiten' });

    // ---- Bestand: zweite Kennzahl unter der Legende der Quadrate (44 pt; die 28 % bleiben mit 60 pt die größte Zahl der Folie) ----------------
    const yB = yQ + e.h + 0.12 + 0.24 + 0.22;
    const bestand = B.kennzahl(s, { x, y: yB, w: e.w, zahl: ctx.wortlaut(fmt.zahl(X('markt', 'markt.bestand')), 'Bestand'), label: T('bestand_label'), text: T('bestand_text') });
    if (bestand.unten > Y.inhaltEnde) P.melde(`Kennzahl Bestand endet bei y ${bestand.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
  },
};
