import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ROADMAPS, ytThumb } from "@/lib/catalog/roadmaps";
import { useMe } from "@/hooks/use-me";
import { useState } from "react";

export const Route = createFileRoute("/learn/")({ component: LearnIndex });

function LearnIndex() {
  const [q, setQ] = useState("");
  const { me, completed } = useMe();
  const query = q.trim().toLowerCase();
  const list = ROADMAPS.filter((r) => {
    if (!query) return true;
    return (
      r.title.toLowerCase().includes(query) ||
      r.tagline.toLowerCase().includes(query) ||
      r.modules.some((m) => m.lessons.some((l) => l.title.toLowerCase().includes(query) || l.creator.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Catalog</p>
        <h1 className="mt-2 text-4xl">Learn, in series.</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Free courses from high-reach instructors, arranged the way a good senior would have told you — not a dump of links.
        </p>
        <div className="mt-6 max-w-md">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Python, DSA, Harry, NeetCode…"
            aria-label="Search courses"
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => {
            const first = r.modules[0]?.lessons[0];
            const ids = r.modules.flatMap((m) => m.lessons.map((l) => l.id));
            const done = ids.filter((id) => completed.has(id)).length;
            return (
              <Link
                key={r.slug}
                to="/learn/$slug"
                params={{ slug: r.slug }}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft"
              >
                <div className="relative aspect-video bg-muted">
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
                    <h2 className="font-sans text-lg font-semibold tracking-tight">{r.title}</h2>
                    <Badge>{r.hours}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.tagline}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {r.lessonCount} lessons · {r.audience}
                    {me?.profile && ids.length ? ` · ${done}/${ids.length} done` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {list.length === 0 ? <p className="mt-10 text-sm text-muted-foreground">Nothing matches that search.</p> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
