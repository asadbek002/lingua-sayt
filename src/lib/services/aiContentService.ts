interface AiResponse {
  content: string;
  error?: string;
}

async function callAI(prompt: string, maxTokens = 1500): Promise<AiResponse> {
  // Read env at call time; AI is on whenever a key is present unless AI_ENABLED=false
  const apiKey = process.env.AI_API_KEY || "";
  const enabled = process.env.AI_ENABLED !== "false" && !!apiKey;
  const provider = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  const model = process.env.AI_MODEL || (provider === "openai" ? "gpt-4o-mini" : "claude-sonnet-5-5");

  if (!enabled) {
    return { content: "", error: "AI не настроен: задайте AI_API_KEY в .env (и не ставьте AI_ENABLED=false)" };
  }

  try {
    const res =
      provider === "openai"
        ? await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: maxTokens }),
          })
        : await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "user", content: prompt }] }),
          });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = data?.error?.message || `HTTP ${res.status}`;
      console.error("[AiContentService] API error:", res.status, detail);
      return { content: "", error: `AI API: ${detail}` };
    }

    const content =
      provider === "openai"
        ? data.choices?.[0]?.message?.content
        : data.content?.find((b: { type: string }) => b.type === "text")?.text;
    return { content: content || "" };
  } catch (err) {
    console.error("[AiContentService] error:", err);
    return { content: "", error: "AI сервис недоступен (проверьте доступ сервера в интернет)" };
  }
}

export async function generateSeoTitle(service: string, city?: string): Promise<AiResponse> {
  const prompt = `Создай SEO title для страницы бюро переводов Lingua Translation.
Услуга: ${service}
${city ? `Город: ${city}` : ""}
Требования: до 60 символов, на узбекском или русском языке, без кликбейта.`;
  return callAI(prompt);
}

export async function generateSeoDescription(service: string, city?: string): Promise<AiResponse> {
  const prompt = `Создай meta description для страницы бюро переводов Lingua Translation.
Услуга: ${service}
${city ? `Город: ${city}` : ""}
Требования: 120-160 символов, полезный для пользователя, без keyword stuffing.`;
  return callAI(prompt);
}

export async function generateFaq(topic: string): Promise<AiResponse> {
  const prompt = `Создай 5 вопросов и ответов FAQ для страницы бюро переводов Lingua Translation.
Тема: ${topic}
Формат: JSON массив [{question: "...", answer: "..."}]
Язык: русский или узбекский. Ответы должны быть полезными и правдивыми.`;
  return callAI(prompt);
}

export async function generateServicePageText(service: string): Promise<AiResponse> {
  const prompt = `Напиши полезный текст для страницы услуги бюро переводов Lingua Translation.
Услуга: ${service}
Компания работает в Намангане и Ташкенте, Узбекистан.
Требования: 200-300 слов, полезно для клиента, без лишних обещаний.`;
  return callAI(prompt);
}

export async function generateGoogleBusinessPost(topic: string, city?: string): Promise<AiResponse> {
  const prompt = `Создай пост для Google Business Profile бюро переводов Lingua Translation.
Тема: ${topic}
${city ? `Офис: ${city}` : ""}
Требования: 150-300 символов, информативно, с призывом к действию. Язык: русский или узбекский.`;
  return callAI(prompt);
}

export async function generateReviewResponse(
  reviewText: string,
  rating: number
): Promise<AiResponse> {
  const prompt = `Напиши вежливый ответ на отзыв клиента бюро переводов Lingua Translation.
Отзыв: "${reviewText}"
Рейтинг: ${rating}/5
Требования: вежливо, коротко (2-3 предложения), на русском или узбекском языке.`;
  return callAI(prompt);
}

export const LANGUAGE_NAMES = { ru: "русском", uz: "узбекском (латиница, o'zbek tili)", en: "английском" } as const;
export type AiLang = keyof typeof LANGUAGE_NAMES;

export async function generateBlogPostDraft(title: string, lang: AiLang = "ru"): Promise<AiResponse> {
  const prompt = `Напиши черновик статьи для блога бюро переводов Lingua Translation (Наманган и Ташкент, Узбекистан).
Заголовок: "${title}"
Язык статьи: ${LANGUAGE_NAMES[lang]}.
Требования: 400-600 слов, полезно для читателя, структурировано (абзацы, при необходимости списки). Без фейков и мусора, без выдуманных цен и сроков.
Выведи только текст статьи, без заголовка и пояснений.`;
  return callAI(prompt, 3000);
}

export interface BlogTranslation {
  title: string;
  description: string;
  content: string;
}

/** Translates a blog post into another site language. Returns structured fields, never throws. */
export async function translateBlogPost(
  input: { title: string; description?: string; content: string },
  target: Exclude<AiLang, "ru">
): Promise<{ translation?: BlogTranslation; error?: string }> {
  const prompt = `Переведи статью блога бюро переводов Lingua Translation с русского на ${LANGUAGE_NAMES[target]} язык.
Сохрани смысл, структуру абзацев и списков. Названия компании, имена и номера не меняй. Ничего не добавляй от себя.
Ответь ТОЛЬКО валидным JSON без пояснений и без markdown-обёртки, формат:
{"title": "...", "description": "...", "content": "..."}

ИСХОДНАЯ СТАТЬЯ
title: ${JSON.stringify(input.title)}
description: ${JSON.stringify(input.description ?? "")}
content: ${JSON.stringify(input.content)}`;

  const res = await callAI(prompt, 6000);
  if (res.error) return { error: res.error };

  const parsed = parseJsonObject(res.content);
  if (!parsed || typeof parsed.title !== "string" || typeof parsed.content !== "string") {
    return { error: "ИИ вернул ответ в неожиданном формате. Попробуйте ещё раз." };
  }
  return {
    translation: {
      title: parsed.title.trim(),
      description: typeof parsed.description === "string" ? parsed.description.trim() : "",
      content: parsed.content.trim(),
    },
  };
}

/** Extracts the first JSON object from a model answer (tolerates ```json fences and extra prose). */
export function parseJsonObject(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const value = JSON.parse(cleaned.slice(start, end + 1));
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

export async function generateWeeklyContentPlan(): Promise<AiResponse> {
  const prompt = `Создай контент-план на неделю для бюро переводов Lingua Translation.
Включи: 2 Google Business поста, 1 идею для статьи блога, 1 идею для Instagram.
Формат: структурированный список. Язык: русский.`;
  return callAI(prompt);
}
