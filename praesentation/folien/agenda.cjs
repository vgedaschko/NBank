// Folie 7 · PGN_INHALT: Inhalt des Vortrags. Oben die Achse mit vier Achskreisen, je Abschnitt des Hauptteils einer, mit senkrechter Achslinie,
// Name und einer Zeile Inhalt; dieselbe Zählung trägt die Achsleiste der Trenner (Folien 2, 8, 13, 25). Darunter das Register der sechs Programmteile:
// Der Vortrag behandelt 2.1 (Feld auf dem Ton seiner Programmfarbe), die Felder 2.2 bis 2.6 nennen die Seite der Broschüre.
// Texte aus daten/rahmen.json (Block agenda), Namen der Programmteile aus daten/markt.json (programmteile.zeilen, Broschüre S. 5).
// Der Satz unter dem Modultitel nennt, wo die übrigen Programmteile stehen. Den Fokus nennen der Titel der Folie und das Feld 2.1 des Registers;
// der frühere erste Satz („Der Vortrag behandelt 2.1.“) sagte dasselbe ein drittes Mal und ist gestrichen (Entscheidung 34).
// Kein Schlüsselplan in der Kickerzeile: Das Register steht auf der Folie. Rot nur am Feld 2.1 (Chip und Ton seiner Programmfarbe).
'use strict';
const S = require('./_struktur.cjs');

module.exports = {
  id: 'agenda',
  bau(ctx) {
    const { B, X, P, colX, Y, Raster, outline } = ctx, s = ctx.folie(), wl = (t, was) => ctx.wortlaut(t, was);

    // ---- Abschnitte: Zahl, Reihenfolge und Namen wie im Konzept (Feld „abschnitt“ der Folien des Hauptteils) ------------------------------
    const stationen = X('rahmen', 'agenda.abschnitte'), imKonzept = S.abschnitte(ctx);
    if (stationen.length !== imKonzept.length || stationen.some((t, i) => t.name !== imKonzept[i] || String(t.nr) !== String(i + 1)))
      P.melde(`Agenda: daten/rahmen.json nennt die Abschnitte ${stationen.map(t => `${t.nr} ${t.name}`).join(', ')}; das Konzept hat ${imKonzept.map((a, i) => `${i + 1} ${a}`).join(', ')}.`);
    stationen.forEach(t => wl(`„${t.nr}“ · „${t.name}“ · „${t.inhalt}“`, `Abschnitt ${t.nr}`));
    // Je Abschnitt drei Rasterspalten. Die Achskreise beginnen 0,04 über der Inhaltskante: Ein Kreis wirkt tiefer als eine Linie auf derselben Höhe,
    // und das Register darunter braucht die Höhe für dreizeilige Namen. steg 0,10: Die Textfelder reichen bis 0,10 Zoll vor die nächste Achslinie
    // (2,76 Zoll); die erste Zeile des Abschnitts 2 hat so gut 8 % Luft und bricht auch mit etwas breiterer Schrift nicht in drei Zeilen.
    const achse = S.achsreihe(ctx, s, { x: colX(1), y: Y.inhalt - 0.04, w: Raster.CW, schritt: 3 * Raster.PITCH, stationen, steg: 0.10 });

    // ---- Register der Programmteile -----------------------------------------------------------------------------------------------
    const namen = new Map(X('markt', 'programmteile.zeilen').map(z => [z.nr, z.name])), aktiv = X('rahmen', 'agenda.register.aktiv');
    const felder = X('rahmen', 'agenda.register').map(f => {
      if (!namen.has(f.nr)) P.melde(`Agenda: Programmteil ${f.nr} steht nicht in daten/markt.json (programmteile.zeilen).`);
      wl(`„${f.nr}“ · „${namen.get(f.nr)}“ · „${f.verweis}“`, `Register ${f.nr}`);
      return { nr: f.nr, name: namen.get(f.nr), verweis: f.verweis };
    });
    // Der Satz unter dem Modultitel nennt die Anhangfolie der Programmteile mit ihrer Blattnummer
    const satz = wl(X('rahmen', 'agenda.register.untertitel'), 'Untertitel'), a1 = outline.folien.find(f => f.id === 'anhang-programmteile');
    if (!a1 || !satz.includes(`Anhang ${a1.nr}`)) P.melde(`Agenda: Der Satz zum Register nennt die Anhangfolie der Programmteile nicht mit ihrer Blattnummer (${a1 ? a1.nr : 'fehlt im Konzept'}).`);
    const yKopf = achse.unten + 0.20;
    B.modulkopf(s, { x: colX(1), y: yKopf, w: Raster.CW, titel: wl(X('rahmen', 'agenda.register.titel'), 'Modultitel') });
    B.text(s, satz, { x: colX(1), y: yKopf + 0.37, w: Raster.CW, h: 0.26, rolle: 'dicht', valign: 'middle', einzeilig: true, name: 'Untertitel Register' });
    const yFelder = yKopf + 0.72;
    S.register(ctx, s, { x: colX(1), y: yFelder, w: Raster.CW, h: Y.inhaltEnde - yFelder, felder, aktiv });
  },
};
