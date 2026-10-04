"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Phone, Send, MessageCircle, PhoneCall, X, Loader2 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { company } from "@/data/company";
import { trackEvent } from "@/lib/analytics";

const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || company.phones[0].phone).replace(/\D/g, "");

const TEXT = {
  ru: {
    call: "Позвонить",
    callback: "Перезвоните мне",
    title: "Перезвоним за 10 минут",
    sub: "Оставьте имя и телефон — оператор свяжется с вами в рабочее время.",
    name: "Ваше имя",
    phone: "Телефон",
    send: "Жду звонка",
    done: "Спасибо! Мы скоро вам перезвоним.",
    error: "Не удалось отправить. Позвоните нам или напишите в Telegram.",
    close: "Закрыть",
  },
  uz: {
    call: "Qo'ng'iroq",
    callback: "Menga qo'ng'iroq qiling",
    title: "10 daqiqada qo'ng'iroq qilamiz",
    sub: "Ism va telefon qoldiring — operator ish vaqtida bog'lanadi.",
    name: "Ismingiz",
    phone: "Telefon",
    send: "Qo'ng'iroq kutaman",
    done: "Rahmat! Tez orada qo'ng'iroq qilamiz.",
    error: "Yuborib bo'lmadi. Qo'ng'iroq qiling yoki Telegramga yozing.",
    close: "Yopish",
  },
  en: {
    call: "Call",
    callback: "Call me back",
    title: "We'll call you back in 10 minutes",
    sub: "Leave your name and phone — an operator will contact you during working hours.",
    name: "Your name",
    phone: "Phone",
    send: "Call me",
    done: "Thank you! We'll call you back soon.",
    error: "Could not send. Please call us or write on Telegram.",
    close: "Close",
  },
} as const;

const btn =
  "flex w-12 h-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105";

export default function ContactButtons() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.ru;

  const [callMenu, setCallMenu] = useState(false);
  const [form, setForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (pathname.startsWith("/admin")) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error();
      trackEvent("callback_request", { page: window.location.pathname });
      setState("done");
      setName("");
      setPhone("");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-3">
        {callMenu && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-48">
            {company.phones.map((p) => (
              <a
                key={p.phone}
                href={`tel:${p.phone}`}
                onClick={() => trackEvent("click_phone", { office: p.city })}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#1a1a2e] hover:bg-gray-50"
              >
                <Phone className="w-4 h-4 text-[#c41e3a]" />
                <span>
                  <span className="block font-semibold">{p.city}</span>
                  <span className="text-xs text-gray-500">{p.phone}</span>
                </span>
              </a>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setForm(true);
            setState("idle");
            trackEvent("open_callback_form");
          }}
          aria-label={t.callback}
          title={t.callback}
          className={`${btn} bg-[#1a1a2e]`}
        >
          <PhoneCall className="w-5 h-5" />
        </button>
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_whatsapp")}
          aria-label="WhatsApp"
          title="WhatsApp"
          className={`${btn} bg-[#25d366]`}
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href={company.socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("click_telegram")}
          aria-label="Telegram"
          title="Telegram"
          className={`${btn} bg-[#229ed9]`}
        >
          <Send className="w-5 h-5" />
        </a>
        <button
          onClick={() => setCallMenu((v) => !v)}
          aria-label={t.call}
          title={t.call}
          className={`${btn} bg-[#c41e3a]`}
        >
          {callMenu ? <X className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
        </button>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-lg text-[#1a1a2e]">{t.title}</h3>
              <button onClick={() => setForm(false)} aria-label={t.close} className="p-1 -mr-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t.sub}</p>

            {state === "done" ? (
              <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">{t.done}</p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.name}
                  required
                  minLength={2}
                  maxLength={60}
                  autoComplete="name"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#c41e3a]"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phone}
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={25}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#c41e3a]"
                />
                {state === "error" && <p className="text-xs text-red-500">{t.error}</p>}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full py-2.5 bg-[#c41e3a] text-white text-sm font-semibold rounded-xl hover:bg-[#a01830] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {state === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
