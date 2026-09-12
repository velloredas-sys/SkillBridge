import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MatchRing } from "@/components/match-ring";
import { listOpportunities } from "@/lib/server/me";
import { useQuery } from "@tanstack/react-query";
import { useMe } from "@/hooks/use-me";
import { matchPercent } from "@/lib/catalog/match";
import { skillShort } from "@/lib/catalog/skills";
import { useState } from "react";

export const Route = createFileRoute("/opportunities/")({ component: JobsIndex });

function JobsIndex() {
  const q = useQuery({ queryKey: ["jobs"], queryFn: () => listOpportunities() });
  const { user, skills } = useMe();
  const [term, setTerm] = useState("");
  const [kind, setKind] = useState<"all" | "internship" | "job">("all");
  const list = (q.data ?? [])
    .filter((j) => (kind === "all" ? true : j.kind === kind))
    .filter((j) => {
      const t = term.trim().toLowerCase();
      if (!t) return true;
      return (
        j.title.toLowerCase().includes(t) ||
        j.company.toLowerCase().includes(t) ||
        j.location.toLowerCase().includes(t)
      );
    })
    .map((job) => ({
      job,
      pct: user ? matchPercent(skills, job.requiredSkills) : null,
    }))
    .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Opportunities</p>
        <h1 className="mt-2 text-4xl">Internships and jobs, scored on skills.</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Required skills come from the posting. Your match uses assessed levels when you have them.
        </p>
        <p className="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          Listings marked <span className="font-medium text-foreground">Demo posting</span> are sample roles for this
          SIH prototype. Applying does not notify a real recruiter — it saves the match on your account.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="w-full max-w-sm">
            <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search company or role" />
          </div>
          <div className="flex gap-1">
            {(["all", "internship", "job"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={
                  kind === k
                    ? "h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                    : "h-11 rounded-md bg-muted px-3 text-sm font-medium text-muted-foreground"
                }
              >
                {k === "all" ? "All" : k === "internship" ? "Internships" : "Jobs"}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-8 space-y-3">
          {list.map(({ job, pct }) => (
            <li key={job.id}>
              <Link
                to="/opportunities/$id"
                params={{ id: String(job.id) }}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  <h2 className="font-sans text-lg font-semibold tracking-tight">{job.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.location} · {job.workMode} · {job.stipend}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.isDemo ? <Badge>Demo posting</Badge> : null}
                    {job.requiredSkills.map((s) => (
                      <Badge key={s.id}>
                        {skillShort(s.id)} {s.level}
                      </Badge>
                    ))}
                  </div>
                </div>
                {pct != null ? <MatchRing value={pct} /> : <Badge>Sign in to match</Badge>}
              </Link>
            </li>
          ))}
        </ul>
        {q.isLoading ? <p className="mt-8 text-sm text-muted-foreground">Loading roles…</p> : null}
        {!q.isLoading && list.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">No roles match.</p> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
