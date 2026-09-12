import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MatchRing } from "@/components/match-ring";
import { useMe } from "@/hooks/use-me";
import { createJob, listApplicants, setApplicationStatus } from "@/lib/server/me";
import { SKILLS } from "@/lib/catalog/skills";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { Opportunity } from "@/lib/types";

export const Route = createFileRoute("/recruit")({ component: RecruitPage });

function RecruitPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { me } = useMe();
  const profile = me?.profile;
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"internship" | "job">("internship");
  const [location, setLocation] = useState("Bengaluru");
  const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "onsite">("hybrid");
  const [stipend, setStipend] = useState("");
  const [duration, setDuration] = useState("12 weeks");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("Rolling");
  const [req, setReq] = useState<Record<string, number>>({ dsa: 3, git: 3 });
  const [openId, setOpenId] = useState<number | null>(me?.myJobs[0]?.id ?? null);

  const post = useMutation({
    mutationFn: () =>
      createJob({
        data: {
          title,
          company: profile?.companyName ?? "",
          kind,
          location,
          workMode,
          stipend,
          duration,
          description,
          deadline,
          requiredSkills: Object.entries(req)
            .filter(([, l]) => l > 0)
            .map(([id, level]) => ({ id, level })),
        },
      }),
    onSuccess: (job) => {
      toast("Role posted");
      setTitle("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["me"] });
      setOpenId(job.id);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not post"),
  });

  if (profile && profile.role !== "industry") {
    return (
      <div>
        <h1 className="text-3xl">Recruiting desk</h1>
        <p className="mt-2 text-muted-foreground">Switch to an industry profile to post roles.</p>
      </div>
    );
  }

  const jobs = me?.myJobs ?? [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl md:text-4xl">Recruit</h1>
        <p className="mt-1 text-muted-foreground">Required skills drive the match score students see.</p>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-sans text-base font-semibold">Post a role</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            post.mutate();
          }}
        >
          <div>
            <Label htmlFor="rt">Title</Label>
            <Input id="rt" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="SDE Intern" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Type</Label>
              <div className="flex gap-2">
                {(["internship", "job"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={kind === k ? "h-11 flex-1 rounded-md bg-primary text-sm text-primary-foreground" : "h-11 flex-1 rounded-md bg-muted text-sm"}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="rl">Location</Label>
              <Input id="rl" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="rs">Stipend / CTC</Label>
              <Input id="rs" value={stipend} onChange={(e) => setStipend(e.target.value)} placeholder="₹80,000 / mo" />
            </div>
            <div>
              <Label htmlFor="rd">Duration</Label>
              <Input id="rd" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rk">Deadline</Label>
              <Input id="rk" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Work mode</Label>
            <div className="flex gap-2">
              {(["hybrid", "remote", "onsite"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setWorkMode(m)}
                  className={workMode === m ? "h-11 flex-1 rounded-md bg-secondary text-sm text-secondary-foreground" : "h-11 flex-1 rounded-md bg-muted text-sm"}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="rdesc">Description</Label>
            <Textarea id="rdesc" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Required skills (0–5)</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {SKILLS.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{s.short}</span>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={req[s.id] ?? 0}
                    onChange={(e) => setReq((p) => ({ ...p, [s.id]: Number(e.target.value) }))}
                    className="max-w-32 accent-primary"
                  />
                  <span className="w-4 font-mono tabular-nums text-muted-foreground">{req[s.id] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={post.isPending}>
            {post.isPending ? "Posting…" : "Publish role"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="font-sans text-base font-semibold">Your postings</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {jobs.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => setOpenId(j.id)}
              className={openId === j.id ? "rounded-full bg-primary px-3 py-2 text-sm text-primary-foreground" : "rounded-full bg-muted px-3 py-2 text-sm"}
            >
              {j.title}
            </button>
          ))}
        </div>
        {openId ? <ApplicantList opportunityId={openId} job={jobs.find((j) => j.id === openId)} /> : null}
      </section>
    </div>
  );
}

function ApplicantList({ opportunityId, job }: { opportunityId: number; job?: Opportunity }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["applicants", opportunityId],
    queryFn: () => listApplicants({ data: { opportunityId } }),
  });
  const mut = useMutation({
    mutationFn: (input: { applicationId: number; status: "applied" | "shortlisted" | "rejected" }) =>
      setApplicationStatus({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applicants", opportunityId] }),
  });

  return (
    <div className="mt-4 rounded-xl border border-border bg-card">
      {job ? (
        <p className="border-b border-border px-4 py-3 text-sm text-muted-foreground">
          {job.company} · {job.location}
        </p>
      ) : null}
      {(q.data ?? []).length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No applicants yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {(q.data ?? []).map((row) => (
            <li key={row.application.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <MatchRing value={row.application.matchPct} size={52} />
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.collegeName} · {row.headline || row.careerGoal}
                  </p>
                  {row.application.coverNote ? (
                    <p className="mt-1 text-sm text-muted-foreground">{row.application.coverNote}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{row.application.status}</Badge>
                <Button size="sm" variant="outline" onClick={() => mut.mutate({ applicationId: row.application.id, status: "shortlisted" })}>
                  Shortlist
                </Button>
                <Button size="sm" variant="ghost" onClick={() => mut.mutate({ applicationId: row.application.id, status: "rejected" })}>
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
