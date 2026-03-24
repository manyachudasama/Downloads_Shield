import { analyzeDownload } from "../core/analyzer.js";
import { getSettings, saveLog } from "../storage/storageManager.js";

function openWarningPage(item, reason) {
  const url = chrome.runtime.getURL(
    `../ui/warning.html?file=${encodeURIComponent(item.filename || "")}&reason=${encodeURIComponent(reason)}&downloadUrl=${encodeURIComponent(item.url)}`
  );
  chrome.tabs.create({ url });
}

chrome.downloads.onCreated.addListener(async (item) => {
  if (!item.url || item.state === "interrupted") return;
  if (!item.url.startsWith("http")) return;
  if (item.byExtensionId === chrome.runtime.id) return;

  const settings = await getSettings();
  if (!settings.enabled) return;

  const filename = (item.filename || "").toLowerCase();

  if (filename.endsWith(".zip")) {
    chrome.downloads.cancel(item.id);

    saveLog({
      filename: item.filename,
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