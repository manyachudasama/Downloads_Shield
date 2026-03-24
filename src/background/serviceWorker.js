chrome.downloads.onCreated.addListener(async (item) => {
  if (!item.url || item.state === "interrupted") return;

  if (!item.url.startsWith("http")) return;

  if (item.byExtensionId === chrome.runtime.id) return;

  const settings = await getSettings();
  if (!settings.enabled) return;

  const filename = item.filename.toLowerCase();

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