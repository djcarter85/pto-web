import { getResultsPage } from "../api/ptoApi";
import { useData } from "../hooks/useData";

const getData = async (idToken: string) =>
  getResultsPage(idToken, "375ec333-4ff2-4573-917c-f7336a611ff4");

export const ResultsPage = () => {
  const { data, isLoading, error } = useData(getData);

  return (
    <div className="py-4">
      {isLoading && <p>Loading results...</p>}{" "}
      {error && <p className="text-red-500">Error loading results: {error}</p>}
      {!isLoading && !error && (!data || data.results.length === 0) && (
        <p>No results data available.</p>
      )}
      {data && data.results.length > 0 && (
        <div>
          {data.results.map((r) => (
            <div key={r.matchId}>
              {r.homeTeam.name} vs {r.awayTeam.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
