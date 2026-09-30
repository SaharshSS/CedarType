#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_ROOT="$SCRIPT_DIR/build"
APP="$BUILD_ROOT/CedarType.app"

mkdir -p "$BUILD_ROOT"
STAGING="$(mktemp -d "$BUILD_ROOT/.cedartype-app.XXXXXX")"
trap 'rm -rf "$STAGING"' EXIT
mkdir -p "$SCRIPT_DIR/Resources"

node "$SCRIPT_DIR/export-profiles.mjs" "$SCRIPT_DIR/Resources/LanguageProfiles.json"
xcodebuild \
  -quiet \
  -project "$SCRIPT_DIR/CedarType.xcodeproj" \
  -scheme CedarType \
  -configuration Release \
  -derivedDataPath "$STAGING/DerivedData" \
  CODE_SIGN_IDENTITY=- \
  CODE_SIGNING_REQUIRED=NO \
  build

STAGED_APP="$STAGING/CedarType.app"
ditto "$STAGING/DerivedData/Build/Products/Release/CedarType.app" "$STAGED_APP"
ICONSET="$STAGING/AppIcon.iconset"
mkdir -p "$ICONSET" "$STAGED_APP/Contents/Resources"
swift "$SCRIPT_DIR/make-icon.swift" "$STAGING/AppIcon.png"
for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$STAGING/AppIcon.png" --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z "$double" "$double" "$STAGING/AppIcon.png" --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$STAGED_APP/Contents/Resources/AppIcon.icns"
# A stable designated requirement lets macOS keep CedarType's TCC grants
# across local rebuilds. The default ad-hoc requirement is cdhash-based, so
# every rebuilt executable looks like a different app to Input Monitoring and
# Accessibility even though its bundle ID and install path are unchanged.
codesign --force --deep --sign - \
  --requirements='=designated => identifier "org.cedartype.desktop"' \
  "$STAGED_APP"
if [[ -d "$APP" ]]; then
  mv "$APP" "$STAGING/CedarType.previous.app"
fi
mv "$STAGED_APP" "$APP"

echo "Built CedarType menu bar app: $APP"
