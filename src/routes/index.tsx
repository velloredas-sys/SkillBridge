import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROADMAPS, ytThumb } from "@/lib/catalog/roadmaps";
import { ArrowRight, Building2, GraduationCap, UserRound } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const steps = [
  { n: "01", title: "Profile", body: "Name the career you want. Rate what you already know." },
  { n: "02", title: "Assess", body: "Short quizzes turn guesswork into a skill map others can trust." },
  { n: "03", title: "Gaps", body: "See exactly what industry asks for that you do not have yet." },
  { n: "04", title: "Learn", body: "Free courses, in order, from people millions already learned from." },
  { n: "05", title: "Match", body: "Internships and jobs scored against your real skills, not your CGPA." },
  { n: "06", title: "Place", body: "Colleges see cohort gaps. Recruiters see who is actually ready." },
];

function Home() {
  const featured = ROADMAPS.slice(0, 8);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-12 md:py-20">
            <div className="md:col-span-7">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
                Campus to career
              </p>
              <h1 className="mt-4 max-w-xl text-4xl text-foreground md:text-6xl">
                The shortest path from classroom to a real desk.
              </h1>
              <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
                SkillBridge is one map for students, colleges, and industry. Assess what you know,
                close the gaps with free courses, and match internships on skills — not rumours.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/onboarding">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/learn">Browse free courses</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                C, C++, Java, Python, DSA, web, databases, Git — arranged, not searched.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Skill map
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    ["Python", 4, 4],
                    ["DSA", 2, 4],
                    ["SQL", 3, 4],
                    ["Git", 2, 3],
                    ["React", 1, 3],
                  ].map(([name, have, need]) => (
                    <li key={String(name)}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium">{name}</span>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {have}/{need}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={
                              i < Number(have)
                                ? "h-1.5 flex-1 rounded-full bg-primary"
                                : i < Number(need)
                                  ? "h-1.5 flex-1 rounded-full bg-primary/25"
                                  : "h-1.5 flex-1 rounded-full bg-muted"
                            }
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-sage px-4 py-3">
                  <span className="text-sm text-accent-foreground">SDE readiness</span>
                  <span className="font-mono text-lg tabular-nums text-accent-foreground">62%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
            {[
              {
                icon: UserRound,
                title: "Students",
                body: "A skill profile, a gap report, a roadmap, and applications in one place.",
              },
              {
                icon: GraduationCap,
                title: "Colleges",
                body: "See where a cohort is weak against industry demand. Train on purpose.",
              },
              {
                icon: Building2,
                title: "Industry",
                body: "Post roles with required skills. Rank applicants by match, not keywords.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-background p-5">
                <item.icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-sans text-base font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Curriculum</p>
              <h2 className="mt-2 text-3xl md:text-4xl">Everything tech, in order.</h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link to="/learn">All roadmaps</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((r) => {
              const first = r.modules[0]?.lessons[0];
              return (
                <Link
                  key={r.slug}
                  to="/learn/$slug"
                  params={{ slug: r.slug }}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {first ? (
                      <img
                        src={ytThumb(first.youtubeId)}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-sans text-base font-semibold tracking-tight">{r.title}</h3>
                      <Badge>{r.lessonCount} lessons</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.tagline}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-bark text-cream">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-cream/70">The flow</p>
            <h2 className="mt-2 max-w-xl text-3xl text-cream md:text-4xl">
              One ecosystem. Six honest steps.
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-white/15 pt-4">
                  <span className="font-mono text-xs tabular-nums text-cream/50">{s.n}</span>
                  <h3 className="mt-2 font-sans text-lg font-semibold tracking-tight text-cream">{s.title}</h3>
                  <p className="mt-1 text-sm text-cream/70">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card px-6 py-10 md:px-12">
            <h2 className="max-w-xl text-3xl">Stop asking seniors for a YouTube list.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              High-reach instructors, sequenced into roadmaps. English and Hindi. Track progress,
              sit the quiz, and take a match score into the intern season.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/login">Create your skill profile</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/opportunities">See demo internships</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Board listings are labelled demo postings — they do not notify real companies.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
