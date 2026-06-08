export const PredictionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-slate-800 bg-slate-950 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Predictions</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Your next picks</h1>
          </div>
          <span className="inline-flex items-center rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
            Coming soon
          </span>
        </div>
        <p className="mt-4 max-w-2xl text-slate-400">
          This section will show upcoming matches and allow you to submit your predictions.
        </p>
      </div>
    </div>
  );
};
