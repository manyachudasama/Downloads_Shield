import {
  extractFileName,
  getExtension,
  hasDoubleExtension,
  isDangerousExtension
} from "./fileDetector.js";

import {
  getMimeType,
  isExecutableMime
} from "./mimeChecker.js";

export async function analyzeDownload(item) {
  const filename = extractFileName(item);
  const ext = getExtension(filename);
  const mime = await getMimeType(item.url);

  if (hasDoubleExtension(filename)) {
    return {
      isDangerous: true,
      reason: "Disguised file detected"
    };
  }

  if (isDangerousExtension(ext)) {
    return {
      isDangerous: true,
      reason: "Blocked file type: ." + ext
    };
  }

  if (!ext && isExecutableMime(mime)) {
    return {
      isDangerous: true,
      reason: "Executable file without extension"
    };
  }

  if (ext === "zip") {
    return {
      isDangerous: false,
      reason: ""
    };
  }

  return {
    isDangerous: false,
    reason: ""
  };
}