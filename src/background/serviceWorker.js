import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";

chrome.downloads.onCreated.addListener(async (item) => {
  try {
    if (!item.url || item.state === "interrupted") return;
    if (!item.url.startsWith("http")) return;
    if (item.byExtensionId === chrome.runtime.id) return;

    const settings = await getSettings();
    if (!settings.enabled) return;

    const filename = item.filename || item.url.split("/").pop();

    // ZIP warning
    if (filename.toLowerCase().endsWith(".zip")) {
      chrome.downloads.cancel(item.id);

      await saveLog({
        filename,
        url: item.url,
        action: "warning",
        reason: "ZIP file",
        time: Date.now()
      });

      openWarningPage(item, "ZIP files may contain harmful content");
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
    }
  } catch (err) {
    console.error("Error in download handler:", err);
  }
});

// allow download
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "ALLOW_DOWNLOAD") {
    chrome.downloads.download({
      url: msg.url,
      filename: msg.filename,
      conflictAction: "uniquify"
    });
  }
});

// open warning UI
function openWarningPage(item, reason) {
  const url = chrome.runtime.getURL(
    `src/ui/warning.html?file=${encodeURIComponent(item.filename)}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );

  chrome.windows.create({
    url,
    type: "popup",
    width: 450,
    height: 300
  });
}