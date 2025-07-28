import "./LeaderboardPage.css";
import React, { use, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, NavigationButtons, BODY_PARTS } from "../constants";
import UserContext from "../userContext";
import pendingIcon from "../assets/pending-icon.png";

const USERNAME_KEY = "username";
const LEVEL_KEY = "level";
const OVERALL_STAT_KEY = "overallStat";

const LeaderboardPage = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]); // friends wont have an add button
  const [pendingRequests, setPendingRequests] = useState([]); // pending friend requests wont have an add button
  const [sortKey, setSortKey] = useState(OVERALL_STAT_KEY);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetchLeaderboard();
      fetchFriends();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${BASE_URL}leaderboard`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}users/${user.id}/friends`);
      setFriends(response.data.map((friend) => friend.id));

      const pendingResponse = await axios.get(
        `${BASE_URL}users/${user.id}/friendRequests`
      );
      console.log("Pending friend requests:", pendingResponse.data);
      setPendingRequests(pendingResponse.data.map((request) => request.id));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}users/${user.id}/friends/${friendId}`
      );
      console.log("Friend request sent:", response.data);
      setPendingRequests((prev) => [...prev, friendId]); // Update pending requests
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const sortUsers = (key) => {
    key = key.toLowerCase();

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let aValue, bValue;

      if ([USERNAME_KEY, LEVEL_KEY, OVERALL_STAT_KEY].includes(key)) {
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

    setFilteredUsers(sortedUsers);
    setSortKey(key);
  };

  const updateFilteredUsers = () => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      updateFilteredUsers();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Leaderboard</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="leaderboard-search-button"
              onClick={updateFilteredUsers}
            >
              Search
            </button>
            <button className="leaderboard-search-button" onClick={clearSearch}>
              Clear
            </button>
          </div>

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
              {filteredUsers.map((leaderboardUser) => {
                const isFriend = friends.includes(leaderboardUser.id);
                const isPending = pendingRequests.includes(leaderboardUser.id);
                const isCurrentUser = user.id === leaderboardUser.id;

                return (
                  <tr key={leaderboardUser.id}>
                    <td>
                      {leaderboardUser.username}
                      {!isFriend && !isPending && !isCurrentUser && (
                        <button
                          className="leaderboard-friend-request-button"
                          onClick={() => sendFriendRequest(leaderboardUser.id)}
                        >
                          Add
                        </button>
                      )}
                      {isPending && (
                        <span className="pending-icon-container">
                          <img
                            src={pendingIcon}
                            alt="friend request pending icon"
                            width="20px"
                          />
                        </span>
                      )}
                    </td>
                    <td>{leaderboardUser.level}</td>
                    <td>
                      {leaderboardUser.overallStat !== undefined
                        ? leaderboardUser.overallStat.toFixed(2)
                        : "0.00"}
                    </td>
                    {BODY_PARTS.map((bodyPart) => {
                      const stat = leaderboardUser.bodyPartStats.find(
                        (stat) =>
                          stat.bodyPart.toLowerCase() === bodyPart.toLowerCase()
                      );
                      return <td key={bodyPart}>{stat ? stat.score : 0}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
