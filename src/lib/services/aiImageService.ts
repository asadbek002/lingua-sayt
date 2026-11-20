// Modern AI photos for Telegram channel posts (Gemini "Nano Banana" image models).
// The model draws a text-free photo; our logo, headline and domain are composited on top with sharp,
// so the lettering is always correct. Any failure returns an error and the caller falls back to the plain card.
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { callAI } from "./aiContentService";

const MODEL = process.env.IMAGE_MODEL || "gemini-nano-banana-2.1";
const API_KEY = () => process.env.GEMINI_API_KEY || process.env.IMAGE_API_KEY || "";
const DIR = path.join(process.cwd(), "uploads", "agent");
const W = 1200;
const H = 900;
const FONT = "DejaVu Sans, Arial, Helvetica, sans-serif";

export const isAiImageConfigured = () => !!API_KEY();
export const aiImagePath = (id: string) => path.join(DIR, `${id.replace(/[^a-z0-9_-]/gi, "")}.jpg`);

/** Turns a post topic into a photo prompt: modern, on-brand, no lettering, no identifiable documents or faces. */
async function photoPrompt(topic: string): Promise<string> {
  const res = await callAI(
    `Write one English prompt (60–90 words) for an AI image model. The image illustrates a Telegram post of a translation agency in Uzbekistan about: "${topic}".
Style: modern, premium, photorealistic editorial photo, soft natural light, shallow depth of field, clean composition, subtle red and deep navy accents.
Scene ideas: a bright modern office desk, documents with a red wax seal or ribbon, a passport, a fountain pen, a globe, a laptop, hands of a professional at work (no faces), Tashkent or Namangan cityscape through a window.
Strict rules: no text, letters, numbers or logos anywhere; documents must be blank or blurred (no readable personal data); no recognisable faces; leave calm empty space in the lower third.
Output only the prompt.`,
    400
  );
  const text = res.content.trim();
  return text && !res.error
    ? text
    : `Premium editorial photo of a modern office desk with blank documents tied with a red ribbon, a passport and a fountain pen, soft daylight, shallow depth of field, deep navy and red accents, no text, no logos, no faces, calm empty space in the lower third.`;
}

async function generatePhoto(prompt: string): Promise<Buffer | { error: string }> {
  const key = API_KEY();
  if (!key) return { error: "GEMINI_API_KEY не задан" };
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
      signal: AbortSignal.timeout(120_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: `Gemini ${res.status}: ${data?.error?.message ?? "error"}` };
    const parts: { inlineData?: { data?: string }; inline_data?: { data?: string } }[] =
      data?.candidates?.[0]?.content?.parts ?? [];
    const b64 = parts.map((p) => p.inlineData?.data ?? p.inline_data?.data).find(Boolean);
    return b64 ? Buffer.from(b64, "base64") : { error: "Gemini не вернул изображение" };
  } catch (err) {
    return { error: `Gemini недоступен: ${err instanceof Error ? err.message : String(err)}` };
  }
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word;
    else if ((line + " " + word).length <= maxChars) line += " " + word;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines;
}

/** Photo + dark gradient + logo badge + headline + domain. */
async function compose(photo: Buffer, title: string): Promise<Buffer> {
  const size = title.length > 70 ? 50 : 58;
  const lines = wrap(title, Math.floor(1080 / (size * 0.66)), 3);
  const lh = Math.round(size * 1.18);
  const baseY = H - 110 - (lines.length - 1) * lh;
  const overlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
<stop offset="0.35" stop-color="#0f1424" stop-opacity="0"/><stop offset="0.72" stop-color="#0f1424" stop-opacity="0.78"/><stop offset="1" stop-color="#0f1424" stop-opacity="0.95"/>
</linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#fade)"/>
<rect x="60" y="${baseY - size - 34}" width="90" height="8" rx="4" fill="#c41e3a"/>
${lines.map((l, i) => `<text x="60" y="${baseY + i * lh}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join("\n")}
<text x="60" y="${H - 48}" font-family="${FONT}" font-size="28" font-weight="700" fill="#f87171">linguatranslation.uz</text>
</svg>`;
  const logo = await sharp(path.join(process.cwd(), "public", "images", "logo.png"))
    .resize(150, 150, { fit: "contain", background: "#ffffff" })
    .toBuffer();
  const badge = await sharp({ create: { width: 170, height: 170, channels: 4, background: "#ffffff" } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
  return sharp(photo)
    .resize(W, H, { fit: "cover", position: "attention" })
    .composite([{ input: Buffer.from(overlay) }, { input: badge, left: 50, top: 50 }])
    .jpeg({ quality: 88 })
    .toBuffer();
}

/** Generates and stores the photo for a draft. Returns null on success or the reason it failed. */
export async function createAiPhotoForDraft(id: string, topic: string, title: string): Promise<string | null> {
  const photo = await generatePhoto(await photoPrompt(topic));
  if (!Buffer.isBuffer(photo)) {
    console.error(`[AiImage] ${id}: ${photo.error}`);
    return photo.error;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(aiImagePath(id), await compose(photo, title));
  return null;
}

export async function readAiPhoto(id: string): Promise<Buffer | null> {
  return fs.readFile(aiImagePath(id)).catch(() => null);
}
