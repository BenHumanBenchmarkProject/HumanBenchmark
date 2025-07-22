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
const workoutsRouter = require("./workouts/workouts.js");
server.use(eventsRouter);
server.use(exercisesRouter);
server.use(socialGraphRouter);
server.use(usersRouter);
server.use(workoutsRouter);

const { findUsersLeaderboard } = require("./model-prisma");

server.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
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
