const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
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
};
