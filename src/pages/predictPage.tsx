import { DateTime } from "luxon";
import { getPredictPage, getUserPlayer } from "../api/ptoApi";
import { TeamImage } from "../components/teamImage";
import { useData } from "../hooks/useData";

type MatchPredictionProps = {
  match: {
    matchId: string | number;
    kickoff: string;
    homeTeam: { id: number; name: string };
    awayTeam: { id: number; name: string };
  };
};

type TeamProps = {
  team: { id: number; name: string };
};

const Team = ({ team }: TeamProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <TeamImage team={team} />
      <div>{team.name}</div>
    </div>
  );
};

const MatchPrediction = ({ match }: MatchPredictionProps) => {
  const kickoffDate = DateTime.fromISO(match.kickoff);
  return (
    <div className="col-span-full grid grid-cols-subgrid">
      <Team team={match.homeTeam} />
      <Team team={match.awayTeam} />
      <div className="flex flex-col items-center justify-center tabular-nums">
        <div className="text-xs">{kickoffDate.toFormat("EEE d MMM")}</div>
        <div className="text-sm">{kickoffDate.toFormat("HH:mm")}</div>
      </div>
    </div>
  );
};

const getData = async (idToken: string) => {
  // TODO what if this is null?
  const userPlayer = await getUserPlayer(idToken);
  return getPredictPage(idToken, userPlayer.id);
};

export const PredictPage = () => {
  const { data, isLoading, error } = useData(getData);

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
    <div className="grid grid-cols-[auto_auto_auto] gap-y-4 py-4">
      {data.matches.map((mp) => (
        <MatchPrediction key={mp.matchId} match={mp} />
      ))}
    </div>
  );
};
