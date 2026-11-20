"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, Send, X, Sparkles, Copy, Check, ImageIcon } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminNav from "@/components/AdminNav";

interface Draft {
  id: string;
  type: "AGENT_GBP" | "AGENT_TG" | "AGENT_REEL";
  title: string;
  description: string | null;
  status: string;
  targetUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
interface BlogDraft {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  translations: { locale: string }[];
}
interface AgentData {
  pending: Draft[];
  recent: Draft[];
  blogDrafts: BlogDraft[];
  channelConfigured: boolean;
}

function target(d: Draft) {
  if (d.type === "AGENT_REEL") return "Сценарий рилса · Instagram";
  if (d.type === "AGENT_TG") return "Telegram-канал";
  return d.targetUrl === "tashkent" ? "Google Business · Ташкент" : "Google Business · Наманган";
}

const fmt = (iso: string) => new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });

export default function AdminAgentPage() {
  const { password, ready, logout } = useAdminAuth();
  const [data, setData] = useState<AgentData | null>(null);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [imageVersion, setImageVersion] = useState<Record<string, number>>({});

  const newPhoto = async (d: Draft) => {
    setBusy(`photo-${d.id}`);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
        body: JSON.stringify({ action: "regenerate-photo", id: d.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setImageVersion((v) => ({ ...v, [d.id]: Date.now() }));
      setMessage(res.ok ? { ok: true, text: "Новое фото готово" } : { ok: false, text: json.error || "Не удалось создать фото" });
    } finally {
      setBusy(null);
    }
  };

  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(texts[id] ?? "");
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // clipboard not available: the text can still be selected manually
    }
  };

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/agent", { headers: { Authorization: `Bearer ${password}` } });
    if (!res.ok) return;
    const json: AgentData = await res.json();
    setData(json);
    setTexts((prev) => {
      const next = { ...prev };
      for (const d of json.pending) if (next[d.id] === undefined) next[d.id] = d.description ?? "";
      return next;
    });
  }, [password]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(load, 0);
    return () => clearTimeout(id);
  }, [ready, load]);

  const act = async (action: "publish" | "reject", d: Draft) => {
    setBusy(d.id);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
        body: JSON.stringify({ action, id: d.id, text: texts[d.id] }),
      });
      const json = await res.json().catch(() => ({}));
      setMessage(
        res.ok
          ? {
              ok: true,
              text:
                action === "reject"
                  ? "Черновик отклонён"
                  : d.type === "AGENT_REEL"
                    ? "Сценарий отмечен как использованный"
                    : `Опубликовано: ${target(d)}`,
            }
          : { ok: false, text: json.error || "Не удалось выполнить действие" }
      );
      await load();
    } finally {
      setBusy(null);
    }
  };

  const run = async (job: "blog" | "gbp" | "reel") => {
    setBusy(job);
    setMessage(null);
    try {
      const res = await fetch(`/api/agent/run?job=${job}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
      });
      setMessage(
        res.ok
          ? { ok: true, text: "Агент запущен. Через 1–3 минуты черновик появится здесь (или в Блоге), а в Telegram придёт уведомление." }
          : { ok: false, text: "Не удалось запустить агента" }
      );
    } finally {
      setBusy(null);
    }
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
      <AdminNav title="Агент контента" subtitle="Черновики статей и постов на одобрение" onLogout={logout}>
        <button onClick={load} className="flex items-center gap-1 text-sm text-gray-500 px-3 py-1.5 hover:text-[#c41e3a]">
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
      </AdminNav>

      <div className="p-4 sm:p-6 space-y-6 max-w-5xl">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-gray-700">
          <h2 className="font-bold text-[#1a1a2e] mb-2">Как работает агент</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>По расписанию агент пишет статьи (RU, перевод на UZ и EN) и посты Google Business для обоих офисов.</li>
            <li>Ничего не публикуется само: статьи ждут в «Блоге» как черновики, посты — здесь.</li>
            <li>Когда вы публикуете статью, агент готовит анонс для Telegram-канала — он тоже появится здесь.</li>
            <li>Раз в неделю — сценарий рилса для Instagram: скопируйте его в ваш сервис видео.</li>
            <li>К постам Google добавляется фирменная картинка, к анонсам в канал — современное ИИ-фото с вашим логотипом (кнопка «Новое фото», если не понравилось).</li>
            <li>Проверьте факты (цены, сроки), при необходимости поправьте текст и нажмите «Опубликовать».</li>
          </ul>
          {data && !data.channelConfigured && (
            <p className="mt-2 text-xs text-amber-700">
              Анонсы в Telegram-канал выключены: задайте TELEGRAM_CHANNEL_ID в .env сервера.
            </p>
          )}
        </div>

        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm ${message.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => run("blog")}
            disabled={!!busy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#c41e3a] rounded-xl disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Написать статью сейчас
          </button>
          <button
            onClick={() => run("gbp")}
            disabled={!!busy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#c41e3a] border border-[#c41e3a] rounded-xl disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Подготовить посты Google сейчас
          </button>
          <button
            onClick={() => run("reel")}
            disabled={!!busy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#c41e3a] border border-[#c41e3a] rounded-xl disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Сценарий рилса сейчас
          </button>
        </div>

        <section className="bg-white rounded-2xl border p-5 sm:p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">На одобрение ({data?.pending.length ?? 0})</h2>
          {!data ? (
            <Loader2 className="w-5 h-5 text-[#c41e3a] animate-spin" />
          ) : data.pending.length === 0 ? (
            <p className="text-sm text-gray-500">Новых черновиков нет.</p>
          ) : (
            <div className="space-y-5">
              {data.pending.map((d) => (
                <div key={d.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#c41e3a] bg-red-50 px-2 py-1 rounded-lg">{target(d)}</span>
                    <span className="text-xs text-gray-400">{fmt(d.createdAt)}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a2e] mb-2">{d.title}</p>
                  {d.type !== "AGENT_REEL" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/agent/card/task/${d.id}.jpg?v=${imageVersion[d.id] ?? 0}`}
                      alt=""
                      className="w-full max-w-sm rounded-xl border border-gray-100 mb-3"
                    />
                  )}
                  <textarea
                    value={texts[d.id] ?? ""}
                    onChange={(e) => setTexts((t) => ({ ...t, [d.id]: e.target.value }))}
                    rows={d.type === "AGENT_REEL" ? 16 : 7}
                    className="w-full text-sm border border-gray-200 rounded-xl p-3 outline-none focus:border-[#c41e3a]"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => act("publish", d)}
                      disabled={busy === d.id}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#c41e3a] rounded-xl disabled:opacity-50"
                    >
                      {busy === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{" "}
                      {d.type === "AGENT_REEL" ? "Отметить использованным" : "Опубликовать"}
                    </button>
                    {d.type === "AGENT_TG" && (
                      <button
                        onClick={() => newPhoto(d)}
                        disabled={!!busy}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl disabled:opacity-50"
                      >
                        {busy === `photo-${d.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Новое фото
                      </button>
                    )}
                    {d.type === "AGENT_REEL" && (
                      <button
                        onClick={() => copy(d.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl"
                      >
                        {copied === d.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Скопировать
                      </button>
                    )}
                    <button
                      onClick={() => act("reject", d)}
                      disabled={busy === d.id}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl disabled:opacity-50"
                    >
                      <X className="w-4 h-4" /> Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border p-5 sm:p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-1">Статьи-черновики</h2>
          <p className="text-xs text-gray-500 mb-4">Откройте в разделе «Блог», проверьте и опубликуйте.</p>
          {data && data.blogDrafts.length === 0 && <p className="text-sm text-gray-500">Черновиков статей нет.</p>}
          <ul className="space-y-2">
            {data?.blogDrafts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-[#1a1a2e]">{p.title}</span>
                <span className="text-xs text-gray-400">
                  RU{p.translations.map((t) => ", " + t.locale.toUpperCase()).join("")} · {fmt(p.createdAt)}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/admin/blog" className="inline-block mt-4 text-sm font-semibold text-[#c41e3a]">
            Перейти в Блог →
          </Link>
        </section>

        {data && data.recent.length > 0 && (
          <section className="bg-white rounded-2xl border p-5 sm:p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">История</h2>
            <ul className="space-y-2 text-sm">
              {data.recent.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-gray-700">
                    {target(d)} — {d.title}
                  </span>
                  <span className={`text-xs ${d.status === "PUBLISHED" ? "text-green-700" : "text-gray-400"}`}>
                    {d.status === "PUBLISHED" ? (d.type === "AGENT_REEL" ? "использован" : "опубликовано") : "отклонено"} ·{" "}
                    {fmt(d.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
