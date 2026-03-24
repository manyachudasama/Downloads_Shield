const dangerousExtensions = [
  "exe","scr","vbs","bat","com","pif",
  "js","msi","cmd","sh","jar"
];

export function extractFileName(item) {
  return item.filename || item.url.split("/").pop();
}

export function getExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}

export function hasDoubleExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 2;
}

export function isDangerousExtension(ext) {
  return dangerousExtensions.includes(ext);
}