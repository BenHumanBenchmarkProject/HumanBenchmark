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
server.use(eventsRouter);
server.use(exercisesRouter);
server.use(socialGraphRouter);

const {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  createWorkout,
  createBodyPartStat,
  createMuscleStat,
  getMuscleStats,
  findUsersLeaderboard,
  markWorkoutComplete,
  deleteWorkout,
} = require("./model-prisma");

server.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// [Get] /api/users
server.get("/api/users", async (req, res, next) => {
  //get all users
  const search = req.query;
  try {
    const users = await findUsers(search);
    if (users.length) {
      //error handling
      res.json(users);
    } else if (!users.length) {
      next({ status: 404, message: "No users in database" });
    } else {
      next({
        status: 404,
        message: "No users found match the search criteria",
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Get] /api/users/:id
server.get("/api/users/:id", async (req, res, next) => {
  //get users by ID
  const id = Number(req.params.id);

  try {
    const user = await findUserById(id);
    if (user) {
      //error handling
      res.json(user);
    } else {
      next({ status: 404, message: `User not found with ID ${id}` });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/check-availability
server.post("/api/check-availability", async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/users
server.post("/api/users", async (req, res, next) => {
  //create User
  const newUser = req.body;
  try {
    const newUserValid = //error handling
      newUser.username !== undefined &&
      newUser.password !== undefined &&
      newUser.height !== undefined &&
      newUser.weight !== undefined &&
      newUser.age !== undefined &&
      newUser.gender !== undefined;
    if (newUserValid) {
      const created = await createUser(newUser);
      res.status(201).json(created);
    } else {
      next({
        status: 422,
        message:
          "Username, password, height, weight, age, and gender are all required fields",
      });
    }
  } catch (err) {
    next(err);
  }
});

//[Put] /api/users/:id
server.put("/api/users/:id", async (req, res, next) => {
  //update User
  const id = Number(req.params.id);
  const changes = req.body;

  try {
    const user = await findUserById(id);

    if (user) {
      const updated = await updateUser(id, changes);
      res.json(updated);
    } else {
      next({ status: 422, message: "Invalid ID or changes" });
    }
  } catch (err) {
    next(err);
  }
});

//[Post] /users/login
server.post("/api/users/login", async (req, res, next) => {
  // verify user details
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        workouts: true,
        workouts: true,
        muscleStats: true,
        bodyPartStats: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user; // Set session

      res.json({ success: true, user, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
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

//[Get] /api/users/:userId/workouts
server.get("/api/users/:userId/workouts", async (req, res, next) => {
  const userId = Number(req.params.userId);
  const search = { ...req.query, userId };

  try {
    const workouts = await prisma.workout.findMany({
      where: search,
      include: {
        movements: true,
      },
    });
    if (workouts.length) {
      res.json(workouts);
    } else {
      next({
        status: 404,
        message: `No workouts found for user ID: ${userId}`,
      });
    }
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

//[Get] /api/users/:userId/musclestats
server.get("/api/users/:userId/musclestats", async (req, res, next) => {
  const userId = Number(req.params.userId);
  const search = { ...req.query, userId };

  try {
    const muscleStats = await prisma.muscleStat.findMany({
      where: search,
    });
    if (muscleStats.length) {
      res.json(muscleStats);
    } else {
      next({
        status: 404,
        message: `No muscle stats found for user ID: ${userId}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/users/:userId/bodyPartStats
server.post("/api/users/:userId/bodyPartStats", async (req, res, next) => {
  const userId = Number(req.params.userId);
  const newBodyPartStat = req.body;
  newBodyPartStat.userId = userId;

  try {
    const created = await createBodyPartStat(userId, newBodyPartStat);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// [Get] /api/users/:userId/bodyPartStats
server.get("/api/users/:userId/bodyPartStats", async (req, res, next) => {
  const userId = Number(req.params.userId);

  try {
    const bodyPartStats = await prisma.bodyPartStat.findMany({
      where: { userId: userId },
    });

    if (bodyPartStats.length) {
      res.json(bodyPartStats);
    } else {
      next({
        status: 404,
        message: `No body part stats found for user ID: ${userId}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/users/:userId/muscleStats
server.post("/api/users/:userId/muscleStats", async (req, res, next) => {
  const userId = Number(req.params.userId);
  const newMuscleStat = req.body;
  newMuscleStat.userId = userId;

  try {
    const created = await createMuscleStat(userId, newMuscleStat);
    res.status(201).json(created);
  } catch (err) {
    next(err);
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
