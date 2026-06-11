import { useAuth } from "react-oidc-context";
import { Link, Outlet, useNavigate } from "react-router";

const Nav = ({ user }: { user: string | undefined }) => {
  return (
    <nav>
      <Link to="/leaderboard">Leaderboard</Link>
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
      <Nav user={auth.user?.profile.email} />
      <Outlet />
    </div>
  );
};
