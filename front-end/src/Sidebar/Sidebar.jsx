import "./Sidebar.css";
import React, { use } from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import { BASE_URL } from "../constants";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [overallStat, setOverallStat] = useState(0);

  const fetchOverallStat = async () => {
    if (user) {
      try {
        const response = await axios.get(`${BASE_URL}users/${user.id}`);
        setOverallStat(response.data.overallStat);
      } catch (error) {
        console.error("Error fetching overall stat:", error);
      }
    }
  };

  useEffect(() => {
    fetchOverallStat();
  }, [user]);

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
          <span>Overall</span>
          <div className="bar">
            <div
              style={{
                "--final-width": `${user && overallStat ? overallStat : 0}%`,
              }}
            ></div>
          </div>
          {user && user.overallStat !== undefined
            ? overallStat.toFixed(2)
            : "0.00"}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
