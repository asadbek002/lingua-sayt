import { prisma } from "@/lib/prisma";

const SEO_AUTO_GENERATE = process.env.SEO_AUTO_GENERATE === "true";
const SEO_AUTO_PUBLISH = process.env.SEO_AUTO_PUBLISH === "true";
const SEO_WEEKLY_POSTS = process.env.SEO_WEEKLY_POSTS === "true";

export async function createSeoTask(
  type: string,
  title: string,
  description?: string,
  targetUrl?: string
) {
  return prisma.seoTask.create({
    data: { type, title, description, targetUrl },
  });
}

export async function suggestWeeklyPost(): Promise<void> {
  if (!SEO_AUTO_GENERATE || !SEO_WEEKLY_POSTS) return;

  const topics = [
    "Нотариальный перевод документов",
    "Апостиль для документов",
    "Перевод диплома",
    "Перевод свидетельства о рождении",
    "Медицинские переводы",
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];

  await createSeoTask(
    "GOOGLE_BUSINESS_POST",
    `Пост для Google Business: ${topic}`,
    `Рекомендуется создать пост на тему "${topic}" для Google Business Profile`,
    "/admin/google-business"
  );
}

export async function suggestWeeklyArticle(): Promise<void> {
  if (!SEO_AUTO_GENERATE) return;

  const articles = [
    "Как сделать нотариальный перевод в Узбекистане",
    "Что такое апостиль и для чего он нужен",
    "Какие документы нужны для учёбы за границей",
    "Как перевести диплом для подачи в университет",
    "Перевод свидетельства о рождении: полное руководство",
  ];

  const title = articles[Math.floor(Math.random() * articles.length)];

  await createSeoTask(
    "BLOG_ARTICLE",
    `Статья: ${title}`,
    `Рекомендуется написать статью на тему "${title}"`,
    "/admin/blog"
  );
}

export async function checkStalePages(): Promise<void> {
  if (!SEO_AUTO_GENERATE) return;

  await createSeoTask(
    "SEO_UPDATE",
    "Проверка SEO-страниц",
    "Некоторые SEO-страницы не обновлялись более 30 дней. Рекомендуется обновить контент.",
    "/admin/seo"
  );
}

export { SEO_AUTO_PUBLISH };
