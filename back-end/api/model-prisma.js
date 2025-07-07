// import prisma client lib and instantiate
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

calculateXP = (newWorkout) => {
  return newWorkout.reps * newWorkout.weight * 0.1;
};

calculateNewXPAndLevel = (user, xpGained) => {
  let newXP = user.xp + xpGained;
  let newLevel = user.level;
  const xpForNextLevel = newLevel * 100; // Example: 100 XP per level

  while (newXP >= xpForNextLevel) {
    newXP -= xpForNextLevel;
    newLevel += 1;
  }

  return { newXP, newLevel };
};

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
        user: { connect: { id: userId } }, // Correctly connect the user
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

  async createWorkout(userId, exerciseId, newWorkout) {
    try {
      // Create the workout
      const createdWorkout = await prisma.workout.create({
        data: {
          ...newWorkout,
          user: { connect: { id: userId } },
          exercise: { connect: { id: exerciseId } },
        },
      });

      // Calculate XP
      const xpGained = calculateXP(newWorkout);

      // Fetch current user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { bodyPartStats: true },
      });

      // Calculate new XP and level
      const { newXP, newLevel } = calculateNewXPAndLevel(user, xpGained);

      //Calculate overallStat
      overallStat = calculateOverallStat(user.bodyPartStats);

      // Update user's XP and level
      console.log(
        `New XP: ${newXP}, New Level: ${newLevel}, Overall Stat: ${overallStat}`
      );
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel,
          overallStat: overallStat,
        },
      });

      // Create bodyPartStat
      const newBodyPartStat = {
        bodyPart: newWorkout.bodyPart,
        score: newWorkout.max,
        userId: userId,
      };
      await prisma.bodyPartStat.create({ data: newBodyPartStat });

      // Create muscleStat
      const newMuscleStat = {
        muscle: newWorkout.muscle,
        bodyPart: newWorkout.bodyPart,
        max: newWorkout.max,
        user: { connect: { id: userId } },
        exercise: { connect: { id: exerciseId } },
      };
      await prisma.muscleStat.create({ data: newMuscleStat });

      return { createdWorkout, updatedUser };
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  },

  async addfriend(userA, userB) {
    const [userId, friendId] = userA < userB ? [userA, userB] : [userB, userA];

    try {
      friend = await prisma.friendship.create({
        data: { userId, friendId },
      });
      console.log(`Friendship created between ${userId} and ${friendId}`);
      return friend;
    } catch (error) {
      if (error.code === "P2002") {
        console.log(
          `Friendship already exists between ${userId} and ${friendId}`
        );
      } else {
        console.error("Error creating friendship:", error);
      }
    }
  },

  async getFriends(userId) {
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
    });

    const friendIds = friends.map((friend) =>
      friend.userId === userId ? friend.friendId : friend.userId
    );

    return await prisma.user.findMany({
      where: { id: { in: friendIds } },
    });
  },
};
