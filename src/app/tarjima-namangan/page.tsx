import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Tarjima Namangan — Lingua Translation | Notarial tarjima",
  description:
    "Namanganda notarial tarjima, apostil, diplom va hujjatlar tarjimasi. Lingua Translation — tezkor va sifatli xizmat.",
};

const CONTENT_SECTIONS = [
  {
    heading: "Бюро переводов в Намангане",
    paragraphs: [
      "Lingua Translation работает в Намангане и предлагает полный спектр переводческих услуг: нотариальный перевод, апостиль, перевод дипломов, свидетельств и медицинских документов. Наш офис расположен по адресу Бобуршох кучаси 3, удобно добраться из любой части города.",
      "Мы работаем с русским, узбекским, английским, корейским, немецким и китайским языками, что особенно актуально для жителей Намангана, планирующих учёбу, работу или переезд за рубеж.",
    ],
  },
  {
    heading: "Почему жители Намангана выбирают нас",
    paragraphs: [
      "Мы понимаем особенности работы с местными государственными органами и учебными заведениями, что позволяет быстро и без ошибок готовить документы для официального использования как внутри страны, так и за рубежом. Приём документов возможен онлайн — не обязательно приходить в офис лично для подачи заявки.",
    ],
  },
];

const RELATED = [
  { label: "Нотариальный перевод", href: "/notarial-tarjima" },
  { label: "Апостиль", href: "/apostil" },
  { label: "Перевод диплома", href: "/diplom-tarjimasi" },
  { label: "Переводы в Ташкенте", href: "/tarjima-tashkent" },
];

const FAQS = [
  { question: "Língua Translation Namanganda qaerda joylashgan?", answer: "Biz Namangang shahrida joylashganmiz. Manzilni bilish uchun biz bilan bog'laning yoki xaritada ko'ring." },
  { question: "Namangang ofisida qaysi hujjatlarni tarjima qilish mumkin?", answer: "Barcha turdagi rasmiy hujjatlar: diplom, attestat, metrka, nikoh guvohnomasi, tibbiy hujjatlar va boshqalar." },
  { question: "Online murojaat qilish mumkinmi?", answer: "Ha, siz hujjat rasmini yuborib, online murojaat qilishingiz mumkin." },
  { question: "Ish vaqti qanday?", answer: "09:00 dan 19:00 gacha, dushanba-shanba." },
];

export default function TarjimaNameanganPage() {
  return (
    <ServicePage
      title="Tarjima Namangan — Lingua Translation"
      h1="Namangang'da professional tarjima xizmatlari"
      description="Namangang shahrida notarial tarjima, apostil, diplom tarjimasi va boshqa rasmiy hujjatlar tarjimasi. Tezkor va sifatli xizmat."
      benefits={[
        "Namangan ofisida to'g'ridan-to'g'ri qabul",
        "Barcha rasmiy hujjatlar tarjimasi",
        "Notarial tasdiqlash",
        "Rus, o'zbek, koreys tili qo'llab-quvvatlash",
        "Online murojaat imkoni",
        "09:00–19:00 ish vaqti",
      ]}
      contentSections={CONTENT_SECTIONS}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Tarjima xizmatlari Namangan"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Tarjima Namangan", url: "/tarjima-namangan" },
      ]}
    />
  );
}
