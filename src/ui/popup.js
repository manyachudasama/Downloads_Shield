const statusBox = document.getElementById("statusBox");
const toggleBtn = document.getElementById("toggleBtn");

// Load settings
chrome.storage.sync.get(["settings"], (res) => {
  const enabled = res.settings?.enabled ?? true;
  updateUI(enabled);
});

// Toggle
toggleBtn.addEventListener("click", () => {
  chrome.storage.local.get(["settings"], (res) => {
    const current = res.settings?.enabled ?? true;

    const updated = {
      ...res.settings,
      enabled: !current
    };

    chrome.storage.local.set({ settings: updated }, () => {
      updateUI(updated.enabled);
    });
  });
});

// UI update
function updateUI(enabled) {
  statusBox.textContent = enabled
    ? "Protection is ON"
    : "Protection is OFF";

  statusBox.className = "status " + (enabled ? "on" : "off");

  toggleBtn.textContent = enabled
    ? "Disable Protection"
    : "Enable Protection";

  toggleBtn.className = enabled ? "disable" : "enable";
}