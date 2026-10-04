"use client";

import Link from "next/link";
import { Stamp, FileText, GraduationCap, Heart, Stethoscope, BookOpen, ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const iconList = [Stamp, FileText, GraduationCap, Heart, Stethoscope, BookOpen];

const slugs = [
  "/notarial-tarjima",
  "/apostil",
  "/diplom-tarjimasi",
  "/metrka-tarjimasi",
  "/tibbiy-hujjatlar-tarjimasi",
  "/notarial-tarjima",
];

export default function Services() {
  const { t } = useLocale();

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.services.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.services.title}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t.services.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {t.services.items.map((service, i) => {
            const Icon = iconList[i] ?? Stamp;
            return (
              <Link
                key={service.title}
                href={slugs[i] ?? "/notarial-tarjima"}
                className="group block p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex gap-4 sm:block h-full">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 sm:mb-4 flex-shrink-0 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-[#c41e3a] transition-colors">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#c41e3a] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0 sm:h-[calc(100%-4rem)]">
                    <h3 className="text-base sm:text-lg font-semibold text-[#1a1a2e] mb-1.5 sm:mb-2 group-hover:text-[#c41e3a] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3 sm:mb-5">{service.description}</p>
                    <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-[#c41e3a]">
                      {t.services.learnMore} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
