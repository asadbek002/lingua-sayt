import { company } from "@/data/company";
import { serviceDefs } from "@/data/servicePages";
import { localizedPath, SITE_URL } from "@/i18n/routes";

// Plain-text summary of the business for AI assistants (llmstxt.org). Built from the same data as the site,
// so phones, addresses and pages cannot drift apart from what visitors see.
export const revalidate = 86400;

export function GET() {
  const offices = company.offices
    .map(
      (o) =>
        `- ${o.cityI18n.en} (${o.cityI18n.uz}, ${o.cityI18n.ru}): ${o.street}. Phone: ${o.phone}. Open ${company.workingHours}, Monday to Saturday.`
    )
    .join("\n");

  const services = serviceDefs
    .map((s) => `- [${s.copy.en.label}](${SITE_URL}${localizedPath(`/${s.slug}`, "en")}): ${s.copy.en.metaDescription}`)
    .join("\n");

  const text = `# Lingua Translation

> Translation agency in Uzbekistan with offices in Namangan and Tashkent: notarized translation, apostille, translation of diplomas, certificates, passports and medical documents. Works in Russian, Uzbek, English, Korean, German and Chinese. Documents can be submitted online.

The website is available in three languages: Russian (${SITE_URL}/), Uzbek (${SITE_URL}/uz) and English (${SITE_URL}/en). Each page has the same content in all three languages.

## Offices
${offices}

## Contact
- Email: ${company.email}
- Telegram: ${company.socialLinks.telegram}
- Instagram: ${company.socialLinks.instagram}

## Services
${services}

## Other
- [Blog](${SITE_URL}/blog): articles about document translation, notarization and apostille in Uzbekistan
- [Privacy policy](${SITE_URL}/privacy)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
