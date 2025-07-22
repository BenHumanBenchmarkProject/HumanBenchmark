const express = require("express");
const server = express();
server.use(express.json());

const cors = require("cors");
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const helmet = require("helmet");
server.use(helmet());

const bcrypt = require("bcryptjs");

const session = require("express-session");
server.use(
  session({
    // initialize session middleware
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const eventsRouter = require("./events/events.js");
const exercisesRouter = require("./exercises/exercises.js");
const socialGraphRouter = require("./socialGraph/socialGraph.js");
const usersRouter = require("./users/users.js");
server.use(eventsRouter);
server.use(exercisesRouter);
server.use(socialGraphRouter);
server.use(usersRouter);

const {
  createWorkout,
  findUsersLeaderboard,
  markWorkoutComplete,
  deleteWorkout,
} = require("./model-prisma");

server.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

//[Post] /api/users/:userId/workouts
server.post("/api/users/:userId/workouts", async (req, res, next) => {
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
server.patch("/api/workouts/:workoutId/complete", async (req, res) => {
  try {
    const workoutId = Number(req.params.workoutId);
    const updatedWorkout = await markWorkoutComplete(workoutId);
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark workout as complete" });
  }
});

//[Delete] /api/workouts/:workoutId
server.delete("/api/workouts/:workoutId", async (req, res) => {
  try {
    const workoutId = Number(req.params.workoutId);
    const deletedWorkout = await deleteWorkout(workoutId);
    res.json(deletedWorkout);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// [Get] /api/leaderboard
server.get("/api/leaderboard", async (req, res, next) => {
  const search = req.query; // Use query parameters if needed for filtering
  try {
    const users = await findUsersLeaderboard(search);
    if (users.length) {
      res.json(users);
    } else {
      next({ status: 404, message: "No users found for the leaderboard" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = server;
