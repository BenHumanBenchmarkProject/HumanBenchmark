const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ERROR_RELATION_ALREADY_EXISTS = "P2002";
const ACCEPTED_STATUS = "accepted";
const PENDING_STATUS = "pending";
const MAX_AGE_DIFFERENCE = 20;
const MUTUAL_FRIENDS_WEIGHT = 0.4;
const WORKOUT_FREQUENCY_WEIGHT = 0.225;
const AGE_DIFFERENCE_WEIGHT = 0.15;
const GEO_DISTANCE_WEIGHT = 0.225;

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

function getFriendIds(friends, userId) {
  return friends.map((friend) =>
    friend.userId === userId ? friend.friendId : friend.userId
  );
}

function getAgeDifference(user, friend) {
  dif = Math.abs(user.age - friend.age);
  return 1 - Math.min(dif / MAX_AGE_DIFFERENCE, 1); // 20 is the max age difference
}

function getWorkoutFrequency(user, friend) {
  let userVector = getMuscleVector(user);
  let friendVector = getMuscleVector(friend);

  return getCosineSimilarity(userVector, friendVector);
}

function getMuscleVector(user) {
  const muscleVector = {};

  if (!user.workouts || user.workouts.length === 0) return muscleVector;

  // Iterate through each workout
  user.workouts.forEach((workout) => {
    // Iterate through each movement in the workout
    workout.movements.forEach((movement) => {
      const muscle = movement.muscle;
      // Increment the count for the muscle in the vector
      if (muscle) {
        muscleVector[muscle] = (muscleVector[muscle] || 0) + 1;
      }
    });
  });

  return muscleVector;
}

function getCosineSimilarity(userVector, friendVector) {
  const allMuscles = new Set([
    ...Object.keys(userVector),
    ...Object.keys(friendVector),
  ]);

  // dot product and magnitudes
  let dotProduct = 0;
  let userMagnitude = 0;
  let friendMagnitude = 0;

  allMuscles.forEach((muscle) => {
    const userValue = userVector[muscle] || 0;
    const friendValue = friendVector[muscle] || 0;

    dotProduct += userValue * friendValue;
    userMagnitude += userValue * userValue;
    friendMagnitude += friendValue * friendValue;
  });

  // calculate magnitudes
  userMagnitude = Math.sqrt(userMagnitude);
  friendMagnitude = Math.sqrt(friendMagnitude);

  if (userMagnitude === 0 || friendMagnitude === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (userMagnitude * friendMagnitude); //cosine similarity
}

function getGeoDistanceScore(user, friend) {
  let userLat = user.latitude;
  let userLong = user.longitude;
  let friendLat = friend.latitude;
  let friendLong = friend.longitude;

  if (
    userLat == null ||
    userLong == null ||
    friendLat == null ||
    friendLong == null
  ) {
    return 0;
  }

  // Calculate the distance between the two points in kilometers
  let latitudeDistance = ((userLat - friendLat) * Math.PI) / 180.0;
  let longitudeDistance = ((userLong - friendLong) * Math.PI) / 180.0;

  // Convert to radians
  userLat = (userLat * Math.PI) / 180.0;
  friendLat = (friendLat * Math.PI) / 180.0;

  // Calculate the Haversine formula
  let a =
    Math.pow(Math.sin(latitudeDistance / 2.0), 2) +
    Math.pow(Math.sin(longitudeDistance / 2.0), 2) *
      Math.cos(userLat) *
      Math.cos(friendLat);

  let earthRadius = 6371.0; // km
  let c = 2.0 * Math.asin(Math.sqrt(a));

  return earthRadius * c; // Distance in kilometers
}

async function getDynamicWeights(user, userFriends) {
  if (userFriends.length === 0) {
    return {
      mutual: MUTUAL_FRIENDS_WEIGHT,
      age: AGE_DIFFERENCE_WEIGHT,
      geo: GEO_DISTANCE_WEIGHT,
      workout: WORKOUT_FREQUENCY_WEIGHT,
    };
  }

  let totalAgeSimilarity = 0;
  let totalGeoSimilarity = 0;
  let totalWorkoutSimilarity = 0;

  for (const friend of userFriends) {
    totalAgeSimilarity += getAgeDifference(user, friend);
    totalGeoSimilarity += getGeoDistanceScore(user, friend);
    totalWorkoutSimilarity += getWorkoutFrequency(user, friend);
  }

  const total =
    totalAgeSimilarity + totalGeoSimilarity + totalWorkoutSimilarity || 1;

  const scale = 0.6; // remaining 60% after mutual
  return {
    mutual: MUTUAL_FRIENDS_WEIGHT,
    age: (totalAgeSimilarity / total) * scale,
    geo: (totalGeoSimilarity / total) * scale,
    workout: (totalWorkoutSimilarity / total) * scale,
  };
}

async function getRecommendationScore(user, friend, weights, mutualCount) {
  const ageScore = getAgeDifference(user, friend);
  const workoutScore = getWorkoutFrequency(user, friend);
  const geoScore = getGeoDistanceScore(user, friend);

  let score = 0;
  score += weights.mutual * mutualCount;
  score += weights.age * ageScore;
  score += weights.workout * workoutScore;
  score += weights.geo * geoScore;

  return score;
}
module.exports = {
  getMutualFriends,

  async addFriend(userA, userB) {
    const [userId, friendId] = userA < userB ? [userA, userB] : [userB, userA]; // Prevents duplicate friendships. Ensures order is always the same

    try {
      friend = await prisma.friendship.create({
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
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
          status: ACCEPTED_STATUS,
        },
      });

      const friendIds = getFriendIds(friendships, userId);

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const userFriends = await prisma.user.findMany({
        where: { id: { in: friendIds } },
      });
      const dynamicWeights = await getDynamicWeights(user, userFriends);

      // Fetch all users except the current user
      const allUsers = await prisma.user.findMany({
        where: { id: { not: userId, notIn: friendIds } },
      });

      // Calculate recommendation scores for each user
      const recommendations = await Promise.all(
        allUsers.map(async (potential) => {
          const mutualCount = (await getMutualFriends(userId, potential.id))
            .length;
          const score = await getRecommendationScore(
            user,
            potential,
            dynamicWeights,
            mutualCount
          );
          return { friend: potential, score };
        })
      );

      // Sort by score in descending order
      recommendations.sort((a, b) => b.score - a.score);

      // Get top 50 recommendations
      const top = recommendations.slice(0, 50);

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
