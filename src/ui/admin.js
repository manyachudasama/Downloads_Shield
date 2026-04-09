const ADMIN_NAME = "admin";
const ADMIN_PASS = "1234";

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const logsDiv = document.getElementById("logs");

document.getElementById("loginBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const pass = document.getElementById("password").value;

  if (name === ADMIN_NAME && pass === ADMIN_PASS) {
    loginBox.style.display = "none";
    dashboard.style.display = "block";
    loadLogs();
  } else {
    alert("Invalid credentials");
  }
});

// Load logs (USES YOUR EXISTING STORAGE ✅)
function loadLogs() {
  chrome.storage.local.get(["logs"], (res) => {
    const logs = res.logs || [];

    if (logs.length === 0) {
      logsDiv.innerHTML = "No blocked files yet.";
      return;
    }

    logsDiv.innerHTML = "";

    logs.slice().reverse().forEach(log => {
      const div = document.createElement("div");
      div.className = "log";

      div.innerHTML = `
        <b>File:</b> ${log.filename} <br>
        <b>Type:</b> ${getFileType(log.filename)} <br>
        <b>Reason:</b> ${log.reason} <br>
        <b>Time:</b> ${new Date(log.time).toLocaleString()}
      `;

      logsDiv.appendChild(div);
    });
  });
}

// Extract file extension
function getFileType(filename) {
  if (!filename) return "unknown";
  return filename.split(".").pop();
}