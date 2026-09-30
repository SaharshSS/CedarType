# CedarType for macOS

CedarType opens a small control window and stays available from the menu bar.
Choose a language and orthography and turn typing on in the window; the menu
bar menu provides the same controls. Then type the profile's Latin sequences
in any app. CedarType replaces completed sequences with their Unicode
spelling as you type. It does not use the clipboard or need to be added in
Keyboard settings.

## Keystroke reference

See the [complete keystroke reference in the main README](../README.md#full-keystroke-reference).

## Build

From the repository root, run:

```sh
./mac-app/build.sh
```

Open `mac-app/build/CedarType.app`. Xcode builds the macOS app bundle. The
build exports language profiles directly from `LANGUAGE_PROFILES` in
`src/main.jsx`, so its language and orthography mappings stay aligned with the
web app.

The **Keystrokes** tab lists direct Latin keys and replacement sequences for
the currently selected language and orthography. The app bundle includes a
CedarType tree and speech bubble icon. Every special character in the web app's
palette has a corresponding sequence in the selected profile's key list.

## One-time macOS permissions

Global typing needs macOS permission to monitor keystrokes and send text to
other apps. From CedarType's menu bar menu:

1. Choose **Open Input Monitoring Settings…** and enable CedarType in **Privacy &
   Security → Input Monitoring**.
2. Choose **Open Accessibility Settings…** and enable it in **Privacy &
   Security → Accessibility**.
3. Quit and reopen CedarType, turn it on, and choose a language and
   orthography.

When CedarType is on, Latin sequences from the selected mapping are replaced
as you type in other apps. Unmapped text passes through unchanged. Turn
CedarType off from its menu bar menu before entering passwords or other text
that should not be transformed.

This is a local development build with an ad-hoc signature. Sharing it with
other Macs requires Developer ID signing and notarization.
