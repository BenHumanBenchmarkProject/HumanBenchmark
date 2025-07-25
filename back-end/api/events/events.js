const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const events = express.Router();

const {
  findFreeTimes,
  rankSuggestedTimes,
  createLeaveEvent,
} = require("./events-model");

events.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// [Post] /api/events
events.post("/api/events", async (req, res) => {
  // create new Calendar Event
  const {
    title,
    description,
    start,
    end,
    type,
    createdById,
    participantIds,
    workoutId,
  } = req.body;
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        type,
        createdBy: { connect: { id: createdById } },
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
        workout: workoutId ? { connect: { id: workoutId } } : undefined,
      },
    });

    res.json(event);
  } catch (err) {
    console.log(err);
  }
});

//[Put] /api/events/:id
events.put("/api/events/:id", async (req, res) => {
  //edit event
  const { title, start, end, description, type, participantIds } = req.body;
  const id = Number(req.params.id);

  try {
    const updated = await prisma.calendarEvent.update({
      where: { id: id },
      data: {
        title,
        description,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        type,
        participants: participantIds
          ? { set: participantIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
});

//[Delete] /api/events/:id
events.delete("/api/events/:id", async (req, res) => {
  //Delete event
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.calendarEvent.delete({
      where: { id: id },
    });

    res.json({ message: "Deleted", deleted });
  } catch (err) {
    console.log(err);
  }
});

//[Get] /api/events/:userId
events.get("/api/events/:userId", async (req, res) => {
  // get User Calendar Events
  const userId = Number(req.params.userId);

  try {
    const events = await prisma.calendarEvent.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: { id: true, username: true },
        },
        createdBy: {
          select: { id: true, username: true },
        },
        workout: {
          include: {
            movements: true,
          },
        },
      },
    });

    res.json(events);
  } catch (err) {
    console.log(err);
  }
});

//[Post] /api/availability/common
events.post("/api/availability/common", async (req, res) => {
  const { userIds, workoutLength, selectedWorkout } = req.body;

  try {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        createdEvents: true,
        joinedEvents: true,
        eventLeaves: true,
        workouts: {
          where: { isComplete: true },
          include: { movements: true },
        },
      },
    });

    const allEvents = users.flatMap((user) => [
      ...user.createdEvents,
      ...user.joinedEvents,
    ]);
    const allLeaves = users.flatMap((user) =>
      user.eventLeaves.map((leave) => leave.leftAt)
    );
    const allWorkouts = users.flatMap((user) => user.workouts);

    const freeTimes = await findFreeTimes(allEvents, workoutLength);

    const ranked = await rankSuggestedTimes(
      freeTimes,
      allEvents,
      allLeaves,
      allWorkouts,
      selectedWorkout
    );

    res.json({ times: ranked });
  } catch (err) {
    console.log(err);
  }
});

// [DELETE] /api/events/:eventId/leave/:userId
events.delete("/api/events/:eventId/leave/:userId", async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    await prisma.calendarEvent.update({
      where: { id: Number(eventId) },
      data: {
        participants: {
          disconnect: { id: Number(userId) },
        },
      },
    });

    await createLeaveEvent(Number(userId), Number(eventId));

    res.json({ message: "User left the event" });
  } catch (err) {
    console.error("Error leaving event:", err);
    res.status(500).json({ error: "Failed to leave event" });
  }
});

// [GET] /api/user/:userId/eventLeaves
events.get("/api/user/:userId/eventLeaves", async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const eventLeaves = await prisma.eventLeave.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            start: true,
            end: true,
          },
        },
      },
    });

    res.json(eventLeaves);
  } catch (err) {
    console.error("Error fetching event leaves:", err);
    res.status(500).json({ error: "Failed to fetch event leaves" });
  }
});

module.exports = events;
