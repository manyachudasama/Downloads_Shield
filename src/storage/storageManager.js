const DEFAULT_SETTINGS = {
  enabled: true,
  blacklist: []
};

export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["settings"], (res) => {
      resolve({
        ...DEFAULT_SETTINGS,
        ...(res.settings || {})
      });
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