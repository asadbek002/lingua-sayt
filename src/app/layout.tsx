import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleContext";
import ChatWidget from "@/components/ChatWidget";
import ContactButtons from "@/components/ContactButtons";
import PageViewTracker from "@/components/PageViewTracker";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

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
        {YM_ID && /^\d+$/.test(YM_ID) && (
          <Script id="ym-init" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
          </Script>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {YM_ID && /^\d+$/.test(YM_ID) && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://mc.yandex.ru/watch/${YM_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          </noscript>
        )}
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
          <PageViewTracker />
          <ContactButtons />
          <ChatWidget />
        </LocaleProvider>
      </body>
    </html>
  );
}
