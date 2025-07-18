const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const events = express.Router();

const { findFreeTimes, rankSuggestedTimes } = require("./events-model");

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

//[Get] /api/availability/:userId
events.get("/api/availability/:userId", async (req, res) => {
  // get User Calendar Events
  const userId = Number(req.params.userId);
  try {
    const availability = await prisma.availability.findMany({
      where: { userId },
    });

    res.json(availability);
  } catch (err) {}
});

//[Post] /api/availability
events.post("/api/availability", async (req, res) => {
  // create new availability block
  const { userId, dayOfWeek, startTime, endTime } = req.body;

  try {
    const created = await prisma.availability.create({
      data: { userId, dayOfWeek, startTime, endTime },
    });

    res.json(created);
  } catch (err) {
    console.log(err);
  }
});

//[Put] /api/availability/:id
events.put("/api/availability/:id", async (req, res) => {
  // edit availability block
  const id = Number(req.params.id);
  const { startTime, endTime } = req.body;
  try {
    const updated = await prisma.availability.update({
      where: { id: id },
      data: { startTime, endTime },
    });

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
});

//[Delete] /api/availability/:id
events.delete("/api/availability/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.availability.delete({
      where: { id: id },
    });

    res.json({ message: "Availability deleted", deleted });
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

module.exports = events;
