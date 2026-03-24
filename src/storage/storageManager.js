const DEFAULT_SETTINGS = {
  enabled: true
};

export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["settings"], (result) => {
      resolve(result.settings || DEFAULT_SETTINGS);
    });
  });
}

export async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, resolve);
  });
}

export async function saveLog(log) {
  return new Promise((resolve) => {
    chrome.storage.local.get(["logs"], (result) => {
      const logs = result.logs || [];
      logs.push(log);
      chrome.storage.local.set({ logs }, resolve);
    });
  });
}