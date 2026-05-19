import { NextRequest, NextResponse } from "next/server";
import { getDriveOAuthAccessToken } from "@/lib/google";
import { folderForLocation } from "@/lib/guthries";

export const runtime = "nodejs";

interface FileReq {
  name: string;
  mimeType: string;
}

// Creates one Google Drive resumable upload session per file, in the folder
// for the given location. The browser then PUTs the file bytes directly to
// each returned uploadUrl — bypassing Vercel's request body limit entirely.
export async function POST(req: NextRequest) {
  let payload: { location?: string; files?: FileReq[] };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const files = Array.isArray(payload.files) ? payload.files : [];
  if (files.length === 0) return NextResponse.json({ sessions: [] });
  if (files.length > 50)
    return NextResponse.json({ error: "Too many files" }, { status: 400 });

  const folderId = folderForLocation(payload.location);
  const origin = req.headers.get("origin") || "";

  let token: string;
  try {
    token = await getDriveOAuthAccessToken();
  } catch (e) {
    return NextResponse.json(
      { error: "Auth failed: " + (e as Error).message },
      { status: 500 }
    );
  }

  const sessions: { uploadUrl: string }[] = [];
  for (const f of files) {
    const initRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": f.mimeType || "application/octet-stream",
          // Lets Google attach CORS to the session URI for browser PUTs.
          ...(origin ? { Origin: origin } : {}),
        },
        body: JSON.stringify({ name: f.name, parents: [folderId] }),
      }
    );
    if (!initRes.ok) {
      const txt = await initRes.text();
      return NextResponse.json(
        { error: `Drive session init failed (${initRes.status}): ${txt}` },
        { status: 502 }
      );
    }
    const uploadUrl = initRes.headers.get("location");
    if (!uploadUrl)
      return NextResponse.json(
        { error: "No resumable session URL returned by Drive" },
        { status: 502 }
      );
    sessions.push({ uploadUrl });
  }

  return NextResponse.json({ sessions });
}
