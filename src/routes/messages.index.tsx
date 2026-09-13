import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/person-row";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listConversations, searchPeople } from "@/lib/server/social";
import { useMe } from "@/hooks/use-me";
import { formatDistanceToNowStrict } from "date-fns";

export const Route = createFileRoute("/messages/")({ component: MessagesIndex });

function MessagesIndex() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { user } = useMe();
  const [q, setQ] = useState("");

  const convos = useQuery({
    queryKey: ["conversations"],
    queryFn: () => listConversations(),
    enabled: Boolean(user),
    refetchInterval: 15_000,
  });

  const search = useQuery({
    queryKey: ["people-search", q],
    queryFn: () => searchPeople({ data: { query: q } }),
    enabled: Boolean(user) && q.trim().length > 0,
  });

  const showSearch = q.trim().length > 0;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl">Messages</h1>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search people to start a new chat…"
        aria-label="Search people"
      />

      {showSearch ? (
        <div className="space-y-2">
          {search.isLoading ? <p className="text-sm text-muted-foreground">Searching…</p> : null}
          {!search.isLoading && (search.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No one matches that search.</p>
          ) : null}
          {(search.data ?? []).map((p) => (
            <Link
              key={p.userId}
              to="/messages/$userId"
              params={{ userId: p.userId }}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:bg-muted"
            >
              <Avatar name={p.name} avatarUrl={p.avatarUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name || "Unnamed"}</p>
                <p className="truncate text-xs text-muted-foreground">{p.headline}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {convos.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
          {!convos.isLoading && (convos.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No conversations yet — search for someone above to say hi.
            </p>
          ) : null}
          {(convos.data ?? []).map((c) => (
            <Link
              key={c.otherUserId}
              to="/messages/$userId"
              params={{ userId: c.otherUserId }}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 hover:bg-muted"
            >
              <Avatar name={c.name} avatarUrl={c.avatarUrl} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.name || "Unnamed"}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {c.lastAt ? formatDistanceToNowStrict(new Date(c.lastAt), { addSuffix: true }) : ""}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {c.lastSenderId === user?.id ? "You: " : ""}
                  {c.lastBody || (c.lastAttachmentKind === "image" ? "📷 Photo" : c.lastAttachmentKind === "file" ? "📎 Attachment" : "")}
                </p>
              </div>
              {c.unreadCount > 0 ? <Badge tone="forest">{c.unreadCount}</Badge> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
