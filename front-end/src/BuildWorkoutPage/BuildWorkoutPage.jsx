import "./BuildWorkoutPage.css";
import React from "react";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

import { BODY_PARTS } from "../constants";

const BuildWorkoutPage = () => {
  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Build Workout</h1>

          <div className="builder-container">
            <div className="bodyparts-box">
              <div className="bodyparts-header">Body Parts</div>
              {BODY_PARTS.map((part) => (
                <button key={part} className="bodypart-item">
                  {part}
                </button>
              ))}
            </div>

            <div className="workouts-box">
              <div className="workouts-header">Bicep Workouts</div>
              <button className="workout-item">Incline Hammer Curls</button>
              <button className="workout-item">Wide-Grip Barbell Curl</button>
            </div>

            <div className="plan-box">
              <div className="plan-header">Plan</div>
              <div className="plan-list">
                <button className="plan-item">Squat</button>
                <button className="plan-item">Decline Bench Press</button>
                <button className="plan-item">Row Machine</button>
              </div>

              <div className="plan-buttons">
                <button className="plan-btn">Save</button>
                <button className="plan-btn">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildWorkoutPage;
