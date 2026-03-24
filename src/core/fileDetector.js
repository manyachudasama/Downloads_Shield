const dangerousExtensions = [
  "exe","scr","vbs","bat","com","pif",
  "js","msi","html","cmd","sh","jar"
];

export function isDangerousFile(filename) {
  if (!filename) return false;
  filename = filename.toLowerCase().split("?")[0];

  for (let ext of dangerousExtensions) {
    if (filename.endsWith("." + ext)) return true;
    if (filename.includes("." + ext)) return true; // disguised
  }
  return false;
}

export function extractFileName(item) {
  if (!item) return "";
  return item.filename || item.url.split("/").pop() || "";
}

export function getExtension(filename) {
  const parts = filename.split(".");
  if (parts.length > 1) return parts.pop().toLowerCase();
  return "";
}

export function hasDoubleExtension(filename) {
  if (!filename) return false;
  const parts = filename.split(".");
  return parts.length > 2;
}