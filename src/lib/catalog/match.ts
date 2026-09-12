import { CAREER_MAP, effectiveLevel, type RoleReq } from "./roles";
import { lessonsForSkill } from "./roadmaps";
import { SKILLS, type Skill } from "./skills";

export type SkillLevels = Record<string, { self: number; assessed: number | null }>;

export function levelOf(levels: SkillLevels, id: string) {
  const row = levels[id];
  if (!row) return 0;
  return effectiveLevel(row.self, row.assessed);
}

export function matchPercent(levels: SkillLevels, required: RoleReq[]) {
  if (!required.length) return 0;
  let weight = 0;
  let got = 0;
  for (const req of required) {
    const w = req.level;
    weight += w;
    const have = levelOf(levels, req.id);
    got += w * Math.min(1, have / Math.max(req.level, 1));
  }
  return Math.round((got / weight) * 100);
}

export type Gap = {
  skillId: string;
  have: number;
  need: number;
  gap: number;
  name: string;
};

export function skillGaps(levels: SkillLevels, required: RoleReq[]): Gap[] {
  return required
    .map((req) => {
      const have = levelOf(levels, req.id);
      const skill = SKILLS.find((s) => s.id === req.id);
      return {
        skillId: req.id,
        have,
        need: req.level,
        gap: Math.max(0, req.level - have),
        name: skill?.name ?? req.id,
      };
    })
    .sort((a, b) => b.gap - a.gap || b.need - a.need);
}

export function gapsForGoal(levels: SkillLevels, goalId: string): Gap[] {
  const goal = CAREER_MAP[goalId];
  if (!goal) return [];
  return skillGaps(levels, goal.required);
}

export function readinessForGoal(levels: SkillLevels, goalId: string) {
  const goal = CAREER_MAP[goalId];
  if (!goal) return 0;
  return matchPercent(levels, goal.required);
}

export function recommendLessons(gaps: Gap[], completed: Set<string>, limit = 6) {
  const out: { skillId: string; lessonId: string }[] = [];
  for (const g of gaps) {
    if (g.gap <= 0) continue;
    const lessons = lessonsForSkill(g.skillId);
    for (const l of lessons) {
      if (completed.has(l.id)) continue;
      out.push({ skillId: g.skillId, lessonId: l.id });
      if (out.length >= limit) return out;
      break;
    }
  }
  return out;
}

export function parseRequired(raw: unknown): RoleReq[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const rec = item as { id?: unknown; level?: unknown };
      if (typeof rec.id !== "string") return null;
      const level = typeof rec.level === "number" ? rec.level : Number(rec.level);
      if (!Number.isFinite(level)) return null;
      return { id: rec.id, level };
    })
    .filter((x): x is RoleReq => x != null);
}

export function topSkills(levels: SkillLevels, n = 6): { skill: Skill; level: number }[] {
  return SKILLS.map((skill) => ({ skill, level: levelOf(levels, skill.id) }))
    .filter((x) => x.level > 0)
    .sort((a, b) => b.level - a.level)
    .slice(0, n);
}
