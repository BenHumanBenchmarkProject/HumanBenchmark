const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

const usersData = [
  {
    "username": "user1",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user2",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user3",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user4",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user5",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user6",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user7",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user8",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user9",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user10",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user11",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user12",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user13",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user14",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user15",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user16",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user17",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user18",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user19",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  },
  {
    "username": "user20",
    "password": "password123",
    "height": 165,
    "weight": 60,
    "age": 25,
    "gender": "female",
    "level": 5,
    "xp": 450,
    "overallStat": 75.5,
    "bodyPartStats": {
      "create": [
        {
          "bodyPart": "upper arms",
          "score": 40
        },
        {
          "bodyPart": "lower arms",
          "score": 30
        },
        {
          "bodyPart": "upper legs",
          "score": 50
        },
        {
          "bodyPart": "lower legs",
          "score": 45
        },
        {
          "bodyPart": "neck",
          "score": 20
        },
        {
          "bodyPart": "back",
          "score": 35
        },
        {
          "bodyPart": "shoulder",
          "score": 25
        },
        {
          "bodyPart": "chest",
          "score": 30
        },
        {
          "bodyPart": "waist",
          "score": 40
        },
        {
          "bodyPart": "cardio",
          "score": 50
        }
      ]
    },
    "muscleStats": {
      "create": [
        {
          "muscle": "biceps",
          "bodyPart": "upper arms",
          "max": 100
        },
        {
          "muscle": "triceps",
          "bodyPart": "upper arms",
          "max": 90
        }
      ]
    },
    "workouts": {
      "create": [
        {
          "name": "Morning Routine",
          "isComplete": false,
          "movements": {
            "create": [
              {
                "name": "Push-up",
                "bodyPart": "upper arms",
                "reps": 10,
                "sets": 3,
                "weight": 0,
                "max": 0,
                "muscle": "biceps"
              }
            ]
          }
        }
      ]
    }
  }
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
