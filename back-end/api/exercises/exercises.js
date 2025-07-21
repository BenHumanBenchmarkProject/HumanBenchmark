const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const exercises = express.Router();

exercises.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const { findExercises, } = require("./exercises-model");

// [Get] /exercises
exercises.get("/api/exercises", async (req, res, next) => {
  // get all exercises
  const search = req.query;
  try {
    const exercises = await findExercises(search);
    console.log(`Number of exercises fetched: ${exercises.length}`);
    if (exercises.length) {
      //error handling
      res.json(exercises);
    } else if (!exercises.length) {
      next({ status: 404, message: "No exercises in database" });
    } else {
      next({
        status: 404,
        message: "No exercises found match the search criteria",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/exercises
exercises.post("/api/exercises", async (req, res, next) => {
  const exercises = req.body;

  if (!Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({ error: "Exercises data is required" });
  }

  try {
    const createdExercises = [];
    for (const exercise of exercises) {
      // Check if the exercise already exists
      const existingExercise = await prisma.exercise.findUnique({
        where: { name: exercise.name },
      });

      if (!existingExercise) {
        const createdExercise = await prisma.exercise.create({
          data: exercise,
        });
        createdExercises.push(createdExercise);
      }
    }
    res
      .status(201)
      .json({ message: "Exercises saved", count: createdExercises.length });
  } catch (err) {
    console.error("Error saving exercises:", err);
    next(err);
  }
});

// [Get] /api/exercises/bodyPart/:bodyPart
exercises.get("/api/exercises/bodyPart/:bodyPart", async (req, res, next) => {
  // get exercises by body part
  const { bodyPart } = req.params;
  try {
    const exercises = await prisma.exercise.findMany({
      where: { bodyParts: { has: bodyPart } },
    });
    if (exercises.length) {
      res.json(exercises);
    } else {
      next({
        status: 404,
        message: `No exercises found for body part: ${bodyPart}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Get] /api/exercises/targetMuscle/:targetMuscle
exercises.get(
  "/api/exercises/targetMuscle/:targetMuscle",
  async (req, res, next) => {
    // get exercises by target muscle
    const { targetMuscle } = req.params;
    try {
      const exercises = await prisma.exercise.findMany({
        where: { targetMuscle },
      });
      if (exercises.length) {
        res.json(exercises);
      } else {
        next({
          status: 404,
          message: `No exercises found for target muscle: ${targetMuscle}`,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = exercises;
