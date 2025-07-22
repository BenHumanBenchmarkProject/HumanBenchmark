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

const eventsRouter = require("./events/events.js");
const exercisesRouter = require("./exercises/exercises.js");
const socialGraphRouter = require("./socialGraph/socialGraph.js");
const usersRouter = require("./users/users.js");
const workoutsRouter = require("./workouts/workouts.js");
const leaderboardRouter = require("./leaderboard/leaderboard.js");
server.use(eventsRouter);
server.use(exercisesRouter);
server.use(socialGraphRouter);
server.use(usersRouter);
server.use(workoutsRouter);
server.use(leaderboardRouter);

server.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

module.exports = server;
