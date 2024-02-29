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