"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminHeaders } from "@/lib/adminAuth";

interface Fields {
  title: string;
  description?: string | null;
  content: string;
  faq?: { question: string; answer: string }[] | null;
}

interface Post extends Fields {
  slug: string;
  status: string;
}

interface Translation extends Fields {
  locale: "uz" | "en";
}

const TABS = [
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
  { code: "en", label: "EN" },
] as const;

// Admin-only preview: shows drafts too (the public /blog/<slug> page only serves published posts)
export default function BlogPreviewPage() {
  const { password, ready } = useAdminAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [lang, setLang] = useState<"ru" | "uz" | "en">("ru");
  const [loadError, setError] = useState("");
  const [id] = useState(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("id")
  );
  const error = id ? loadError : "Не указан id статьи";

  useEffect(() => {
    if (!ready || !id) return;
    let cancelled = false;
    fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`, { headers: adminHeaders(password) })
      .then(async (res) => ({ res, data: await res.json().catch(() => ({})) }))
      .then(({ res, data }) => {
        if (cancelled) return;
        if (res.ok) {
          setPost(data.post);
          setTranslations(data.translations ?? []);
        }
        else setError(data.error || "Не удалось загрузить статью");
      })
      .catch(() => !cancelled && setError("Ошибка соединения"));
    return () => {
      cancelled = true;
    };
  }, [ready, password, id]);

  if (!ready || (!post && !error)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c41e3a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 flex items-center justify-between">
        <span>
          Предпросмотр{post?.status === "published" ? "" : " — черновик, на сайте не виден"}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {TABS.map((t) => {
              const has = t.code === "ru" || translations.some((x) => x.locale === t.code);
              return (
                <button
                  key={t.code}
                  onClick={() => setLang(t.code)}
                  title={has ? undefined : "Перевода нет — на сайте будет показан русский текст"}
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    lang === t.code ? "bg-yellow-800 text-white" : has ? "bg-yellow-200" : "bg-yellow-100 text-yellow-500"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <Link href="/admin/blog" className="flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-4 h-4" /> К списку
          </Link>
        </div>
      </div>
      {error ? (
        <p className="p-8 text-center text-red-600">{error}</p>
      ) : post ? (
        <ArticleBody post={post} view={lang === "ru" ? post : (translations.find((x) => x.locale === lang) ?? post)} />
      ) : null}
    </div>
  );
}

function ArticleBody({ view }: { post: Post; view: Fields }) {
  return (
        <article className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">{view.title}</h1>
          {view.description && (
            <p className="text-lg text-gray-600 mb-8 pb-8 border-b border-gray-100">{view.description}</p>
          )}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{view.content}</div>
          {view.faq && view.faq.length > 0 && (
            <section className="mt-10 space-y-3">
              <h2 className="text-2xl font-bold text-[#1a1a2e]">Часто задаваемые вопросы</h2>
              {view.faq.map((f, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                  <p className="font-semibold text-[#1a1a2e]">{f.question}</p>
                  <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
                </div>
              ))}
            </section>
          )}
        </article>
  );
}
