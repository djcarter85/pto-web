import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { LeaderboardPage } from "./pages/leaderboardPage";
import { LoginPage } from "./pages/loginPage";
import { LoggedInLayout } from "./layouts/loggedInLayout";
import { NotFoundPage } from "./pages/notFoundPage";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_JwWpg0O8l",
  client_id: "2egge4ro1oduqes2bn2q4snrah",
  redirect_uri: `${window.location.origin}/`,
  response_type: "code",
  scope: "email openid phone",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<LoggedInLayout />}>
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
