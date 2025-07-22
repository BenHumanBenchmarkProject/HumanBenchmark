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
};
