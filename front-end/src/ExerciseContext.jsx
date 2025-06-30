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
        params: { limit: "0", offset: "0" },
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          "x-rapidapi-host": "exercisedb.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        const transformedData = response.data.map((exercise) => ({
          //id is provided from the API, but we need to generate our own unique id
          name: exercise.name,
          bodyParts: [exercise.bodyPart],
          targetMuscle: exercise.target,
          overview: exercise.description,
          exerciseTips: exercise.instructions.join(" "),
          createdAt: new Date(),
        }));

        console.log("Transformed Data:", transformedData);

      for (const exercise of transformedData) {
        await axios.post("http://localhost:3000/api/exercises", [exercise]);
      }

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
