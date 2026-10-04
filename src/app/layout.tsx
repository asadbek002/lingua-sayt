import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleContext";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export const metadata: Metadata = {
  title: {
    default: "Lingua Translation — профессиональное бюро переводов",
    template: "%s | Lingua Translation",
  },
  description:
    "Нотариальные, медицинские и официальные переводы документов. Апостиль, перевод дипломов, свидетельств и справок. Офисы в Намангане и Ташкенте.",
  metadataBase: new URL(SITE_URL),
  keywords:
    "бюро переводов Наманган, нотариальный перевод, апостиль, перевод документов Ташкент, diplom tarjimasi",
  authors: [{ name: "Lingua Translation" }],
  openGraph: {
    title: "Lingua Translation — профессиональное бюро переводов",
    description:
      "Нотариальные, медицинские и официальные переводы документов. Апостиль, перевод дипломов, свидетельств и справок.",
    url: SITE_URL,
    siteName: "Lingua Translation",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lingua Translation — профессиональное бюро переводов",
    description: "Нотариальные, медицинские и официальные переводы документов.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
      <head>
        {GTM_ID && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <LocaleProvider>
          {children}
          <ChatWidget />
        </LocaleProvider>
      </body>
    </html>
  );
}
