import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Main } from "../components/main";

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    navigate("/leaderboard");
    return null;
  }

  return (
    <Main>
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-2 flex flex-col gap-y-4 rounded-xl border border-gray-300 p-6 shadow-md">
          <p className="text-center text-lg text-pretty">
            Welcome to PTO, a football predictions game!
          </p>
          <p className="text-center text-sm">You must be logged in to play.</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="w-full rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
          >
            Log in or sign up
          </button>
        </div>
      </div>
    </Main>
  );
};
