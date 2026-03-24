import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";

const allowedDownloads = new Set();

chrome.downloads.onDeterminingFilename.addListener(async (item, suggest) => {
  if (allowedDownloads.has(item.id)) {
    allowedDownloads.delete(item.id);
    suggest();
    return;
  }

  try {
    const settings = await getSettings();
    if (!settings.enabled) {
      suggest();
      return;
    }

    const filename = (item.filename || "").toLowerCase();

    if (filename.endsWith(".zip") || filename.endsWith(".exe")) {
      chrome.downloads.cancel(item.id);

      await saveLog({
        filename,
        url: item.url,
        action: "blocked",
        reason: "Blocked file",
        time: Date.now()
      });

      openWarningPage(item, "File may be unsafe");
      return;
    }

    const result = await analyzeDownload(item);

    if (result.isDangerous) {
      chrome.downloads.cancel(item.id);

      await saveLog({
        filename,
        url: item.url,
        action: "blocked",
        reason: result.reason,
        time: Date.now()
      });

      openWarningPage(item, result.reason);
      return;
    }

    suggest();
  } catch {
    suggest();
  }
});

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "ALLOW_DOWNLOAD") {
    try {
      const downloadId = await chrome.downloads.download({
        url: msg.url,
        conflictAction: "uniquify"
      });
      allowedDownloads.add(downloadId);
    } catch (e) {
      console.error("Failed to start allowed download", e);
    }
  }
});

function openWarningPage(item, reason) {
  const url = chrome.runtime.getURL(
    `src/ui/warning.html?file=${encodeURIComponent(item.filename)}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );

  chrome.windows.create({
    url,
    type: "popup",
    width: 450,
    height: 320
  });
}