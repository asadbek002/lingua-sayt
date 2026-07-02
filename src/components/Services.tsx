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
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.services.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.services.title}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t.services.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.services.items.map((service, i) => {
            const Icon = iconList[i] ?? Stamp;
            return (
              <Link
                key={service.title}
                href={slugs[i] ?? "/notarial-tarjima"}
                className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-[#c41e3a] transition-colors">
                  <Icon className="w-6 h-6 text-[#c41e3a] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2 group-hover:text-[#c41e3a] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-[#c41e3a] opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.services.learnMore} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
