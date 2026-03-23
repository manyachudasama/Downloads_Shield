export const dangerousExtensions = [
  "exe","scr","vbs","bat","com","pif",
  "js","msi","cmd","sh","jar","html"
];

export const suspiciousKeywords = [
  "crack",
  "keygen",
  "patch",
  "hack",
  "free-download",
  "activated"
];

export function hasSuspiciousKeyword(text) {
  if (!text) return false;

  const lower = text.toLowerCase();

  return suspiciousKeywords.some(keyword =>
    lower.includes(keyword)
  );
}