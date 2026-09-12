import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/learn" as const, label: "Learn" },
  { to: "/opportunities" as const, label: "Internships" },
  { to: "/assess" as const, label: "Assess" },
];

export function SiteHeader({ ink = false }: { ink?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b",
        ink ? "border-white/10 bg-bark text-cream" : "border-border bg-background/90 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Wordmark light={ink} />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium",
                ink
                  ? "text-cream/80 hover:bg-white/10 hover:text-cream"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : (
            <>
              <SignedOut>
                <Button asChild size="sm" variant={ink ? "cream" : "default"} className="hidden sm:inline-flex">
                  <Link to="/login">Sign in</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className={cn(
                    "hidden rounded-md px-3 py-2 text-sm font-medium sm:block",
                    ink ? "text-cream/80 hover:text-cream" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </>
          )}
          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden",
              ink ? "text-cream" : "text-foreground",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className={cn("border-t px-4 py-3 md:hidden", ink ? "border-white/10" : "border-border")}>
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn("rounded-md px-3 py-3 text-sm font-medium", ink ? "text-cream" : "text-foreground")}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium">
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>SkillBridge — academia and industry, on one map.</p>
        <p>SIH26044 · Skill mapping, internships, placement.</p>
      </div>
    </footer>
  );
}
