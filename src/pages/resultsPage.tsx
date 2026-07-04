import cx from "classix";
import { getResultsPage, getUserPlayer } from "../api/ptoApi";
import { useData } from "../hooks/useData";
import { Trophy } from "react-bootstrap-icons";

const TournamentHeader = ({ tournamentName }: { tournamentName: string }) => {
  return (
    <div className="flex flex-row items-center gap-3 px-2 font-semibold">
      <span className="text-lg">
        <Trophy />
      </span>
      <span className="text-xl">{tournamentName}</span>
    </div>
  );
};

const ScoreCell = ({
  score,
  fallback,
  type,
}: {
  score?: number | null;
  fallback: string;
  type: "missing" | "final" | "predicted";
}) => (
  <div
    className={cx(
      "rounded-md px-3 text-center tabular-nums",
      type === "missing" && "bg-gray-200",
      type === "final" && "bg-amber-200",
      type === "predicted" && "bg-sky-200",
    )}
  >
    {score ?? fallback}
  </div>
);

const MatchTeamRow = ({
  team,
  actual,
  predicted,
  gapAbove,
}: {
  team: {
    name: string;
    id: number;
  };
  actual?: number;
  predicted?: number;
  gapAbove?: boolean;
}) => (
  <div
    className={cx(
      "col-span-4 grid grid-cols-subgrid items-center",
      gapAbove && "mt-2",
    )}
  >
    <div className="flex size-7 items-center justify-center overflow-hidden">
      <img
        src={`/team-images/logo-${team.id}.svg`}
        alt={`${team.name} logo`}
        className="size-7 object-contain"
      />
    </div>
    <div className="truncate">{team.name}</div>
    <ScoreCell
      score={actual}
      type={actual !== undefined ? "final" : "missing"}
      fallback="?"
    />
    <ScoreCell
      score={predicted}
      type={predicted !== undefined ? "predicted" : "missing"}
      fallback="-"
    />
  </div>
);

const getData = async (idToken: string) => {
  // TODO what if this is null?
  const userPlayer = await getUserPlayer(idToken);
  return getResultsPage(idToken, userPlayer.id);
};

export const ResultsPage = () => {
  const { data, isLoading, error } = useData(getData);

  return (
    <div className="space-y-4 py-4 tabular-nums">
      {isLoading && <p>Loading results...</p>}{" "}
      {error && <p className="text-red-500">Error loading results: {error}</p>}
      {!isLoading && !error && (!data || data.results.length === 0) && (
        <p>No results data available.</p>
      )}
      {data && data.results.length > 0 && (
        <>
          <TournamentHeader tournamentName={data.tournament.name} />
          <div className="space-y-3">
            {data.results.map((r) => (
              <div
                key={r.matchId}
                className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm"
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] gap-x-2">
                  <div className="col-span-4 grid grid-cols-subgrid items-center">
                    <div className="col-start-3 text-center text-xs text-gray-700">
                      FT
                    </div>
                    <div className="col-start-4 text-center text-xs text-gray-700">
                      Pred.
                    </div>
                  </div>
                  <MatchTeamRow
                    team={r.homeTeam}
                    actual={r.finalScore?.home}
                    predicted={r.predictedScore?.home}
                  />
                  <MatchTeamRow
                    team={r.awayTeam}
                    actual={r.finalScore?.away}
                    predicted={r.predictedScore?.away}
                    gapAbove={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
