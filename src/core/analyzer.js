import { isDangerousFile } from "./fileDetector.js";

export async function analyzeDownload(item) {
  const filename = item.filename || item.url.split("/").pop();

  // Extension check
  if (isDangerousFile(filename)) {
    return {
      isDangerous: true,
      reason: "Blocked: dangerous file type detected"
    };
  }

  // ZIP placeholder (future upgrade)
  if (filename.endsWith(".zip")) {
    return {
      isDangerous: false,
      reason: "ZIP scan not implemented yet"
    };
  }

  return { isDangerous: false };
}