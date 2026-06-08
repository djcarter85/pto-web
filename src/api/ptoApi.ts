import { z } from "zod";

const LeaderboardPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  player: LeaderboardPlayerSchema,
  matchesPredicted: z.number(),
  totalPoints: z.number(),
  pointsPerMatch: z.number(),
});

const LeaderboardResponseSchema = z.object({
  leaderboard: z.array(LeaderboardEntrySchema),
});

export type LeaderboardPlayer = z.infer<typeof LeaderboardPlayerSchema>;

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;

const parseResponse = async <T>(res: Response, schema: z.ZodType<T>) => {
  const json = await res.json();
  const result = schema.safeParse(json);

  if (!result.success) {
    throw new Error(
      `Leaderboard response validation failed: ${result.error.message}`,
    );
  }

  return result.data;
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

  return parseResponse(res, LeaderboardResponseSchema);
};
