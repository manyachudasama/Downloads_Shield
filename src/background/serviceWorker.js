import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";

chrome.downloads.onDeterminingFilename.addListener(async (item, suggest) => {
  try {
    const settings = await getSettings();
    if (!settings.enabled) return suggest();

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

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "ALLOW_DOWNLOAD") {
    chrome.downloads.download({
      url: msg.url,
      filename: msg.filename,
      conflictAction: "uniquify"
    });
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