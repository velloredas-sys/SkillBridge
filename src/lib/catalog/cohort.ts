import { SKILLS } from "./skills";

/** Anonymised all-India CS cohort averages — not personal records. */
export const NATIONAL_AVG: Record<string, number> = {
  c: 2.4,
  cpp: 2.1,
  java: 3.1,
  python: 3.3,
  dsa: 2.2,
  htmlcss: 2.8,
  javascript: 2.5,
  react: 1.6,
  node: 1.3,
  sql: 2.4,
  mongodb: 1.4,
  git: 2.0,
  os: 2.3,
  cn: 2.1,
  systemdesign: 1.1,
  docker: 1.0,
  linux: 1.7,
};

export const INDUSTRY_DEMAND: Record<string, number> = {
  c: 2.0,
  cpp: 2.5,
  java: 4.2,
  python: 3.8,
  dsa: 4.5,
  htmlcss: 3.0,
  javascript: 4.0,
  react: 3.6,
  node: 3.2,
  sql: 4.1,
  mongodb: 2.4,
  git: 4.0,
  os: 3.0,
  cn: 2.8,
  systemdesign: 3.2,
  docker: 2.8,
  linux: 2.6,
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic campus flavour of the national curve — still aggregates only. */
export function campusAverages(collegeName: string): Record<string, number> {
  const h = hash(collegeName || "campus");
  const out: Record<string, number> = {};
  for (const skill of SKILLS) {
    const base = NATIONAL_AVG[skill.id] ?? 2;
    const wobble = ((h + skill.id.charCodeAt(0) * 17) % 17) / 17 - 0.5;
    out[skill.id] = Math.max(0.6, Math.min(4.6, +(base + wobble * 0.7).toFixed(2)));
  }
  return out;
}

export function demandGaps(avg: Record<string, number>) {
  return SKILLS.map((skill) => {
    const have = avg[skill.id] ?? 0;
    const need = INDUSTRY_DEMAND[skill.id] ?? 0;
    return {
      skillId: skill.id,
      name: skill.name,
      have,
      need,
      gap: +(need - have).toFixed(2),
    };
  }).sort((a, b) => b.gap - a.gap);
}
