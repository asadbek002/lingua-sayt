import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Tarjima Tashkent — Lingua Translation | Notarial tarjima Toshkent",
  description: "Toshkentda notarial tarjima. Diplom, metrka, hujjatlar tarjimasi. Lingua Translation Toshkent ofisi.",
  robots: { index: false },
};

export default function LandingTarjimaTashkentPage() {
  return (
    <LandingPage
      title="Toshkentda tarjima xizmatlari"
      subtitle="Barcha rasmiy hujjatlar notarial tarjimasi. Toshkent ofisimizda."
      benefits={[
        "Toshkent ofisida to'g'ridan-to'g'ri qabul",
        "Barcha rasmiy hujjatlar tarjimasi",
        "Notarial tasdiqlash",
        "Tezkor xizmat",
        "Online murojaat imkoni",
        "09:00–19:00 ish vaqti",
      ]}
      faqs={[
        { question: "Toshkent ofisi qayerda?", answer: "Toshkent ofisi manzilini bilish uchun +998 77 705 62 62 raqamiga qo'ng'iroq qiling." },
        { question: "Online murojaat qilsa bo'ladimi?", answer: "Ha, sayt orqali hujjat yuborib, Toshkent ofisidan xizmat olishingiz mumkin." },
        { question: "Ish vaqti qanday?", answer: "Dushanba-shanba 09:00 dan 19:00 gacha." },
      ]}
    />
  );
}
