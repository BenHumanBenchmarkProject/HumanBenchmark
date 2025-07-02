import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

import { BASE_URL } from "./constants";

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesResponse = await axios.get(`${BASE_URL}exercises`);
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
