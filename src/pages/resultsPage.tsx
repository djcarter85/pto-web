import cx from "classix";
import { getResultsPage, getUserPlayer } from "../api/ptoApi";
import { TeamImage } from "../components/teamImage";
import { useData } from "../hooks/useData";
import { Person, Trophy } from "react-bootstrap-icons";

const Header = ({ text, icon }: { text: string; icon?: React.ReactNode }) => {
  return (
    <div className="flex flex-row items-center gap-3 px-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xl">{text}</span>
    </div>
  );
};

const TournamentHeader = ({ tournamentName }: { tournamentName: string }) => {
  return <Header text={tournamentName} icon={<Trophy />} />;
};

const PlayerHeader = ({ playerName }: { playerName: string }) => {
  return <Header text={playerName} icon={<Person />} />;
};

const ScoreCell = ({
  score,
  fallback,
}: {
  score?: number | null;
  fallback: string;
}) => (
  <div className="rounded-md px-3 text-center text-lg tabular-nums">
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
    <TeamImage team={team} />
    <div className="truncate">{team.name}</div>
    <ScoreCell score={predicted} fallback="-" />
    <ScoreCell score={actual} fallback="?" />
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
          <div>
            <TournamentHeader tournamentName={data.tournament.name} />
            <PlayerHeader playerName={data.player.name} />
          </div>
          <div className="space-y-3">
            {data.results.map((r) => (
              <div
                key={r.matchId}
                className={cx(
                  "rounded-lg border-l-4 border-slate-200 px-3 py-2 shadow-sm",
                  r.predictionResult === null &&
                    "border-l-gray-400 bg-gray-50",
                  r.predictionResult === "EXACT_SCORE" &&
                    "border-l-emerald-500 bg-emerald-100",
                  r.predictionResult === "CORRECT_RESULT" &&
                    "border-l-amber-500 bg-amber-100",
                  r.predictionResult === "ONE_SCORE_CORRECT" &&
                    "border-l-sky-500 bg-sky-100",
                  r.predictionResult === "WRONG" &&
                    "border-l-red-500 bg-red-100",
                )}
              >
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] gap-x-2">
                  <div className="col-span-full grid grid-cols-subgrid items-center">
                    <div className="col-start-3 text-center text-xs text-gray-600">
                      PRED
                    </div>
                    {r.finalScore !== null && (
                      <div className="col-start-4 text-center text-xs text-gray-600">
                        FT
                      </div>
                    )}
                    <div className="col-start-5 text-center text-xs text-gray-600">
                      PTS
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
                  <div className="col-start-5 row-span-2 row-start-2 flex items-center justify-center self-stretch">
                    <div
                      className={cx(
                        "text-3xl tabular-nums",
                        r.predictionResult === "WRONG" &&
                          "font-semibold text-red-600",
                        r.predictionResult === "ONE_SCORE_CORRECT" &&
                          "font-semibold text-sky-600",
                        r.predictionResult === "CORRECT_RESULT" &&
                          "font-semibold text-amber-600",
                        r.predictionResult === "EXACT_SCORE" &&
                          "font-semibold text-emerald-600",
                      )}
                    >
                      {r.points ?? "?"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
