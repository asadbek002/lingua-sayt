import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Введите ваше имя").max(100, "Имя слишком длинное"),
  phone: z
    .string()
    .min(9, "Введите корректный номер телефона")
    .regex(/^\+?[\d\s\-()]+$/, "Некорректный формат номера"),
  city: z.enum(["Наманган", "Ташкент", "Онлайн"], {
    error: "Выберите город",
  }),
  preferredMessenger: z.enum(["Telegram", "WhatsApp", "KakaoTalk", "Звонок"], {
    error: "Выберите способ связи",
  }),
  messengerContact: z.string().optional(),
  serviceType: z.enum(
    [
      "Notarial tarjima",
      "Apostil",
      "Diplom tarjimasi",
      "Metrka tarjimasi",
      "Nikoh guvohnomasi tarjimasi",
      "Tibbiy hujjatlar tarjimasi",
      "Boshqa hujjat",
    ],
    { error: "Выберите услугу" }
  ),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string().optional(),
  urgency: z.enum(["Не срочно", "Сегодня", "Завтра", "Нужно уточнить"], {
    error: "Выберите срочность",
  }),
  comment: z.string().max(1000, "Комментарий слишком длинный").optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
