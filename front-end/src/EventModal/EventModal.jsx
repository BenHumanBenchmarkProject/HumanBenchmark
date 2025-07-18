import React, { useState, useContext, useEffect } from "react";
import UserContext from "../userContext";
import axios from "axios";
import { BASE_URL } from "../constants";
import "./EventModal.css";

const EventModal = ({ onClose }) => {
  const { user } = useContext(UserContext);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${BASE_URL}users/${user.id}/friends`);

        setFriends(response.data);
        console.log("Friends:", response.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}users/${user.id}/workouts`
        );
        const incompleteWorkouts = response.data.filter(
          (workout) => !workout.isComplete
        );
        setWorkouts(incompleteWorkouts);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    if (user && user.id) {
      fetchFriends();
      fetchWorkouts();
      fetchSuggestedTimes([user.id]);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const allUserIds = [user.id, ...selectedFriends.map(Number)];
    fetchSuggestedTimes(allUserIds);
  }, [user, selectedFriends, selectedWorkout]);

  const handleCreateEvent = async () => {
    const newEvent = {
      title: eventName,
      start: new Date(`${date}T${startTime}`).toISOString(),
      end: new Date(`${date}T${endTime}`).toISOString(),
      type: "workout",
      createdById: user.id,
      participantIds: [user.id, ...selectedFriends.map(Number)],
      workoutId: Number(selectedWorkout),
    };

    try {
      const response = await axios.post(`${BASE_URL}events`, newEvent);
      console.log("Event created:", response.data);

      onClose();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  const fetchSuggestedTimes = async (userIds) => {
    // Calculate workout length based on selected workout
    let workoutLength = 60; // default to 60 minutes

    if (selectedWorkout) {
      const workout = workouts.find(
        (w) => w.id.toString() === selectedWorkout.toString()
      );

      if (workout && Array.isArray(workout.movements)) {
        workoutLength = workout.movements.length * 15;
      }
    }

    try {
      const response = await axios.post(`${BASE_URL}availability/common`, {
        userIds,
        workoutLength,
      });
      setSuggestedTimes(response.data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  };

  const updateSelectedFriends = (id) => {
    const updated = selectedFriends.includes(id)
      ? selectedFriends.filter((fid) => fid !== id)
      : [...selectedFriends, id];
    setSelectedFriends(updated);
    fetchSuggestedTimes([user.id, ...updated.map(Number)]);
  };

  const formatTimeRange = (start, end) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameDay = startDate.toDateString() === endDate.toDateString();

    const formattedStart = startDate.toLocaleString([], options);
    const formattedEnd = endDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return sameDay
      ? `${formattedStart} - ${formattedEnd}`
      : `${formattedStart} → ${formattedEnd}`;
  };

  return (
    <div className="event-modal">
      <div className="event-modal-content">
        <h2>Create Event</h2>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            step="900" // 15 minute increments
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            step="900" // 15 minute increments
          />
        </label>
        <label>
          Workout:
          <select
            value={selectedWorkout}
            onChange={(event) => setSelectedWorkout(event.target.value)}
          >
            <option value="">Select a workout</option>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.name}
              </option>
            ))}
          </select>
        </label>
        <label>Friends:</label>
        <div className="checkbox-group">
          {friends.map((friend) => (
            <label key={friend.id} className="checkbox-option">
              <input
                type="checkbox"
                value={friend.id}
                checked={selectedFriends.includes(friend.id.toString())}
                onChange={() => updateSelectedFriends(friend.id.toString())}
              />
              {friend.username}
            </label>
          ))}
        </div>

        {selectedFriends.length > 0 && (
          <div className="selected-friends">
            {selectedFriends.map((friendId) => {
              const friend = friends.find(
                (f) => f.id.toString() === friendId.toString()
              );
              return (
                <div
                  key={friendId}
                  className="friend-chip"
                  onClick={() =>
                    setSelectedFriends((prev) =>
                      prev.filter((id) => id !== friendId)
                    )
                  }
                >
                  {friend?.username || "Unknown"}
                </div>
              );
            })}
          </div>
        )}

        {suggestedTimes.length > 0 && (
          <div className="suggested-times">
            <h4>Suggested Times</h4>
            <ul>
              {suggestedTimes.map((slot, index) => (
                <li key={index}>
                  <button
                    className="time-slot"
                    onClick={() => {
                      const start = new Date(slot.start);
                      const end = new Date(slot.end);
                      setDate(start.toISOString().split("T")[0]);
                      setStartTime(start.toTimeString().slice(0, 5));
                      setEndTime(end.toTimeString().slice(0, 5));
                    }}
                  >
                    {formatTimeRange(slot.start, slot.end)}{" "}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={handleCreateEvent}>Create Event</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EventModal;
