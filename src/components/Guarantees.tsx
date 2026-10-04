"use client";

import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { company } from "@/data/company";

const TEXT = {
  ru: [
    { title: "Бесплатная правка", text: "Если вы нашли ошибку в переводе, мы исправим её бесплатно." },
    { title: "Ответ за 15 минут", text: `Отвечаем на заявки и сообщения в течение 15 минут в рабочее время (${company.workingHours}).` },
    { title: "Конфиденциальность", text: "Ваши документы не передаются третьим лицам." },
  ],
  uz: [
    { title: "Bepul tuzatish", text: "Tarjimada xato topsangiz, uni bepul tuzatamiz." },
    { title: "15 daqiqada javob", text: `Ish vaqtida (${company.workingHours}) ariza va xabarlarga 15 daqiqa ichida javob beramiz.` },
    { title: "Maxfiylik", text: "Hujjatlaringiz uchinchi shaxslarga berilmaydi." },
  ],
  en: [
    { title: "Free corrections", text: "If you find a mistake in the translation, we will fix it for free." },
    { title: "Reply within 15 minutes", text: `We answer requests and messages within 15 minutes during working hours (${company.workingHours}).` },
    { title: "Confidentiality", text: "Your documents are never shared with third parties." },
  ],
} as const;

const ICONS = [BadgeCheck, Clock, ShieldCheck];

export default function Guarantees() {
  const { locale } = useLocale();
  const items = TEXT[locale] ?? TEXT.ru;

  return (
    <section id="guarantees" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={item.title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#c41e3a]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1a2e]">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
