import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getLeaderboard, type LeaderboardEntry } from "../api/ptoApi";

export const useLeaderboard = () => {
  const auth = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);

      if (auth.isLoading) {
        return;
      }

      if (!auth.isAuthenticated || !auth.user?.id_token) {
        setLeaderboard(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getLeaderboard(auth.user.id_token);
        if (!cancelled) setLeaderboard(data.leaderboard);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? String(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.access_token]);

  return { leaderboard, isLoading, error } as const;
};
