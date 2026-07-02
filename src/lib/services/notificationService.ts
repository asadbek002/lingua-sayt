import type { Application } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "./telegramService";
import { sendKakaoNotification } from "./kakaoService";
import { sendWhatsAppNotification } from "./whatsappService";

export async function sendAllNotifications(
  application: Application,
  fileBuffer?: Buffer
): Promise<void> {
  const results = await Promise.allSettled([
    sendTelegramNotification(application, fileBuffer),
    sendKakaoNotification(application),
    sendWhatsAppNotification(application),
  ]);

  const [telegramResult, kakaoResult, whatsappResult] = results;

  const telegramStatus =
    telegramResult.status === "fulfilled" ? telegramResult.value : "FAILED";
  const kakaoStatus =
    kakaoResult.status === "fulfilled" ? kakaoResult.value : "FAILED";
  const whatsappStatus =
    whatsappResult.status === "fulfilled" ? whatsappResult.value : "FAILED";

  try {
    await prisma.application.update({
      where: { id: application.id },
      data: {
        telegramNotificationStatus: telegramStatus,
        kakaoNotificationStatus: kakaoStatus,
        whatsappNotificationStatus: whatsappStatus,
      },
    });
  } catch (err) {
    console.error("[NotificationService] Failed to update notification statuses:", err);
  }
}
