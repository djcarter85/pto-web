import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

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
    <div>
      <h1>Login</h1>
      <p>This is the login page.</p>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
};
