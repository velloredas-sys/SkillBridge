export type RoleReq = { id: string; level: number };

export type CareerGoal = {
  id: string;
  title: string;
  family: string;
  summary: string;
  required: RoleReq[];
};

export const CAREER_GOALS: CareerGoal[] = [
  {
    id: "sde",
    title: "Software Development Engineer",
    family: "Product / Core",
    summary: "The default campus target. DSA, one strong language, SQL, and CS core.",
    required: [
      { id: "dsa", level: 4 },
      { id: "java", level: 4 },
      { id: "sql", level: 3 },
      { id: "git", level: 3 },
      { id: "os", level: 3 },
      { id: "cn", level: 2 },
      { id: "systemdesign", level: 2 },
    ],
  },
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    family: "Web",
    summary: "Ship features end-to-end: UI, API, and a real database.",
    required: [
      { id: "htmlcss", level: 4 },
      { id: "javascript", level: 4 },
      { id: "react", level: 4 },
      { id: "node", level: 3 },
      { id: "sql", level: 3 },
      { id: "git", level: 3 },
      { id: "dsa", level: 3 },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Engineer",
    family: "Web",
    summary: "Interface craft. React, CSS systems, and product taste.",
    required: [
      { id: "htmlcss", level: 5 },
      { id: "javascript", level: 4 },
      { id: "react", level: 4 },
      { id: "git", level: 3 },
      { id: "dsa", level: 2 },
    ],
  },
  {
    id: "backend",
    title: "Backend Engineer",
    family: "Web",
    summary: "APIs, data, and reliability. The spine of every product.",
    required: [
      { id: "java", level: 4 },
      { id: "sql", level: 4 },
      { id: "dsa", level: 4 },
      { id: "git", level: 3 },
      { id: "os", level: 3 },
      { id: "systemdesign", level: 3 },
      { id: "linux", level: 2 },
    ],
  },
  {
    id: "data",
    title: "Data Analyst",
    family: "Data",
    summary: "SQL-first. Turn messy tables into decisions.",
    required: [
      { id: "sql", level: 5 },
      { id: "python", level: 3 },
      { id: "git", level: 2 },
    ],
  },
  {
    id: "ml",
    title: "ML / Data Science",
    family: "Data",
    summary: "Python, data wrangling, and enough math to not fool yourself.",
    required: [
      { id: "python", level: 4 },
      { id: "sql", level: 3 },
      { id: "dsa", level: 3 },
      { id: "git", level: 3 },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    family: "Systems",
    summary: "Linux, containers, and making deploys boring.",
    required: [
      { id: "linux", level: 4 },
      { id: "docker", level: 4 },
      { id: "git", level: 4 },
      { id: "cn", level: 3 },
      { id: "os", level: 3 },
      { id: "python", level: 3 },
    ],
  },
  {
    id: "embedded",
    title: "Embedded / Systems",
    family: "Systems",
    summary: "C, C++, and hardware-adjacent software. Autos, devices, firmware.",
    required: [
      { id: "c", level: 4 },
      { id: "cpp", level: 4 },
      { id: "os", level: 3 },
      { id: "linux", level: 3 },
      { id: "git", level: 3 },
      { id: "dsa", level: 3 },
    ],
  },
  {
    id: "android",
    title: "Android Developer",
    family: "Mobile",
    summary: "Kotlin/Java, mobile UX, and Play-ready apps.",
    required: [
      { id: "java", level: 4 },
      { id: "dsa", level: 3 },
      { id: "git", level: 3 },
      { id: "sql", level: 2 },
    ],
  },
];

export const CAREER_MAP = Object.fromEntries(CAREER_GOALS.map((g) => [g.id, g])) as Record<
  string,
  CareerGoal
>;

export function effectiveLevel(self: number, assessed: number | null | undefined) {
  if (assessed != null && assessed > 0) return assessed;
  return self;
}
