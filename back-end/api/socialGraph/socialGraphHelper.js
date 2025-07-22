const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MAX_AGE_DIFFERENCE = 20;
const MUTUAL_FRIENDS_WEIGHT = 0.4;
const WORKOUT_FREQUENCY_WEIGHT = 0.225;
const AGE_DIFFERENCE_WEIGHT = 0.15;
const GEO_DISTANCE_WEIGHT = 0.225;
const ACCEPTED_STATUS = "ACCEPTED";

function getFriendIds(friends, userId) {
  return friends.map((friend) =>
    friend.userId === userId ? friend.friendId : friend.userId
  );
}

function getAgeDifference(user, friend) {
  dif = Math.abs(user.age - friend.age);
  return 1 - Math.min(dif / MAX_AGE_DIFFERENCE, 1); // 20 is the max age difference
}

function getWorkoutFrequency(user, friend) {
  let userVector = getMuscleVector(user);
  let friendVector = getMuscleVector(friend);

  return getCosineSimilarity(userVector, friendVector);
}

function getMuscleVector(user) {
  const muscleVector = {};

  if (!user.workouts || user.workouts.length === 0) return muscleVector;

  // Iterate through each workout
  user.workouts.forEach((workout) => {
    // Iterate through each movement in the workout
    workout.movements.forEach((movement) => {
      const muscle = movement.muscle;
      // Increment the count for the muscle in the vector
      if (muscle) {
        muscleVector[muscle] = (muscleVector[muscle] || 0) + 1;
      }
    });
  });

  return muscleVector;
}

function getCosineSimilarity(userVector, friendVector) {
  const allMuscles = new Set([
    ...Object.keys(userVector),
    ...Object.keys(friendVector),
  ]);

  // dot product and magnitudes
  let dotProduct = 0;
  let userMagnitude = 0;
  let friendMagnitude = 0;

  allMuscles.forEach((muscle) => {
    const userValue = userVector[muscle] || 0;
    const friendValue = friendVector[muscle] || 0;

    dotProduct += userValue * friendValue;
    userMagnitude += userValue * userValue;
    friendMagnitude += friendValue * friendValue;
  });

  // calculate magnitudes
  userMagnitude = Math.sqrt(userMagnitude);
  friendMagnitude = Math.sqrt(friendMagnitude);

  if (userMagnitude === 0 || friendMagnitude === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / (userMagnitude * friendMagnitude); //cosine similarity
}

function getGeoDistanceScore(user, friend) {
  let userLat = user.latitude;
  let userLong = user.longitude;
  let friendLat = friend.latitude;
  let friendLong = friend.longitude;

  if (
    userLat == null ||
    userLong == null ||
    friendLat == null ||
    friendLong == null
  ) {
    return 0;
  }

  // Calculate the distance between the two points in kilometers
  let latitudeDistance = ((userLat - friendLat) * Math.PI) / 180.0;
  let longitudeDistance = ((userLong - friendLong) * Math.PI) / 180.0;

  // Convert to radians
  userLat = (userLat * Math.PI) / 180.0;
  friendLat = (friendLat * Math.PI) / 180.0;

  // Calculate the Haversine formula
  let a =
    Math.pow(Math.sin(latitudeDistance / 2.0), 2) +
    Math.pow(Math.sin(longitudeDistance / 2.0), 2) *
      Math.cos(userLat) *
      Math.cos(friendLat);

  let earthRadius = 6371.0; // km
  let c = 2.0 * Math.asin(Math.sqrt(a));

  return earthRadius * c; // Distance in kilometers
}

async function getDynamicWeights(user, userFriends) {
  if (userFriends.length === 0) {
    return {
      mutual: MUTUAL_FRIENDS_WEIGHT,
      age: AGE_DIFFERENCE_WEIGHT,
      geo: GEO_DISTANCE_WEIGHT,
      workout: WORKOUT_FREQUENCY_WEIGHT,
    };
  }

  let totalAgeSimilarity = 0;
  let totalGeoSimilarity = 0;
  let totalWorkoutSimilarity = 0;

  for (const friend of userFriends) {
    totalAgeSimilarity += getAgeDifference(user, friend);
    totalGeoSimilarity += getGeoDistanceScore(user, friend);
    totalWorkoutSimilarity += getWorkoutFrequency(user, friend);
  }

  const total =
    totalAgeSimilarity + totalGeoSimilarity + totalWorkoutSimilarity || 1;

  const scale = 0.6; // remaining 60% after mutual
  return {
    mutual: MUTUAL_FRIENDS_WEIGHT,
    age: (totalAgeSimilarity / total) * scale,
    geo: (totalGeoSimilarity / total) * scale,
    workout: (totalWorkoutSimilarity / total) * scale,
  };
}

async function getRecommendationScore(user, friend, weights) {
  const ageScore = getAgeDifference(user, friend);
  const workoutScore = getWorkoutFrequency(user, friend);
  const geoScore = getGeoDistanceScore(user, friend);
  const mutualScore = await getMutualFriendScore(user.id, friend.id);

  let score = 0;
  score += weights.mutual * mutualScore;
  score += weights.age * ageScore;
  score += weights.workout * workoutScore;
  score += weights.geo * geoScore;

  return score;
}

async function getMutualFriendScore(userId, possibleFriendId, maxDepth = 5) {
  // max depth of 5 to save on potential memory usage
  const visited = new Set();
  const queue = [{ id: userId, depth: 0 }]; // BFS queue, depth starts at 0
  // use map for O(1) lookup
  const friendMap = new Map(); // key: userId, value: Set<friendId>

  // build map of only "accepted friends"
  const allFriendships = await prisma.friendship.findMany({
    where: { status: ACCEPTED_STATUS },
  });

  // populate map with bidirectional edges for friendships
  for (const { userId, friendId } of allFriendships) {
    if (!friendMap.has(userId)) friendMap.set(userId, new Set());
    if (!friendMap.has(friendId)) friendMap.set(friendId, new Set());
    friendMap.get(userId).add(friendId);
    friendMap.get(friendId).add(userId);
  }

  let score = 0;

  while (queue.length > 0) {
    const { id: currentId, depth } = queue.shift();

    //stop if reach max depth or already visited
    if (depth > maxDepth || visited.has(currentId)) continue;
    visited.add(currentId);

    const friends = friendMap.get(currentId);
    if (!friends) continue;

    for (const friendId of friends) {
      if (friendId === possibleFriendId) {
        const weight = 1 / (depth + 1); // add score inversley proportional to depth (+depth = -score)
        score += weight;
      }

      if (!visited.has(friendId)) {
        // add to queue if not visited
        queue.push({ id: friendId, depth: depth + 1 });
      }
    }
  }

  return score;
}

module.exports = {
  getFriendIds,
  getAgeDifference,
  getWorkoutFrequency,
  getMuscleVector,
  getCosineSimilarity,
  getGeoDistanceScore,
  getDynamicWeights,
  getRecommendationScore,
  getMutualFriendScore,
};
