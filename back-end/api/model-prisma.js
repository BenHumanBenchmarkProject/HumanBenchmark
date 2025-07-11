// import prisma client lib and instantiate
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const ERROR_RELATION_ALREADY_EXISTS = "P2002";
const ACCEPTED_STATUS = "accepted";
const PENDING_STATUS = "pending";

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

function calculateOverallStat(bodyPartStats) {
  if (!bodyPartStats || bodyPartStats.length === 0) return 0;
  const totalScore = bodyPartStats.reduce((sum, stat) => sum + stat.score, 0);
  return totalScore / bodyPartStats.length;
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

  async getMutualFriends(userA, userB) {
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
  },

  async getRecommendedFriends(userId) {
    const friendships = await prisma.friendship.findMany({
      // 1st row of connections
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
    });

    const friendIds = getFriendIds(friendships, userId);

    const secondDegreeFriends = await prisma.friendship.findMany({
      // 2nd row of connections
      where: {
        OR: [{ userId: { in: friendIds } }, { friendId: { in: friendIds } }],
      },
    });

    const secondDegreeFriendIds = secondDegreeFriends
      // get second-degree friend IDs, filter out direct friends and the current user
      .map((friend) => {
        if (!friendIds.includes(friend.userId) && friend.userId !== userId) {
          return friend.userId;
        }
        if (
          !friendIds.includes(friend.friendId) &&
          friend.friendId !== userId
        ) {
          return friend.friendId;
        }
        return null;
      })
      .filter(Boolean); // Remove null values

    // Remove duplicates
    const uniqueSuggestedIds = [...new Set(secondDegreeFriendIds)];

    // fetch user data
    const suggestedUsers = await prisma.user.findMany({
      where: { id: { in: uniqueSuggestedIds } },
    });

    return suggestedUsers;
  },
};
