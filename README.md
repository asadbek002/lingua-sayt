# Lingua Translation

Next.js 16 site for a translation bureau (Namangan / Tashkent) with a lead form and an admin panel.

## Setup

```bash
cp .env.example .env      # fill DATABASE_URL and ADMIN_PASSWORD at minimum
npm install               # also runs `prisma generate`
npx prisma migrate deploy # create tables
npm run dev
```

## Admin panel

`/admin` — log in with `ADMIN_PASSWORD`. Sections: applications (filters, search, pagination, file viewer),
blog, SEO/AI tools, Google Business.

If login says "ADMIN_PASSWORD is not set", add the variable to your hosting environment and redeploy.
If the applications page shows a database error, check `DATABASE_URL` and run `npx prisma migrate deploy`.

## Notes

- Uploaded files are stored on local disk (`uploads/`). On serverless / ephemeral hosting switch
  `storageService` to S3/R2 — files are lost on redeploy otherwise.
- The in-memory rate limiter is per-process.

## Content agent

The agent drafts content; nothing is published without approval in the admin panel.

- **Blog** (`job=blog`): picks the next topic from `src/data/agentTopics.ts` that is not in the blog yet, writes the article in Russian from a fixed fact sheet (prices, terms, official apostille rules), translates it to Uzbek and English and saves it as a **draft** in `/admin/blog`.
- **Google Business** (`job=gbp`): drafts one post per office, rotating through `GBP_TOPICS`; approve on `/admin/agent`.
- **Telegram channel**: when a blog post is published for the first time, an announcement (uz + ru) is drafted on `/admin/agent`.
- **Instagram reels** (`job=reel`): a weekly ready-to-shoot script (hook, presenter text uz + ru, captions, post description) to produce in an AI-video tool.
- **Images**: Google Business posts and channel announcements get a branded card (`/api/agent/card/task/<id>.jpg`); blog posts get a cover and link preview (`/api/agent/card/post/<slug>.jpg`). Rendered with sharp: the server needs a font with Cyrillic, e.g. `apt install fonts-dejavu-core`.
- Every new draft is announced in the staff chat (`TELEGRAM_ADMIN_CHAT_IDS`).

Environment (`.env`):

```
AGENT_CRON_SECRET=<long random string>   # sent by the cron as the x-agent-secret header
TELEGRAM_CHANNEL_ID=@your_channel        # the bot must be an admin of the channel; leave empty to disable announcements
```

Schedule (server crontab, `Asia/Tashkent`): 2 articles and 3 rounds of Google Business posts a week.

```
0 10 * * 2,5   curl -s -X POST -H "x-agent-secret: $AGENT_CRON_SECRET" "http://127.0.0.1:3001/api/agent/run?job=blog"
0 11 * * 1,3,6 curl -s -X POST -H "x-agent-secret: $AGENT_CRON_SECRET" "http://127.0.0.1:3001/api/agent/run?job=gbp"
0 10 * * 4     curl -s -X POST -H "x-agent-secret: $AGENT_CRON_SECRET" "http://127.0.0.1:3001/api/agent/run?job=reel"
```
