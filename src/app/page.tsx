import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import Languages from "@/components/Languages";
import Process from "@/components/Process";
import Benefits from "@/components/Benefits";
import ContactForm from "@/components/ContactForm";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { organizationSchema, localBusinessSchema } from "@/lib/seo/jsonLd";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Lingua Translation — профессиональное бюро переводов",
  description:
    "Нотариальные, медицинские и официальные переводы документов. Апостиль, перевод дипломов, свидетельств и справок. Офисы в Намангане и Ташкенте.",
};

export default function HomePage() {
  const jsonLd = [
    organizationSchema(),
    ...company.offices.map((office) => localBusinessSchema(office)),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <PriceList />
        <Languages />
        <Process />
        <Benefits />
        <ContactForm />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
