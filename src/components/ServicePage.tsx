import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { serviceSchema, faqSchema, breadcrumbSchema } from "@/lib/seo/jsonLd";

interface FAQ {
  question: string;
  answer: string;
}

interface ContentSection {
  heading: string;
  paragraphs: string[];
}

interface ServicePageProps {
  title: string;
  h1: string;
  description: string;
  benefits: string[];
  faqs: FAQ[];
  relatedServices: { label: string; href: string }[];
  serviceName: string;
  breadcrumbs: { name: string; url: string }[];
  contentSections?: ContentSection[];
}

export default function ServicePage({
  h1,
  description,
  benefits,
  faqs,
  relatedServices,
  serviceName,
  breadcrumbs,
  contentSections,
}: ServicePageProps) {
  const jsonLd = [
    serviceSchema(serviceName, description),
    faqSchema(faqs),
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
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

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{h1}</h1>
            <p className="text-gray-300 text-lg mb-6">{description}</p>
            <a
              href="#application"
              className="inline-flex items-center px-6 py-3 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors"
            >
              Оставить заявку
            </a>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Преимущества</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c41e3a] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        {contentSections && contentSections.length > 0 && (
          <section className="py-14 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              {contentSections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">{section.heading}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-3">{p}</p>
                  ))}
                </div>
              ))}
            </div>

          </section>
        )}
        <ContactForm />

        {/* FAQ */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group p-5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer"
                >
                  <summary className="font-semibold text-[#1a1a2e] list-none flex items-center justify-between">
                    {faq.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
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
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Другие услуги</h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
                >
                  {s.label}
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
