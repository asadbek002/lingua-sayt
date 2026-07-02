import type { Application } from "@prisma/client";

export function formatTelegramMessage(app: Application): string {
  const date = new Date(app.createdAt).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `🆕 Новая заявка с сайта Lingua Translation

👤 Имя: ${app.fullName}
📞 Телефон: ${app.phone}
🏙 Город: ${app.city}

💬 Способ связи: ${app.preferredMessenger}
🔗 Контакт: ${app.messengerContact || "не указан"}

📄 Услуга: ${app.serviceType}
🌐 Перевод: ${app.sourceLanguage || "—"} → ${app.targetLanguage || "—"}
⏱ Срочность: ${app.urgency}

📝 Комментарий:
${app.comment || "—"}

📎 Файл: ${app.fileName || "не загружен"}

🆔 ID заявки: ${app.id}
📅 Дата: ${date}`;
}
