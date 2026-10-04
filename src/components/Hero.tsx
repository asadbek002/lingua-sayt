"use client";

import { Send, MapPin, FileText, Stamp, GraduationCap, Stethoscope, Zap, ArrowRight } from "lucide-react";
import { formatPhone } from "@/lib/utils/formatPhone";
import { company } from "@/data/company";
import { useLocale } from "@/i18n/LocaleContext";

const serviceIcons = [Stamp, FileText, GraduationCap, Stethoscope, Zap];

export default function Hero() {
  const { t, locale } = useLocale();
  const highlights = t.hero.serviceHighlights;

  return (
    <section
      id="hero"
      className="pt-16 lg:pt-20 lg:min-h-[calc(100vh-1px)] flex items-center bg-gradient-to-br from-slate-50 via-white to-red-50"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-12 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="text-[32px] sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-[1.15] tracking-tight mb-5 sm:mb-6 text-balance">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-10">
              <a
                href="#application"
                className="group inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-all shadow-lg shadow-[#c41e3a]/20 hover:shadow-xl hover:shadow-[#c41e3a]/25 whitespace-nowrap"
              >
                {t.hero.primaryButton}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-white text-[#0088cc] font-semibold rounded-xl border-2 border-[#0088cc] hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                {t.hero.telegramButton}
              </a>
              <a
                href="#contacts"
                className="inline-flex items-center justify-center gap-2 h-12 px-3 text-gray-700 font-semibold rounded-xl hover:text-[#c41e3a] transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                {t.hero.officesButton}
              </a>
            </div>

            {/* Stats */}
            <dl className="grid grid-cols-3 max-w-md divide-x divide-gray-200 border-y border-gray-200 py-4">
              {[
                [t.hero.statLanguages, t.hero.statLanguagesLabel],
                [t.hero.statOffices, t.hero.statOfficesLabel],
                [t.hero.statOnline, t.hero.statOnlineLabel],
              ].map(([value, label], i) => (
                <div key={label} className={i === 0 ? "pr-4" : "px-4"}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-xl sm:text-2xl font-bold text-[#c41e3a] leading-tight">{value}</dd>
                  <dd className="mt-0.5 text-xs sm:text-sm text-gray-500 leading-snug">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: Service Cards */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-sm w-full mx-auto lg:mx-0">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {t.hero.servicesCardTitle}
              </h3>
              <div className="space-y-3">
                {highlights.map((label, i) => {
                  const Icon = serviceIcons[i] ?? Stamp;
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-[#c41e3a] transition-colors">
                        <Icon className="w-4 h-4 text-[#c41e3a] group-hover:text-white" />
                      </div>
                      <span className="font-medium text-gray-800">{label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">{t.hero.officesLabel}</p>
                {company.offices.map((office) => (
                  <div key={office.city} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#c41e3a]" />
                    <span className="font-medium">{office.cityI18n[locale] ?? office.city}</span>
                    <span className="text-gray-500 ml-auto text-xs tabular-nums">{formatPhone(office.phone)}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#c41e3a]" />
                  <span className="font-medium">{t.hero.onlineLabel}</span>
                  <span className="text-gray-500 ml-auto text-xs">{t.hero.onlineSubLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
