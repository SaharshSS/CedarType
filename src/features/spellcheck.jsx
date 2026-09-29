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
  
export {
    buildDictionarySet,
    getMisspelledWords
};
