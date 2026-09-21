import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./styles.css";

/*
 * Defines the language and orthography profiles used by CedarType.
 *
 * IMPORTANT:
 * - Orthographies are kept separate when a language has multiple documented systems.
 * - `chars` contains orthographic characters and useful multi-character sequences.
 * - `mappings` provides optional ASCII-friendly input shortcuts.
 * - Linguistic/IPA symbols are only included when they are actually useful for
 *   the selected orthography or documented transcription system.
 */
const LANGUAGE_PROFILES = {

  "Lushootseed": {
    code: "lut",

    orthographies: {

      "Lushootseed Dictionary": {
        note:
          "Lushootseed Dictionary / Vi Hilbert orthography. Based on the orthography developed by Vi Hilbert and other Lushootseed language specialists.",

        chars: [
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

          "sh": "š",
          "ch": "č",
          "j": "ǰ",

          "dz": "dᶻ",

          "tl": "ƛ",

          "b'": "b̓",
          "c'": "c̓",
          "ch'": "č̓",

          "k'": "k̓",
          "kw": "kʷ",
          "kw'": "k̓ʷ",

          "l'": "l̓",
          "m'": "m̓",
          "n'": "n̓",

          "p'": "p̓",

          "q'": "q̓",
          "qw": "qʷ",
          "qw'": "q̓ʷ",

          "s'": "s̓",
          "t'": "t̓",

          "w'": "w̓",

          "xw": "xʷ",
          "xv": "x̌",
          "x̌w": "x̌ʷ",

          "y'": "y̓",

          "'": "ʔ"
        }
      }
    }
  },


  "Chinuk Wawa": {
    code: "chn",

    orthographies: {

      "Grand Ronde": {
        note:
          "Grand Ronde Chinuk Wawa orthography. This is the modern revitalized orthography associated with the Confederated Tribes of Grand Ronde.",

        chars: [

          "a",
          "e",
          "ə",
          "i",
          "o",
          "u",

          "á",
          "é",
          "í",
          "ó",
          "ú",

          "p",
          "pʰ",
          "p̓",

          "t",
          "tʰ",
          "t̓",

          "k",
          "kʰ",
          "k̓",

          "kw",
          "kʰw",
          "k̓w",

          "q",
          "qʰ",
          "q̓",

          "qw",
          "qʰw",
          "q̓w",

          "ts",
          "t̓s",

          "ch",
          "c̓h",

          "tɬ",
          "t̓ɬ",

          "l",
          "ɬ",

          "s",
          "sh",

          "x",
          "xw",

          "x̣",
          "x̣w",

          "h",
          "m",
          "n",
          "w",
          "y",

          "ʔ"
        ],

        mappings: {

          "ph": "pʰ",
          "p'": "p̓",

          "th": "tʰ",
          "t'": "t̓",

          "kh": "kʰ",
          "k'": "k̓",

          "khw": "kʰw",
          "kw'": "k̓w",

          "qh": "qʰ",
          "q'": "q̓",

          "qhw": "qʰw",
          "qw'": "q̓w",

          "ts'": "t̓s",

          "ch'": "c̓h",

          "tl": "tɬ",
          "tl'": "t̓ɬ",

          "lh": "ɬ",

          "x.": "x̣",
          "x.w": "x̣w",

          "'": "ʔ"
        }
      },


      "Historical / Linguistic": {
        note:
          "Broader Latin transcription support for historical and linguistic work on Chinuk Wawa. This is intentionally separate from the Grand Ronde practical orthography.",

        chars: [

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

          "sh",
          "x",
          "xw",
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

          "ph": "pʰ",
          "p'": "p̓",

          "th": "tʰ",
          "t'": "t̓",

          "kh": "kʰ",
          "k'": "k̓",

          "khw": "kʰw",
          "kw'": "k̓w",

          "qh": "qʰ",
          "q'": "q̓",

          "qhw": "qʰw",
          "qw'": "q̓w",

          "tl": "tɬ",
          "tl'": "t̓ɬ",

          "lh": "ɬ",

          "x.": "x̣",
          "x.w": "x̣w",

          "'": "ʔ"
        }
      }
    }
  },


  "Tlingit": {
    code: "tli",

    orthographies: {

      "Revised Popular": {
        note:
          "Tlingit Revised Popular orthography. Uvulars are represented with combining underscore marks.",

        chars: [

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

          "aa",
          "áa",
          "àa",

          "ee",
          "ée",
          "èe",

          "ii",
          "íi",
          "ìi",

          "oo",
          "óo",
          "òo",

          "uu",
          "úu",
          "ùu",

          "ʼ"
        ],

        mappings: {

          "kh": "ḵ",
          "kh'": "ḵʼ",
          "khw": "ḵw",
          "kh'w": "ḵʼw",

          "gh": "g̱",
          "ghw": "g̱w",

          "xh": "x̱",
          "xh'": "x̱ʼ",
          "xhw": "x̱w",
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


      "Canadian": {
        note:
          "Canadian Tlingit orthography. Uvulars are represented using consonant+h sequences rather than the Revised Popular underscore convention.",

        chars: [

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

          "kʼ",
          "kʼw",
          "sʼ",
          "tʼ",

          "tlʼ",
          "tsʼ",

          "l",
          "ł",

          "xʼ",
          "xʼw",

          "aa",
          "ee",
          "ii",
          "oo",
          "uu",

          "ʼ"
        ],

        mappings: {

          "kh'": "khʼ",
          "khw": "khw",
          "kh'w": "khʼw",

          "gh": "gh",
          "ghw": "ghw",

          "xh'": "xhʼ",
          "xhw": "xhw",
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


      "Email": {
        note:
          "Tlingit Email orthography. This preserves much of Revised Popular spelling while using consonant+h forms instead of underscore diacritics for uvulars.",

        chars: [

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

          "kʼ",
          "kʼw",
          "sʼ",
          "tʼ",
          "tlʼ",
          "tsʼ",

          "xʼ",
          "xʼw",

          "lʼ",

          "aa",
          "áa",
          "ee",
          "ée",
          "ii",
          "íi",
          "oo",
          "óo",
          "uu",
          "úu",

          "ʼ"
        ],

        mappings: {

          "kh'": "khʼ",
          "khw": "khw",
          "kh'w": "khʼw",

          "gh": "gh",
          "ghw": "ghw",

          "xh'": "xhʼ",
          "xhw": "xhw",
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


  "Haida": {
    code: "hai",

    orthographies: {

      "Enrico": {
        note:
          "Haida orthography associated with John Enrico. Haida tone may be represented with acute and grave accents.",

        chars: [

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

          "aa",
          "áa",
          "àa",

          "ee",
          "ée",
          "èe",

          "ii",
          "íi",
          "ìi",

          "oo",
          "óo",
          "òo",

          "uu",
          "úu",
          "ùu"
        ],

        mappings: {

          "kh": "ḵ",
          "kh'": "ḵʼ",

          "xh": "x̱",
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


      "ANLC": {
        note:
          "Alaska Native Language Center Haida spelling system. This is maintained separately because it differs from the Enrico system.",

        chars: [

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

          "aa",
          "áa",
          "àa",

          "ee",
          "ée",
          "èe",

          "ii",
          "íi",
          "ìi",

          "oo",
          "óo",
          "òo",

          "uu",
          "úu",
          "ùu"
        ],

        mappings: {

          "kh": "ḵ",
          "kh'": "ḵʼ",

          "xh": "x̱",
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

    orthographies: {

      "U'mista": {
        note:
          "Modern U'mista orthography. This is the practical orthography developed by the U'mista Cultural Society.",

        chars: [

          "a̱",

          "b",
          "c",
          "č",

          "d",
          "dz",

          "g",
          "g̱",
          "g̱w",

          "k",
          "k̓",
          "k̓w",

          "ḵ",
          "ḵ̓",
          "ḵw",
          "ḵ̓w",

          "ł",

          "m",
          "n",

          "p",
          "p̓",

          "q",
          "q̓",
          "qw",
          "q̓w",

          "s",
          "š",

          "t",
          "t̓",

          "tł",
          "t̓ł",

          "ts",
          "t̓s",

          "w",
          "x",
          "x̱",
          "xw",
          "x̱w",

          "y",

          "z",

          "ə",

          "ʼ"
        ],

        mappings: {

          "a_": "a̱",

          "ch": "č",
          "sh": "š",

          "gh": "g̱",
          "ghw": "g̱w",

          "k'": "k̓",
          "k'w": "k̓w",

          "kh": "ḵ",
          "kh'": "ḵ̓",
          "khw": "ḵw",
          "kh'w": "ḵ̓w",

          "lh": "ł",

          "p'": "p̓",

          "q'": "q̓",
          "qw": "qw",
          "qw'": "q̓w",

          "t'": "t̓",

          "tl": "tł",
          "tl'": "t̓ł",

          "ts'": "t̓s",

          "xw": "xw",
          "xhw": "x̱w",
          "xh": "x̱",

          "'": "ʼ"
        }
      }
    }
  },


  "Nuu-chah-nulth": {
    code: "nch",

    orthographies: {

      "Standard": {
        note:
          "Standard Nuu-chah-nulth orthography.",

        chars: [

          "ʔ",

          "a",
          "e",
          "i",
          "o",
          "u",

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

          "s",

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

          "ch": "č",

          "ch'": "c̓",

          "h.": "ḥ",

          "sh": "š",

          "x.": "x̌",

          "tl": "ƛ",
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


      "Bouchard": {
        note:
          "Bouchard orthography. This system uses 7 for glottal stop and differs substantially from the Standard orthography.",

        chars: [

          "7",

          "a",
          "e",
          "i",
          "o",
          "u",

          "á",
          "é",
          "í",
          "ó",
          "ú",

          "c",
          "cʼ",

          "č",
          "čʼ",

          "ẖ",

          "lh",

          "ł",

          "m̓",
          "n̓",

          "pʼ",

          "q",
          "qʼ",

          "s",
          "š",

          "tʼ",

          "w̓",

          "x",

          "xw",

          "ƛ",
          "ƛʼ",

          "ʷ"
        ],

        mappings: {

          "ch": "č",
          "ch'": "čʼ",

          "h.": "ẖ",

          "sh": "š",

          "tl": "ƛ",
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
 * Provides local example words for the suggestion UI.
 *
 * These are interface examples rather than a dictionary and should not
 * be presented as an authoritative lexical database.
 */
const SUGGESTIONS = {

  "Lushootseed": [
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

  "Tlingit": [
    "gunalchéesh",
    "yakʼéixʼ",
    "áwé",
    "haa"
  ],

  "Haida": [
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
 * Inserts a string at the current caret position.
 */
function insertAtCaret(textarea, value, setText) {

  if (!textarea) {
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const next =
    textarea.value.slice(0, start) +
    value +
    textarea.value.slice(end);

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
 * Applies the longest matching transliteration sequence immediately
 * before the current caret position.
 */
function applyMapping(textarea, mapping, setText) {

  if (!textarea) {
    return;
  }

  const start = textarea.selectionStart;

  const before =
    textarea.value.slice(0, start);

  const after =
    textarea.value.slice(start);

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
 * Returns a flattened list of characters from every orthography
 * belonging to the selected language.
 *
 * This is useful for the "all characters" palette.
 */
function getAllLanguageCharacters(languageProfile) {

  const characters =
    languageProfile.orthographies;

  const all =
    Object.values(characters)
      .flatMap(
        (orthography) =>
          orthography.chars
      );

  return [
    ...new Set(all)
  ];
}


/*
 * Returns the currently selected orthography.
 */
function getOrthography(
  languageProfile,
  orthographyName
) {

  return (
    languageProfile
      .orthographies[
        orthographyName
      ]
  );
}


/*
 * Renders the complete CedarType interface.
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


  const profile =
    LANGUAGE_PROFILES[
      language
    ];


  /*
   * Retrieves the selected orthography profile.
   */
  const currentOrthography =
    getOrthography(
      profile,
      orthography
    );


  /*
   * Generates the character palette for the current language.
   */
  const characters =
    useMemo(() => {

      if (
        showAllCharacters
      ) {

        return getAllLanguageCharacters(
          profile
        );
      }

      return currentOrthography.chars;

    }, [
      profile,
      currentOrthography,
      showAllCharacters
    ]);


  /*
   * Generates lightweight local suggestions based on the current
   * word prefix.
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

  }, [
    language
  ]);


  /*
   * Saves the selected orthography locally.
   */
  useEffect(() => {

    localStorage.setItem(
      "cedartype-orthography",
      orthography
    );

  }, [
    orthography
  ]);


  /*
   * Saves the composition locally.
   */
  useEffect(() => {

    localStorage.setItem(
      "cedartype-text",
      text
    );

  }, [
    text
  ]);


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
   * Changes language and automatically selects the first available
   * orthography for that language.
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
   * Inserts a local suggestion at the current word position.
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
      ) +
      " ";

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

          <div className="brand-mark">
            C
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
            character palettes and optional
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


          <textarea
            ref={textareaRef}
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


          <div className="editor-footer">

            <span>
              {text.length} characters
            </span>

            <span>
              {currentOrthography.note}
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
                onChange={
                  (event) =>
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
                  Show every character
                  available for this language
                </small>

              </span>


              <input
                type="checkbox"
                checked={
                  showAllCharacters
                }
                onChange={
                  (event) =>
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
            (character, index) => (

              <button
                key={
                  `${character}-${index}`
                }
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
          Local composition
        </span>

      </footer>

      <Analytics />

    </main>
  );
}


createRoot(
  document.getElementById(
    "root"
  )
).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>
);
