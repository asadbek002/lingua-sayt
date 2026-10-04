import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CheckCircle2, ChevronDown, Phone, Send } from "lucide-react";
import { company } from "@/data/company";
import { formatPhone } from "@/lib/utils/formatPhone";

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
      <main className="pt-16 lg:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-14 sm:py-20 text-white">
          <div aria-hidden="true" className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#c41e3a]/20 blur-3xl" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-[32px] sm:text-5xl font-bold tracking-tight leading-[1.15] mb-4 text-balance">{title}</h1>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">{subtitle}</p>
            {price && (
              <div className="inline-block bg-white/10 border border-white/10 rounded-xl px-6 py-3 mb-8">
                <p className="text-sm text-gray-300">от</p>
                <p className="text-2xl font-bold">{price}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#application"
                className="inline-flex items-center justify-center h-12 px-7 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors shadow-lg shadow-black/20 whitespace-nowrap"
              >
                Оставить заявку
              </a>
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Написать в Telegram
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-6">Преимущества</h2>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
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
        <section className="py-8 bg-gray-50 border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-3">
              {company.phones.map((p) => (
                <a
                  key={p.phone}
                  href={`tel:${p.phone}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#c41e3a] transition-colors group"
                >
                  <span className="w-10 h-10 rounded-lg bg-red-50 text-[#c41e3a] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-500">{p.label}</span>
                    <span className="block text-sm font-semibold text-[#1a1a2e] tabular-nums group-hover:text-[#c41e3a]">{formatPhone(p.phone)}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <ContactForm />

        {/* FAQ */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] mb-6">Вопросы и ответы</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group bg-gray-50 rounded-2xl border border-transparent open:border-gray-100 open:bg-white open:shadow-sm transition-colors">
                  <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 font-semibold text-[#1a1a2e] cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
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
