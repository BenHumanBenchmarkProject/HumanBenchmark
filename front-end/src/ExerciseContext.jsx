import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      const options = {
        method: "GET",
        url: "https://exercisedb.p.rapidapi.com/exercises",
        params: { limit: "0", offset: "0" }, //limit 0 fetches all exercises
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const transformedData = response.data.map((exercise) => ({
          id: parseInt(exercise.id, 10),
          name: exercise.name,
          bodyParts: [exercise.bodyPart],
          targetMuscle: exercise.target,
          overview: exercise.description,
          exerciseTips: exercise.instructions.join(" "), // join instructions into a single string
          createdAt: new Date(),
          workouts: [],
          muscleStats: [],
        }));


        setExercises(transformedData);
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
