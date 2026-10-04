"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { company } from "@/data/company";

interface Msg {
  id: number;
  direction: "incoming" | "outgoing";
  text: string;
}

const STORAGE_KEY = "lingua-chat-session";
const PHONE_KEY = "lingua-chat-phone";
const OPEN_POLL_MS = 4000;
const CLOSED_POLL_MS = 20000;

const TEXT = {
  ru: {
    title: "Чат с оператором",
    greeting: `Здравствуйте! Напишите вопрос — оператор ответит в рабочее время (${company.workingHours}).`,
    placeholder: "Ваше сообщение…",
    phone: "Телефон (чтобы мы могли перезвонить)",
    send: "Отправить",
    error: "Не удалось отправить. Попробуйте ещё раз или позвоните нам.",
    open: "Открыть чат",
    close: "Закрыть чат",
  },
  uz: {
    title: "Operator bilan chat",
    greeting: `Assalomu alaykum! Savolingizni yozing — operator ish vaqtida (${company.workingHours}) javob beradi.`,
    placeholder: "Xabaringiz…",
    phone: "Telefon (qo'ng'iroq qilishimiz uchun)",
    send: "Yuborish",
    error: "Yuborib bo'lmadi. Qayta urinib ko'ring yoki qo'ng'iroq qiling.",
    open: "Chatni ochish",
    close: "Chatni yopish",
  },
  en: {
    title: "Chat with an operator",
    greeting: `Hello! Write your question — an operator will reply during working hours (${company.workingHours}).`,
    placeholder: "Your message…",
    phone: "Phone (so we can call you back)",
    send: "Send",
    error: "Could not send. Please try again or call us.",
    open: "Open chat",
    close: "Close chat",
  },
} as const;

function readStorage(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable — chat still works for this page view
  }
}

function newSessionId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export default function ChatWidget() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.ru;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const lastIdRef = useRef(0);
  const openRef = useRef(false);
  const failuresRef = useRef(0);
  const tickRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Hide the widget entirely while the CRM bridge is not configured (the API answers 503)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat", { cache: "no-store" })
      .then((res) => !cancelled && res.status === 503 && setUnavailable(true))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Pull new messages for an existing session (operator replies, history after a reload)
  const poll = useCallback(async () => {
    const sessionId = readStorage(STORAGE_KEY);
    if (!sessionId || document.hidden) return;
    // after repeated failures only retry every 10th tick instead of hammering the server
    if (failuresRef.current >= 3 && ++tickRef.current % 10 !== 0) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}&after=${lastIdRef.current}`, { cache: "no-store" });
      if (!res.ok) {
        failuresRef.current++;
        return;
      }
      failuresRef.current = 0;
      const data: { messages: (Msg & { created_at: string })[] } = await res.json();
      const fresh = data.messages.filter((m) => m.id > lastIdRef.current);
      if (fresh.length === 0) return;
      lastIdRef.current = Math.max(...fresh.map((m) => m.id));
      setMessages((prev) => {
        const known = new Set(prev.map((m) => m.id));
        return [...prev, ...fresh.filter((m) => !known.has(m.id)).map(({ id, direction, text }) => ({ id, direction, text }))];
      });
      if (!openRef.current) {
        setUnread((n) => n + fresh.filter((m) => m.direction === "outgoing").length);
      }
    } catch {
      failuresRef.current++;
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const first = setTimeout(poll, 0);
    const timer = setInterval(poll, open ? OPEN_POLL_MS : CLOSED_POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [poll, open, pathname]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  if (pathname.startsWith("/admin") || unavailable) return null;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setUnread(0);
      setPhone((p) => p || readStorage(PHONE_KEY));
      setShowPhone(!readStorage(PHONE_KEY));
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || sending) return;

    let sessionId = readStorage(STORAGE_KEY);
    if (!sessionId) {
      sessionId = newSessionId();
      writeStorage(STORAGE_KEY, sessionId);
    }

    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text: body, phone: phone.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const data: { id: number } = await res.json();
      lastIdRef.current = Math.max(lastIdRef.current, data.id);
      setMessages((prev) => [...prev, { id: data.id, direction: "incoming", text: body }]);
      setText("");
      if (phone.trim()) {
        writeStorage(PHONE_KEY, phone.trim());
        setShowPhone(false);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-[min(22rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-[#c41e3a] text-white px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm">{t.title}</span>
            <button onClick={toggle} aria-label={t.close} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={listRef} className="h-72 overflow-y-auto p-3 space-y-2 bg-gray-50">
            <div className="max-w-[85%] text-sm bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 text-gray-700">
              {t.greeting}
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl whitespace-pre-wrap break-words ${
                  m.direction === "incoming"
                    ? "ml-auto bg-[#c41e3a] text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="p-3 border-t border-gray-100 space-y-2">
            {showPhone && (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phone}
                inputMode="tel"
                maxLength={30}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#c41e3a]"
              />
            )}
            {error && <p className="text-xs text-red-500">{t.error}</p>}
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.placeholder}
                maxLength={1000}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#c41e3a]"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                aria-label={t.send}
                className="px-3 bg-[#c41e3a] text-white rounded-xl disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label={open ? t.close : t.open}
        className="relative ml-auto flex w-14 h-14 items-center justify-center rounded-full bg-[#c41e3a] text-white shadow-lg hover:bg-[#a01830] transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-yellow-400 text-[#1a1a2e] text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
