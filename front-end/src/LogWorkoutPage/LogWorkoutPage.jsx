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
          <div class="workout-builder">
            <form>
              <div class="form-group">
                <label for="category">Body Part</label>
                <select id="category" name="category">
                  <option value="">Select a body part</option>
                  <option>Upper Arms</option>
                  <option>Lower Arms</option>
                  <option>Upper Legs</option>
                  <option>Lower Legs</option>
                  <option>Neck</option>
                  <option>Back</option>
                  <option>Shoulder</option>
                  <option>Chest</option>
                  <option>Waist</option>
                  <option>Cardio</option>
                </select>
              </div>

              <div class="form-group">
                <label for="muscle">Muscle</label>
                <select id="muscle" name="muscle">
                  <option value="">Select a muscle</option>
                  <option>Pectoral</option>
                  <option>Oblique</option>
                </select>
              </div>

              <div class="form-group">
                <label for="exercise">Exercise</label>
                <select id="exercise" name="exercise">
                  <option value="">Select an exercise</option>
                  <option>Bench Press</option>
                  <option>Decline Bench Press</option>
                </select>
              </div>

              <div class="form-group">
                <label for="reps">Reps</label>
                <input type="number" id="reps" name="reps" value="0" min="0" />
              </div>

              <div class="form-group">
                <label for="weight">Weight</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value="0"
                  min="0"
                />
              </div>

              <button type="submit" class="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogWorkoutPage;
