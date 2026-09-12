import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { ReactNode } from "react";

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <PageSkeleton />;
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
