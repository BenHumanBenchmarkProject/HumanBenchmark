// import prisma client lib and instantiate
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

  async createWorkout(userId, exerciseId, newWorkout) {
    try {
      const createdWorkout = await prisma.workout.create({
        data: {
          ...newWorkout,
          user: { connect: { id: userId } },
          exercise: { connect: { id: exerciseId } },
        },
      });
      return createdWorkout;
    } catch (error) {
      console.error("Error creating workout:", error);
      throw error;
    }
  },
};
