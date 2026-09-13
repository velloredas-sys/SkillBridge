import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/lib/catalog/questions";
import { SKILL_MAP, LEVEL_LABEL } from "@/lib/catalog/skills";
import { submitAssessment } from "@/lib/server/me";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ROADMAPS } from "@/lib/catalog/roadmaps";

export const Route = createFileRoute("/assess/$skillId")({ component: QuizPage });

function QuizPage() {
  return (
    <AppShell>
      <QuizInner />
    </AppShell>
  );
}

function QuizInner() {
  const { skillId } = Route.useParams();
  const questions = QUESTIONS[skillId];
  const skill = SKILL_MAP[skillId];
  const qc = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; level: number } | null>(null);

  const mut = useMutation({
    mutationFn: () => submitAssessment({ data: { skillId, answers } }),
    onSuccess: (res) => {
      setResult(res);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  if (!questions) {
    return (
      <div>
        <h1 className="text-3xl">No quiz for this skill yet</h1>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/assess">Back</Link>
        </Button>
      </div>
    );
  }

  const recRoadmap = ROADMAPS.find((r) => r.skillId === skillId) ?? ROADMAPS.find((r) => r.modules.some((m) => m.lessons.some((l) => l.skillIds.includes(skillId))));

  if (result) {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Result</p>
        <h1 className="mt-2 text-4xl">
          {result.score}/{result.total}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Assessed level for {skill?.name ?? skillId}: <strong>{LEVEL_LABEL[result.level]}</strong>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          {recRoadmap ? (
            <Button asChild variant="outline">
              <Link to="/learn/$slug" params={{ slug: recRoadmap.slug }}>
                Study {recRoadmap.title}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const ready = questions.every((q) => answers[q.id]);

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Quiz</p>
      <h1 className="mt-2 text-3xl">{skill?.name ?? skillId}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{questions.length} questions · no timer</p>
      <Link
        to="/assess/$skillId/beta"
        params={{ skillId }}
        className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
      >
        Try the AI Beta version (30 questions) →
      </Link>
      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate();
        }}
      >
        {questions.map((q, i) => (
          <fieldset key={q.id}>
            <legend className="font-sans text-base font-medium">
              <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
              {q.prompt}
            </legend>
            <div className="mt-3 grid gap-2">
              {q.choices.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm",
                    answers[q.id] === c.id ? "border-primary bg-sage" : "border-border bg-card",
                  )}
                >
                  <input
                    type="radio"
                    className="accent-primary"
                    name={q.id}
                    value={c.id}
                    checked={answers[q.id] === c.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                  />
                  {c.text}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <Button type="submit" disabled={!ready || mut.isPending}>
          {mut.isPending ? "Scoring…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
