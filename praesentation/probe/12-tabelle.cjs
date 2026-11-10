// Muster PGN_TABELLE: allgemeine Tabelle (B.tabelle) über zwölf Spalten mit Stichwort-, Text- und Zahlspalte, kräftiger Trennlinie,
// einer Zeile auf Papierfläche, Programm-Chip in der Kopfzeile und Notiz im Platzhalter „notiz“.
'use strict';
module.exports = {
  id: 'p12-tabelle',
  o: { nr: '12', layout: 'PGN_TABELLE', titel: 'Eckdaten des Programmteils 2.1',
    inhalt: 'Kicker: „FINANZIERUNG · ECKDATEN“. Titelzeilen: „Eckdaten des Programmteils 2.1:“ | „35 Jahre zinsfrei und gebunden“ (Signaturwort: „35 Jahre“).' },
  bau(ctx) {
    const { B, W, fmt, colX, ZONE } = ctx, s = ctx.folie(), T = k => W('modellhaus', 'tab.' + k);
    B.register(s, '2.1');
    B.tabellenkopf(s, { titel: 'Konditionen des Darlehens und Bindung', sub: 'Regelwerte der Richtlinie, Programmteil 2.1' });
    B.programmChip(s, { x: 12.667 - 0.42, y: ZONE.tabelle.titel + 0.02, nr: '2.1' });
    B.tabelle(s, { x: colX(1), y: ZONE.tabelle.tabelle, w: 12.0, pt: 14, spalten: [{ kopf: 'Stichwort', breite: 2.9, art: 'stichwort' }, { kopf: 'Regel' }, { kopf: 'Wert', breite: 2.0, art: 'zahl' }], zeilen: [
      ['Zins', `Zinsfrei ab Auszahlung bis Ende des ${T('zinsfreie_jahre')}. Jahres`, fmt.prozent(T('zins_nbank_bis_jahr35'))],
      ['Laufzeit', 'Höchstlaufzeit des Darlehens; ab Jahr 36 verzinst', `${T('laufzeit_hoechstens')} Jahre`],
      { zellen: ['Bindung', 'Belegungs- und Mietbindung ab Bezugsfertigkeit', `${T('bindung')} Jahre`], trennlinie: true },
      ['Verwaltungskosten', 'Beitrag auf das Restkapital, ab Auszahlungsbeginn', `${fmt.prozent(T('verwaltungskostenbeitrag'), 1)} p. a.`],
      ['Bearbeitungsentgelt', 'Einmalig, vom Darlehen und vom Zuschuss', `${fmt.prozent(T('bearbeitungsentgelt_darlehen'))} / ${fmt.prozent(T('bearbeitungsentgelt_zuschuss'), 2)}`],
      { zellen: ['Mieterhöhung', `Erstmals nach ${T('jahre_ohne_mieterhoehung')} Jahren, dann höchstens in drei Jahren`, fmt.prozent(T('mieterhoehung_in_der_bindung'), 2)], flaeche: true }] });
    B.notiz(s, 'Den Tilgungssatz legt die NBank fest. Beginn nach vollständiger Auszahlung.');
  },
};
