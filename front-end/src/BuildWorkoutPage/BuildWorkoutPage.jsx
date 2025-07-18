import "./BuildWorkoutPage.css";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { BODY_PARTS, BASE_URL, NavigationButtons } from "../constants";
import { useUser } from "../userContext";

const MINIMUM_MOVEMENT_VARIABLE_NUMBER = 1;

const BuildWorkoutPage = () => {
  const { login, user } = useUser();
  const userId = user ? user.id : null;

  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [exercises, setExercises] = useState([]);
  const [plan, setPlan] = useState([]);
  const [workoutName, setWorkoutName] = useState("");

  const handleBodyPartChange = async (event) => {
    const bodyPart = event.target.value.toLowerCase();
    setSelectedBodyPart(bodyPart);
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

  const handleSaveWorkout = async () => {
    if (!plan.length || !workoutName) {
      console.error("Workout name and exercises are required");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}users/${userId}/workouts`, {
        name: workoutName,
        isComplete: false,
        completedAt: null,
        movements: plan.map((exercise) => ({
          name: exercise.name,
          bodyPart: exercise.bodyParts[0], // the api returns bodyParts as an array, so we're just taking the first one
          reps: parseInt(exercise.reps),
          sets: parseInt(exercise.sets),
          weight: parseInt(exercise.weight),
          max: exercise.weight * (1 + exercise.reps / 30), // Epley Formula
          muscle: exercise.targetMuscle,
        })),
      });

      handleClearPlan(); // Clear the plan after saving
    } catch (error) {
      console.error("Error saving workout:", error);
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

  const handlePlanChange = (index, field, value) => {
    const updatedPlan = [...plan];
    updatedPlan[index][field] = value;
    setPlan(updatedPlan);
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
                  <div key={index} className="plan-item">
                    <span>{exercise.name}</span>
                    <div className="input-row">
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(event) =>
                          handlePlanChange(index, "sets", event.target.value)
                        }
                        placeholder="S"
                        className="plan-input"
                        min={MINIMUM_MOVEMENT_VARIABLE_NUMBER}
                      />
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(event) =>
                          handlePlanChange(index, "reps", event.target.value)
                        }
                        placeholder="R"
                        className="plan-input"
                        min={MINIMUM_MOVEMENT_VARIABLE_NUMBER}
                      />
                      <input
                        type="number"
                        value={exercise.weight}
                        onChange={(event) =>
                          handlePlanChange(index, "weight", event.target.value)
                        }
                        placeholder="W"
                        className="plan-input"
                        min={MINIMUM_MOVEMENT_VARIABLE_NUMBER}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="plan-buttons">
                <button className="plan-btn" onClick={handleSaveWorkout}>
                  Save
                </button>
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
