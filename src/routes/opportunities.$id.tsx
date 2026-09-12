import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea, Label } from "@/components/ui/input";
import { MatchRing } from "@/components/match-ring";
import { SkillMeter } from "@/components/skill-meter";
import { applyToJob, getOpportunity } from "@/lib/server/me";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/hooks/use-me";
import { levelOf, matchPercent } from "@/lib/catalog/match";
import { skillName } from "@/lib/catalog/skills";
import { ROADMAPS } from "@/lib/catalog/roadmaps";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities/$id")({ component: JobDetail });

function JobDetail() {
  const { id } = Route.useParams();
  const numId = Number(id);
  const q = useQuery({
    queryKey: ["job", numId],
    queryFn: () => getOpportunity({ data: { id: numId } }),
    enabled: Number.isFinite(numId),
  });
  const { user, me, skills } = useMe();
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const job = q.data;
  const applied = me?.applications.some((a) => a.opportunityId === numId);

  const mut = useMutation({
    mutationFn: () => applyToJob({ data: { opportunityId: numId, coverNote: note } }),
    onSuccess: (res) => {
      toast(`Applied · ${res.matchPct}% match`);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not apply"),
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        {q.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {!q.isLoading && !job ? (
          <h1 className="text-3xl">Role not found</h1>
        ) : job ? (
          <>
            <p className="text-sm text-muted-foreground">{job.company}</p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-3xl md:text-4xl">{job.title}</h1>
              {user ? <MatchRing value={matchPercent(skills, job.requiredSkills)} size={80} /> : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {job.isDemo ? <Badge>Demo posting</Badge> : null}
              <Badge tone="forest">{job.kind}</Badge>
              <Badge>{job.workMode}</Badge>
              <Badge>{job.location}</Badge>
              {job.stipend ? <Badge>{job.stipend}</Badge> : null}
              {job.duration ? <Badge>{job.duration}</Badge> : null}
            </div>
            {job.isDemo ? (
              <p className="mt-4 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Demo posting — no real recruiter is notified. Applying still saves the role, status, and match % on your
                SkillBridge account (see My applications).
              </p>
            ) : null}
            <p className="mt-6 text-base leading-relaxed text-foreground">{job.description}</p>
            <section className="mt-8">
              <h2 className="font-sans text-base font-semibold">Required skills</h2>
              <div className="mt-4 space-y-4">
                {job.requiredSkills.map((s) => (
                  <div key={s.id}>
                    <SkillMeter label={skillName(s.id)} have={levelOf(skills, s.id)} need={s.level} />
                    {levelOf(skills, s.id) < s.level ? (
                      <Link
                        to="/learn/$slug"
                        params={{
                          slug: ROADMAPS.find((r) => r.skillId === s.id)?.slug ?? "dsa",
                        }}
                        className="mt-1 inline-block text-xs text-primary hover:underline"
                      >
                        Study {skillName(s.id)}
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
            {user && me?.profile?.role === "student" ? (
              <form
                className="mt-10 rounded-xl border border-border bg-card p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  mut.mutate();
                }}
              >
                <h2 className="font-sans text-base font-semibold">{applied ? "Update application" : "Apply"}</h2>
                <div className="mt-3">
                  <Label htmlFor="note">Note to recruiter</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="One paragraph on a project that maps to this role."
                  />
                </div>
                <Button className="mt-4" type="submit" disabled={mut.isPending}>
                  {mut.isPending ? "Sending…" : applied ? "Update" : "Apply with skill match"}
                </Button>
                {applied ? (
                  <p className="mt-3 text-sm">
                    <Link to="/applications" className="text-primary hover:underline">
                      View all applications
                    </Link>
                  </p>
                ) : null}
              </form>
            ) : !user ? (
              <Button asChild className="mt-8">
                <Link to="/login">Sign in to apply</Link>
              </Button>
            ) : null}
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
