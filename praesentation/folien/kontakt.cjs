// Folie 25 · Schluss und Kontakt (PGN_SCHLUSS): Claim der Broschüre U4 mit der ersten Zeile in zweiter Stimme, Einladung zum Gespräch.
// Grundriss, Logo, Anschrift, Telefon, E-Mail, Web und QR-Code liegen im Layout; das Modul prüft die Texte gegen das Konzept.
'use strict';

module.exports = {
  id: 'kontakt',
  bau(ctx) {
    const { X } = ctx;
    ctx.folie();   // Titel in drei Zeilen, Signaturwort und Untertitel aus dem Konzept
    // Kontaktblock des Layouts (lib/layouts.cjs liest ihn aus daten/rahmen.json, Broschüre S. 24): Gegenprobe gegen das Konzept
    for (const k of ['firma', 'anschrift', 'telefon', 'email', 'web', 'qr_ziel']) ctx.wortlaut(X('rahmen', 'kontakt.' + k), 'Kontaktblock');
    for (const t of ['Telefon', 'E-Mail', 'Web']) ctx.wortlaut(t, 'Kontaktblock');
  },
};
