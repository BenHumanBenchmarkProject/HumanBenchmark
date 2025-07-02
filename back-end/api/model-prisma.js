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
      });

      // Calculate new XP and level
      const { newXP, newLevel } = calculateNewXPAndLevel(user, xpGained);

      // Update user's XP and level
      console.log(`New XP: ${newXP}, New Level: ${newLevel}`);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel,
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
};
