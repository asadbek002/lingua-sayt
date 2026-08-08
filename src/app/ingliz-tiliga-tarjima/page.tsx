import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Ingliz tiliga tarjima — Lingua Translation | English translation",
  description:
    "O'zbekistondan ingliz tiliga tarjima. Notarial tarjima, diplom, hujjatlar tarjimasi ingliz tiliga Namangan va Toshkentda.",
};

const CONTENT_SECTIONS = [
  {
    heading: "Перевод документов на английский язык",
    paragraphs: [
      "Перевод на английский язык — одна из самых востребованных услуг для тех, кто планирует учёбу за рубежом, трудоустройство в международной компании, оформление визы или вида на жительство в англоязычных странах. Мы переводим дипломы, свидетельства, паспорта и другие официальные документы с точным соблюдением международных стандартов оформления.",
      "После перевода документ может быть заверен нотариально, что делает его официально признаваемым посольствами, университетами и государственными органами за рубежом.",
    ],
  },
  {
    heading: "Сроки выполнения",
    paragraphs: [
      "Стандартный срок перевода на английский язык — от 2 до 3 часов для небольших документов, для нотариального заверения — 1–2 рабочих дня.",
    ],
  },
];

const RELATED = [
  { label: "Koreys tiliga tarjima", href: "/koreys-tiliga-tarjima" },
  { label: "Rус tiliga tarjima", href: "/rus-tiliga-tarjima" },
  { label: "Нотариальный перевод", href: "/notarial-tarjima" },
];

const FAQS = [
  { question: "Ingliz tiliga tarjima qancha turadi?", answer: "Oddiy tarjima 60 000 so'm, notarial tarjima 100 000 so'mdan boshlanadi." },
  { question: "Qancha vaqt ketadi?", answer: "Oddiy tarjima 2–3 soat, notarial tarjima 1–2 ish kuni." },
  { question: "Diplom va attestatni ingliz tiliga tarjima qila olasizmi?", answer: "Ha, biz barcha turdagi akademik hujjatlarni ingliz tiliga tarjima qilamiz." },
  { question: "Tarjimani online olish mumkinmi?", answer: "Ha, siz hujjat rasmini yuborib, tayyor tarjimani onlayn olishingiz mumkin." },
];

export default function InglisTiligaTarjimaPage() {
  return (
    <ServicePage
      title="Ingliz tiliga tarjima — Lingua Translation"
      h1="Ingliz tiliga professional tarjima"
      description="Barcha turdagi hujjatlarni ingliz tiliga tarjima qilish. Notarial tasdiqlash bilan. Namangang va Toshkentda."
      benefits={[
        "Tezkor tarjima — 2–3 soat ichida",
        "Notarial tasdiqlash imkoni",
        "Diplom va attestat tarjimasi",
        "Tibbiy hujjatlar tarjimasi",
        "Online qabul",
        "Hamyonbop narxlar",
      ]}
      contentSections={CONTENT_SECTIONS}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Ingliz tiliga tarjima"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Ingliz tiliga tarjima", url: "/ingliz-tiliga-tarjima" },
      ]}
    />
  );
}
