import "./WorkoutModal.css";
import React from "react";

const WorkoutModal = ({ workout, onClose }) => {
  if (!workout) return null;

  return (
    <div className="modal-backdrop">
      <div className="workout-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="workout-name">{workout.name}</h2>
        <p>
          {" "}
          {workout.completedAt
            ? `Completed on: ${new Date(
                workout.completedAt
              ).toLocaleDateString()}`
            : "Incomplete"}
        </p>
        <ul>
          {workout.movements.map((movement, index) => (
            <li key={index}>
              <strong>{movement.name}</strong>: {movement.reps} reps,{" "}
              {movement.sets} sets, {movement.weight} lbs
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutModal;
