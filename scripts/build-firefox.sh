#!/bin/bash

set -e

OUTDIR="dist-firefox"

echo "Building React panel..."
npx vite build --outDir "$OUTDIR" --emptyOutDir

echo "Copying static files..."
cp devtools.html devtools.js popup.html popup.js "$OUTDIR/"
cp -r assets "$OUTDIR/"

echo "Copying Firefox-specific files..."
cp firefox/manifest.json "$OUTDIR/manifest.json"
cp firefox/background.js "$OUTDIR/background.js"
cp firefox/panel.html "$OUTDIR/panel.html"

echo "Firefox extension built at $OUTDIR/"
