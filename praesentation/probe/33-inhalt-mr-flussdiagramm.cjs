// Muster PGN_INHALT_MR: Flussdiagramm aus nativen Formen (D.fluss). Drei Quellen links, ein Knoten in der Mitte, zwei Ziele rechts;
// jedes Band ist so dick wie sein Betrag (Maßstab in Euro je Zoll Höhe). Farbrollen der Bibliothek (tinte, referenz, hell, blass) und eine
// eigene Rolle über „arten“ (Zuschuss in Rot). Beschriftet wird mit B.text und B.bezeichnungMitWert an den Lagen der Rückgabe; der
// Alternativtext nennt jeden Strom mit seinem Betrag. Werte aus daten/werte.json (Lauf modellhaus).
'use strict';
module.exports = {
  id: 'p33-inhalt-mr-flussdiagramm',
  o: { nr: '33', layout: 'PGN_INHALT_MR', titel: 'Von 7,0 Mio. € Gesamtkosten trägt die Förderung 5,6 Mio. €',
    inhalt: 'Kicker: „IHRE RECHNUNG · FINANZIERUNG“. Titelzeilen: „Von 7,0 Mio. € Gesamtkosten“ | „trägt die Förderung 5,6 Mio. €“ (Signaturwort: „5,6 Mio. €“).' },
  bau(ctx) {
    const { B, D, W, C, fmt, colX, Y, Raster } = ctx, s = ctx.folie(), M = k => W('modellhaus', k);
    B.register(s, '2.1');
    B.modulkopf(s, { x: colX(1), y: Y.inhalt, w: Raster.CW, titel: 'Mittelherkunft und Mittelverwendung', sub: 'in Mio. € · Modellhaus, Gruppe A · die Stärke der Bänder entspricht dem Betrag' });

    // Maßstab und Lagen: Angaben der Zeichnung. Quellen und Ziele stehen mit Abstand untereinander, der Knoten mittig dazwischen
    const MASSSTAB = 2500000, zoll = v => v / MASSSTAB, X = { quelle: 3.40, knoten: 6.50, ziel: 9.60 }, OBEN = 3.20, ABSTAND = 0.14;
    const quellen = [{ id: 'zuschuss', name: 'Zuschuss', wert: M('fin.zuschuss.A'), art: 'zuschuss' }, { id: 'darlehen', name: 'Darlehen', wert: M('fin.darlehen_nbank.A'), art: 'tinte' },
      { id: 'eigenmittel', name: 'Eigenmittel', wert: M('fin.eigenmittel.A'), art: 'hell' }];
    const ziele = [{ id: 'herstellung', name: 'Herstellungskosten', wert: M('fin.herstellungskosten'), art: 'referenz' }, { id: 'grundstueck', name: 'Grundstück', wert: M('fin.grundstueck'), art: 'blass' }];
    const gesamt = M('fin.gesamtkosten.A');
    ctx.gleich('Summe der Quellen gegen die Gesamtkosten', quellen.reduce((a, q) => a + q.wert, 0), gesamt);
    ctx.gleich('Summe der Ziele gegen die Gesamtkosten', ziele.reduce((a, z) => a + z.wert, 0), gesamt);
    const stapel = liste => { let y = OBEN; return liste.map(e => { const r = { ...e, y }; y += zoll(e.wert) + ABSTAND; return r; }); };
    const Q = stapel(quellen), Z = stapel(ziele), hoehe = l => l[l.length - 1].y + zoll(l[l.length - 1].wert) - OBEN;
    const yKnoten = OBEN + (Math.max(hoehe(Q), hoehe(Z)) - zoll(gesamt)) / 2;

    const d = D.fluss(s, { name: 'Flussdiagramm Finanzierung', massstab: MASSSTAB, arten: { ...D.FLUSSART, zuschuss: { farbe: C.rot } },
      altText: `Flussdiagramm: Gesamtkosten ${fmt.mio(gesamt)}. Mittelherkunft: ${quellen.map(q => `${q.name} ${fmt.mio(q.wert)}`).join(', ')}. Mittelverwendung: ${ziele.map(z => `${z.name} ${fmt.mio(z.wert)}`).join(', ')}.`,
      knoten: [...Q.map(q => ({ id: q.id, x: X.quelle, y: q.y, name: q.name, art: q.art })), { id: 'gesamt', x: X.knoten, y: yKnoten, name: 'Gesamtkosten', wert: gesamt },
        ...Z.map(z => ({ id: z.id, x: X.ziel, y: z.y, name: z.name, art: z.art }))],
      stroeme: [...Q.map(q => ({ von: q.id, nach: 'gesamt', wert: q.wert, art: q.art, name: q.name })), ...Z.map(z => ({ von: 'gesamt', nach: z.id, wert: z.wert, art: z.art, name: z.name }))] });

    // Beschriftung in Leserichtung: Quellen (rechtsbündig vor dem Balken), Knoten (über dem Balken), Ziele (rechts vom Balken)
    const zeile = (name, wert, mitte, x, w, align) => {
      B.text(s, name, { x, y: mitte - 0.22, w, h: 0.22, rolle: 'bezeichnung', align, valign: 'middle', einzeilig: true, name: 'Bezeichnung ' + name });
      B.text(s, fmt.mio(wert), { x, y: mitte, w, h: 0.22, rolle: 'wert', align, valign: 'middle', einzeilig: true, name: 'Betrag ' + name });
    };
    for (const q of quellen) zeile(q.name, q.wert, d.knoten[q.id].mitte, colX(1), X.quelle - 0.14 - colX(1), 'right');
    const k = d.knoten.gesamt;
    B.bezeichnungMitWert(s, { y: k.y - 0.30, bezeichnung: { text: 'Gesamtkosten', x: k.x - 1.20, w: 1.24, align: 'right' }, wert: { text: fmt.mio(gesamt), x: k.x + 0.12, w: 1.20 } });
    for (const z of ziele) zeile(z.name, z.wert, d.knoten[z.id].mitte, d.knoten[z.id].rechts + 0.14, Raster.X1 - d.knoten[z.id].rechts - 0.14, 'left');
  },
};
