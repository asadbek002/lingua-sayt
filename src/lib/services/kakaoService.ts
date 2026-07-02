import type { Application } from "@prisma/client";

const KAKAO_ENABLED = process.env.KAKAO_ENABLED === "true";
const KAKAO_PROVIDER = process.env.KAKAO_PROVIDER || "webhook";
const KAKAO_WEBHOOK_URL = process.env.KAKAO_WEBHOOK_URL || "";

function buildKakaoPayload(application: Application) {
  return {
    event: "new_application",
    applicationId: application.id,
    fullName: application.fullName,
    phone: application.phone,
    city: application.city,
    serviceType: application.serviceType,
    urgency: application.urgency,
    createdAt: application.createdAt,
  };
}

async function sendViaWebhook(application: Application): Promise<boolean> {
  if (!KAKAO_WEBHOOK_URL) {
    console.warn("[KakaoService] KAKAO_WEBHOOK_URL not set");
    return false;
  }

  try {
    const res = await fetch(KAKAO_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildKakaoPayload(application)),
    });
    return res.ok;
  } catch (err) {
    console.error("[KakaoService] webhook error:", err);
    return false;
  }
}

// Placeholder for future AlimTalk integration
async function sendViaAlimtalk(application: Application): Promise<boolean> {
  const KAKAO_SENDER_KEY = process.env.KAKAO_SENDER_KEY;
  const KAKAO_TEMPLATE_CODE = process.env.KAKAO_TEMPLATE_CODE;
  const KAKAO_RECEIVER_PHONE = process.env.KAKAO_RECEIVER_PHONE;

  if (!KAKAO_SENDER_KEY || !KAKAO_TEMPLATE_CODE || !KAKAO_RECEIVER_PHONE) {
    console.warn("[KakaoService] AlimTalk credentials not configured");
    return false;
  }

  // TODO: Implement actual AlimTalk API call
  console.log("[KakaoService] AlimTalk payload ready for:", application.id);
  return false;
}

export async function sendKakaoNotification(
  application: Application
): Promise<"SUCCESS" | "FAILED" | "SKIPPED"> {
  if (!KAKAO_ENABLED) {
    return "SKIPPED";
  }

  try {
    let success = false;

    if (KAKAO_PROVIDER === "webhook") {
      success = await sendViaWebhook(application);
    } else if (KAKAO_PROVIDER === "alimtalk") {
      success = await sendViaAlimtalk(application);
    }

    return success ? "SUCCESS" : "FAILED";
  } catch (err) {
    console.error("[KakaoService] notification error:", err);
    return "FAILED";
  }
}
