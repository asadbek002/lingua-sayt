"use client";

import { useLocale } from "@/i18n/LocaleContext";

export default function Languages() {
  const { t } = useLocale();

  return (
    <section id="languages" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.languages.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.languages.title}</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{t.languages.subtitle}</p>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {t.languages.items.map((lang) => (
            <div
              key={lang.code}
              className="flex flex-col items-center px-2 py-4 sm:p-5 bg-gray-50 rounded-2xl hover:bg-red-50 hover:shadow-md transition-all group cursor-default"
            >
              <span className="text-3xl sm:text-4xl mb-2 sm:mb-3" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#c41e3a] transition-colors text-center">
                {lang.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
