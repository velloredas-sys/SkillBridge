import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { useMe } from "@/hooks/use-me";
import { campusAverages, demandGaps, INDUSTRY_DEMAND, NATIONAL_AVG } from "@/lib/catalog/cohort";
import { SKILL_MAP } from "@/lib/catalog/skills";
import { ROADMAPS } from "@/lib/catalog/roadmaps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <AppShell>
      <Inner />
    </AppShell>
  );
}

function Inner() {
  const { me } = useMe();
  const college = me?.profile?.collegeName || "Your campus";
  const avg = campusAverages(college);
  const gaps = demandGaps(avg);
  const chart = gaps.map((g) => ({
    name: SKILL_MAP[g.skillId]?.short ?? g.skillId,
    campus: g.have,
    industry: g.need,
  }));

  const programs = gaps
    .filter((g) => g.gap > 0.8)
    .slice(0, 5)
    .map((g) => {
      const rm = ROADMAPS.find((r) => r.skillId === g.skillId);
      return { gap: g, rm };
    });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">{college}</p>
        <h1 className="text-3xl md:text-4xl">Cohort analytics</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Aggregates only — a campus curve derived from a national CS baseline, compared with what
          product companies list on intern and new-grad roles. Use it to schedule labs, not to rank students.
        </p>
      </div>

      <div className="h-72 rounded-xl border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} interval={0} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar dataKey="campus" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="industry" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">Green = campus average · Ink = industry demand (0–5)</p>

      <section>
        <h2 className="font-sans text-base font-semibold">Suggested training programs</h2>
        <ul className="mt-3 space-y-3">
          {programs.map(({ gap, rm }) => (
            <li key={gap.skillId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-medium">{gap.name}</p>
                <p className="text-sm text-muted-foreground">
                  Campus {gap.have.toFixed(1)} · industry {gap.need.toFixed(1)} · gap {gap.gap.toFixed(1)}
                </p>
              </div>
              {rm ? (
                <Button asChild size="sm" variant="outline">
                  <Link to="/learn/$slug" params={{ slug: rm.slug }}>
                    Assign {rm.title}
                  </Link>
                </Button>
              ) : (
                <Badge>Build a workshop</Badge>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-muted/50 p-5">
        <h2 className="font-sans text-base font-semibold">National snapshot</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          DSA, SQL, Git, and Java remain the widest industry-vs-campus gaps. Web frameworks trail language
          fundamentals — train the latter first.
        </p>
        <p className="mt-3 font-mono text-xs tabular-nums text-muted-foreground">
          DSA demand {INDUSTRY_DEMAND.dsa} / national {NATIONAL_AVG.dsa} · SQL {INDUSTRY_DEMAND.sql} / {NATIONAL_AVG.sql}
        </p>
      </section>
    </div>
  );
}
