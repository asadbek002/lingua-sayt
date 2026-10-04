"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminHeaders } from "@/lib/adminAuth";

interface Post {
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  status: string;
  faq?: { question: string; answer: string }[] | null;
}

// Admin-only preview: shows drafts too (the public /blog/<slug> page only serves published posts)
export default function BlogPreviewPage() {
  const { password, ready } = useAdminAuth();
  const [post, setPost] = useState<Post | null>(null);
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
        if (res.ok) setPost(data.post);
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
        <Link href="/admin/blog" className="flex items-center gap-1 hover:underline">
          <ArrowLeft className="w-4 h-4" /> К списку
        </Link>
      </div>
      {error ? (
        <p className="p-8 text-center text-red-600">{error}</p>
      ) : post ? (
        <article className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">{post.title}</h1>
          {post.description && (
            <p className="text-lg text-gray-600 mb-8 pb-8 border-b border-gray-100">{post.description}</p>
          )}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
          {post.faq && post.faq.length > 0 && (
            <section className="mt-10 space-y-3">
              <h2 className="text-2xl font-bold text-[#1a1a2e]">Часто задаваемые вопросы</h2>
              {post.faq.map((f, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                  <p className="font-semibold text-[#1a1a2e]">{f.question}</p>
                  <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
                </div>
              ))}
            </section>
          )}
        </article>
      ) : null}
    </div>
  );
}
