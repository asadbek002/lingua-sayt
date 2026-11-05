// Notifies IndexNow search engines (Yandex, Bing, Seznam, Naver) about site URLs.
// Run from the site folder after a deploy:  node scripts/indexnow.mjs            (dry run, prints the URLs)
//                                          node scripts/indexnow.mjs --apply    (sends them)
// On the home server the public address is not reachable from the server itself, so read the sitemap locally:
//   SITEMAP_URL=http://127.0.0.1:3001/sitemap.xml node scripts/indexnow.mjs
// (the URLs inside the sitemap still point to the public site, which is what IndexNow needs).
// The key is public by design: the same value lives in public/<key>.txt and is served from the site root.
import { readdirSync, readFileSync } from "node:fs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";
const host = new URL(SITE).host;
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (public/<32 hex>.txt) found");
const key = keyFile.replace(".txt", "");
if (readFileSync(`public/${keyFile}`, "utf8").trim() !== key) throw new Error("Key file content does not match its name");

const SITEMAP = process.env.SITEMAP_URL || `${SITE}/sitemap.xml`;
const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === host);
console.log(`${urls.length} URLs from ${SITEMAP}`);
if (!process.argv.includes("--apply")) {
  console.log(urls.join("\n"));
  console.log("\nDry run. Add --apply to submit.");
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${SITE}/${keyFile}`, urlList: urls }),
});
console.log(`IndexNow responded ${res.status} (200/202 = accepted)`);
