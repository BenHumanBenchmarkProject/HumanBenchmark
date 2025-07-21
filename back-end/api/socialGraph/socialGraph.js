const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const social = express.Router();

social.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const {
  addFriend,
  getFriends,
  acceptFriendRequest,
  deleteFriend,
  getFriendRequests,
  getMutualFriends,
  getTopFriendRecommendations,
} = require("./socialGraph-model.js");

//[Get] /api/users/:userId/friends
social.get("/api/users/:id/friends", async (req, res, next) => {
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
social.get("/api/users/:id/friendRequests", async (req, res, next) => {
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
social.post("/api/users/:userId/friends/:friendId", async (req, res, next) => {
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
social.post(
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
social.delete(
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
social.get("/api/friendships", async (req, res, next) => {
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
social.get("/api/users/:userId/recommendedFriends", async (req, res, next) => {
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
social.get("/api/users/:userA/mutualFriends/:userB", async (req, res, next) => {
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

module.exports = social;
