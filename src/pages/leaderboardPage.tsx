import { useLeaderboard } from "../hooks/useLeaderboard";

export const LeaderboardPage = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm tracking-[0.28em] text-sky-300/80 uppercase">
              Leaderboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-white">
              Club standings
            </h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              View the most accurate predictors, total points, and average
              performance for each member.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/20">
            Live ranking
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-xl shadow-slate-950/10">
          Loading leaderboard...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-600/40 bg-rose-500/10 p-8 text-rose-200 shadow-xl shadow-rose-950/20">
          <p className="text-lg font-medium">Error loading leaderboard</p>
          <p className="mt-2 text-slate-200">{error}</p>
        </div>
      )}

      {!isLoading && !error && (!leaderboard || leaderboard.length === 0) && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-xl shadow-slate-950/10">
          No leaderboard data available.
        </div>
      )}

      {leaderboard && leaderboard.length > 0 && (
        <div className="overflow-x-auto rounded-4xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/20">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Player</th>
                <th className="px-6 py-4 font-medium">Matches predicted</th>
                <th className="px-6 py-4 font-medium">Points</th>
                <th className="px-6 py-4 font-medium">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {leaderboard.map((item) => (
                <tr
                  key={item.player.id}
                  className="transition hover:bg-slate-900/80"
                >
                  <td className="px-6 py-4 text-sky-200">{item.rank}</td>
                  <td className="px-6 py-4 text-slate-100">
                    {item.player.name}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.matchesPredicted}
                  </td>
                  <td className="px-6 py-4 text-emerald-300">
                    {item.totalPoints}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {item.pointsPerMatch}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
