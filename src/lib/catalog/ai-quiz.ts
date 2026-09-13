// AI Beta quiz: build the generation prompt and defensively parse whatever the
// model sends back. The 5-question static QUESTIONS bank (see questions.ts)
// stays the source of truth everywhere the AI is unavailable or unreliable —
// this module never has to be trusted blindly.

export type AiChoice = { id: string; text: string };
export type AiQuestion = {
  id: string;
  prompt: string;
  choices: AiChoice[];
  answer: string;
};

/** Below this many valid questions, treat the whole generation as a failure. */
export const MIN_AI_QUESTIONS = 20;
export const TARGET_AI_QUESTIONS = 30;

export function buildAiQuizPrompt(skillName: string): string {
  return `You are writing a technical assessment quiz for the skill "${skillName}", for Indian engineering students preparing for internships and campus placements.

Write exactly ${TARGET_AI_QUESTIONS} multiple-choice questions that test real, practical understanding of ${skillName} — a mix of easy, medium, and a few hard questions, ordered roughly easiest to hardest. No trivia, no ambiguous wording, no "all of the above" or "none of the above" options.

Respond with ONLY a raw JSON array — no markdown code fences, no prose before or after it. Each element must look exactly like this shape:
{"prompt": "question text", "choices": [{"id":"a","text":"choice text"},{"id":"b","text":"choice text"},{"id":"c","text":"choice text"},{"id":"d","text":"choice text"}], "answer": "b"}

Rules:
- Exactly 4 choices per question, with ids "a", "b", "c", "d".
- "answer" must exactly equal one of that question's choice ids.
- Exactly ${TARGET_AI_QUESTIONS} questions in the array.
- No duplicate questions.`;
}

function stripToJsonArray(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1].trim() : trimmed;
  const start = body.indexOf("[");
  const end = body.lastIndexOf("]");
  return start >= 0 && end > start ? body.slice(start, end + 1) : body;
}

function isValidChoice(x: unknown): x is AiChoice {
  return (
    !!x &&
    typeof x === "object" &&
    typeof (x as AiChoice).id === "string" &&
    (x as AiChoice).id.trim().length > 0 &&
    typeof (x as AiChoice).text === "string" &&
    (x as AiChoice).text.trim().length > 0
  );
}

/**
 * Parse a model's raw text response into validated questions, dropping any
 * malformed entries instead of throwing on the first bad one — a model that
 * gets 27 of 30 right shouldn't cost the student the other 27.
 */
export function parseAiQuizResponse(raw: string, skillId: string): AiQuestion[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripToJsonArray(raw));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const out: AiQuestion[] = [];
  parsed.forEach((item, i) => {
    if (!item || typeof item !== "object") return;
    const rec = item as { prompt?: unknown; choices?: unknown; answer?: unknown };
    if (typeof rec.prompt !== "string" || !rec.prompt.trim()) return;
    if (!Array.isArray(rec.choices)) return;

    const choices = rec.choices.filter(isValidChoice);
    const uniqueIds = new Set(choices.map((c) => c.id));
    if (choices.length !== 4 || uniqueIds.size !== 4) return;
    if (typeof rec.answer !== "string" || !uniqueIds.has(rec.answer)) return;

    out.push({
      id: `${skillId}-ai-${i}`,
      prompt: rec.prompt.trim(),
      choices: choices.map((c) => ({ id: c.id, text: c.text.trim() })),
      answer: rec.answer,
    });
  });
  return out;
}
