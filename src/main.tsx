import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { LeaderboardPage } from "./pages/leaderboardPage";
import { PredictionsPage } from "./pages/predictionsPage";
import { LoginPage } from "./pages/loginPage";
import { LoggedInLayout } from "./layouts/loggedInLayout";
import { NotFoundPage } from "./pages/notFoundPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<LoggedInLayout />}>
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
