#!/usr/bin/env bash
# Regenera los PDFs del CV en public/docs a partir de los HTML de esta carpeta.
# Uso: ./cv/render.sh   (desde cualquier lugar; necesita google-chrome)
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
out="$here/../public/docs"

render() {
  google-chrome --headless=new --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=8000 --print-to-pdf="$out/$2" "$here/$1" 2>/dev/null
  echo "$2: $(pdfinfo "$out/$2" 2>/dev/null | awk '/^Pages/ {print $2}') página(s)"
}

render es.html   Lautaro_Rodriguez_CV.pdf
render en.html   Lautaro_Rodriguez_CV_EN.pdf
render side.html Lautaro_Rodriguez_CV_SIDE.pdf
