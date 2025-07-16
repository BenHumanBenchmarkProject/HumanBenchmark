import "./EventDetailModal.css";

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  const startTime = new Date(event.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(event.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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

        <p className="creator-info">
          Created by: {event.createdBy?.username || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default EventDetailsModal;
