"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Star, Send, RefreshCw, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminNav from "@/components/AdminNav";

const POST_TOPICS = [
  "Нотариальный перевод документов",
  "Апостиль для документов",
  "Перевод диплома",
  "Перевод свидетельства о рождении",
  "Медицинские переводы",
  "Срочный перевод",
  "Офис в Намангане",
  "Офис в Ташкенте",
];

type ConnectionResult = {
  ok: boolean;
  warning?: string;
  envStatus?: Record<string, boolean>;
  tokenOk?: boolean;
  error?: string;
};

type Account = {
  name: string;
  accountName: string;
  type: string;
  verificationState: string;
};

type Location = {
  name: string;
  accountName?: string;
  title: string;
  phoneNumbers?: { primaryPhone?: string };
  storefrontAddress?: { addressLines?: string[]; locality?: string };
  metadata?: { mapsUri?: string; newReviewUri?: string };
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      title="Копировать ID"
      className="ml-2 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdminGoogleBusinessPage() {
  const { password, ready, logout } = useAdminAuth();
  const [office, setOffice] = useState<"namangan" | "tashkent">("namangan");
  const [reviews, setReviews] = useState<{ reviewId: string; reviewer: { displayName: string }; starRating: string; comment?: string; createTime: string; reviewReply?: { comment: string } }[]>([]);
  const [repliedIds, setRepliedIds] = useState<Set<string>>(new Set());
  const [showReplied, setShowReplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [postTopic, setPostTopic] = useState("");
  const [postContent, setPostContent] = useState("");
  const [generatingPost, setGeneratingPost] = useState(false);
  const [reviewResponses, setReviewResponses] = useState<Record<string, string>>({});
  const [generatingReview, setGeneratingReview] = useState<string | null>(null);

  // Connection block state
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<ConnectionResult | null>(null);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsResult, setAccountsResult] = useState<{ accounts?: Account[]; warning?: string; error?: string } | null>(null);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsResult, setLocationsResult] = useState<{ locations?: Location[]; warning?: string; error?: string } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/google-business?office=${office}`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json().catch(() => ({}));
      setReviews(data.reviews || []);
      setNotice(data.error || (res.ok ? "" : `Ошибка сервера (${res.status})`));
    } finally {
      setLoading(false);
    }
  }, [office, password]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetch(`/api/admin/google-business?office=${office}`, { headers: { Authorization: `Bearer ${password}` } })
      .then(async (res) => ({ res, data: await res.json().catch(() => ({})) }))
      .then(({ res, data }) => {
        if (cancelled) return;
        setReviews(data.reviews || []);
        setNotice(data.error || (res.ok ? "" : `Ошибка сервера (${res.status})`));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ready, office, password]);

  const handleCheckConnection = async () => {
    setCheckLoading(true);
    setCheckResult(null);
    try {
      const res = await fetch("/api/admin/google-business/check", {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      setCheckResult(data);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleListAccounts = async () => {
    setAccountsLoading(true);
    setAccountsResult(null);
    try {
      const res = await fetch("/api/admin/google-business/accounts", {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      setAccountsResult(data);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleListLocations = async () => {
    setLocationsLoading(true);
    setLocationsResult(null);
    try {
      const res = await fetch("/api/admin/google-business/locations", {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      setLocationsResult(data);
    } finally {
      setLocationsLoading(false);
    }
  };

  const handleGeneratePost = async () => {
    setGeneratingPost(true);
    try {
      const res = await fetch("/api/admin/google-business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action: "generate-post", topic: postTopic, office }),
      });
      const data = await res.json();
      if (data.content) setPostContent(data.content);
      setNotice(data.error || "");
    } finally {
      setGeneratingPost(false);
    }
  };

  const handlePublishPost = async () => {
    if (!postContent) return;
    const res = await fetch("/api/admin/google-business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ action: "publish-post", office, postContent }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Пост опубликован!");
      setPostContent("");
    } else {
      alert(data.error || "Ошибка публикации");
    }
  };

  const handleGenerateReviewResponse = async (reviewId: string, reviewText: string, rating: string) => {
    setGeneratingReview(reviewId);
    try {
      const ratingMap: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
      const res = await fetch("/api/admin/google-business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          action: "generate-review-response",
          reviewText,
          rating: ratingMap[rating] || 5,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setReviewResponses((prev) => ({ ...prev, [reviewId]: data.content }));
      }
      setNotice(data.error || "");
    } finally {
      setGeneratingReview(null);
    }
  };

  const handlePublishReviewReply = async (reviewId: string) => {
    const comment = reviewResponses[reviewId];
    if (!comment) return;

    const res = await fetch("/api/admin/google-business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ action: "publish-review-reply", office, reviewId, postContent: comment }),
    });

    const data = await res.json();
    if (data.success) {
      setReviewResponses((prev) => ({ ...prev, [reviewId]: "" }));
      // answered reviews drop out of the list
      setRepliedIds((prev) => new Set(prev).add(reviewId));
      setNotice("");
    } else {
      alert(data.error || "Ошибка публикации ответа");
    }
  };

  const isAnswered = (r: (typeof reviews)[number]) => !!r.reviewReply || repliedIds.has(r.reviewId);
  const visibleReviews = showReplied ? reviews : reviews.filter((r) => !isAnswered(r));
  const answeredCount = reviews.filter(isAnswered).length;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c41e3a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav title="Google Business" subtitle="Управление профилями и отзывами" onLogout={logout}></AdminNav>

      <div className="p-6 space-y-6">
        {notice && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{notice}</div>
        )}

        {/* Google Business Connection Block */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-1">Google Business подключение</h2>
          <p className="text-xs text-gray-400 mb-5">Проверка учётных данных OAuth2 и доступных ресурсов</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleCheckConnection}
              disabled={checkLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white text-sm font-semibold rounded-xl hover:bg-[#2a2a4e] disabled:opacity-50 transition-colors"
            >
              {checkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Check connection
            </button>
            <button
              onClick={handleListAccounts}
              disabled={accountsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-[#c41e3a] hover:text-[#c41e3a] disabled:opacity-50 transition-colors"
            >
              {accountsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              List accounts
            </button>
            <button
              onClick={handleListLocations}
              disabled={locationsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-[#c41e3a] hover:text-[#c41e3a] disabled:opacity-50 transition-colors"
            >
              {locationsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              List locations
            </button>
          </div>

          {/* Check Connection Result */}
          {checkResult && (
            <div className={`mb-4 p-4 rounded-xl border text-sm ${checkResult.ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <div className="flex items-center gap-2 font-semibold mb-3">
                {checkResult.ok
                  ? <CheckCircle className="w-4 h-4 text-green-600" />
                  : <XCircle className="w-4 h-4 text-red-500" />}
                <span className={checkResult.ok ? "text-green-700" : "text-red-600"}>
                  {checkResult.ok ? "Подключение успешно" : "Ошибка подключения"}
                </span>
              </div>
              {checkResult.warning && (
                <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-xs">
                  {checkResult.warning}
                </div>
              )}
              {checkResult.error && (
                <p className="text-red-600 mb-3">{checkResult.error}</p>
              )}
              {checkResult.envStatus && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">Переменные окружения:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(checkResult.envStatus).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1.5 text-xs">
                        {val
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          : <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                        <span className={val ? "text-gray-700" : "text-red-500"}>{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {checkResult.tokenOk !== undefined && (
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  {checkResult.tokenOk
                    ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <span className={checkResult.tokenOk ? "text-gray-700" : "text-red-500"}>
                    access_token: {checkResult.tokenOk ? "получен" : "не удалось получить"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Accounts Result */}
          {accountsResult && (
            <div className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm">
              <p className="font-semibold text-gray-700 mb-3">Аккаунты Google Business</p>
              {accountsResult.warning && (
                <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-xs">
                  {accountsResult.warning}
                </div>
              )}
              {accountsResult.error ? (
                <p className="text-red-500">{accountsResult.error}</p>
              ) : accountsResult.accounts && accountsResult.accounts.length > 0 ? (
                <div className="space-y-2">
                  {accountsResult.accounts.map((acc) => (
                    <div key={acc.name} className="bg-white border border-gray-200 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{acc.accountName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{acc.type} · {acc.verificationState}</p>
                          <div className="flex items-center mt-1.5">
                            <span className="text-xs font-mono text-gray-500 break-all">{acc.name}</span>
                            <CopyButton text={acc.name} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs">Аккаунты не найдены</p>
              )}
            </div>
          )}

          {/* Locations Result */}
          {locationsResult && (
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm">
              <p className="font-semibold text-gray-700 mb-3">Локации Google Business</p>
              {locationsResult.warning && (
                <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3 text-xs">
                  {locationsResult.warning}
                </div>
              )}
              {locationsResult.error ? (
                <p className="text-red-500">{locationsResult.error}</p>
              ) : locationsResult.locations && locationsResult.locations.length > 0 ? (
                <div className="space-y-2">
                  {locationsResult.locations.map((loc) => {
                    const phone = loc.phoneNumbers?.primaryPhone;
                    const address = [
                      ...(loc.storefrontAddress?.addressLines || []),
                      loc.storefrontAddress?.locality,
                    ].filter(Boolean).join(", ");
                    return (
                      <div key={loc.name} className="bg-white border border-gray-200 rounded-xl p-3">
                        <p className="font-semibold text-gray-800">{loc.title}</p>
                        {phone && <p className="text-xs text-gray-500 mt-0.5">{phone}</p>}
                        {address && <p className="text-xs text-gray-400 mt-0.5">{address}</p>}
                        <div className="flex items-center mt-1.5">
                          <span className="text-xs font-mono text-gray-500 break-all">{loc.name}</span>
                          <CopyButton text={loc.name} />
                        </div>
                        {loc.accountName && (
                          <p className="text-xs text-gray-400 mt-1">
                            Аккаунт: <span className="font-mono">{loc.accountName}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-xs">
                  Локации не найдены. Убедитесь, что GOOGLE_ACCOUNT_ID задан в .env
                </p>
              )}
            </div>
          )}
        </div>

        {/* Office Selector */}
        <div className="flex gap-2">
          {(["namangan", "tashkent"] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOffice(o)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${
                office === o ? "bg-[#c41e3a] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#c41e3a]"
              }`}
            >
              {o === "namangan" ? "Наманган" : "Ташкент"}
            </button>
          ))}
          <button onClick={fetchReviews} className="ml-auto flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#c41e3a]">
            <RefreshCw className="w-4 h-4" /> Обновить
          </button>
        </div>

        {/* Google Posts Generator */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">Генератор постов</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {POST_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setPostTopic(topic)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  postTopic === topic ? "border-[#c41e3a] text-[#c41e3a] bg-red-50" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleGeneratePost}
              disabled={!postTopic || generatingPost}
              className="flex items-center gap-2 px-4 py-2 bg-[#c41e3a] text-white text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              {generatingPost ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Сгенерировать
            </button>
          </div>
          {postContent && (
            <div className="space-y-3">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none outline-none focus:border-[#c41e3a]"
              />
              <button
                onClick={handlePublishPost}
                className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700"
              >
                Опубликовать в Google Business
              </button>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">
            Отзывы {office === "namangan" ? "Намангана" : "Ташкента"}
          </h2>
          <label className="flex items-center gap-2 text-xs text-gray-500 mb-4 cursor-pointer">
            <input type="checkbox" checked={showReplied} onChange={(e) => setShowReplied(e.target.checked)} />
            Показать отвеченные ({answeredCount})
          </label>
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Отзывы не найдены (Google Business может быть не подключён)
            </p>
          ) : visibleReviews.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Все отзывы обработаны — без ответа ничего не осталось 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {visibleReviews.map((review) => {
                const ratingMap: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
                const stars = ratingMap[review.starRating] || 0;
                return (
                  <div key={review.reviewId} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-gray-800">{review.reviewer.displayName}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">{new Date(review.createTime).toLocaleDateString("ru-RU")}</span>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600 mb-3">{review.comment}</p>}
                    {isAnswered(review) && (
                      <p className="text-xs text-green-600 mb-2">
                        ✓ Ответ дан{review.reviewReply?.comment ? `: ${review.reviewReply.comment}` : ""}
                      </p>
                    )}

                    <div className="space-y-2">
                      <button
                        onClick={() => handleGenerateReviewResponse(review.reviewId, review.comment || "", review.starRating)}
                        disabled={generatingReview === review.reviewId}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-[#c41e3a] hover:text-[#c41e3a] transition-colors disabled:opacity-50"
                      >
                        {generatingReview === review.reviewId ? <Loader2 className="w-3 h-3 animate-spin" /> : "✨"}
                        Сгенерировать ответ AI
                      </button>

                      {reviewResponses[review.reviewId] && (
                        <div className="space-y-2">
                          <textarea
                            value={reviewResponses[review.reviewId]}
                            onChange={(e) => setReviewResponses((prev) => ({ ...prev, [review.reviewId]: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none outline-none focus:border-[#c41e3a]"
                          />
                          <button
                            onClick={() => handlePublishReviewReply(review.reviewId)}
                            className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700"
                          >
                            Опубликовать ответ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
