const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ERROR_RELATION_ALREADY_EXISTS = "P2002";
const ACCEPTED_STATUS = "accepted";
const PENDING_STATUS = "pending";

const {
  getFriendIds,
  getDynamicWeights,
  getRecommendationScore,
} = require("./socialGraphHelper");

async function getMutualFriends(userA, userB) {
  try {
    const friendsOfA = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userA }, { friendId: userA }],
        status: ACCEPTED_STATUS,
      },
    });

    const friendsOfB = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: userB }, { friendId: userB }],
        status: ACCEPTED_STATUS,
      },
    });

    const friendIdsOfA = await getFriendIds(friendsOfA, userA);
    const friendIdsOfB = await getFriendIds(friendsOfB, userB);

    const mutualFriendIds = friendIdsOfA.filter((id) =>
      friendIdsOfB.includes(id)
    );

    const mutualFriends = await prisma.user.findMany({
      where: { id: { in: mutualFriendIds } },
    });

    return mutualFriends;
  } catch (error) {
    console.error("Error fetching mutual friends:", error);
    throw error;
  }
}

module.exports = {
  getMutualFriends,

  async addFriend(userId, friendId) {

    try {
      const friend = await prisma.friendship.create({
        data: { userId, friendId, status: PENDING_STATUS },
      });
      console.log(`Friendship created between ${userId} and ${friendId}`);
      return friend;
    } catch (error) {
      if (error.code === ERROR_RELATION_ALREADY_EXISTS) {
        console.log(
          `Friendship already exists between ${userId} and ${friendId}`
        );
      } else {
        console.error("Error creating friendship:", error);
      }
    }
  },

  async acceptFriendRequest(userA, userB) {
    const [userId, friendId] = userA < userB ? [userA, userB] : [userB, userA]; // Prevents duplicate friendships. Ensures order is always the same

    try {
      const updatedFriendship = await prisma.friendship.update({
        where: { userId_friendId: { userId, friendId } },
        data: { status: ACCEPTED_STATUS },
      });
      console.log(`Friendship accepted between ${userId} and ${friendId}`);
      await refreshFriendRecommendations(userId);
      await refreshFriendRecommendations(friendId);

      return updatedFriendship;
    } catch (error) {
      console.error("Error accepting friendship:", error);
    }
  },

  async deleteFriend(userA, userB) {
    const [userId, friendId] = userA < userB ? [userA, userB] : [userB, userA]; // Prevents duplicate friendships. Ensures order is always the same

    try {
      const deletedFriendship = await prisma.friendship.delete({
        where: {
          userId_friendId: {
            userId,
            friendId,
          },
        },
      });
      console.log(`Friendship deleted between ${userId} and ${friendId}`);
      return deletedFriendship;
    } catch (error) {
      console.error("Error deleting friendship:", error);
    }
  },

  async getFriends(userId) {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        status: ACCEPTED_STATUS,
      },
    });

    return await prisma.user.findMany({
      where: { id: { in: getFriendIds(friends, userId) } },
    });
  },

  async getFriendRequests(userId) {
    const friends = await prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: PENDING_STATUS,
      },
      include: { user: true },
    });

    return await prisma.user.findMany({
      where: { id: { in: getFriendIds(friends, userId) } },
    });
  },

  async getTopFriendRecommendations(userId) {
    // Stretch Formula
    try {
      const cached = await prisma.friendRecommendation.findMany({
        where: { userId },
        orderBy: { score: "desc" },
        take: 50,
        include: { recommendedUser: true },
      });

      const latest = cached[0]?.createdAt;
      const ageMs = latest ? Date.now() - new Date(latest).getTime() : Infinity;
      const isStale = ageMs > 1000 * 60 * 60 * 24; // 24 hours

      if (cached.length && !isStale) {
        return cached.map((recommendation) => recommendation.recommendedUser);
      }

      // Otherwise, generate new cache
      const allFriendships = await prisma.friendship.findMany({
        where: { status: ACCEPTED_STATUS },
      });

      const friendMap = new Map(); // build map to reuse
      for (const { userId, friendId } of allFriendships) {
        if (!friendMap.has(userId)) friendMap.set(userId, new Set());
        if (!friendMap.has(friendId)) friendMap.set(friendId, new Set());
        friendMap.get(userId).add(friendId);
        friendMap.get(friendId).add(userId);
      }

      const friendIds = Array.from(friendMap.get(userId) || []);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          workouts: {
            include: { movements: true },
          },
        },
      });

      const userFriends = await prisma.user.findMany({
        where: { id: { in: friendIds } },
        include: {
          workouts: {
            include: { movements: true },
          },
        },
      });
      const dynamicWeights = await getDynamicWeights(user, userFriends);

      // Fetch all users except the current user
      const allUsers = await prisma.user.findMany({
        where: {
          id: {
            not: userId,
            notIn: friendIds,
          },
        },
        include: {
          workouts: {
            include: { movements: true },
          },
        },
      });

      // Calculate recommendation scores for each user
      const recommendations = await Promise.all(
        allUsers.map(async (potential) => {
          const score = await getRecommendationScore(
            user,
            potential,
            dynamicWeights,
            friendMap // pass in friendMap to reuse
          );
          return { friend: potential, score };
        })
      );

      // Get top 50 recommendations sorted
      const top = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 50);

      // Clear old cache
      await prisma.friendRecommendation.deleteMany({ where: { userId } });

      // Save new cache
      await prisma.friendRecommendation.createMany({
        data: top.map((r) => ({
          userId,
          recommendedUserId: r.friend.id,
          score: r.score,
        })),
      });

      return top.map((r) => r.friend);
    } catch (error) {
      console.error("Error getting top friend recommendations:", error);
      throw error;
    }
  },

  async refreshFriendRecommendations(userId) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
        status: ACCEPTED_STATUS,
      },
    });

    const friendIds = getFriendIds(friendships, userId);

    const allUsers = await prisma.user.findMany({
      where: { id: { not: userId, notIn: friendIds } },
    });

    const recommendations = await Promise.all(
      allUsers.map(async (friend) => {
        const score = await getRecommendationScore(userId, friend.id);
        return { friend, score };
      })
    );

    recommendations.sort((a, b) => b.score - a.score);
    const top = recommendations.slice(0, 50);

    await prisma.friendRecommendation.deleteMany({ where: { userId } });

    await prisma.friendRecommendation.createMany({
      data: top.map((recommendation) => ({
        userId,
        recommendedUserId: recommendation.friend.id,
        score: recommendation.score,
      })),
    });
  },
};
