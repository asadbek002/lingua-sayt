import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderBrandCard } from "@/lib/services/brandCardService";
import { readAiPhoto } from "@/lib/services/aiImageService";
import { getPublishedPost } from "@/lib/services/blogService";
import { pickContent } from "@/lib/blogLocale";
import { company } from "@/data/company";
import { decodeSlug } from "@/lib/utils/slug";

// Images for agent drafts (task/<id>.jpg) and blog covers (post/<slug>.jpg?lang=uz).
// Only titles already stored in the database are drawn, so the endpoint cannot be used to render arbitrary text.
const TYPES = ["AGENT_GBP", "AGENT_TG", "AGENT_REEL"];
const SUBTITLE_BY_OFFICE: Record<string, string> = {
  namangan: `Наманган · ${company.offices[0]?.street ?? ""}`,
  tashkent: `Ташкент · ${company.offices[1]?.street ?? ""}`,
};

function image(buf: Buffer, maxAge = 86400) {
  return new NextResponse(new Uint8Array(buf), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": `public, max-age=${maxAge}` },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id: raw } = await params;
  const id = decodeSlug(raw).replace(/\.jpe?g$/i, "");

  if (kind === "task") {
    const task = await prisma.seoTask.findUnique({ where: { id } }).catch(() => null);
    if (!task || !TYPES.includes(task.type)) return new NextResponse("Not found", { status: 404 });
    // Draft images can be regenerated, so they are cached only briefly
    const photo = task.type === "AGENT_TG" ? await readAiPhoto(task.id) : null;
    if (photo) return image(photo, 60);
    const title = task.title.replace(/^Анонс:\s*/, "").replace(/\s+—\s+(Наманган|Ташкент)$/, "");
    const subtitle = SUBTITLE_BY_OFFICE[task.targetUrl ?? ""] ?? "Наманган · Ташкент · онлайн";
    return image(await renderBrandCard(title, subtitle, task.type === "AGENT_GBP" ? "post" : "og"), 60);
  }

  if (kind === "post") {
    const post = await getPublishedPost(id);
    if (!post) return new NextResponse("Not found", { status: 404 });
    const lang = new URL(req.url).searchParams.get("lang");
    const c = pickContent(post, lang === "uz" || lang === "en" ? lang : "ru");
    const subtitle = lang === "uz" ? "Lingua Translation · blog" : lang === "en" ? "Lingua Translation · blog" : "Lingua Translation · блог";
    return image(await renderBrandCard(c.title, subtitle, "og"));
  }

  return new NextResponse("Not found", { status: 404 });
}
