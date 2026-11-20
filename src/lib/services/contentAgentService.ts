// Content agent: drafts blog articles (ru/uz/en), Google Business posts and Telegram channel announcements.
// Nothing is published without a person: blog articles become drafts in the blog editor, posts become
// SeoTask rows (type AGENT_*) that are approved on /admin/agent. Every new draft is announced in the staff chat.
import { prisma } from "@/lib/prisma";
import { callAI, parseJsonObject, translateBlogPost } from "./aiContentService";
import { createPost, locationIds } from "./googleBusinessService";
import { sendTelegramText, sendTelegramPhotoToChannel } from "./telegramService";
import { company } from "@/data/company";
import { serviceDefs } from "@/data/servicePages";
import { BLOG_TOPICS, GBP_TOPICS, REEL_TOPICS } from "@/data/agentTopics";
import { slugify } from "@/lib/utils/slug";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "";

export const AGENT_TYPES = { gbp: "AGENT_GBP", channel: "AGENT_TG", reel: "AGENT_REEL" } as const;

/** Public URL of the branded image for a draft (rendered by /api/agent/card). */
export const draftImageUrl = (id: string) => `${SITE_URL}/api/agent/card/task/${id}.jpg`;
export type Office = "namangan" | "tashkent";
const OFFICE_NAMES: Record<Office, string> = { namangan: "Наманган", tashkent: "Ташкент" };

/** The only facts the agent may state as numbers or rules. Everything else must be phrased without figures. */
function factSheet(): string {
  const offices = company.offices
    .map((o) => `- ${o.city}: ${o.street ?? ""}, тел. ${o.phone}, ${company.workingHours}, пн–сб`)
    .join("\n");
  const pages = serviceDefs.map((s) => `- ${s.copy.ru.label}: ${SITE_URL}/${s.slug}`).join("\n");
  return `БЮРО: Lingua Translation — бюро переводов, офисы в Намангане и Ташкенте, сайт ${SITE_URL}, Telegram ${company.socialLinks.telegram}.
ОФИСЫ:
${offices}
ЯЗЫКИ: русский, узбекский, английский, корейский, немецкий, китайский. Документы принимаем онлайн (фото через сайт или Telegram).
ПРОВЕРЕННЫЕ ЦЕНЫ И СРОКИ БЮРО:
- Апостиль: 3–5 рабочих дней, 220 000–270 000 сум, государственный сбор включён; нужны паспорт и сам документ; можно дистанционно.
- Перевод диплома/аттестата: 190 000–270 000 сум.
- Нотариальный перевод: обычно 1–2 рабочих дня, срочно — по договорённости.
- Перевод на английский: обычный от 60 000 сум (2–3 часа), нотариальный от 100 000 сум (1–2 рабочих дня).
ОФИЦИАЛЬНО ОБ АПОСТИЛЕ (gov.uz, advice.uz, ноябрь 2026): документы среднего специального, профессионального и высшего образования — Агентство по оценке знаний и квалификаций; школьные — Министерство дошкольного и школьного образования; ЗАГС — органы юстиции; прочие — МИД. Орган рассматривает заявление 2 рабочих дня (до 10 при доп. проверке). Сбор 20 % БРВ, через my.gov.uz — 90 % сбора. Апостиль не ставят на паспорт, ID-карту, военный билет.
СТРАНИЦЫ САЙТА (для ссылок):
${pages}
ПРАВИЛО: другие цены, сроки, законы и названия органов не выдумывай. Если факта нет в списке — пиши без цифр или «уточняйте у менеджера».`;
}

async function notifyStaff(text: string) {
  await sendTelegramText(text).catch(() => false);
}

// ---------- Blog ----------

async function nextBlogTopic(): Promise<string | null> {
  const posts = await prisma.blogPost.findMany({ select: { slug: true, title: true } });
  const usedSlugs = new Set(posts.map((p) => p.slug));
  const usedTitles = new Set(posts.map((p) => p.title.trim().toLowerCase()));
  return BLOG_TOPICS.find((t) => !usedSlugs.has(topicSlug(t)) && !usedTitles.has(t.trim().toLowerCase())) ?? null;
}

/** Topic → URL slug of at most ~60 characters, cut at a word boundary. */
function topicSlug(topic: string): string {
  const full = slugify(topic, 120);
  if (full.length <= 60) return full;
  const cut = full.slice(0, 61);
  return cut.slice(0, cut.lastIndexOf("-")) || full.slice(0, 60);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || `post-${Date.now()}`;
  for (let i = 2; await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } }); i++) slug = `${base}-${i}`;
  return slug;
}

/** Writes one article as a draft (ru + uz + en). Returns a short human-readable result. */
export async function runBlogAgent(): Promise<string> {
  const topic = await nextBlogTopic();
  if (!topic) {
    await notifyStaff("🤖 Агент: темы для статей закончились. Добавьте новые в src/data/agentTopics.ts.");
    return "no topics left";
  }

  const res = await callAI(
    `Ты автор блога бюро переводов. Напиши полезную статью на русском языке по теме: "${topic}".
Пиши для обычных людей в Узбекистане: конкретно, по шагам, без воды и без рекламных штампов. 600–900 слов, абзацы и списки.
В конце один короткий абзац о том, как с этим поможет Lingua Translation, со ссылкой на подходящую страницу сайта.
Используй только эти факты для цифр, сроков, цен и названий органов:
${factSheet()}

Ответь ТОЛЬКО валидным JSON без markdown-обёртки:
{"title": "заголовок статьи", "description": "мета-описание до 160 символов", "content": "текст статьи"}`,
    5000
  );
  if (res.error) return `AI error: ${res.error}`;
  const draft = parseJsonObject(res.content);
  if (!draft || typeof draft.title !== "string" || typeof draft.content !== "string") return "AI returned an unexpected format";

  const title = draft.title.trim();
  const description = typeof draft.description === "string" ? draft.description.trim() : "";
  const content = draft.content.trim();
  const slug = await uniqueSlug(topicSlug(topic));

  const post = await prisma.blogPost.create({
    data: { title, slug, description: description || null, content, status: "draft" },
  });

  const translated: string[] = [];
  for (const locale of ["uz", "en"] as const) {
    const t = await translateBlogPost({ title, description, content }, locale);
    if (t.translation) {
      await prisma.blogPostTranslation.create({
        data: { postId: post.id, locale, ...t.translation, description: t.translation.description || null },
      });
      translated.push(locale.toUpperCase());
    }
  }

  await notifyStaff(
    `🤖 Агент подготовил черновик статьи:\n«${title}»\nЯзыки: RU${translated.length ? ", " + translated.join(", ") : ""}\nПроверьте и опубликуйте: ${SITE_URL}/admin/blog`
  );
  return `draft "${title}" (${slug})`;
}

// ---------- Google Business ----------

/** Drafts one post for each office, rotating through GBP_TOPICS. */
export async function runGbpAgent(): Promise<string> {
  const done = await prisma.seoTask.count({ where: { type: AGENT_TYPES.gbp } });
  const offices = (["namangan", "tashkent"] as Office[]).filter((o) => locationIds[o]);
  if (offices.length === 0) return "no Google locations configured";

  const item = GBP_TOPICS[Math.floor(done / Math.max(offices.length, 1)) % GBP_TOPICS.length];
  const results: string[] = [];
  for (const office of offices) {
    const slug = item[office] ?? item.slug;
    const url = slug ? `${SITE_URL}/${slug}` : SITE_URL;
    const res = await callAI(
      `Напиши пост для Google Business Profile офиса Lingua Translation в городе ${OFFICE_NAMES[office]}.
Тема: ${item.topic}. Язык: русский. 300–700 символов, живо и конкретно, с призывом обратиться и ссылкой ${url} в конце.
Без хэштегов и эмодзи-спама (не больше двух эмодзи). Используй только эти факты:
${factSheet()}
Выведи только текст поста.`,
      800
    );
    if (res.error || !res.content.trim()) {
      results.push(`${office}: ${res.error ?? "empty"}`);
      continue;
    }
    await prisma.seoTask.create({
      data: {
        type: AGENT_TYPES.gbp,
        title: `${item.topic} — ${OFFICE_NAMES[office]}`,
        description: res.content.trim().slice(0, 1450),
        targetUrl: office,
      },
    });
    results.push(`${office}: draft`);
  }
  if (results.some((r) => r.endsWith("draft"))) {
    await notifyStaff(`🤖 Агент подготовил посты Google Business: «${item.topic}».\nПроверьте и опубликуйте: ${SITE_URL}/admin/agent`);
  }
  return results.join("; ");
}

// ---------- Telegram channel ----------

/** Called when a blog post is published: drafts a short channel announcement (uz + ru). */
export async function draftChannelAnnouncement(post: { title: string; slug: string; description?: string | null }) {
  if (!CHANNEL_ID) return;
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const res = await callAI(
    `Напиши короткий анонс статьи для Telegram-канала бюро переводов Lingua Translation.
Статья: "${post.title}". ${post.description ? `Кратко: ${post.description}` : ""}
Сначала 2–3 предложения на узбекском (латиница), затем те же 2–3 предложения на русском. В конце ссылка: ${url}
Без хэштегов, максимум два эмодзи. Выведи только текст анонса.`,
    600
  );
  if (res.error || !res.content.trim()) return;
  await prisma.seoTask.create({
    data: { type: AGENT_TYPES.channel, title: `Анонс: ${post.title}`, description: res.content.trim().slice(0, 3900), targetUrl: CHANNEL_ID },
  });
  await notifyStaff(`🤖 Агент подготовил анонс для Telegram-канала: «${post.title}».\nПроверьте и опубликуйте: ${SITE_URL}/admin/agent`);
}

// ---------- Instagram reel scripts ----------

/** Writes a ready-to-shoot script for a 20–30 second reel (uz + ru) for the staff to produce in their video tool. */
export async function runReelAgent(): Promise<string> {
  const done = await prisma.seoTask.count({ where: { type: AGENT_TYPES.reel } });
  const topic = REEL_TOPICS[done % REEL_TOPICS.length];
  const res = await callAI(
    `Ты SMM-специалист бюро переводов Lingua Translation (Instagram @lingua_translation1, аудитория — Узбекистан).
Напиши сценарий рилса на 20–30 секунд по теме: "${topic}".
Формат ответа (заголовки оставь как есть):
ХУК (первые 2 секунды, крупный текст на экране):
— uz: …
— ru: …
ТЕКСТ ВЕДУЩЕГО (uz, разговорно, 60–80 слов):
…
ТЕКСТ ВЕДУЩЕГО (ru, 60–80 слов):
…
ПОДПИСИ НА ЭКРАНЕ (3–4 коротких, по секундам):
…
ВИЗУАЛ (что показать в кадре: офис, документы без личных данных, логотип):
…
ОПИСАНИЕ К ПОСТУ (uz + ru, с призывом написать в Direct или Telegram, 3–5 хэштегов):
…
Пиши живо, без канцелярита. Цифры, цены и сроки — только из фактов ниже, ничего не выдумывай:
${factSheet()}`,
    2000
  );
  if (res.error || !res.content.trim()) return `AI error: ${res.error ?? "empty"}`;
  await prisma.seoTask.create({
    data: { type: AGENT_TYPES.reel, title: topic, description: res.content.trim().slice(0, 6000), targetUrl: "instagram" },
  });
  await notifyStaff(`🤖 Агент подготовил сценарий рилса: «${topic}».\nОткройте: ${SITE_URL}/admin/agent`);
  return `reel script "${topic}"`;
}

// ---------- Approval ----------

export async function publishAgentDraft(id: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const task = await prisma.seoTask.findUnique({ where: { id } });
  if (!task || task.status !== "PENDING") return { ok: false, error: "Черновик не найден или уже обработан" };
  const body = text.trim();
  if (!body) return { ok: false, error: "Пустой текст" };

  if (task.type === AGENT_TYPES.gbp) {
    const office = task.targetUrl === "tashkent" ? "tashkent" : "namangan";
    const r = await createPost(locationIds[office], body, draftImageUrl(id));
    if ("error" in r && r.error) return { ok: false, error: r.error };
  } else if (task.type === AGENT_TYPES.channel) {
    const ok = await sendTelegramPhotoToChannel(task.targetUrl || CHANNEL_ID, draftImageUrl(id), body);
    if (!ok) return { ok: false, error: "Telegram не принял сообщение (бот должен быть админом канала)" };
  } else if (task.type !== AGENT_TYPES.reel) {
    // A reel script is not posted anywhere by us: "publishing" just marks it as used
    return { ok: false, error: "Неизвестный тип черновика" };
  }

  await prisma.seoTask.update({ where: { id }, data: { status: "PUBLISHED", description: body } });
  return { ok: true };
}

export async function rejectAgentDraft(id: string) {
  await prisma.seoTask.updateMany({ where: { id, status: "PENDING" }, data: { status: "REJECTED" } });
}
