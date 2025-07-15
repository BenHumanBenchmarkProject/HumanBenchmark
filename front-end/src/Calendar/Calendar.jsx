import "./Calendar.css";
import React, { useState } from "react";

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

const Calendar = () => {
  const [week, setWeek] = useState(getCurrentWeek());

  return (
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
    </div>
  );
};

export default Calendar;
