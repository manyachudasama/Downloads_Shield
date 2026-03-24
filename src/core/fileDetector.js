const dangerousExtensions = [
  "exe", "scr", "vbs", "bat", "com",
  "pif", "js", "msi", "html", "cmd",
  "sh", "jar"
];

export function isDangerousFile(filename) {
  if (!filename) return false;

  filename = filename.toLowerCase();

  // Extract extension
  const parts = filename.split(".");
  if (parts.length < 2) return false;

  const extension = parts.pop();

  // Check double extensions (file.pdf.exe)
  const secondExtension = parts.pop();

  if (dangerousExtensions.includes(extension)) {
    return true;
  }

  if (secondExtension && dangerousExtensions.includes(secondExtension)) {
    return true;
  }

  return false;
}