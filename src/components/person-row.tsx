import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initials, cn } from "@/lib/utils";
import type { ProfileSummary } from "@/lib/types";

const ROLE_LABEL: Record<ProfileSummary["role"], string> = {
  student: "Student",
  industry: "Recruiter",
  college: "College",
};

export function Avatar({
  name,
  avatarUrl,
  size = 44,
  className,
}: {
  name: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-sage font-medium text-accent-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38) }}
    >
      {initials(name)}
    </span>
  );
}

/** One row: avatar, name/headline, and an optional trailing slot (follow
 * button, unread badge, timestamp, …). Used in search results, follower /
 * following lists, and the message inbox. */
export function PersonRow({
  person,
  subline,
  trailing,
  to,
}: {
  person: Pick<ProfileSummary, "userId" | "name" | "avatarUrl" | "role" | "headline">;
  subline?: string;
  trailing?: ReactNode;
  to?: "/people/$userId" | "/messages/$userId";
}) {
  const content = (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Avatar name={person.name} avatarUrl={person.avatarUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{person.name || "Unnamed"}</span>
          <Badge className="shrink-0">{ROLE_LABEL[person.role]}</Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{subline ?? person.headline ?? ""}</p>
      </div>
    </div>
  );
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3">
      {to ? (
        <Link to={to} params={{ userId: person.userId }} className="flex min-w-0 flex-1 items-center gap-3">
          {content}
        </Link>
      ) : (
        content
      )}
      {trailing}
    </div>
  );
}

export function FollowButton({
  isFollowing,
  onToggle,
  pending,
  size = "sm",
}: {
  isFollowing: boolean;
  onToggle: () => void;
  pending?: boolean;
  size?: "sm" | "default";
}) {
  return (
    <Button
      type="button"
      size={size}
      variant={isFollowing ? "outline" : "default"}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
    >
      {pending ? "…" : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
