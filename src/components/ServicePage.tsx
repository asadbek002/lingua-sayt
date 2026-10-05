import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/routes";
import { getServiceDef, serviceLabel } from "@/data/servicePages";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo/jsonLd";
import { notFound } from "next/navigation";

const UI = {
  ru: { home: "Главная", cta: "Оставить заявку", benefits: "Преимущества", faq: "Часто задаваемые вопросы", other: "Другие услуги" },
  uz: { home: "Bosh sahifa", cta: "Ariza qoldirish", benefits: "Afzalliklar", faq: "Ko'p so'raladigan savollar", other: "Boshqa xizmatlar" },
  en: { home: "Home", cta: "Send a request", benefits: "Benefits", faq: "Frequently asked questions", other: "Other services" },
} as const;

export default function ServicePage({ slug, lang }: { slug: string; lang: Locale }) {
  const def = getServiceDef(slug);
  if (!def) notFound();
  const copy = def.copy[lang];
  const ui = UI[lang];

  const breadcrumbs = [
    { name: ui.home, url: localizedPath("/", lang) },
    { name: copy.label, url: localizedPath(`/${slug}`, lang) },
  ];
  const jsonLd = [
    serviceSchema(copy.serviceName, copy.intro, lang),
    faqSchema(copy.faqs),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.url} className="flex items-center gap-1">
                  {idx > 0 && <ChevronRight className="w-3 h-3" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-gray-300">{crumb.name}</span>
                  ) : (
                    <a href={crumb.url} className="hover:text-white transition-colors">
                      {crumb.name}
                    </a>
                  )}
                </span>
              ))}
            </nav>

            <h1 className="text-[32px] sm:text-5xl font-bold tracking-tight leading-[1.15] text-white mb-4 text-balance">{copy.h1}</h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">{copy.intro}</p>
            <a
              href="#application"
              className="inline-flex items-center justify-center h-12 px-7 bg-[#c41e3a] shadow-lg shadow-black/20 whitespace-nowrap text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors"
            >
              {ui.cta}
            </a>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">{ui.benefits}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {copy.benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c41e3a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {copy.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <ContactForm />

        {/* FAQ */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">{ui.faq}</h2>
            <div className="space-y-4">
              {copy.faqs.map((faq) => (
                <details key={faq.question} className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer">
                  <summary className="font-semibold text-[#1a1a2e] list-none flex items-center justify-between">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">{ui.other}</h2>
            <div className="flex flex-wrap gap-3">
              {def.related.map((rel) => (
                <a
                  key={rel}
                  href={localizedPath(`/${rel}`, lang)}
                  className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                >
                  {serviceLabel(rel, lang)}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
