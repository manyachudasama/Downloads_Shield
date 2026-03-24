const dangerousExtensions = [
  "exe","scr","vbs","bat","com","pif",
  "js","msi","html","cmd","sh","jar"
];

export function isDangerousFile(filename) {
  if (!filename) return false;

  filename = filename.toLowerCase();

  // Remove query params if present
  filename = filename.split("?")[0];

  // Check extension anywhere in filename
  for (let ext of dangerousExtensions) {
    if (filename.endsWith("." + ext)) {
      return true;
    }

    // Detect disguised files like file.pdf.exe
    if (filename.includes("." + ext)) {
      return true;
    }
  }

  return false;
}