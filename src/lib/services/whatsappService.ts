import type { Application } from "@prisma/client";

const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === "true";
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const WHATSAPP_ADMIN_PHONE = process.env.WHATSAPP_ADMIN_PHONE || "";
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v20.0";

const WA_API = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

function buildWhatsAppMessage(application: Application): string {
  return `🆕 Новая заявка с сайта Lingua Translation

👤 ${application.fullName}
📞 ${application.phone}
🏙 ${application.city}
📄 ${application.serviceType}
⏱ ${application.urgency}
🆔 ${application.id}`;
}

export async function sendWhatsAppNotification(
  application: Application
): Promise<"SUCCESS" | "FAILED" | "SKIPPED"> {
  if (!WHATSAPP_ENABLED) {
    return "SKIPPED";
  }

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ADMIN_PHONE) {
    console.warn("[WhatsAppService] Missing credentials, skipping notification");
    return "SKIPPED";
  }

  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: WHATSAPP_ADMIN_PHONE,
      type: "text",
      text: { body: buildWhatsAppMessage(application) },
    };

    const res = await fetch(WA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("[WhatsAppService] API error:", error);
      return "FAILED";
    }

    return "SUCCESS";
  } catch (err) {
    console.error("[WhatsAppService] notification error:", err);
    return "FAILED";
  }
}
