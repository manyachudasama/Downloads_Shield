import { getSettings, saveSettings } from "../storage/storageManager.js";

const toggle = document.getElementById("toggle");

(async () => {
  const settings = await getSettings();
  toggle.checked = settings.enabled;
})();

toggle.addEventListener("change", async () => {
  await saveSettings({
    enabled: toggle.checked
  });
});