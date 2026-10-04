"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Download, MessageSquare, Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminHeaders, openAdminFile } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";

interface Application {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  serviceType: string;
  targetLanguage?: string;
  urgency: string;
  status: string;
  comment?: string;
  fileName?: string;
  fileUrl?: string;
  source: string;
  preferredMessenger: string;
  telegramNotificationStatus: string;
  kakaoNotificationStatus: string;
  whatsappNotificationStatus: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "Новая", color: "bg-blue-100 text-blue-700" },
  CONTACTED: { label: "Связались", color: "bg-yellow-100 text-yellow-700" },
  IN_PROGRESS: { label: "В работе", color: "bg-purple-100 text-purple-700" },
  WAITING_CLIENT: { label: "Ожидаем клиента", color: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "Завершена", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Отменена", color: "bg-red-100 text-red-700" },
};

const STATUSES = Object.keys(STATUS_LABELS);
const PAGE_SIZE = 20;

const NOTIFY_COLORS: Record<string, string> = {
  SUCCESS: "text-green-600",
  FAILED: "text-red-500",
  SKIPPED: "text-gray-400",
  PENDING: "text-gray-400",
};

function buildReviewRequestMessage(app: Application): string {
  const namangan = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL_NAMANGAN;
  const tashkent = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL_TASHKENT;
  const links = [
    namangan && `Офис Наманган:\n${namangan}`,
    tashkent && `Офис Ташкент:\n${tashkent}`,
  ].filter(Boolean);

  return `Здравствуйте, ${app.fullName}!

Спасибо, что выбрали Lingua Translation.

Будем благодарны, если вы оставите честный отзыв о нашей работе в Google. Это поможет другим клиентам быстрее найти нас.${
    links.length ? `\n\n${links.join("\n\n")}` : ""
  }`;
}

export default function AdminApplicationsPage() {
  const { password, ready, logout } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [chatCheck, setChatCheck] = useState<{ ok: boolean; hint: string } | null>(null);
  const [chatChecking, setChatChecking] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (statusFilter) params.set("status", statusFilter);
    if (query) params.set("q", query);

    fetch(`/api/admin/applications?${params}`, { headers: adminHeaders(password) })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setApplications(data.applications);
          setTotal(data.total);
          setCounts(data.counts ?? {});
          setError("");
        } else {
          setError(data.error || `Ошибка сервера (${res.status})`);
        }
      })
      .catch(() => !cancelled && setError("Ошибка соединения с сервером"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [ready, password, page, statusFilter, query, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const applyFilter = (status: string) => {
    setLoading(true);
    setPage(1);
    setStatusFilter(status);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
    setQuery(search.trim());
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: adminHeaders(password, true),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      reload();
    } catch {
      setError("Не удалось изменить статус");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChatCheck = async () => {
    setChatChecking(true);
    setChatCheck(null);
    try {
      const res = await fetch("/api/admin/chat-check", { headers: adminHeaders(password) });
      const data = await res.json().catch(() => null);
      setChatCheck(data?.hint ? { ok: !!data.ok, hint: data.hint } : { ok: false, hint: `Ошибка сервера (${res.status})` });
    } catch {
      setChatCheck({ ok: false, hint: "Ошибка соединения с сайтом" });
    } finally {
      setChatChecking(false);
    }
  };

  const handleOpenFile = async (fileUrl: string) => {
    try {
      await openAdminFile(password, fileUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось открыть файл");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c41e3a] animate-spin" />
      </div>
    );
  }

  const totalAll = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav title="Lingua Translation Admin" subtitle="Заявки" onLogout={logout}>
        <button
          onClick={reload}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
        <button
          onClick={handleChatCheck}
          disabled={chatChecking}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {chatChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
          Проверить чат
        </button>
      </AdminNav>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Dashboard summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => applyFilter("")}
            className={`text-left bg-white rounded-xl border p-4 ${statusFilter === "" ? "border-[#c41e3a]" : "border-gray-100"}`}
          >
            <p className="text-2xl font-bold text-[#1a1a2e]">{totalAll}</p>
            <p className="text-xs text-gray-400">Всего</p>
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => applyFilter(s)}
              className={`text-left bg-white rounded-xl border p-4 ${statusFilter === s ? "border-[#c41e3a]" : "border-gray-100"}`}
            >
              <p className="text-2xl font-bold text-[#1a1a2e]">{counts[s] ?? 0}</p>
              <p className="text-xs text-gray-400">{STATUS_LABELS[s].label}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени, телефону, городу"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#c41e3a] bg-white"
            />
          </div>
          <button type="submit" className="px-4 py-2 text-sm bg-[#c41e3a] text-white rounded-xl font-semibold">
            Найти
          </button>
        </form>

        {chatCheck && (
          <div
            className={`text-sm rounded-xl px-4 py-3 border ${
              chatCheck.ok ? "text-green-700 bg-green-50 border-green-100" : "text-red-600 bg-red-50 border-red-100"
            }`}
          >
            Чат с сайта: {chatCheck.hint}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Загрузка...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Заявок не найдено</div>
        ) : (
          <>
            <p className="text-sm text-gray-500">Найдено: {total}</p>
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            STATUS_LABELS[app.status]?.color || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {STATUS_LABELS[app.status]?.label || app.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(app.createdAt).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1a1a2e]">{app.fullName}</h3>
                      <p className="text-sm text-gray-500">
                        <a href={`tel:${app.phone}`} className="hover:text-[#c41e3a]">{app.phone}</a> · {app.city} · {app.preferredMessenger}
                      </p>
                    </div>

                    <select
                      value={app.status}
                      disabled={updatingId === app.id}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#c41e3a] bg-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-400 text-xs">Услуга</span>
                      <p className="font-medium text-gray-800">{app.serviceType}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Перевод на</span>
                      <p className="font-medium text-gray-800">{app.targetLanguage || "—"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Срочность</span>
                      <p className="font-medium text-gray-800">{app.urgency}</p>
                    </div>
                  </div>

                  {app.comment && (
                    <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-3">
                      <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                      {app.comment}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {app.fileName && app.fileUrl && (
                      <button
                        onClick={() => handleOpenFile(app.fileUrl!)}
                        className="flex items-center gap-1 text-[#c41e3a] hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {app.fileName}
                      </button>
                    )}
                    <span className={NOTIFY_COLORS[app.telegramNotificationStatus]}>TG: {app.telegramNotificationStatus}</span>
                    <span className={NOTIFY_COLORS[app.kakaoNotificationStatus]}>Kakao: {app.kakaoNotificationStatus}</span>
                    <span className={NOTIFY_COLORS[app.whatsappNotificationStatus]}>WA: {app.whatsappNotificationStatus}</span>

                    {app.status === "COMPLETED" && (
                      <button
                        onClick={() => setReviewMsg(buildReviewRequestMessage(app))}
                        className="ml-auto px-3 py-1 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors"
                      >
                        Попросить отзыв
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  disabled={page <= 1}
                  onClick={() => { setLoading(true); setPage((p) => p - 1); }}
                  className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => { setLoading(true); setPage((p) => p + 1); }}
                  className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {reviewMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-[#1a1a2e] mb-4">Сообщение для клиента</h3>
            <textarea
              value={reviewMsg}
              readOnly
              rows={10}
              className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(reviewMsg)}
                className="flex-1 py-2.5 bg-[#c41e3a] text-white font-semibold rounded-xl text-sm"
              >
                Скопировать
              </button>
              <button
                onClick={() => setReviewMsg(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
