import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { createRoot } from "react-dom/client";

import "./styles.css";

import {
  buildDictionarySet,
  getMisspelledWords
} from "./features/spellcheck.jsx";
import { addSpecialCharacterFallbacks } from "./features/add-special-character-fallbacks.js";

const thanksImages = Object.entries(
  import.meta.glob("./assets/thanks/*.{png,jpg,jpeg,webp,gif,svg}", {
    eager: true,
    query: "?url",
    import: "default"
  })
).map(([path, src]) => ({
  src,
  name: path.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
}));

function readLocalSetting(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalSetting(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The editor remains usable when browser storage is unavailable or full.
  }
}

const FEATURES = {
  spellcheck: true,
};

/*
 * Defines the language and orthography profiles used by CedarType.
 *
 * Orthographies are kept separate when a language has multiple documented
 * writing systems. The dictionary belongs to the language rather than to an
 * individual orthography unless an orthography-specific dictionary is needed.
 *
 * Each orthography defines regularLatin (A–Z typable sequences, including
 * digraphs) and special (Unicode letters, diacritics, and symbols).
 */
const LANGUAGE_PROFILES = {
  Lushootseed: {
    code: "lut",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with the actual Lushootseed dictionary data you are
     * permitted to use.
     */
    dictionary: [
      "šəq̓ʷ",
      "ʔəs",
      "x̌ʷəl",
      "siʔsiʔab"
    ],

    orthographies: {
      "Lushootseed Dictionary": {
        note:
          "Lushootseed Dictionary / Vi Hilbert orthography. Based on the orthography developed by Vi Hilbert and other Lushootseed language specialists.",

        regularLatin: [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z"
        ],

        special: [
          "ʔ",
          "ə",
          "š",
          "č",
          "ǰ",
          "ł",
          "ɫ",
          "ɬ",
          "ƛ",
          "b̓",
          "c̓",
          "č̓",
          "dᶻ",
          "gʷ",
          "k̓",
          "kʷ",
          "k̓ʷ",
          "l̓",
          "m̓",
          "n̓",
          "p̓",
          "q̓",
          "qʷ",
          "q̓ʷ",
          "s̓",
          "t̓",
          "w̓",
          "xʷ",
          "x̌",
          "x̌ʷ",
          "y̓"
        ],

        mappings: {
          sh: "š",
          ch: "č",
          j: "ǰ",
          dz: "dᶻ",
          gw: "gʷ",
          tl: "ƛ",
          "tl'": "ƛ̓",
          "b'": "b̓",
          "c'": "c̓",
          "ch'": "č̓",
          "k'": "k̓",
          kw: "kʷ",
          "kw'": "k̓ʷ",
          "l'": "l̓",
          "m'": "m̓",
          "n'": "n̓",
          "p'": "p̓",
          "q'": "q̓",
          qw: "qʷ",
          "qw'": "q̓ʷ",
          "s'": "s̓",
          "t'": "t̓",
          "w'": "w̓",
          xw: "xʷ",
          xv: "x̌",
          xvw: "x̌ʷ",
          lh: "ł",
          ";l": "ɫ",
          ";lh": "ɬ",
          "y'": "y̓",
          ";e": "ə",
          "'": "ʔ"
        }
      }
    }
  },

  "Chinuk Wawa": {
    code: "chn",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with an appropriate Chinuk Wawa dictionary.
     */
    dictionary: [
      "hayu",
      "klahowya",
      "tənəs",
      "skookum"
    ],

    orthographies: {
      "Grand Ronde": {
        note:
          "Grand Ronde Chinuk Wawa orthography. This is the modern revitalized orthography associated with the Confederated Tribes of Grand Ronde.",

        regularLatin: [
          "a",
          "e",
          "i",
          "o",
          "u",
          "p",
          "t",
          "k",
          "kw",
          "q",
          "qw",
          "ts",
          "ch",
          "l",
          "s",
          "sh",
          "x",
          "xw",
          "h",
          "m",
          "n",
          "w",
          "y"
        ],

        special: [
          "ə",
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "pʰ",
          "p̓",
          "tʰ",
          "t̓",
          "kʰ",
          "k̓",
          "kʰw",
          "k̓w",
          "qʰ",
          "q̓",
          "qʰw",
          "q̓w",
          "t̓s",
          "c̓h",
          "tɬ",
          "t̓ɬ",
          "ɬ",
          "x̣",
          "x̣w",
          "ʔ"
        ],

        mappings: {
          ph: "pʰ",
          "p'": "p̓",
          th: "tʰ",
          "t'": "t̓",
          kh: "kʰ",
          "k'": "k̓",
          khw: "kʰw",
          "kw'": "k̓w",
          qh: "qʰ",
          "q'": "q̓",
          qhw: "qʰw",
          "qw'": "q̓w",
          "ts'": "t̓s",
          "ch'": "c̓h",
          tl: "tɬ",
          "tl'": "t̓ɬ",
          lh: "ɬ",
          "x.": "x̣",
          "x.w": "x̣w",
          ";e": "ə",
          "'": "ʔ"
        }
      },

      "Historical / Linguistic": {
        note:
          "Broader Latin transcription support for historical and linguistic work on Chinuk Wawa. This is intentionally separate from the Grand Ronde practical orthography.",

        regularLatin: [
          "a",
          "e",
          "i",
          "o",
          "u",
          "p",
          "t",
          "k",
          "kw",
          "q",
          "qw",
          "ts",
          "ch",
          "l",
          "s",
          "sh",
          "x",
          "xw",
          "h",
          "m",
          "n",
          "w",
          "y"
        ],

        special: [
          "ə",
          "æ",
          "pʰ",
          "p̓",
          "tʰ",
          "t̓",
          "kʰ",
          "k̓",
          "kʰw",
          "k̓w",
          "qʰ",
          "q̓",
          "qʰw",
          "q̓w",
          "tɬ",
          "t̓ɬ",
          "ɬ",
          "x̣",
          "x̣w",
          "ʔ",
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "·",
          "′"
        ],

        mappings: {
          ph: "pʰ",
          "p'": "p̓",
          th: "tʰ",
          "t'": "t̓",
          kh: "kʰ",
          "k'": "k̓",
          khw: "kʰw",
          "kw'": "k̓w",
          qh: "qʰ",
          "q'": "q̓",
          qhw: "qʰw",
          "qw'": "q̓w",
          tl: "tɬ",
          "tl'": "t̓ɬ",
          lh: "ɬ",
          "x.": "x̣",
          "x.w": "x̣w",
          ";e": "ə",
          "'": "ʔ"
        }
      }
    }
  },

  Tlingit: {
    code: "tli",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with the actual Tlingit dictionary data.
     */
    dictionary: [
      "gunalchéesh",
      "yakʼéixʼ",
      "áwé",
      "haa"
    ],

    orthographies: {
      "Revised Popular": {
        note:
          "Tlingit Revised Popular orthography. Uvulars are represented with combining underscore marks.",

        regularLatin: [
          "aa",
          "ee",
          "ii",
          "oo",
          "uu"
        ],

        special: [
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "à",
          "è",
          "ì",
          "ò",
          "ù",
          "ḵ",
          "ḵʼ",
          "ḵw",
          "ḵʼw",
          "g̱",
          "g̱w",
          "x̱",
          "x̱ʼ",
          "x̱w",
          "x̱ʼw",
          "kʼ",
          "kʼw",
          "sʼ",
          "tʼ",
          "tlʼ",
          "tsʼ",
          "xʼ",
          "xʼw",
          "lʼ",
          "ł",
          "ÿ",
          "áa",
          "àa",
          "ée",
          "èe",
          "íi",
          "ìi",
          "óo",
          "òo",
          "úu",
          "ùu",
          "ʼ"
        ],

        mappings: {
          kh: "ḵ",
          "kh'": "ḵʼ",
          khw: "ḵw",
          "kh'w": "ḵʼw",
          gh: "g̱",
          ghw: "g̱w",
          xh: "x̱",
          "xh'": "x̱ʼ",
          xhw: "x̱w",
          "xh'w": "x̱ʼw",
          "k'": "kʼ",
          "k'w": "kʼw",
          "s'": "sʼ",
          "t'": "tʼ",
          "tl'": "tlʼ",
          "ts'": "tsʼ",
          "x'": "xʼ",
          "x'w": "xʼw",
          "l'": "lʼ",
          "'": "ʼ"
        }
      },

      Canadian: {
        note:
          "Canadian Tlingit orthography. Uvulars are represented using consonant+h sequences rather than the Revised Popular underscore convention.",

        regularLatin: [
          "kh",
          "khʼ",
          "khw",
          "khʼw",
          "gh",
          "ghw",
          "xh",
          "xhʼ",
          "xhw",
          "xhʼw",
          "aa",
          "ee",
          "ii",
          "oo",
          "uu",
          "l"
        ],

        special: [
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "â",
          "ê",
          "î",
          "ô",
          "û",
          "à",
          "è",
          "ì",
          "ò",
          "ù",
          "kʼ",
          "kʼw",
          "sʼ",
          "tʼ",
          "tlʼ",
          "tsʼ",
          "ł",
          "xʼ",
          "xʼw",
          "ʼ"
        ],

        mappings: {
          "kh'": "khʼ",
          khw: "khw",
          "kh'w": "khʼw",
          gh: "gh",
          ghw: "ghw",
          "xh'": "xhʼ",
          xhw: "xhw",
          "xh'w": "xhʼw",
          "k'": "kʼ",
          "k'w": "kʼw",
          "s'": "sʼ",
          "t'": "tʼ",
          "tl'": "tlʼ",
          "ts'": "tsʼ",
          "x'": "xʼ",
          "x'w": "xʼw",
          "'": "ʼ"
        }
      },

      Email: {
        note:
          "Tlingit Email orthography. This preserves much of Revised Popular spelling while using consonant+h forms instead of underscore diacritics for uvulars.",

        regularLatin: [
          "kh",
          "khʼ",
          "khw",
          "khʼw",
          "gh",
          "ghw",
          "xh",
          "xhʼ",
          "xhw",
          "xhʼw",
          "aa",
          "ee",
          "ii",
          "oo",
          "uu"
        ],

        special: [
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "à",
          "è",
          "ì",
          "ò",
          "ù",
          "kʼ",
          "kʼw",
          "sʼ",
          "tʼ",
          "tlʼ",
          "tsʼ",
          "xʼ",
          "xʼw",
          "lʼ",
          "áa",
          "ée",
          "íi",
          "óo",
          "úu",
          "ʼ"
        ],

        mappings: {
          "kh'": "khʼ",
          khw: "khw",
          "kh'w": "khʼw",
          gh: "gh",
          ghw: "ghw",
          "xh'": "xhʼ",
          xhw: "xhw",
          "xh'w": "xhʼw",
          "k'": "kʼ",
          "k'w": "kʼw",
          "s'": "sʼ",
          "t'": "tʼ",
          "tl'": "tlʼ",
          "ts'": "tsʼ",
          "x'": "xʼ",
          "x'w": "xʼw",
          "l'": "lʼ",
          "'": "ʼ"
        }
      }
    }
  },

  Haida: {
    code: "hai",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with the actual Haida dictionary data.
     */
    dictionary: [
      "Yáahl",
      "háaw",
      "ḵwáan",
      "ʼWáadluu"
    ],

    orthographies: {
      Enrico: {
        note:
          "Haida orthography associated with John Enrico. Haida tone may be represented with acute and grave accents.",

        regularLatin: [
          "aa",
          "ee",
          "ii",
          "oo",
          "uu"
        ],

        special: [
          "á",
          "à",
          "é",
          "è",
          "í",
          "ì",
          "ó",
          "ò",
          "ú",
          "ù",
          "ḵ",
          "ḵʼ",
          "x̱",
          "x̱ʼ",
          "ʼ",
          "áa",
          "àa",
          "ée",
          "èe",
          "íi",
          "ìi",
          "óo",
          "òo",
          "úu",
          "ùu"
        ],

        mappings: {
          kh: "ḵ",
          "kh'": "ḵʼ",
          xh: "x̱",
          "xh'": "x̱ʼ",
          "a'": "á",
          "a`": "à",
          "e'": "é",
          "e`": "è",
          "i'": "í",
          "i`": "ì",
          "o'": "ó",
          "o`": "ò",
          "u'": "ú",
          "u`": "ù",
          "'": "ʼ"
        }
      },

      ANLC: {
        note:
          "Alaska Native Language Center Haida spelling system. This is maintained separately because it differs from the Enrico system.",

        regularLatin: [
          "aa",
          "ee",
          "ii",
          "oo",
          "uu"
        ],

        special: [
          "á",
          "à",
          "é",
          "è",
          "í",
          "ì",
          "ó",
          "ò",
          "ú",
          "ù",
          "ḵ",
          "ḵʼ",
          "x̱",
          "x̱ʼ",
          "ʼ",
          "áa",
          "àa",
          "ée",
          "èe",
          "íi",
          "ìi",
          "óo",
          "òo",
          "úu",
          "ùu"
        ],

        mappings: {
          kh: "ḵ",
          "kh'": "ḵʼ",
          xh: "x̱",
          "xh'": "x̱ʼ",
          "a'": "á",
          "a`": "à",
          "e'": "é",
          "e`": "è",
          "i'": "í",
          "i`": "ì",
          "o'": "ó",
          "o`": "ò",
          "u'": "ú",
          "u`": "ù",
          "'": "ʼ"
        }
      }
    }
  },

  "Kwak̓wala": {
    code: "kwk",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with the actual Kwak̓wala dictionary data.
     */
    dictionary: [
      "La̱maa̱n",
      "g̱wagwixsʼalał",
      "ḵ̓iḵ̓eḵa̱lasa",
      "t̓a̱p̓idux̱"
    ],

    orthographies: {
      "U'mista": {
        note:
          "Modern U'mista orthography. This is the practical orthography developed by the U'mista Cultural Society.",

        regularLatin: [
          "a",
          "b",
          "c",
          "d",
          "dz",
          "g",
          "k",
          "l",
          "m",
          "n",
          "p",
          "q",
          "qw",
          "s",
          "t",
          "ts",
          "w",
          "x",
          "xw",
          "y",
          "z"
        ],

        special: [
          "a̱",
          "č",
          "g̱",
          "g̱w",
          "k̓",
          "k̓w",
          "ḵ",
          "ḵ̓",
          "ḵw",
          "ḵ̓w",
          "ł",
          "q̓",
          "q̓w",
          "š",
          "t̓",
          "tł",
          "t̓ł",
          "t̓s",
          "x̱",
          "x̱w",
          "ə",
          "ʼ"
        ],

        mappings: {
          "a_": "a̱",
          ch: "č",
          sh: "š",
          gh: "g̱",
          ghw: "g̱w",
          "k'": "k̓",
          "k'w": "k̓w",
          kh: "ḵ",
          "kh'": "ḵ̓",
          khw: "ḵw",
          "kh'w": "ḵ̓w",
          lh: "ł",
          "p'": "p̓",
          "q'": "q̓",
          qw: "qw",
          "qw'": "q̓w",
          "t'": "t̓",
          tl: "tł",
          "tl'": "t̓ł",
          "ts'": "t̓s",
          xw: "xw",
          xhw: "x̱w",
          xh: "x̱",
          ";e": "ə",
          "'": "ʼ"
        }
      }
    }
  },

  "Nuu-chah-nulth": {
    code: "nch",

    /*
     * Placeholder lexical data for development.
     *
     * Replace this with the actual Nuu-chah-nulth dictionary data.
     */
    dictionary: [
      "ʔUyaaƛaḥ",
      "hawiiʔaƛii",
      "maapt̓ał",
      "c̓išaaʔatḥ"
    ],

    orthographies: {
      Standard: {
        note:
          "Standard Nuu-chah-nulth orthography.",

        regularLatin: [
          "a",
          "e",
          "i",
          "o",
          "u",
          "s"
        ],

        special: [
          "ʔ",
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "c̓",
          "č",
          "ḥ",
          "ł",
          "m̓",
          "n̓",
          "p̓",
          "q̓",
          "š",
          "t̓",
          "w̓",
          "x̌",
          "ƛ",
          "ƛ̓",
          "ʷ",
          "ʼ"
        ],

        mappings: {
          ch: "č",
          "ch'": "c̓",
          "h.": "ḥ",
          sh: "š",
          "x.": "x̌",
          tl: "ƛ",
          "tl'": "ƛ̓",
          "m'": "m̓",
          "n'": "n̓",
          "p'": "p̓",
          "q'": "q̓",
          "t'": "t̓",
          "w'": "w̓",
          "'": "ʔ"
        }
      },

      Bouchard: {
        note:
          "Bouchard orthography. This system uses 7 for glottal stop and differs substantially from the Standard orthography.",

        regularLatin: [
          "a",
          "e",
          "i",
          "o",
          "u",
          "c",
          "lh",
          "s",
          "x",
          "xw"
        ],

        special: [
          "7",
          "á",
          "é",
          "í",
          "ó",
          "ú",
          "cʼ",
          "č",
          "čʼ",
          "ẖ",
          "ł",
          "m̓",
          "n̓",
          "pʼ",
          "q",
          "qʼ",
          "š",
          "tʼ",
          "w̓",
          "ƛ",
          "ƛʼ",
          "ʷ"
        ],

        mappings: {
          ch: "č",
          "ch'": "čʼ",
          "h.": "ẖ",
          sh: "š",
          tl: "ƛ",
          "tl'": "ƛʼ",
          "m'": "m̓",
          "n'": "n̓",
          "p'": "pʼ",
          "q'": "qʼ",
          "t'": "tʼ",
          "w'": "w̓",
          "'": "7"
        }
      }
    }
  }
};

addSpecialCharacterFallbacks(LANGUAGE_PROFILES);

/*
 * Provides lightweight local example words for the suggestion UI.
 *
 * These are interface examples rather than authoritative dictionaries.
 */
const SUGGESTIONS = {
  Lushootseed: [
    "šəq̓ʷ",
    "ʔəs",
    "x̌ʷəl",
    "siʔsiʔab"
  ],

  "Chinuk Wawa": [
    "hayu",
    "klahowya",
    "tənəs",
    "skookum"
  ],

  Tlingit: [
    "gunalchéesh",
    "yakʼéixʼ",
    "áwé",
    "haa"
  ],

  Haida: [
    "Yáahl",
    "háaw",
    "ḵwáan",
    "ʼWáadluu"
  ],

  "Kwak̓wala": [
    "La̱maa̱n",
    "g̱wagwixsʼalał",
    "ḵ̓iḵ̓eḵa̱lasa",
    "t̓a̱p̓idux̱"
  ],

  "Nuu-chah-nulth": [
    "ʔUyaaƛaḥ",
    "hawiiʔaƛii",
    "maapt̓ał",
    "c̓išaaʔatḥ"
  ]
};

/*
 * Deduplicates palette entries using Unicode NFC normalization.
 */
function uniquePaletteEntries(entries) {
  return [
    ...new Set(
      entries.map((entry) =>
        entry.normalize("NFC")
      )
    )
  ];
}

/*
 * Returns the special-character palette for an orthography.
 */
function getOrthographySpecialCharacters(orthography) {
  return uniquePaletteEntries(
    orthography.special
  );
}

/*
 * Returns the full palette (regular Latin sequences plus special) for an
 * orthography.
 */
function getOrthographyAllCharacters(orthography) {
  return uniquePaletteEntries([
    ...orthography.regularLatin,
    ...orthography.special
  ]);
}

/*
 * Inserts a string at the current caret position.
 */
function insertAtCaret(
  textarea,
  value,
  setText
) {
  if (!textarea) {
    return;
  }

  const start =
    textarea.selectionStart;

  const end =
    textarea.selectionEnd;

  const next =
    textarea.value.slice(
      0,
      start
    ) +
    value +
    textarea.value.slice(
      end
    );

  setText(next);

  requestAnimationFrame(() => {
    textarea.focus();

    const position =
      start +
      value.length;

    textarea.setSelectionRange(
      position,
      position
    );
  });
}

/*
 * Applies the longest matching ASCII transliteration sequence immediately
 * before the current caret position.
 */
function applyMapping(
  textarea,
  mapping,
  setText,
  commitAmbiguous = false
) {
  if (!textarea) {
    return;
  }

  const start =
    textarea.selectionStart;

  const before =
    textarea.value.slice(
      0,
      start
    );

  const normalizedBefore = before.toLocaleLowerCase();

  const after =
    textarea.value.slice(
      start
    );

  const keys =
    Object.keys(mapping)
      .sort(
        (a, b) =>
          b.length -
          a.length
      );

  let match = keys.find((key) => normalizedBefore.endsWith(key));
  let matchStart = match ? normalizedBefore.length - match.length : -1;
  let preserveTrailingCharacter = false;

  if (!commitAmbiguous && match && keys.some((key) => key.length > match.length && key.startsWith(match))) {
    // Wait for a possible longer sequence (for example, `ch` versus `ch'`).
    return;
  }

  if (!match && before.length > 1) {
    const beforeLastCharacter = normalizedBefore.slice(0, -1);
    const deferredMatch = keys.find((key) =>
      beforeLastCharacter.endsWith(key) &&
      keys.some((longerKey) => longerKey.length > key.length && longerKey.startsWith(key))
    );
    if (deferredMatch) {
      match = deferredMatch;
      matchStart = beforeLastCharacter.length - deferredMatch.length;
      preserveTrailingCharacter = true;
    }
  }

  if (!match) return;

  let replacement = mapping[match];
  if (/[A-Z]/.test(before[matchStart] ?? "")) {
    replacement = replacement[0].toLocaleUpperCase() + replacement.slice(1);
  }

  const next =
    before.slice(0, matchStart) +
    replacement +
    (preserveTrailingCharacter ? before.slice(-1) : "") +
    after;

  setText(next);

  requestAnimationFrame(() => {
    textarea.focus();

    const position = start - match.length + replacement.length + (preserveTrailingCharacter ? 1 : 0);

    textarea.setSelectionRange(
      position,
      position
    );
  });
}

/*
 * Copies the current text to the system clipboard.
 */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(
      text
    );
  } catch {
    window.prompt(
      "Copy this text:",
      text
    );
  }
}

/*
 * Returns the currently selected orthography.
 */
function getOrthography(
  languageProfile,
  orthographyName
) {
  return (
    languageProfile.orthographies[
      orthographyName
    ]
  );
}

/*
 * Renders the complete CedarType application.
 */
function EditorApp({ onHome }) {
  const [
    language,
    setLanguage
  ] = useState(
    "Lushootseed"
  );

  const [
    orthography,
    setOrthography
  ] = useState(
    "Lushootseed Dictionary"
  );

  const [
    text,
    setText
  ] = useState("");

  const [
    autoReplace,
    setAutoReplace
  ] = useState(true);

  const [
    showAllCharacters,
    setShowAllCharacters
  ] = useState(false);

  const [
    copied,
    setCopied
  ] = useState(false);

  const textareaRef =
    useRef(null);
  const mappingTimerRef = useRef(null);

  const profile =
    LANGUAGE_PROFILES[
      language
    ];

  /*
   * Retrieves the currently selected orthography.
   */
  const currentOrthography =
    getOrthography(
      profile,
      orthography
    );

  /*
   * Builds the dictionary lookup Set for the current language.
   */
  const dictionarySet =
    useMemo(
      () => {
        if (!FEATURES.spellcheck) {
          return new Set();
        }

        try {
          return buildDictionarySet(profile.dictionary || []);
        } catch {
          return new Set();
        }
      },
      [profile.dictionary]
    );

  /*
   * Finds the words in the current composition that are not present in the
   * selected language dictionary.
   */
  const misspelledWords =
    useMemo(
      () => {
        if (!FEATURES.spellcheck) {
          return [];
        }

        try {
          return getMisspelledWords(text, dictionarySet);
        } catch {
          return [];
        }
      },
      [
        text,
        dictionarySet
      ]
    );


  /*
   * Generates the character palette for the selected orthography.
   *
   * Normal mode shows special characters only. All-characters mode adds the
   * orthography's regular Latin input sequences (including digraphs).
   */
  const characters = useMemo(() => {
    if (showAllCharacters) {
      return getOrthographyAllCharacters(
        currentOrthography
      );
    }

    return getOrthographySpecialCharacters(
      currentOrthography
    );
  }, [
    currentOrthography,
    showAllCharacters
  ]);

  /*
   * Generates lightweight local suggestions based on the current word prefix.
   */
  const currentSuggestions =
    useMemo(() => {
      const words =
        SUGGESTIONS[
          language
        ] || [];

      const token =
        text
          .trim()
          .split(/\s+/)
          .pop()
          ?.toLowerCase() ||
        "";

      if (!token) {
        return words.slice(
          0,
          4
        );
      }

      return words
        .filter(
          (word) =>
            word
              .toLowerCase()
              .startsWith(
                token
              )
        )
        .slice(
          0,
          4
        );
    }, [
      language,
      text
    ]);

  /*
   * Saves the selected language locally.
   */
  useEffect(() => {
    writeLocalSetting("cedartype-language", language);
  }, [language]);

  /*
   * Saves the selected orthography locally.
   */
  useEffect(() => {
    writeLocalSetting("cedartype-orthography", orthography);
  }, [orthography]);

  /*
   * Saves the current composition locally.
   */
  useEffect(() => {
    writeLocalSetting("cedartype-text", text);
  }, [text]);

  /*
   * Restores CedarType state from local storage.
   */
  useEffect(() => {
    const savedLanguage = readLocalSetting("cedartype-language");

    const savedOrthography = readLocalSetting("cedartype-orthography");

    const savedText = readLocalSetting("cedartype-text");

    if (
      savedLanguage &&
      LANGUAGE_PROFILES[
        savedLanguage
      ]
    ) {
      setLanguage(
        savedLanguage
      );

      const savedProfile =
        LANGUAGE_PROFILES[
          savedLanguage
        ];

      const orthographies =
        Object.keys(
          savedProfile.orthographies
        );

      if (
        savedOrthography &&
        orthographies.includes(
          savedOrthography
        )
      ) {
        setOrthography(
          savedOrthography
        );
      } else {
        setOrthography(
          orthographies[0]
        );
      }
    }

    if (savedText) {
      setText(
        savedText
      );
    }
  }, []);

  /*
   * Changes language and automatically selects its first available
   * orthography.
   */
  function handleLanguageChange(
    nextLanguage
  ) {
    clearTimeout(mappingTimerRef.current);
    setLanguage(
      nextLanguage
    );

    const nextProfile =
      LANGUAGE_PROFILES[
        nextLanguage
      ];

    const nextOrthographies =
      Object.keys(
        nextProfile.orthographies
      );

    setOrthography(
      nextOrthographies[0]
    );

    setText("");
  }

  /*
   * Handles normal keyboard input and applies the active orthography's
   * ASCII-to-Unicode mappings.
   */
  function handleInput(event) {
    const textarea = event.currentTarget;
    const nextText = textarea.value;
    const mappings = currentOrthography.mappings;

    setText(nextText);

    if (!autoReplace) {
      clearTimeout(mappingTimerRef.current);
      mappingTimerRef.current = null;
      return;
    }

    requestAnimationFrame(() => {
      applyMapping(
        textarea,
        mappings,
        setText
      );

      clearTimeout(mappingTimerRef.current);
      mappingTimerRef.current = setTimeout(() => {
        applyMapping(textarea, mappings, setText, true);
        mappingTimerRef.current = null;
      }, 650);
    });
  }

  /*
   * Inserts a suggestion at the current word position.
   */
  function useSuggestion(word) {
    clearTimeout(mappingTimerRef.current);
    mappingTimerRef.current = null;
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const before =
      textarea.value.slice(
        0,
        start
      );

    const match =
      before.match(
        /(\S+)$/
      );

    const existing =
      match
        ? match[1]
        : "";

    const replacement =
      (
        existing
          ? word.slice(
              existing.length
            )
          : word
      ) + " ";

    insertAtCaret(
      textarea,
      replacement,
      setText
    );
  }

  /*
   * Copies the current composition and displays short visual feedback.
   */
  async function handleCopy() {
    await copyText(
      text
    );

    setCopied(true);

    setTimeout(
      () =>
        setCopied(false),
      1200
    );
  }

  /*
   * Clears the current composition.
   */
  function clearText() {
    clearTimeout(mappingTimerRef.current);
    mappingTimerRef.current = null;
    setText("");

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div
            className="brand-mark"
            aria-label="CedarType cedar tree logo"
          >
            <svg
              viewBox="0 0 64 64"
              role="img"
              aria-hidden="true"
            >
              <path
                d="
                  M32 3
                  L20 20
                  L27 20
                  L15 35
                  L24 35
                  L12 51
                  L28 51
                  L28 61
                  L36 61
                  L36 51
                  L52 51
                  L40 35
                  L49 35
                  L37 20
                  L44 20
                  Z
                "
                fill="currentColor"
              />
            </svg>
          </div>

          <div>
            <h1>
              CedarType
            </h1>

            <p>
              Pacific Northwest Indigenous
              Language IME
            </p>
          </div>
        </div>

        <button className="home-link" onClick={onHome} type="button">
          ← Home
        </button>

        <div className="header-actions">
          <label className="select-wrap">
            <span>
              Language
            </span>

            <select
              value={language}
              onChange={(event) =>
                handleLanguageChange(
                  event.target.value
                )
              }
            >
              {Object.keys(
                LANGUAGE_PROFILES
              ).map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="select-wrap">
            <span>
              Orthography
            </span>

            <select
              value={orthography}
              onChange={(event) =>
                setOrthography(
                  event.target.value
                )
              }
            >
              {Object.keys(
                profile.orthographies
              ).map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">
            COMMUNITY-CONFIGURABLE INPUT
          </p>

          <h2>
            Write the characters
            your keyboard forgot.
          </h2>

          <p className="hero-copy">
            Unicode-first composition for
            Pacific Northwest Indigenous
            languages, with character palettes, dictionary
            spellchecking, and
            transliteration shortcuts.
          </p>
        </div>

        <div className="hero-badge">
          <span>
            ●
          </span>

          Offline-ready
        </div>
      </section>

      <section className="workspace">
        <div className="editor-card">
          <div className="editor-toolbar">
            <div className="toolbar-label">
              <span className="dot" />

              {language}

              <span>
                ·
              </span>

              {orthography}
            </div>

            <div className="toolbar-actions">
              <button
                className="ghost-button"
                onClick={
                  clearText
                }
              >
                Clear
              </button>

              <button
                className="primary-button"
                onClick={
                  handleCopy
                }
              >
                {
                  copied
                    ? "Copied"
                    : "Copy"
                }
              </button>
            </div>
          </div>

          <div className="editor-input-wrapper">
            <textarea
              ref={
                textareaRef
              }
              value={text}
              onChange={
                handleInput
              }
              placeholder={
                `Start typing in ${language}…`
              }
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label={
                `${language} ${orthography} composition area`
              }
            />
          </div>

          <div className="editor-footer">
            <span>
              {text.length} characters
            </span>

            <span>
              {currentOrthography.note}
            </span>

            {FEATURES.spellcheck && (
              <span
                className={
                  misspelledWords.length
                    ? "spellcheck-warning"
                    : "spellcheck-ok"
                }
              >
                {misspelledWords.length
                  ? `${misspelledWords.length} word${
                      misspelledWords.length === 1
                        ? ""
                        : "s"
                    } not found`
                  : "✓ Dictionary check passed"}
              </span>
            )}
          </div>
        </div>

        <aside className="side-card">
          <div className="side-heading">
            <div>
              <p className="eyebrow">
                SUGGESTIONS
              </p>

              <h3>
                Compose faster
              </h3>
            </div>
          </div>

          <div className="suggestions">
            {currentSuggestions.length ? (
              currentSuggestions.map(
                (word) => (
                  <button
                    key={word}
                    className="suggestion"
                    onClick={() =>
                      useSuggestion(
                        word
                      )
                    }
                  >
                    <span>
                      {word}
                    </span>

                    <span className="arrow">
                      ↵
                    </span>
                  </button>
                )
              )
            ) : (
              <p className="muted">
                No local suggestions
                for this prefix.
              </p>
            )}
          </div>

          <div className="settings">
            <p className="eyebrow">
              INPUT
            </p>

            <label className="toggle-row">
              <span>
                <strong>
                  Auto-replace
                </strong>

                <small>
                  ASCII shortcuts →
                  Unicode orthography
                </small>
              </span>

              <input
                type="checkbox"
                checked={
                  autoReplace
                }
                onChange={(event) =>
                  setAutoReplace(
                    event.target.checked
                  )
                }
              />
            </label>

            <label className="toggle-row">
              <span>
                <strong>
                  All characters
                </strong>

                <small>
                  Show regular Latin
                  sequences for this orthography
                </small>
              </span>

              <input
                type="checkbox"
                checked={
                  showAllCharacters
                }
                onChange={(event) =>
                  setShowAllCharacters(
                    event.target.checked
                  )
                }
              />
            </label>
          </div>
        </aside>
      </section>

      <section className="keyboard-card">
        <div className="keyboard-header">
          <div>
            <p className="eyebrow">
              CHARACTER PALETTE
            </p>

            <h3>
              {showAllCharacters
                ? "All available characters"
                : "Orthography characters"}
            </h3>
          </div>

          <span className="keyboard-hint">
            Click a character to insert it
          </span>
        </div>

        <div className="keys">
          {characters.map(
            (character) => (
              <button
                key={character}
                className="key"
                onClick={() =>
                  insertAtCaret(
                    textareaRef.current,
                    character,
                    setText
                  )
                }
                aria-label={
                  `Insert ${character}`
                }
              >
                {character}
              </button>
            )
          )}
        </div>
      </section>

      <footer className="footer">
        <span>
          CedarType
        </span>

        <span>
          Unicode-first •
          Orthography-aware •
          Dictionary-aware •
          Local composition
        </span>
      </footer>
    </main>
  );
}

const FALLING_GLYPHS = [
  "ʔ", "ə", "š", "č", "ǰ", "ƛ", "ɬ", "x̣", "ḵ", "ʼ", "ł", "ƛʼ",
  "k̓", "q̓", "t̓", "g̱", "x̱", "á", "à", "tɬ", "ʷ", "čʼ", "m̓"
];

function LandingPage({ onOpenEditor }) {
  return (
    <main className="landing-page">
      <div className="falling-field" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
          <span
            className="falling-glyph"
            key={index}
            style={{
              "--x": `${(index * 37 + 4) % 100}%`,
              "--delay": `${-((index * 1.73) % 22)}s`,
              "--duration": `${16 + (index * 7) % 15}s`,
              "--size": `${18 + (index * 11) % 29}px`,
              "--opacity": `${0.12 + ((index * 13) % 32) / 100}`
            }}
          >
            {FALLING_GLYPHS[index % FALLING_GLYPHS.length]}
          </span>
        ))}
      </div>

      <header className="landing-nav">
        <a className="landing-brand" href="#top" aria-label="CedarType home">
          <span className="landing-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <path d="M32 3 20 20h7L15 35h9L12 51h16v10h8V51h16L40 35h9L37 20h7L32 3Z" fill="currentColor" />
            </svg>
          </span>
          <span>CedarType</span>
        </a>
        <a className="nav-github" href="https://github.com/SaharshSS/CedarType" target="_blank" rel="noreferrer" aria-label="CedarType on GitHub">
          <GithubIcon />
        </a>
      </header>

      <section className="landing-hero" id="top">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span /> A keyboard for living languages</p>
          <h1>Every language<br />deserves a <em>key.</em></h1>
          <p className="landing-description">
            CedarType makes it easier to write Pacific Northwest Indigenous languages—with the characters, spelling, and care they deserve.
          </p>
          <div className="landing-actions">
            <button className="launch-button" type="button" onClick={onOpenEditor}>
              Open CedarType <span aria-hidden="true">↗</span>
            </button>
            <button className="text-link" type="button" onClick={() => document.getElementById("downloads")?.scrollIntoView({ behavior: "smooth" })}>Get CedarType <span aria-hidden="true">↓</span></button>
          </div>
          <p className="landing-note">Free · Open source · Built for Unicode</p>
        </div>

        <PacificNorthwestMap />
      </section>

      <section className="language-strip" aria-label="Supported languages">
        <span>MADE FOR</span>
        <p>Lushootseed <i>·</i> Chinuk Wawa <i>·</i> Tlingit <i>·</i> Haida <i>·</i> Kwak̓wala <i>·</i> Nuu-chah-nulth</p>
      </section>

      <section className="download-section" id="downloads">
        <div className="download-intro">
          <p className="landing-eyebrow">TAKE IT WITH YOU</p>
          <h2>One keyboard.<br /><em>More places to write.</em></h2>
          <p>Choose the CedarType experience that fits the way you work.</p>
        </div>
        <div className="download-cards">
          <article className="download-card">
            <span className="platform-icon"><AppleIcon /></span>
            <h3>For Mac</h3>
            <p>Install the desktop input method and type across your Mac.</p>
            <a href="https://github.com/SaharshSS/CedarType/releases/latest" target="_blank" rel="noreferrer"><AppleIcon /> View releases <span>↗</span></a>
          </article>
          <article className="download-card">
            <span className="platform-icon"><WindowsIcon /></span>
            <h3>For Windows</h3>
            <p>Bring Indigenous language characters into your Windows workflow.</p>
            <a href="https://github.com/SaharshSS/CedarType/releases/latest" target="_blank" rel="noreferrer"><WindowsIcon /> View releases <span>↗</span></a>
          </article>
          <article className="download-card">
            <span className="platform-icon"><ChromeIcon /></span>
            <h3>Chrome extension</h3>
            <p>Compose with CedarType while you write across the web.</p>
            <a href="https://github.com/SaharshSS/CedarType/releases/latest" target="_blank" rel="noreferrer"><ChromeIcon /> View releases <span>↗</span></a>
          </article>
        </div>
        <p className="release-footnote">Desktop and browser downloads are shared through CedarType’s GitHub releases.</p>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="roadmap-heading">
          <p className="landing-eyebrow">WHERE WE’RE GOING</p>
          <h2>A roadmap for <em>what’s next.</em></h2>
          <p>Built in the open, with community contributions guiding the way.</p>
        </div>
        <div className="roadmap-list">
          {[
            ["Multi-language support", true],
            ["Multiple orthographies", true],
            ["Unicode character palette", true],
            ["Automatic character replacement", true],
            ["Local settings persistence", true],
            ["Expanded dictionaries", false],
            ["Improved spellcheck suggestions", false],
            ["Custom keyboard layouts", false],
            ["Mobile optimization", false],
            ["Additional Indigenous languages", false]
          ].map(([item, done]) => (
            <div className={`roadmap-item${done ? " is-done" : ""}`} key={item}>
              <span className="roadmap-check" aria-hidden="true">{done ? "✓" : "→"}</span>
              <span>{item}</span>
              <small>{done ? "AVAILABLE" : "UP NEXT"}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="thanks-section" id="thanks">
        <div className="thanks-heading">
          <div>
            <p className="landing-eyebrow">WITH GRATITUDE</p>
            <h2>Thanks to <em>our community.</em></h2>
          </div>
          <p>We’re grateful to the people and organizations who share their knowledge and support this work.</p>
        </div>
        {thanksImages.length ? (
          <div className="thanks-gallery">
            {thanksImages.map(({ src, name }) => (
              <figure className="thanks-image" key={src}>
                <img src={src} alt={name} />
                <figcaption>{name}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="thanks-empty">Add partner or supporter images to <code>src/assets/thanks/</code> to feature them here.</p>
        )}
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="#top"><span className="landing-mark" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M32 3 20 20h7L15 35h9L12 51h16v10h8V51h16L40 35h9L37 20h7L32 3Z" fill="currentColor" /></svg></span><span>CedarType</span></a>
        <p>Made with respect for the languages and communities who carry them.</p>
        <a className="contact-link" href="https://github.com/SaharshSS/CedarType/issues" target="_blank" rel="noreferrer">Contact us <span>↗</span></a>
      </footer>
    </main>
  );
}

function GithubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.16 1.71 1.16.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.3-2.62 5.25-5.11 5.52.4.35.75 1.03.75 2.08V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" /></svg>;
}

function AppleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.7 12.7c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2-.1 1.7-.7 3.2-.7s2 .7 3.2.7c1.3 0 2.1-1.2 2.9-2.4a10.5 10.5 0 0 0 1.3-2.7 4.1 4.1 0 0 1-3-3.5ZM14.4 5.9A4.2 4.2 0 0 0 15.4 3a4.4 4.4 0 0 0-2.8 1.4 4 4 0 0 0-1 2.8 3.7 3.7 0 0 0 2.8-1.3Z" /></svg>;
}

function WindowsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 4.9 10.9 3.7v8.1H2V4.9Zm10.1-1.3L22 2v9.8h-9.9V3.6ZM2 12.9h8.9V21L2 19.8v-6.9Zm10.1 0H22v9.8l-9.9-1.6v-8.2Z" /></svg>;
}

function ChromeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#e9c94b"/><path fill="#519b57" d="M2.5 6.5A11 11 0 0 0 12 23l5-8.7H7.2L2.5 6.5Z"/><path fill="#d95d4f" d="M2.5 6.5A11 11 0 0 1 22 7H12l-4.8 8.3-4.7-8.8Z"/><circle cx="12" cy="12" r="4.3" fill="#f7f4e5"/><circle cx="12" cy="12" r="3.3" fill="#4d8ec9"/></svg>;
}

function PacificNorthwestMap() {
  return (
    <div className="pnw-map-card" aria-label="Stylized map of the Pacific Northwest">
      <div className="map-topline"><span>CEDAR TYPE / FIELD NOTES</span><span>45° 32′ N — 122° 40′ W</span></div>
      <svg className="pnw-map" viewBox="0 0 520 440" role="img" aria-labelledby="map-title map-description">
        <title id="map-title">Pacific Northwest</title>
        <desc id="map-description">A stylized map showing the Pacific coast, British Columbia, Washington, Oregon, and Idaho.</desc>
        <defs>
          <pattern id="map-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#8a9d7b" opacity=".36" /></pattern>
          <clipPath id="land-clip"><path d="M142 37 408 41 402 111 419 143 410 188 427 218 418 259 438 290 420 323 422 374 382 373 347 391 313 381 285 401 250 387 221 397 197 382 173 383 164 356 143 335 153 305 130 278 143 248 126 219 139 188 121 160 137 128 124 97Z" /></clipPath>
        </defs>
        <path className="map-water" d="M0 0h520v440H0z" />
        <path className="map-land" d="M142 37 408 41 402 111 419 143 410 188 427 218 418 259 438 290 420 323 422 374 382 373 347 391 313 381 285 401 250 387 221 397 197 382 173 383 164 356 143 335 153 305 130 278 143 248 126 219 139 188 121 160 137 128 124 97Z" />
        <path className="map-terrain" clipPath="url(#land-clip)" d="M110 25h350v395H110z" />
        <path className="map-border" d="M127 160 405 161M141 248l276 1M168 335l255-1M288 40l-5 352" />
        <path className="map-river" d="M322 78c-18 35-10 49-25 77s-5 36-29 59-8 45-27 66 2 40-29 77" />
        <path className="map-river" d="M359 177c-23 17-48 16-64 37s-21 32-38 40" />
        <path className="map-coast" d="m141 37-17 60 13 31-16 32 18 28-14 31 17 29-13 30 23 27-10 30 22 21 9 27 24 0" />
        <path className="map-mountain" d="m282 179 16-30 12 30m-13-13 11 31 13-30m-25 16 12 30 13-29m-4 38 12-27 14 29m-41-3 12 30 13-27" />
        <circle className="map-pin" cx="304" cy="252" r="5" /><circle className="map-pin-halo" cx="304" cy="252" r="13" />
        <text className="map-city" x="320" y="256">CedarType</text>
        <text className="map-label" x="207" y="113">BRITISH COLUMBIA</text>
        <text className="map-label" x="191" y="213">WASHINGTON</text>
        <text className="map-label" x="201" y="301">OREGON</text>
        <text className="map-label" x="332" y="320">IDAHO</text>
        <text className="map-water-label" x="51" y="240" transform="rotate(-78 51 240)">PACIFIC OCEAN</text>
      </svg>
      <div className="map-bottomline"><span>COASTAL HOMELANDS · CASCADES · INLAND WATERS</span><span>✳</span></div>
    </div>
  );
}

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const openEditor = () => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    window.scrollTo(0, 0);
    setShowEditor(true);
  };

  return showEditor
    ? <EditorApp onHome={() => setShowEditor(false)} />
    : <LandingPage onOpenEditor={openEditor} />;
}

/*
 * Mounts the CedarType React application into the root DOM element.
 */
createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
