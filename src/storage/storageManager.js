export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["settings"], (res) => {
      resolve(res.settings || { enabled: true });
    });
  });
}

export function saveLog(log) {
  chrome.storage.local.get(["logs"], (res) => {
    const logs = res.logs || [];
    logs.push(log);

    chrome.storage.local.set({ logs });
  });
}