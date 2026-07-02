import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Tarjima Tashkent — Lingua Translation | Notarial tarjima Toshkent",
  description:
    "Toshkentda notarial tarjima, apostil, diplom tarjimasi. Lingua Translation — professional tarjima xizmatlari Toshkentda.",
};

const RELATED = [
  { label: "Нотариальный перевод", href: "/notarial-tarjima" },
  { label: "Апостиль", href: "/apostil" },
  { label: "Перевод диплома", href: "/diplom-tarjimasi" },
  { label: "Переводы в Намангане", href: "/tarjima-namangan" },
];

const FAQS = [
  { question: "Lingua Translation Toshkentda qayerda?", answer: "Toshkentdagi ofisimiz manzilini telefon orqali yoki saytdagi xarita orqali topish mumkin." },
  { question: "Toshkent ofisiga qanday murojaat qilish mumkin?", answer: "+998 77 705 62 62 raqamiga qo'ng'iroq qiling yoki Telegram orqali murojaat qiling." },
  { question: "Toshkentda notarial tarjima qilish qancha turadi?", answer: "Narxlar hujjat turiga qarab farq qiladi. Batafsil narxlar uchun saytdagi narxlar bo'limini ko'ring yoki biz bilan bog'laning." },
  { question: "Online xizmat ko'rsatasizmi?", answer: "Ha, siz hujjat rasmini yuborib, Toshkent ofisidan xizmat olishingiz mumkin." },
];

export default function TarjimaTashkentPage() {
  return (
    <ServicePage
      title="Tarjima Tashkent — Lingua Translation"
      h1="Toshkentda professional tarjima xizmatlari"
      description="Toshkent shahrida notarial tarjima, apostil, diplom va rasmiy hujjatlar tarjimasi. Tezkor va ishonchli xizmat."
      benefits={[
        "Toshkent ofisida to'g'ridan-to'g'ri qabul",
        "Barcha rasmiy hujjatlar tarjimasi",
        "Notarial tasdiqlash",
        "Rus, o'zbek, koreys tili qo'llab-quvvatlash",
        "Online murojaat imkoni",
        "09:00–19:00 ish vaqti",
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Tarjima xizmatlari Toshkent"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Tarjima Tashkent", url: "/tarjima-tashkent" },
      ]}
    />
  );
}
