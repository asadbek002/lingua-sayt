"use client";

import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { pickContent, type PublicPost } from "@/lib/blogLocale";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function BlogPostView({ post }: { post: PublicPost }) {
  const { t, locale } = useLocale();
  const c = pickContent(post, locale);
  useDocumentTitle(`${c.title} | Lingua Translation`);

  return (
    <article className="py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c41e3a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.blog.back}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">{c.title}</h1>

        {post.publishedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Calendar className="w-4 h-4" />
            {new Date(post.publishedAt).toLocaleDateString(t.blog.dateLocale, {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </div>
        )}

        {c.description && (
          <p className="text-lg text-gray-600 mb-8 pb-8 border-b border-gray-100">{c.description}</p>
        )}

        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</div>

        {c.faq && c.faq.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">{t.blog.faq}</h2>
            <div className="space-y-4">
              {c.faq.map((faq, idx) => (
                <details key={idx} className="p-5 bg-gray-50 rounded-2xl">
                  <summary className="font-semibold text-[#1a1a2e] cursor-pointer list-none">{faq.question}</summary>
                  <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
          <h3 className="font-bold text-[#1a1a2e] mb-2">{t.blog.ctaTitle}</h3>
          <p className="text-sm text-gray-600 mb-4">{t.blog.ctaText}</p>
          <Link
            href="/#application"
            className="inline-flex items-center px-5 py-2.5 bg-[#c41e3a] text-white font-semibold text-sm rounded-xl hover:bg-[#a01830] transition-colors"
          >
            {t.blog.ctaButton}
          </Link>
        </div>
      </div>
    </article>
  );
}
