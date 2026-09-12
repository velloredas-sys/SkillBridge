import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/use-me";
import { addPortfolioItem, deletePortfolioItem } from "@/lib/server/me";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LEVEL_LABEL, SKILLS } from "@/lib/catalog/skills";
import { levelOf } from "@/lib/catalog/match";

export const Route = createFileRoute("/portfolio")({ component: PortfolioPage });

function PortfolioPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { me, skills } = useMe();
  const qc = useQueryClient();
  const [kind, setKind] = useState<"project" | "certification" | "achievement">("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [skillStr, setSkillStr] = useState("");

  const add = useMutation({
    mutationFn: () =>
      addPortfolioItem({
        data: { kind, title, description, url, skills: skillStr },
      }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setUrl("");
      setSkillStr("");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
  const del = useMutation({
    mutationFn: (id: number) => deletePortfolioItem({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  const items = me?.portfolio ?? [];
  const rated = SKILLS.map((s) => ({ s, n: levelOf(skills, s.id) })).filter((x) => x.n > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl">Portfolio</h1>
        <p className="mt-1 text-muted-foreground">Projects, certificates, and the skills that back them.</p>
      </div>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-sans text-base font-semibold">Skill profile</h2>
        {rated.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Rate skills or sit a quiz to populate this.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {rated.map(({ s, n }) => (
              <Badge key={s.id} tone="forest">
                {s.short} · {LEVEL_LABEL[n]}
              </Badge>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-sans text-base font-semibold">Work</h2>
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge>{item.kind}</Badge>
                  <h3 className="mt-2 font-sans font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  {item.url ? (
                    <a href={item.url} className="mt-2 inline-block text-sm text-primary hover:underline" target="_blank" rel="noreferrer">
                      {item.url}
                    </a>
                  ) : null}
                </div>
                <Button size="sm" variant="ghost" onClick={() => del.mutate(item.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <form
        className="rounded-xl border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <h2 className="font-sans text-base font-semibold">Add an item</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["project", "certification", "achievement"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={
                kind === k
                  ? "h-9 rounded-md bg-primary px-3 text-sm text-primary-foreground"
                  : "h-9 rounded-md bg-muted px-3 text-sm text-muted-foreground"
              }
            >
              {k}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Label htmlFor="pt">Title</Label>
          <Input id="pt" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mt-3">
          <Label htmlFor="pd">Description</Label>
          <Textarea id="pd" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mt-3">
          <Label htmlFor="pu">URL</Label>
          <Input id="pu" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        </div>
        <div className="mt-3">
          <Label htmlFor="ps">Skills</Label>
          <Input id="ps" value={skillStr} onChange={(e) => setSkillStr(e.target.value)} placeholder="Python, SQL, React" />
        </div>
        <Button className="mt-4" type="submit" disabled={add.isPending}>
          {add.isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </div>
  );
}
