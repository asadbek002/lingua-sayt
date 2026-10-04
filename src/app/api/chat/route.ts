import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import {
  fetchChatMessages,
  isCrmChatConfigured,
  sendVisitorMessage,
  SESSION_ID_RE,
} from "@/lib/services/crmChatService";
import { sendTelegramText } from "@/lib/services/telegramService";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { sanitizeText } from "@/lib/utils/sanitize";

const sendSchema = z.object({
  sessionId: z.string().regex(SESSION_ID_RE),
  text: z.string().trim().min(1).max(1000),
  name: z.string().trim().max(60).optional(),
  phone: z.string().trim().max(30).optional(),
});

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
    "unknown"
  );
}

// Visitor -> CRM
export async function POST(req: NextRequest) {
  if (!isCrmChatConfigured()) {
    return NextResponse.json({ error: "Chat is not available" }, { status: 503 });
  }

  // 12 messages per minute per IP
  if (!checkRateLimit(`chat:${clientIp(req)}`, 12, 60_000).allowed) {
    return NextResponse.json({ error: "Too many messages" }, { status: 429 });
  }

  const parsed = sendSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const { sessionId } = parsed.data;
  const text = sanitizeText(parsed.data.text);
  const name = sanitizeText(parsed.data.name ?? "");
  const phone = sanitizeText(parsed.data.phone ?? "");
  if (!text) return NextResponse.json({ error: "Invalid message" }, { status: 400 });

  try {
    const id = await sendVisitorMessage(sessionId, text, name, phone);

    // Nudge the operators in Telegram; the conversation itself lives in the CRM
    const crmUrl = process.env.CRM_PUBLIC_URL;
    after(() =>
      sendTelegramText(
        `💬 Сообщение с сайта${name ? ` от ${name}` : ""}${phone ? ` (${phone})` : ""}:\n\n${text}${
          crmUrl ? `\n\nОтветить в CRM: ${crmUrl}` : ""
        }`
      ).catch(() => false)
    );

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[API/chat] send error:", err);
    return NextResponse.json({ error: "Could not deliver the message" }, { status: 502 });
  }
}

// CRM -> visitor (polling): messages newer than ?after=<id>
export async function GET(req: NextRequest) {
  if (!isCrmChatConfigured()) {
    return NextResponse.json({ error: "Chat is not available" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") ?? "";
  // availability probe used by the widget (no session yet)
  if (!searchParams.has("sessionId")) return NextResponse.json({ ok: true });
  const afterId = Math.max(parseInt(searchParams.get("after") || "0") || 0, 0);
  if (!SESSION_ID_RE.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  // polling every ~4s while the widget is open
  if (!checkRateLimit(`chat-poll:${clientIp(req)}`, 60, 60_000).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const messages = await fetchChatMessages(sessionId, afterId);
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[API/chat] poll error:", err);
    return NextResponse.json({ error: "Chat temporarily unavailable" }, { status: 502 });
  }
}
