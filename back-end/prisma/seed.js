const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const usersData = [
  {
    username: "alice",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    bodyPartStats: {
      create: [
        { bodyPart: "upper arms", score: 40 },
        { bodyPart: "lower arms", score: 30 },
        { bodyPart: "upper legs", score: 50 },
        { bodyPart: "lower legs", score: 45 },
        { bodyPart: "neck", score: 20 },
        { bodyPart: "back", score: 35 },
        { bodyPart: "shoulder", score: 25 },
        { bodyPart: "chest", score: 30 },
        { bodyPart: "waist", score: 40 },
        { bodyPart: "cardio", score: 50 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "biceps", bodyPart: "upper arms", max: 100 },
        { muscle: "triceps", bodyPart: "upper arms", max: 90 },
      ],
    },
  },
  {
    username: "bob",
    password: "securepass456",
    height: 180,
    weight: 80,
    age: 28,
    gender: "male",
    level: 3,
    xp: 250,
    overallStat: 65.0,
    bodyPartStats: {
      create: [
        { bodyPart: "upper arms", score: 35 },
        { bodyPart: "lower arms", score: 40 },
        { bodyPart: "upper legs", score: 45 },
        { bodyPart: "lower legs", score: 30 },
        { bodyPart: "neck", score: 25 },
        { bodyPart: "back", score: 20 },
        { bodyPart: "shoulder", score: 30 },
        { bodyPart: "chest", score: 35 },
        { bodyPart: "waist", score: 25 },
        { bodyPart: "cardio", score: 40 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "quadriceps", bodyPart: "upper legs", max: 120 },
        { muscle: "hamstrings", bodyPart: "upper legs", max: 110 },
      ],
    },
  },
  {
    username: "charlie",
    password: "mypassword789",
    height: 175,
    weight: 75,
    age: 32,
    gender: "male",
    level: 4,
    xp: 350,
    overallStat: 70.0,
    bodyPartStats: {
      create: [
        { bodyPart: "upper arms", score: 30 },
        { bodyPart: "lower arms", score: 35 },
        { bodyPart: "upper legs", score: 40 },
        { bodyPart: "lower legs", score: 50 },
        { bodyPart: "neck", score: 30 },
        { bodyPart: "back", score: 25 },
        { bodyPart: "shoulder", score: 40 },
        { bodyPart: "chest", score: 20 },
        { bodyPart: "waist", score: 30 },
        { bodyPart: "cardio", score: 35 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "deltoids", bodyPart: "shoulder", max: 95 },
        { muscle: "pectorals", bodyPart: "chest", max: 85 },
      ],
    },
  },
  {
    username: "diana",
    password: "pass1234",
    height: 160,
    weight: 55,
    age: 29,
    gender: "female",
    level: 2,
    xp: 150,
    overallStat: 60.0,
    bodyPartStats: {
      create: [
        { bodyPart: "upper arms", score: 25 },
        { bodyPart: "lower arms", score: 20 },
        { bodyPart: "upper legs", score: 35 },
        { bodyPart: "lower legs", score: 40 },
        { bodyPart: "neck", score: 35 },
        { bodyPart: "back", score: 30 },
        { bodyPart: "shoulder", score: 20 },
        { bodyPart: "chest", score: 25 },
        { bodyPart: "waist", score: 20 },
        { bodyPart: "cardio", score: 30 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "glutes", bodyPart: "lower legs", max: 105 },
        { muscle: "calves", bodyPart: "lower legs", max: 95 },
      ],
    },
  },
];
async function fetchAndSeedExercises() {
  const options = {
    method: "GET",
    url: "https://exercisedb.p.rapidapi.com/exercises",
    params: { limit: "0", offset: "0" },
    headers: {
      "x-rapidapi-key": process.env.VITE_RAPIDAPI_KEY,
      "x-rapidapi-host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const transformedData = response.data.map((exercise) => ({
      name: exercise.name,
      bodyParts: [exercise.bodyPart],
      targetMuscle: exercise.target,
      overview: exercise.description,
      exerciseTips: exercise.instructions.join(" "),
      createdAt: new Date(),
    }));

    for (const exercise of transformedData) {
      await prisma.exercise.create({ data: exercise });
    }

    console.log("Exercises seeded successfully!");
  } catch (error) {
    console.error("Error fetching and seeding exercises:", error);
  }
}

async function main() {
  await fetchAndSeedExercises();

  // Seed users
  for (const userData of usersData) {
    const { bodyPartStats, ...user } = userData;
    await prisma.user.create({
      data: {
        ...user,
        bodyPartStats,
      },
    });
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
