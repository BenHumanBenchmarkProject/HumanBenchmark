const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const users = [
  {
    username: "alice",
    password: "password123",
    pfp: "https://example.com/alice.jpg",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    stats: [
      {
        workoutName: "Barbell Squat",
        max: 100,
        lastCompleted: [new Date("2025-06-20"), new Date("2025-06-22")],
        previousMax: [90, 95],
      },
      {
        workoutName: "Bench Press",
        max: 80,
        lastCompleted: [new Date("2025-06-18")],
        previousMax: [70, 75],
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
    stats: [
      {
        workoutName: "Barbell Squat",
        max: 120,
        lastCompleted: [new Date("2025-06-19")],
        previousMax: [110],
      },
      {
        workoutName: "Bench Press",
        max: 95,
        lastCompleted: [new Date("2025-06-23")],
        previousMax: [85, 90],
      },
    ],
  },
];

const workouts = [
  {
    name: "Barbell Squat",
    type: "Strength",
    muscle: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions:
      "Place the bar on your shoulders and squat down keeping your back straight.",
  },
  {
    name: "Bench Press",
    type: "Strength",
    muscle: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions:
      "Lie on a bench and press the barbell upward from your chest.",
  },
];

async function main() {
  // Seed users without stats
  for (const user of users) {
    const { stats, ...userData } = user; // Exclude stats for now
    await prisma.user.create({ data: userData });
  }

  // Seed workouts
  for (const workout of workouts) {
    await prisma.workout.create({ data: workout });
  }

  // Seed stats
  for (const user of users) {
    const createdUser = await prisma.user.findUnique({
      where: { username: user.username },
    });

    for (const stat of user.stats) {
      const workout = await prisma.workout.findUnique({
        where: { name: stat.workoutName },
      });

      await prisma.stat.create({
        data: {
          userId: createdUser.id,
          movementId: workout.id,
          max: stat.max,
          lastCompleted: stat.lastCompleted,
          previousMax: stat.previousMax,
        },
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

module.exports = { users, workouts };
