import React, { useState, useContext, useEffect } from "react";
import UserContext from "../userContext";
import axios from "axios";
import { BASE_URL } from "../constants";
import "./EventModal.css";

const EventModal = ({ onClose, onCreate }) => {
  const { user } = useContext(UserContext);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}users/${user.id}/friends`
        );

        setFriends(response.data);
        console.log("Friends:", response.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    if (user && user.id) {
      fetchFriends();
    }
  }, [user]);

  const handleCreateEvent = () => {
    const newEvent = {
      name: eventName,
      start: new Date(`${date}T${startTime}`),
      end: new Date(`${date}T${endTime}`),
      workout: selectedWorkout,
      friends: selectedFriends,
    };
    onCreate(newEvent);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Event</h2>
        <label>
          Event Name:
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label>
          Workout:
          <select
            value={selectedWorkout}
            onChange={(e) => setSelectedWorkout(e.target.value)}
          >
            <option value="">Select a workout</option>
            {user.workouts
              .filter((workout) => !workout.isComplete)
              .map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Friends:
          <select
            multiple
            value={selectedFriends}
            onChange={(e) =>
              setSelectedFriends(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.username}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleCreateEvent}>Create Event</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EventModal;
