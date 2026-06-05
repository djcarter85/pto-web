import { useAuth } from "react-oidc-context";
import { Link, Outlet, useNavigate } from "react-router";

const Nav = ({ user }: { user: string | undefined }) => {
  return (
    <nav>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/predictions">Predictions</Link>
      <div>Logged in as: {user}</div>
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
    <div>
      <h1>Logged In Layout</h1>
      <p>This is the layout for logged in users.</p>
      <Nav user={auth.user?.profile.email} />
      <Outlet />
    </div>
  );
};
