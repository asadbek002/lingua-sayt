// Bridge between the website chat widget and the LinguaManager CRM (/web-chat endpoints).
// The CRM secret never reaches the browser: the widget talks to /api/chat, which calls the CRM.

export interface ChatMessage {
  id: number;
  direction: "incoming" | "outgoing";
  text: string;
  created_at: string;
}

const TIMEOUT_MS = 8000;

function config() {
  const url = (process.env.CRM_API_URL || "").replace(/\/+$/, "");
  const secret = process.env.CRM_WEBHOOK_SECRET || "";
  return url && secret ? { url, secret } : null;
}

export function isCrmChatConfigured(): boolean {
  return config() !== null;
}

export const SESSION_ID_RE = /^[A-Za-z0-9_-]{16,64}$/;

async function crmError(res: Response): Promise<Error> {
  const body = (await res.text().catch(() => "")).slice(0, 200);
  return new Error(`CRM responded ${res.status} ${res.statusText}: ${body}`);
}

async function crmFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const cfg = config();
  if (!cfg) throw new Error("CRM chat is not configured (CRM_API_URL / CRM_WEBHOOK_SECRET)");
  return fetch(`${cfg.url}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Bot-Secret": cfg.secret, ...init.headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
}

export async function sendVisitorMessage(
  sessionId: string,
  text: string,
  name?: string,
  phone?: string
): Promise<number> {
  const res = await crmFetch(`/web-chat/web_${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ text, name: name || "", phone: phone || "" }),
  });
  if (!res.ok) throw await crmError(res);
  const data = await res.json();
  return data.id as number;
}

export async function fetchChatMessages(sessionId: string, afterId: number): Promise<ChatMessage[]> {
  const res = await crmFetch(`/web-chat/web_${sessionId}/messages?after_id=${afterId}`);
  if (!res.ok) throw await crmError(res);
  const data = await res.json();
  return data.messages as ChatMessage[];
}

export interface CrmCheckResult {
  ok: boolean;
  reason: "ok" | "not_configured" | "secret_mismatch" | "crm_not_updated" | "crm_secret_missing" | "unreachable" | "error";
  hint: string;
  status?: number;
}

/** Admin diagnostics: probes the CRM bridge and explains in plain words what is wrong. Never returns secrets. */
export async function checkCrmConnection(): Promise<CrmCheckResult> {
  if (!config()) {
    return {
      ok: false,
      reason: "not_configured",
      hint: "На сайте не заданы CRM_API_URL и/или CRM_WEBHOOK_SECRET в .env (после правки: npm run build и pm2 restart).",
    };
  }
  try {
    const res = await crmFetch("/web-chat/web_aaaaaaaaaaaaaaaaaaaa/messages");
    if (res.ok) return { ok: true, reason: "ok", status: res.status, hint: "Связь с CRM работает." };
    if (res.status === 403)
      return { ok: false, reason: "secret_mismatch", status: 403, hint: "CRM отклонила секрет: CRM_WEBHOOK_SECRET на сайте должен совпадать с BOT_WEBHOOK_SECRET в .env CRM." };
    if (res.status === 404)
      return { ok: false, reason: "crm_not_updated", status: 404, hint: "В CRM нет адресов /web-chat: смёржьте PR с чатом и задеплойте CRM (scripts/deploy.sh). Также проверьте, что CRM_API_URL заканчивается на /api." };
    if (res.status === 503)
      return { ok: false, reason: "crm_secret_missing", status: 503, hint: "В CRM не задан BOT_WEBHOOK_SECRET: впишите его в .env CRM и перезапустите (docker compose up -d)." };
    return { ok: false, reason: "error", status: res.status, hint: `CRM ответила неожиданным кодом ${res.status}.` };
  } catch {
    return { ok: false, reason: "unreachable", hint: "Сайт не достучался до CRM: проверьте CRM_API_URL, что CRM запущена и доступна с этого сервера." };
  }
}
