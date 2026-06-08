export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-4xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-2xl shadow-slate-950/20">
        <p className="text-sm tracking-[0.28em] text-slate-400 uppercase">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          Page not found
        </h1>
        <p className="mt-4 text-slate-400">
          The page you are looking for doesn’t exist. Use the navigation links
          to continue.
        </p>
      </div>
    </div>
  );
};
