# CedarType for Windows

CedarType for Windows provides the same language profiles, orthography choices,
transliteration sequences, and Keystrokes reference as the macOS app. When
typing is on, a Windows keyboard hook converts mapped sequences system-wide
and sends the selected Unicode characters to the active app. Language,
orthography, and typing state are saved in `%APPDATA%\CedarType\settings.json`.

## Build

Build on Windows with Node.js and the .NET 8 SDK installed. From PowerShell in
the repository root, run:

```powershell
./windows-app/build.ps1
```

The script exports the current web app profiles and publishes a self-contained
x64 app to `windows-app/dist/CedarType.exe`. The executable does not need an
installer or administrator access. Run it to open the control window; closing
the window keeps CedarType in the system tray. Use the tray menu to reopen the
window or exit the app.

## Use

1. Choose a language and orthography.
2. Turn CedarType on.
3. Type the selected profile's sequences in the app you are using. For example,
   Lushootseed Dictionary maps `sh` to `š`.
4. Use the **Keystrokes** tab to see the full reference for that selection.

Turn typing off before entering passwords or other text that should not be
transformed. CedarType listens to keyboard input while it is on and does not
read or store the text you type.

## Notes

- Windows uses the active keyboard layout to identify typed characters. ASCII
  sequences from the selected profile are converted; other input passes through.
- The low-level keyboard hook applies to the current Windows desktop session.
  It will not operate on the secure desktop or sign-in screen.
- The app currently targets 64-bit Windows 10 and Windows 11.
