import {
  extractFileName,
  getExtension,
  hasDoubleExtension,
  isDangerousExtension
} from "./fileDetector.js";

export async function analyzeDownload(item) {
  const filename = extractFileName(item) || item.url.split("/").pop();
  const ext = getExtension(filename);

  if (hasDoubleExtension(filename)) {
    return { isDangerous: true, reason: "Disguised file detected" };
  }

  if (isDangerousExtension(ext)) {
    return { isDangerous: true, reason: "Blocked file type: ." + ext };
  }

  return { isDangerous: false, reason: "" };
}