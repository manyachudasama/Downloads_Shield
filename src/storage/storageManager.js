const DEFAULT_SETTINGS = {
  enabled: true,
  blacklist: []
};

// Use local storage consistently
export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["settings"], (res) => {
      resolve(res.settings || DEFAULT_SETTINGS);
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
    chrome.storage.local.get(["logs"], (res) => {
      const logs = res.logs || [];
      logs.push(log);
      chrome.storage.local.set({ logs }, resolve);
    });
  });
}

export async function getLogs() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["logs"], (res) => {
      resolve(res.logs || []);
    });
  });
}