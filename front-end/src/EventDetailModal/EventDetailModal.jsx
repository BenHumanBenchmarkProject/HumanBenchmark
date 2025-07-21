import "./EventDetailModal.css";
import { useContext } from "react";
import UserContext from "../userContext";
import axios from "axios";
import { BASE_URL } from "../constants";

const EventDetailsModal = ({ event, onClose }) => {
  const { user } = useContext(UserContext);
  if (!event) return null;

  const startTime = new Date(event.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(event.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLeaveEvent = async () => {
    try {
      await axios.delete(`${BASE_URL}events/${event.id}/leave/${user.id}`);
      console.log("Successfully left event");
      onClose();
    } catch (err) {
      console.error("Failed to leave event:", err);
    }
  };

  return (
    <div className="event-details-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="event-title">{event.title}</h2>

        <div className="section-box">
          <div className="section-header">
            Workout: {event.workout?.name || "None"}
          </div>
          <div className="section-body scrollable">
            {event.workout?.movements?.map((movement, index) => (
              <div className="pill" key={index}>
                {movement.name} — {movement.sets}x{movement.reps} @{" "}
                {movement.weight} lbs
              </div>
            ))}
          </div>
        </div>

        <p className="time-info">
          <strong>Start:</strong> {startTime}
        </p>
        <p className="time-info">
          <strong>End:</strong> {endTime}
        </p>

        <div className="section-box">
          <div className="section-header">Participants</div>
          <div className="section-body scrollable">
            {event.participants?.map((participant) => (
              <div className="pill" key={participant.id}>
                {participant.username}
              </div>
            ))}
          </div>
        </div>

        <button className="leave-button" onClick={handleLeaveEvent}>
          Leave Event
        </button>

        <p className="creator-info">
          Created by: {event.createdBy?.username || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default EventDetailsModal;
