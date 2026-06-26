#!/bin/bash

set -e

TMPDIR=$(mktemp -d)
OUTFILE="mixpanel-tools-export.zip"

rsync -a \
  --exclude=_config.yml \
  --exclude=tsconfig.json \
  --exclude=vite.config.ts \
  --exclude=package-lock.json \
  --exclude=package.json \
  --exclude=src \
  --exclude=scripts \
  . "$TMPDIR/"

cd "$TMPDIR"
zip -r "$OUTFILE" .
mv "$OUTFILE" "$OLDPWD/"
rm -rf "$TMPDIR"

echo "Created $OUTFILE"
