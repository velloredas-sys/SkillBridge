import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROADMAP_MAP, ytEmbed } from "@/lib/catalog/roadmaps";
import { useMe } from "@/hooks/use-me";
import { toggleLesson } from "@/lib/server/me";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Search = { lesson?: string };

export const Route = createFileRoute("/learn/$slug")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    lesson: typeof s.lesson === "string" ? s.lesson : undefined,
  }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const roadmap = ROADMAP_MAP[slug];
  const { user, completed, refetch } = useMe();
  const qc = useQueryClient();

  if (!roadmap) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl">Roadmap not found</h1>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/learn">Back to catalog</Link>
          </Button>
        </main>
      </div>
    );
  }

  const lessons = roadmap.modules.flatMap((m) => m.lessons);
  const active = lessons.find((l) => l.id === search.lesson) ?? lessons[0];
  const idx = lessons.findIndex((l) => l.id === active?.id);
  const next = idx >= 0 ? lessons[idx + 1] : undefined;
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const done = active ? completed.has(active.id) : false;

  const mut = useMutation({
    mutationFn: async () => {
      if (!active) return;
      if (!user) {
        toast("Sign in to track progress");
        return;
      }
      await toggleLesson({ data: { lessonId: active.id, done: !done } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      refetch();
    },
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Link to="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Catalog
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl">{roadmap.title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{roadmap.tagline}</p>
          </div>
          <Badge>
            {roadmap.lessonCount} lessons · {roadmap.hours}
          </Badge>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {active ? (
              <>
                <div className="overflow-hidden rounded-xl border border-border bg-ink">
                  <div className="relative aspect-video">
                    <iframe
                      title={active.title}
                      src={ytEmbed(active.youtubeId)}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-sans text-xl font-semibold tracking-tight">{active.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {active.creator} · {active.duration} · {active.lang === "hi" ? "Hindi" : "English"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{active.blurb}</p>
                  </div>
                  <Button type="button" variant={done ? "secondary" : "default"} onClick={() => mut.mutate()} disabled={mut.isPending}>
                    <Check className="h-4 w-4" />
                    {done ? "Completed" : "Mark complete"}
                  </Button>
                </div>
                <div className="mt-4 flex gap-2">
                  {prev ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/learn/$slug" params={{ slug }} search={{ lesson: prev.id }}>
                        Previous
                      </Link>
                    </Button>
                  ) : null}
                  {next ? (
                    <Button asChild size="sm">
                      <Link to="/learn/$slug" params={{ slug }} search={{ lesson: next.id }}>
                        Next lesson
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-3">
              {roadmap.modules.map((mod) => (
                <div key={mod.title} className="mb-3 last:mb-0">
                  <p className="px-2 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {mod.title}
                  </p>
                  <ul>
                    {mod.lessons.map((l) => {
                      const isOn = l.id === active?.id;
                      const isDone = completed.has(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to="/learn/$slug"
                            params={{ slug }}
                            search={{ lesson: l.id }}
                            className={cn(
                              "flex items-start gap-2 rounded-md px-2 py-2 text-sm",
                              isOn ? "bg-sage text-accent-foreground" : "hover:bg-muted",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                                isDone ? "border-primary bg-primary text-primary-foreground" : "border-border",
                              )}
                            >
                              {isDone ? <Check className="h-3 w-3" /> : null}
                            </span>
                            <span>
                              <span className="block font-medium leading-snug">{l.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {l.creator} · {l.duration}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
