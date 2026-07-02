import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Никох гувоҳномаси таржимаси — Lingua Translation",
  description:
    "Никох гувоҳномаси ва ажрим гувоҳномасини нотариал таржима қилиш. Наманган ва Тошкентда тезкор хизмат.",
};

const RELATED = [
  { label: "Перевод метрики", href: "/metrka-tarjimasi" },
  { label: "Нотариальный перевод", href: "/notarial-tarjima" },
  { label: "Апостиль", href: "/apostil" },
];

const FAQS = [
  { question: "Никох гувоҳномасини қаерда таржима қилиш мумкин?", answer: "Наманган ва Тошкентдаги офисларимизда, шунингдек онлайн орқали ҳам мурожаат қилишингиз мумкин." },
  { question: "Таржима қанча вақт олади?", answer: "Одатда 2–4 иш куни ичида." },
  { question: "Нотариал таржима нима учун керак?", answer: "Виза, чет элда расмий хужжат топшириш, никоҳни рўйхатдан ўтказиш ва бошқа расмий мақсадлар учун керак." },
  { question: "Онлайн жўнатиш мумкинми?", answer: "Ҳа, сайт орқали ёки Telegram орқали ҳужжат расмини юборишингиз мумкин." },
];

export default function NikohGuvohnomasiTarjimasiPage() {
  return (
    <ServicePage
      title="Никох гувоҳномаси таржимаси — Lingua Translation"
      h1="Никох гувоҳномаси нотариал таржимаси"
      description="Никох гувоҳномаси, ажрим гувоҳномаси ва бошқа оилавий ҳужжатларни нотариал таржима қилиш."
      benefits={[
        "Никох гувоҳномаси таржимаси",
        "Туrmush qurmaganlik guvohnomasi tarjimasi",
        "Нотариал тасдиқлаш",
        "2–4 иш куни ичида",
        "Онлайн мурожаат имкони",
        "Рус, ўзбек ва корейс тилида қўллаб-қувватлаш",
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      serviceName="Перевод свидетельства о браке"
      breadcrumbs={[
        { name: "Главная", url: "/" },
        { name: "Никох гувоҳномаси", url: "/nikoh-guvohnomasi-tarjimasi" },
      ]}
    />
  );
}
