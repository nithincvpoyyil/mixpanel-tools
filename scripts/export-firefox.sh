#!/bin/bash

set -e

OUTFILE="mixpanel-tools-firefox.zip"

if [ ! -d "dist-firefox" ]; then
  echo "dist-firefox not found. Running build first..."
  bash scripts/build-firefox.sh
fi

cd dist-firefox
zip -r "$OUTFILE" .
mv "$OUTFILE" "$OLDPWD/"

echo "Created $OUTFILE"
