export type LeaderboardPlayer = {
  id: string;
  name: string;
};

export type LeaderboardEntry = {
  rank: number;
  player: LeaderboardPlayer;
  matchesPredicted: number;
  totalPoints: number;
  pointsPerMatch: number;
};

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

export const getLeaderboard = async (idToken: string) => {
  const url = "https://api.pto.football/leaderboardPage";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    // No cache: ensure fresh data
    cache: "no-store" as RequestCache,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Leaderboard fetch failed: ${res.status} ${res.statusText}${text ? " - " + text : ""}`,
    );
  }

  const data = (await res.json()) as LeaderboardResponse;
  return data;
};
