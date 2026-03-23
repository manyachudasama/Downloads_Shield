// Get data from URL
const params = new URLSearchParams(window.location.search);

const fileName = params.get("file");
const reason = params.get("reason");
const downloadUrl = params.get("downloadUrl");

// Show info
document.getElementById("fileName").innerText = "File: " + fileName;
document.getElementById("reason").innerText = "Reason: " + reason;

// Buttons
const proceedBtn = document.getElementById("proceedBtn");
const cancelBtn = document.getElementById("cancelBtn");

proceedBtn.addEventListener("click", () => {
  const confirmAgain = confirm(
    "This file may harm your system. Are you absolutely sure?"
  );

  if (confirmAgain) {
    chrome.downloads.download({
      url: downloadUrl
    });

    window.close();
  }
});

cancelBtn.addEventListener("click", () => {
  window.close();
});