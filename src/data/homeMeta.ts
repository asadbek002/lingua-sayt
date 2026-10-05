import type { Locale } from "@/i18n/config";

export const homeMeta: Record<Locale, { title: string; description: string; keywords: string }> = {
  ru: {
    title: "Бюро переводов в Намангане и Ташкенте — Lingua Translation",
    description:
      "Нотариальные, медицинские и официальные переводы документов. Апостиль, перевод дипломов, свидетельств и справок. Офисы в Намангане и Ташкенте.",
    keywords:
      "бюро переводов Наманган, нотариальный перевод, апостиль, перевод документов Ташкент, перевод диплома",
  },
  uz: {
    title: "Namangan va Toshkentda tarjima byurosi — Lingua Translation",
    description:
      "Notarial, tibbiy va rasmiy hujjatlar tarjimasi. Apostil, diplom, guvohnoma va ma'lumotnomalar tarjimasi. Namangan va Toshkentda ofislar.",
    keywords:
      "tarjima byurosi Namangan, notarial tarjima, apostil, Toshkentda hujjatlar tarjimasi, diplom tarjimasi",
  },
  en: {
    title: "Translation Agency in Namangan and Tashkent — Lingua Translation",
    description:
      "Notarized, medical and official document translation. Apostille, translation of diplomas, certificates and records. Offices in Namangan and Tashkent.",
    keywords:
      "translation agency Namangan, notarized translation Uzbekistan, apostille Uzbekistan, document translation Tashkent, diploma translation",
  },
};
