import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CheckCircle2, Phone, Send } from "lucide-react";
import { company } from "@/data/company";

interface LandingPageProps {
  title: string;
  subtitle: string;
  benefits: string[];
  price?: string;
  faqs: { question: string; answer: string }[];
}

export default function LandingPage({
  title,
  subtitle,
  benefits,
  price,
  faqs,
}: LandingPageProps) {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#c41e3a] to-[#8b0000] py-16 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-red-100 mb-8">{subtitle}</p>
            {price && (
              <div className="inline-block bg-white/20 rounded-xl px-6 py-3 mb-6">
                <p className="text-sm text-red-100">от</p>
                <p className="text-2xl font-bold">{price}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#application"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#c41e3a] font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                Оставить заявку
              </a>
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                <Send className="w-4 h-4" />
                Написать в Telegram
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Преимущества</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c41e3a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {company.phones.map((p) => (
                <a
                  key={p.phone}
                  href={`tel:${p.phone}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {p.label}: {p.phone}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <ContactForm />

        {/* FAQ */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Вопросы и ответы</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="p-4 bg-gray-50 rounded-2xl">
                  <summary className="font-semibold text-[#1a1a2e] cursor-pointer list-none">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
