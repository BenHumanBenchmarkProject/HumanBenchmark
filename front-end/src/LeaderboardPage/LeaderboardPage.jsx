import "./LeaderboardPage.css";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const USERNAME_KEY = "username";
const LEVEL_KEY = "level";
const OVERALL_STAT_KEY = "overallStat";
const BODY_PARTS = [
  "upper arms",
  "lower arms",
  "upper legs",
  "lower legs",
  "neck",
  "back",
  "shoulder",
  "chest",
  "waist",
  "cardio",
];
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [sortKey, setSortKey] = useState(OVERALL_STAT_KEY);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${BASE_URL}leaderboard`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const sortUsers = (key) => {
    const sortedUsers = [...users].sort((a, b) => {
      let aValue, bValue;

      if (key === USERNAME_KEY || key === LEVEL_KEY || key === OVERALL_STAT_KEY) {
        aValue = a[key];
        bValue = b[key];
      } else {
        const aStat = a.bodyPartStats.find(
          (stat) => stat.bodyPart.toLowerCase() === key
        );
        const bStat = b.bodyPartStats.find(
          (stat) => stat.bodyPart.toLowerCase() === key
        );
        aValue = aStat ? aStat.score : 0;
        bValue = bStat ? bStat.score : 0;
      }

      return bValue - aValue; // simplified sort by score
    });

    setUsers(sortedUsers);
    setSortKey(key);
  };

  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Leaderboard</h1>
          <table>
            <thead>
              <tr>
                <th
                  className={sortKey === USERNAME_KEY ? "active-sort" : ""}
                  onClick={() => sortUsers(USERNAME_KEY)}
                >
                  Username
                </th>
                <th
                  className={sortKey === LEVEL_KEY ? "active-sort" : ""}
                  onClick={() => sortUsers(LEVEL_KEY)}
                >
                  Level
                </th>
                <th
                  className={sortKey === OVERALL_STAT_KEY ? "active-sort" : ""}
                  onClick={() => sortUsers(OVERALL_STAT_KEY)}
                >
                  Overall
                </th>
                {BODY_PARTS.map((bodyPart) => (
                  <th
                    key={bodyPart}
                    className={sortKey === bodyPart ? "active-sort" : ""}
                    onClick={() => sortUsers(bodyPart)}
                  >
                    {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.level}</td>
                  <td>
                    {user.overallStat !== undefined
                      ? user.overallStat.toFixed(2)
                      : "0.00"}
                  </td>
                  {BODY_PARTS.map((bodyPart) => {
                    const stat = user.bodyPartStats.find(
                      (stat) => stat.bodyPart.toLowerCase() === bodyPart
                    );
                    return <td key={bodyPart}>{stat ? stat.score : 0}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
