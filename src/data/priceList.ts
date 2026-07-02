export type PriceItem = {
  category: { ru: string; uz: string; en: string };
  title: { ru: string; uz: string; en: string };
  regularPrice: string;
  partnerPrice: string;
  partnerSecondCopyPrice: string | null;
  duration: { ru: string; uz: string; en: string };
};

const DUR = {
  h2_3: { ru: "За 2–3 часа", uz: "2–3 soat ichida", en: "Within 2–3 hours" },
  d1_2: { ru: "1–2 рабочих дня", uz: "1–2 ish kunida", en: "1–2 business days" },
  d2_3: { ru: "2–3 рабочих дня", uz: "2–3 ish kunida", en: "2–3 business days" },
  d2_4: { ru: "2–4 рабочих дня", uz: "2–4 ish kunida", en: "2–4 business days" },
  d3_4: { ru: "3–4 рабочих дня", uz: "3–4 ish kunida", en: "3–4 business days" },
  d3_5: { ru: "3–5 рабочих дней", uz: "3–5 ish kunida", en: "3–5 business days" },
  tbd: { ru: "Уточняется", uz: "Aniqlanadi", en: "To be clarified" },
};

const CAT = {
  tarjima: { ru: "Перевод", uz: "Tarjima", en: "Translation" },
  extra: { ru: "Дополнительные услуги", uz: "Qo'shimcha xizmatlar", en: "Additional Services" },
};

export const priceList: PriceItem[] = [
  {
    category: CAT.tarjima,
    title: { ru: "Перевод на английский язык", uz: "Ingliz tiliga tarjima qilish", en: "Translation into English" },
    regularPrice: "60 000 so'm",
    partnerPrice: "35 000 so'm",
    partnerSecondCopyPrice: "50 000 so'm",
    duration: DUR.h2_3,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Нотариальный перевод на английский язык", uz: "Ingliz tiliga notarial tarjima qilish", en: "Notarized translation into English" },
    regularPrice: "100 000 so'm",
    partnerPrice: "70 000 so'm",
    partnerSecondCopyPrice: "120 000 so'm",
    duration: DUR.d1_2,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Школьный аттестат с QR-кодом", uz: "Maktab attestati QR kodli", en: "School certificate with QR code" },
    regularPrice: "220 000 so'm",
    partnerPrice: "150 000 so'm",
    partnerSecondCopyPrice: "180 000 so'm",
    duration: DUR.d2_3,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Школьный аттестат", uz: "Maktab attestati", en: "School certificate" },
    regularPrice: "250 000 so'm",
    partnerPrice: "180 000 so'm",
    partnerSecondCopyPrice: "220 000 so'm",
    duration: DUR.tbd,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Диплом колледжа / бакалавра", uz: "Kollej / Bakalavr diplomi", en: "College / Bachelor's diploma" },
    regularPrice: "270 000 so'm",
    partnerPrice: "190 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.tbd,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Свидетельство о браке", uz: "Nikoh guvohnomasi", en: "Marriage certificate" },
    regularPrice: "250 000 so'm",
    partnerPrice: "190 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d2_4,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Справка о несудимости", uz: "Sudlanmaganlik guvohnomasi", en: "Criminal record certificate" },
    regularPrice: "250 000 so'm",
    partnerPrice: "180 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d3_5,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Справка о незамужестве / неженатости", uz: "Turmush qurmaganlik guvohnomasi", en: "Single status certificate" },
    regularPrice: "250 000 so'm",
    partnerPrice: "180 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.tbd,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Свидетельство о рождении", uz: "Tug'ilganlik haqidagi guvohnoma", en: "Birth certificate" },
    regularPrice: "250 000 so'm",
    partnerPrice: "180 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d3_5,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Водительское удостоверение", uz: "Prava / Haydovchilik guvohnomasi", en: "Driver's license" },
    regularPrice: "250 000 so'm",
    partnerPrice: "200 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d3_4,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Кадастровые документы на недвижимость", uz: "Uy-joy kadastr hujjatlari", en: "Real estate cadastral documents" },
    regularPrice: "250 000 so'm",
    partnerPrice: "200 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d3_4,
  },
  {
    category: CAT.tarjima,
    title: { ru: "Трудовая книжка", uz: "Mehnat daftarchasi", en: "Employment record book" },
    regularPrice: "250 000 so'm",
    partnerPrice: "200 000 so'm",
    partnerSecondCopyPrice: "230 000 so'm",
    duration: DUR.d3_4,
  },
  {
    category: CAT.extra,
    title: { ru: "Сканирование документов", uz: "Hujjatlarni skaner qilish", en: "Document scanning" },
    regularPrice: "15 000 so'm",
    partnerPrice: "Уточняется / Aniqlanadi",
    partnerSecondCopyPrice: null,
    duration: DUR.tbd,
  },
];
