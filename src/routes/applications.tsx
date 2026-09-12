import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { MatchRing } from "@/components/match-ring";
import { useMe } from "@/hooks/use-me";
import { listOpportunities } from "@/lib/server/me";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/applications")({ component: ApplicationsPage });

const STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

function ApplicationsPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { me } = useMe();
  const jobsQ = useQuery({ queryKey: ["jobs"], queryFn: () => listOpportunities() });
  const jobs = jobsQ.data ?? [];
  const apps = [...(me?.applications ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl">My applications</h1>
        <p className="mt-1 text-muted-foreground">
          Every role you applied to on SkillBridge, with the match score saved at apply time.
        </p>
      </div>
      {apps.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">You have not applied to anything yet.</p>
          <Link to="/opportunities" className="mt-3 inline-block text-sm text-primary hover:underline">
            Browse internships
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {apps.map((app) => {
            const job = jobs.find((j) => j.id === app.opportunityId);
            return (
              <li key={app.id}>
                <Link
                  to="/opportunities/$id"
                  params={{ id: String(app.opportunityId) }}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs text-muted-foreground">{job?.company ?? "Role"}</p>
                      {job?.isDemo ? <Badge>Demo posting</Badge> : null}
                      <Badge tone="forest">{STATUS_LABEL[app.status] ?? app.status}</Badge>
                    </div>
                    <h2 className="mt-1 font-sans text-lg font-semibold tracking-tight">
                      {job?.title ?? `Opportunity #${app.opportunityId}`}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job ? `${job.location} · ${job.kind}` : "Saved application"}
                      {app.coverNote ? ` · “${app.coverNote.slice(0, 80)}${app.coverNote.length > 80 ? "…" : ""}”` : ""}
                    </p>
                  </div>
                  <MatchRing value={app.matchPct} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">
        Demo postings do not notify a real recruiter. Your application still stays on this account.
      </p>
    </div>
  );
}
