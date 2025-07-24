const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const workouts = express.Router();

workouts.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const {
  createWorkout,
  markWorkoutComplete,
  deleteWorkout,
} = require("./workouts-model.js");

//[Post] /api/users/:userId/workouts
workouts.post("/api/users/:userId/workouts", async (req, res, next) => {
  const { name, isComplete, completedAt, movements } = req.body;
  const userId = Number(req.params.userId);

  if (!name || !Array.isArray(movements) || movements.length === 0) {
    return res
      .status(400)
      .json({ error: "Workout name and movements are required" });
  }

  try {
    const { createdWorkout, updatedUser } = await createWorkout(userId, {
      name,
      isComplete,
      completedAt,
      movements,
    });

    res
      .status(201)
      .json({ message: "Workouts created", createdWorkout, updatedUser });
  } catch (err) {
    next(err);
  }
});

//[Patch] /api/workouts/:workoutId/complete
workouts.patch("/api/workouts/:workoutId/complete", async (req, res) => {
  try {
    const workoutId = Number(req.params.workoutId);
    const updatedWorkout = await markWorkoutComplete(workoutId);
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark workout as complete" });
  }
});

//[Delete] /api/workouts/:workoutId
workouts.delete("/api/workouts/:workoutId", async (req, res) => {
  try {
    const workoutId = Number(req.params.workoutId);
    const deletedWorkout = await deleteWorkout(workoutId);
    res.json(deletedWorkout);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.VITE_AI_API_KEY);

workouts.post("/api/generateWorkout", async (req, res) => {
  const { userPrompt } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  try {
    const exercises = await prisma.exercise.findMany();

    const formattedList = exercises
      .map(
        (exercise) =>
          `${exercise.name} (${exercise.bodyParts[0]}), targets ${exercise.targetMuscle}`
      )
      .join("\n");

    // create add dynamic data into the static prompt
    const prompt = `
You are a fitness AI assistant. A user said: "${userPrompt}"

You have access to the following exercises:
${formattedList}

Return a workout plan as an array of JSON objects with the following format:
[
  {
    "name": "Exercise Name",
    "sets": 3,
    "reps": 10,
    "weight": 100
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const plan = JSON.parse(text.slice(jsonStart, jsonEnd));

    res.json({ plan });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

module.exports = workouts;
