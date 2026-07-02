"use client";

import { CheckCircle2, Users, Globe, Zap, Computer, Phone } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const benefitIcons = [CheckCircle2, Users, Zap, Globe, Computer, Phone];

export default function Benefits() {
  const { t } = useLocale();

  return (
    <>
      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
                {t.benefits.badge}
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-8">
                {t.benefits.title}
              </h2>
              <div className="space-y-4">
                {t.benefits.items.map((text, i) => {
                  const Icon = benefitIcons[i] ?? CheckCircle2;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#c41e3a]" />
                      </div>
                      <p className="text-gray-700 font-medium">{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 border border-red-100">
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-6">{t.benefits.officeTitle}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold text-gray-800">{t.benefits.nameNamangan}</p>
                    <p className="text-sm text-gray-500">{t.benefits.subNamangan}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold text-gray-800">{t.benefits.nameTashkent}</p>
                    <p className="text-sm text-gray-500">{t.benefits.subTashkent}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                  <span className="text-2xl">💻</span>
                  <div>
                    <p className="font-semibold text-gray-800">{t.benefits.nameOnline}</p>
                    <p className="text-sm text-gray-500">{t.benefits.subOnline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
              {t.benefits.audienceBadge}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">
              {t.benefits.audienceTitle}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.benefits.audience.map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-red-100 transition-all"
              >
                <span className="text-3xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
