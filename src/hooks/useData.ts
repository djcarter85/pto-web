import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export const useData = <T>(
  getData: (idToken: string) => Promise<T>,
) => {
  const auth = useAuth();
  const [data, setData] = useState<T | null>(null);
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
        setData(null);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedData = await getData(auth.user.id_token);
        if (!cancelled) setData(fetchedData);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.id_token, getData]);

  return { data, isLoading, error } as const;
};
