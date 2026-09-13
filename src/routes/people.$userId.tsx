import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, FollowButton, PersonRow } from "@/components/person-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillMeter } from "@/components/skill-meter";
import { getPublicProfile, listFollowers, listFollowing, toggleFollow } from "@/lib/server/social";
import { CATEGORY_LABEL, SKILLS } from "@/lib/catalog/skills";
import { effectiveLevel } from "@/lib/catalog/roles";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/people/$userId")({ component: PublicProfilePage });

function PublicProfilePage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

const ROLE_LABEL = { student: "Student", industry: "Recruiter", college: "College" } as const;

function Inner() {
  const { userId } = Route.useParams();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"skills" | "followers" | "following">("skills");

  const query = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: () => getPublicProfile({ data: { userId } }),
  });

  const followersQuery = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => listFollowers({ data: { userId } }),
    enabled: tab === "followers",
  });
  const followingQuery = useQuery({
    queryKey: ["following", userId],
    queryFn: () => listFollowing({ data: { userId } }),
    enabled: tab === "following",
  });

  const mut = useMutation({
    mutationFn: (follow: boolean) => toggleFollow({ data: { userId, follow } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["public-profile", userId] });
      qc.invalidateQueries({ queryKey: ["people-search"] });
      qc.invalidateQueries({ queryKey: ["followers", userId] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update follow"),
  });

  const profile = query.data;

  if (query.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!profile) return <h1 className="text-3xl">Profile not found</h1>;

  const skillRows = profile.skills
    .map((s) => ({ ...s, meta: SKILLS.find((sk) => sk.id === s.skillId) }))
    .filter((s) => s.meta && (s.selfLevel > 0 || (s.assessedLevel ?? 0) > 0));
  const byCategory = new Map<string, typeof skillRows>();
  for (const s of skillRows) {
    const cat = s.meta!.category;
    byCategory.set(cat, [...(byCategory.get(cat) ?? []), s]);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={profile.name} avatarUrl={profile.avatarUrl} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{profile.name || "Unnamed"}</h1>
            <Badge tone="forest">{ROLE_LABEL[profile.role]}</Badge>
          </div>
          {profile.headline ? <p className="text-sm text-muted-foreground">{profile.headline}</p> : null}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[profile.collegeName, profile.companyName, profile.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        {!profile.isSelf ? (
          <div className="flex shrink-0 items-center gap-2">
            <FollowButton
              size="default"
              isFollowing={profile.isFollowing}
              pending={mut.isPending}
              onToggle={() => mut.mutate(!profile.isFollowing)}
            />
            <Button asChild variant="outline">
              <Link to="/messages/$userId" params={{ userId }}>
                <MessageCircle className="h-4 w-4" />
                Message
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      {profile.bio ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{profile.bio}</p> : null}

      <div className="flex gap-1 border-b border-border text-sm">
        {(["skills", "followers", "following"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 font-medium capitalize ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "skills" ? "Skill cards" : t === "followers" ? `Followers (${profile.followerCount})` : `Following (${profile.followingCount})`}
          </button>
        ))}
      </div>

      {tab === "skills" ? (
        <div className="space-y-6">
          {byCategory.size === 0 ? (
            <p className="text-sm text-muted-foreground">No skills assessed yet.</p>
          ) : (
            Array.from(byCategory.entries()).map(([cat, rows]) => (
              <section key={cat}>
                <h2 className="font-sans text-sm font-semibold text-muted-foreground">
                  {CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {rows.map((s) => (
                    <div key={s.skillId} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                      <SkillMeter label={s.meta!.name} have={effectiveLevel(s.selfLevel, s.assessedLevel)} />
                      <p className="mt-2 text-xs text-muted-foreground">{s.meta!.blurb}</p>
                      {s.assessedLevel != null ? <Badge className="mt-2">Assessed</Badge> : null}
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}

          {profile.portfolio.length > 0 ? (
            <section>
              <h2 className="font-sans text-sm font-semibold text-muted-foreground">Portfolio</h2>
              <div className="mt-3 space-y-2">
                {profile.portfolio.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-card p-3">
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.description ? <p className="text-xs text-muted-foreground">{item.description}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {profile.postedJobs.length > 0 ? (
            <section>
              <h2 className="font-sans text-sm font-semibold text-muted-foreground">Open roles posted</h2>
              <div className="mt-3 space-y-2">
                {profile.postedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to="/opportunities/$id"
                    params={{ id: String(job.id) }}
                    className="block rounded-lg border border-border bg-card p-3 hover:bg-muted"
                  >
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.company} · {job.location}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : tab === "followers" ? (
        <div className="space-y-2">
          {followersQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {followersQuery.data?.length === 0 ? <p className="text-sm text-muted-foreground">No followers yet.</p> : null}
          {followersQuery.data?.map((p) => (
            <PersonRow key={p.userId} person={p} to="/people/$userId" subline={p.headline} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {followingQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {followingQuery.data?.length === 0 ? <p className="text-sm text-muted-foreground">Not following anyone yet.</p> : null}
          {followingQuery.data?.map((p) => (
            <PersonRow key={p.userId} person={p} to="/people/$userId" subline={p.headline} />
          ))}
        </div>
      )}
    </div>
  );
}
