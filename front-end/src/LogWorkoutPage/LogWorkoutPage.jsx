import "./LogWorkoutPage.css";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";
import ExerciseContext from "../ExerciseContext";
import React, { useContext, useState } from "react";
import { useUser } from "../userContext";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const LogWorkoutPage = () => {
  const { user, login } = useUser();
  const userId = user ? user.id : null;

  const exercises = useContext(ExerciseContext);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonFlash, setButtonFlash] = useState(false); // new state for successful submission

  const resetForm = () => {
    setSelectedBodyPart("");
    setSelectedMuscle("");
    setSelectedExercise("");
    setReps(0);
    setWeight(0);
  };

  const handleBodyPartChange = (event) => {
    setSelectedBodyPart(event.target.value.toLowerCase());
    setSelectedMuscle(""); // reset muscle selection when body part changes
  };

  const handleMuscleChange = (event) => {
    setSelectedMuscle(event.target.value);
  };

  const handleExerciseChange = (event) => {
    setSelectedExercise(event.target.value);
  };

  const handleRepsChange = (event) => {
    setReps(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    if (!exercise) {
      console.error("Exercise not found");
      return;
    }

    const newWorkout = {
      name: selectedExercise,
      bodyPart: selectedBodyPart,
      reps: parseInt(reps, 10),
      weight: parseInt(weight, 10),
      max: parseInt(weight, 10) * (1 + parseInt(reps, 10) / 30), // Epley Formula
      muscle: selectedMuscle,
    };

    try {
      // Create the workout
      await axios.post(
        `${BASE_URL}users/${userId}/workouts/${exercise.id}`,
        newWorkout
      );

      // Ftech updated user data
      const updatedUserResponse = await axios.get(
        `${BASE_URL}users/${userId}`
      );

      // update user context with the latest data
      if (updatedUserResponse.data) {
        login(updatedUserResponse.data);
      }

      console.log("Workout logged successfully");
      resetForm(); // reset form after submission
      setSuccessMessage("Workout logged successfully!");
      setButtonFlash(true);
      setTimeout(() => setButtonFlash(false), 2500); // flash for 2.5 seconds
    } catch (error) {
      console.error("Error logging workout:", error);
    }
  };

  // Filter exercises based on selected body part
  const exercisesByBodyPart = selectedBodyPart
    ? exercises.filter((exercise) =>
        exercise.bodyParts.includes(selectedBodyPart)
      )
    : exercises;

  // Extract unique muscles from filtered exercises
  const filteredMuscles = exercisesByBodyPart
    .map((exercise) => exercise.targetMuscle)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Filter exercises based on selected muscle or body part
  const filteredExercises = selectedMuscle
    ? exercisesByBodyPart.filter(
        (exercise) => exercise.targetMuscle === selectedMuscle
      )
    : exercisesByBodyPart;

  return (
    <>
      <div className="container">
        <NavigationButtons />
        <div className="main-content">
          <h1>Log Workout</h1>
          <div className="workout-builder">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">Body Part</label>
                <select
                  id="category"
                  name="category"
                  onChange={handleBodyPartChange}
                >
                  <option value="">Select a body part</option>
                  <option value="Upper Arms">Upper Arms</option>
                  <option value="Lower Arms">Lower Arms</option>
                  <option value="Upper Legs">Upper Legs</option>
                  <option value="Lower Legs">Lower Legs</option>
                  <option value="Neck">Neck</option>
                  <option value="Back">Back</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Chest">Chest</option>
                  <option value="Waist">Waist</option>
                  <option value="Cardio">Cardio</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="muscle">Muscle</label>
                <select
                  id="muscle"
                  name="muscle"
                  onChange={handleMuscleChange}
                  value={selectedMuscle}
                >
                  <option value="">Select a muscle</option>
                  {filteredMuscles.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="exercise">Exercise</label>
                <select
                  id="exercise"
                  name="exercise"
                  onChange={handleExerciseChange}
                  value={selectedExercise}
                >
                  <option value="">Select an exercise</option>
                  {filteredExercises.map((exercise) => (
                    <option key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reps">Reps</label>
                <input
                  type="number"
                  id="reps"
                  name="reps"
                  value={reps}
                  onChange={handleRepsChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={weight}
                  onChange={handleWeightChange}
                  min="0"
                />
              </div>

              <button
                type="submit"
                className={`submit-btn ${buttonFlash ? "flash" : ""}`}
              >
                {buttonFlash ? "Workout Logged!" : "Submit"}
              </button>
            </form>
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogWorkoutPage;
