import "./BuildWorkoutPage.css";
import React, { use } from "react";
import axios from "axios";
import { useState } from "react";
import { BODY_PARTS, BASE_URL, NavigationButtons } from "../constants";
import { useUser } from "../userContext";

const BuildWorkoutPage = () => {
  const { login, user } = useUser();
  const userId = user ? user.id : null;

  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [exercises, setExercises] = useState([]);
  const [plan, setPlan] = useState([]);
  const [workoutName, setWorkoutName] = useState("");

  const handleBodyPartChange = async (event) => {
    const bodyPart = event.target.value.toLowerCase();
    setSelectedBodyPart(event.target.value.toLowerCase());
    setExercises([]); // reset exercises when body part changes

    try {
      const response = await axios.get(
        // fetch exercises for selected body part
        `${BASE_URL}exercises/bodyPart/${bodyPart}`
      );
      if (response) {
        const data = response.data;
        setExercises(data);
      } else {
        console.error("Failed to fetch exercises");
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleWorkoutSelect = (exercise) => {
    setPlan((prevPlan) => [...prevPlan, exercise]);
  };

  const handleClearPlan = () => {
    setPlan([]);
    setWorkoutName("");
  };

  const handleWorkoutNameChange = (event) => {
    setWorkoutName(event.target.value);
  };

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
                <button
                  key={part}
                  onClick={handleBodyPartChange}
                  value={part}
                  className={`bodypart-item ${
                    selectedBodyPart === part.toLowerCase() ? "selected" : ""
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>

            <div className="workouts-box">
              <div className="workouts-header">
                {selectedBodyPart ? `${selectedBodyPart} Workouts` : "Workouts"}
              </div>
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  className="workout-item"
                  onClick={() => handleWorkoutSelect(exercise)}
                >
                  {exercise.name}
                </button>
              ))}
            </div>

            <div className="plan-box">
              <div className="plan-header">Plan</div>
              <div className="plan-list">
                {plan.map((exercise, index) => (
                  <button key={index} className="plan-item">
                    {exercise.name}
                  </button>
                ))}
              </div>

              <div className="plan-buttons">
                <button className="plan-btn">Save</button>
                <button className="plan-btn" onClick={handleClearPlan}>
                  Clear
                </button>
              </div>
              <div className="build-form-group">
                <input
                  type="text"
                  id="workout-name"
                  name="workout-name"
                  value={workoutName}
                  onChange={handleWorkoutNameChange}
                  placeholder="Workout Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildWorkoutPage;
