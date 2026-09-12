import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PlanMarkdown } from "@/components/plan-markdown";
import { Button } from "@/components/ui/button";
import { MatchRing } from "@/components/match-ring";
import { SkillMeter } from "@/components/skill-meter";
import { useMe } from "@/hooks/use-me";
import { CAREER_MAP } from "@/lib/catalog/roles";
import { gapsForGoal, matchPercent, readinessForGoal, recommendLessons } from "@/lib/catalog/match";
import { findLesson, ROADMAPS } from "@/lib/catalog/roadmaps";
import { campusAverages, demandGaps } from "@/lib/catalog/cohort";
import { generatePlan, listOpportunities } from "@/lib/server/me";
import { useMutation, useQuery } from "@tanstack/react-query";
import { skillName } from "@/lib/catalog/skills";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  return (
    <AppShell>
      <DashInner />
    </AppShell>
  );
}

function DashInner() {
  const { me, skills, completed } = useMe();
  const profile = me?.profile;
  if (!profile) return null;
  if (profile.role === "industry") return <IndustryDash />;
  if (profile.role === "college") return <CollegeDash />;
  return <StudentDash />;
}

function StudentDash() {
  const { me, skills, completed } = useMe();
  const profile = me!.profile!;
  const goal = CAREER_MAP[profile.careerGoal];
  const ready = readinessForGoal(skills, profile.careerGoal);
  const gaps = gapsForGoal(skills, profile.careerGoal).filter((g) => g.gap > 0);
  const recs = recommendLessons(gaps, completed, 4);
  const jobsQ = useQuery({ queryKey: ["jobs"], queryFn: () => listOpportunities() });
  const ranked = (jobsQ.data ?? [])
    .map((job) => ({ job, pct: matchPercent(skills, job.requiredSkills) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const [plan, setPlan] = useState<string | null>(null);
  const [planSource, setPlanSource] = useState<"ai" | "fallback" | null>(null);
  const ai = useMutation({
    mutationFn: () => generatePlan({ data: { force: Boolean(plan) } }),
    onSuccess: (res) => {
      setPlan(res.text);
      setPlanSource(res.source);
    },
    onError: () => {
      setPlan(
        "Could not write a plan right now. Rate your skills or sit a quiz, then try again — SkillBridge will still sequence an 8-week path from your gaps.",
      );
      setPlanSource("fallback");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl md:text-4xl">{profile.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.headline || (goal ? `Working toward ${goal.title}` : "Set a career goal")}
            {" · "}
            <Link to="/profile" className="text-primary hover:underline">
              Switch to Recruiter or College
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
          <MatchRing value={ready} />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Readiness</p>
            <p className="font-medium">{goal?.title ?? "Pick a goal"}</p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-base font-semibold">Skill gaps</h2>
            <Button asChild size="sm" variant="outline">
              <Link to="/assess">Take a quiz</Link>
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {gaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No open gaps against this goal — or rate your skills to see one.
              </p>
            ) : (
              gaps.slice(0, 5).map((g) => <SkillMeter key={g.skillId} label={g.name} have={g.have} need={g.need} />)
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-sans text-base font-semibold">Next lessons</h2>
          <ul className="mt-3 space-y-2">
            {recs.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                <Link to="/learn" className="underline-offset-4 hover:underline">
                  Browse the catalog
                </Link>
              </li>
            ) : (
              recs.map((r) => {
                const found = findLesson(r.lessonId);
                if (!found) return null;
                return (
                  <li key={r.lessonId}>
                    <Link
                      to="/learn/$slug"
                      params={{ slug: found.roadmap.slug }}
                      search={{ lesson: found.lesson.id }}
                      className="block rounded-md px-2 py-2 hover:bg-muted"
                    >
                      <span className="block text-sm font-medium">{found.lesson.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {found.lesson.creator} · {skillName(r.skillId)}
                      </span>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-base font-semibold">Best matches</h2>
          <div className="flex gap-3 text-sm">
            <Link to="/applications" className="text-primary hover:underline">
              My applications
            </Link>
            <Link to="/portfolio" className="text-primary hover:underline">
              Portfolio
            </Link>
            <Link to="/opportunities" className="text-primary hover:underline">
              All roles
            </Link>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {ranked.map(({ job, pct }) => (
            <Link
              key={job.id}
              to="/opportunities/$id"
              params={{ id: String(job.id) }}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {job.company}
                    {job.isDemo ? " · Demo" : ""}
                  </p>
                  <h3 className="font-sans text-sm font-semibold">{job.title}</h3>
                </div>
                <MatchRing value={pct} size={52} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {job.location} · {job.stipend}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-base font-semibold">8-week plan</h2>
            <p className="text-sm text-muted-foreground">Sequence your skill gaps into weeks. Refresh any time after a quiz.</p>
          </div>
          <Button type="button" onClick={() => ai.mutate()} disabled={ai.isPending}>
            {ai.isPending ? "Writing…" : plan ? "Refresh plan" : "Generate plan"}
          </Button>
        </div>
        {plan ? (
          <>
            {planSource === "fallback" ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Built from your ratings and the catalog — a working plan, not a raw error.
              </p>
            ) : null}
            <PlanMarkdown text={plan} />
          </>
        ) : null}
      </section>
    </div>
  );
}

function IndustryDash() {
  const { me } = useMe();
  const profile = me!.profile!;
  const jobs = me?.myJobs ?? [];
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">{profile.companyName || "Recruiter"}</p>
        <h1 className="text-3xl md:text-4xl">{profile.name}</h1>
        <p className="mt-1 text-muted-foreground">Post roles with required skills. Rank who actually matches.</p>
        <p className="mt-2 text-sm">
          <Link to="/profile" className="text-primary hover:underline">
            Switch workspace
          </Link>
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/recruit">Post a role</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/opportunities">View the board</Link>
        </Button>
      </div>
      <section>
        <h2 className="font-sans text-base font-semibold">Your roles</h2>
        {jobs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nothing posted yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {jobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">{j.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {j.kind} · {j.location}
                  </p>
                </div>
                <Link to="/recruit" className="text-sm text-primary">
                  Applicants
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CollegeDash() {
  const { me } = useMe();
  const profile = me!.profile!;
  const avg = campusAverages(profile.collegeName);
  const gaps = demandGaps(avg).slice(0, 6);
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">{profile.collegeName || "Campus"}</p>
        <h1 className="text-3xl md:text-4xl">Skill-gap desk</h1>
        <p className="mt-1 text-muted-foreground">
          Aggregated CS cohort vs what product companies are hiring for. No student-level records here.
          Figures are illustrative for this SIH demo until a college connects live student data.
        </p>
        <p className="mt-2 text-sm">
          <Link to="/profile" className="text-primary hover:underline">
            Switch workspace
          </Link>
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Tracks in catalog" value={String(ROADMAPS.length)} />
        <Stat label="Largest gap" value={gaps[0]?.name ?? "—"} />
        <Stat label="Demand signal" value="SDE / full-stack" />
      </div>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-sans text-base font-semibold">Where to run training</h2>
        <div className="mt-4 space-y-4">
          {gaps.map((g) => (
            <SkillMeter key={g.skillId} label={g.name} have={Math.round(g.have)} need={Math.round(g.need)} />
          ))}
        </div>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/analytics">Open analytics</Link>
        </Button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
