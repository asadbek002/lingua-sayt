"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Edit, Eye, LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
}

const SUGGESTED_TOPICS = [
  "Как сделать нотариальный перевод в Узбекистане",
  "Что такое апостиль и для чего он нужен",
  "Какие документы нужны для учёбы за границей",
  "Как перевести диплом для подачи в университет",
  "Перевод свидетельства о рождении",
  "Перевод медицинских документов",
  "Чем отличается обычный перевод от нотариального",
  "Сколько времени занимает апостиль",
  "Где сделать перевод документов в Намангане",
  "Где сделать перевод документов в Ташкенте",
];

export default function AdminBlogPage() {
  const { password, ready, logout } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", content: "", status: "draft" });
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/admin/blog", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
  }, [password]);

  useEffect(() => {
    if (ready) fetchPosts();
  }, [ready, fetchPosts]);

  const handleGenerate = async (title: string) => {
    setGenerating(true);
    setForm((f) => ({ ...f, title }));
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action: "generate-faq", topic: title }),
      });
      const data = await res.json();
      if (data.content) {
        setForm((f) => ({ ...f, content: data.content, slug: title.toLowerCase().replace(/[^a-z0-9а-яё\s]/gi, "").replace(/\s+/g, "-").slice(0, 60) }));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", slug: "", description: "", content: "", status: "draft" });
        await fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ id, status: newStatus }),
    });
    await fetchPosts();
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c41e3a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1a2e]">Блог</h1>
          <p className="text-xs text-gray-400">Управление статьями</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/applications" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">Заявки</a>
          <a href="/admin/seo" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">SEO</a>
          <a href="/admin/google-business" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">Google Business</a>
          <button
            onClick={logout}
            title="Выйти"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#c41e3a] text-white text-sm font-semibold rounded-lg hover:bg-[#a01830]"
          >
            <Plus className="w-4 h-4" />
            Новая статья
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Suggested Topics */}
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">Предлагаемые темы</h2>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => { setShowForm(true); handleGenerate(topic); }}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">Статьи ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Статей пока нет</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{post.title}</p>
                    <p className="text-xs text-gray-400">/{post.slug} · {new Date(post.createdAt).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {post.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-200 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </a>
                    <button onClick={() => handlePublish(post.id, post.status)} className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a]">
                      {post.status === "published" ? "Снять" : "Опубликовать"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Article Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-[#1a1a2e] mb-5">Новая статья</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Заголовок</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Описание</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Контент</label>
                  {generating && <Loader2 className="w-4 h-4 animate-spin text-[#c41e3a]" />}
                </div>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a] resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Статус</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовать</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.slug || !form.content}
                className="flex-1 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Сохранить
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
