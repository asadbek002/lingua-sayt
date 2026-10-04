import type { Application } from "@prisma/client";
import { formatTelegramMessage } from "@/lib/utils/formatApplicationMessage";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error("[TelegramService] sendMessage error:", err);
    return false;
  }
}

async function sendDocument(chatId: string, fileBuffer: Buffer, filename: string): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("chat_id", chatId);
    const uint8 = new Uint8Array(fileBuffer);
    const blob = new Blob([uint8]);
    formData.append("document", blob, filename);

    const res = await fetch(`${TG_API}/sendDocument`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error("[TelegramService] sendDocument error:", err);
    return false;
  }
}

export async function sendTelegramNotification(
  application: Application,
  fileBuffer?: Buffer
): Promise<"SUCCESS" | "FAILED" | "SKIPPED"> {
  if (!BOT_TOKEN) {
    console.warn("[TelegramService] TELEGRAM_BOT_TOKEN not set, skipping notification");
    return "SKIPPED";
  }

  if (ADMIN_CHAT_IDS.length === 0) {
    console.warn("[TelegramService] TELEGRAM_ADMIN_CHAT_IDS not set, skipping notification");
    return "SKIPPED";
  }

  // parse_mode is HTML, so user-supplied text must be escaped
  const message = formatTelegramMessage(application)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  let allSuccess = true;

  for (const chatId of ADMIN_CHAT_IDS) {
    const textSent = await sendMessage(chatId, message);
    if (!textSent) allSuccess = false;

    if (fileBuffer && application.fileName) {
      const docSent = await sendDocument(chatId, fileBuffer, application.fileName);
      if (!docSent) allSuccess = false;
    }
  }

  return allSuccess ? "SUCCESS" : "FAILED";
}
