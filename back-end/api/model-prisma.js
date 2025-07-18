// import prisma client lib and instantiate
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
const MILLISECONDS_PER_MINUTE = 1000 * 60;

function calculateXP(movement) {
  // Should take user roughly 3 workouts to level up
  return (movement.reps * movement.sets * movement.weight) / 725;
}

function calculateScore(movement) {
  // new score better reflects the XP
  return (
    movement.reps * movement.sets * movement.weight * 0.0015 +
    movement.max * 0.2
  );
}

function calculateNewXPAndLevel(user, xpGained) {
  let newXP = user.xp + xpGained;
  let newLevel = user.level;
  const xpPerLevel = 100;

  while (newXP >= newLevel * xpPerLevel) {
    newXP -= newLevel * xpPerLevel;
    newLevel += 1;
  }

  return { newXP, newLevel };
}

function getFriendIds(friends, userId) {
  return friends.map((friend) =>
    friend.userId === userId ? friend.friendId : friend.userId
  );
}

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

function calculateOverallStat(bodyPartStats) {
  if (!bodyPartStats || bodyPartStats.length === 0) return 0;
  const totalScore = bodyPartStats.reduce((sum, stat) => sum + stat.score, 0);
  return totalScore / bodyPartStats.length;
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

async function getRecommendationScore(userId, friendId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const friend = await prisma.user.findUnique({ where: { id: friendId } });

  const mutualFriends = await getMutualFriends(userId, friendId);

  let score = 0;
  score += MUTUAL_FRIENDS_WEIGHT * mutualFriends.length; // mutual friends
  score += AGE_DIFFERENCE_WEIGHT * getAgeDifference(user, friend); // age similarity
  score += WORKOUT_FREQUENCY_WEIGHT * getWorkoutFrequency(user, friend); // workout frequency similarity
  score += GEO_DISTANCE_WEIGHT * getGeoDistanceScore(user, friend); // geographic similarity

  return score;
}

module.exports = {
  async findUsers(where) {
    // GET http://localhost:5432/api/users?type=Recent
    const users = await prisma.user.findMany({ where });
    return users;
  },

  async findUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  },

  async findUsersLeaderboard(where) {
    const users = await prisma.user.findMany({
      where,
      include: {
        bodyPartStats: true,
        muscleStats: true,
      },
    });
    return users;
  },

  async createUser(data) {
    const created = await prisma.user.create({ data });
    return created;
  },

  async updateUser(id, data) {
    const updated = await prisma.user.update({ where: { id }, data });
    return updated;
  },

  async findExercises() {
    const exercises = await prisma.exercise.findMany();
    console.log(`Number of exercises in database: ${exercises.length}`);
    return exercises;
  },

  async createBodyPartStat(userId, newBodyPartStat) {
    const created = await prisma.bodyPartStat.create({ data: newBodyPartStat });

    const bodyPartStats = await prisma.bodyPartStat.findMany({
      where: { userId },
    });

    prisma.user.update({
      where: { id: userId },
      data: { bodyPartStats: { push: created } },
    });
    return created;
  },

  async createMuscleStat(userId, newMuscleStat) {
    const createdMuscleStat = await prisma.muscleStat.create({
      data: {
        muscle: newMuscleStat.muscle,
        bodyPart: newMuscleStat.bodyPart,
        max: newMuscleStat.max,
        user: { connect: { id: userId } },
        exercise: newMuscleStat.exerciseId
          ? { connect: { id: newMuscleStat.exerciseId } }
          : undefined,
        bodyPartStat: newMuscleStat.bodyPartStatId
          ? { connect: { id: newMuscleStat.bodyPartStatId } }
          : undefined,
      },
    });

    return createdMuscleStat;
  },

  async getMuscleStats(userId) {
    const muscleStats = await prisma.muscleStat.findMany({
      where: { userId },
    });
    return muscleStats;
  },

  async createWorkout(userId, newWorkout) {
    try {
      // Fetch user with bodyPartStats
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { bodyPartStats: true },
      });

      if (!user) throw new Error(`User with ID ${userId} not found`);

      console.log("Creating workout with data:", newWorkout);

      // Create the workout with nested movements
      const createdWorkout = await prisma.workout.create({
        data: {
          name: newWorkout.name,
          isComplete: newWorkout.isComplete ?? false,
          completedAt: newWorkout.completedAt,
          user: { connect: { id: userId } },
          movements: {
            create: newWorkout.movements.map((movement) => ({
              name: movement.name,
              bodyPart: movement.bodyPart,
              reps: movement.reps,
              sets: movement.sets,
              weight: movement.weight,
              max: movement.max,
              muscle: movement.muscle,
              user: { connect: { id: userId } },
              exercise: movement.exerciseId
                ? { connect: { id: movement.exerciseId } }
                : undefined,
            })),
          },
        },
      });

      // Calculate XP gained
      const xpGained = newWorkout.movements.reduce((totalXP, movement) => {
        return totalXP + calculateXP(movement);
      }, 0);

      // Update XP and level
      const { newXP, newLevel } = calculateNewXPAndLevel(user, xpGained);

      // calculate overallStat based on existing bodyPartStats
      const overallStat = calculateOverallStat(user.bodyPartStats);

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel,
          overallStat,
        },
      });

      // For each movement: update/create BodyPartStat and MuscleStat
      for (const movement of newWorkout.movements) {
        // Handle BodyPartStat
        let bodyPartStat = await prisma.bodyPartStat.findFirst({
          where: {
            userId: userId,
            bodyPart: movement.bodyPart,
          },
        });

        if (!bodyPartStat) {
          bodyPartStat = await prisma.bodyPartStat.create({
            data: {
              bodyPart: movement.bodyPart,
              user: { connect: { id: userId } },
              score: 0,
            },
          });
        } else {
          const addedScore = calculateScore(movement);

          await prisma.bodyPartStat.update({
            where: { id: bodyPartStat.id },
            data: {
              score: { increment: addedScore },
              updatedAt: new Date(),
            },
          });
        }

        // Handle MuscleStat
        const existingMuscleStat = await prisma.muscleStat.findFirst({
          where: {
            userId: userId,
            muscle: movement.muscle,
          },
        });

        if (existingMuscleStat) {
          await prisma.muscleStat.update({
            where: { id: existingMuscleStat.id },
            data: {
              max: Math.max(existingMuscleStat.max, movement.max),
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.muscleStat.create({
            data: {
              muscle: movement.muscle,
              bodyPart: movement.bodyPart,
              max: movement.max,
              user: { connect: { id: userId } },
              bodyPartStat: { connect: { id: bodyPartStat.id } },
              exercise: movement.exerciseId
                ? { connect: { id: movement.exerciseId } }
                : undefined,
            },
          });
        }
      }

      return { createdWorkout };
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  },

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
        OR: [{ userId }, { friendId: userId }],
        status: PENDING_STATUS,
      },
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

      // Fetch all users except the current user
      const allUsers = await prisma.user.findMany({
        where: { id: { not: userId, notIn: friendIds } },
      });

      // Calculate recommendation scores for each user
      const recommendations = await Promise.all(
        allUsers.map(async (friend) => {
          const score = await getRecommendationScore(userId, friend.id);
          return { friend, score };
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

  async markWorkoutComplete(workoutId) {
    try {
      const updatedWorkout = await prisma.workout.update({
        where: { id: workoutId },
        data: { isComplete: true, completedAt: new Date() },
      });
      return updatedWorkout;
    } catch (error) {
      console.error("Error marking workout complete:", error);
      throw error;
    }
  },

  async deleteWorkout(workoutId) {
    try {
      // delete all movements first
      await prisma.movement.deleteMany({
        where: { workoutId },
      });

      // delete the workout
      const deletedWorkout = await prisma.workout.delete({
        where: { id: workoutId },
      });

      return deletedWorkout;
    } catch (error) {
      console.error("Error deleting workout:", error);
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

  async findFreeTimes(events, chunkLength) {
    const freeSlots = [];
    const seen = new Set();
    const now = new Date();

    // Group events by day
    const eventsByDay = {};
    for (let event of events) {
      const dateKey = event.start.toISOString().split("T")[0];
      if (!eventsByDay[dateKey]) eventsByDay[dateKey] = [];
      eventsByDay[dateKey].push({
        start: new Date(event.start),
        end: new Date(event.end),
      });
    }

    // today through the next 6 days (7 days total)
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];

      const dailyEvents = (eventsByDay[dateKey] || []).sort(
        (a, b) => a.start - b.start
      );
      let current;
      if (dateKey === now.toISOString().split("T")[0]) {
        current = new Date();
        current.setSeconds(0, 0); // Remove seconds/millis
        current.setMinutes(0); // Remove minutes
      } else {
        current = new Date(`${dateKey}T00:00:00`);
      }
      const endOfDay = new Date(`${dateKey}T23:59:00`);

      for (let event of dailyEvents) {
        while (
          current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE <
          event.start.getTime()
        ) {
          let potentialStart = new Date(current);

          // round potentialStart to nearest 15-min mark if not already
          const startMinutes = potentialStart.getMinutes();
          const startOffset =
            startMinutes % 15 === 0 ? 0 : 15 - (startMinutes % 15);
          if (startOffset > 0) {
            potentialStart.setMinutes(startMinutes + startOffset);
            potentialStart.setSeconds(0, 0);
          }

          // set potentialEnd to original potentialStart + chunkLength
          let potentialEnd = new Date(
            potentialStart.getTime() + chunkLength * MILLISECONDS_PER_MINUTE
          );

          // if end time has minutes, truncate to the last full hour
          if (potentialEnd.getMinutes() !== 0) {
            potentialEnd.setMinutes(0);
            potentialEnd.setSeconds(0, 0);
          }

          const key = potentialStart.toISOString();
          if (!seen.has(key) && potentialStart >= now) {
            freeSlots.push({ start: potentialStart, end: potentialEnd });
            seen.add(key);
          }
          current = potentialEnd;
        }

        if (event.end > current) {
          current = event.end;
        }
      }

      while (
        current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE <=
        endOfDay.getTime()
      ) {
        const potentialStart = new Date(current);
        const potentialEnd = new Date(
          current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE
        );
        const key = potentialStart.toISOString();
        if (!seen.has(key) && potentialStart >= now) {
          freeSlots.push({ start: potentialStart, end: potentialEnd });
          seen.add(key);
        }
        current = potentialEnd;
      }
    }

    return freeSlots;
  },
};
