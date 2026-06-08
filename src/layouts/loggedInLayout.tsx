import { useAuth } from "react-oidc-context";
import { Link, Outlet, useNavigate } from "react-router";

const Nav = ({ user }: { user: string | undefined }) => {
  return (
    <nav className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl shadow-slate-950/10 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300/80">PTO Club</p>
        <p className="text-sm text-slate-400">Weekly predictions and standings</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
        <Link className="rounded-2xl bg-slate-800 px-4 py-2 transition hover:bg-slate-700" to="/leaderboard">
          Leaderboard
        </Link>
        <Link className="rounded-2xl bg-slate-800 px-4 py-2 transition hover:bg-slate-700" to="/predictions">
          Predictions
        </Link>
        <span className="rounded-2xl bg-slate-800 px-4 py-2 text-slate-400">
          {user ?? "Unknown user"}
        </span>
      </div>
    </nav>
  );
};

export const LoggedInLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="space-y-2">
          <Nav user={auth.user?.profile.email} />
        </header>
        <main className="rounded-4xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
