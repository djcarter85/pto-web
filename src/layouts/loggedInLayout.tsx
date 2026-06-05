import { Link, Outlet } from "react-router";

const Nav = () => {
  return (
    <nav>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/predictions">Predictions</Link>
    </nav>
  );
};

export const LoggedInLayout = () => {
  return (
    <div>
      <h1>Logged In Layout</h1>
      <p>This is the layout for logged in users.</p>
      <Nav />
      <Outlet />
    </div>
  );
};
