<div align="center">

# 🌉 SkillBridge

**Campus-to-career portal for SIH 2026 — Problem Statement SIH26044**
*Skill mapping · Internships · Placement*

[![Status](https://img.shields.io/badge/status-active-2ea44f)](#)
[![Stack](https://img.shields.io/badge/stack-React%2019%20%C2%B7%20TanStack%20Start-3178c6)](#tech-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL%20(Neon)-336791)](#persistence)
[![License](https://img.shields.io/badge/license-hackathon%20project-lightgrey)](#)

</div>

<br>

Students assess their skills, follow sequenced free YouTube roadmaps, and match with internships and jobs. Recruiters post roles and review applicants. Colleges see cohort-level skill gaps against industry demand.

<div align="center">
<img src="./screenshots/jobs.png" alt="Opportunities board" width="85%">

<sub>The opportunities board — internships and jobs scored against a student's skills</sub>
</div>

<br>

## 📖 Contents

- [Features](#-features)
- [Tech stack](#-tech-stack)
- [What is real vs. demo](#-what-is-real-vs-demo)
- [Persistence](#-persistence)
- [Run locally](#-run-locally)
- [Scripts](#-scripts)
- [AI-generated 8-week plan](#-ai-generated-8-week-plan-groq)
- [Deploy on Vercel](#-deploy-on-vercel)
- [Team](#-team--aryabhatta-0)

<br>

## ✨ Features

There are three account roles — **student**, **industry** (recruiter), and **college** — each with a different view of the same data.

| Route | For | What it does |
|:---|:---|:---|
| `/assess` | Student | Short multiple-choice quizzes per skill; an assessed level replaces self-rated level in match scores |
| `/learn` | Student | Searchable catalog of sequenced, free YouTube roadmaps by skill |
| `/opportunities` | Student | Internship/job board, filterable by type, scored against the student's skills |
| `/portfolio` | Student | Add projects, certifications, and achievements, tagged to skills |
| `/applications` | Student | Track status of applications submitted from the opportunities board |
| `/dashboard` | Student | Skill match ring, gap analysis vs. a chosen career goal, recommended next lessons |
| `/recruit` | Industry | Post internships/jobs, review applicants, update application status |
| `/analytics` | College | Cohort skill averages vs. national/industry demand, aggregate demand gaps |

<details>
<summary><b>📸 Screenshots</b> — click to expand</summary>
<br>

| Login | Learn catalog | Job detail |
|:---:|:---:|:---:|
| ![Login](./screenshots/login.png) | ![Learn](./screenshots/learn.png) | ![Job detail](./screenshots/job-detail.png) |

More in [`/screenshots`](./screenshots).

</details>

<br>

## 🛠️ Tech stack

| Layer | What |
|:---|:---|
| App | React 19, TanStack Start (SSR), TanStack Router/Query |
| UI | Tailwind CSS v4, Radix, Lucide, shadcn-style components |
| Forms/validation | React Hook Form, Zod |
| Data layer | Kysely (query builder) over PostgreSQL (`pg`) |
| Auth | Better Auth — Google + email/password |
| Database | PostgreSQL (Neon on Vercel). Sandbox preview uses embedded PGLite |
| Charts | Recharts (cohort analytics) |
| AI plan | Groq `openai/gpt-oss-120b` when `GROQ_API_KEY` is set; otherwise a local 8-week plan generated from skill gaps |

<br>

## 🎭 What is real vs. demo

| | Behavior |
|:---|:---|
| ✅ **Real** *(tied to the signed-in account)* | Profile, role, skill ratings, quiz results, lesson progress, portfolio, applications, recruiter-posted jobs |
| 🎪 **Demo** | The seeded Razorpay / Google / Zoho / … job board. Rows are labelled **Demo posting**. Applying does **not** email a recruiter — it still stores the application on the student account |

<br>

## 💾 Persistence

**On a real deploy** *(with `DATABASE_URL` set to Neon/Postgres)*
- Profile, skills, portfolio, and applications live in Postgres, keyed by `user_id` (see [`migrations/0002_skillbridge.sql`](./migrations/0002_skillbridge.sql) for the schema: `profiles`, `student_skills`, `assessments`, `portfolio_items`, and related tables).
- Signing in again with the same Google or email account — on another device, months later — loads the same rows.

**Sandbox live preview**
- Uses a local database that **resets when the preview sleeps**. This is preview-only behavior and does not apply to a real deploy.

<br>

## 🚀 Run locally

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:8080`.

- Email/password sign-in works with no extra setup.
- Google sign-in in the local sandbox goes through a shared OAuth broker, so the consent screen may not show the "SkillBridge" brand. To brand Google sign-in as **SkillBridge**, register your own OAuth client in Google Cloud Console and deploy with those credentials.

<br>

## 📜 Scripts

| Command | Purpose |
|:---|:---|
| `npm run dev` | Start the dev server (port 8080) |
| `npm run build` | Production build, then runs DB migrations |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, write mode |
| `npm test` | Node test runner over `scripts/**/*.test.mjs` plus the app-data and auth unit tests |
| `npm run db:migrate` | Apply SQL migrations in `migrations/` |
| `npm run check:auth` | Verifies the auth invariant script (`scripts/check-auth-invariant.mjs`) |

<br>

## 🤖 AI-generated 8-week plan (Groq)

1. Create an API key at [console.groq.com](https://console.groq.com).
2. Set the **server-side** environment variable `GROQ_API_KEY`:
   - Vercel: **Project → Settings → Environment Variables → `GROQ_API_KEY`** → apply to Production (and Preview).
   - Never paste the key into chat or client-side code.
3. Redeploy.

> If the key is missing or the Groq API call fails, the app falls back to a useful gap-based 8-week plan generated locally — no raw error codes are shown to the user.

<br>

## ☁️ Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel (build command `npm run build`; output targets Nitro/Vercel).
3. Add environment variables:

   | Variable | Required | Purpose |
   |:---|:---|:---|
   | `DATABASE_URL` | Yes | Neon (or any Postgres) connection string |
   | `GROQ_API_KEY` | No | Enables AI-written 8-week plans |
   | `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, Google OAuth credentials | For Google sign-in | Auth configuration |

4. Run the SQL migrations in `migrations/` against that database, in order: `0001_auth.sql`, then `0002_skillbridge.sql` *(this also runs automatically as part of `npm run build`)*.

> **Note for teammates and judges:** use the **Vercel URL** to evaluate the app, not any local sandbox preview — a local preview is machine-locked and can expire or reset.

<br>

## 👥 Team — AryaBhatta-0

<div align="center">

Built for our first hackathon by a four-person team, all first-year CSE students.

| Member | Role |
|:---:|:---:|
| **Soumyadip** | Full-stack developer — built SkillBridge (this app) |
| **Bidhan** | Full-stack developer — also built his own app for this hackathon |
| **Samrat** | Presentation |
| **Komal** | Presentation |

</div>

Soumyadip and Bidhan handled development together; Samrat and Komal put together a strong presentation of the product.

It's 2026, so development leaned on AI assistance — but not "vibe coding." We planned the feature set ourselves, made our own architecture and product decisions, and did the actual debugging by hand: writing test cases, stress-testing flows (auth, skill matching, applications), and fixing what broke. AI helped us move faster and learn faster, not replace the thinking.

As first-years going into our first hackathon, the biggest win wasn't just the app — it was learning to plan together, split work by strength, and iterate as a team. We came out of it with a working product and a lot more confidence for the next one.

<br>

<div align="center">
<sub>Made with ☕ and a lot of stress-testing by Team AryaBhatta-0</sub>
</div>
