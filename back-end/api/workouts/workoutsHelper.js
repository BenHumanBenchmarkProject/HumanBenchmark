function calculateXP(movement) {
  // Should take user roughly 3 workouts to level up
  return (movement.reps * movement.sets * movement.weight) / 725;
}

function calculateScore(movement) {
  // new score better reflects the XP
  return (
    movement.reps * movement.sets * movement.weight * 0.0015 +
    movement.max * 0.2
  );
}

function calculateNewXPAndLevel(user, xpGained) {
  let newXP = user.xp + xpGained;
  let newLevel = user.level;
  const xpPerLevel = 100;

  while (newXP >= newLevel * xpPerLevel) {
    newXP -= newLevel * xpPerLevel;
    newLevel += 1;
  }

  return { newXP, newLevel };
}

function calculateOverallStat(bodyPartStats) {
  if (!bodyPartStats || bodyPartStats.length === 0) return 0;
  const totalScore = bodyPartStats.reduce((sum, stat) => sum + stat.score, 0);
  return totalScore / bodyPartStats.length;
}

module.exports = {
  calculateXP,
  calculateScore,
  calculateNewXPAndLevel,
  calculateOverallStat,
};
