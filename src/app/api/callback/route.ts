import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { isCrmChatConfigured, sendVisitorMessage } from "@/lib/services/crmChatService";
import { sendTelegramText } from "@/lib/services/telegramService";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { sanitizeText } from "@/lib/utils/sanitize";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,24}$/),
  page: z.string().max(200).optional(),
});

// "Call me back" request: name + phone only. Goes to the CRM (as a chat) and to the operators' Telegram.
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
  if (!checkRateLimit(`callback:${ip}`, 3, 10 * 60_000).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const name = sanitizeText(parsed.data.name);
  const phone = sanitizeText(parsed.data.phone);
  const page = sanitizeText(parsed.data.page ?? "");
  const text = `🔔 Просьба перезвонить\nИмя: ${name}\nТелефон: ${phone}${page ? `\nСтраница: ${page}` : ""}`;

  let crmSaved = false;
  if (isCrmChatConfigured()) {
    try {
      await sendVisitorMessage(`cb${randomBytes(12).toString("hex")}`, text, name, phone);
      crmSaved = true;
    } catch (err) {
      console.error("[API/callback] CRM error:", err);
    }
  }

  // Telegram is the safety net: if the CRM is down, the request must still reach an operator
  const tgSent = await sendTelegramText(`📞 Перезвоните мне\n${name}\n${phone}${page ? `\n${page}` : ""}`).catch(
    () => false
  );
  if (!crmSaved && !tgSent) {
    return NextResponse.json({ error: "Could not deliver the request" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
