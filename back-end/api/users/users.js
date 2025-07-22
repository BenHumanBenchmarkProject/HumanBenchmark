const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = express.Router();

users.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const {
  findUsers,
  findUserById,
  createUser,
  updateUser,
  createBodyPartStat,
  createMuscleStat,
} = require("./users-model.js");

// [Get] /api/users
users.get("/api/users", async (req, res, next) => {
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
users.get("/api/users/:id", async (req, res, next) => {
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
users.post("/api/check-availability", async (req, res, next) => {
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
users.post("/api/users", async (req, res, next) => {
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
users.put("/api/users/:id", async (req, res, next) => {
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
users.post("/api/users/login", async (req, res, next) => {
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

//[Get] /api/users/:userId/musclestats
users.get("/api/users/:userId/musclestats", async (req, res, next) => {
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
users.post("/api/users/:userId/bodyPartStats", async (req, res, next) => {
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
users.get("/api/users/:userId/bodyPartStats", async (req, res, next) => {
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
users.post("/api/users/:userId/muscleStats", async (req, res, next) => {
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

//[Get] /api/users/:userId/workouts
users.get("/api/users/:userId/workouts", async (req, res, next) => {
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

module.exports = users;
