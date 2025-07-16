import "./Calendar.css";
import { useContext, useState, useEffect } from "react";
import { NavigationButtons, BASE_URL } from "../constants";
import UserContext from "../userContext";
import axios from "axios";
import EventModal from "../EventModal/EventModal";

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0 to 23
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CELL_HEIGHT = 52; // 52px per hour
const CELL_HEADER_HEIGHT = 62;
const CELL_WIDTH = 92; // 92px per day

function getCurrentWeek() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

const Calendar = () => {
  const { user } = useContext(UserContext);
  const [week, setWeek] = useState(getCurrentWeek());
  const [events, setEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}events/${user.id}`);
      setEvents(response.data);
      console.log("Fetched user events:", response.data);
    } catch (err) {
      console.error("Error fetching user events:", err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserEvents();
    }
  }, [user]);

  const handleCreateEvent = (newEvent) => {
    console.log("New Event Created:", newEvent);
  };

  const getGridPosition = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();

    const pixelsPerMinute = CELL_HEIGHT / 60; // each cell is 52px high

    const top =
      startHour * CELL_HEIGHT +
      CELL_HEADER_HEIGHT +
      startMinutes * pixelsPerMinute; // 62 is the height of the header row
    const height =
      (endHour * 60 + endMinutes - (startHour * 60 + startMinutes)) *
      pixelsPerMinute;
    const dayIndex = start.getDay();
    console.log(`dayIndex: ${dayIndex}, top: ${top}, height: ${height}`);

    return { dayIndex, top, height };
  };

  return (
    <>
      <NavigationButtons />
      <button onClick={() => setIsEventModalOpen(true)}>Create Event</button>

      <div className="home-calendar">
        <div className="cell-header-empty"></div>
        {week.map((date, i) => (
          <div key={i} className="cell-header">
            {DAYS[i]}
            <br />
            {date.toLocaleDateString()}
          </div>
        ))}

        {HOURS.map((hour, rowIndex) => (
          <div key={rowIndex} className="time-row">
            <div className="cell-time-label">{`${hour}:00`}</div>
            {week.map((_, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="cell slot" />
            ))}
          </div>
        ))}

        {week.map((date, colIndex) => (
          <div
            key={`layer-${colIndex}`}
            className="event-layer"
            style={{
              position: "absolute",
              top: 0,
              left: `${(colIndex + 1) * CELL_WIDTH}px`, // +1 to account for time column
              width: `${CELL_WIDTH}px`,
              height: "100%",
            }}
          >
            {(() => {
              const dayEvents = events
                .filter(
                  (event) =>
                    new Date(event.start).toDateString() === date.toDateString()
                )
                .sort((a, b) => new Date(a.start) - new Date(b.start));

              const positioned = [];

              dayEvents.forEach((ev) => {
                const { top, height } = getGridPosition(ev);
                const width = CELL_WIDTH - 4; // 4px margin
                const left = 2; // 2px margin

                positioned.push(
                  <div
                    key={ev.id}
                    className="event-block"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      width: `${width}px`,
                      left: `${left}px`,
                      position: "absolute",
                      backgroundColor: "lightblue",
                      border: "1px solid blue",
                      boxSizing: "border-box",
                      padding: "2px",
                      borderRadius: "4px",
                      zIndex: 2,
                    }}
                  >
                    {ev.title}
                  </div>
                );
              });

              return positioned;
            })()}
          </div>
        ))}
      </div>

      {isEventModalOpen && (
        <EventModal
          onClose={() => setIsEventModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </>
  );
};

export default Calendar;
