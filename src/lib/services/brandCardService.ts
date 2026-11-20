// Branded images for agent posts and blog covers: logo, brand colours, the post title and a subtitle.
// Rendered with sharp from SVG, so text is always correct (Cyrillic and Uzbek Latin included) and costs nothing.
import path from "path";
import sharp from "sharp";

export type CardFormat = "post" | "og"; // post: 1200x900 (Google Business, Telegram), og: 1200x630 (blog cover, link preview)

const NAVY = "#1a1a2e";
const NAVY2 = "#16213e";
const RED = "#c41e3a";
const FONT = "DejaVu Sans, Arial, Helvetica, sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Greedy word wrap by an approximate character width. */
function wrap(text: string, maxChars: number): string[] {
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
  return lines;
}

/** Largest font size (in steps) whose wrapped title fits into maxLines. */
function fit(title: string, widthPx: number, maxLines: number, sizes: number[]) {
  for (const size of sizes) {
    const lines = wrap(title, Math.floor(widthPx / (size * 0.66)));
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  const lines = wrap(title, Math.floor(widthPx / (size * 0.66))).slice(0, maxLines);
  lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  return { size, lines };
}

let logoCache: Buffer | null = null;
async function logoTile(px: number): Promise<Buffer> {
  logoCache ??= await sharp(path.join(process.cwd(), "public", "images", "logo.png")).toBuffer();
  const logo = await sharp(logoCache).resize(Math.round(px * 0.88), Math.round(px * 0.88), { fit: "contain", background: "#ffffff" }).toBuffer();
  return sharp({ create: { width: px, height: px, channels: 4, background: "#ffffff" } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

export async function renderBrandCard(title: string, subtitle: string, format: CardFormat): Promise<Buffer> {
  const W = 1200;
  const H = format === "og" ? 630 : 900;
  const domain = "linguatranslation.uz";
  let svg: string;
  let tile: Buffer;
  let tileLeft: number;
  let tileTop: number;

  if (format === "og") {
    const { size, lines } = fit(title, 660, 4, [60, 54, 48, 42, 38]);
    const lh = Math.round(size * 1.18);
    const top = Math.max(110, Math.round((H - 14 - lines.length * lh - 90) / 2) + size);
    svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect y="${H - 14}" width="${W}" height="14" fill="${RED}"/>
${lines.map((l, i) => `<text x="470" y="${top + i * lh}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join("\n")}
<text x="470" y="${top + lines.length * lh + 24}" font-family="${FONT}" font-size="30" fill="#9ca3af">${esc(subtitle)}</text>
<text x="470" y="${H - 50}" font-family="${FONT}" font-size="28" font-weight="700" fill="#f87171">${domain}</text>
</svg>`;
    tile = await logoTile(340);
    tileLeft = 70;
    tileTop = Math.round((H - 340) / 2);
  } else {
    const { size, lines } = fit(title, 1040, 4, [66, 58, 52, 46, 40]);
    const lh = Math.round(size * 1.2);
    const top = 430 + size;
    svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
${lines.map((l, i) => `<text x="${W / 2}" y="${top + i * lh}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join("\n")}
<text x="${W / 2}" y="${top + lines.length * lh + 20}" text-anchor="middle" font-family="${FONT}" font-size="32" fill="#9ca3af">${esc(subtitle)}</text>
<rect y="${H - 90}" width="${W}" height="90" fill="${RED}"/>
<text x="${W / 2}" y="${H - 33}" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">${domain}</text>
</svg>`;
    tile = await logoTile(300);
    tileLeft = (W - 300) / 2;
    tileTop = 70;
  }

  return sharp(Buffer.from(svg))
    .composite([{ input: tile, left: tileLeft, top: tileTop }])
    .jpeg({ quality: 88 })
    .toBuffer();
}
