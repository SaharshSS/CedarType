#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

node "$SCRIPT_DIR/../mac-app/export-profiles.mjs" "$SCRIPT_DIR/profiles.json"
swift "$SCRIPT_DIR/../mac-app/make-icon.swift" "$TMP_DIR/icon.png"
for size in 16 48 128; do
  sips -z "$size" "$size" "$TMP_DIR/icon.png" --out "$SCRIPT_DIR/icons/icon${size}.png" >/dev/null
done

echo "Chrome extension files are ready in $SCRIPT_DIR"
