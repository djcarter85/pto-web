import { cx } from "classix";
import { useLeaderboard } from "../hooks/useLeaderboard";

export const LeaderboardPage = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div className="py-4">
      {isLoading && <p>Loading leaderboard...</p>}
      {error && (
        <p className="text-red-500">Error loading leaderboard: {error}</p>
      )}
      {!isLoading && !error && (!leaderboard || leaderboard.length === 0) && (
        <p>No leaderboard data available.</p>
      )}
      {leaderboard && leaderboard.length > 0 && (
        <table className="w-full tabular-nums">
          <thead>
            <tr className="text-sm tracking-wide text-gray-400 uppercase">
              <th className="px-1 py-3 text-right font-normal">#</th>
              <th className="px-1 py-3 font-normal"></th>
              <th className="px-1 py-3 text-right font-normal">Pts</th>
              <th className="px-1 py-3 text-right font-normal">Pred</th>
              <th className="px-2 py-3 text-right font-normal">Avg</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((item) => (
              <tr
                key={item.player.id}
                className={cx(item.player.isMe && "bg-gray-100")}
              >
                <td
                  className={cx(
                    "border-l-4 px-1 py-1 text-right text-sm text-gray-800",
                    item.player.isMe && "border-l-blue-500",
                    !item.player.isMe && "border-l-transparent",
                  )}
                >
                  {item.rankIsShared && <span>=</span>}
                  {item.rank}
                </td>
                <td className="px-1 py-1 font-medium">{item.player.name}</td>
                <td className="px-1 py-1 text-right text-xl tabular-nums">
                  {item.totalPoints}
                </td>
                <td className="px-1 py-1 text-right text-sm text-gray-800">
                  {item.matchesPredicted}
                </td>
                <td className="px-2 py-1 text-right text-sm text-gray-800">
                  {item.pointsPerMatch.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
