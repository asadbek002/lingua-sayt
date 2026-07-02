"use client";

import { useState } from "react";
import { priceList } from "@/data/priceList";
import { Clock, AlertCircle } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import type { Locale } from "@/i18n/config";

type Tab = "regular" | "partner";

export default function PriceList() {
  const [activeTab, setActiveTab] = useState<Tab>("regular");
  const { t, locale } = useLocale();
  const l = locale as Locale;

  const categories = [...new Map(priceList.map((item) => [item.category[l], item.category[l]])).keys()];

  return (
    <section id="prices" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">
            {t.prices.badge}
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.prices.title}</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">{t.prices.subtitle}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("regular")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "regular"
                  ? "bg-[#c41e3a] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.prices.regularClients}
            </button>
            <button
              onClick={() => setActiveTab("partner")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "partner"
                  ? "bg-[#c41e3a] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.prices.partners}
            </button>
          </div>
        </div>

        {/* Price Cards by Category */}
        {categories.map((catLabel) => {
          const items = priceList.filter((item) => item.category[l] === catLabel);
          return (
            <div key={catLabel} className="mb-8">
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c41e3a]" />
                {catLabel}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div
                    key={item.title[l]}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-[#1a1a2e] mb-3 text-sm leading-snug">
                      {item.title[l]}
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{t.prices.price}</span>
                        <span className="text-base font-bold text-[#c41e3a]">
                          {activeTab === "regular" ? item.regularPrice : item.partnerPrice}
                        </span>
                      </div>

                      {activeTab === "partner" && item.partnerSecondCopyPrice && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{t.prices.secondCopy}</span>
                          <span className="text-xs font-medium text-gray-600">
                            {item.partnerSecondCopyPrice}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 border-t border-gray-50">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{item.duration[l]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Disclaimer */}
        <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{t.prices.note}</p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">{t.prices.exactPrice}</p>
          <a
            href="#application"
            className="inline-flex items-center px-8 py-3 bg-[#c41e3a] text-white font-semibold rounded-xl hover:bg-[#a01830] transition-colors shadow-md"
          >
            {t.prices.askPriceBtn}
          </a>
        </div>
      </div>
    </section>
  );
}
