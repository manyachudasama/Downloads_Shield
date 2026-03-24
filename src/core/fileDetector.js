const dangerousExtensions = [
  "exe","scr","vbs","bat","com","pif",
  "js","msi","html","cmd","sh","jar"
];

export function isDangerousFile(filename) {
  if (!filename) return false;

  filename = filename.toLowerCase();

  const parts = filename.split(".");
  if (parts.length < 2) return false;

  const extension = parts.pop();
  const previous = parts.pop();

  if (dangerousExtensions.includes(extension)) return true;
  if (previous && dangerousExtensions.includes(previous)) return true;

  return false;
}