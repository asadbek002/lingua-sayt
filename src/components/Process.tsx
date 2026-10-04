"use client";

import { Upload, DollarSign, FileCheck, Download } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const stepIcons = [Upload, DollarSign, FileCheck, Download];

export default function Process() {
  const { t } = useLocale();

  return (
    <section id="process" className="py-16 sm:py-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">
            {t.process.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">{t.process.title}</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">{t.process.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {t.process.steps.map((step, idx) => {
            const Icon = stepIcons[idx] ?? Upload;
            return (
              <div key={idx} className="relative">
                {idx < t.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#c41e3a]/50 to-transparent z-0" />
                )}
                <div className="relative z-10 h-full flex gap-4 sm:block sm:text-center p-5 sm:p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 sm:mx-auto sm:mb-5 flex-shrink-0 bg-[#c41e3a] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 rounded-full bg-white text-[#1a1a2e] text-xs font-bold flex items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="#application"
            className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-8 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors shadow-lg"
          >
            {t.process.startNow}
          </a>
        </div>
      </div>
    </section>
  );
}
