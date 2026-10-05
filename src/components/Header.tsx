"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Send, ChevronDown, Check } from "lucide-react";
import { company } from "@/data/company";
import { useLocale } from "@/i18n/LocaleContext";
import { locales, localeLabels, localeLongLabels, type Locale } from "@/i18n/config";
import { isLocalizedPage, localizedPath, splitLocalePath } from "@/i18n/routes";

export function BrandLogo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className={`relative flex-shrink-0 ${compact ? "w-10 h-10" : "w-11 h-11"}`}>
        <Image src="/images/logo-mark.png" alt="" fill sizes="44px" className="object-contain" priority={!dark} />
      </span>
      <span className="leading-none">
        <span className={`block text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-[#1a1a2e]"}`}>
          LINGUA
        </span>
        <span className={`block mt-1 text-[11px] font-semibold tracking-[0.22em] uppercase ${dark ? "text-red-400" : "text-[#c41e3a]"}`}>
          Translation
        </span>
      </span>
    </span>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, locale, setLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const langRef = useRef<HTMLDivElement>(null);

  // Close the language menu on any click outside it or on Escape.
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  // Section anchors live on the home page; from any other page link back to them.
  const { path } = splitLocalePath(pathname);
  const home = localizedPath("/", locale);
  const anchor = (id: string) => (path === "/" ? `#${id}` : `${home}#${id}`);

  const navLinks = [
    { label: t.nav.services, href: anchor("services") },
    { label: t.nav.prices, href: anchor("prices") },
    { label: t.nav.languages, href: anchor("languages") },
    { label: t.nav.process, href: anchor("process") },
    { label: t.nav.benefits, href: anchor("benefits") },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contacts, href: anchor("contacts") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLocale = (l: Locale) => {
    setLocale(l);
    setLangOpen(false);
    // Home and service pages have a URL per language; everything else switches in place.
    if (isLocalizedPage(path) && l !== locale) router.push(localizedPath(path, l));
  };

  const LangSwitch = (
    <div className="relative" ref={langRef}>
      <button
        onClick={() => setLangOpen(!langOpen)}
        aria-haspopup="listbox"
        aria-expanded={langOpen}
        className="flex items-center gap-1 h-10 px-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        {localeLabels[locale]}
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${langOpen ? "rotate-180" : ""}`} />
      </button>
      {langOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg p-1 z-50 min-w-[160px]" role="listbox">
          {locales.map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={l === locale}
              onClick={() => handleLocale(l)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2.5 ${
                l === locale ? "text-[#c41e3a] font-semibold" : "text-gray-700"
              }`}
            >
              <span className="w-6 text-xs font-bold text-gray-500">{localeLabels[l]}</span>
              <span className="flex-1">{localeLongLabels[l]}</span>
              {l === locale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transition-shadow ${
        scrolled ? "border-gray-100 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16 lg:h-20">
          <Link href={home} className="flex-shrink-0" aria-label="Lingua Translation" onClick={() => setMenuOpen(false)}>
            <BrandLogo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-[15px] font-medium text-gray-600 hover:text-[#1a1a2e] hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {LangSwitch}
            <a
              href={company.socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
              className="hidden sm:flex w-10 h-10 items-center justify-center text-[#0088cc] border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-colors"
            >
              <Send className="w-[18px] h-[18px]" />
            </a>
            <a
              href={anchor("application")}
              className="hidden md:inline-flex items-center h-10 px-5 bg-[#c41e3a] text-white text-[15px] font-semibold rounded-lg hover:bg-[#a01830] transition-colors shadow-sm whitespace-nowrap"
            >
              {t.nav.apply}
            </a>
            <button
              className="xl:hidden flex w-10 h-10 items-center justify-center text-gray-700 rounded-lg hover:bg-gray-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <div className="xl:hidden absolute inset-x-0 top-full h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] bg-white border-t border-gray-100 overflow-y-auto overscroll-contain">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Mobile">
            {[{ label: t.nav.home, href: path === "/" ? "#hero" : home }, ...navLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center py-3.5 text-lg font-semibold text-[#1a1a2e] border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6 grid gap-3">
              <a
                href={anchor("application")}
                className="flex items-center justify-center h-12 bg-[#c41e3a] text-white text-base font-semibold rounded-xl"
                onClick={() => setMenuOpen(false)}
              >
                {t.nav.apply}
              </a>
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-12 text-[#0088cc] text-base font-semibold border-2 border-[#0088cc] rounded-xl"
              >
                <Send className="w-4 h-4" />
                {t.nav.telegram}
              </a>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
