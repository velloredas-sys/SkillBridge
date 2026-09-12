import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "forest" | "ink" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "forest" && "bg-sage text-accent-foreground",
        tone === "ink" && "bg-secondary text-secondary-foreground",
        tone === "warn" && "bg-muted text-warn",
        className,
      )}
      {...props}
    />
  );
}
