import { useLeaderboard } from "../hooks/useLeaderboard";

export const LeaderboardPage = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div className="px-2 py-4">
      {isLoading && <p>Loading leaderboard...</p>}
      {error && (
        <p style={{ color: "red" }}>Error loading leaderboard: {error}</p>
      )}
      {!isLoading && !error && (!leaderboard || leaderboard.length === 0) && (
        <p>No leaderboard data available.</p>
      )}
      {leaderboard && leaderboard.length > 0 && (
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-1">#</th>
              <th className="px-1">Player</th>
              <th className="px-1">Pred</th>
              <th className="px-1">Pts</th>
              <th className="px-1">Avg</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item) => (
              <tr key={item.player.id}>
                <td className="px-1 text-center">{item.rank}</td>
                <td className="px-1">{item.player.name}</td>
                <td className="px-1 text-center">{item.matchesPredicted}</td>
                <td className="px-1 text-center">{item.totalPoints}</td>
                <td className="px-1 text-center">{item.pointsPerMatch.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
