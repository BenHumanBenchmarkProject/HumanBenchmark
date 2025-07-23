import "./LogWorkoutPage.css";
import ExerciseContext from "../ExerciseContext";
import React, { useContext, useState } from "react";
import { useUser } from "../userContext";
import axios from "axios";
import { useLoading } from "../loadingContext";
import { BASE_URL, NavigationButtons } from "../constants";

const LogWorkoutPage = () => {
  const { user, login } = useUser();
  const { setLoading } = useLoading();
  const userId = user ? user.id : null;
  const exercises = useContext(ExerciseContext);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [weight, setWeight] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonFlash, setButtonFlash] = useState(false); // new state for successful submission
  const [plan, setPlan] = useState([]);
  const [workoutName, setWorkoutName] = useState("");

  const resetForm = () => {
    setSelectedBodyPart("");
    setSelectedMuscle("");
    setSelectedExercise("");
    setReps(0);
    setWeight(0);
  };

  const handleClearPlan = () => {
    setPlan([]);
    setWorkoutName("");
  };

  const handleSetsChange = (event) => {
    setSets(event.target.value);
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

  const handleWorkoutNameChange = (event) => {
    setWorkoutName(event.target.value);
  };

  const handleAdd = (event) => {
    event.preventDefault();

    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    if (!exercise) {
      console.error("Exercise not found");
      return;
    }

    const newExercise = {
      name: selectedExercise,
      bodyPart: selectedBodyPart,
      reps: parseInt(reps, 10),
      sets: parseInt(sets, 10),
      weight: parseInt(weight, 10),
      muscle: selectedMuscle,
    };

    setPlan([...plan, newExercise]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!plan.length) {
      console.error("No exercises in plan");
      return;
    }
    setLoading(true);
    try {
      // Create the workout
      const response = await axios.post(`${BASE_URL}users/${userId}/workouts`, {
        name: workoutName,
        isComplete: true,
        completedAt: new Date().toISOString(),
        movements: plan.map((exercise) => ({
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          reps: exercise.reps,
          sets: exercise.sets,
          weight: exercise.weight,
          max: exercise.weight * (1 + exercise.reps / 30), // Epley Formula
          muscle: exercise.muscle,
        })),
      });
      // Ftech updated user data
      const updatedUserResponse = await axios.get(`${BASE_URL}users/${userId}`);

      // update user context with the latest data
      if (updatedUserResponse.data) {
        login(updatedUserResponse.data);
      }

      console.log("Workout logged successfully");
      resetForm(); // reset form after submission
      setSuccessMessage("Workout logged successfully!");
      setButtonFlash(true);
      setTimeout(() => setButtonFlash(false), 2500); // flash for 2.5 seconds
      handleClearPlan(); // clear plan after submission
    } catch (error) {
      console.error("Error logging workout:", error);
    } finally {
      setLoading(false);
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
          <div className="boxes">
            <div className="workout-builder">
              <form onSubmit={handleAdd}>
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
                  <label htmlFor="sets">Sets</label>
                  <input
                    type="number"
                    id="sets"
                    name="sets"
                    value={sets}
                    onChange={handleSetsChange}
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
                  Add
                </button>
              </form>
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
            </div>
            <div className="log-plan-box">
              <div className="plan-header">Plan</div>
              {plan.map((exercise, index) => (
                <div key={index} className="plan-item">
                  {exercise.name} {exercise.sets}x{exercise.reps} @
                  {exercise.weight}lb
                </div>
              ))}

              <div className="plan-buttons">
                <button className="plan-btn" onClick={handleSubmit}>
                  {buttonFlash ? "Workout Logged!" : "Save"}
                </button>
                <button className="plan-btn" onClick={handleClearPlan}>
                  Clear
                </button>
              </div>
              <div className="form-group">
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
    </>
  );
};

export default LogWorkoutPage;
