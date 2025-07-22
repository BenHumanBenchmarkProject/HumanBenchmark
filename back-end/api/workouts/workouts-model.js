const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const {
  calculateXP,
  calculateNewXPAndLevel,
  calculateScore,
  calculateOverallStat,
} = require("./workoutsHelper");

module.exports = {
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
};
