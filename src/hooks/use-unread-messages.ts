import { useQuery } from "@tanstack/react-query";
import { getUnreadMessageCount } from "@/lib/server/social";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function useUnreadMessages() {
  const { user } = useCurrentUserState();
  const query = useQuery({
    queryKey: ["unread-messages"],
    queryFn: () => getUnreadMessageCount(),
    enabled: Boolean(user),
    refetchInterval: 20_000,
  });
  return query.data?.count ?? 0;
}
