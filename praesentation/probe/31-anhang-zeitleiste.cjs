// Muster PGN_ANHANG im Wortlaut der Folie A2 des Konzepts: Achtung-Kasten (nur Vorhabenbeginn und Frist) und darunter eine Zeitleiste aus
// B.achsleiste: Achskreise S, Datum als Titel in Montserrat Bold 12 (versalTitel: false), Text 12 pt, Zusatz 12 pt in Grau; die Marke 31.12.2026 als Signal.
// anteile gibt der Station mit dem langen Wort mehr Breite.
'use strict';
module.exports = {
  id: 'p31-anhang-zeitleiste',
  o: { nr: 'A2', layout: 'PGN_ANHANG', titel: 'Wahlrecht Modernisierung: Antrag bis 31.12.2026', inhalt: 'Kicker: „ANHANG · STICHTAG“.' },
  bau(ctx) {
    const { B, colX, Y } = ctx, s = ctx.folie(), y0 = Y.anhangInhalt;
    B.achtung(s, { x: colX(1), y: y0, w: 12.0, h: 1.52, label: 'Frist 31.12.2026', text: 'Geht Ihr Modernisierungsantrag bis 31.12.2026 bei der Wohnraumförderstelle ein, können Sie darin ausdrücklich das alte Recht (Förderregeln 2024) wählen. Die Wahl ist bindend; das alte Recht gilt dann bis zum Abschluss des Verfahrens. Ohne Wahl gilt die RL 2026; Neubau, Ersterwerb und alle übrigen Vorhaben werden nur nach RL 2026 gefördert.' });
    const y = B.modulkopf(s, { x: colX(1), y: y0 + 1.80, w: 12.0, titel: 'Stichtage Juni 2026 bis Dezember 2031' });
    const z = B.achsleiste(s, { x: colX(1), y: y + 0.30, w: 12.0, art: 'text', groesse: 'S', versalTitel: false, pt: 12, anteile: [0.9, 1, 1.05, 1.25, 0.9, 0.9], stationen: [
      { titel: '30.06.2026', text: 'Förderregeln 2024 enden' },
      { titel: '01.07.2026', text: 'RL Mietwohnraum 2026 in Kraft' },
      { titel: '31.12.2026', text: 'Wahlrecht Modernisierung', zusatz: 'Antragseingang bei der Wohnraumförderstelle', signal: true },
      { titel: '01.01.2027', text: 'Neue Rechennorm für Energiebedarfsausweise', zusatz: 'Klassengrenzen unverändert' },
      { titel: '2027', text: 'Neue Mietenstufen geplant', zusatz: 'Entwurf' },
      { titel: '31.12.2031', text: 'RL Mietwohnraum 2026 läuft aus' }] });
    B.text(s, 'Programmteil 2.3 nach RL 2026: Zuschuss je nach Klassensprung und Einkommensgruppe bis zu 10–40 %, höchstens 9.000–31.000 € je gebundener Wohnung.', { x: colX(1), y: Math.max(z.unten + 0.25, 5.90), w: 12.0, rolle: 'kleinText', name: 'Zeile unter der Zeitleiste' });
  },
};
