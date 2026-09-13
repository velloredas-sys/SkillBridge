import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { ASSESS_SKILLS, QUESTIONS } from "@/lib/catalog/questions";
import { SKILL_MAP } from "@/lib/catalog/skills";
import { useMe } from "@/hooks/use-me";
import { LEVEL_LABEL } from "@/lib/catalog/skills";

export const Route = createFileRoute("/assess/")({ component: AssessIndex });

function AssessIndex() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { skills } = useMe();
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Assessment</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Prove it in ten minutes.</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Short multiple-choice quizzes. Your assessed level replaces self-rating in match scores.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ASSESS_SKILLS.map((id) => {
          const skill = SKILL_MAP[id];
          const row = skills[id];
          const n = QUESTIONS[id]?.length ?? 0;
          return (
            <div key={id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-sans text-base font-semibold">{skill?.name ?? id}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{n} questions</p>
                </div>
                {row?.assessed != null ? (
                  <Badge tone="forest">{LEVEL_LABEL[row.assessed]}</Badge>
                ) : (
                  <Badge>Not taken</Badge>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <Link to="/assess/$skillId" params={{ skillId: id }} className="font-medium text-primary hover:underline">
                  Take quiz
                </Link>
                <Link to="/assess/$skillId/beta" params={{ skillId: id }} className="font-medium text-primary hover:underline">
                  Try AI Beta (30 Qs)
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
