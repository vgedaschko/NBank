// Folie 1 · Titel (PGN_TITEL): Claim der Broschüre in zwei Zeilen, Untertitel, Kennzahlfeld „bis zu 80 %“, Bildzeile an der Axonometrie.
// Kopfleiste, Schriftfeld (Herausgeber, Stand, „Vortrag“ mit Eingabefeld „Ort, Datum“) und Logo liegen im Layout; das Eingabefeld bleibt leer.
'use strict';

module.exports = {
  id: 'titel',
  bau(ctx) {
    const { B, W, X, fmt, HEX } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);   // Titelzeilen, Signaturwort und Untertitel aus dem Konzept

    // Feste Texte des Layouts (lib/layouts.cjs liest sie aus daten/rahmen.json, Broschüre S. 1): Gegenprobe gegen das Konzept
    for (const t of [...['kopfleiste', 'herausgeber', 'sitz', 'stand'].map(k => X('rahmen', 'titel.' + k)), 'Herausgeber', 'Vortrag', 'Ort, Datum']) wl(t, 'Schriftfeld');

    // Kennzahlfeld: Förderquote in Gruppe A = Darlehen + Zuschuss (Höchstsätze der Richtlinie, Programmteil 2.1)
    const quote = W('modellhaus', 'tab.quote_darlehen.A') + W('modellhaus', 'tab.quote_zuschuss.A');
    wl(fmt.prozent(quote), 'Kennzahl');
    // Bezug fest gebrochen wie auf U1 der Broschüre („Förderquote aus“ | „Darlehen und Zuschuss“), sonst stünde „Zuschuss“ allein in der zweiten Zeile.
    // Zusatz: „Kosten · Programmteil 2.1“ bleibt zusammen (kein Trennpunkt am Zeilenende)
    B.titelKennzahl(s, { vorsatz: wl('bis zu'), zahl: fmt.zahl(quote * 100), einheit: '%',
      bezug: wl('Förderquote aus Darlehen und Zuschuss').replace(' aus ', ' aus\n'), zusatz: wl(`der zuwendungsfähigen ${fmt.nb('Kosten · Programmteil 2.1')}`) });

    // Bildzeile unter der Zeichnung, gebrochen wie auf U1 der Broschüre: Projekt und Ort | Wohnungen und Förderung.
    // Unterkante 0,14 über der Linie des Schriftfelds (y 5,70), rechts neben der Maßstabsleiste der Zeichnung
    const projekt = 'Referenzprojekt Brauerstraße, Rotenburg (Wümme)', angaben = `${X('rahmen', 'referenz.wohnungen')} barrierefreie Wohnungen · mit Förderung der NBank`;
    wl(`${projekt} · ${angaben}`, 'Bildzeile');
    B.text(s, `${projekt}\n${angaben}`, { x: 7.60, y: 5.18, w: 5.28, h: 0.38, rolle: 'label', farbe: HEX.hauch, align: 'right', valign: 'bottom', name: 'Bildzeile' });
  },
};
