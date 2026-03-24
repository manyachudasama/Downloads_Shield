import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";

const allowedDownloads = new Set();

chrome.downloads.onDeterminingFilename.addListener(
  async (item, suggest) => {
    const settings = await getSettings();

    if (!settings.enabled) {
      suggest();
      return;
    }

    const filename = item.filename || extractFilename(item.url);

    if (allowedDownloads.has(item.url)) {
      allowedDownloads.delete(item.url);
      suggest();
      return;
    }

    const result = await analyzeDownload({
      ...item,
      filename
    });

    if (result.isDangerous) {
      chrome.downloads.cancel(item.id);

      saveLog({
        filename,
        url: item.url,
        action: "blocked",
        reason: result.reason,
        time: Date.now()
      });

      openWarningPage({ ...item, filename }, result.reason);

      return; 
    }

    suggest({ filename });
  }
);

chrome.downloads.onCreated.addListener(async (item) => {
  const settings = await getSettings();
  if (!settings.enabled) return;

  const filename = extractFilename(item.url);

  if (allowedDownloads.has(item.url)) {
    allowedDownloads.delete(item.url);
    return;
  }

  const result = await analyzeDownload({
    ...item,
    filename
  });

  if (result.isDangerous) {
    chrome.downloads.cancel(item.id);

    saveLog({
      filename,
      url: item.url,
      action: "blocked",
      reason: result.reason,
      time: Date.now()
    });

    openWarningPage({ ...item, filename }, result.reason);
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "ALLOW_DOWNLOAD") {
    allowedDownloads.add(msg.url);
  }
});

function extractFilename(url) {
  try {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
  } catch {
    return "unknown";
  }
}

function openWarningPage(item, reason) {
  const url = chrome.runtime.getURL(
    `src/ui/warning.html?file=${encodeURIComponent(item.filename)}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );

  chrome.tabs.create({ url });
}