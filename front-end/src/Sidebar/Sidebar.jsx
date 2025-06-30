import "./Sidebar.css";
import React from "react";

import { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // make sure the animation only runs on page load
    if (!hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const neededXP = () => {
    return user ? user.level * 100 : 0; // default to 0 if nobody logged in
  };

  const xpPercentage = () => {
    if (!user) return 0;
    return (user.xp / neededXP()) * 100;
  };

  const calculateOverallStrength = () => {
    if (!user || !user.muscleStats || user.muscleStats.length === 0) return 0;
    const totalMax = user.muscleStats.reduce((sum, stat) => sum + stat.max, 0);
    const averageMax = totalMax / user.muscleStats.length;
    return (averageMax / 100) * 100; // scale relative to 100
  };

  return (
    <aside className="sidebar">
      <div className="level">
        <h2>{`Level ${user ? user.level : 0}`}</h2>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ "--final-width": `${xpPercentage()}%` }}
          ></div>
        </div>
        <div className="xp-labels">
          <span>{`${user ? user.xp : 0}xp`}</span>
          <span>{`${neededXP()}xp`}</span>
        </div>
      </div>

      <div className="stats">
        <h3>STATS</h3>
        <div className="stat">
          <span>Strength</span>
          <div className="bar">
            <div
              style={{ "--final-width": `${calculateOverallStrength()}%` }}
            ></div>
          </div>
          {calculateOverallStrength()}
        </div>
        <div className="stat">
          <span>Knowledge</span>
          <div className="bar">
            <div style={{ "--final-width": "30%" }}></div>
          </div>
          30
        </div>
        <div className="stat">
          <span>Overall</span>
          <div className="bar">
            <div style={{ "--final-width": "40%" }}></div>
          </div>
          40
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
