import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { prisma } from "@/lib/prisma";
import { AGENT_TYPES, publishAgentDraft, rejectAgentDraft, regenerateDraftPhoto } from "@/lib/services/contentAgentService";

const TYPES = [AGENT_TYPES.gbp, AGENT_TYPES.channel, AGENT_TYPES.reel];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const [pending, recent, blogDrafts] = await Promise.all([
    prisma.seoTask.findMany({ where: { type: { in: TYPES }, status: "PENDING" }, orderBy: { createdAt: "desc" } }),
    prisma.seoTask.findMany({
      where: { type: { in: TYPES }, status: { in: ["PUBLISHED", "REJECTED"] } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.blogPost.findMany({
      where: { status: "draft" },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, createdAt: true, translations: { select: { locale: true } } },
      take: 20,
    }),
  ]);
  return NextResponse.json({ pending, recent, blogDrafts, channelConfigured: !!process.env.TELEGRAM_CHANNEL_ID });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { action, id, text } = await req.json();
  if (action === "publish") {
    const result = await publishAgentDraft(String(id), String(text ?? ""));
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }
  if (action === "regenerate-photo") {
    const result = await regenerateDraftPhoto(String(id));
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }
  if (action === "reject") {
    await rejectAgentDraft(String(id));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
