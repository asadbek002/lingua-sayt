"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Send, ChevronDown } from "lucide-react";
import { company } from "@/data/company";
import { useLocale } from "@/i18n/LocaleContext";
import { locales, localeLabels, localeLongLabels, type Locale } from "@/i18n/config";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, locale, setLocale } = useLocale();

  const navLinks = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.prices, href: "#prices" },
    { label: t.nav.languages, href: "#languages" },
    { label: t.nav.process, href: "#process" },
    { label: t.nav.benefits, href: "#benefits" },
    { label: t.nav.contacts, href: "#contacts" },
  ];

  const handleLocale = (l: Locale) => {
    setLocale(l);
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 flex-shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <Image
                src="/images/logo.png"
                alt="Lingua Translation Logo"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 56px, 64px"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-[#1a1a2e] leading-none block tracking-tight">
                LINGUA
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#c41e3a] tracking-widest uppercase">
                TRANSLATION
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-gray-600 hover:text-[#c41e3a] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#c41e3a] border border-gray-200 rounded-lg hover:border-[#c41e3a] transition-colors"
              >
                {localeLabels[locale]}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 min-w-[140px]">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLocale(l)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        l === locale ? "text-[#c41e3a] font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{localeLabels[l]}</span>
                      <span>{localeLongLabels[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href={company.socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-[15px] text-[#0088cc] hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <Send className="w-4 h-4" />
              {t.nav.telegram}
            </a>
            <a
              href="#application"
              className="px-5 py-2.5 bg-[#c41e3a] text-white text-[15px] font-semibold rounded-lg hover:bg-[#a01830] transition-colors shadow-sm"
            >
              {t.nav.apply}
            </a>
          </div>

          {/* Mobile: Language + Burger */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg"
              >
                {localeLabels[locale]}
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 min-w-[130px]">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLocale(l)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        l === locale ? "text-[#c41e3a] font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{localeLabels[l]}</span>
                      <span>{localeLongLabels[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="p-2 text-gray-600 hover:text-[#c41e3a]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2.5 text-base font-medium text-gray-700 hover:text-[#c41e3a] border-b border-gray-50 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a
              href={company.socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 text-base text-[#0088cc] font-medium"
            >
              <Send className="w-4 h-4" />
              {t.nav.telegram}
            </a>
            <a
              href="#application"
              className="block text-center px-4 py-3 bg-[#c41e3a] text-white text-base font-semibold rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.apply}
            </a>
          </div>
        </div>
      )}

      {/* Close lang dropdown on outside click */}
      {langOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLangOpen(false)}
        />
      )}
    </header>
  );
}
