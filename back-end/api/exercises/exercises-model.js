const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  async findExercises() {
    const exercises = await prisma.exercise.findMany();
    console.log(`Number of exercises in database: ${exercises.length}`);
    return exercises;
  },
};
