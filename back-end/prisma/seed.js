const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const usersData = [
  {
    username: "alice",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    workouts: [
      {

        name: "Barbell Squat",
        bodyPart: "Legs",
        reps: 10,
        weight: 50,
        max: 100,
        muscle: "Quads",
      },
    ],
    muscleStats: [
      {
        bodyPart: "Legs",
        muscle: "Quads",
        max: 100,
      },
    ],
    bodyPartStats: [
      {
        bodyPart: "Legs",
        score: 100,
      },
    ],
  },
  {
    username: "bob",
    password: "securepass456",
    height: 180,
    weight: 80,
    age: 28,
    gender: "male",
    workouts: [
      {

        name: "Bench Press",
        bodyPart: "Chest",
        reps: 8,
        weight: 80,
        max: 95,
        muscle: "Pectorals",
      },
    ],
    muscleStats: [
      {
        bodyPart: "Chest",
        muscle: "Pectorals",
        max: 95,
      },
    ],
    bodyPartStats: [
      {
        bodyPart: "Chest",
        score: 90,
      },
    ],
  },
];


async function main() {
  // seed users
  for (const userData of usersData) {
    const { workouts, muscleStats, bodyPartStats, ...user } = userData;
    const createdUser = await prisma.user.create({ data: user });

    // seed workouts for each user
    for (const workout of workouts) {
      await prisma.workout.create({
        data: { ...workout, userId: createdUser.id },
      });
    }

    // seed muscle stats for each user
    for (const muscleStat of muscleStats) {
      await prisma.muscleStat.create({
        data: { ...muscleStat, userId: createdUser.id },
      });
    }

    // seed body part stats for each user
    for (const bodyPartStat of bodyPartStats) {
      await prisma.bodyPartStat.create({
        data: { ...bodyPartStat, userId: createdUser.id },
      });
    }
  }


  console.log("Database seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

module.exports = { usersData };
