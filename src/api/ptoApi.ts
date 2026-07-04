import { z } from "zod";

const baseUrl = "https://api.pto.football";

const LeaderboardPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  isMe: z.boolean(),
});

const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  rankIsShared: z.boolean(),
  player: LeaderboardPlayerSchema,
  matchesPredicted: z.number(),
  totalPoints: z.number(),
  pointsPerMatch: z.number(),
});

const LeaderboardResponseSchema = z.object({
  leaderboard: z.array(LeaderboardEntrySchema),
});

const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  shortName: z.string(),
});

const ResultsPageResponseSchema = z.object({
  results: z.array(
    z.object({
      homeTeam: TeamSchema,
      awayTeam: TeamSchema,
    }),
  ),
});

export type LeaderboardPlayer = z.infer<typeof LeaderboardPlayerSchema>;

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;

export type ResultsPageResponse = z.infer<typeof ResultsPageResponseSchema>;

const parseResponse = async <T>(
  res: Response,
  schema: z.ZodType<T>,
  label: string,
) => {
  const json = await res.json();
  const result = schema.safeParse(json);

  if (!result.success) {
    throw new Error(
      `${label} response validation failed: ${result.error.message}`,
    );
  }

  return result.data;
};

const fetchPage = async <T>(
  idToken: string,
  path: string,
  schema: z.ZodType<T>,
  label: string,
) => {
  const url = `${baseUrl}${path}`;

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
      `${label} fetch failed: ${res.status} ${res.statusText}${text ? " - " + text : ""}`,
    );
  }

  return parseResponse(res, schema, label);
};

export const getLeaderboardPage = async (idToken: string) => {
  return fetchPage(
    idToken,
    "/leaderboardPage",
    LeaderboardResponseSchema,
    "Leaderboard",
  );
};

export const getResultsPage = async (idToken: string, playerId: string) => {
  return fetchPage(
    idToken,
    `/resultsPage?tournamentCode=wc2026&playerId=${playerId}`,
    ResultsPageResponseSchema,
    "Results",
  );
};
