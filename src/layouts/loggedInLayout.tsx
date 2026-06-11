import { useAuth } from "react-oidc-context";
import { Outlet, useNavigate } from "react-router";

export const LoggedInLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};
