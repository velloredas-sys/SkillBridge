import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { QUESTIONS, scoreToLevel } from "@/lib/catalog/questions";
import { matchPercent } from "@/lib/catalog/match";
import { parseRequired } from "@/lib/catalog/match";
import { effectiveLevel } from "@/lib/catalog/roles";
import { buildLocalPlan } from "@/lib/catalog/plan";
import type { Me, SkillRow, UserRole } from "@/lib/types";
import {
  mapApplication,
  mapOpportunity,
  mapPortfolio,
  mapProfile,
  mapSkill,
} from "./mappers";

function levelsMap(skills: SkillRow[]) {
  const out: Record<string, { self: number; assessed: number | null }> = {};
  for (const s of skills) out[s.skillId] = { self: s.selfLevel, assessed: s.assessedLevel };
  return out;
}

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Me> => {
    const sql = await getSql();
    const uid = context.userId;
    const [profileRow] = await sql<Record<string, unknown>>`select * from profiles where user_id = ${uid}`;
    const skillRows = await sql<Record<string, unknown>>`select * from student_skills where user_id = ${uid}`;
    const progressRows = await sql<{ lesson_id: string }>`select lesson_id from lesson_progress where user_id = ${uid}`;
    const appRows = await sql<Record<string, unknown>>`select * from applications where user_id = ${uid} order by created_at desc`;
    const portRows = await sql<Record<string, unknown>>`select * from portfolio_items where user_id = ${uid} order by created_at desc`;
    const jobRows = await sql<Record<string, unknown>>`select * from opportunities where poster_user_id = ${uid} order by created_at desc`;
    return {
      profile: mapProfile(profileRow),
      skills: skillRows.map(mapSkill),
      progress: progressRows.map((r) => r.lesson_id),
      applications: appRows.map(mapApplication),
      portfolio: portRows.map(mapPortfolio),
      myJobs: jobRows.map(mapOpportunity),
    };
  });

export type SaveProfileInput = {
  role: UserRole;
  name: string;
  headline: string;
  bio: string;
  collegeName: string;
  companyName: string;
  location: string;
  yearLabel: string;
  careerGoal: string;
};

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: SaveProfileInput) => input)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (!name) throw new Error("Name is required");
    const role = data.role;
    if (role !== "student" && role !== "industry" && role !== "college") {
      throw new Error("Invalid role");
    }
    const sql = await getSql();
    await sql`
      insert into profiles (
        user_id, role, name, headline, bio, college_name, company_name,
        location, year_label, career_goal, updated_at
      ) values (
        ${context.userId}, ${role}, ${name}, ${data.headline.trim()}, ${data.bio.trim()},
        ${data.collegeName.trim()}, ${data.companyName.trim()}, ${data.location.trim()},
        ${data.yearLabel.trim()}, ${data.careerGoal.trim()}, now()
      )
      on conflict (user_id) do update set
        role = excluded.role,
        name = excluded.name,
        headline = excluded.headline,
        bio = excluded.bio,
        college_name = excluded.college_name,
        company_name = excluded.company_name,
        location = excluded.location,
        year_label = excluded.year_label,
        career_goal = excluded.career_goal,
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const setSelfSkill = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { skillId: string; level: number }) => input)
  .handler(async ({ context, data }) => {
    const level = Math.max(0, Math.min(5, Math.round(data.level)));
    const sql = await getSql();
    await sql`
      insert into student_skills (user_id, skill_id, self_level)
      values (${context.userId}, ${data.skillId}, ${level})
      on conflict (user_id, skill_id) do update set self_level = excluded.self_level
    `;
    return { ok: true as const };
  });

export const submitAssessment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { skillId: string; answers: Record<string, string> }) => input)
  .handler(async ({ context, data }) => {
    const questions = QUESTIONS[data.skillId];
    if (!questions) throw new Error("Unknown skill");
    let score = 0;
    for (const q of questions) {
      if (data.answers[q.id] === q.answer) score += 1;
    }
    const total = questions.length;
    const level = scoreToLevel(score, total);
    const sql = await getSql();
    await sql`
      insert into assessments (user_id, skill_id, score, total, level)
      values (${context.userId}, ${data.skillId}, ${score}, ${total}, ${level})
    `;
    await sql`
      insert into student_skills (user_id, skill_id, self_level, assessed_level, assessed_at)
      values (${context.userId}, ${data.skillId}, ${level}, ${level}, now())
      on conflict (user_id, skill_id) do update set
        assessed_level = excluded.assessed_level,
        assessed_at = excluded.assessed_at
    `;
    return { score, total, level };
  });

export const toggleLesson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { lessonId: string; done: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.done) {
      await sql`
        insert into lesson_progress (user_id, lesson_id)
        values (${context.userId}, ${data.lessonId})
        on conflict do nothing
      `;
    } else {
      await sql`
        delete from lesson_progress where user_id = ${context.userId} and lesson_id = ${data.lessonId}
      `;
    }
    return { ok: true as const };
  });

export const addPortfolioItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      kind: "project" | "certification" | "achievement";
      title: string;
      description: string;
      url: string;
      skills: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const title = data.title.trim();
    if (!title) throw new Error("Title is required");
    const sql = await getSql();
    await sql`
      insert into portfolio_items (user_id, kind, title, description, url, skills)
      values (
        ${context.userId}, ${data.kind}, ${title}, ${data.description.trim()},
        ${data.url.trim()}, ${data.skills.trim()}
      )
    `;
    return { ok: true as const };
  });

export const deletePortfolioItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from portfolio_items where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const listOpportunities = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select * from opportunities where open = true order by created_at desc
  `;
  return rows.map(mapOpportunity);
});

export const getOpportunity = createServerFn({ method: "GET" })
  .validator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [row] = await sql<Record<string, unknown>>`
      select * from opportunities where id = ${data.id}
    `;
    return row ? mapOpportunity(row) : null;
  });

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { opportunityId: number; coverNote: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [job] = await sql<Record<string, unknown>>`
      select * from opportunities where id = ${data.opportunityId} and open = true
    `;
    if (!job) throw new Error("Opportunity not found");
    const skillRows = await sql<Record<string, unknown>>`
      select * from student_skills where user_id = ${context.userId}
    `;
    const skills = skillRows.map(mapSkill);
    const levels = levelsMap(skills);
    const required = parseRequired(job.required_skills);
    const matchPct = matchPercent(levels, required);
    await sql`
      insert into applications (user_id, opportunity_id, match_pct, cover_note)
      values (${context.userId}, ${data.opportunityId}, ${matchPct}, ${data.coverNote.trim()})
      on conflict (user_id, opportunity_id) do update set
        cover_note = excluded.cover_note,
        match_pct = excluded.match_pct
    `;
    return { ok: true as const, matchPct };
  });

export const createJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      company: string;
      kind: "internship" | "job";
      location: string;
      workMode: "remote" | "hybrid" | "onsite";
      stipend: string;
      duration: string;
      description: string;
      requiredSkills: { id: string; level: number }[];
      deadline: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [profileRow] = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${context.userId}
    `;
    const profile = mapProfile(profileRow);
    if (!profile || profile.role !== "industry") {
      throw new Error("Only industry accounts can post roles");
    }
    const title = data.title.trim();
    if (!title) throw new Error("Title is required");
    const company = data.company.trim() || profile.companyName || "Company";
    const payload = JSON.stringify(data.requiredSkills);
    const rows = await sql.query<Record<string, unknown>>(
      `insert into opportunities (
        poster_user_id, company, title, kind, location, work_mode, stipend, duration,
        description, required_skills, deadline
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)
      returning *`,
      [
        context.userId,
        company,
        title,
        data.kind,
        data.location.trim(),
        data.workMode,
        data.stipend.trim(),
        data.duration.trim(),
        data.description.trim(),
        payload,
        data.deadline.trim(),
      ],
    );
    return mapOpportunity(rows[0]);
  });

export const listApplicants = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { opportunityId: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [job] = await sql<Record<string, unknown>>`
      select * from opportunities where id = ${data.opportunityId}
    `;
    if (!job) throw new Error("Not found");
    if (String(job.poster_user_id) !== context.userId) throw new Error("Forbidden");
    const rows = await sql<Record<string, unknown>>`
      select a.*, p.name, p.college_name, p.career_goal, p.headline
      from applications a
      join profiles p on p.user_id = a.user_id
      where a.opportunity_id = ${data.opportunityId}
      order by a.match_pct desc, a.created_at asc
    `;
    return rows.map((row) => ({
      application: mapApplication(row),
      name: String(row.name ?? ""),
      collegeName: String(row.college_name ?? ""),
      careerGoal: String(row.career_goal ?? ""),
      headline: String(row.headline ?? ""),
    }));
  });

export const setApplicationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { applicationId: number; status: "applied" | "shortlisted" | "rejected" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [row] = await sql<Record<string, unknown>>`
      select a.id, o.poster_user_id
      from applications a
      join opportunities o on o.id = a.opportunity_id
      where a.id = ${data.applicationId}
    `;
    if (!row || String(row.poster_user_id) !== context.userId) throw new Error("Forbidden");
    await sql`update applications set status = ${data.status} where id = ${data.applicationId}`;
    return { ok: true as const };
  });

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { force?: boolean } | undefined) => input ?? {})
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [profileRow] = await sql<Record<string, unknown>>`
      select * from profiles where user_id = ${context.userId}
    `;
    const profile = mapProfile(profileRow);
    if (!profile) throw new Error("Create a profile first");
    const skillRows = await sql<Record<string, unknown>>`
      select * from student_skills where user_id = ${context.userId}
    `;
    const skills = skillRows.map(mapSkill);
    const summary = skills
      .map((s) => `${s.skillId}:${effectiveLevel(s.selfLevel, s.assessedLevel)}`)
      .join(", ");

    const fallback = buildLocalPlan({
      name: profile.name,
      yearLabel: profile.yearLabel,
      collegeName: profile.collegeName,
      careerGoal: profile.careerGoal,
      skills,
    });

    if (!data.force) {
      const cached = await sql<{ plan_text: string; career_goal: string }>`
        select plan_text, career_goal from ai_plans where user_id = ${context.userId}
      `;
      if (cached[0] && cached[0].career_goal === profile.careerGoal) {
        return { ok: true as const, text: cached[0].plan_text, source: "ai" as const, cached: true };
      }
    }

    const groqKey = process.env.GROQ_API_KEY?.trim();
    const prompt = `You are SkillBridge, a concise career coach for Indian engineering students.
Student: ${profile.name}, ${profile.yearLabel || "student"} at ${profile.collegeName || "college"}.
Career goal: ${profile.careerGoal || "SDE"}.
Current skill levels (0-5): ${summary || "none rated yet"}.
Write an 8-week plan. Use short headings (Week 1-2, etc). Name specific free YouTube instructors (freeCodeCamp, CodeWithHarry, Abdul Bari, Kunal Kushwaha, NeetCode, SuperSimpleDev, Traversy) where relevant. No fluff, no emoji, no markdown tables. Max 400 words.`;

    if (groqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [{ role: "user", content: prompt }],
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
          }),
        });
        if (res.ok) {
          const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
          const text = body.choices?.[0]?.message?.content?.trim() ?? "";
          if (text) {
            await sql`
              insert into ai_plans (user_id, career_goal, plan_text)
              values (${context.userId}, ${profile.careerGoal}, ${text})
              on conflict (user_id) do update set career_goal = excluded.career_goal, plan_text = excluded.plan_text, created_at = now()
            `;
            return { ok: true as const, text, source: "ai" as const, cached: false };
          }
        }
      } catch {
        // Fall through to the local plan — never surface provider errors.
      }
    }

    return { ok: true as const, text: fallback, source: "fallback" as const, cached: false };
  });
