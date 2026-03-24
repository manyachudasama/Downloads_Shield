import { analyzeDownload } from "../analyzer.js";
import { getSettings, saveLog } from "../storageManager.js";

chrome.downloads.onCreated.addListener(async (item) => {
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
      reason: "ZIP file - requires user confirmation",
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
});

// Allow download from warning page
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "ALLOW_DOWNLOAD") {
    chrome.downloads.download({
      url: msg.url,
      filename: msg.filename,
      conflictAction: "uniquify"
    });
  }
});

// Open warning page popup
function openWarningPage(item, reason) {
  const warningUrl = chrome.runtime.getURL(
    `src/ui/warning.html?file=${encodeURIComponent(item.filename)}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );

  chrome.windows.create({
    url: warningUrl,
    type: "popup",
    width: 450,
    height: 300
  });
}