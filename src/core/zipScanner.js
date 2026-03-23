import JSZip from "../../libs/jszip.min.js";

const dangerousExtensions = [
  "exe","scr","bat","cmd","com","pif","js","jar","vbs","msi","sh"
];

export async function scanZip(fileBlob) {
  const zip = await JSZip.loadAsync(fileBlob);
  const files = Object.keys(zip.files);

  for (let file of files) {
    const parts = file.toLowerCase().split(".");
    if (parts.length > 1) {
      const ext = parts.pop();
      if (dangerousExtensions.includes(ext)) {
        return {
          isDangerous: true,
          reason: "ZIP contains dangerous file: " + file
        };
      }
    }
  }

  return {
    isDangerous: false,
    reason: ""
  };
}