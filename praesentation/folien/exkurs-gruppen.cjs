// Folie 12 · PGN_INHALT: Exkurs, wann die Einkommensgruppen B und C zugelassen sind (neu am 16.11.2026, Frage aus dem Kundengespräch). Links über
// acht Spalten die Regel als Stichpunkte in drei Gruppen (Grundsatz A; B und C mit einer von fünf Bedingungen; sonst +20 %), rechts über vier
// Spalten der Bedarf am Standort mit dem QR-Code zur Karte der NBank (derselbe Code wie auf der Anhangfolie der Voraussetzungen).
// Wortlaut der fünf Bedingungen wie in der Broschüre S. 6 (§ 4 Abs. 1 und 2 DVO-NWoFG); Einkommensgrenzen § 3 Abs. 2 NWoFG, gültig seit 01.03.2025.
// Recherche vom 16.11.2026 an RL, NWoFG und DVO-NWoFG; die Zahlen stehen als Text im Modul, weil daten/werte.json sie nicht führt.
'use strict';

module.exports = {
  id: 'exkurs-gruppen',
  bau(ctx) {
    const { B, colX, span, Y, P } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);
    B.register(s, '2.1');
    const gruppen = [
      { titel: 'Gruppe A ist der Grundsatz', punkte: ['Einkommen bis 21.250 € für eine Person, 28.750 € für zwei Erwachsene (§ 3 NWoFG)'] },
      { titel: 'B (bis +40 %) und C (bis +60 %), wenn eines zutrifft', punkte: [
        'kommunales Wohnraumversorgungs- oder städtebauliches Entwicklungskonzept',
        'kommunale Festlegung von gefördertem Wohnraum',
        'Gemeindeverordnung zu erhöhtem Wohnungsbedarf',
        'angespannter Wohnungsmarkt per Verordnung',
        'Wohnraum nur für Ältere, Menschen mit Behinderungen, Hilfe- oder Pflegebedürftige'] },
      { titel: 'Sonst nur bis +20 %', punkte: ['ab zwölf zusammenhängenden Wohnungen, für höchstens die Hälfte davon; Gruppe C entfällt'] }];
    gruppen.forEach(g => { wl(g.titel, 'Gruppentitel'); g.punkte.forEach(t => wl(t, 'Stichpunkt')); });
    const stp = B.stichpunkte(s, { x: colX(1), y: Y.inhalt, w: span(8), linie: true, titelAbstand: 6, punktAbstand: 1, name: 'Stichpunkte Zulassung', gruppen });
    if (stp.unten > Y.inhaltEnde + 0.005) P.melde(`Stichpunkte enden bei y ${stp.unten.toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);

    // Rechts: Bedarf am Standort, eigene Voraussetzung auch für A; QR-Code zur Karte der NBank
    const x = colX(9) + 0.12, w = span(4) - 0.12, QR = 1.25;
    const yT = B.modulkopf(s, { x, y: Y.inhalt, w, titel: wl('Bedarf am Standort', 'Modultitel') });
    const text = wl('Eigene Voraussetzung, auch für Gruppe A. Die Wohnraumförderstelle bestätigt den Bedarf am Bauort; die Karte der NBank zeigt die Lage je Gemeinde.', 'Text Bedarf');
    const t = B.text(s, text, { x, y: yT + 0.10, w, rolle: 'dicht', name: 'Text Bedarf' });
    const yQ = +((t && t.unten ? t.unten : yT + 1.5) + 0.22).toFixed(3);
    s.addImage({ path: ctx.asset('qr-nbank-karte.png'), x, y: yQ, w: QR, h: QR, altText: 'QR-Code: Karte der NBank zur Wohnraumförderung mit den Bedarfsnachweisen je Gemeinde', objectName: 'QR-Code Karte der NBank' });
    B.text(s, wl('Aktuelle Karte', 'Beschriftung des QR-Codes'), { x: x + QR + 0.16, y: yQ + QR - 0.52, w: w - QR - 0.16, h: 0.22, rolle: 'vorsatz', valign: 'middle', einzeilig: true, name: 'Beschriftung QR-Code' });
    B.text(s, wl('nbank.de', 'Beschriftung des QR-Codes'), { x: x + QR + 0.16, y: yQ + QR - 0.28, w: w - QR - 0.16, h: 0.22, rolle: 'klein', valign: 'middle', einzeilig: true, name: 'Ziel QR-Code' });
    const hinweis = wl('Kein Anspruch: B und C lässt die NBank in der Förderentscheidung zu (§ 4 DVO-NWoFG).', 'Hinweiskasten');
    B.hinweis(s, { x, y: Y.inhaltEnde, unten: true, w, name: 'Zulassung', text: hinweis });
    if (yQ + QR > Y.inhaltEnde - B.hinweisHoehe(hinweis, { w }) - 0.08) P.melde(`QR-Code endet bei y ${(yQ + QR).toFixed(2)} und stößt an den Hinweiskasten.`);
    if (yQ + QR > Y.inhaltEnde + 0.005) P.melde(`QR-Code endet bei y ${(yQ + QR).toFixed(2)}, die Inhaltszone bei ${Y.inhaltEnde.toFixed(2)}.`);
  },
};
