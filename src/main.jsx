import React, {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { createRoot } from "react-dom/client";

import "./styles.css";

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
          tl: "ƛ",
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
          "x̌w": "x̌ʷ",
          "y'": "y̓",
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
  setText
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

  const match =
    keys.find(
      (key) =>
        before.endsWith(key)
    );

  if (!match) {
    return;
  }

  const replacement =
    mapping[match];

  const next =
    before.slice(
      0,
      -match.length
    ) +
    replacement +
    after;

  setText(next);

  requestAnimationFrame(() => {
    textarea.focus();

    const position =
      start -
      match.length +
      replacement.length;

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
 * Normalizes a dictionary word for reliable Unicode comparison.
 */
function normalizeDictionaryWord(word) {
  return word
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase();
}

/*
 * Converts a dictionary array into a Set for constant-time word lookup.
 */
function buildDictionarySet(dictionary) {
  return new Set(
    dictionary.map(
      normalizeDictionaryWord
    )
  );
}

/*
 * Removes punctuation surrounding a word while preserving Unicode letters,
 * combining marks, glottal symbols, and other relevant linguistic characters.
 */
function cleanWordForDictionary(word) {
  return word
    .normalize("NFC")
    .replace(
      /^[^\p{L}\p{M}\p{N}ʼʔƛł]+/u,
      ""
    )
    .replace(
      /[^\p{L}\p{M}\p{N}ʼʔƛł]+$/u,
      ""
    )
    .toLocaleLowerCase();
}

/*
 * Splits editor text into word-like tokens while preserving their positions.
 */
function tokenizeText(text) {
  const tokens = [];
  const regex = /\S+/gu;
  let match;

  while (
    (match = regex.exec(text)) !== null
  ) {
    tokens.push({
      word: match[0],
      start: match.index,
      end:
        match.index +
        match[0].length
    });
  }

  return tokens;
}

/*
 * Returns the words that are absent from the selected language dictionary.
 */
function getMisspelledWords(
  text,
  dictionarySet
) {
  const tokens =
    tokenizeText(text);

  return tokens.filter(
    (token) => {
      const cleaned =
        cleanWordForDictionary(
          token.word
        );

      if (!cleaned) {
        return false;
      }

      return !dictionarySet.has(
        cleaned
      );
    }
  );
}

/*
 * Creates a spellcheck-aware representation of the editor text.
 *
 * The textarea itself remains transparent so the user can type normally,
 * while this layer provides the visual dictionary highlighting underneath.
 */
function renderSpellcheckLayer(
  text,
  dictionarySet
) {
  const tokens =
    tokenizeText(text);

  if (!tokens.length) {
    return null;
  }

  const elements = [];
  let previousEnd = 0;

  tokens.forEach(
    (token, index) => {
      const whitespace =
        text.slice(
          previousEnd,
          token.start
        );

      if (whitespace) {
        elements.push(
          <Fragment
            key={`space-${index}`}
          >
            {whitespace}
          </Fragment>
        );
      }

      const cleaned =
        cleanWordForDictionary(
          token.word
        );

      const misspelled =
        cleaned &&
        !dictionarySet.has(
          cleaned
        );

      elements.push(
        <span
          key={`word-${index}`}
          className={
            misspelled
              ? "misspelled"
              : ""
          }
        >
          {token.word}
        </span>
      );

      previousEnd =
        token.end;
    }
  );

  elements.push(
    text.slice(previousEnd)
  );

  return elements;
}

/*
 * Renders the complete CedarType application.
 */
function App() {
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

  const spellcheckRef =
    useRef(null);

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
      () =>
        buildDictionarySet(
          profile.dictionary ||
            []
        ),
      [profile.dictionary]
    );

  /*
   * Finds the words in the current composition that are not present in the
   * selected language dictionary.
   */
  const misspelledWords =
    useMemo(
      () =>
        getMisspelledWords(
          text,
          dictionarySet
        ),
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
    localStorage.setItem(
      "cedartype-language",
      language
    );
  }, [language]);

  /*
   * Saves the selected orthography locally.
   */
  useEffect(() => {
    localStorage.setItem(
      "cedartype-orthography",
      orthography
    );
  }, [orthography]);

  /*
   * Saves the current composition locally.
   */
  useEffect(() => {
    localStorage.setItem(
      "cedartype-text",
      text
    );
  }, [text]);

  /*
   * Restores CedarType state from local storage.
   */
  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "cedartype-language"
      );

    const savedOrthography =
      localStorage.getItem(
        "cedartype-orthography"
      );

    const savedText =
      localStorage.getItem(
        "cedartype-text"
      );

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
   * Synchronizes the spellcheck overlay's scroll position with the textarea.
   */
  function handleScroll(event) {
    if (
      spellcheckRef.current
    ) {
      spellcheckRef.current.scrollTop =
        event.target.scrollTop;

      spellcheckRef.current.scrollLeft =
        event.target.scrollLeft;
    }
  }

  /*
   * Changes language and automatically selects its first available
   * orthography.
   */
  function handleLanguageChange(
    nextLanguage
  ) {
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
    setText(
      event.target.value
    );

    if (!autoReplace) {
      return;
    }

    requestAnimationFrame(() => {
      applyMapping(
        event.target,
        currentOrthography.mappings,
        setText
      );
    });
  }

  /*
   * Inserts a suggestion at the current word position.
   */
  function useSuggestion(word) {
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
            languages, with orthography-aware
            character palettes, dictionary
            spellchecking, and optional
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
            <div
              ref={
                spellcheckRef
              }
              className="spellcheck-layer"
              aria-hidden="true"
            >
              {renderSpellcheckLayer(
                text,
                dictionarySet
              )}
            </div>

            <textarea
              ref={
                textareaRef
              }
              value={text}
              onChange={
                handleInput
              }
              onScroll={
                handleScroll
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

