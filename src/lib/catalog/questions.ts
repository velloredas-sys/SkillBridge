export type Choice = { id: string; text: string };

export type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
  answer: string;
};

export const QUESTIONS: Record<string, Question[]> = {
  python: [
    {
      id: "py1",
      prompt: "What does `len([1, 2, 3])` return?",
      choices: [
        { id: "a", text: "2" },
        { id: "b", text: "3" },
        { id: "c", text: "4" },
        { id: "d", text: "None" },
      ],
      answer: "b",
    },
    {
      id: "py2",
      prompt: "Which collection is ordered and mutable?",
      choices: [
        { id: "a", text: "tuple" },
        { id: "b", text: "set" },
        { id: "c", text: "list" },
        { id: "d", text: "frozenset" },
      ],
      answer: "c",
    },
    {
      id: "py3",
      prompt: "What is the output of `bool([])`?",
      choices: [
        { id: "a", text: "True" },
        { id: "b", text: "False" },
        { id: "c", text: "[]" },
        { id: "d", text: "Error" },
      ],
      answer: "b",
    },
    {
      id: "py4",
      prompt: "Which keyword defines a function?",
      choices: [
        { id: "a", text: "func" },
        { id: "b", text: "def" },
        { id: "c", text: "function" },
        { id: "d", text: "lambda" },
      ],
      answer: "b",
    },
    {
      id: "py5",
      prompt: "`x = [1, 2]; y = x; y.append(3)` — what is `x`?",
      choices: [
        { id: "a", text: "[1, 2]" },
        { id: "b", text: "[1, 2, 3]" },
        { id: "c", text: "[3]" },
        { id: "d", text: "Error" },
      ],
      answer: "b",
    },
    {
      id: "py6",
      prompt: "Which is the correct way to open a file for reading?",
      choices: [
        { id: "a", text: "open('a.txt', 'r')" },
        { id: "b", text: "file('a.txt')" },
        { id: "c", text: "read('a.txt')" },
        { id: "d", text: "open.read('a.txt')" },
      ],
      answer: "a",
    },
  ],
  c: [
    {
      id: "c1",
      prompt: "Which header is required for `printf`?",
      choices: [
        { id: "a", text: "stdlib.h" },
        { id: "b", text: "stdio.h" },
        { id: "c", text: "string.h" },
        { id: "d", text: "math.h" },
      ],
      answer: "b",
    },
    {
      id: "c2",
      prompt: "What does `*` mean in `int *p`?",
      choices: [
        { id: "a", text: "p is an integer" },
        { id: "b", text: "p is a pointer to int" },
        { id: "c", text: "p multiplies ints" },
        { id: "d", text: "p is an array" },
      ],
      answer: "b",
    },
    {
      id: "c3",
      prompt: "What is the index of the first element of an array?",
      choices: [
        { id: "a", text: "1" },
        { id: "b", text: "0" },
        { id: "c", text: "-1" },
        { id: "d", text: "Depends on compiler" },
      ],
      answer: "b",
    },
    {
      id: "c4",
      prompt: "Which loop always executes the body at least once?",
      choices: [
        { id: "a", text: "for" },
        { id: "b", text: "while" },
        { id: "c", text: "do-while" },
        { id: "d", text: "None" },
      ],
      answer: "c",
    },
    {
      id: "c5",
      prompt: "`sizeof(char)` on a typical system is:",
      choices: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
        { id: "c", text: "4" },
        { id: "d", text: "8" },
      ],
      answer: "a",
    },
    {
      id: "c6",
      prompt: "Which operator gives the address of a variable?",
      choices: [
        { id: "a", text: "*" },
        { id: "b", text: "&" },
        { id: "c", text: "->" },
        { id: "d", text: "%" },
      ],
      answer: "b",
    },
  ],
  cpp: [
    {
      id: "cpp1",
      prompt: "Which is the C++ standard output stream?",
      choices: [
        { id: "a", text: "printf" },
        { id: "b", text: "cout" },
        { id: "c", text: "print" },
        { id: "d", text: "stdout.log" },
      ],
      answer: "b",
    },
    {
      id: "cpp2",
      prompt: "A class function that shares the name of the class and has no return type is a:",
      choices: [
        { id: "a", text: "destructor" },
        { id: "b", text: "constructor" },
        { id: "c", text: "friend" },
        { id: "d", text: "template" },
      ],
      answer: "b",
    },
    {
      id: "cpp3",
      prompt: "Which STL container is a dynamic array?",
      choices: [
        { id: "a", text: "list" },
        { id: "b", text: "map" },
        { id: "c", text: "vector" },
        { id: "d", text: "set" },
      ],
      answer: "c",
    },
    {
      id: "cpp4",
      prompt: "`virtual` on a method enables:",
      choices: [
        { id: "a", text: "templates" },
        { id: "b", text: "runtime polymorphism" },
        { id: "c", text: "operator overloading" },
        { id: "d", text: "RAII" },
      ],
      answer: "b",
    },
    {
      id: "cpp5",
      prompt: "Which keyword prevents a class from being subclassed (C++11 onwards, final)?",
      choices: [
        { id: "a", text: "sealed" },
        { id: "b", text: "final" },
        { id: "c", text: "const" },
        { id: "d", text: "static" },
      ],
      answer: "b",
    },
    {
      id: "cpp6",
      prompt: "What does RAII primarily manage?",
      choices: [
        { id: "a", text: "Templates" },
        { id: "b", text: "Resource lifetime via objects" },
        { id: "c", text: "Multiple inheritance" },
        { id: "d", text: "Header guards" },
      ],
      answer: "b",
    },
  ],
  java: [
    {
      id: "j1",
      prompt: "The entry point of a Java application is:",
      choices: [
        { id: "a", text: "init()" },
        { id: "b", text: "public static void main(String[] args)" },
        { id: "c", text: "start()" },
        { id: "d", text: "Java.main" },
      ],
      answer: "b",
    },
    {
      id: "j2",
      prompt: "Which collection does not allow duplicates?",
      choices: [
        { id: "a", text: "ArrayList" },
        { id: "b", text: "LinkedList" },
        { id: "c", text: "HashSet" },
        { id: "d", text: "Stack" },
      ],
      answer: "c",
    },
    {
      id: "j3",
      prompt: "`==` on two Integer objects compares:",
      choices: [
        { id: "a", text: "Always the numeric value" },
        { id: "b", text: "References (identity), not always the value" },
        { id: "c", text: "Hash codes" },
        { id: "d", text: "Class names" },
      ],
      answer: "b",
    },
    {
      id: "j4",
      prompt: "Which keyword stops a class from being extended?",
      choices: [
        { id: "a", text: "static" },
        { id: "b", text: "final" },
        { id: "c", text: "private" },
        { id: "d", text: "sealed-only" },
      ],
      answer: "b",
    },
    {
      id: "j5",
      prompt: "Checked exceptions must be:",
      choices: [
        { id: "a", text: "Ignored" },
        { id: "b", text: "Declared or caught" },
        { id: "c", text: "Always RuntimeException" },
        { id: "d", text: "Logged only" },
      ],
      answer: "b",
    },
    {
      id: "j6",
      prompt: "JVM stands for:",
      choices: [
        { id: "a", text: "Java Visual Machine" },
        { id: "b", text: "Java Virtual Machine" },
        { id: "c", text: "Just Virtual Memory" },
        { id: "d", text: "Java Vendor Module" },
      ],
      answer: "b",
    },
  ],
  dsa: [
    {
      id: "d1",
      prompt: "Binary search on a sorted array of n elements is:",
      choices: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n log n)" },
        { id: "d", text: "O(1)" },
      ],
      answer: "b",
    },
    {
      id: "d2",
      prompt: "A stack is:",
      choices: [
        { id: "a", text: "FIFO" },
        { id: "b", text: "LIFO" },
        { id: "c", text: "Priority-only" },
        { id: "d", text: "Random access" },
      ],
      answer: "b",
    },
    {
      id: "d3",
      prompt: "Worst-case time of quicksort is:",
      choices: [
        { id: "a", text: "O(n log n)" },
        { id: "b", text: "O(n)" },
        { id: "c", text: "O(n²)" },
        { id: "d", text: "O(log n)" },
      ],
      answer: "c",
    },
    {
      id: "d4",
      prompt: "A hash table average lookup is:",
      choices: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(n)" },
        { id: "c", text: "O(log n)" },
        { id: "d", text: "O(n²)" },
      ],
      answer: "a",
    },
    {
      id: "d5",
      prompt: "BFS on a graph uses which structure?",
      choices: [
        { id: "a", text: "Stack" },
        { id: "b", text: "Queue" },
        { id: "c", text: "Min-heap only" },
        { id: "d", text: "Union-find" },
      ],
      answer: "b",
    },
    {
      id: "d6",
      prompt: "A binary tree with n nodes has at most how many leaves in a complete tree sense — max nodes at last level grows as:",
      choices: [
        { id: "a", text: "n/2 roughly" },
        { id: "b", text: "n²" },
        { id: "c", text: "log n" },
        { id: "d", text: "1" },
      ],
      answer: "a",
    },
  ],
  javascript: [
    {
      id: "js1",
      prompt: "Which keyword declares a block-scoped variable that cannot be reassigned?",
      choices: [
        { id: "a", text: "var" },
        { id: "b", text: "let" },
        { id: "c", text: "const" },
        { id: "d", text: "static" },
      ],
      answer: "c",
    },
    {
      id: "js2",
      prompt: "`typeof null` is:",
      choices: [
        { id: "a", text: "\"null\"" },
        { id: "b", text: "\"object\"" },
        { id: "c", text: "\"undefined\"" },
        { id: "d", text: "\"number\"" },
      ],
      answer: "b",
    },
    {
      id: "js3",
      prompt: "Which array method creates a new array without mutating the original?",
      choices: [
        { id: "a", text: "push" },
        { id: "b", text: "splice" },
        { id: "c", text: "map" },
        { id: "d", text: "sort (in place)" },
      ],
      answer: "c",
    },
    {
      id: "js4",
      prompt: "A Promise that has settled successfully is:",
      choices: [
        { id: "a", text: "pending" },
        { id: "b", text: "fulfilled" },
        { id: "c", text: "rejected" },
        { id: "d", text: "cancelled" },
      ],
      answer: "b",
    },
    {
      id: "js5",
      prompt: "Closures exist because functions:",
      choices: [
        { id: "a", text: "Are compiled to Java" },
        { id: "b", text: "Remember the scope in which they were created" },
        { id: "c", text: "Cannot nest" },
        { id: "d", text: "Always run async" },
      ],
      answer: "b",
    },
    {
      id: "js6",
      prompt: "`===` compares:",
      choices: [
        { id: "a", text: "Value after coercion" },
        { id: "b", text: "Value and type, no coercion" },
        { id: "c", text: "Object identity only" },
        { id: "d", text: "Prototypes" },
      ],
      answer: "b",
    },
  ],
  htmlcss: [
    {
      id: "h1",
      prompt: "The HTML element for the largest heading is:",
      choices: [
        { id: "a", text: "<h6>" },
        { id: "b", text: "<h1>" },
        { id: "c", text: "<head>" },
        { id: "d", text: "<header>" },
      ],
      answer: "b",
    },
    {
      id: "h2",
      prompt: "CSS `display: flex` primarily controls:",
      choices: [
        { id: "a", text: "Font size" },
        { id: "b", text: "Layout of children along axes" },
        { id: "c", text: "Z-index" },
        { id: "d", text: "Animation" },
      ],
      answer: "b",
    },
    {
      id: "h3",
      prompt: "The CSS box model includes:",
      choices: [
        { id: "a", text: "Only width and height" },
        { id: "b", text: "Content, padding, border, margin" },
        { id: "c", text: "Flex and grid" },
        { id: "d", text: "Selectors" },
      ],
      answer: "b",
    },
    {
      id: "h4",
      prompt: "`alt` on `<img>` is for:",
      choices: [
        { id: "a", text: "Styling" },
        { id: "b", text: "Accessible text if the image is missing or for screen readers" },
        { id: "c", text: "SEO only, ignored by browsers" },
        { id: "d", text: "Lazy loading" },
      ],
      answer: "b",
    },
    {
      id: "h5",
      prompt: "Which unit is relative to the root font size?",
      choices: [
        { id: "a", text: "px" },
        { id: "b", text: "em" },
        { id: "c", text: "rem" },
        { id: "d", text: "pt" },
      ],
      answer: "c",
    },
    {
      id: "h6",
      prompt: "Semantic HTML prefers `<nav>` over:",
      choices: [
        { id: "a", text: "<div> for a navigation landmark" },
        { id: "b", text: "<span> only" },
        { id: "c", text: "<table>" },
        { id: "d", text: "<main> for nav" },
      ],
      answer: "a",
    },
  ],
  sql: [
    {
      id: "s1",
      prompt: "Which clause filters rows before grouping?",
      choices: [
        { id: "a", text: "HAVING" },
        { id: "b", text: "WHERE" },
        { id: "c", text: "ORDER BY" },
        { id: "d", text: "LIMIT" },
      ],
      answer: "b",
    },
    {
      id: "s2",
      prompt: "A PRIMARY KEY must be:",
      choices: [
        { id: "a", text: "Nullable" },
        { id: "b", text: "Unique and not null" },
        { id: "c", text: "Always a string" },
        { id: "d", text: "Indexed twice" },
      ],
      answer: "b",
    },
    {
      id: "s3",
      prompt: "`INNER JOIN` returns:",
      choices: [
        { id: "a", text: "All rows from both tables" },
        { id: "b", text: "Only matching rows" },
        { id: "c", text: "Only left table" },
        { id: "d", text: "Cartesian product always" },
      ],
      answer: "b",
    },
    {
      id: "s4",
      prompt: "Which aggregate counts rows?",
      choices: [
        { id: "a", text: "SUM" },
        { id: "b", text: "COUNT" },
        { id: "c", text: "AVG" },
        { id: "d", text: "MAX" },
      ],
      answer: "b",
    },
    {
      id: "s5",
      prompt: "Normalisation is mainly about:",
      choices: [
        { id: "a", text: "Making queries slower" },
        { id: "b", text: "Reducing redundant data and anomalies" },
        { id: "c", text: "Adding more indexes" },
        { id: "d", text: "Denormalising for OLAP only" },
      ],
      answer: "b",
    },
    {
      id: "s6",
      prompt: "A foreign key references:",
      choices: [
        { id: "a", text: "A random column" },
        { id: "b", text: "A key in another (or same) table" },
        { id: "c", text: "An index only" },
        { id: "d", text: "The database name" },
      ],
      answer: "b",
    },
  ],
  git: [
    {
      id: "g1",
      prompt: "Which command records a snapshot of staged files?",
      choices: [
        { id: "a", text: "git add" },
        { id: "b", text: "git commit" },
        { id: "c", text: "git push" },
        { id: "d", text: "git clone" },
      ],
      answer: "b",
    },
    {
      id: "g2",
      prompt: "`git clone` will:",
      choices: [
        { id: "a", text: "Delete a repo" },
        { id: "b", text: "Copy a remote repository locally" },
        { id: "c", text: "Create an empty commit" },
        { id: "d", text: "Merge branches" },
      ],
      answer: "b",
    },
    {
      id: "g3",
      prompt: "A pull request is used to:",
      choices: [
        { id: "a", text: "Force-push to main without review" },
        { id: "b", text: "Propose merging a branch after review" },
        { id: "c", text: "Delete history" },
        { id: "d", text: "Change your email" },
      ],
      answer: "b",
    },
    {
      id: "g4",
      prompt: "`git status` shows:",
      choices: [
        { id: "a", text: "Remote-only tags" },
        { id: "b", text: "Working tree and staging state" },
        { id: "c", text: "CI logs" },
        { id: "d", text: "GitHub stars" },
      ],
      answer: "b",
    },
    {
      id: "g5",
      prompt: "The command that uploads commits to a remote is:",
      choices: [
        { id: "a", text: "git pull" },
        { id: "b", text: "git fetch" },
        { id: "c", text: "git push" },
        { id: "d", text: "git log" },
      ],
      answer: "c",
    },
    {
      id: "g6",
      prompt: "A branch is:",
      choices: [
        { id: "a", text: "A copy of GitHub issues" },
        { id: "b", text: "A movable pointer to a commit" },
        { id: "c", text: "Always named main" },
        { id: "d", text: "A stash" },
      ],
      answer: "b",
    },
  ],
  react: [
    {
      id: "r1",
      prompt: "The hook for state in a function component is:",
      choices: [
        { id: "a", text: "useRef" },
        { id: "b", text: "useState" },
        { id: "c", text: "useId" },
        { id: "d", text: "useMemo only" },
      ],
      answer: "b",
    },
    {
      id: "r2",
      prompt: "Props are:",
      choices: [
        { id: "a", text: "Mutable data owned by the child" },
        { id: "b", text: "Inputs passed from parent to child" },
        { id: "c", text: "CSS only" },
        { id: "d", text: "Global variables" },
      ],
      answer: "b",
    },
    {
      id: "r3",
      prompt: "`useEffect` with an empty dependency array runs:",
      choices: [
        { id: "a", text: "Every render" },
        { id: "b", text: "Once after mount (and cleanup on unmount)" },
        { id: "c", text: "Never" },
        { id: "d", text: "Only on unmount" },
      ],
      answer: "b",
    },
    {
      id: "r4",
      prompt: "Keys in a list help React:",
      choices: [
        { id: "a", text: "Style items" },
        { id: "b", text: "Identify which items changed" },
        { id: "c", text: "Fetch data" },
        { id: "d", text: "Set cookies" },
      ],
      answer: "b",
    },
  ],
  os: [
    {
      id: "o1",
      prompt: "A process in the running state is:",
      choices: [
        { id: "a", text: "Waiting on I/O only" },
        { id: "b", text: "Currently executing on a CPU" },
        { id: "c", text: "Terminated" },
        { id: "d", text: "Swapped out always" },
      ],
      answer: "b",
    },
    {
      id: "o2",
      prompt: "Deadlock requires which of these?",
      choices: [
        { id: "a", text: "A single CPU" },
        { id: "b", text: "Circular wait (among other Coffman conditions)" },
        { id: "c", text: "Virtual memory off" },
        { id: "d", text: "No interrupts" },
      ],
      answer: "b",
    },
    {
      id: "o3",
      prompt: "Virtual memory primarily gives processes:",
      choices: [
        { id: "a", text: "A private address space larger/isolated from physical RAM layout" },
        { id: "b", text: "Faster disks" },
        { id: "c", text: "More cores" },
        { id: "d", text: "No page faults ever" },
      ],
      answer: "a",
    },
    {
      id: "o4",
      prompt: "A context switch is:",
      choices: [
        { id: "a", text: "Compiling code" },
        { id: "b", text: "Saving/restoring CPU state to run another process/thread" },
        { id: "c", text: "Opening a file" },
        { id: "d", text: "DNS lookup" },
      ],
      answer: "b",
    },
  ],
  docker: [
    {
      id: "dk1",
      prompt: "A Docker image is:",
      choices: [
        { id: "a", text: "A running process" },
        { id: "b", text: "An immutable snapshot used to create containers" },
        { id: "c", text: "A virtual machine hypervisor" },
        { id: "d", text: "A Git branch" },
      ],
      answer: "b",
    },
    {
      id: "dk2",
      prompt: "`Dockerfile` instruction to set the default command is often:",
      choices: [
        { id: "a", text: "FROM" },
        { id: "b", text: "CMD or ENTRYPOINT" },
        { id: "c", text: "EXPOSE only" },
        { id: "d", text: "VOLUME only" },
      ],
      answer: "b",
    },
    {
      id: "dk3",
      prompt: "A container vs a VM: containers share:",
      choices: [
        { id: "a", text: "The host kernel" },
        { id: "b", text: "Nothing with the host" },
        { id: "c", text: "The guest BIOS" },
        { id: "d", text: "Hyper-V only" },
      ],
      answer: "a",
    },
    {
      id: "dk4",
      prompt: "`docker compose` is for:",
      choices: [
        { id: "a", text: "Multi-container apps defined in YAML" },
        { id: "b", text: "Replacing Git" },
        { id: "c", text: "Writing SQL" },
        { id: "d", text: "Compiling C" },
      ],
      answer: "a",
    },
  ],
};

export const ASSESS_SKILLS = Object.keys(QUESTIONS);

export function scoreToLevel(score: number, total: number) {
  if (total <= 0) return 0;
  const pct = score / total;
  if (pct >= 0.95) return 5;
  if (pct >= 0.8) return 4;
  if (pct >= 0.6) return 3;
  if (pct >= 0.4) return 2;
  if (pct > 0) return 1;
  return 0;
}
