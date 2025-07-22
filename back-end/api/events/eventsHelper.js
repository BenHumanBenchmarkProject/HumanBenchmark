function scoreByEventFrequency(events, day, hour) {
  return events.filter((event) => {
    const date = new Date(event.start);
    return date.getDay() === day && date.getHours() === hour;
  }).length;
}

function scoreByLeavePatterns(leaves, hour) {
  return -leaves.filter((leave) => new Date(leave).getHours() === hour).length;
}

function scoreByWorkoutHabit(completedWorkouts, day, selected) {
  if (!selected || !selected.movements || !Array.isArray(selected.movements)) {
    console.warn("selectedWorkout is null or has no valid movements.");
    return 0;
  }

  try {
    const targetParts = new Set(
      selected.movements
        .filter((m) => m && m.bodyPart)
        .map((m) => m.bodyPart.toLowerCase())
    );

    let score = 0;
    completedWorkouts.forEach((workout) => {
      const logDay = new Date(workout.createdAt).getDay();
      if (logDay !== day) return;

      if (Array.isArray(workout.movements)) {
        workout.movements.forEach((movement) => {
          if (
            movement &&
            movement.bodyPart &&
            targetParts.has(movement.bodyPart.toLowerCase())
          ) {
            score++;
          }
        });
      }
    });

    return score;
  } catch (err) {
    console.error("Error in scoreByWorkoutHabit:", err);
    return 0;
  }
}

module.exports = {
  scoreByEventFrequency,
  scoreByLeavePatterns,
  scoreByWorkoutHabit,
};
