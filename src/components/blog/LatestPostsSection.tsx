"use client";

import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { pickContent, type PublicPost } from "@/lib/blogLocale";

export default function LatestPostsSection({ posts }: { posts: PublicPost[] }) {
  const { t, locale } = useLocale();

  return (
    <section id="blog" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">{t.blog.latestBadge}</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{t.blog.latestTitle}</h2>
        </div>

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
                <h3 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#c41e3a] transition-colors">{c.title}</h3>
                {c.description && <p className="text-sm text-gray-500 mb-3 line-clamp-3">{c.description}</p>}
                {post.publishedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString(t.blog.dateLocale, { timeZone: "UTC" })}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex px-6 py-3 text-sm font-semibold text-[#c41e3a] border border-[#c41e3a] rounded-xl hover:bg-red-50 transition-colors"
          >
            {t.blog.allPosts}
          </Link>
        </div>
      </div>
    </section>
  );
}
