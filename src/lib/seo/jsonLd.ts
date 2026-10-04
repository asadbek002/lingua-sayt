import { company } from "@/data/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    email: company.email,
    contactPoint: company.phones.map((p) => ({
      "@type": "ContactPoint",
      telephone: p.phone,
      contactType: "customer service",
      areaServed: "UZ",
      availableLanguage: ["Russian", "Uzbek", "Korean"],
    })),
    sameAs: [company.socialLinks.instagram, company.socialLinks.telegram],
  };
}

export function localBusinessSchema(office: { city: string; phone: string; mapUrl: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${company.legalName} — ${office.city}`,
    image: `${SITE_URL}/images/logo.png`,
    url: SITE_URL,
    telephone: office.phone,
    email: company.email,
    openingHours: "Mo-Sa 09:00-19:00",
    address: {
      "@type": "PostalAddress",
      addressLocality: office.city,
      addressCountry: "UZ",
    },
    geo: { "@type": "GeoCoordinates" },
    hasMap: office.mapUrl,
    priceRange: "$$",
    currenciesAccepted: "UZS",
    paymentAccepted: "Cash, Bank Transfer",
  };
}

export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: company.legalName,
      url: SITE_URL,
    },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    serviceType: "Translation Service",
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function articleSchema(post: {
  title: string;
  description?: string | null;
  slug: string;
  publishedAt?: Date | null;
  updatedAt: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: company.legalName },
    publisher: { "@type": "Organization", name: company.legalName, url: SITE_URL },
  };
}
