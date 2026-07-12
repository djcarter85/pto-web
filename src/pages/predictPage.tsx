import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { DateTime } from "luxon";
import { getPredictPage, getUserPlayer, savePredictions } from "../api/ptoApi";
import { TeamImage } from "../components/teamImage";
import { useData } from "../hooks/useData";

type MatchPredictionProps = {
  match: {
    matchId: string;
    kickoff: string;
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
    predictedScore: { home: number; away: number } | null;
  };
  homeValue: string;
  awayValue: string;
  onScoreChange: (field: "home" | "away", value: string) => void;
};

type TeamProps = {
  team: { id: number; name: string };
};

type PredictPageData = {
  playerId: string;
  matches: Array<{
    matchId: string;
    kickoff: string;
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
    predictedScore: { home: number; away: number } | null;
  }>;
};

const Team = ({ team }: TeamProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <TeamImage team={team} />
      <div className="truncate text-sm">{team.name}</div>
    </div>
  );
};

type ScoreInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const ScoreInput = ({ value, onChange }: ScoreInputProps) => {
  return (
    <div>
      <input
        type="number"
        inputMode="numeric"
        step="1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-12 rounded border border-gray-300 px-1 py-1 text-center text-lg text-gray-800 tabular-nums"
      />
    </div>
  );
};

const parseIntegerValue = (value: string): number | null => {
  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  return /^-?\d+$/.test(trimmed) ? Number(trimmed) : null;
};

const MatchPrediction = ({
  match,
  homeValue,
  awayValue,
  onScoreChange,
}: MatchPredictionProps) => {
  const kickoffDate = DateTime.fromISO(match.kickoff);

  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <Team team={match.homeTeam} />
      <ScoreInput
        value={homeValue}
        onChange={(value) => onScoreChange("home", value)}
      />
      <ScoreInput
        value={awayValue}
        onChange={(value) => onScoreChange("away", value)}
      />
      <Team team={match.awayTeam} />
      <div className="flex flex-col items-center justify-center tabular-nums">
        <div className="text-xs">{kickoffDate.toFormat("EEE d MMM")}</div>
        <div className="text-sm">{kickoffDate.toFormat("HH:mm")}</div>
      </div>
    </div>
  );
};

const getData = async (idToken: string): Promise<PredictPageData> => {
  const userPlayer = await getUserPlayer(idToken);
  const predictPage = await getPredictPage(idToken, userPlayer.id);

  // TODO add player data to response and then just use that
  return {
    playerId: userPlayer.id,
    matches: predictPage.matches,
  };
};

export const PredictPage = () => {
  const auth = useAuth();
  const { data, isLoading, error } = useData(getData);
  const [draftPredictions, setDraftPredictions] = useState<
    Record<string, { home: string; away: string }>
  >({});

  useEffect(() => {
    if (!data) {
      return;
    }

    setDraftPredictions((currentDraft) => {
      const nextDraft = { ...currentDraft };

      for (const match of data.matches) {
        if (!nextDraft[match.matchId]) {
          nextDraft[match.matchId] = {
            home: match.predictedScore?.home?.toString() ?? "",
            away: match.predictedScore?.away?.toString() ?? "",
          };
        }
      }

      return nextDraft;
    });
  }, [data]);

  const handleScoreChange = (
    matchId: string,
    field: "home" | "away",
    value: string,
  ) => {
    setDraftPredictions((currentDraft) => {
      const currentPrediction = currentDraft[matchId] ?? { home: "", away: "" };
      const nextPrediction = {
        ...currentPrediction,
        [field]: value,
      };

      const homeValue = parseIntegerValue(nextPrediction.home);
      const awayValue = parseIntegerValue(nextPrediction.away);

      if (
        auth.user?.id_token &&
        data?.playerId &&
        homeValue !== null &&
        awayValue !== null
      ) {
        void savePredictions(auth.user.id_token, data.playerId, [
          {
            matchId,
            predictedScore: { home: homeValue, away: awayValue },
          },
        ]);
      }

      return {
        ...currentDraft,
        [matchId]: nextPrediction,
      };
    });
  };

  if (isLoading) {
    return <div className="space-y-4 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="space-y-4 py-4">Error: {error}</div>;
  }

  if (!data || data.matches.length === 0) {
    return <div className="space-y-4 py-4">No prediction data available.</div>;
  }

  return (
    <div className="grid grid-cols-[1fr_min-content_min-content_1fr_auto] gap-x-1 gap-y-4 py-4">
      {data.matches.map((mp) => {
        const draftPrediction = draftPredictions[mp.matchId] ?? {
          home: "",
          away: "",
        };

        return (
          <MatchPrediction
            key={mp.matchId}
            match={mp}
            homeValue={draftPrediction.home}
            awayValue={draftPrediction.away}
            onScoreChange={(field, value) =>
              handleScoreChange(mp.matchId, field, value)
            }
          />
        );
      })}
    </div>
  );
};
