"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, FileText, Download, MessageSquare, Loader2, LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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

function buildReviewRequestMessage(app: Application): string {
  return `Здравствуйте, ${app.fullName}!

Спасибо, что выбрали Lingua Translation.

Будем благодарны, если вы оставите честный отзыв о нашей работе в Google. Это поможет другим клиентам быстрее найти нас.

Офис Наманган:
https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_SITE_URL || ""}

Офис Ташкент:
https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_SITE_URL || ""}`;
}

export default function AdminApplicationsPage() {
  const { password, ready, logout } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (ready) fetchApplications();
  }, [ready, fetchApplications]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ status }),
      });
      await fetchApplications();
    } finally {
      setUpdatingId(null);
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
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c41e3a] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a1a2e]">Lingua Translation Admin</h1>
            <p className="text-xs text-gray-400">Заявки</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/seo" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">SEO</a>
          <a href="/admin/blog" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">Блог</a>
          <a href="/admin/google-business" className="text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5">Google Business</a>
          <button
            onClick={fetchApplications}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#c41e3a] px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Обновить
          </button>
          <button
            onClick={logout}
            title="Выйти"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Загрузка...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Заявок пока нет</div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Всего заявок: {applications.length}</p>
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
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
                      <p className="text-sm text-gray-500">{app.phone} · {app.city}</p>
                    </div>

                    <div className="flex items-center gap-2">
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
                    {app.fileName && (
                      <a
                        href={app.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#c41e3a] hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {app.fileName}
                      </a>
                    )}
                    <span>TG: {app.telegramNotificationStatus}</span>

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
          </>
        )}
      </div>

      {/* Review Modal */}
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
                onClick={() => {
                  navigator.clipboard.writeText(reviewMsg);
                }}
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
