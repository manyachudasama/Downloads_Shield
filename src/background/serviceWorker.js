import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";
const allowedDownloads = new Set();

chrome.downloads.onCreated.addListener(async (item) => {
  const settings = await getSettings();

  if (!settings.enabled) return;

  const filename = item.filename || item.url.split("/").pop();
  item.filename = filename;

  if (allowedDownloads.has(item.url)) {
    allowedDownloads.delete(item.url);
    return;
  }

  const result = await analyzeDownload(item);

  if (result.isDangerous) {
    chrome.downloads.cancel(item.id);

    saveLog({
      filename: item.filename,
      url: item.url,
      action: "blocked",
      reason: result.reason,
      time: Date.now()
    });

    openWarningPage(item, result.reason);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "ALLOW_DOWNLOAD") {
    allowedDownloads.add(message.url);
  }
});

function openWarningPage(item, reason) {
  const url = chrome.runtime.getURL(
    `src/ui/warning.html?file=${encodeURIComponent(item.filename)}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );

  chrome.tabs.create({ url });
}