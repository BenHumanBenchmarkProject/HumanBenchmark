import "./LeaderboardPage.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [sortKey, setSortKey] = useState("overallStat");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/leaderboard"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortUsers = (key) => {
    const direction = "desc"; // Onlt sort descending 

    const sortedUsers = [...users].sort((a, b) => {
      let aValue, bValue;

      if (key === "username" || key === "level" || key === "overallStat") {
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

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
    setSortKey(key);
    setSortDirection(direction);
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
                  className={sortKey === "username" ? "active-sort" : ""}
                  onClick={() => sortUsers("username")}
                >
                  Username
                </th>
                <th
                  className={sortKey === "level" ? "active-sort" : ""}
                  onClick={() => sortUsers("level")}
                >
                  Level
                </th>
                <th
                  className={sortKey === "overallStat" ? "active-sort" : ""}
                  onClick={() => sortUsers("overallStat")}
                >
                  Overall
                </th>
                {[
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
                ].map((bodyPart) => (
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
                  {[
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
                  ].map((bodyPart) => {
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
