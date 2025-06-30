import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesResponse = await axios.get("http://localhost:3000/api/exercises");
        setExercises(exercisesResponse.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <ExerciseContext.Provider value={exercises}>
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext;
