// Muster PGN_ABLAUF: zwei Achsleisten zu je vier Stationen mit Titel, Zuständigkeit und Text; dazwischen das Warnband, darunter eine Zeile in der Rolle „klein“.
// Station 4 (Bewilligung) trägt den gefüllten Achskreis in Dunkelrot.
'use strict';
module.exports = {
  id: 'p13-ablauf',
  o: { nr: '13', layout: 'PGN_ABLAUF', titel: 'Erst die Bewilligung, dann Verträge und Baubeginn',
    inhalt: 'Kicker: „UMSETZUNG · ANTRAGSWEG“. Titelzeilen: „Erst die Bewilligung,“ | „dann Verträge und Baubeginn“ (Signaturwort: „Verträge und Baubeginn“).' },
  bau(ctx) {
    const { B, colX } = ctx, s = ctx.folie();
    B.achsleiste(s, { x: colX(1), y: 2.33, w: 12.0, stationen: [
      { nr: 1, titel: 'Vorgespräch', zustaendig: 'Förderstelle mit Ihnen', text: 'Nachweise und Unterlagen vorab klären' },
      { nr: 2, titel: 'Antrag', zustaendig: 'Sie', text: 'bei der Wohnraumförderstelle am Bauort' },
      { nr: 3, titel: 'Stellungnahme', zustaendig: 'Förderstelle', text: 'Bedarfsbestätigung, Weiterleitung an die NBank' },
      { nr: 4, titel: 'Entscheidung', zustaendig: 'NBank', text: 'Fördervertrag oder Bescheid; Ziel: höchstens drei Monate', signal: true }] });
    B.warnband(s, { y: 3.91, kopf: '±0 Bewilligung', text: 'Vor der Bewilligung begonnene Vorhaben werden nicht gefördert.' });
    const r2 = B.achsleiste(s, { x: colX(1), y: 4.65, w: 12.0, stationen: [
      { nr: 5, titel: 'Bauausführung', zustaendig: 'Sie', text: 'Baubeginn spätestens vier Monate nach Bekanntgabe der Förderentscheidung' },
      { nr: 6, titel: 'Auszahlung', zustaendig: 'NBank', text: 'in Raten nach Baufortschritt' },
      { nr: 7, titel: 'Fertigstellung', zustaendig: 'Förderstelle mit Ihnen', text: 'Vermietung nur mit WBS' },
      { nr: 8, titel: 'Verwendungsnachweis', zustaendig: 'Sie', text: 'innerhalb von sechs Monaten nach Erfüllung des Förderzwecks' }] });
    B.text(s, 'Als Beginn gilt ein Bau-, Liefer- oder Kaufvertrag (außer für das Baugrundstück) oder der erste Spatenstich.', { x: colX(1), y: Math.max(r2.unten, 6.26), w: 12.0, h: 0.22, rolle: 'klein', valign: 'middle', einzeilig: true, name: 'Zeile unter dem Ablauf' });
  },
};
