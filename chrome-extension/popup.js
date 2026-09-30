const languagePicker = document.querySelector("#language");
const orthographyPicker = document.querySelector("#orthography");
const enabledToggle = document.querySelector("#enabled");
const statusLabel = document.querySelector("#status");
const siteAccessNotice = document.querySelector("#site-access");
const grantAccessButton = document.querySelector("#grant-access");

let profiles = {};
let settings = { enabled: true };

function fillSelect(select, values, selected) {
  select.replaceChildren(...values.map((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = value === selected;
    return option;
  }));
}

function currentOrthographies(language) {
  return Object.keys(profiles[language]?.orthographies ?? {}).sort((a, b) => a.localeCompare(b));
}

function updateStatus() {
  const language = languagePicker.value;
  statusLabel.textContent = settings.enabled
    ? `On · ${language} · ${orthographyPicker.value}`
    : "Off";
}

async function updateSiteAccess() {
  const allowed = await chrome.permissions.contains({ origins: ["<all_urls>"] });
  siteAccessNotice.hidden = allowed;
}

function saveSettings(changes) {
  settings = { ...settings, ...changes };
  // Local storage is fast and does not wait for sync replication before the
  // popup closes. Persist the complete selection atomically.
  chrome.storage.local.set(settings);
  updateStatus();
}

async function initialize() {
  try {
    const response = await fetch(chrome.runtime.getURL("profiles.json"));
    profiles = await response.json();
    settings = await chrome.storage.local.get(null);
    if (settings.settingsVersion !== 2) {
      const previousSettings = await chrome.storage.sync.get(null);
      settings = { ...previousSettings, ...settings, enabled: true, settingsVersion: 2 };
      await chrome.storage.local.set(settings);
    }

    await updateSiteAccess();

    const languages = Object.keys(profiles).sort((a, b) => a.localeCompare(b));
    const language = languages.includes(settings.language) ? settings.language : languages[0];
    fillSelect(languagePicker, languages, language);

    const orthographies = currentOrthographies(language);
    const orthography = orthographies.includes(settings.orthography)
      ? settings.orthography
      : orthographies[0];
    fillSelect(orthographyPicker, orthographies, orthography);
    enabledToggle.checked = Boolean(settings.enabled);

    if (language !== settings.language || orthography !== settings.orthography) {
      await saveSettings({ language, orthography });
    } else {
      updateStatus();
    }
  } catch (error) {
    statusLabel.textContent = "Could not load CedarType profiles";
    console.error("CedarType popup initialization failed", error);
  }
}

function selectLanguage() {
  const language = languagePicker.value;
  const orthography = currentOrthographies(language)[0];
  fillSelect(orthographyPicker, currentOrthographies(language), orthography);
  saveSettings({ language, orthography });
}

languagePicker.addEventListener("input", selectLanguage);
languagePicker.addEventListener("change", selectLanguage);

function selectOrthography() {
  saveSettings({ orthography: orthographyPicker.value });
}

orthographyPicker.addEventListener("input", selectOrthography);
orthographyPicker.addEventListener("change", selectOrthography);

enabledToggle.addEventListener("change", () => {
  saveSettings({ enabled: enabledToggle.checked });
});

grantAccessButton.addEventListener("click", async () => {
  grantAccessButton.disabled = true;
  try {
    const granted = await chrome.permissions.request({ origins: ["<all_urls>"] });
    await updateSiteAccess();
    if (granted) statusLabel.textContent = "Access granted · refresh the webpage to start typing";
  } catch (error) {
    statusLabel.textContent = "Chrome did not grant website access";
    console.error("CedarType could not request website access", error);
  } finally {
    grantAccessButton.disabled = false;
  }
});

initialize();
