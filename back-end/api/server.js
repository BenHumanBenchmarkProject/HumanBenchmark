const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  findExercises,
  createWorkout,
  createBodyPartStat,
  createMuscleStat,
  getMuscleStats,
  findUsersLeaderboard,
} = require("./model-prisma");

const prisma = new PrismaClient();
const server = express();

server.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

server.use(helmet());
server.use(express.json());
server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

server.get((req, res) => {
  console.log("GET request received");
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

// [Get] /exercises
server.get("/api/exercises", async (req, res, next) => {
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
server.post("/api/exercises", async (req, res, next) => {
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
server.get("/api/exercises/bodyPart/:bodyPart", async (req, res, next) => {
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
server.get(
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

//[Post] /api/users/:userId/workouts
server.post(
  //create Workout
  "/api/users/:userId/workouts",
  async (req, res, next) => {
    const { name, movements } = req.body;
    const userId = Number(req.params.userId);

    if (!name || !Array.isArray(movements) || movements.length === 0) {
      return res
        .status(400)
        .json({ error: "Workout name and movements are required" });
    }

    try {
      // Create the workout
      const createdWorkout = await prisma.workout.create({
        data: {
          name,
          userId,
          movements: {
            create: movements.map((movement) => ({
              name: movement.name,
              bodyPart: movement.bodyPart,
              reps: movement.reps,
              sets: movement.sets,
              weight: movement.weight,
              max: movement.max,
              muscle: movement.muscle,
              userId: userId,
            })),
          },
        },
        include: {
          movements: true,
        },
      });
      res.status(201).json(createdWorkout);
    } catch (err) {
      next(err);
    }
  }
);

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
