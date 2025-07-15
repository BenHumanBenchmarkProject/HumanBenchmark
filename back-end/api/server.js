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
  addFriend,
  getFriends,
  acceptFriendRequest,
  deleteFriend,
  getFriendRequests,
  getMutualFriends,
  getTopFriendRecommendations,
  markWorkoutComplete,
  deleteWorkout,
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

//[Get] /api/users/:userId/friends
server.get("/api/users/:id/friends", async (req, res, next) => {
  // get friends by user ID
  const id = Number(req.params.id);
  try {
    const friends = await getFriends(id);
    if (friends && friends.length) {
      res.json(friends);
    } else {
      next({ status: 404, message: `No friends found for user ID: ${id}` });
    }
  } catch (err) {
    next(err);
  }
});

//[Get] /api/users/:userId/friendRequests
server.get("/api/users/:id/friendRequests", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const friendRequests = await getFriendRequests(id);
    if (friendRequests && friendRequests.length) {
      res.json(friendRequests);
    } else {
      next({
        status: 404,
        message: `No friend requests found for user ID: ${id}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

//[Post] /api/users/:userId/friends/:friendId
server.post("/api/users/:userId/friends/:friendId", async (req, res, next) => {
  //send friend request
  const userId = Number(req.params.userId);
  const friendId = Number(req.params.friendId);

  try {
    const request = await addFriend(userId, friendId);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

//[Post] /api/users/:userId/friends/:friendId/accept
server.post(
  "/api/users/:userId/friends/:friendId/accept",
  async (req, res, next) => {
    //accept friend request

    const userId = Number(req.params.userId);
    const friendId = Number(req.params.friendId);

    try {
      const accepted = await acceptFriendRequest(userId, friendId);
      res.status(201).json(accepted);
    } catch (err) {
      next(err);
    }
  }
);

//[Delete] /api/users/:userId/friends/:friendId/delete
server.delete(
  "/api/users/:userId/friends/:friendId/delete",
  async (req, res, next) => {
    //delete friend/ decline friend request
    const userId = Number(req.params.userId);
    const friendId = Number(req.params.friendId);
    try {
      const deleted = await deleteFriend(userId, friendId);
      res.status(201).json(deleted);
    } catch (err) {
      next(err);
    }
  }
);

// [Get] /api/friendships
server.get("/api/friendships", async (req, res, next) => {
  try {
    const friendships = await prisma.friendship.findMany();
    if (friendships.length) {
      res.json(friendships);
    } else {
      next({ status: 404, message: "No friendships found in the database" });
    }
  } catch (err) {
    next(err);
  }
});

//[Get] /api/users/:userId/recommendedFriends
server.get("/api/users/:userId/recommendedFriends", async (req, res, next) => {
  const userId = Number(req.params.userId);
  try {
    const recommendedFriends = await getTopFriendRecommendations(userId);
    if (recommendedFriends && recommendedFriends.length) {
      res.json(recommendedFriends);
    } else {
      next({
        status: 404,
        message: `No recommended friends found for user ID: ${userId}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

//[Get] /api/users/:userA/mutaualFriends/:userB
server.get("/api/users/:userA/mutualFriends/:userB", async (req, res, next) => {
  const userA = Number(req.params.userA);
  const userB = Number(req.params.userB);

  try {
    const mutualFriends = await getMutualFriends(userA, userB);
    if (mutualFriends && mutualFriends.length) {
      res.json(mutualFriends);
    } else {
      next({
        status: 404,
        message: `No mutual friends found for userA ID: ${userA} and userB ID: ${userB}`,
      });
    }
  } catch (err) {
    next(err);
  }
});

// [Post] /api/events
server.post("/api/events", async (req, res) => {
  // create new Calendar Event
  const { title, description, start, end, type, createdById, participantIds } =
    req.body;
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        type,
        createdBy: { connect: { id: createdById } },
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
    });

    res.json(event);
  } catch (err) {
    console.log(err);
  }
});

//[Put] /api/events/:id
server.put("/api/events/:id", async (req, res) => {
  //edit event
  const { title, start, end, description, type, participantIds } = req.body;
  const id = Number(req.params.id);

  try {
    const updated = await prisma.calendarEvent.update({
      where: { id: id },
      data: {
        title,
        description,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        type,
        participants: participantIds
          ? { set: participantIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
});

//[Delete] /api/events/:id
server.delete("/api/events/:id", async (req, res) => {
  //Delete event
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.calendarEvent.delete({
      where: { id: id },
    });

    res.json({ message: "Deleted", deleted });
  } catch (err) {
    console.log(err);
  }
});

//[Get] /api/events/:userId
server.get("/api/events/:userId", async (req, res) => {
  // get User Calendar Events
  const userId = Number(req.params.userId);

  try {
    const events = await prisma.calendarEvent.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: { id: true, username: true },
        },
        createdBy: {
          select: { id: true, username: true },
        },
      },
    });

    res.json(events);
  } catch (err) {
    console.log(err);
  }
});

//[Get] /api/availability/:userId
server.get("/api/availability/:userId", async (req, res) => {
  // get User Calendar Events
  const userId = Number(req.params.userId);
  try {
    const availability = await prisma.availability.findMany({
      where: { userId },
    });

    res.json(availability);
  } catch (err) {}
});

//[Post] /api/availability
server.post("/api/availability", async (req, res) => {
  // create new availability block
  const { userId, dayOfWeek, startTime, endTime } = req.body;

  try {
    const created = await prisma.availability.create({
      data: { userId, dayOfWeek, startTime, endTime },
    });

    res.json(created);
  } catch (err) {
    console.log(err);
  }
});

//[Put] /api/availability/:id
server.put("/api/availability/:id", async (req, res) => {
  // edit availability block
  const id = Number(req.params.id);
  const { startTime, endTime } = req.body;
  try {
    const updated = await prisma.availability.update({
      where: { id: id },
      data: { startTime, endTime },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
});

//[Delete] /api/availability/:id
server.delete("/api/availability/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.availability.delete({
      where: { id: id },
    });

    res.json({ message: "Availability deleted", deleted });
  } catch (err) {
    console.log(err);
  }
});

module.exports = server;
