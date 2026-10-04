"use client";

import { Star } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import type { PublicReviews } from "@/lib/services/publicReviewsService";

const TEXT = {
  ru: {
    badge: "Отзывы клиентов",
    title: "Нам доверяют",
    from: "по отзывам в Google",
    reviews: "отзывов",
    anonymous: "Клиент Google",
    office: { namangan: "Наманган", tashkent: "Ташкент" },
    leave: "Оставить отзыв",
    source: "Отзывы с Google Maps",
  },
  uz: {
    badge: "Mijozlar fikrlari",
    title: "Bizga ishonishadi",
    from: "Google sharhlari bo'yicha",
    reviews: "sharh",
    anonymous: "Google foydalanuvchisi",
    office: { namangan: "Namangan", tashkent: "Toshkent" },
    leave: "Sharh qoldirish",
    source: "Google Maps sharhlari",
  },
  en: {
    badge: "Client reviews",
    title: "Trusted by our clients",
    from: "based on Google reviews",
    reviews: "reviews",
    anonymous: "Google user",
    office: { namangan: "Namangan", tashkent: "Tashkent" },
    leave: "Leave a review",
    source: "Reviews from Google Maps",
  },
} as const;

const DATE_LOCALE = { ru: "ru-RU", uz: "uz-UZ", en: "en-GB" } as const;

const REVIEW_LINKS = {
  namangan: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL_NAMANGAN,
  tashkent: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL_TASHKENT,
} as const;

function Stars({ value }: { value: number }) {
  return (
    <div className="flex" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function ReviewsSection({ data }: { data: PublicReviews }) {
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.ru;
  const links = (["namangan", "tashkent"] as const).filter((o) => REVIEW_LINKS[o]);

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">{t.badge}</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.title}</h2>
          {data.averageRating && (
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-4xl font-black text-[#1a1a2e]">{data.averageRating.toFixed(1)}</span>
              <Stars value={data.averageRating} />
              <span className="text-sm text-gray-500">
                {t.from}
                {data.totalCount > 0 && ` · ${data.totalCount} ${t.reviews}`}
              </span>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.reviews.map((r) => (
            <figure key={r.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col">
              <Stars value={r.rating} />
              <blockquote className="mt-3 text-sm text-gray-700 leading-relaxed flex-1 whitespace-pre-line">
                {r.text}
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-gray-200 text-sm">
                <span className="font-semibold text-[#1a1a2e]">{r.author || t.anonymous}</span>
                <span className="block text-xs text-gray-400">
                  {t.office[r.office]} ·{" "}
                  {new Date(r.date).toLocaleDateString(DATE_LOCALE[locale] ?? "ru-RU", {
                    year: "numeric",
                    month: "long",
                    timeZone: "UTC",
                  })}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {links.map((o) => (
            <a
              key={o}
              href={REVIEW_LINKS[o]}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm font-semibold text-[#c41e3a] border border-[#c41e3a] rounded-xl hover:bg-red-50 transition-colors"
            >
              {t.leave} · {t.office[o]}
            </a>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">{t.source}</p>
      </div>
    </section>
  );
}
