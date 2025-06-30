import "./LogWorkoutPage.css";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";
import ExerciseContext from "../ExerciseContext";
import React, { useContext, useEffect } from "react";

const LogWorkoutPage = () => {
  const exercises = useContext(ExerciseContext);

  console.log("Loaded exercises:", exercises);

  return (
    <>
      <div className="container">
        <NavigationButtons />
        <div className="main-content">
          <h1>Log Workout</h1>
        </div>
      </div>
    </>
  );
};

export default LogWorkoutPage;
