import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { RequireAuth, PageSkeleton } from "@/components/require-auth";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { CAREER_GOALS } from "@/lib/catalog/roles";
import { SKILLS } from "@/lib/catalog/skills";
import { saveProfile, setSelfSkill } from "@/lib/server/me";
import { useMe } from "@/hooks/use-me";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  return (
    <RequireAuth>
      <OnboardingInner />
    </RequireAuth>
  );
}

function OnboardingInner() {
  const { me, isLoading, user } = useMe();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState(user?.displayName ?? "");
  const [collegeName, setCollegeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [yearLabel, setYearLabel] = useState("3rd year");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [careerGoal, setCareerGoal] = useState("sde");
  const [self, setSelf] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      await saveProfile({
        data: {
          role,
          name,
          headline,
          bio,
          collegeName,
          companyName,
          location,
          yearLabel: role === "student" ? yearLabel : "",
          careerGoal: role === "student" ? careerGoal : "",
        },
      });
      if (role === "student") {
        const entries = Object.entries(self).filter(([, v]) => v > 0);
        for (const [skillId, level] of entries) {
          await setSelfSkill({ data: { skillId, level } });
        }
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: "/dashboard" });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Could not save"),
  });

  if (isLoading) return <PageSkeleton />;
  if (me?.profile) return <Navigate to="/dashboard" />;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Set up</p>
        <h1 className="mt-2 text-3xl">{step === 0 ? "Who are you here as?" : "A few details"}</h1>
        {step === 0 ? (
          <div className="mt-8 grid gap-3">
            {(
              [
                ["student", "Student", "Build a skill map, learn, and apply with a match score."],
                ["industry", "Recruiter", "Post internships and jobs. Rank talent by skills."],
                ["college", "College", "See cohort gaps against what industry is hiring for."],
              ] as const
            ).map(([id, title, body]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRole(id)}
                className={cn(
                  "rounded-xl border px-4 py-4 text-left transition-colors",
                  role === id ? "border-primary bg-sage" : "border-border bg-card hover:border-primary/40",
                )}
              >
                <span className="font-sans text-base font-semibold">{title}</span>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </button>
            ))}
            <Button className="mt-4" onClick={() => setStep(1)}>
              Continue
            </Button>
          </div>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {role !== "industry" ? (
              <div>
                <Label htmlFor="college">College / institute</Label>
                <Input
                  id="college"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. NIT Trichy"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Razorpay"
                />
              </div>
            )}
            <div>
              <Label htmlFor="loc">City</Label>
              <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru" />
            </div>
            {role === "student" ? (
              <>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={yearLabel} onChange={(e) => setYearLabel(e.target.value)} />
                </div>
                <div>
                  <Label>Career goal</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CAREER_GOALS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setCareerGoal(g.id)}
                        className={cn(
                          "rounded-lg border px-3 py-3 text-left text-sm",
                          careerGoal === g.id ? "border-primary bg-sage" : "border-border bg-card",
                        )}
                      >
                        <span className="font-medium">{g.title}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{g.family}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Headline</Label>
                  <Input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="CSE · looking for SDE internships"
                  />
                </div>
                <div>
                  <Label>Quick self-rating (optional)</Label>
                  <div className="mt-2 grid gap-3 rounded-xl border border-border bg-card p-4">
                    {SKILLS.filter((s) =>
                      ["python", "java", "dsa", "sql", "git", "javascript", "c", "htmlcss"].includes(s.id),
                    ).map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-3">
                        <span className="text-sm">{s.short}</span>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setSelf((prev) => ({ ...prev, [s.id]: n }))}
                              className={cn(
                                "h-9 w-9 rounded-md text-xs font-medium tabular-nums",
                                (self[s.id] ?? 0) === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                              )}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <Label>About</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What you hire for, or run on campus." />
              </div>
            )}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Enter SkillBridge"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
