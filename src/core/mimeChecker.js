export async function getMimeType(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.headers.get("content-type") || "";
  } catch {
    return "";
  }
}

export function isExecutableMime(mime) {
  const list = [
    "application/x-msdownload",
    "application/x-msdos-program",
    "application/octet-stream",
    "application/java-archive"
  ];

  return list.some(type => mime.includes(type));
}