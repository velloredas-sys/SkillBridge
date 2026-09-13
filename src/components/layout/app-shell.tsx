import { Link, useRouterState } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "./site-header";
import { RequireAuth, PageSkeleton } from "@/components/require-auth";
import { useMe } from "@/hooks/use-me";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";

const studentNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/assess", label: "Assess", icon: Gauge },
  { to: "/opportunities", label: "Jobs", icon: Briefcase },
  { to: "/applications", label: "Applied", icon: ClipboardList },
  { to: "/people", label: "People", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageCircle },
];

const industryNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/recruit", label: "Recruit", icon: Briefcase },
  { to: "/opportunities", label: "Board", icon: GraduationCap },
  { to: "/people", label: "People", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const collegeNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/opportunities", label: "Demand", icon: Briefcase },
  { to: "/learn", label: "Catalog", icon: BookOpen },
  { to: "/people", label: "People", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({
  children,
  allowPublic,
}: {
  children: ReactNode;
  allowPublic?: boolean;
}) {
  if (allowPublic) {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    );
  }
  return (
    <RequireAuth>
      <AuthedShell>{children}</AuthedShell>
    </RequireAuth>
  );
}

function AuthedShell({ children }: { children: ReactNode }) {
  const { me, isLoading } = useMe();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = useUnreadMessages();

  if (isLoading) return <PageSkeleton />;
  if (!me?.profile) return <Navigate to="/onboarding" />;

  const nav =
    me.profile.role === "industry" ? industryNav : me.profile.role === "college" ? collegeNav : studentNav;
  const bottomNav = [...nav.filter((i) => i.to !== "/messages").slice(0, 4), nav.find((i) => i.to === "/messages")!];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-6">
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {nav.map((item) => {
              const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium",
                    active ? "bg-sage text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.to === "/messages" && unread > 0 ? (
                    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <Link
              to="/profile"
              className={cn(
                "flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium",
                pathname === "/profile" || pathname.startsWith("/portfolio")
                  ? "bg-sage text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 flex-1 pb-16 md:pb-0">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {bottomNav.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.to === "/messages" && unread > 0 ? (
                  <span className="absolute right-6 top-1.5 h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </div>
  );
}
