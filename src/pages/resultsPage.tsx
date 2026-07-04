import cx from "classix";
import { getResultsPage } from "../api/ptoApi";
import { useData } from "../hooks/useData";

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
  teamName,
  actual,
  predicted,
  gapAbove,
}: {
  teamName: string;
  actual?: number | null;
  predicted?: number | null;
  gapAbove?: boolean;
}) => (
  <div
    className={cx(
      "col-span-3 grid grid-cols-subgrid items-center",
      gapAbove && "mt-1",
    )}
  >
    <div className="truncate">{teamName}</div>
    <ScoreCell
      score={actual}
      type={actual !== null ? "final" : "missing"}
      fallback="?"
    />
    <ScoreCell
      score={predicted}
      type={predicted !== null ? "predicted" : "missing"}
      fallback="-"
    />
  </div>
);

const getData = async (idToken: string) =>
  getResultsPage(idToken, "375ec333-4ff2-4573-917c-f7336a611ff4");

export const ResultsPage = () => {
  const { data, isLoading, error } = useData(getData);

  return (
    <div className="py-4 tabular-nums">
      {isLoading && <p>Loading results...</p>}{" "}
      {error && <p className="text-red-500">Error loading results: {error}</p>}
      {!isLoading && !error && (!data || data.results.length === 0) && (
        <p>No results data available.</p>
      )}
      {data && data.results.length > 0 && (
        <div className="space-y-3">
          {data.results.map((r) => (
            <div
              key={r.matchId}
              className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-2">
                <div className="col-span-3 grid grid-cols-subgrid items-center">
                  <div className="col-start-2 text-center text-xs text-gray-700">
                    FT
                  </div>
                  <div className="col-start-3 text-center text-xs text-gray-700">
                    Pred.
                  </div>
                </div>
                <MatchTeamRow
                  teamName={r.homeTeam.name}
                  actual={r.finalScore?.home}
                  predicted={r.predictedScore?.home}
                />
                <MatchTeamRow
                  teamName={r.awayTeam.name}
                  actual={r.finalScore?.away}
                  predicted={r.predictedScore?.away}
                  gapAbove={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
