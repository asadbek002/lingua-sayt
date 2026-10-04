"use client";

import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { pickContent, type PublicPost } from "@/lib/blogLocale";

// Blog list in the visitor's language (falls back to Russian for posts that are not translated yet).
export default function BlogIndex({ posts }: { posts: PublicPost[] }) {
  const { t, locale } = useLocale();

  return (
    <>
      <section className="py-14 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">{t.blog.badge}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">{t.blog.title}</h1>
          <p className="mt-4 text-gray-400">{t.blog.subtitle}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400 py-10">{t.blog.empty}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const c = pickContent(post, locale);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${encodeURIComponent(post.slug)}`}
                    className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all"
                  >
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c41e3a] transition-colors">
                      <BookOpen className="w-5 h-5 text-[#c41e3a] group-hover:text-white" />
                    </div>
                    <h2 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#c41e3a] transition-colors">{c.title}</h2>
                    {c.description && <p className="text-sm text-gray-500 mb-3">{c.description}</p>}
                    {post.publishedAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString(t.blog.dateLocale, { timeZone: "UTC" })}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
