import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PriceList from "@/components/PriceList";
import Languages from "@/components/Languages";
import Process from "@/components/Process";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import GoogleReviews from "@/components/GoogleReviews";
import LatestPosts from "@/components/LatestPosts";
import ContactForm from "@/components/ContactForm";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { organizationSchema, localBusinessSchema } from "@/lib/seo/jsonLd";
import { company } from "@/data/company";

/** The home page; its language comes from the URL (/, /uz, /en) via LocaleProvider. */
export default function HomeContent() {
  const jsonLd = [organizationSchema(), ...company.offices.map((office) => localBusinessSchema(office))];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <Hero />
        <Services />
        <PriceList />
        <Languages />
        <Process />
        <Benefits />
        <Guarantees />
        <GoogleReviews />
        <LatestPosts />
        <ContactForm />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
