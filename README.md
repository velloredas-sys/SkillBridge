# SkillBridge

Campus-to-career portal for SIH 2026 problem **SIH26044** (skill mapping, internships, placement). Students assess skills, follow sequenced free YouTube roadmaps, and match demo internships. Recruiters post roles. Colleges see cohort gaps.

## Tech stack

| Layer | What |
|---|---|
| App | React 19, TanStack Start (SSR), TanStack Router/Query |
| UI | Tailwind CSS v4, Radix, Lucide |
| Auth | Better Auth — Google (via Grok auth broker in this preview) + email/password |
| Database | PostgreSQL (Neon on Vercel). Sandbox preview uses embedded PGLite |
| AI plan | Groq `openai/gpt-oss-120b` when `GROQ_API_KEY` is set; otherwise a local 8-week plan from skill gaps |

## What is real vs demo

- **Real (tied to the signed-in account):** profile, role, skill ratings, quiz results, lesson progress, portfolio, applications, recruiter-posted jobs.
- **Demo:** the seeded Razorpay / Google / Zoho / … board. Those rows are labelled **Demo posting**. Applying does **not** email a recruiter; it still stores the application on the student account.

## Persistence

On a real deploy with `DATABASE_URL` (Neon/Postgres):

- Profile, skills, portfolio, and applications live in Postgres keyed by `user_id`.
- Same Google or email login on another device or months later loads the same rows.
- Sandbox live preview uses a local database that **resets when the preview sleeps**. That is preview-only.

## Run locally

```bash
npm install
npm run dev
```

Sign-in is on. Email/password works without extra env. Google in this Grok-built preview goes through xAI's shared OAuth broker (the consent screen says “xAI”). To brand Google as **SkillBridge** you must register your own OAuth client in Google Cloud Console and deploy with those credentials — that cannot be done from the Grok sandbox.

## Groq (8-week plan)

1. Create a key at [console.groq.com](https://console.groq.com).
2. Set the **server** environment variable **`GROQ_API_KEY`**.
   - Vercel: Project → Settings → Environment Variables → `GROQ_API_KEY` → Production (and Preview).
   - Do not paste the key into chat or into client code.
3. Redeploy. Generate plan uses Groq; if the key is missing or the API fails, the app still returns a useful gap-based 8-week plan (no raw error codes).

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel (`npm run build`, output is Nitro/Vercel).
3. Add env:
   - `DATABASE_URL` — Neon (or any Postgres) connection string
   - `GROQ_API_KEY` — optional, for AI-written plans
   - Auth vars if you are not using the Grok deployer (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and broker/Google credentials)
4. Run SQL in `migrations/` against that database (`0001_auth.sql`, `0002_skillbridge.sql`).

Teammates and judges should use the **Vercel URL**, not the Grok sandbox preview (that preview is account-locked and expires).
