import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse, after } from "next/server";
import { isAdmin } from "@/lib/serverAuth";
import { runBlogAgent, runGbpAgent } from "@/lib/services/contentAgentService";

// Entry point for the server cron (header x-agent-secret = AGENT_CRON_SECRET) or an admin.
// The agent runs after the response: AI writing and translation take a few minutes.
function cronAllowed(req: NextRequest): boolean {
  const secret = process.env.AGENT_CRON_SECRET || "";
  const given = req.headers.get("x-agent-secret") || "";
  if (!secret || given.length !== secret.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(secret));
}

export async function POST(req: NextRequest) {
  if (!cronAllowed(req) && !isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const job = new URL(req.url).searchParams.get("job");
  const run = job === "blog" ? runBlogAgent : job === "gbp" ? runGbpAgent : null;
  if (!run) return NextResponse.json({ error: "job must be blog or gbp" }, { status: 400 });

  after(async () => {
    try {
      console.log(`[ContentAgent] ${job}: ${await run()}`);
    } catch (err) {
      console.error(`[ContentAgent] ${job} failed:`, err);
    }
  });
  return NextResponse.json({ started: job }, { status: 202 });
}
