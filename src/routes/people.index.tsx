import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Input } from "@/components/ui/input";
import { FollowButton, PersonRow } from "@/components/person-row";
import { searchPeople, toggleFollow } from "@/lib/server/social";
import { useMe } from "@/hooks/use-me";
import { toast } from "sonner";

export const Route = createFileRoute("/people/")({ component: PeoplePage });

function PeoplePage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const [q, setQ] = useState("");
  const { user } = useMe();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["people-search", q],
    queryFn: () => searchPeople({ data: { query: q } }),
    enabled: Boolean(user),
  });

  const mut = useMutation({
    mutationFn: (vars: { userId: string; follow: boolean }) => toggleFollow({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["people-search"] });
      qc.invalidateQueries({ queryKey: ["public-profile"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not update follow"),
  });

  const people = query.data ?? [];

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-3xl">People</h1>
        <p className="text-sm text-muted-foreground">
          Find students, recruiters, and colleges on SkillBridge. Follow them or send a DM.
        </p>
      </div>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, headline, college, or company…"
        aria-label="Search people"
      />
      <div className="space-y-2">
        {query.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {!query.isLoading && people.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one matches that search yet.</p>
        ) : null}
        {people.map((p) => (
          <PersonRow
            key={p.userId}
            person={p}
            to="/people/$userId"
            subline={p.headline || p.collegeName || p.companyName || undefined}
            trailing={
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {p.followerCount} follower{p.followerCount === 1 ? "" : "s"}
                </span>
                <FollowButton
                  isFollowing={p.isFollowing}
                  pending={mut.isPending && mut.variables?.userId === p.userId}
                  onToggle={() => mut.mutate({ userId: p.userId, follow: !p.isFollowing })}
                />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
