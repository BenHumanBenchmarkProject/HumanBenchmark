const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const leaderboard = express.Router();

leaderboard.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const { findUsersLeaderboard } = require("./leaderboard-model");

// [Get] /api/leaderboard
leaderboard.get("/api/leaderboard", async (req, res, next) => {
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

module.exports = leaderboard;
