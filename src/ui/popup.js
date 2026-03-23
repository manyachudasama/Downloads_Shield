const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleBtn");

// Load current setting
chrome.storage.sync.get(["settings"], (res) => {
  const enabled = res.settings?.enabled ?? true;
  updateUI(enabled);
});

// Toggle button click
toggleBtn.addEventListener("click", () => {
  chrome.storage.sync.get(["settings"], (res) => {
    const current = res.settings?.enabled ?? true;

    const updated = { enabled: !current };

    chrome.storage.sync.set({ settings: updated }, () => {
      updateUI(updated.enabled);
    });
  });
});

// Update UI
function updateUI(enabled) {
  statusText.innerText = "Protection: " + (enabled ? "ON" : "OFF");

  toggleBtn.innerText = enabled ? "Disable" : "Enable";

  toggleBtn.className = enabled ? "enabled" : "disabled";
}