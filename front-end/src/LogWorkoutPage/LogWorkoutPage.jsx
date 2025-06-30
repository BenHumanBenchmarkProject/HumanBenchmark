import "./LogWorkoutPage.css";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";
import ExerciseContext from "../ExerciseContext";
import React, { useContext, useState } from "react";

const LogWorkoutPage = () => {
  const exercises = useContext(ExerciseContext);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const handleBodyPartChange = (event) => {
    setSelectedBodyPart(event.target.value.toLowerCase());
    setSelectedMuscle(""); // reset muscle selection when body part changes
  };

  const handleMuscleChange = (event) => {
    setSelectedMuscle(event.target.value);
  };

  // filter exercises based on selected body part
  const exercisesByBodyPart = selectedBodyPart
    ? exercises.filter((exercise) =>
        exercise.bodyParts.includes(selectedBodyPart)
      )
    : exercises;

  // extract unique muscles from filtered exercises
  const filteredMuscles = exercisesByBodyPart
    .map((exercise) => exercise.targetMuscle)
    .filter((value, index, self) => self.indexOf(value) === index);

  // filter exercises based on selected muscle or body part
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
            <form>
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
                <select id="exercise" name="exercise">
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
                  defaultValue="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  defaultValue="0"
                  min="0"
                />
              </div>

              <button type="submit" className="submit-btn">
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
