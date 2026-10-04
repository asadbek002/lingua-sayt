"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Eye, Trash2, Pencil, Languages, Sparkles } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminHeaders } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import { slugify } from "@/lib/utils/slug";

type Lang = "ru" | "uz" | "en";
const LANGS: { code: Lang; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O'zbekcha" },
  { code: "en", label: "English" },
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  locales?: string[];
}

interface LangFields {
  title: string;
  description: string;
  content: string;
}

const EMPTY: LangFields = { title: "", description: "", content: "" };
const emptyLangs = (): Record<Lang, LangFields> => ({ ru: { ...EMPTY }, uz: { ...EMPTY }, en: { ...EMPTY } });

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

const AI_OFF = "AI не настроен: задайте AI_API_KEY в .env сервера";

export default function AdminBlogPage() {
  const { password, ready, logout } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [listError, setListError] = useState("");

  // editor state (one modal for creating and editing)
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [langs, setLangs] = useState<Record<Lang, LangFields>>(emptyLangs());
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("draft");
  const [activeLang, setActiveLang] = useState<Lang>("ru");
  const [busy, setBusy] = useState<string | null>(null); // which AI action is running
  const [saving, setSaving] = useState(false);
  const [editorError, setEditorError] = useState("");

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/admin/blog", { headers: adminHeaders(password) });
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
      setListError("");
    }
  }, [password]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetch("/api/admin/blog", { headers: adminHeaders(password) })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !cancelled) setPosts(data.posts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ready, password]);

  const setField = (lang: Lang, field: keyof LangFields, value: string) =>
    setLangs((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));

  const openNew = (title = "") => {
    const fresh = emptyLangs();
    fresh.ru.title = title;
    setLangs(fresh);
    setSlug(slugify(title));
    setStatus("draft");
    setEditingId(null);
    setActiveLang("ru");
    setEditorError("");
    setEditorOpen(true);
  };

  const openEdit = async (id: string) => {
    setListError("");
    const res = await fetch(`/api/admin/blog?id=${id}`, { headers: adminHeaders(password) });
    if (!res.ok) {
      setListError("Не удалось загрузить статью");
      return;
    }
    const data = await res.json();
    const next = emptyLangs();
    next.ru = { title: data.post.title, description: data.post.description ?? "", content: data.post.content };
    for (const t of data.translations as { locale: Lang; title: string; description: string | null; content: string }[]) {
      if (t.locale === "uz" || t.locale === "en") {
        next[t.locale] = { title: t.title, description: t.description ?? "", content: t.content };
      }
    }
    setLangs(next);
    setSlug(data.post.slug);
    setStatus(data.post.status);
    setEditingId(id);
    setActiveLang("ru");
    setEditorError("");
    setEditorOpen(true);
  };

  const callAi = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: adminHeaders(password, true),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Ошибка сервера (${res.status})`);
    if (data.error) throw new Error(String(data.error).startsWith("AI не настроен") ? AI_OFF : data.error);
    return data;
  };

  /** AI: write the article text in the active language from its title. */
  const generateText = async (lang: Lang) => {
    const title = langs[lang].title.trim() || langs.ru.title.trim();
    if (!title) return setEditorError("Сначала введите заголовок");
    setBusy(`gen-${lang}`);
    setEditorError("");
    try {
      const data = await callAi({ action: "generate-blog-draft", topic: title, lang });
      if (data.content) {
        setField(lang, "content", data.content);
        if (!langs[lang].title.trim()) setField(lang, "title", title);
      }
    } catch (e) {
      setEditorError(e instanceof Error ? e.message : "Ошибка ИИ");
    } finally {
      setBusy(null);
    }
  };

  /** AI: translate the Russian version into one language; returns false on failure. */
  const translateTo = async (lang: "uz" | "en"): Promise<boolean> => {
    const src = langs.ru;
    if (!src.title.trim() || !src.content.trim()) {
      setEditorError("Сначала заполните русский заголовок и текст");
      return false;
    }
    setBusy(`tr-${lang}`);
    setEditorError("");
    try {
      const data = await callAi({
        action: "translate-blog",
        lang,
        title: src.title,
        description: src.description,
        content: src.content,
      });
      const t = data.translation as LangFields | undefined;
      if (!t) throw new Error("ИИ не вернул перевод");
      setLangs((prev) => ({ ...prev, [lang]: { title: t.title, description: t.description ?? "", content: t.content } }));
      return true;
    } catch (e) {
      setEditorError(`${lang.toUpperCase()}: ${e instanceof Error ? e.message : "Ошибка перевода"}`);
      return false;
    } finally {
      setBusy(null);
    }
  };

  const translateAll = async () => {
    if (await translateTo("uz")) await translateTo("en");
  };

  const handleSave = async () => {
    setSaving(true);
    setEditorError("");
    try {
      const body = {
        ...(editingId ? { id: editingId } : {}),
        title: langs.ru.title,
        slug,
        description: langs.ru.description,
        content: langs.ru.content,
        status,
        translations: { uz: langs.uz, en: langs.en },
      };
      const res = await fetch("/api/admin/blog", {
        method: editingId ? "PATCH" : "POST",
        headers: adminHeaders(password, true),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setEditorError(d.error || "Не удалось сохранить статью");
        return;
      }
      setEditorOpen(false);
      await fetchPosts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить статью «${title}» со всеми переводами?`)) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE", headers: adminHeaders(password) });
    await fetchPosts();
  };

  const handlePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: adminHeaders(password, true),
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

  const current = langs[activeLang];
  const filled = (l: Lang) => !!(langs[l].title.trim() && langs[l].content.trim());
  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a]";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav title="Блог" subtitle="Управление статьями" onLogout={logout}>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#c41e3a] text-white text-sm font-semibold rounded-lg hover:bg-[#a01830] ml-2"
        >
          <Plus className="w-4 h-4" />
          Новая статья
        </button>
      </AdminNav>

      <div className="p-6">
        {listError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{listError}</div>
        )}

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <h2 className="font-bold text-[#1a1a2e] mb-1">Предлагаемые темы</h2>
          <p className="text-xs text-gray-400 mb-4">Нажмите на тему — откроется редактор, ИИ напишет русский текст, затем его можно перевести на узбекский и английский.</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  openNew(topic);
                  void generateTextFor(topic);
                }}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">Статьи ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Статей пока нет</p>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{post.title}</p>
                    <p className="text-xs text-gray-400">
                      /{post.slug} · {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                    <div className="flex gap-1 mt-1.5">
                      {LANGS.map((l) => {
                        const has = l.code === "ru" || post.locales?.includes(l.code);
                        return (
                          <span
                            key={l.code}
                            title={has ? `Есть: ${l.label}` : `Нет перевода: ${l.label}`}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                              has ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-300"
                            }`}
                          >
                            {l.code.toUpperCase()}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        post.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                    <button onClick={() => openEdit(post.id)} title="Редактировать и переводы" className="p-1.5 hover:bg-gray-200 rounded-lg">
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                    <a
                      href={`/admin/blog/preview?id=${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Предпросмотр"
                      className="p-1.5 hover:bg-gray-200 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </a>
                    <button
                      onClick={() => handlePublish(post.id, post.status)}
                      className="px-3 py-1 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a]"
                    >
                      {post.status === "published" ? "Снять" : "Опубликовать"}
                    </button>
                    <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Удалить">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <h3 className="font-bold text-[#1a1a2e] mb-4">{editingId ? "Редактирование статьи" : "Новая статья"}</h3>

            {/* language tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setActiveLang(l.code)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    activeLang === l.code ? "bg-[#c41e3a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {l.label}
                  {filled(l.code) && <span className="ml-1.5 text-xs opacity-80">✓</span>}
                </button>
              ))}
              {activeLang === "ru" && (
                <button
                  onClick={translateAll}
                  disabled={!!busy}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#c41e3a] text-[#c41e3a] rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {busy?.startsWith("tr-") ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
                  Перевести на все языки (ИИ)
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Заголовок ({activeLang.toUpperCase()})</label>
                <input
                  value={current.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setField(activeLang, "title", value);
                    // the address follows the Russian title until it is edited by hand
                    if (activeLang === "ru" && (!slug || slug === slugify(langs.ru.title))) setSlug(slugify(value));
                  }}
                  className={inputCls}
                />
              </div>

              {activeLang === "ru" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Адрес (slug, общий для всех языков)</label>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
                  <p className="mt-1 text-xs text-gray-400">
                    Адрес статьи: /blog/{slugify(slug) || "…"} (кириллица автоматически переводится в латиницу)
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Описание ({activeLang.toUpperCase()})</label>
                <input
                  value={current.description}
                  onChange={(e) => setField(activeLang, "description", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">Текст статьи ({activeLang.toUpperCase()})</label>
                  <div className="flex gap-2">
                    {activeLang !== "ru" && (
                      <button
                        onClick={() => translateTo(activeLang as "uz" | "en")}
                        disabled={!!busy}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] disabled:opacity-50"
                      >
                        {busy === `tr-${activeLang}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                        Перевести с русского
                      </button>
                    )}
                    <button
                      onClick={() => generateText(activeLang)}
                      disabled={!!busy}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] disabled:opacity-50"
                    >
                      {busy === `gen-${activeLang}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Написать с ИИ
                    </button>
                  </div>
                </div>
                <textarea
                  value={current.content}
                  onChange={(e) => setField(activeLang, "content", e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#c41e3a] resize-y"
                />
                {activeLang !== "ru" && !filled(activeLang) && (
                  <p className="mt-1 text-xs text-gray-400">
                    Пока перевода нет — посетителям на этом языке будет показана русская версия.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Статус</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
            </div>

            {editorError && (
              <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{editorError}</div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !!busy || !langs.ru.title || !slug || !langs.ru.content}
                className="flex-1 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Сохранить
              </button>
              <button onClick={() => setEditorOpen(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Topic chips open a fresh editor and ask the AI for the Russian text right away.
  async function generateTextFor(topic: string) {
    setBusy("gen-ru");
    setEditorError("");
    try {
      const data = await callAi({ action: "generate-blog-draft", topic, lang: "ru" });
      if (data.content) setField("ru", "content", data.content);
    } catch (e) {
      setEditorError(e instanceof Error ? e.message : "Ошибка ИИ");
    } finally {
      setBusy(null);
    }
  }
}
