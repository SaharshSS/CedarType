(() => {
  const timers = new WeakMap();
  const replacing = new WeakSet();
  const editableTypes = new Set(["text", "search", "url", "tel", "email"]);
  let profiles = {};
  let settings = { enabled: true };
  let mappings = {};
  let mappingKeys = [];
  let revision = 0;

  function selectMappings() {
    mappings = profiles[settings.language]?.orthographies?.[settings.orthography]?.mappings ?? {};
    mappingKeys = Object.keys(mappings).sort((a, b) => b.length - a.length);
  }

  async function loadProfiles() {
    try {
      const response = await fetch(chrome.runtime.getURL("profiles.json"));
      profiles = await response.json();
      settings = await chrome.storage.local.get(null);
      if (settings.settingsVersion !== 2) {
        const previousSettings = await chrome.storage.sync.get(null);
        settings = { ...previousSettings, ...settings, enabled: true, settingsVersion: 2 };
        await chrome.storage.local.set(settings);
      }
      if (!settings.language || !profiles[settings.language]) {
        settings.language = Object.keys(profiles).sort()[0];
      }
      const orthographies = Object.keys(profiles[settings.language]?.orthographies ?? {}).sort();
      if (!orthographies.includes(settings.orthography)) settings.orthography = orthographies[0];
      selectMappings();
    } catch (error) {
      console.error("CedarType could not load its language profiles", error);
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    for (const [key, change] of Object.entries(changes)) settings[key] = change.newValue;
    revision += 1;
    selectMappings();
  });

  function findEditable(target) {
    if (!(target instanceof Element)) return null;
    const field = target.closest("textarea, input");
    if (field instanceof HTMLTextAreaElement) return { element: field, kind: "field" };
    if (field instanceof HTMLInputElement && editableTypes.has(field.type)) {
      return { element: field, kind: "field" };
    }
    const editable = target.closest('[contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]');
    if (editable?.isContentEditable) return { element: editable, kind: "rich" };
    return null;
  }

  function editableFromEvent(event) {
    // composedPath keeps the actual editor target available when a site wraps
    // its input in a shadow DOM or custom web component.
    for (const target of event.composedPath?.() ?? [event.target]) {
      const editable = findEditable(target);
      if (editable) return editable;
    }
    return null;
  }

  function isGoogleDocsFrame() {
    return location.hostname === "docs.google.com";
  }

  function readCaret(editable) {
    const { element, kind } = editable;
    if (kind === "field") {
      if (element.selectionStart == null || element.selectionStart !== element.selectionEnd) return null;
      return {
        before: element.value.slice(0, element.selectionStart),
        offset: element.selectionStart
      };
    }

    const selection = window.getSelection();
    if (!selection?.isCollapsed || !selection.anchorNode || !element.contains(selection.anchorNode)) return null;
    try {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
      return { before: range.toString(), offset: range.toString().length };
    } catch {
      return null;
    }
  }

  function findTextPoint(root, characterOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let remaining = characterOffset;
    let last = null;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const length = node.data.length;
      last = node;
      if (remaining <= length) return { node, offset: remaining };
      remaining -= length;
    }
    if (!last && characterOffset === 0) {
      const node = document.createTextNode("");
      root.appendChild(node);
      return { node, offset: 0 };
    }
    if (last && remaining === 0) return { node: last, offset: last.data.length };
    return null;
  }

  function mappedOutput(key, originalText) {
    const output = mappings[key];
    if (!/^[A-Z]/.test(originalText)) return output;
    const characters = Array.from(output);
    characters[0] = characters[0].toLocaleUpperCase();
    return characters.join("");
  }

  function replaceText(editable, start, end, replacement) {
    const { element, kind } = editable;
    if (kind === "field") {
      element.setRangeText(replacement, start, end, "end");
      replacing.add(element);
      element.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: replacement
      }));
      replacing.delete(element);
      return;
    }

    const startPoint = findTextPoint(element, start);
    const endPoint = findTextPoint(element, end);
    if (!startPoint || !endPoint) return;
    const range = document.createRange();
    range.setStart(startPoint.node, startPoint.offset);
    range.setEnd(endPoint.node, endPoint.offset);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    replacing.add(element);
    if (!document.execCommand("insertText", false, replacement)) {
      range.deleteContents();
      const text = document.createTextNode(replacement);
      range.insertNode(text);
      range.setStartAfter(text);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: replacement }));
    }
    replacing.delete(element);
  }

  function clearTimer(element) {
    const timer = timers.get(element);
    if (timer) clearTimeout(timer);
    timers.delete(element);
  }

  function hasLongerForm(key) {
    return mappingKeys.some((candidate) => candidate.length > key.length && candidate.startsWith(key));
  }

  function scheduleCommit(editable, expectedBefore) {
    const { element } = editable;
    const scheduledRevision = revision;
    clearTimer(element);
    const timer = setTimeout(() => {
      timers.delete(element);
      if (!settings.enabled || revision !== scheduledRevision) return;
      const caret = readCaret(editable);
      if (!caret || caret.before.toLocaleLowerCase() !== expectedBefore.toLocaleLowerCase()) return;
      const normalized = caret.before.toLocaleLowerCase();
      const key = mappingKeys.find((candidate) => normalized.endsWith(candidate));
      if (!key || !hasLongerForm(key)) return;
      const original = caret.before.slice(-key.length);
      replaceText(editable, caret.offset - key.length, caret.offset, mappedOutput(key, original));
    }, 650);
    timers.set(element, timer);
  }

  function onBeforeInput(event) {
    if (!settings.enabled || !event.cancelable || event.inputType !== "insertText" || !event.data || event.data.length !== 1) return;
    // Docs owns a custom editing model. Let its native input pipeline accept
    // the keystroke, then convert the resulting text in onInput below.
    if (isGoogleDocsFrame()) return;
    if (event.data.charCodeAt(0) > 0x7f) return;
    const editable = editableFromEvent(event);
    if (!editable) return;
    const caret = readCaret(editable);
    if (!caret) return;

    clearTimer(editable.element);
    const proposed = (caret.before + event.data).toLocaleLowerCase();
    const exact = mappingKeys.find((key) => proposed.endsWith(key));
    if (exact && !hasLongerForm(exact)) {
      event.preventDefault();
      const original = (caret.before + event.data).slice(-exact.length);
      replaceText(editable, caret.offset - exact.length + 1, caret.offset, mappedOutput(exact, original));
      return;
    }

    const deferred = mappingKeys.find((key) =>
      caret.before.toLocaleLowerCase().endsWith(key) && hasLongerForm(key)
    );
    if (!exact && deferred) {
      event.preventDefault();
      const original = caret.before.slice(-deferred.length);
      replaceText(editable, caret.offset - deferred.length, caret.offset, `${mappedOutput(deferred, original)}${event.data}`);
      return;
    }

    if (exact || mappingKeys.some((key) => proposed.endsWith(key.slice(0, Math.min(key.length, proposed.length)))) ) {
      scheduleCommit(editable, caret.before + event.data);
    }
  }

  // Keydown is the most consistent signal across browser text controls and
  // rich-text editors. Handle completed shortcuts here before the page editor
  // can swallow or rewrite beforeinput. Incomplete sequences continue through
  // the normal path below so ordinary text entry stays native.
  function onKeyDown(event) {
    if (!settings.enabled || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (isGoogleDocsFrame()) return;
    if (!event.key || event.key.length !== 1 || event.key.charCodeAt(0) > 0x7f) return;
    const editable = editableFromEvent(event);
    if (!editable) return;
    const caret = readCaret(editable);
    if (!caret) return;

    clearTimer(editable.element);
    const proposedText = caret.before + event.key;
    const proposed = proposedText.toLocaleLowerCase();
    const exact = mappingKeys.find((key) => proposed.endsWith(key));
    if (exact && !hasLongerForm(exact)) {
      event.preventDefault();
      const original = proposedText.slice(-exact.length);
      replaceText(editable, caret.offset - exact.length + 1, caret.offset, mappedOutput(exact, original));
      return;
    }

    const deferred = mappingKeys.find((key) =>
      caret.before.toLocaleLowerCase().endsWith(key) && hasLongerForm(key)
    );
    if (!exact && deferred) {
      event.preventDefault();
      const original = caret.before.slice(-deferred.length);
      replaceText(editable, caret.offset - deferred.length, caret.offset, `${mappedOutput(deferred, original)}${event.key}`);
      return;
    }

    if (exact || mappingKeys.some((key) => proposed.endsWith(key.slice(0, Math.min(key.length, proposed.length))))) {
      scheduleCommit(editable, proposedText);
    }
  }

  // Some sites emit incomplete or non-cancelable beforeinput events. The
  // input fallback converts the just-inserted ASCII text after the browser
  // updates the field, while the guard prevents our own replacement event
  // from being processed a second time.
  function onInput(event) {
    const editable = editableFromEvent(event);
    if (!editable || replacing.has(editable.element) || !settings.enabled) return;
    const caret = readCaret(editable);
    if (!caret || caret.offset === 0) return;
    clearTimer(editable.element);
    const normalized = caret.before.toLocaleLowerCase();
    const exact = mappingKeys.find((key) => normalized.endsWith(key));
    if (exact && !hasLongerForm(exact)) {
      if (isGoogleDocsFrame()) event.stopImmediatePropagation();
      const original = caret.before.slice(-exact.length);
      replaceText(editable, caret.offset - exact.length, caret.offset, mappedOutput(exact, original));
      return;
    }
    if (exact || mappingKeys.some((key) => key.startsWith(normalized.slice(-Math.min(key.length, normalized.length))))) {
      scheduleCommit(editable, caret.before);
    }
  }

  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("beforeinput", onBeforeInput, true);
  document.addEventListener("input", onInput, true);
  loadProfiles();
})();
