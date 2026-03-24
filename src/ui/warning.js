const params = new URLSearchParams(window.location.search);

const file = params.get("file");
const reason = params.get("reason");
const downloadUrl = params.get("downloadUrl");

document.getElementById("file").textContent = file;
document.getElementById("reason").textContent = reason;

document.getElementById("proceed").addEventListener("click", () => {
  const firstConfirm = confirm("This file may harm your system. Continue?");
  if (!firstConfirm) return;

  const secondConfirm = confirm("Are you absolutely sure you want to download?");
  if (!secondConfirm) return;

  chrome.runtime.sendMessage({
    type: "ALLOW_DOWNLOAD",
    url: downloadUrl,
    filename: file
  });

  window.close();
});

document.getElementById("cancel").addEventListener("click", () => {
  window.close();
});