import { isDangerousFile } from "./fileDetector.js";

export async function analyzeDownload(item) {
  const filename = item.filename || item.url.split("/").pop();

  if (isDangerousFile(filename)) {
    return {
      isDangerous: true,
      reason: "Blocked due to dangerous file type"
    };
  }

  // Future: ZIP scanning logic
  if (filename.endsWith(".zip")) {
    return {
      isDangerous: false,
      reason: "ZIP scan not implemented yet"
    };
  }

  return {
    isDangerous: false
  };
}