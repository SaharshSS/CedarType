<p align="center">
  <img src="https://raw.githubusercontent.com/SaharshSS/CedarType/main/src/assets/cedartype-banner.png" alt="CedarType Banner" />
</p>

<p align="center">
  <b>Open Source Keyboard (IME) for Web and Desktop supporting indigenous languages of the Pacific Northwest.</b>
</p>

<p align="center">
  <a href="https://github.com/SaharshSS/CedarType/releases">
    <img alt="Release" src="https://img.shields.io/github/v/release/SaharshSS/CedarType?include_prereleases&style=flat-square">
  </a>
  <a href="https://github.com/SaharshSS/CedarType/issues">
    <img alt="Issues" src="https://img.shields.io/github/issues/SaharshSS/CedarType?style=flat-square">
  </a>
  <a href="https://github.com/SaharshSS/CedarType/blob/main/LICENSE">
    <img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square">
  </a>
  <img alt="Status" src="https://img.shields.io/badge/status-WIP-yellow?style=flat-square">
  <img alt="Last Commit" src="https://img.shields.io/github/last-commit/SaharshSS/CedarType?style=flat-square">
  <a href="https://developer.nvidia.com/nvidia-omniverse">
    <img alt="Chrome Webstore Rating" src="https://img.shields.io/badge/rating-★★★★★-brightgreen">
  </a>
</p>

# CedarType

**CedarType** is a Unicode-first typing and input tool for **Pacific Northwest Indigenous languages**. It provides language-specific orthographies, character palettes, automatic character replacement, and dictionary-based spellchecking in a simple, accessible interface.

CedarType is designed to make specialized Indigenous-language orthographies easier to type without requiring users to memorize Unicode characters or configure complex keyboard layouts.

---

## Features

* Language-specific orthographies
* Unicode character palette
* Automatic character replacement
* Dictionary-based spellchecking
* Support for multiple orthographies per language
* English-keyboard-friendly input
* One-click character insertion
* Copy-ready Unicode text
* Local progress and settings persistence

---

## Supported Languages

CedarType currently includes orthographies for:

* **Lushootseed**
* **Chinuk Wawa**
* **Tlingit**
* **Haida**
* **Kwak̓wala**
* **Nuu-chah-nulth**

Each language can contain multiple orthographies where documented writing systems differ.

---

## Orthography Support

CedarType keeps orthographies separate rather than treating a language as having a single universal alphabet.

For example, Tlingit includes:

* Revised Popular
* Canadian
* Email

The character palette automatically changes when the selected language or orthography changes.

---

## Automatic Input

CedarType can convert convenient keyboard sequences into their Unicode equivalents.

For example:

```text
sh  → š
ch  → č
k'  → k̓
kw  → kʷ
'   → ʔ
```

This allows users to type specialized characters using a standard English keyboard.

---

## Full Keystroke Reference

Type each **Keys** sequence exactly as shown. CedarType inserts the matching
**Output** for the selected language and orthography. Mappings are
case-insensitive; starting a sequence with a capital letter capitalizes its
output. Ordinary letters pass through unchanged. The desktop app's **Keystrokes**
tab also lists direct letter keys for the currently selected profile.
Each special character in the web app palette has a readable typing sequence
where the orthography allows one (for example, `a'` → `á` and `a'a` → `áa`).

### Lushootseed — Lushootseed Dictionary

| Keys | Output |
| --- | --- |
| `'` | `ʔ` |
| `;e` | `ə` |
| `;l` | `ɫ` |
| `;lh` | `ɬ` |
| `b'` | `b̓` |
| `c'` | `c̓` |
| `ch` | `č` |
| `ch'` | `č̓` |
| `dz` | `dᶻ` |
| `gw` | `gʷ` |
| `j` | `ǰ` |
| `k'` | `k̓` |
| `kw` | `kʷ` |
| `kw'` | `k̓ʷ` |
| `l'` | `l̓` |
| `lh` | `ł` |
| `m'` | `m̓` |
| `n'` | `n̓` |
| `p'` | `p̓` |
| `q'` | `q̓` |
| `qw` | `qʷ` |
| `qw'` | `q̓ʷ` |
| `s'` | `s̓` |
| `sh` | `š` |
| `t'` | `t̓` |
| `tl` | `ƛ` |
| `tl'` | `ƛ̓` |
| `w'` | `w̓` |
| `xv` | `x̌` |
| `xvw` | `x̌ʷ` |
| `xw` | `xʷ` |
| `y'` | `y̓` |

### Chinuk Wawa — Grand Ronde

| Keys | Output |
| --- | --- |
| `'` | `ʔ` |
| `;e` | `ə` |
| `a'` | `á` |
| `ch'` | `c̓h` |
| `e'` | `é` |
| `i'` | `í` |
| `k'` | `k̓` |
| `kh` | `kʰ` |
| `khw` | `kʰw` |
| `kw'` | `k̓w` |
| `lh` | `ɬ` |
| `o'` | `ó` |
| `p'` | `p̓` |
| `ph` | `pʰ` |
| `q'` | `q̓` |
| `qh` | `qʰ` |
| `qhw` | `qʰw` |
| `qw'` | `q̓w` |
| `t'` | `t̓` |
| `th` | `tʰ` |
| `tl` | `tɬ` |
| `tl'` | `t̓ɬ` |
| `ts'` | `t̓s` |
| `u'` | `ú` |
| `x.` | `x̣` |
| `x.w` | `x̣w` |

### Chinuk Wawa — Historical / Linguistic

| Keys | Output |
| --- | --- |
| `'` | `ʔ` |
| `;.` | `·` |
| `;e` | `ə` |
| `;p` | `′` |
| `a'` | `á` |
| `ae` | `æ` |
| `e'` | `é` |
| `i'` | `í` |
| `k'` | `k̓` |
| `kh` | `kʰ` |
| `khw` | `kʰw` |
| `kw'` | `k̓w` |
| `lh` | `ɬ` |
| `o'` | `ó` |
| `p'` | `p̓` |
| `ph` | `pʰ` |
| `q'` | `q̓` |
| `qh` | `qʰ` |
| `qhw` | `qʰw` |
| `qw'` | `q̓w` |
| `t'` | `t̓` |
| `th` | `tʰ` |
| `tl` | `tɬ` |
| `tl'` | `t̓ɬ` |
| `u'` | `ú` |
| `x.` | `x̣` |
| `x.w` | `x̣w` |

### Tlingit — Revised Popular

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `a'` | `á` |
| `a'a` | `áa` |
| ``a``` | `à` |
| ``a`a`` | `àa` |
| `e'` | `é` |
| `e'e` | `ée` |
| ``e``` | `è` |
| ``e`e`` | `èe` |
| `gh` | `g̱` |
| `ghw` | `g̱w` |
| `i'` | `í` |
| `i'i` | `íi` |
| ``i``` | `ì` |
| ``i`i`` | `ìi` |
| `k'` | `kʼ` |
| `k'w` | `kʼw` |
| `kh` | `ḵ` |
| `kh'` | `ḵʼ` |
| `kh'w` | `ḵʼw` |
| `khw` | `ḵw` |
| `l'` | `lʼ` |
| `l_` | `ł` |
| `o'` | `ó` |
| `o'o` | `óo` |
| ``o``` | `ò` |
| ``o`o`` | `òo` |
| `s'` | `sʼ` |
| `t'` | `tʼ` |
| `tl'` | `tlʼ` |
| `ts'` | `tsʼ` |
| `u'` | `ú` |
| `u'u` | `úu` |
| ``u``` | `ù` |
| ``u`u`` | `ùu` |
| `x'` | `xʼ` |
| `x'w` | `xʼw` |
| `xh` | `x̱` |
| `xh'` | `x̱ʼ` |
| `xh'w` | `x̱ʼw` |
| `xhw` | `x̱w` |
| `y:` | `ÿ` |

### Tlingit — Canadian

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `a'` | `á` |
| `a^` | `â` |
| ``a``` | `à` |
| `e'` | `é` |
| `e^` | `ê` |
| ``e``` | `è` |
| `gh` | `gh` |
| `ghw` | `ghw` |
| `i'` | `í` |
| `i^` | `î` |
| ``i``` | `ì` |
| `k'` | `kʼ` |
| `k'w` | `kʼw` |
| `kh'` | `khʼ` |
| `kh'w` | `khʼw` |
| `khw` | `khw` |
| `l_` | `ł` |
| `o'` | `ó` |
| `o^` | `ô` |
| ``o``` | `ò` |
| `s'` | `sʼ` |
| `t'` | `tʼ` |
| `tl'` | `tlʼ` |
| `ts'` | `tsʼ` |
| `u'` | `ú` |
| `u^` | `û` |
| ``u``` | `ù` |
| `x'` | `xʼ` |
| `x'w` | `xʼw` |
| `xh'` | `xhʼ` |
| `xh'w` | `xhʼw` |
| `xhw` | `xhw` |

### Tlingit — Email

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `a'` | `á` |
| `a'a` | `áa` |
| ``a``` | `à` |
| `e'` | `é` |
| `e'e` | `ée` |
| ``e``` | `è` |
| `gh` | `gh` |
| `ghw` | `ghw` |
| `i'` | `í` |
| `i'i` | `íi` |
| ``i``` | `ì` |
| `k'` | `kʼ` |
| `k'w` | `kʼw` |
| `kh'` | `khʼ` |
| `kh'w` | `khʼw` |
| `khw` | `khw` |
| `l'` | `lʼ` |
| `o'` | `ó` |
| `o'o` | `óo` |
| ``o``` | `ò` |
| `s'` | `sʼ` |
| `t'` | `tʼ` |
| `tl'` | `tlʼ` |
| `ts'` | `tsʼ` |
| `u'` | `ú` |
| `u'u` | `úu` |
| ``u``` | `ù` |
| `x'` | `xʼ` |
| `x'w` | `xʼw` |
| `xh'` | `xhʼ` |
| `xh'w` | `xhʼw` |
| `xhw` | `xhw` |

### Haida — Enrico

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `a'` | `á` |
| `a'a` | `áa` |
| ``a``` | `à` |
| ``a`a`` | `àa` |
| `e'` | `é` |
| `e'e` | `ée` |
| ``e``` | `è` |
| ``e`e`` | `èe` |
| `i'` | `í` |
| `i'i` | `íi` |
| ``i``` | `ì` |
| ``i`i`` | `ìi` |
| `kh` | `ḵ` |
| `kh'` | `ḵʼ` |
| `o'` | `ó` |
| `o'o` | `óo` |
| ``o``` | `ò` |
| ``o`o`` | `òo` |
| `u'` | `ú` |
| `u'u` | `úu` |
| ``u``` | `ù` |
| ``u`u`` | `ùu` |
| `xh` | `x̱` |
| `xh'` | `x̱ʼ` |

### Haida — ANLC

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `a'` | `á` |
| `a'a` | `áa` |
| ``a``` | `à` |
| ``a`a`` | `àa` |
| `e'` | `é` |
| `e'e` | `ée` |
| ``e``` | `è` |
| ``e`e`` | `èe` |
| `i'` | `í` |
| `i'i` | `íi` |
| ``i``` | `ì` |
| ``i`i`` | `ìi` |
| `kh` | `ḵ` |
| `kh'` | `ḵʼ` |
| `o'` | `ó` |
| `o'o` | `óo` |
| ``o``` | `ò` |
| ``o`o`` | `òo` |
| `u'` | `ú` |
| `u'u` | `úu` |
| ``u``` | `ù` |
| ``u`u`` | `ùu` |
| `xh` | `x̱` |
| `xh'` | `x̱ʼ` |

### Kwak̓wala — U'mista

| Keys | Output |
| --- | --- |
| `'` | `ʼ` |
| `;e` | `ə` |
| `a_` | `a̱` |
| `ch` | `č` |
| `gh` | `g̱` |
| `ghw` | `g̱w` |
| `k'` | `k̓` |
| `k'w` | `k̓w` |
| `kh` | `ḵ` |
| `kh'` | `ḵ̓` |
| `kh'w` | `ḵ̓w` |
| `khw` | `ḵw` |
| `lh` | `ł` |
| `p'` | `p̓` |
| `q'` | `q̓` |
| `qw` | `qw` |
| `qw'` | `q̓w` |
| `sh` | `š` |
| `t'` | `t̓` |
| `tl` | `tł` |
| `tl'` | `t̓ł` |
| `ts'` | `t̓s` |
| `xh` | `x̱` |
| `xhw` | `x̱w` |
| `xw` | `xw` |

### Nuu-chah-nulth — Standard

| Keys | Output |
| --- | --- |
| `'` | `ʔ` |
| `;q` | `ʼ` |
| `;w` | `ʷ` |
| `a'` | `á` |
| `ch` | `č` |
| `ch'` | `c̓` |
| `e'` | `é` |
| `h.` | `ḥ` |
| `i'` | `í` |
| `l_` | `ł` |
| `m'` | `m̓` |
| `n'` | `n̓` |
| `o'` | `ó` |
| `p'` | `p̓` |
| `q'` | `q̓` |
| `sh` | `š` |
| `t'` | `t̓` |
| `tl` | `ƛ` |
| `tl'` | `ƛ̓` |
| `u'` | `ú` |
| `w'` | `w̓` |
| `x.` | `x̌` |

### Nuu-chah-nulth — Bouchard

| Keys | Output |
| --- | --- |
| `'` | `7` |
| `;w` | `ʷ` |
| `a'` | `á` |
| `c'` | `cʼ` |
| `ch` | `č` |
| `ch'` | `čʼ` |
| `e'` | `é` |
| `h.` | `ẖ` |
| `i'` | `í` |
| `l_` | `ł` |
| `m'` | `m̓` |
| `n'` | `n̓` |
| `o'` | `ó` |
| `p'` | `pʼ` |
| `q'` | `qʼ` |
| `sh` | `š` |
| `t'` | `tʼ` |
| `tl` | `ƛ` |
| `tl'` | `ƛʼ` |
| `u'` | `ú` |
| `w'` | `w̓` |

## Dictionary Spellcheck

CedarType includes language-specific dictionary support for checking typed words against the selected language.

The spellchecker is designed to recognize the orthography currently being used rather than relying on the browser's English spellchecker.

---

## Character Palette

The character palette provides quick access to characters that are difficult to type on a standard keyboard.

CedarType supports two modes:

* **Special characters**: displays characters unavailable on a standard English keyboard
* **All characters**: displays the complete character inventory for the selected orthography

Clicking a character inserts it directly into the editor.

---

## 🛠️ Quick Start

### Prerequisites

* Node.js
* npm
* Git

### Clone

```bash
git clone https://github.com/SaharshSS/CedarType.git
cd CedarType
```

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Then open the local development server shown in the terminal.

---

## Tech Stack

* **React**
* **JavaScript**
* **Unicode**
* **CSS**
* **Vite**

CedarType is designed to remain lightweight while supporting complex Unicode orthographies and language-specific input systems.

---

## Roadmap

* [x] Multi-language support
* [x] Multiple orthographies
* [x] Unicode character palette
* [x] Automatic character replacement
* [x] Local settings persistence
* [ ] Expanded dictionaries
* [ ] Improved spellcheck suggestions
* [ ] Custom keyboard layouts
* [ ] Mobile optimization
* [ ] Additional Indigenous languages

---

## Contributing

Contributions are welcome, especially from speakers, learners, linguists, and developers working with Indigenous languages.

If you would like to contribute an orthography, dictionary, correction, or language resource, open an issue or submit a pull request.

---

## License

See [`LICENSE`](LICENSE) for licensing information.

---

## Author

**Saharsh Shivshankar**

CedarType is an ongoing project focused on making PNW Indigenous-language Unicode input more accessible, accurate, and practical.
