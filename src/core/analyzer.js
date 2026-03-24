import { isDangerousFile, extractFileName, getExtension, hasDoubleExtension } from "./fileDetector.js";
import { getMimeType, isExecutableMime } from "./mimeChecker.js";
import { hasSuspiciousKeyword } from "./rulesEngine.js";

export async function analyzeDownload(item) {
  const filename = extractFileName(item) || "";
  const ext = getExtension(filename);
  const mime = await getMimeType(item.url);

  if (hasDoubleExtension(filename)) {
    return { isDangerous: true, reason: "Disguised file detected" };
  }

  if (isDangerousFile(filename)) {
    return { isDangerous: true, reason: "Blocked file type: ." + ext };
  }

  if (!ext && isExecutableMime(mime)) {
    return { isDangerous: true, reason: "Executable file without extension" };
  }

  if (hasSuspiciousKeyword(filename) || hasSuspiciousKeyword(item.url)) {
    return { isDangerous: true, reason: "Suspicious keyword detected" };
  }

  return { isDangerous: false, reason: "" };
}