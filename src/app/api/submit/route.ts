import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { driveClient, sheetsClient } from "@/lib/google";
import {
  FORMS,
  FormType,
  SHEET_ID,
  EMAIL_FROM,
  EMAIL_RECIPIENTS,
} from "@/lib/guthries";

export const runtime = "nodejs";
export const maxDuration = 60; // hobby plan caps at 10s; bumped here so it
// at least asks for the longer slot. If hobby rejects, fall back to 10.

interface Attachment {
  cid: string;
  fileId: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function appendSheetRow(tab: string, values: Record<string, string>) {
  const sheets = await sheetsClient();
  // Read header row to honour the sheet's current column order (parity with
  // n8n's "defineBelow" + named-column append).
  const hdr = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `'${tab}'!1:1`,
  });
  const headers = (hdr.data.values?.[0] || []) as string[];
  if (headers.length === 0)
    throw new Error(`Sheet tab "${tab}" has no header row`);
  const row = headers.map((h) => values[h] ?? "");
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `'${tab}'!A1`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

async function fetchPhotoBytes(fileId: string): Promise<Buffer> {
  const drive = await driveClient();
  // Service account has Editor on the parent folder, so it can read child files.
  const r = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer" }
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Buffer.from(r.data as any);
}

function makeTransport() {
  const user = process.env.SMTP_USER || EMAIL_FROM;
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP_PASS not set");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const formType = body.formType as FormType;
  const config = FORMS[formType];
  if (!config)
    return NextResponse.json({ error: `Unknown formType: ${formType}` }, { status: 400 });

  const attachments: Attachment[] = Array.isArray(body.attachments) ? body.attachments : [];
  const photoUrl = attachments[0]?.webViewLink || null;

  // 1. Append the Sheet row (parity with n8n).
  try {
    const values = config.row(body, photoUrl);
    await appendSheetRow(config.tab, values);
  } catch (e) {
    return NextResponse.json(
      { error: "Sheet append failed: " + (e as Error).message },
      { status: 500 }
    );
  }

  // 2. Send the email (inspection / lp only — matches n8n).
  if (config.email && body.htmlReport) {
    try {
      const transport = makeTransport();
      const mailAttachments = await Promise.all(
        attachments.map(async (a) => ({
          filename: a.name,
          content: await fetchPhotoBytes(a.fileId),
          contentType: a.mimeType,
          cid: a.cid,
        }))
      );
      await transport.sendMail({
        from: EMAIL_FROM,
        to: EMAIL_RECIPIENTS,
        subject: config.email.subject(body),
        html: body.htmlReport,
        attachments: mailAttachments,
      });
    } catch (e) {
      return NextResponse.json(
        { error: "Email send failed: " + (e as Error).message, partial: "sheet_ok" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
