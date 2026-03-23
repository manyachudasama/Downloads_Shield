const params = new URLSearchParams(window.location.search);

const fileName = params.get("file");
const reason = params.get("reason");
const downloadUrl = params.get("downloadUrl");

document.getElementById("fileName").textContent = "File: " + fileName;
document.getElementById("reason").textContent = "Reason: " + reason;

document.getElementById("proceedBtn").addEventListener("click", () => {
  const confirmAgain = confirm(
    "This file may harm your system. Do you want to continue?"
  );

  if (confirmAgain) {
    chrome.runtime.sendMessage({
      type: "ALLOW_DOWNLOAD",
      url: downloadUrl
    });

    chrome.downloads.download({
      url: downloadUrl,
      filename: fileName
    });

    window.close();
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  window.close();
});