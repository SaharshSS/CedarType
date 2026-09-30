/**
 * Ensure every special character in a profile can be typed as well as chosen
 * from the web character palette. It prefers familiar orthography-style
 * sequences (a' for á, l_ for ł, and so on), with a Unicode-code shortcut as
 * a last resort for characters that have no readable mnemonic.
 */
const EXPLICIT_SHORTCUTS = {
  "æ": "ae",
  "ł": "l_",
  "ʷ": ";w",
  "ʼ": ";q",
  "·": ";.",
  "′": ";p"
};

const COMBINING_SHORTCUTS = {
  "\u0300": "`",
  "\u0301": "'",
  "\u0302": "^",
  "\u0303": "~",
  "\u0304": "-",
  "\u0308": ":",
  "\u030c": "v",
  "\u0323": ".",
  "\u0331": "_"
};

function readableShortcut(character) {
  if (EXPLICIT_SHORTCUTS[character]) return EXPLICIT_SHORTCUTS[character];

  let shortcut = "";
  for (const point of Array.from(character.normalize("NFD"))) {
    if (/\p{M}/u.test(point)) {
      const markShortcut = COMBINING_SHORTCUTS[point];
      if (!markShortcut) return null;
      shortcut += markShortcut;
    } else if (/^[a-z0-9]$/i.test(point)) {
      shortcut += point.toLowerCase();
    } else if (point === "ʼ") {
      shortcut += "'";
    } else {
      return null;
    }
  }

  return shortcut || null;
}

function unicodeShortcut(character) {
  const codePoints = Array.from(character, (point) =>
    point.codePointAt(0).toString(16).padStart(4, "0")
  ).join("x");
  return `;u${codePoints}`;
}

export function addSpecialCharacterFallbacks(profiles) {
  for (const profile of Object.values(profiles)) {
    for (const orthography of Object.values(profile.orthographies ?? {})) {
      const represented = new Set([
        ...(orthography.regularLatin ?? []),
        ...Object.values(orthography.mappings ?? {})
      ].map((character) => character.normalize("NFC")));

      for (const character of orthography.special ?? []) {
        if (represented.has(character.normalize("NFC"))) continue;

        // A single ASCII letter or digit is already directly typable.
        if (/^[a-z0-9]$/i.test(character)) {
          represented.add(character.normalize("NFC"));
          continue;
        }

        const candidate = readableShortcut(character);
        const key = candidate && (
          orthography.mappings[candidate] === undefined ||
          orthography.mappings[candidate] === character
        ) ? candidate : unicodeShortcut(character);
        orthography.mappings[key] = character;
        represented.add(character.normalize("NFC"));
      }
    }
  }

  return profiles;
}
