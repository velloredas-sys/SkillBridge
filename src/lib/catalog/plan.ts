import { gapsForGoal } from "./match";
import { CAREER_MAP, effectiveLevel } from "./roles";
import { skillName } from "./skills";
import type { SkillRow } from "@/lib/types";

const INSTRUCTORS: Record<string, string> = {
  python: "Programming with Mosh or CodeWithHarry, then Corey Schafer for OOP",
  java: "Telusko or Apna College, then keep drilling in the same language",
  javascript: "freeCodeCamp JS, then SuperSimpleDev / Traversy for HTML/CSS",
  react: "freeCodeCamp React course, then Traversy's crash course as a second pass",
  dsa: "Abdul Bari for theory, Kunal Kushwaha or Striver's A2Z sheet for practice",
  sql: "freeCodeCamp SQL, then Mosh's MySQL course",
  git: "freeCodeCamp Git & GitHub crash course",
  os: "Neso Academy, then Gate Smashers in Hindi if you prefer",
  cn: "Neso Academy intro, then Gate Smashers OSI lectures",
  systemdesign: "ByteByteGo for framing, Gaurav Sen for the primer",
  docker: "TechWorld with Nana Docker course",
  linux: "freeCodeCamp Linux crash course",
  htmlcss: "SuperSimpleDev HTML & CSS, Traversy crash courses",
  node: "freeCodeCamp Node + Express",
  cpp: "freeCodeCamp C++ then The Cherno series",
  c: "freeCodeCamp C, then Neso Academy pointers",
  mongodb: "Traversy MongoDB crash course — only after SQL joins click",
};

function instructor(skillId: string) {
  return INSTRUCTORS[skillId] ?? `${skillName(skillId)} lessons in the SkillBridge catalog`;
}

export function buildLocalPlan(input: {
  name: string;
  yearLabel: string;
  collegeName: string;
  careerGoal: string;
  skills: SkillRow[];
}): string {
  const goal = CAREER_MAP[input.careerGoal];
  const goalTitle = goal?.title ?? "Software Development Engineer";
  const levels: Record<string, { self: number; assessed: number | null }> = {};
  for (const s of input.skills) {
    levels[s.skillId] = { self: s.selfLevel, assessed: s.assessedLevel };
  }
  const gaps = gapsForGoal(levels, input.careerGoal).filter((g) => g.gap > 0);
  const ranked = gaps.length ? gaps : (goal?.required ?? []).map((r) => ({
    skillId: r.id,
    name: skillName(r.id),
    have: 0,
    need: r.level,
    gap: r.level,
  }));

  const who = [input.name, input.yearLabel, input.collegeName].filter(Boolean).join(" · ") || "Student";
  const top = ranked.slice(0, 6);

  const blocks: string[] = [];
  blocks.push(
    `**8-week plan for ${who}**`,
    `Goal: **${goalTitle}**`,
    "",
    "This plan is built from your current skill ratings and quiz results. Close the biggest gaps first. Sit the matching SkillBridge quiz at the end of each block so the intern board can score you honestly.",
    "",
  );

  const pair = (a: (typeof top)[number] | undefined, b: (typeof top)[number] | undefined, weeks: string, extra: string) => {
    const skills = [a, b].filter(Boolean) as typeof top;
    const names = skills.map((s) => `**${s.name}**`).join(" + ") || "foundations";
    const lines = skills.map(
      (s) =>
        `- **${s.name}**: you are at ${s.have}/5, roles want ${s.need}/5. Watch ${instructor(s.skillId)}. 60–90 minutes most days, then 2–3 practice problems.`,
    );
    blocks.push(`## ${weeks}`);
    blocks.push(names + ".");
    blocks.push(...lines);
    blocks.push(extra);
    blocks.push("");
  };

  pair(
    top[0],
    top[1],
    "Week 1-2",
    "Finish one full beginner course, not three intros. Mark the SkillBridge lessons done as you go.",
  );
  pair(
    top[2] ?? top[0],
    top[3] ?? top[1],
    "Week 3-4",
    "Start a tiny project that uses both skills (a CLI, a CRUD page, or 20 DSA problems on one pattern).",
  );
  pair(
    top[4] ?? top[1],
    top[5] ?? top[2],
    "Week 5-6",
    "Git every day. Push the project. Write a 5-line README. That is what recruiters actually open.",
  );

  blocks.push("## Week 7-8");
  blocks.push("Interview loop.");
  blocks.push(
    `- **DSA**: NeetCode Two Sum, then 15 problems from Striver's A2Z sheet. Name the pattern out loud.`,
    `- Apply on SkillBridge to the demo roles that match **${goalTitle}**. Use the cover note to point at the project.`,
    `- Re-sit quizzes for your top three gaps so assessed scores replace self-ratings.`,
    "",
    "Cadence: 90 minutes on weekdays, one longer block on Saturday. If a week slips, do not restart — cut the extra course and keep the project.",
  );

  const rated = input.skills.filter((s) => effectiveLevel(s.selfLevel, s.assessedLevel) > 0);
  if (!rated.length) {
    blocks.push(
      "",
      "You have not rated skills yet. After you finish onboarding ratings or a quiz, refresh this plan so the weeks lock onto real gaps.",
    );
  }

  return blocks.join("\n");
}
