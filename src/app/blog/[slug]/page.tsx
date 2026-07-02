import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug, status: "published" },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Статья не найдена" };
  }

  return {
    title: `${post.title} | Lingua Translation`,
    description: post.description || "",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const faqs = post.faq as { question: string; answer: string }[] | null;

  return (
    <>
      <Header />
      <main className="pt-16">
        <article className="py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c41e3a] mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к блогу
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-4">{post.title}</h1>

            {post.publishedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}

            {post.description && (
              <p className="text-lg text-gray-600 mb-8 pb-8 border-b border-gray-100">
                {post.description}
              </p>
            )}

            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {faqs && faqs.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Часто задаваемые вопросы</h2>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="p-5 bg-gray-50 rounded-2xl">
                      <summary className="font-semibold text-[#1a1a2e] cursor-pointer list-none">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 p-6 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="font-bold text-[#1a1a2e] mb-2">Нужна помощь с переводом?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Оставьте заявку — мы свяжемся с вами в течение нескольких минут.
              </p>
              <a
                href="/#application"
                className="inline-flex items-center px-5 py-2.5 bg-[#c41e3a] text-white font-semibold text-sm rounded-xl hover:bg-[#a01830] transition-colors"
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
