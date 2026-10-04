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
