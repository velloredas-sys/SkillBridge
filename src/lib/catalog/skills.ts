export type SkillCategory =
  | "languages"
  | "core"
  | "web"
  | "data"
  | "systems"
  | "tools";

export type Skill = {
  id: string;
  name: string;
  short: string;
  category: SkillCategory;
  blurb: string;
};

export const SKILLS: Skill[] = [
  {
    id: "c",
    name: "C",
    short: "C",
    category: "languages",
    blurb: "Memory, pointers, and the language systems are still built in.",
  },
  {
    id: "cpp",
    name: "C++",
    short: "C++",
    category: "languages",
    blurb: "Performance, OOP, STL — the default for serious systems work.",
  },
  {
    id: "java",
    name: "Java",
    short: "Java",
    category: "languages",
    blurb: "The campus-to-product language of Indian service and product orgs.",
  },
  {
    id: "python",
    name: "Python",
    short: "Python",
    category: "languages",
    blurb: "From scripts to ML. The fastest way to make a computer do work.",
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    short: "DSA",
    category: "core",
    blurb: "The interview gate. Patterns, complexity, and problem sense.",
  },
  {
    id: "htmlcss",
    name: "HTML & CSS",
    short: "HTML/CSS",
    category: "web",
    blurb: "Structure and layout. Everything on the web starts here.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    short: "JS",
    category: "web",
    blurb: "The language of the browser, and increasingly the server.",
  },
  {
    id: "react",
    name: "React",
    short: "React",
    category: "web",
    blurb: "The industry default for serious frontend engineering.",
  },
  {
    id: "node",
    name: "Node.js",
    short: "Node",
    category: "web",
    blurb: "JavaScript on the server. APIs, auth, and real backends.",
  },
  {
    id: "sql",
    name: "SQL & Relational DBs",
    short: "SQL",
    category: "data",
    blurb: "Query, model, and reason about data. Non-negotiable.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    short: "Mongo",
    category: "data",
    blurb: "Document stores for product teams that iterate fast.",
  },
  {
    id: "git",
    name: "Git & GitHub",
    short: "Git",
    category: "tools",
    blurb: "Version control, PRs, and the etiquette of working with others.",
  },
  {
    id: "os",
    name: "Operating Systems",
    short: "OS",
    category: "systems",
    blurb: "Processes, memory, filesystems — what your code actually runs on.",
  },
  {
    id: "cn",
    name: "Computer Networks",
    short: "Networks",
    category: "systems",
    blurb: "TCP, HTTP, DNS. How machines talk, and why requests fail.",
  },
  {
    id: "systemdesign",
    name: "System Design",
    short: "Design",
    category: "systems",
    blurb: "APIs, storage, and scale. How real products stay up.",
  },
  {
    id: "docker",
    name: "Docker & DevOps",
    short: "Docker",
    category: "tools",
    blurb: "Containers, images, and shipping the same thing everywhere.",
  },
  {
    id: "linux",
    name: "Linux",
    short: "Linux",
    category: "tools",
    blurb: "The shell, permissions, and the OS you will SSH into.",
  },
];

export const SKILL_MAP = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<
  string,
  Skill
>;

export const CATEGORY_LABEL: Record<SkillCategory, string> = {
  languages: "Languages",
  core: "Core CS",
  web: "Web",
  data: "Data",
  systems: "Systems",
  tools: "Tools",
};

export function skillName(id: string) {
  return SKILL_MAP[id]?.name ?? id;
}

export function skillShort(id: string) {
  return SKILL_MAP[id]?.short ?? id;
}

export const LEVEL_LABEL = ["None", "Aware", "Beginner", "Working", "Strong", "Expert"] as const;

export function clampLevel(n: number) {
  return Math.max(0, Math.min(5, Math.round(n)));
}
