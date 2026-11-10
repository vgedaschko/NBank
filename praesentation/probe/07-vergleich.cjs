// Muster PGN_VERGLEICH im Wortlaut der Folie 7 des Konzepts: alt → neu in den Platzhaltern des Layouts (links grau, rechts auf Papierfläche),
// je Seite drei Absätze in 14 pt mit halbfetter Zeilenbezeichnung („**…**“); darunter die Fußzeile über beide Seiten (Platzhalter „fuss“).
'use strict';
module.exports = {
  id: 'p07-vergleich',
  o: { nr: '7', layout: 'PGN_VERGLEICH', titel: 'Seit 01.07.2026: Darlehen plus Zuschuss statt Tilgungsnachlass',
    inhalt: 'Kicker: „ÜBERBLICK · NEUERUNGEN“. Titelzeilen: „Seit 01.07.2026: Darlehen plus“ | „Zuschuss statt Tilgungsnachlass“ (Signaturwort: „Zuschuss“).' },
  bau(ctx) {
    const { B } = ctx, s = ctx.folie();
    B.vergleichFeld(s, 'links', { kopf: 'bis 30.06.2026', wert: '75 % Darlehen', pt: 14, text: [
      '**Instrument:** zinsloses Darlehen, 75 % der Gesamtkosten; Tilgungsnachlass 30 % des Darlehens nur bei geringen Einkommen',
      '**Bemessung je m² Wohnfläche:** 5.330/5.550 € Gesamtkosten, Neubau inkl. Grundstück',
      '**Mieterkreis und Höchstmiete Jahre 1–3 (nettokalt je m²):** geringe und mittlere Einkommen; 6,30/6,60 € (geringe)'] });
    B.vergleichFeld(s, 'rechts', { kopf: 'seit 01.07.2026', wert: '80 % Förderung', pt: 14, text: [
      '**Instrument:** Darlehen + Zuschuss statt Tilgungsnachlass; zusammen 80 % der zuwendungsfähigen Kosten (Gruppe A: je 40 %)',
      '**Bemessung je m² Wohnfläche:** Ausgangswerte 4.800/5.000 € Herstellungskosten; Grundstück separat bis Bodenrichtwert',
      '**Mieterkreis und Höchstmiete Jahre 1–3 (nettokalt je m²):** Gruppen A, B, C (B/C nur mit Zulassung); A: 6,50/6,80 €'] });
    B.vergleichFuss(s, 'Programmteil 2.1 im Vergleich · Höchstsätze · Wertepaare: Mietenstufe I–III/IV–VII · Bemessung nicht direkt vergleichbar');
  },
};
