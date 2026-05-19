import { google } from "googleapis";
import { readFileSync } from "fs";

// Service-account auth. Credentials come from one of:
//   GOOGLE_SERVICE_ACCOUNT_JSON  - full JSON key as a string (Vercel/prod)
//   GOOGLE_SA_KEY_FILE           - path to the JSON key file (local dev only)
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets",
];

function loadCredentials(): { client_email: string; private_key: string } {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw && raw.trim()) {
    const json = JSON.parse(raw);
    return { client_email: json.client_email, private_key: json.private_key };
  }
  const file = process.env.GOOGLE_SA_KEY_FILE;
  if (file) {
    const json = JSON.parse(readFileSync(file, "utf8"));
    return { client_email: json.client_email, private_key: json.private_key };
  }
  throw new Error(
    "No Google credentials: set GOOGLE_SERVICE_ACCOUNT_JSON (prod) or GOOGLE_SA_KEY_FILE (local)."
  );
}

let cachedAuth: ReturnType<typeof google.auth.GoogleAuth.prototype.getClient> extends Promise<infer T>
  ? T | null
  : null = null;

async function getAuthClient() {
  if (cachedAuth) return cachedAuth;
  const { client_email, private_key } = loadCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email, private_key },
    scopes: SCOPES,
  });
  cachedAuth = await auth.getClient();
  return cachedAuth;
}

// Drive file creation must run as a real user (service accounts have no Drive
// quota). OAuth2 refresh token for withinreachintl@gmail.com — same identity
// n8n used, so uploaded photos are owned by that Gmail.
export async function getDriveOAuthAccessToken(): Promise<string> {
  const id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refresh = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!id || !secret || !refresh)
    throw new Error(
      "Missing GOOGLE_OAUTH_CLIENT_ID / _SECRET / _REFRESH_TOKEN for Drive."
    );
  const oauth = new google.auth.OAuth2(id, secret);
  oauth.setCredentials({ refresh_token: refresh });
  const { token } = await oauth.getAccessToken();
  if (!token) throw new Error("Failed to refresh Drive OAuth access token");
  return token;
}

// Service-account token — used for Sheets only (edits existing user-owned
// spreadsheet, consumes no Drive quota).
export async function getAccessToken(): Promise<string> {
  const auth = await getAuthClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = await (auth as any).getAccessToken();
  const token = typeof t === "string" ? t : t?.token;
  if (!token) throw new Error("Failed to obtain Google access token");
  return token;
}

export async function sheetsClient() {
  const auth = await getAuthClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return google.sheets({ version: "v4", auth: auth as any });
}

export async function driveClient() {
  const auth = await getAuthClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return google.drive({ version: "v3", auth: auth as any });
}
