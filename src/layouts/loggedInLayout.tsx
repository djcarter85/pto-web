import { useAuth } from "react-oidc-context";
import { Outlet, useNavigate } from "react-router";
import { Main } from "../components/main";
import { Nav } from "../components/nav";

export const LoggedInLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Nav />
      <Main>
        <Outlet />
      </Main>
    </>
  );
};
