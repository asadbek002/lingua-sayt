const AI_ENABLED = process.env.AI_ENABLED === "true";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

interface AiResponse {
  content: string;
  error?: string;
}

async function callAI(prompt: string): Promise<AiResponse> {
  if (!AI_ENABLED || !AI_API_KEY) {
    return { content: "", error: "AI service is not enabled or configured" };
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      return { content: "", error: "AI API error" };
    }

    const data = await res.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  } catch (err) {
    console.error("[AiContentService] error:", err);
    return { content: "", error: "AI service unavailable" };
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

export async function generateBlogPostDraft(title: string): Promise<AiResponse> {
  const prompt = `Напиши черновик статьи для блога бюро переводов Lingua Translation.
Заголовок: "${title}"
Требования: 400-600 слов, полезно для читателя, структурировано. Без фейков и мусора.`;
  return callAI(prompt);
}

export async function generateWeeklyContentPlan(): Promise<AiResponse> {
  const prompt = `Создай контент-план на неделю для бюро переводов Lingua Translation.
Включи: 2 Google Business поста, 1 идею для статьи блога, 1 идею для Instagram.
Формат: структурированный список. Язык: русский.`;
  return callAI(prompt);
}
