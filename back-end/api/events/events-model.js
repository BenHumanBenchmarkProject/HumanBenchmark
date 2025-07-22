const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MILLISECONDS_PER_MINUTE = 1000 * 60;

const {
  scoreByEventFrequency,
  scoreByLeavePatterns,
  scoreByWorkoutHabit,
} = require("./eventsHelper");

module.exports = {
  async findFreeTimes(events, chunkLength) {
    const freeSlots = [];
    const seen = new Set();
    const now = new Date();

    // Group events by day
    const eventsByDay = {};
    for (let event of events) {
      const dateKey = event.start.toISOString().split("T")[0];
      if (!eventsByDay[dateKey]) eventsByDay[dateKey] = [];
      eventsByDay[dateKey].push({
        start: new Date(event.start),
        end: new Date(event.end),
      });
    }

    // today through the next 6 days (7 days total)
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];

      const dailyEvents = (eventsByDay[dateKey] || []).sort(
        (a, b) => a.start - b.start
      );
      let current;
      if (dateKey === now.toISOString().split("T")[0]) {
        current = new Date();
        current.setSeconds(0, 0); // Remove seconds/millis
        current.setMinutes(0); // Remove minutes
      } else {
        current = new Date(`${dateKey}T00:00:00`);
      }
      const endOfDay = new Date(`${dateKey}T23:59:00`);

      for (let event of dailyEvents) {
        while (
          current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE <
          event.start.getTime()
        ) {
          let potentialStart = new Date(current);

          // round potentialStart to nearest 15-min mark if not already
          const startMinutes = potentialStart.getMinutes();
          const startOffset =
            startMinutes % 15 === 0 ? 0 : 15 - (startMinutes % 15);
          if (startOffset > 0) {
            potentialStart.setMinutes(startMinutes + startOffset);
            potentialStart.setSeconds(0, 0);
          }

          // set potentialEnd to original potentialStart + chunkLength
          let potentialEnd = new Date(
            potentialStart.getTime() + chunkLength * MILLISECONDS_PER_MINUTE
          );

          // round potentialEnd to the next 15-minute mark
          const endMinutes = potentialEnd.getMinutes();
          const remainder = endMinutes % 15;
          if (remainder !== 0) {
            potentialEnd.setMinutes(endMinutes + (15 - remainder));
            potentialEnd.setSeconds(0, 0);
          }

          // make sure potentialEnd is still after potentialStart
          if (potentialEnd <= potentialStart) {
            console.warn("Skipping invalid time range", {
              potentialStart,
              potentialEnd,
            });
            break; // or skip
          }

          const key = potentialStart.toISOString();
          if (!seen.has(key) && potentialStart >= now) {
            freeSlots.push({ start: potentialStart, end: potentialEnd });
            seen.add(key);
          }
          current = potentialEnd;
        }

        if (event.end > current) {
          current = event.end;
        }
      }

      while (
        current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE <=
        endOfDay.getTime()
      ) {
        const potentialStart = new Date(current);
        const potentialEnd = new Date(
          current.getTime() + chunkLength * MILLISECONDS_PER_MINUTE
        );
        const key = potentialStart.toISOString();
        if (!seen.has(key) && potentialStart >= now) {
          freeSlots.push({ start: potentialStart, end: potentialEnd });
          seen.add(key);
        }
        current = potentialEnd;
      }
    }

    return freeSlots;
  },

  async rankSuggestedTimes(times, events, leaves, logs, selectedWorkout) {
    return times
      .map((slot) => {
        const start = new Date(slot.start);
        const day = start.getDay();
        const hour = start.getHours();

        const score =
          scoreByEventFrequency(events, day, hour) +
          scoreByLeavePatterns(leaves, hour) +
          scoreByWorkoutHabit(logs, day, selectedWorkout);

        return { ...slot, score };
      })
      .sort((a, b) => b.score - a.score);
  },

  async createLeaveEvent(userId, eventId, leftAt = new Date()) {
    try {
      const leave = await prisma.eventLeave.create({
        data: {
          userId,
          eventId,
          leftAt,
        },
      });
      return leave;
    } catch (err) {
      console.error("Failed to create leave event object:", err);
      throw err;
    }
  },
};
