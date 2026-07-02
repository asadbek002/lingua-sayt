import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Koreys tiliga tarjima — Lingua Translation | 한국어 번역",
  description:
    "O'zbekistondan koreys tiliga tarjima. Diplom, hujjatlar va tibbiy hujjatlar koreys tiliga tarjimasi Namangan va Toshkentda.",
};

const RELATED = [
  { label: "Ingliz tiliga tarjima", href: "/ingliz-tiliga-tarjima" },
  { label: "Рус tiliga tarjima", href: "/rus-tiliga-tarjima" },
  { label: "Медицинский перевод", href: "/tibbiy-hujjatlar-tarjimasi" },
];

const FAQS = [
  { question: "Koreys tiliga tarjima qila olasizmi?", answer: "Ha, biz koreys tiliga va koreys tilidan tarjima qilamiz. Bu yo'nalish bizning asosiy yo'nalishlarimizdan biri." },
  { question: "Koreya universitetlari uchun hujjatlar tayyorlab berasizmi?", answer: "Ha, biz Koreya ta'lim muassasalari talablariga mos hujjatlarni tayyorlaymiz." },
  { question: "Koreys tilida mijozlarga yordam bera olasizmi?", answer: "Ha, bizda koreys tilida muloqot qila oladigan mutaxassislar mavjud." },
  { question: "Tarjima muddati qancha?", answer: "Hujjat turiga qarab 2–5 ish kuni." },
];

export default function KoreysTiligaTarjimaPage() {
  return (
    <ServicePage
      title="Koreys tiliga tarjima — Lingua Translation"
      h1="Koreys tiliga professional tarjima — 한국어 번역"
      description="O'zbek va rus tillaridan koreys tiliga professional tarjima. Koreya universitetlari va muassasalari uchun hujjatlar."
      benefits={[
        "Koreys tilini biladigan tarjimonlar",
        "Koreya muassasalari uchun hujjatlar",
        "Tibbiy hujjatlar tarjimasi",
        "Diplom va attestat tarjimasi",
        "Koreys tilida mijoz qo'llab-quvvatlash",
        "Online qabul va yetkazib berish",
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Корейский перевод документов"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Koreys tiliga tarjima", url: "/koreys-tiliga-tarjima" },
      ]}
    />
  );
}
