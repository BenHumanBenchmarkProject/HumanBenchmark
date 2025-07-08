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
    workouts: {
      create: [
        {
          name: "Morning Routine",
          isComplete: false,
          movements: {
            create: [
              {
                name: "Push-up",
                bodyPart: "upper arms",
                reps: 10,
                sets: 3,
                weight: 0,
                max: 0,
                muscle: "biceps",
              },
            ],
          },
        },
      ],
    },
  },
  {
    username: "bob",
    password: "password456",
    height: 180,
    weight: 75,
    age: 28,
    gender: "male",
    level: 4,
    xp: 380,
    overallStat: 68.2,
    bodyPartStats: {
      create: [
        { bodyPart: "chest", score: 50 },
        { bodyPart: "back", score: 60 },
        { bodyPart: "shoulder", score: 55 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "pectorals", bodyPart: "chest", max: 120 },
        { muscle: "deltoids", bodyPart: "shoulder", max: 95 },
      ],
    },
    workouts: {
      create: [
        {
          name: "Chest Blast",
          isComplete: false,
          movements: {
            create: [
              {
                name: "Bench Press",
                bodyPart: "chest",
                reps: 8,
                sets: 4,
                weight: 135,
                max: 165,
                muscle: "pectorals",
              },
            ],
          },
        },
      ],
    },
  },
  {
    username: "carla",
    password: "password789",
    height: 170,
    weight: 65,
    age: 24,
    gender: "female",
    level: 3,
    xp: 290,
    overallStat: 60.0,
    bodyPartStats: {
      create: [
        { bodyPart: "waist", score: 35 },
        { bodyPart: "cardio", score: 70 },
      ],
    },
    muscleStats: {
      create: [{ muscle: "abs", bodyPart: "waist", max: 85 }],
    },
    workouts: {
      create: [
        {
          name: "Core + Cardio",
          isComplete: false,
          movements: {
            create: [
              {
                name: "Sit-up",
                bodyPart: "waist",
                reps: 15,
                sets: 3,
                weight: 0,
                max: 0,
                muscle: "abs",
              },
              {
                name: "Running",
                bodyPart: "cardio",
                reps: 1,
                sets: 1,
                weight: 0,
                max: 0,
                muscle: "heart",
              },
            ],
          },
        },
      ],
    },
  },
  {
    username: "dave",
    password: "securepass",
    height: 175,
    weight: 80,
    age: 30,
    gender: "male",
    level: 6,
    xp: 520,
    overallStat: 82.9,
    bodyPartStats: {
      create: [
        { bodyPart: "back", score: 65 },
        { bodyPart: "legs", score: 70 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "lats", bodyPart: "back", max: 140 },
        { muscle: "quads", bodyPart: "legs", max: 160 },
      ],
    },
    workouts: {
      create: [
        {
          name: "Back & Legs Day",
          isComplete: false,
          movements: {
            create: [
              {
                name: "Deadlift",
                bodyPart: "back",
                reps: 5,
                sets: 5,
                weight: 185,
                max: 225,
                muscle: "lats",
              },
              {
                name: "Squat",
                bodyPart: "legs",
                reps: 6,
                sets: 4,
                weight: 155,
                max: 200,
                muscle: "quads",
              },
            ],
          },
        },
      ],
    },
  },
  {
    username: "emma",
    password: "mypassword",
    height: 160,
    weight: 55,
    age: 22,
    gender: "female",
    level: 2,
    xp: 150,
    overallStat: 50.3,
    bodyPartStats: {
      create: [
        { bodyPart: "shoulder", score: 40 },
        { bodyPart: "arms", score: 45 },
      ],
    },
    muscleStats: {
      create: [
        { muscle: "deltoids", bodyPart: "shoulder", max: 80 },
        { muscle: "triceps", bodyPart: "arms", max: 75 },
      ],
    },
    workouts: {
      create: [
        {
          name: "Arm Circuit",
          isComplete: false,
          movements: {
            create: [
              {
                name: "Overhead Press",
                bodyPart: "shoulder",
                reps: 10,
                sets: 3,
                weight: 40,
                max: 60,
                muscle: "deltoids",
              },
              {
                name: "Tricep Dips",
                bodyPart: "arms",
                reps: 12,
                sets: 3,
                weight: 0,
                max: 0,
                muscle: "triceps",
              },
            ],
          },
        },
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
    const { bodyPartStats, muscleStats, workouts, ...userFields } = userData;

    // create user
    const user = await prisma.user.create({
      data: userFields,
    });

    // creater bodyPartStats and link to user
    for (const bps of bodyPartStats.create) {
      await prisma.bodyPartStat.create({
        data: {
          ...bps,
          user: { connect: { id: user.id } },
        },
      });
    }

    // create muscleStats and link to user
    for (const ms of muscleStats.create) {
      await prisma.muscleStat.create({
        data: {
          ...ms,
          user: { connect: { id: user.id } },
        },
      });
    }

    // create workouts and related movements and link to user
    for (const workoutData of workouts.create) {
      const { movements, ...workoutFields } = workoutData;

      // create workout and link to user
      const workout = await prisma.workout.create({
        data: {
          ...workoutFields,
          user: { connect: { id: user.id } },
        },
      });

      // create movements and link to workout and user
      for (const movement of movements.create) {
        await prisma.movement.create({
          data: {
            ...movement,
            user: { connect: { id: user.id } },
            workout: { connect: { id: workout.id } },
          },
        });
      }
    }

    console.log(`Seeded user: ${user.username}`);
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
