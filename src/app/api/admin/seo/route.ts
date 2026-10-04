import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { prisma } from "@/lib/prisma";
import {
  generateSeoTitle,
  generateSeoDescription,
  generateFaq,
  generateGoogleBusinessPost,
  generateBlogPostDraft,
  translateBlogPost,
  type AiLang,
} from "@/lib/services/aiContentService";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const tasks = await prisma.seoTask.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("[API/admin/seo] GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const { action, service, city, topic, lang } = body;

  try {
    if (action === "generate-title") {
      const result = await generateSeoTitle(service, city);
      return NextResponse.json(result);
    }

    if (action === "generate-description") {
      const result = await generateSeoDescription(service, city);
      return NextResponse.json(result);
    }

    if (action === "generate-faq") {
      const result = await generateFaq(topic || service);
      return NextResponse.json(result);
    }

    if (action === "generate-blog-draft") {
      const language: AiLang = lang === "uz" || lang === "en" ? lang : "ru";
      const result = await generateBlogPostDraft(topic || service, language);
      return NextResponse.json(result);
    }

    if (action === "translate-blog") {
      const { title, description, content } = body;
      if (!title || !content || (lang !== "uz" && lang !== "en")) {
        return NextResponse.json({ error: "Нужны заголовок, текст и язык (uz или en)" }, { status: 400 });
      }
      return NextResponse.json(await translateBlogPost({ title, description, content }, lang));
    }

    if (action === "generate-post") {
      const result = await generateGoogleBusinessPost(topic, city);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[API/admin/seo] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
