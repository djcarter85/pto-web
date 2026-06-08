import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 text-slate-300">
        Loading...
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rose-600/30 bg-rose-500/10 p-8 text-rose-100 shadow-xl shadow-rose-950/20">
          <h1 className="text-2xl font-semibold">Authentication error</h1>
          <p className="mt-3 text-slate-200">{auth.error.message}</p>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    navigate("/leaderboard");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-4xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/30">
        <div className="space-y-4">
          <div>
            <p className="text-sm tracking-[0.28em] text-sky-300/80 uppercase">
              PTO Login
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              Welcome back
            </h1>
            <p className="mt-3 text-slate-400">
              Sign in to access your predictions, leaderboard, and match
              insights.
            </p>
          </div>
          <button
            className="mt-4 w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            onClick={() => auth.signinRedirect()}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
