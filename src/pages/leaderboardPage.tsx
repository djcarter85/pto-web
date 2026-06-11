import { useLeaderboard } from "../hooks/useLeaderboard";

export const LeaderboardPage = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div>
      <h1>Leaderboard</h1>
      {isLoading && <p>Loading leaderboard...</p>}
      {error && (
        <p style={{ color: "red" }}>Error loading leaderboard: {error}</p>
      )}
      {!isLoading && !error && (!leaderboard || leaderboard.length === 0) && (
        <p>No leaderboard data available.</p>
      )}
      {leaderboard && leaderboard.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Pred</th>
              <th>Pts</th>
              <th>Avg</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item) => (
              <tr key={item.player.id}>
                <td>{item.rank}</td>
                <td>{item.player.name}</td>
                <td>{item.matchesPredicted}</td>
                <td>{item.totalPoints}</td>
                <td>{item.pointsPerMatch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
