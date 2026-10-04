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
