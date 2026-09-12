import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M7 24v-7.5C7 11.2 12.2 8 16 8s9 3.2 9 8.5V24h-5.2v-7.2c0-2.6-1.5-4.3-3.8-4.3s-3.8 1.7-3.8 4.3V24H7z"
        className="fill-background"
      />
    </svg>
  );
}

export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Mark />
      <span
        className={cn(
          "font-display text-xl leading-none tracking-tight",
          light ? "text-cream" : "text-foreground",
        )}
      >
        SkillBridge
      </span>
    </span>
  );
}
