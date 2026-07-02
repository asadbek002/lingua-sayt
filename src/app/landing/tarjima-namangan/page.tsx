import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Tarjima Namangan — Lingua Translation | Notarial tarjima",
  description: "Namangang'da notarial tarjima. Diplom, metrka, hujjatlar tarjimasi. Lingua Translation ofisi Namangang'da.",
  robots: { index: false },
};

export default function LandingTarjimaNameanganPage() {
  return (
    <LandingPage
      title="Namangang'da tarjima xizmatlari"
      subtitle="Barcha rasmiy hujjatlar notarial tarjimasi. Ofisimiz Namangang'da."
      benefits={[
        "Namangan ofisida to'g'ridan-to'g'ri qabul",
        "Barcha rasmiy hujjatlar tarjimasi",
        "Notarial tasdiqlash",
        "Tezkor xizmat",
        "Online murojaat imkoni",
        "09:00–19:00 ish vaqti",
      ]}
      faqs={[
        { question: "Namangan ofisi qayerda?", answer: "Namangan ofisi manzilini bilish uchun +998 90 789 61 61 raqamiga qo'ng'iroq qiling." },
        { question: "Online murojaat qilsa bo'ladimi?", answer: "Ha, siz hujjat rasmini sayt orqali yuborib, tarjimani online olishingiz mumkin." },
        { question: "Ish vaqti qanday?", answer: "Dushanba-shanba 09:00 dan 19:00 gacha." },
      ]}
    />
  );
}
