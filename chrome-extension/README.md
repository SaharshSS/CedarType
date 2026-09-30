# CedarType Chrome Extension

CedarType types the selected language's keyboard sequences in text fields and
rich-text editors on websites. It uses the same language profiles as the web
app and macOS app.

## Build

From the repository root:

```sh
./chrome-extension/build.sh
```

This exports the current language profiles and creates the extension icons.

## Load it in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Select **Load unpacked** and choose the `chrome-extension` folder.
4. Pin CedarType from Chrome's Extensions menu, then open its popup.
5. Choose a language and orthography. Typing starts on by default; the popup
   status should say **On**.

Reload a website tab after installing or reloading the extension. In Chrome's
extension menu, set CedarType's **Site access** to **On all sites** if it is
restricted to selected sites. If the popup reports that website access is
blocked, use its **Allow access on websites** button and reload the page.
CedarType types in webpage text fields and rich-text editors; Chrome does not
allow extensions to modify browser pages such as `chrome://extensions` or the
Chrome Web Store, or other desktop apps.

## Shortcuts

Use the shortcuts listed in the [main keystroke reference](../README.md#full-keystroke-reference).
The extension updates its active mappings when the language or orthography is
changed in the popup. Sequences that could continue into a longer shortcut
are committed after a short pause.
