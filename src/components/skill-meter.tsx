import { LEVEL_LABEL } from "@/lib/catalog/skills";
import { cn } from "@/lib/utils";

export function SkillMeter({
  have,
  need,
  label,
}: {
  have: number;
  need?: number;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {LEVEL_LABEL[have] ?? have}
          {need != null ? ` / ${LEVEL_LABEL[need] ?? need}` : ""}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const n = i + 1;
          const filled = n <= have;
          const target = need != null && n <= need && n > have;
          return (
            <span
              key={n}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                filled && "bg-primary",
                target && "bg-primary/25",
                !filled && !target && "bg-muted",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
