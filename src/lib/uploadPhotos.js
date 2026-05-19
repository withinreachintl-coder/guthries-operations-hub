// Browser helper: upload photos directly to Google Drive via resumable
// upload sessions minted by /api/drive-session. Bypasses the Vercel 4.5 MB
// request body limit by sending bytes browser → Google, never through our API.

function dataUrlToBlob(dataUrl) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new Error("Bad data URL");
  const bin = atob(m[2]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: m[1] });
}

/**
 * @param {string} location
 * @param {{name:string, mimeType:string, dataUrl:string}[]} files
 * @returns {Promise<{fileId:string, webViewLink:string, name:string}[]>}
 */
export async function uploadPhotosToDrive(location, files) {
  if (!files.length) return [];
  const sessRes = await fetch("/api/drive-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location,
      files: files.map((f) => ({ name: f.name, mimeType: f.mimeType })),
    }),
  });
  if (!sessRes.ok) {
    const t = await sessRes.text();
    throw new Error(`drive-session failed (${sessRes.status}): ${t}`);
  }
  const { sessions } = await sessRes.json();
  if (!Array.isArray(sessions) || sessions.length !== files.length)
    throw new Error("drive-session returned wrong number of sessions");

  const results = [];
  for (let i = 0; i < files.length; i++) {
    const blob = dataUrlToBlob(files[i].dataUrl);
    const put = await fetch(sessions[i].uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": files[i].mimeType },
      body: blob,
    });
    if (!put.ok) {
      const t = await put.text();
      throw new Error(`Drive upload ${i + 1}/${files.length} failed (${put.status}): ${t}`);
    }
    const file = await put.json();
    results.push({ fileId: file.id, webViewLink: file.webViewLink, name: file.name });
  }
  return results;
}
