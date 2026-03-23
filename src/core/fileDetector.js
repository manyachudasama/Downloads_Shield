import { dangerousExtensions, suspiciousKeywords } from "./rulesEngine.js";

// 1. Check for dangerous extensions (.exe, .bat, etc.)
export function isDangerousExtension(filename = "", url = "") {
  const name = filename.toLowerCase();
  const link = url.toLowerCase();

  return dangerousExtensions.some(ext =>
    name.endsWith(ext) || link.endsWith(ext)
  );
}

// 2. Detect disguised files (e.g., file.pdf.exe)
export function hasDoubleExtension(filename = "") {
  const parts = filename.toLowerCase().split(".");

  if (parts.length < 3) return false;

  const lastExt = "." + parts.pop();

  return dangerousExtensions.includes(lastExt);
}

// 3. Detect suspicious keywords (crack, keygen, etc.)
export function hasSuspiciousKeywords(filename = "") {
  const name = filename.toLowerCase();

  return suspiciousKeywords.some(keyword =>
    name.includes(keyword)
  );
}

// 4. Detect hidden or suspicious filenames
export function isSuspiciousName(filename = "") {
  return (
    !filename.includes(".") ||   // no extension
    filename.includes("..") ||  // weird pattern
    filename.length < 4         // too short
  );
}