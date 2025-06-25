const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { PrismaClient } = require("@prisma/client");
const {
  findUsers,
  findUserById,
  createUser,
  updateUser,
} = require("./model-prisma");

const prisma = new PrismaClient();
const server = express();
server.use(helmet());
server.use(express.json());
server.use(cors());

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

// [Get] /api/check-availability
server.get('/api/check-availability', async (req, res, next) => { // check if username or email is available
  const { email, username } = req.query;

  try {
      let user;
      if (email) {
          user = await prisma.user.findUnique({ where: { email } });
      } else if (username) {
          user = await prisma.user.findUnique({ where: { username } });
      }

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

module.exports = server;
