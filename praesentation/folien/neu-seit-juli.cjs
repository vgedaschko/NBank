// Folie 3 · PGN_VERGLEICH: Förderregeln bis 30.06.2026 und seit 01.07.2026 im Vergleich (Broschüre S. 4).
// Links die Werte des alten Rechts aus daten/regeln.json, rechts die Werte der Richtlinie 2026 aus werte.json (tab.*).
'use strict';
module.exports = {
  id: 'neu-seit-juli',
  bau(ctx) {
    const { B, W, X, fmt } = ctx, s = ctx.folie();
    const T = k => W('modellhaus', 'tab.' + k), R = k => X('regeln', k);
    const paar = (a, b, nk = 0) => `${fmt.zahl(a, nk)}/${fmt.zahl(b, nk)} €`;           // Wertepaar Mietenstufe I–III / IV–VII
    const jahre = `Jahre 1–${T('jahre_ohne_mieterhoehung')}`;
    const mieterkreis = `**Mieterkreis und Höchstmiete ${jahre} (nettokalt je m²):**`;
    const alt = R('bis_2026_06_30.darlehen_anteil'), foerderung = T('quote_darlehen.A') + T('quote_zuschuss.A');

    B.vergleichFeld(s, 'links', { kopf: `bis ${R('stichtage.alt_bis')}`, wert: `${fmt.prozent(alt)} Darlehen`, pt: 14, text: [
      `**Instrument:** zinsloses Darlehen, ${fmt.prozent(alt)} der Gesamtkosten; Tilgungsnachlass ${fmt.prozent(R('bis_2026_06_30.tilgungsnachlass'))} des Darlehens nur bei geringen Einkommen`,
      `**Bemessung je m² Wohnfläche:** ${paar(R('bis_2026_06_30.bemessung.I'), R('bis_2026_06_30.bemessung.IV'))} Gesamtkosten, Neubau inkl. Grundstück`,
      `${mieterkreis} geringe und mittlere Einkommen; ${paar(R('bis_2026_06_30.hoechstmiete_geringe_einkommen.I'), R('bis_2026_06_30.hoechstmiete_geringe_einkommen.IV'), 2)} (geringe)`] });

    B.vergleichFeld(s, 'rechts', { kopf: `seit ${R('stichtage.neu_seit')}`, wert: `${fmt.prozent(foerderung)} Förderung`, pt: 14, text: [
      `**Instrument:** Darlehen + Zuschuss statt Tilgungsnachlass; zusammen ${fmt.prozent(foerderung)} der zuwendungsfähigen Kosten (Gruppe A: je ${fmt.prozent(T('quote_zuschuss.A'))})`,
      `**Bemessung je m² Wohnfläche:** Ausgangswerte ${paar(T('bemessungsgrenze.I'), T('bemessungsgrenze.IV'))} Herstellungskosten; Grundstück separat bis Bodenrichtwert`,
      `${mieterkreis} Gruppen A, B, C (B/C nur mit Zulassung); A: ${paar(T('hoechstmiete.I.A'), T('hoechstmiete.IV.A'), 2)}`] });

    B.vergleichFuss(s, 'Programmteil 2.1 im Vergleich · Höchstsätze · Wertepaare: Mietenstufe I–III/IV–VII · Bemessung nicht direkt vergleichbar');
  },
};
