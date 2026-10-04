"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAdminToken, setAdminToken } from "@/lib/adminAuth";

function getNextUrl(): string {
  if (typeof window === "undefined") return "/admin/applications";
  const next = new URLSearchParams(window.location.search).get("next") ?? "";
  return next.startsWith("/admin") ? next : "/admin/applications";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Lazy initializers — read from window/sessionStorage once at init, no setState in effects
  const [nextUrl] = useState<string>(getNextUrl);
  const alreadyAuthed = useSyncExternalStore(
    () => () => {},
    () => !!getAdminToken(),
    () => false
  );

  useEffect(() => {
    // Only router navigation, never setState
    if (alreadyAuthed) router.replace(nextUrl);
  }, [alreadyAuthed, router, nextUrl]);

  const checking = alreadyAuthed;

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        setAdminToken(password);
        router.replace(nextUrl);
      } else if (res.status === 503) {
        setError("На сервере не задана переменная ADMIN_PASSWORD");
      } else {
        setError("Неверный пароль");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#c41e3a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#c41e3a] rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-xl font-black">L</span>
          </div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Lingua Translation</h1>
          <p className="text-sm text-gray-400 mt-1">Панель управления</p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Пароль администратора"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
              error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#c41e3a]"
            }`}
            autoFocus
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 bg-[#c41e3a] text-white text-sm font-semibold rounded-xl hover:bg-[#a01830] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
