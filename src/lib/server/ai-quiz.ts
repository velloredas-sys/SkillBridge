import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { scoreToLevel } from "@/lib/catalog/questions";
import { SKILL_MAP } from "@/lib/catalog/skills";
import {
  buildAiQuizPrompt,
  parseAiQuizResponse,
  MIN_AI_QUESTIONS,
  type AiQuestion,
} from "@/lib/catalog/ai-quiz";

// Same provider/model as the AI study plan (see generatePlan in ./me.ts) — one
// GROQ_API_KEY covers both features. Any failure here — missing key, network
// error, bad JSON, too few usable questions — throws "AI_UNAVAILABLE" so the
// client falls back to the standard 5-question quiz. Never silently serve a
// half-broken AI quiz.
async function generateQuestions(skillName: string, skillId: string): Promise<AiQuestion[]> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (!groqKey) throw new Error("AI_UNAVAILABLE");

  let text = "";
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: buildAiQuizPrompt(skillName) }],
        temperature: 0.6,
        max_completion_tokens: 8000,
        top_p: 1,
      }),
    });
    if (!res.ok) throw new Error("AI_UNAVAILABLE");
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    text = body.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    throw new Error("AI_UNAVAILABLE");
  }

  const questions = parseAiQuizResponse(text, skillId);
  if (questions.length < MIN_AI_QUESTIONS) throw new Error("AI_UNAVAILABLE");
  return questions;
}

export const generateAiQuiz = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { skillId: string; timerSeconds: number | null }) => input)
  .handler(async ({ context, data }) => {
    const skill = SKILL_MAP[data.skillId];
    if (!skill) throw new Error("Unknown skill");

    const questions = await generateQuestions(skill.name, data.skillId);

    const timerSeconds =
      data.timerSeconds && data.timerSeconds > 0 ? Math.round(data.timerSeconds) : null;

    const sql = await getSql();
    const rows = await sql.query<{ id: number }>(
      `insert into ai_quiz_attempts (user_id, skill_id, timer_seconds, questions)
       values ($1, $2, $3, $4::jsonb)
       returning id`,
      [context.userId, data.skillId, timerSeconds, JSON.stringify(questions)],
    );
    const attemptId = rows[0].id;

    // Never send correct answers to the client — only prompt + choices.
    const clientQuestions = questions.map(({ id, prompt, choices }) => ({ id, prompt, choices }));

    return { attemptId, timerSeconds, questions: clientQuestions };
  });

export const submitAiQuiz = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { attemptId: number; answers: Record<string, string> }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: number;
      user_id: string;
      skill_id: string;
      questions: AiQuestion[] | string;
      submitted_at: string | null;
    }>(`select * from ai_quiz_attempts where id = $1`, [data.attemptId]);

    const row = rows[0];
    if (!row || row.user_id !== context.userId) throw new Error("Attempt not found");
    if (row.submitted_at) throw new Error("This attempt was already submitted");

    const questions: AiQuestion[] =
      typeof row.questions === "string" ? JSON.parse(row.questions) : row.questions;

    let score = 0;
    for (const q of questions) {
      if (data.answers[q.id] === q.answer) score += 1;
    }
    const total = questions.length;
    const level = scoreToLevel(score, total);

    await sql`
      update ai_quiz_attempts
      set score = ${score}, total = ${total}, level = ${level}, submitted_at = now()
      where id = ${data.attemptId}
    `;
    await sql`
      insert into assessments (user_id, skill_id, score, total, level, source)
      values (${context.userId}, ${row.skill_id}, ${score}, ${total}, ${level}, 'ai')
    `;
    await sql`
      insert into student_skills (user_id, skill_id, self_level, assessed_level, assessed_at)
      values (${context.userId}, ${row.skill_id}, ${level}, ${level}, now())
      on conflict (user_id, skill_id) do update set
        assessed_level = excluded.assessed_level,
        assessed_at = excluded.assessed_at
    `;

    return { score, total, level };
  });
