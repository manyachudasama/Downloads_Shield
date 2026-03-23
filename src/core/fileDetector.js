export function extractFileName(item) {
  if (item.filename && item.filename.includes(".")) {
    return item.filename;
  }

  try {
    const url = new URL(item.url);
    const pathname = url.pathname.split("/").pop();
    return pathname || "";
  } catch {
    return "";
  }
}

export function getExtension(filename) {
  if (!filename) return "";

  const clean = filename.split("?")[0].toLowerCase();
  const parts = clean.split(".");

  if (parts.length < 2) return "";

  return parts.pop();
}

export function hasDoubleExtension(filename) {
  if (!filename) return false;

  const parts = filename.toLowerCase().split(".");
  if (parts.length < 3) return false;

  const dangerous = [
    "exe","scr","bat","cmd","com","pif","js","jar","vbs","msi","sh"
  ];

  return dangerous.includes(parts[parts.length - 1]);
}

export function isDangerousExtension(ext) {
  const blocked = [
    "exe","scr","bat","cmd","com","pif","js","jar","vbs","msi","sh"
  ];

  return blocked.includes(ext);
}