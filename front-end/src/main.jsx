import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./HomePage/HomePage.jsx";
import LeaderboardPage from "./LeaderboardPage/LeaderboardPage.jsx";
import { BrowserRouter } from "react-router";
import LogWorkoutPage from "./LogWorkoutPage/LogWorkoutPage.jsx";
import BuildWorkoutPage from "./BuildWorkoutPage/BuildWorkoutPage.jsx";
import { UserProvider } from "./userContext.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/log-workout",
    element: <LogWorkoutPage />,
  },
  {
    path: "/build-workout",
    element: <BuildWorkoutPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <RouterProvider router={routes} />
  </UserProvider>
);
