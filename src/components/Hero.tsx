"use client";

import { Send, MapPin, FileText, Stamp, GraduationCap, Stethoscope, Zap } from "lucide-react";
import { company } from "@/data/company";
import { useLocale } from "@/i18n/LocaleContext";

const serviceIcons = [Stamp, FileText, GraduationCap, Stethoscope, Zap];

export default function Hero() {
  const { t } = useLocale();
  const highlights = t.hero.serviceHighlights;

  return (
    <section
      id="hero"
      className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-red-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight mb-6">
              {t.hero.title}
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="#application"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t.hero.primaryButton}
              </a>
              <a
                href={company.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0088cc] font-semibold rounded-xl border-2 border-[#0088cc] hover:bg-blue-50 transition-all"
              >
                <Send className="w-4 h-4" />
                {t.hero.telegramButton}
              </a>
              <a
                href="#contacts"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                <MapPin className="w-4 h-4" />
                {t.hero.officesButton}
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-[#c41e3a]">{t.hero.statLanguages}</p>
                <p className="text-sm text-gray-500">{t.hero.statLanguagesLabel}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#c41e3a]">{t.hero.statOffices}</p>
                <p className="text-sm text-gray-500">{t.hero.statOfficesLabel}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#c41e3a]">{t.hero.statOnline}</p>
                <p className="text-sm text-gray-500">{t.hero.statOnlineLabel}</p>
              </div>
            </div>
          </div>

          {/* Right: Service Cards */}
          <div className="lg:flex lg:justify-end">
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
                    <span className="font-medium">{office.city}</span>
                    <span className="text-gray-400 ml-auto text-xs">{office.phone}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#c41e3a]" />
                  <span className="font-medium">{t.hero.onlineLabel}</span>
                  <span className="text-gray-400 ml-auto text-xs">{t.hero.onlineSubLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
