import {
  isDangerousExtension,
  hasDoubleExtension,
  hasSuspiciousKeywords,
  isSuspiciousName
} from "./fileDetector.js";

import { analyzeZip } from "./zipAnalyzer.js";

export async function analyzeDownload(item) {
  const filename = item.filename || "";
  const url = item.url || "";

  // 1. Dangerous extension
  if (isDangerousExtension(filename, url)) {
    return { isDangerous: true, reason: "Dangerous file extension" };
  }

  // 2. Disguised file
  if (hasDoubleExtension(filename)) {
    return { isDangerous: true, reason: "Disguised file (double extension)" };
  }

  // 3. Suspicious keywords
  if (hasSuspiciousKeywords(filename)) {
    return { isDangerous: true, reason: "Suspicious filename" };
  }

  // 4. Suspicious naming
  if (isSuspiciousName(filename)) {
    return { isDangerous: true, reason: "Suspicious file pattern" };
  }

  // 5. ZIP file analysis
  if (filename.toLowerCase().endsWith(".zip")) {
    return await analyzeZip(item);
  }

  return { isDangerous: false };
}