"use client";

import { Upload, DollarSign, FileCheck, Download } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const stepIcons = [Upload, DollarSign, FileCheck, Download];

export default function Process() {
  const { t } = useLocale();

  return (
    <section id="process" className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.process.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">{t.process.title}</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">{t.process.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.process.steps.map((step, idx) => {
            const Icon = stepIcons[idx] ?? Upload;
            return (
              <div key={idx} className="relative">
                {idx < t.process.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#c41e3a]/50 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#c41e3a] rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white/10 mb-2 leading-none">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#application"
            className="inline-flex items-center px-8 py-3.5 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors shadow-lg"
          >
            {t.process.startNow}
          </a>
        </div>
      </div>
    </section>
  );
}
