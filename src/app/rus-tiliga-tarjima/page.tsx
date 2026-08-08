import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Rus tiliga tarjima — Lingua Translation | Перевод на русский",
  description:
    "O'zbek tilidan rus tiliga tarjima. Notarial tarjima, diplom va hujjatlar rus tiliga Namangan va Toshkentda.",
};

const CONTENT_SECTIONS = [
  {
    heading: "Перевод документов на русский язык",
    paragraphs: [
      "Мы выполняем профессиональный перевод документов с узбекского, английского, корейского, немецкого и китайского языков на русский. Такой перевод часто требуется для использования документов на территории стран СНГ, где русский язык широко принимается государственными органами.",
      "Мы переводим дипломы, свидетельства, паспорта, медицинские документы, справки и другую официальную документацию с последующим нотариальным заверением при необходимости.",
    ],
  },
  {
    heading: "Качество и точность перевода",
    paragraphs: [
      "Наши переводчики учитывают особенности юридической и официальной терминологии, чтобы перевод был не только точным, но и полностью соответствовал требованиям государственных органов, куда подаётся документ.",
    ],
  },
];

const RELATED = [
  { label: "Ingliz tiliga tarjima", href: "/ingliz-tiliga-tarjima" },
  { label: "Koreys tiliga tarjima", href: "/koreys-tiliga-tarjima" },
  { label: "Нотариальный перевод", href: "/notarial-tarjima" },
];

const FAQS = [
  { question: "O'zbekchadan ruscha tarjima qilasizmi?", answer: "Ha, biz o'zbek tilidan rus tiliga barcha turdagi hujjatlarni tarjima qilamiz." },
  { question: "Notarial tarjima ham qila olasizmi?", answer: "Ha, rus tiliga notarial tarjima xizmatimiz mavjud." },
  { question: "Tarjima muddati qancha?", answer: "Hujjat turiga qarab 1–5 ish kuni." },
  { question: "Qanday hujjatlar rus tiliga tarjima qilinadi?", answer: "Diplom, attestat, metrka, nikoh guvohnomasi, tibbiy hujjatlar, malumot varaqalar va boshqalar." },
];

export default function RusTiligaTarjimaPage() {
  return (
    <ServicePage
      title="Rus tiliga tarjima — Lingua Translation"
      h1="O'zbek tilidan rus tiliga tarjima"
      description="O'zbek va boshqa tillardan rus tiliga professional tarjima. Notarial tasdiqlash bilan. Namangan va Toshkentda."
      benefits={[
        "O'zbekchadan ruscha professional tarjima",
        "Notarial tasdiqlash imkoni",
        "Barcha rasmiy hujjatlar",
        "Tezkor xizmat",
        "Online qabul",
        "Hamyonbop narxlar",
      ]}
      contentSections={CONTENT_SECTIONS}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Перевод на русский язык"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Rus tiliga tarjima", url: "/rus-tiliga-tarjima" },
      ]}
    />
  );
}
