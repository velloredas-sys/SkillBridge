import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SKILL_MAP, LEVEL_LABEL } from "@/lib/catalog/skills";
import { ROADMAPS } from "@/lib/catalog/roadmaps";
import { generateAiQuiz, submitAiQuiz } from "@/lib/server/ai-quiz";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assess/$skillId/beta")({ component: BetaQuizPage });

type ClientQuestion = { id: string; prompt: string; choices: { id: string; text: string }[] };

type Stage =
  | { name: "setup" }
  | { name: "generating" }
  | { name: "error" }
  | { name: "quiz"; attemptId: number; questions: ClientQuestion[]; timerSeconds: number | null }
  | { name: "result"; score: number; total: number; level: number };

const TIMER_OPTIONS: { label: string; seconds: number | null }[] = [
  { label: "No timer", seconds: null },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "20 min", seconds: 1200 },
];

function BetaQuizPage() {
  return (
    <AppShell>
      <BetaQuizInner />
    </AppShell>
  );
}

function BetaQuizInner() {
  const { skillId } = Route.useParams();
  const skill = SKILL_MAP[skillId];
  const qc = useQueryClient();
  const [stage, setStage] = useState<Stage>({ name: "setup" });
  const [timerChoice, setTimerChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const generateMut = useMutation({
    mutationFn: () => generateAiQuiz({ data: { skillId, timerSeconds: timerChoice } }),
    onMutate: () => setStage({ name: "generating" }),
    onSuccess: (res) => {
      setAnswers({});
      setStage({
        name: "quiz",
        attemptId: res.attemptId,
        questions: res.questions,
        timerSeconds: res.timerSeconds,
      });
    },
    onError: () => setStage({ name: "error" }),
  });

  const submitMut = useMutation({
    mutationFn: (attemptId: number) => submitAiQuiz({ data: { attemptId, answers } }),
    onSuccess: (res) => {
      setStage({ name: "result", score: res.score, total: res.total, level: res.level });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const attemptId = stage.name === "quiz" ? stage.attemptId : null;
  const timeLeft = useCountdown(stage.name === "quiz" ? stage.timerSeconds : null, () => {
    if (attemptId != null && !submitMut.isPending) submitMut.mutate(attemptId);
  });

  if (!skill) {
    return (
      <div>
        <h1 className="text-3xl">Unknown skill</h1>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/assess">Back</Link>
        </Button>
      </div>
    );
  }

  const recRoadmap =
    ROADMAPS.find((r) => r.skillId === skillId) ??
    ROADMAPS.find((r) => r.modules.some((m) => m.lessons.some((l) => l.skillIds.includes(skillId))));

  if (stage.name === "setup") {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">AI Beta</p>
        <h1 className="mt-2 text-3xl">{skill.name} — AI-generated quiz</h1>
        <p className="mt-2 text-muted-foreground">
          30 fresh questions written for this attempt — longer and harder than the standard
          5-question quiz. Your assessed level updates the same way either quiz you take.
        </p>
        <div className="mt-6">
          <p className="text-sm font-medium">Timer</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setTimerChoice(opt.seconds)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  timerChoice === opt.seconds ? "border-primary bg-sage" : "border-border bg-card",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => generateMut.mutate()}>Generate my quiz</Button>
          <Button asChild variant="outline">
            <Link to="/assess/$skillId" params={{ skillId }}>
              Use standard quiz instead
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (stage.name === "generating") {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">AI Beta</p>
        <h1 className="mt-2 text-3xl">Writing your quiz…</h1>
        <p className="mt-2 text-muted-foreground">
          Generating 30 questions for {skill.name}. Usually takes a few seconds.
        </p>
      </div>
    );
  }

  if (stage.name === "error") {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">AI Beta</p>
        <h1 className="mt-2 text-3xl">AI quiz isn't available right now</h1>
        <p className="mt-2 text-muted-foreground">
          That can happen. The standard quiz still works and counts the same way toward your
          assessed level.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => generateMut.mutate()}>Try again</Button>
          <Button asChild variant="outline">
            <Link to="/assess/$skillId" params={{ skillId }}>
              Take standard quiz
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (stage.name === "result") {
    return (
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Result · AI Beta</p>
        <h1 className="mt-2 text-4xl">
          {stage.score}/{stage.total}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Assessed level for {skill.name}: <strong>{LEVEL_LABEL[stage.level]}</strong>
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

  const ready = stage.questions.every((q) => answers[q.id]);
  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">AI Beta quiz</p>
          <h1 className="mt-2 text-3xl">{skill.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stage.questions.length} questions{stage.timerSeconds ? "" : " · no timer"}
          </p>
        </div>
        {timeLeft != null ? (
          <Badge tone={timeLeft <= 60 ? "warn" : "forest"}>{formatTime(timeLeft)}</Badge>
        ) : null}
      </div>
      <form
        className="mt-8 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          submitMut.mutate(stage.attemptId);
        }}
      >
        {stage.questions.map((q, i) => (
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
        <Button type="submit" disabled={!ready || submitMut.isPending}>
          {submitMut.isPending ? "Scoring…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Ticks down from `totalSeconds` (or stays null forever when untimed) and
 * fires `onExpire` once, exactly when it hits zero. */
function useCountdown(totalSeconds: number | null, onExpire: () => void) {
  const [left, setLeft] = useState<number | null>(totalSeconds);

  useEffect(() => {
    setLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (left == null) return;
    if (left <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setLeft((v) => (v == null ? v : v - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  return left;
}
