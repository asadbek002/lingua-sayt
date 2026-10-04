"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminNav from "@/components/AdminNav";

const SEO_PAGES = [
  { title: "Notarial tarjima", slug: "/notarial-tarjima", service: "Нотариальный перевод" },
  { title: "Apostil", slug: "/apostil", service: "Апостиль" },
  { title: "Diplom tarjimasi", slug: "/diplom-tarjimasi", service: "Перевод диплома" },
  { title: "Metrka tarjimasi", slug: "/metrka-tarjimasi", service: "Перевод метрики" },
  { title: "Nikoh guvohnomasi", slug: "/nikoh-guvohnomasi-tarjimasi", service: "Никох гувоҳномаси" },
  { title: "Tibbiy tarjima", slug: "/tibbiy-hujjatlar-tarjimasi", service: "Медицинский перевод" },
  { title: "Tarjima Namangan", slug: "/tarjima-namangan", service: "Переводы в Намангане" },
  { title: "Tarjima Tashkent", slug: "/tarjima-tashkent", service: "Переводы в Ташкенте" },
];

export default function AdminSeoPage() {
  const { password, ready, logout } = useAdminAuth();
  const [tasks, setTasks] = useState<{ id: string; title: string; status: string; type: string; createdAt: string }[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/admin/seo", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  }, [password]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetch("/api/admin/seo", { headers: { Authorization: `Bearer ${password}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !cancelled) setTasks(data.tasks);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ready, password]);

  const handleGenerate = async (action: string, page: (typeof SEO_PAGES)[0]) => {
    setGenerating(`${action}-${page.slug}`);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action, service: page.service }),
      });
      const data = await res.json();
      if (data.content) {
        setResults((prev) => ({ ...prev, [`${action}-${page.slug}`]: data.content }));
      } else if (data.error) {
        setResults((prev) => ({ ...prev, [`${action}-${page.slug}`]: `Ошибка: ${data.error}` }));
      }
    } finally {
      setGenerating(null);
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
      <AdminNav title="SEO Панель" subtitle="Управление SEO-страницами и AI-контентом" onLogout={logout}>
        <button onClick={fetchTasks} className="flex items-center gap-1 text-sm text-gray-500 px-3 py-1.5 hover:text-[#c41e3a]">
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
      </AdminNav>

      <div className="p-6 space-y-6">
        {/* SEO Tasks */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">SEO задачи</h2>
            <div className="space-y-2">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.type} · {new Date(task.createdAt).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Pages */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">SEO страницы</h2>
          <div className="space-y-4">
            {SEO_PAGES.map((page) => (
              <div key={page.slug} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{page.title}</p>
                    <p className="text-xs text-gray-400">{page.slug}</p>
                  </div>
                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#c41e3a] hover:underline"
                  >
                    Открыть
                  </a>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["generate-title", "generate-description", "generate-faq"].map((action) => (
                    <button
                      key={action}
                      disabled={generating === `${action}-${page.slug}`}
                      onClick={() => handleGenerate(action, page)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors disabled:opacity-50"
                    >
                      {generating === `${action}-${page.slug}` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {action === "generate-title" && "Генерировать title"}
                      {action === "generate-description" && "Генерировать description"}
                      {action === "generate-faq" && "Генерировать FAQ"}
                    </button>
                  ))}
                </div>

                {Object.entries(results)
                  .filter(([key]) => key.endsWith(page.slug))
                  .map(([key, value]) => (
                    <div key={key} className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">
                        {key.replace(`-${page.slug}`, "").replace("generate-", "")}
                      </p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap">{value}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
