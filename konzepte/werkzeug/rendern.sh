#!/usr/bin/env bash
# Rendert eine Entwurfsmappe zum Ansehen und prüft die Datei.
#   konzepte/werkzeug/rendern.sh <datei.pptx> <zielordner> [--home <ordner>] [--ohne-pruefung]
# Ergebnis im Zielordner: <datei>.pdf, folie-NN.png (1600 px breit), uebersicht.png (über praesentation/werkzeug/render.cjs, LibreOffice).
# Danach: Schemaprüfung der Datei (validate.py der pptx-Werkzeuge) und Prüfung von Schrift, Rollen und Sprache (pruefe_entwurf.py).
#
# --home <ordner>  eigenes HOME für LibreOffice (mehrere Agenten rendern gleichzeitig: jeder nimmt seinen eigenen Ordner, etwa
#                  konzepte/<team>/.lohome). Ohne Angabe: ein Zwischenordner im Zielordner, der danach gelöscht wird.
# Umgebung: PYTHON (Vorgabe python3), VALIDATE (Pfad zu validate.py; Vorgabe: Suche unter /root/.*/skills/), SOFFICE (Pfad zu soffice).
set -euo pipefail
HIER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRAES="$(cd "$HIER/../../praesentation" && pwd)"
PYTHON="${PYTHON:-python3}"

DATEI="" ZIEL="" LOHOME="" PRUEFEN=1
while [ $# -gt 0 ]; do
  case "$1" in
    --home) LOHOME="${2:?--home braucht einen Ordner}"; shift 2 ;;
    --ohne-pruefung) PRUEFEN=0; shift ;;
    -*) echo "Unbekannte Option $1" >&2; exit 2 ;;
    *) if [ -z "$DATEI" ]; then DATEI="$1"; elif [ -z "$ZIEL" ]; then ZIEL="$1"; else echo "Zu viele Argumente: $1" >&2; exit 2; fi; shift ;;
  esac
done
if [ -z "$DATEI" ] || [ -z "$ZIEL" ]; then
  echo "Aufruf: rendern.sh <datei.pptx> <zielordner> [--home <ordner>] [--ohne-pruefung]" >&2; exit 2
fi
[ -f "$DATEI" ] || { echo "Nicht gefunden: $DATEI" >&2; exit 2; }
DATEI="$(cd "$(dirname "$DATEI")" && pwd)/$(basename "$DATEI")"
mkdir -p "$ZIEL"; ZIEL="$(cd "$ZIEL" && pwd)"
case "$ZIEL/" in "$PRAES"/*) echo "Der Zielordner darf nicht in praesentation/ liegen." >&2; exit 2 ;; esac

AUFRAEUMEN=0
if [ -z "$LOHOME" ]; then LOHOME="$(mktemp -d "$ZIEL/.lohome-XXXXXX")"; AUFRAEUMEN=1; fi
mkdir -p "$LOHOME"; LOHOME="$(cd "$LOHOME" && pwd)"
trap '[ "$AUFRAEUMEN" = 1 ] && rm -rf "$LOHOME"' EXIT

# 1 PDF und Bilder: der Weg des Vortrags (eigenes LibreOffice-Profil im Zielordner, dazu das eigene HOME)
HOME="$LOHOME" node "$PRAES/werkzeug/render.cjs" "$DATEI" "$ZIEL"

[ "$PRUEFEN" = 1 ] || exit 0
STATUS=0
# 2 Schemaprüfung (Office Open XML)
if [ -z "${VALIDATE:-}" ]; then
  for k in /root/.*/skills/*/*/pptx/scripts/office/validate.py /root/.*/skills/*/pptx/scripts/office/validate.py; do
    [ -f "$k" ] && { VALIDATE="$k"; break; }
  done
fi
if [ -n "${VALIDATE:-}" ] && [ -f "$VALIDATE" ]; then
  echo "Schemaprüfung:"
  HOME="$LOHOME" "$PYTHON" "$VALIDATE" "$DATEI" || STATUS=1
else
  echo "Hinweis: validate.py nicht gefunden; Pfad mit VALIDATE=<datei> angeben. Schemaprüfung übersprungen." >&2
fi
# 3 Schrift, Rollen, Sprache
"$PYTHON" "$HIER/pruefe_entwurf.py" "$DATEI" || STATUS=1
exit $STATUS
