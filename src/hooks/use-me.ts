import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/server/me";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { SkillLevels } from "@/lib/catalog/match";

export function useMe() {
  const { user, isPending: authPending } = useCurrentUserState();
  const query = useQuery({
    queryKey: ["me", user?.id],
    queryFn: () => getMe(),
    enabled: Boolean(user),
  });
  const skills: SkillLevels = {};
  for (const s of query.data?.skills ?? []) {
    skills[s.skillId] = { self: s.selfLevel, assessed: s.assessedLevel };
  }
  return {
    user,
    authPending,
    me: query.data,
    skills,
    completed: new Set(query.data?.progress ?? []),
    isLoading: authPending || (Boolean(user) && query.isLoading),
    refetch: query.refetch,
  };
}
