import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { BookOpen, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Блог — Lingua Translation | Советы по переводу документов",
  description:
    "Полезные статьи о нотариальном переводе, апостиле, переводе дипломов и свидетельств в Узбекистане.",
};

export const revalidate = 3600;

async function getPublishedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, description: true, publishedAt: true },
    });
  } catch {
    return [];
  }
}

const STATIC_ARTICLES = [
  { title: "Как сделать нотариальный перевод в Узбекистане", slug: "kak-sdelat-notarialny-perevod", description: "Полное руководство по нотариальному переводу документов в Узбекистане." },
  { title: "Что такое апостиль и для чего он нужен", slug: "chto-takoe-apostil", description: "Объясняем, что такое апостиль, когда он нужен и как его получить." },
  { title: "Какие документы нужны для учёбы за границей", slug: "dokumenty-dlya-uchiby-za-granicej", description: "Список документов и переводов для поступления в зарубежный вуз." },
];

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="py-14 bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[#c41e3a] text-sm font-semibold uppercase tracking-wider">Блог</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
              Полезные статьи о переводе
            </h1>
            <p className="mt-4 text-gray-400">
              Советы, инструкции и ответы на частые вопросы о переводе документов
            </p>
          </div>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.length > 0
                ? posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${encodeURIComponent(post.slug)}`}
                      className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all"
                    >
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c41e3a] transition-colors">
                        <BookOpen className="w-5 h-5 text-[#c41e3a] group-hover:text-white" />
                      </div>
                      <h2 className="font-bold text-[#1a1a2e] mb-2 group-hover:text-[#c41e3a] transition-colors">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-sm text-gray-500 mb-3">{post.description}</p>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.publishedAt).toLocaleDateString("ru-RU")}
                        </div>
                      )}
                    </Link>
                  ))
                : STATIC_ARTICLES.map((article) => (
                    <div
                      key={article.slug}
                      className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                        <BookOpen className="w-5 h-5 text-[#c41e3a]" />
                      </div>
                      <h2 className="font-bold text-[#1a1a2e] mb-2">{article.title}</h2>
                      <p className="text-sm text-gray-500">{article.description}</p>
                      <p className="mt-3 text-xs text-gray-400 italic">Скоро...</p>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
