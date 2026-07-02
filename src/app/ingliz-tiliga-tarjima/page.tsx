import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Ingliz tiliga tarjima — Lingua Translation | English translation",
  description:
    "O'zbekistondan ingliz tiliga tarjima. Notarial tarjima, diplom, hujjatlar tarjimasi ingliz tiliga Namangan va Toshkentda.",
};

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
