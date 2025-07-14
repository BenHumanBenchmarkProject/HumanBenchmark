const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const usersData = [
  {
    username: "user1",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 40.7128,
    longitude: -74.006,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 44,
        },
        {
          bodyPart: "lower arms",
          score: 49,
        },
        {
          bodyPart: "upper legs",
          score: 51,
        },
        {
          bodyPart: "lower legs",
          score: 38,
        },
        {
          bodyPart: "neck",
          score: 22,
        },
        {
          bodyPart: "back",
          score: 43,
        },
        {
          bodyPart: "shoulder",
          score: 30,
        },
        {
          bodyPart: "chest",
          score: 26,
        },
        {
          bodyPart: "waist",
          score: 21,
        },
        {
          bodyPart: "cardio",
          score: 28,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user2",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 34.0522,
    longitude: -118.2437,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 46,
        },
        {
          bodyPart: "lower arms",
          score: 44,
        },
        {
          bodyPart: "upper legs",
          score: 22,
        },
        {
          bodyPart: "lower legs",
          score: 24,
        },
        {
          bodyPart: "neck",
          score: 45,
        },
        {
          bodyPart: "back",
          score: 32,
        },
        {
          bodyPart: "shoulder",
          score: 37,
        },
        {
          bodyPart: "chest",
          score: 21,
        },
        {
          bodyPart: "waist",
          score: 27,
        },
        {
          bodyPart: "cardio",
          score: 26,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user3",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 41.8781,
    longitude: -87.6298,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 37,
        },
        {
          bodyPart: "lower arms",
          score: 25,
        },
        {
          bodyPart: "upper legs",
          score: 53,
        },
        {
          bodyPart: "lower legs",
          score: 35,
        },
        {
          bodyPart: "neck",
          score: 20,
        },
        {
          bodyPart: "back",
          score: 24,
        },
        {
          bodyPart: "shoulder",
          score: 22,
        },
        {
          bodyPart: "chest",
          score: 49,
        },
        {
          bodyPart: "waist",
          score: 21,
        },
        {
          bodyPart: "cardio",
          score: 32,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user4",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 29.7604,
    longitude: -95.3698,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 48,
        },
        {
          bodyPart: "lower arms",
          score: 41,
        },
        {
          bodyPart: "upper legs",
          score: 32,
        },
        {
          bodyPart: "lower legs",
          score: 33,
        },
        {
          bodyPart: "neck",
          score: 21,
        },
        {
          bodyPart: "back",
          score: 50,
        },
        {
          bodyPart: "shoulder",
          score: 23,
        },
        {
          bodyPart: "chest",
          score: 24,
        },
        {
          bodyPart: "waist",
          score: 59,
        },
        {
          bodyPart: "cardio",
          score: 52,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user5",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 33.4484,
    longitude: -112.074,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 23,
        },
        {
          bodyPart: "lower arms",
          score: 42,
        },
        {
          bodyPart: "upper legs",
          score: 33,
        },
        {
          bodyPart: "lower legs",
          score: 45,
        },
        {
          bodyPart: "neck",
          score: 51,
        },
        {
          bodyPart: "back",
          score: 48,
        },
        {
          bodyPart: "shoulder",
          score: 38,
        },
        {
          bodyPart: "chest",
          score: 22,
        },
        {
          bodyPart: "waist",
          score: 34,
        },
        {
          bodyPart: "cardio",
          score: 27,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user6",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 39.7392,
    longitude: -104.9903,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 23,
        },
        {
          bodyPart: "lower arms",
          score: 38,
        },
        {
          bodyPart: "upper legs",
          score: 50,
        },
        {
          bodyPart: "lower legs",
          score: 47,
        },
        {
          bodyPart: "neck",
          score: 59,
        },
        {
          bodyPart: "back",
          score: 33,
        },
        {
          bodyPart: "shoulder",
          score: 51,
        },
        {
          bodyPart: "chest",
          score: 40,
        },
        {
          bodyPart: "waist",
          score: 32,
        },
        {
          bodyPart: "cardio",
          score: 21,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user7",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 47.6062,
    longitude: -122.3321,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 26,
        },
        {
          bodyPart: "lower arms",
          score: 36,
        },
        {
          bodyPart: "upper legs",
          score: 27,
        },
        {
          bodyPart: "lower legs",
          score: 45,
        },
        {
          bodyPart: "neck",
          score: 20,
        },
        {
          bodyPart: "back",
          score: 51,
        },
        {
          bodyPart: "shoulder",
          score: 42,
        },
        {
          bodyPart: "chest",
          score: 25,
        },
        {
          bodyPart: "waist",
          score: 32,
        },
        {
          bodyPart: "cardio",
          score: 58,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user8",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 25.7617,
    longitude: -80.1918,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 46,
        },
        {
          bodyPart: "lower arms",
          score: 31,
        },
        {
          bodyPart: "upper legs",
          score: 44,
        },
        {
          bodyPart: "lower legs",
          score: 27,
        },
        {
          bodyPart: "neck",
          score: 28,
        },
        {
          bodyPart: "back",
          score: 42,
        },
        {
          bodyPart: "shoulder",
          score: 41,
        },
        {
          bodyPart: "chest",
          score: 51,
        },
        {
          bodyPart: "waist",
          score: 35,
        },
        {
          bodyPart: "cardio",
          score: 45,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user9",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 42.3601,
    longitude: -71.0589,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 57,
        },
        {
          bodyPart: "lower arms",
          score: 24,
        },
        {
          bodyPart: "upper legs",
          score: 32,
        },
        {
          bodyPart: "lower legs",
          score: 54,
        },
        {
          bodyPart: "neck",
          score: 20,
        },
        {
          bodyPart: "back",
          score: 50,
        },
        {
          bodyPart: "shoulder",
          score: 45,
        },
        {
          bodyPart: "chest",
          score: 58,
        },
        {
          bodyPart: "waist",
          score: 31,
        },
        {
          bodyPart: "cardio",
          score: 36,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user10",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 33.749,
    longitude: -84.388,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 44,
        },
        {
          bodyPart: "lower arms",
          score: 52,
        },
        {
          bodyPart: "upper legs",
          score: 53,
        },
        {
          bodyPart: "lower legs",
          score: 20,
        },
        {
          bodyPart: "neck",
          score: 34,
        },
        {
          bodyPart: "back",
          score: 35,
        },
        {
          bodyPart: "shoulder",
          score: 47,
        },
        {
          bodyPart: "chest",
          score: 59,
        },
        {
          bodyPart: "waist",
          score: 57,
        },
        {
          bodyPart: "cardio",
          score: 24,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user11",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 37.7749,
    longitude: -122.4194,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 36,
        },
        {
          bodyPart: "lower arms",
          score: 29,
        },
        {
          bodyPart: "upper legs",
          score: 30,
        },
        {
          bodyPart: "lower legs",
          score: 31,
        },
        {
          bodyPart: "neck",
          score: 24,
        },
        {
          bodyPart: "back",
          score: 52,
        },
        {
          bodyPart: "shoulder",
          score: 45,
        },
        {
          bodyPart: "chest",
          score: 51,
        },
        {
          bodyPart: "waist",
          score: 54,
        },
        {
          bodyPart: "cardio",
          score: 55,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user12",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 45.5051,
    longitude: -122.675,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 33,
        },
        {
          bodyPart: "lower arms",
          score: 46,
        },
        {
          bodyPart: "upper legs",
          score: 57,
        },
        {
          bodyPart: "lower legs",
          score: 42,
        },
        {
          bodyPart: "neck",
          score: 41,
        },
        {
          bodyPart: "back",
          score: 39,
        },
        {
          bodyPart: "shoulder",
          score: 32,
        },
        {
          bodyPart: "chest",
          score: 40,
        },
        {
          bodyPart: "waist",
          score: 25,
        },
        {
          bodyPart: "cardio",
          score: 20,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user13",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 32.7767,
    longitude: -96.797,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 22,
        },
        {
          bodyPart: "lower arms",
          score: 31,
        },
        {
          bodyPart: "upper legs",
          score: 33,
        },
        {
          bodyPart: "lower legs",
          score: 30,
        },
        {
          bodyPart: "neck",
          score: 29,
        },
        {
          bodyPart: "back",
          score: 26,
        },
        {
          bodyPart: "shoulder",
          score: 47,
        },
        {
          bodyPart: "chest",
          score: 25,
        },
        {
          bodyPart: "waist",
          score: 51,
        },
        {
          bodyPart: "cardio",
          score: 38,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user14",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 30.2672,
    longitude: -97.7431,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 39,
        },
        {
          bodyPart: "lower arms",
          score: 43,
        },
        {
          bodyPart: "upper legs",
          score: 28,
        },
        {
          bodyPart: "lower legs",
          score: 33,
        },
        {
          bodyPart: "neck",
          score: 29,
        },
        {
          bodyPart: "back",
          score: 40,
        },
        {
          bodyPart: "shoulder",
          score: 31,
        },
        {
          bodyPart: "chest",
          score: 45,
        },
        {
          bodyPart: "waist",
          score: 57,
        },
        {
          bodyPart: "cardio",
          score: 32,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user15",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 32.7157,
    longitude: -117.1611,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 37,
        },
        {
          bodyPart: "lower arms",
          score: 43,
        },
        {
          bodyPart: "upper legs",
          score: 52,
        },
        {
          bodyPart: "lower legs",
          score: 30,
        },
        {
          bodyPart: "neck",
          score: 40,
        },
        {
          bodyPart: "back",
          score: 53,
        },
        {
          bodyPart: "shoulder",
          score: 28,
        },
        {
          bodyPart: "chest",
          score: 34,
        },
        {
          bodyPart: "waist",
          score: 24,
        },
        {
          bodyPart: "cardio",
          score: 59,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user16",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 39.9526,
    longitude: -75.1652,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 34,
        },
        {
          bodyPart: "lower arms",
          score: 48,
        },
        {
          bodyPart: "upper legs",
          score: 44,
        },
        {
          bodyPart: "lower legs",
          score: 36,
        },
        {
          bodyPart: "neck",
          score: 32,
        },
        {
          bodyPart: "back",
          score: 58,
        },
        {
          bodyPart: "shoulder",
          score: 46,
        },
        {
          bodyPart: "chest",
          score: 37,
        },
        {
          bodyPart: "waist",
          score: 25,
        },
        {
          bodyPart: "cardio",
          score: 35,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user17",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 44.9778,
    longitude: -93.265,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 34,
        },
        {
          bodyPart: "lower arms",
          score: 28,
        },
        {
          bodyPart: "upper legs",
          score: 42,
        },
        {
          bodyPart: "lower legs",
          score: 48,
        },
        {
          bodyPart: "neck",
          score: 36,
        },
        {
          bodyPart: "back",
          score: 33,
        },
        {
          bodyPart: "shoulder",
          score: 21,
        },
        {
          bodyPart: "chest",
          score: 52,
        },
        {
          bodyPart: "waist",
          score: 32,
        },
        {
          bodyPart: "cardio",
          score: 20,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user18",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 36.1699,
    longitude: -115.1398,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 57,
        },
        {
          bodyPart: "lower arms",
          score: 26,
        },
        {
          bodyPart: "upper legs",
          score: 53,
        },
        {
          bodyPart: "lower legs",
          score: 31,
        },
        {
          bodyPart: "neck",
          score: 55,
        },
        {
          bodyPart: "back",
          score: 36,
        },
        {
          bodyPart: "shoulder",
          score: 32,
        },
        {
          bodyPart: "chest",
          score: 29,
        },
        {
          bodyPart: "waist",
          score: 38,
        },
        {
          bodyPart: "cardio",
          score: 52,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user19",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 28.5383,
    longitude: -81.3792,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 55,
        },
        {
          bodyPart: "lower arms",
          score: 49,
        },
        {
          bodyPart: "upper legs",
          score: 24,
        },
        {
          bodyPart: "lower legs",
          score: 59,
        },
        {
          bodyPart: "neck",
          score: 35,
        },
        {
          bodyPart: "back",
          score: 40,
        },
        {
          bodyPart: "shoulder",
          score: 39,
        },
        {
          bodyPart: "chest",
          score: 27,
        },
        {
          bodyPart: "waist",
          score: 53,
        },
        {
          bodyPart: "cardio",
          score: 31,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
    username: "user20",
    password: "password123",
    height: 165,
    weight: 60,
    age: 25,
    gender: "female",
    level: 5,
    xp: 450,
    overallStat: 75.5,
    latitude: 35.2271,
    longitude: -80.8431,
    bodyPartStats: {
      create: [
        {
          bodyPart: "upper arms",
          score: 26,
        },
        {
          bodyPart: "lower arms",
          score: 58,
        },
        {
          bodyPart: "upper legs",
          score: 47,
        },
        {
          bodyPart: "lower legs",
          score: 40,
        },
        {
          bodyPart: "neck",
          score: 28,
        },
        {
          bodyPart: "back",
          score: 38,
        },
        {
          bodyPart: "shoulder",
          score: 44,
        },
        {
          bodyPart: "chest",
          score: 53,
        },
        {
          bodyPart: "waist",
          score: 46,
        },
        {
          bodyPart: "cardio",
          score: 59,
        },
      ],
    },
    muscleStats: {
      create: [
        {
          muscle: "biceps",
          bodyPart: "upper arms",
          max: 100,
        },
        {
          muscle: "triceps",
          bodyPart: "upper arms",
          max: 90,
        },
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
];

module.exports = usersData;

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
    for (const bodyPartStat of bodyPartStats.create) {
      await prisma.bodyPartStat.create({
        data: {
          ...bodyPartStat,
          user: { connect: { id: user.id } },
        },
      });
    }

    // create muscleStats and link to user
    for (const muscleStat of muscleStats.create) {
      await prisma.muscleStat.create({
        data: {
          ...muscleStat,
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
