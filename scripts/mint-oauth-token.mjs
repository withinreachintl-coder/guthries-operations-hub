// One-time: mint a Drive OAuth2 refresh token for withinreachintl@gmail.com.
// Run: node scripts/mint-oauth-token.mjs <CLIENT_ID> <CLIENT_SECRET>
import http from "http";
import { google } from "googleapis";

const [, , CLIENT_ID, CLIENT_SECRET] = process.argv;
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Usage: node scripts/mint-oauth-token.mjs <CLIENT_ID> <CLIENT_SECRET>");
  process.exit(1);
}
const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}`;
const oauth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);

const url = oauth.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/drive"],
});

const server = http.createServer(async (req, res) => {
  try {
    const code = new URL(req.url, REDIRECT).searchParams.get("code");
    if (!code) {
      res.end("No code.");
      return;
    }
    const { tokens } = await oauth.getToken(code);
    res.end("Done. Return to the terminal — you can close this tab.");
    console.log("\n=== COPY THESE INTO .env.local + Vercel ===");
    console.log("GOOGLE_OAUTH_CLIENT_ID=" + CLIENT_ID);
    console.log("GOOGLE_OAUTH_CLIENT_SECRET=" + CLIENT_SECRET);
    console.log("GOOGLE_OAUTH_REFRESH_TOKEN=" + tokens.refresh_token);
    console.log("===========================================");
    if (!tokens.refresh_token)
      console.log(
        "\n⚠️ No refresh_token returned. Revoke prior grant at " +
          "https://myaccount.google.com/permissions and rerun."
      );
    server.close();
    process.exit(0);
  } catch (e) {
    res.end("Error: " + e.message);
    console.error(e.message);
    server.close();
    process.exit(1);
  }
});
server.listen(PORT, () => {
  console.log("1. Open this URL, sign in as withinreachintl@gmail.com, allow:\n");
  console.log(url + "\n");
  console.log("2. Browser redirects to localhost — token prints here.");
});
