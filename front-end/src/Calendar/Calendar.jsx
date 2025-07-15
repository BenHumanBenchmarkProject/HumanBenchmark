import "./Calendar.css";

import React, { useState, useEffect } from "react";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function toLocalDate(date) {
  const d = new Date(date);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
}

function getGridPosition(startTime, endTime, dayIndex) {
  const top = startTime.getHours() - 6;
  const height = endTime.getHours() - startTime.getHours();
  return { top, height, left: dayIndex };
}

const Calendar = ({ events = [] }) => {
  const [week, setWeek] = useState(getCurrentWeek());

  return (
    <div className="calendar">
      <div className="cell header empty"></div>
      {week.map((date, i) => (
        <div key={i} className="cell header">
          {DAYS[i]}
          <br />
          {date.toLocaleDateString()}
        </div>
      ))}

      {HOURS.map((hour, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <div className="cell time-label">{`${hour}:00`}</div>
          {week.map((_, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="cell slot" />
          ))}
        </React.Fragment>
      ))}

      {events.map((event, i) => {
        const start = toLocalDate(event.start);
        const end = toLocalDate(event.end);
        const day = start.getDay();
        const { top, height, left } = getGridPosition(start, end, day);

        return (
          <div
            key={i}
            className="event-block"
            style={{
              gridColumn: left + 2,
              gridRowStart: top + 2,
              gridRowEnd: top + 2 + height,
            }}
          >
            {event.title}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
