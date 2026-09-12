import { cn } from "@/lib/utils";

export function MatchRing({
  value,
  size = 72,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="22" cy="22" r={r} fill="none" className="stroke-muted" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          className="stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="absolute font-mono text-sm font-medium tabular-nums text-foreground">
        {pct}
        <span className="text-[10px] text-muted-foreground">%</span>
      </span>
    </div>
  );
}
