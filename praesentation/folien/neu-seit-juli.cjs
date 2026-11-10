// Folie 9 · PGN_VERGLEICH: Förderregeln bis 30.06.2026 und seit 01.07.2026 im Vergleich (Broschüre S. 4).
// Links die Werte des alten Rechts aus daten/regeln.json, rechts die Werte der Richtlinie 2026 aus werte.json (tab.*).
'use strict';
module.exports = {
  id: 'neu-seit-juli',
  bau(ctx) {
    const { B, W, X, fmt, ZONE } = ctx, s = ctx.folie(), NB = '\u00A0';
    B.register(s, '2.1');   // erste Folie des Abschnitts „Programmteil 2.1“: Daumenregister wie auf den Folien 10 bis 12
    const T = k => W('modellhaus', 'tab.' + k), R = k => X('regeln', k);
    const paar = (a, b, nk = 0) => `**${fmt.zahl(a, nk)}/${fmt.zahl(b, nk)} €**`;       // Wertepaar Mietenstufe I–III / IV–VII, hervorgehoben
    const fett = v => `**${v}**`;
    const jahre = `Jahre 1–${T('jahre_ohne_mieterhoehung')}`;
    const mieterkreis = `Mieterkreis und Höchstmiete ${jahre} (nettokalt je m²):`;
    const alt = R('bis_2026_06_30.darlehen_anteil'), foerderung = T('quote_darlehen.A') + T('quote_zuschuss.A');

    // Kopf und Wert stehen in den Platzhaltern des Layouts. Die drei Kurzabsätze je Seite stehen als Textfelder an festen Lagen, damit Instrument,
    // Bemessung und Mieterkreis links und rechts auf gleicher Höhe beginnen (ein fließender Platzhalter verschiebt die dritte Zeile um ihre Vorgänger).
    // Hervorgehoben sind die Werte wie in der Broschüre S. 4; die Zeilenbezeichnungen stehen mager.
    const Z = ZONE.vergleich, ZEILEN_Y = [Z.text, Z.text + 0.87, Z.text + 1.74], ZEILE_H = 0.84;   // drei Zeilen 14 pt mit gut 5 % Luft
    const seite = (wo, kopf, wert, absaetze) => {
      B.vergleichFeld(s, wo, { kopf, wert });
      absaetze.forEach((t, i) => B.text(s, ctx.wortlaut(t, `${wo}, Absatz ${i + 1}`), { x: Z[wo].x, y: ZEILEN_Y[i], w: Z[wo].w, h: ZEILE_H, rolle: 'dicht', name: `${wo === 'links' ? 'Links' : 'Rechts'} Text ${i + 1}` }));
    };
    seite('links', `bis ${R('stichtage.alt_bis')}`, `${fmt.prozent(alt)} Darlehen`, [
      `Instrument: zinsloses Darlehen, ${fett(fmt.prozent(alt))} der Gesamtkosten; Tilgungsnachlass ${fett(fmt.prozent(R('bis_2026_06_30.tilgungsnachlass')))} des Darlehens nur bei geringen Einkommen`,
      `Bemessung je m² Wohnfläche: ${paar(R('bis_2026_06_30.bemessung.I'), R('bis_2026_06_30.bemessung.IV'))} Gesamtkosten, Neubau inkl. Grundstück`,
      `${mieterkreis} geringe und mittlere Einkommen; ${paar(R('bis_2026_06_30.hoechstmiete_geringe_einkommen.I'), R('bis_2026_06_30.hoechstmiete_geringe_einkommen.IV'), 2)} (geringe)`]);
    // „A:“ und das Wertepaar bleiben zusammen (geschütztes Leerzeichen)
    seite('rechts', `seit ${R('stichtage.neu_seit')}`, `${fmt.prozent(foerderung)} Förderung`, [
      `Instrument: Darlehen + Zuschuss statt Tilgungsnachlass; zusammen ${fett(fmt.prozent(foerderung))} der zuwendungsfähigen Kosten (Gruppe A: je ${fett(fmt.prozent(T('quote_zuschuss.A')))})`,
      `Bemessung je m² Wohnfläche: Ausgangswerte ${paar(T('bemessungsgrenze.I'), T('bemessungsgrenze.IV'))} Herstellungskosten; Grundstück separat bis Bodenrichtwert`,
      `${mieterkreis} Gruppen A, B, C (B/C nur mit Zulassung); A:${NB}${paar(T('hoechstmiete.I.A'), T('hoechstmiete.IV.A'), 2)}`]);

    B.vergleichFuss(s, 'Programmteil 2.1 im Vergleich · Höchstsätze · Wertepaare: Mietenstufe I–III/IV–VII · Bemessung nicht direkt vergleichbar');
  },
};
