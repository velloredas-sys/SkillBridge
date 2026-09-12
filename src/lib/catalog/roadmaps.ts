export type LessonLang = "en" | "hi";

export type Lesson = {
  id: string;
  title: string;
  creator: string;
  youtubeId: string;
  duration: string;
  lang: LessonLang;
  level: "beginner" | "intermediate" | "advanced";
  blurb: string;
  skillIds: string[];
};

export type Module = {
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type Roadmap = {
  slug: string;
  title: string;
  skillId: string;
  tagline: string;
  hours: string;
  lessonCount: number;
  audience: string;
  modules: Module[];
};

function countLessons(modules: Module[]) {
  return modules.reduce((n, m) => n + m.lessons.length, 0);
}

const pythonModules: Module[] = [
  {
    title: "Start here",
    summary: "Pick an English or Hindi intro, then stay with one instructor.",
    lessons: [
      {
        id: "py-mosh",
        title: "Python for Beginners",
        creator: "Programming with Mosh",
        youtubeId: "_uQrJ0TkZlc",
        duration: "6h 14m",
        lang: "en",
        level: "beginner",
        blurb: "Clean, complete intro. Syntax, control flow, functions, and a small project.",
        skillIds: ["python"],
      },
      {
        id: "py-bro",
        title: "Python Full Course for Beginners",
        creator: "Bro Code",
        youtubeId: "ix9cRaBkVe0",
        duration: "12h",
        lang: "en",
        level: "beginner",
        blurb: "Long-form English course covering the language end to end.",
        skillIds: ["python"],
      },
      {
        id: "py-cwh",
        title: "Python Tutorial for Beginners (Hindi)",
        creator: "CodeWithHarry",
        youtubeId: "gfDE2a7MKjA",
        duration: "12h",
        lang: "hi",
        level: "beginner",
        blurb: "The Hindi course a generation of Indian freshers actually finished.",
        skillIds: ["python"],
      },
      {
        id: "py-100d",
        title: "100 Days of Code — Day 1",
        creator: "CodeWithHarry",
        youtubeId: "7wnove7K-ZQ",
        duration: "1h 4m",
        lang: "hi",
        level: "beginner",
        blurb: "Start the 100-days playlist. Come back daily; this is the series, not a one-shot.",
        skillIds: ["python"],
      },
    ],
  },
  {
    title: "Go deeper",
    summary: "OOP, intermediate patterns, and a freeCodeCamp long-form.",
    lessons: [
      {
        id: "py-fcc",
        title: "Python — 4 hour beginner course",
        creator: "freeCodeCamp",
        youtubeId: "rfscVS0vtbw",
        duration: "4h 26m",
        lang: "en",
        level: "beginner",
        blurb: "A single sitting with projects. Good second pass after Mosh or Harry.",
        skillIds: ["python"],
      },
      {
        id: "py-corey-oop",
        title: "Python OOP Tutorial 1: Classes and Instances",
        creator: "Corey Schafer",
        youtubeId: "ZDa-Z5JzLYM",
        duration: "15m",
        lang: "en",
        level: "intermediate",
        blurb: "Classes, instances, and why OOP is not just syntax.",
        skillIds: ["python"],
      },
      {
        id: "py-inter",
        title: "Intermediate Python",
        creator: "freeCodeCamp",
        youtubeId: "HGOBQPFzWKo",
        duration: "6h",
        lang: "en",
        level: "intermediate",
        blurb: "Comprehensions, generators, decorators, and the standard library.",
        skillIds: ["python"],
      },
    ],
  },
];

const cModules: Module[] = [
  {
    title: "The language",
    summary: "Memory, pointers, and the discipline C still teaches better than anything else.",
    lessons: [
      {
        id: "c-fcc",
        title: "C Programming Tutorial for Beginners",
        creator: "freeCodeCamp",
        youtubeId: "KJgsSFOSQv0",
        duration: "3h 46m",
        lang: "en",
        level: "beginner",
        blurb: "From hello world through pointers, structs, and files.",
        skillIds: ["c"],
      },
      {
        id: "c-cwh",
        title: "C Language Tutorial (Hindi)",
        creator: "Apna College",
        youtubeId: "irqbmMNs2Bo",
        duration: "8h 45m",
        lang: "hi",
        level: "beginner",
        blurb: "Campus-friendly Hindi C, including arrays, strings, and pointers.",
        skillIds: ["c"],
      },
      {
        id: "c-neso-ptr",
        title: "Pointers in C",
        creator: "Neso Academy",
        youtubeId: "f2i0CnUOniA",
        duration: "18m",
        lang: "en",
        level: "intermediate",
        blurb: "Short, precise pointer lecture — rewatch until it clicks.",
        skillIds: ["c"],
      },
    ],
  },
];

const cppModules: Module[] = [
  {
    title: "Foundations",
    summary: "Modern C++ for internships that still list it on day one.",
    lessons: [
      {
        id: "cpp-fcc",
        title: "C++ Tutorial for Beginners",
        creator: "freeCodeCamp",
        youtubeId: "vLnPwxZdW4Y",
        duration: "4h 1m",
        lang: "en",
        level: "beginner",
        blurb: "Syntax through OOP. The standard English one-shot.",
        skillIds: ["cpp"],
      },
      {
        id: "cpp-cwh",
        title: "C++ Tutorial (Hindi)",
        creator: "CodeWithHarry",
        youtubeId: "j8nAHeVKL08",
        duration: "7h 30m",
        lang: "hi",
        level: "beginner",
        blurb: "Hindi C++ covering classes, inheritance, and file I/O.",
        skillIds: ["cpp"],
      },
      {
        id: "cpp-cherno",
        title: "Welcome to C++",
        creator: "The Cherno",
        youtubeId: "18c3MTX0PK0",
        duration: "8m",
        lang: "en",
        level: "beginner",
        blurb: "Start of The Cherno's series — then continue the playlist.",
        skillIds: ["cpp"],
      },
      {
        id: "cpp-apna",
        title: "C++ Full Course",
        creator: "Apna College",
        youtubeId: "z9bZufPHFLU",
        duration: "4h+",
        lang: "hi",
        level: "beginner",
        blurb: "Campus-oriented C++ used widely in first-year labs.",
        skillIds: ["cpp", "dsa"],
      },
    ],
  },
];

const javaModules: Module[] = [
  {
    title: "Language + campus path",
    summary: "Java is still what TCS, Infosys, Zoho, and most SDE internships expect.",
    lessons: [
      {
        id: "java-fcc",
        title: "Java Programming for Beginners",
        creator: "freeCodeCamp",
        youtubeId: "grEKMHGYyns",
        duration: "9h 33m",
        lang: "en",
        level: "beginner",
        blurb: "Language, OOP, and enough standard library to be dangerous.",
        skillIds: ["java"],
      },
      {
        id: "java-cwh",
        title: "Java Tutorial (Hindi)",
        creator: "CodeWithHarry",
        youtubeId: "ntLJmHOJ0ME",
        duration: "12h+",
        lang: "hi",
        level: "beginner",
        blurb: "The Hindi Java series most engineering freshers bookmark.",
        skillIds: ["java"],
      },
      {
        id: "java-telusko",
        title: "Java Full Course",
        creator: "Telusko",
        youtubeId: "8cm1x4bC610",
        duration: "14h",
        lang: "en",
        level: "beginner",
        blurb: "Navin's long-form Java — practical, interview-aware.",
        skillIds: ["java"],
      },
      {
        id: "java-apna",
        title: "Java for Beginners",
        creator: "Apna College",
        youtubeId: "UmnCZ7-9yDY",
        duration: "2h 30m+",
        lang: "hi",
        level: "beginner",
        blurb: "Fast Hindi Java for first-year students.",
        skillIds: ["java"],
      },
    ],
  },
];

const dsaModules: Module[] = [
  {
    title: "Theory that actually sticks",
    summary: "Start with why, then drill patterns. Don't skip complexity.",
    lessons: [
      {
        id: "dsa-abdul",
        title: "Introduction to Algorithms",
        creator: "Abdul Bari",
        youtubeId: "0IAPZzGSbME",
        duration: "17m",
        lang: "en",
        level: "beginner",
        blurb: "The lecture people rewatch before GATE and interviews.",
        skillIds: ["dsa"],
      },
      {
        id: "dsa-kunal",
        title: "Java + DSA Bootcamp — Intro",
        creator: "Kunal Kushwaha",
        youtubeId: "rZ41y93P2Qo",
        duration: "1h+",
        lang: "en",
        level: "beginner",
        blurb: "Start of the open-source DSA bootcamp. Continue the playlist.",
        skillIds: ["dsa", "java"],
      },
      {
        id: "dsa-fcc",
        title: "DSA in Python — Full Course",
        creator: "freeCodeCamp",
        youtubeId: "8hly31xKli0",
        duration: "5h 19m",
        lang: "en",
        level: "beginner",
        blurb: "Arrays to graphs, implemented in Python.",
        skillIds: ["dsa", "python"],
      },
      {
        id: "dsa-jenny",
        title: "Data Structures (Hindi)",
        creator: "Jenny's Lectures",
        youtubeId: "SGDS6NFN-_U",
        duration: "46m",
        lang: "hi",
        level: "beginner",
        blurb: "Start of Jenny's DSA series — arrays, then keep going.",
        skillIds: ["dsa"],
      },
    ],
  },
  {
    title: "Interview patterns",
    summary: "Solve, then name the pattern. That is how offers happen.",
    lessons: [
      {
        id: "dsa-neet-two",
        title: "Two Sum — NeetCode",
        creator: "NeetCode",
        youtubeId: "KLlXCFG5TnA",
        duration: "7m",
        lang: "en",
        level: "intermediate",
        blurb: "The first LeetCode pattern. Hash maps, not nested loops.",
        skillIds: ["dsa"],
      },
      {
        id: "dsa-striver",
        title: "How to prepare DSA for placements",
        creator: "takeUforward",
        youtubeId: "OjOcpf3eVas",
        duration: "8m",
        lang: "en",
        level: "beginner",
        blurb: "The A2Z sheet briefing. Watch, then follow the sheet, not random questions.",
        skillIds: ["dsa"],
      },
    ],
  },
];

const webModules: Module[] = [
  {
    title: "HTML, CSS, JavaScript",
    summary: "The web stack in the order you will actually use it.",
    lessons: [
      {
        id: "web-ssd-html",
        title: "HTML & CSS Full Course",
        creator: "SuperSimpleDev",
        youtubeId: "G3e-cpL7ofc",
        duration: "6h 31m",
        lang: "en",
        level: "beginner",
        blurb: "The cleanest free HTML/CSS course on YouTube right now.",
        skillIds: ["htmlcss"],
      },
      {
        id: "web-trav-html",
        title: "HTML Crash Course",
        creator: "Traversy Media",
        youtubeId: "UB1O30fR-EE",
        duration: "1h 4m",
        lang: "en",
        level: "beginner",
        blurb: "Fast pass if you already know a language and just need markup.",
        skillIds: ["htmlcss"],
      },
      {
        id: "web-trav-css",
        title: "CSS Crash Course",
        creator: "Traversy Media",
        youtubeId: "yfoY53QXEnI",
        duration: "1h 25m",
        lang: "en",
        level: "beginner",
        blurb: "Selectors, box model, flex. Enough to not fight the browser.",
        skillIds: ["htmlcss"],
      },
      {
        id: "web-fcc-js",
        title: "JavaScript Full Course",
        creator: "freeCodeCamp",
        youtubeId: "PkZNo7MFNFg",
        duration: "3h 26m",
        lang: "en",
        level: "beginner",
        blurb: "Language of the browser. Closures will hurt; that's the point.",
        skillIds: ["javascript"],
      },
      {
        id: "web-cwh-js",
        title: "JavaScript Tutorial (Hindi)",
        creator: "CodeWithHarry",
        youtubeId: "ER9SspLe4Hg",
        duration: "1h+",
        lang: "hi",
        level: "beginner",
        blurb: "Start of Harry's JS series in Hindi.",
        skillIds: ["javascript"],
      },
    ],
  },
  {
    title: "React and the server",
    summary: "What internships mean when they write 'full stack'.",
    lessons: [
      {
        id: "web-react-fcc",
        title: "React Course for Beginners",
        creator: "freeCodeCamp",
        youtubeId: "bMknfKXIFA8",
        duration: "12h",
        lang: "en",
        level: "intermediate",
        blurb: "Hooks, state, and building real UI. Long, worth it.",
        skillIds: ["react", "javascript"],
      },
      {
        id: "web-react-trav",
        title: "React Crash Course",
        creator: "Traversy Media",
        youtubeId: "w7ejDZ8SWv8",
        duration: "1h 48m",
        lang: "en",
        level: "intermediate",
        blurb: "A shorter second pass after the freeCodeCamp course.",
        skillIds: ["react"],
      },
      {
        id: "web-node-fcc",
        title: "Node.js and Express",
        creator: "freeCodeCamp",
        youtubeId: "Oe421EPjeBE",
        duration: "8h 17m",
        lang: "en",
        level: "intermediate",
        blurb: "APIs, middleware, Mongo. Enough backend to ship a project.",
        skillIds: ["node", "javascript", "mongodb"],
      },
    ],
  },
];

const dbModules: Module[] = [
  {
    title: "Relational first",
    summary: "If you only learn one data skill, make it SQL.",
    lessons: [
      {
        id: "db-sql-fcc",
        title: "SQL — Full Course",
        creator: "freeCodeCamp",
        youtubeId: "HXV3zeQKqGY",
        duration: "4h 20m",
        lang: "en",
        level: "beginner",
        blurb: "SELECT to joins, keys, and a real schema. Bookmark this.",
        skillIds: ["sql"],
      },
      {
        id: "db-sql-mosh",
        title: "SQL Tutorial for Beginners",
        creator: "Programming with Mosh",
        youtubeId: "7S_tz1z_5bA",
        duration: "3h 2m",
        lang: "en",
        level: "beginner",
        blurb: "MySQL-flavoured, very clear. Good second instructor.",
        skillIds: ["sql"],
      },
      {
        id: "db-design-fcc",
        title: "Database Design — full course",
        creator: "Caleb Curry",
        youtubeId: "h0j0QN2b57M",
        duration: "8h",
        lang: "en",
        level: "intermediate",
        blurb: "Normalisation and modelling — the part tutorials skip.",
        skillIds: ["sql"],
      },
      {
        id: "db-mongo-trav",
        title: "MongoDB Crash Course",
        creator: "Traversy Media",
        youtubeId: "2QQGWYe7IDU",
        duration: "27m",
        lang: "en",
        level: "beginner",
        blurb: "Documents, collections, and when not to use them.",
        skillIds: ["mongodb"],
      },
    ],
  },
];

const gitModules: Module[] = [
  {
    title: "Version control, for real",
    summary: "Interns lose days to Git. Learn it once, properly.",
    lessons: [
      {
        id: "git-fcc",
        title: "Git and GitHub for Beginners",
        creator: "freeCodeCamp",
        youtubeId: "RGOj5yH7evk",
        duration: "1h 9m",
        lang: "en",
        level: "beginner",
        blurb: "clone, commit, branch, PR. The professional loop.",
        skillIds: ["git"],
      },
      {
        id: "git-trav",
        title: "Git Crash Course",
        creator: "Traversy Media",
        youtubeId: "SWYqp7iY_Tc",
        duration: "32m",
        lang: "en",
        level: "beginner",
        blurb: "Short enough to watch the morning of your first intern day.",
        skillIds: ["git"],
      },
      {
        id: "git-cwh",
        title: "Git & GitHub (Hindi)",
        creator: "CodeWithHarry",
        youtubeId: "gwWKnnCMQ5c",
        duration: "1h 12m",
        lang: "hi",
        level: "beginner",
        blurb: "Hindi walkthrough of GitHub flow.",
        skillIds: ["git"],
      },
    ],
  },
];

const osModules: Module[] = [
  {
    title: "What your code runs on",
    summary: "GATE, interviews, and debugging production all assume this.",
    lessons: [
      {
        id: "os-neso",
        title: "Operating System — Introduction",
        creator: "Neso Academy",
        youtubeId: "vBURTt97EkA",
        duration: "12m",
        lang: "en",
        level: "beginner",
        blurb: "Start of Neso's OS playlist. Watch in order.",
        skillIds: ["os"],
      },
      {
        id: "os-gate",
        title: "OS (Hindi) — Introduction",
        creator: "Gate Smashers",
        youtubeId: "WJ-UaAaumNA",
        duration: "18m",
        lang: "hi",
        level: "beginner",
        blurb: "The Hindi GATE series. Process, scheduling, deadlock next.",
        skillIds: ["os"],
      },
    ],
  },
];

const cnModules: Module[] = [
  {
    title: "How machines talk",
    summary: "HTTP is not magic. Neither is a timeout.",
    lessons: [
      {
        id: "cn-neso",
        title: "Computer Networks — Introduction",
        creator: "Neso Academy",
        youtubeId: "VwN91x5i25g",
        duration: "10m",
        lang: "en",
        level: "beginner",
        blurb: "OSI vs TCP/IP. Then continue the playlist.",
        skillIds: ["cn"],
      },
      {
        id: "cn-gate",
        title: "Computer Networks (Hindi)",
        creator: "Gate Smashers",
        youtubeId: "4D55Cmj2t-A",
        duration: "20m",
        lang: "hi",
        level: "beginner",
        blurb: "Start of the Hindi CN series used across GATE coaching.",
        skillIds: ["cn"],
      },
    ],
  },
];

const designModules: Module[] = [
  {
    title: "Design before you draw boxes",
    summary: "Intern design rounds reward clear thinking, not buzzwords.",
    lessons: [
      {
        id: "sd-byte",
        title: "System Design Interview intro",
        creator: "ByteByteGo",
        youtubeId: "F2FmTdLtb_4",
        duration: "8m",
        lang: "en",
        level: "intermediate",
        blurb: "Alex Xu's framing. Then pick a system and sketch it yourself.",
        skillIds: ["systemdesign"],
      },
      {
        id: "sd-gaurav",
        title: "System Design Primer",
        creator: "Gaurav Sen",
        youtubeId: "SqcXvc3ZmRU",
        duration: "19m",
        lang: "en",
        level: "intermediate",
        blurb: "Indian instructor, product-company bar. Continue the series.",
        skillIds: ["systemdesign"],
      },
    ],
  },
];

const devopsModules: Module[] = [
  {
    title: "Ship the same thing everywhere",
    summary: "Linux + Docker is the intern superpower nobody teaches in class.",
    lessons: [
      {
        id: "do-linux-fcc",
        title: "Linux Operating System",
        creator: "freeCodeCamp",
        youtubeId: "ROjZy1WbCIA",
        duration: "5h 30m",
        lang: "en",
        level: "beginner",
        blurb: "Command line, permissions, processes. You'll use this forever.",
        skillIds: ["linux"],
      },
      {
        id: "do-docker-nana",
        title: "Docker Tutorial for Beginners",
        creator: "TechWorld with Nana",
        youtubeId: "3c-iBn73dDE",
        duration: "2h 46m",
        lang: "en",
        level: "beginner",
        blurb: "Images, containers, compose. The industry intro.",
        skillIds: ["docker", "linux"],
      },
      {
        id: "do-docker-fcc",
        title: "Docker — Full Course",
        creator: "freeCodeCamp",
        youtubeId: "fqMOX6JJhGo",
        duration: "2h 10m",
        lang: "en",
        level: "beginner",
        blurb: "Second pass with more compose and networking.",
        skillIds: ["docker"],
      },
    ],
  },
];

function roadmap(
  slug: string,
  title: string,
  skillId: string,
  tagline: string,
  hours: string,
  audience: string,
  modules: Module[],
): Roadmap {
  return {
    slug,
    title,
    skillId,
    tagline,
    hours,
    audience,
    modules,
    lessonCount: countLessons(modules),
  };
}

export const ROADMAPS: Roadmap[] = [
  roadmap("python", "Python", "python", "The fastest language to ship with — and the one every intern JD still lists.", "40h+", "Beginner", pythonModules),
  roadmap("c", "C Programming", "c", "Pointers, memory, and the habits that make later languages easy.", "16h", "Beginner", cModules),
  roadmap("cpp", "C++", "cpp", "Performance and OOP for systems, games, and the hard internships.", "20h", "Beginner", cppModules),
  roadmap("java", "Java", "java", "Still the language of campus placements and product internships.", "28h", "Beginner", javaModules),
  roadmap("dsa", "DSA & Interviews", "dsa", "Patterns, complexity, and the sheet you'll actually finish.", "60h+", "All years", dsaModules),
  roadmap("web", "Web Development", "javascript", "HTML, CSS, JavaScript, React, Node — one place, in order.", "45h", "Beginner", webModules),
  roadmap("databases", "Databases", "sql", "SQL first. Then modelling. Mongo only after you can join tables.", "12h", "Beginner", dbModules),
  roadmap("git", "Git & GitHub", "git", "The professional loop: branch, commit, review, merge.", "4h", "Beginner", gitModules),
  roadmap("os", "Operating Systems", "os", "Processes, memory, files — what interviews assume you know.", "20h", "2nd year+", osModules),
  roadmap("networks", "Computer Networks", "cn", "TCP, HTTP, DNS. Enough to debug a request.", "16h", "2nd year+", cnModules),
  roadmap("system-design", "System Design", "systemdesign", "APIs, storage, and the vocabulary of senior interviews.", "10h", "3rd year+", designModules),
  roadmap("devops", "Linux & DevOps", "docker", "The shell and the container. How code actually reaches users.", "12h", "2nd year+", devopsModules),
];

export const ROADMAP_MAP = Object.fromEntries(ROADMAPS.map((r) => [r.slug, r])) as Record<
  string,
  Roadmap
>;

export function allLessons(): Lesson[] {
  return ROADMAPS.flatMap((r) => r.modules.flatMap((m) => m.lessons));
}

export function findLesson(id: string): { roadmap: Roadmap; lesson: Lesson } | null {
  for (const r of ROADMAPS) {
    for (const m of r.modules) {
      const lesson = m.lessons.find((l) => l.id === id);
      if (lesson) return { roadmap: r, lesson };
    }
  }
  return null;
}

export function lessonsForSkill(skillId: string): Lesson[] {
  return allLessons().filter((l) => l.skillIds.includes(skillId));
}

export function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function ytEmbed(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}
