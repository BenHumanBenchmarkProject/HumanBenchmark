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
import { ExerciseProvider } from "./ExerciseContext";
import MyAccountPage from "./MyAccountPage/MyAccountPage.jsx";
import Layout from "./Layout/Layout.jsx";
import Calendar from "./Calendar/Calendar.jsx";
import { LoadingProvider } from "./loadingContext.jsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <Layout>
        <LeaderboardPage />
      </Layout>
    ),
  },
  {
    path: "/log-workout",
    element: (
      <Layout>
        <LogWorkoutPage />
      </Layout>
    ),
  },
  {
    path: "/build-workout",
    element: (
      <Layout>
        <BuildWorkoutPage />
      </Layout>
    ),
  },
  {
    path: "/myAccount",
    element: (
      <Layout>
        <MyAccountPage />
      </Layout>
    ),
  },
  {
    path: "/calendar",
    element: (
      <Layout>
        <Calendar />
      </Layout>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <UserProvider>
      <ExerciseProvider>
        <RouterProvider router={routes} />
      </ExerciseProvider>
    </UserProvider>
  </LoadingProvider>
);
