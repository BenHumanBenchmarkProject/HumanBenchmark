import "./HomePage.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import UserContext from "../userContext";
import WorkoutModal from "../WorkoutModal/WorkoutModal";
import UserModal from "../UserModal/UserModal";
import pendingIcon from "../assets/pending-icon.png";

import { NavigationButtons } from "../constants";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [bodyPartStats, setBodyPartStats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  const fetchIncompleteWorkouts = async () => {
    if (!user?.id) return; // error handle no user
    try {
      const response = await axios.get(`${BASE_URL}users/${user.id}/workouts`);
      const incompleteWorkouts = response.data.filter(
        (workout) => !workout.isComplete
      );
      setWorkouts(incompleteWorkouts);
      return incompleteWorkouts;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecommendedFriends = async () => {
    if (!user?.id) return; // error handle no user

    try {
      const response = await axios.get(
        `${BASE_URL}users/${user.id}/recommendedFriends`
      );
      setRecommendedFriends(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFriends = async () => {
    if (!user?.id) return; // error handle no user

    try {
      const response = await axios.get(`${BASE_URL}users/${user.id}/friends`);
      setFriends(response.data);

      const pendingResponse = await axios.get(
        `${BASE_URL}users/${user.id}/friendRequests`
      );
      setPendingRequests(pendingResponse.data.map((request) => request.id));
    } catch (err) {
      console.log(err);
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

  const fetchBodyPartStats = async () => {
    if (!user?.id) return; // error handle no user

    try {
      const response = await axios.get(
        `${BASE_URL}users/${user.id}/bodyPartStats`
      );
      setBodyPartStats(response.data);
      setUser((prevUser) => ({ ...prevUser, bodyPartStats: response.data })); // Update context
    } catch (err) {
      console.error("Error fetching body part stats:", err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchIncompleteWorkouts();
      fetchFriends();
      fetchRecommendedFriends();
      fetchBodyPartStats();
    }
  }, [user]);

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
  };

  const markWorkoutComplete = async (workoutId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.patch(
        `${BASE_URL}workouts/${workoutId}/complete`,
        {
          isComplete: true,
        }
      );
      const { updatedUser } = response.data;

      // update the user new overall stat
      if (updatedUser) {
        setUser((prevUser) => ({
          ...prevUser,
          overallStat: updatedUser.overallStat,
          bodyPartStats: updatedUser.bodyPartStats,
        }));
      }

      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteWorkout = async (workoutId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`${BASE_URL}workouts/${workoutId}`);
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout.id !== workoutId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <NavigationButtons className="navButtons" />

        <div className="central-content">
          <div className="home-workouts-box">
            <div className="home-workouts-header">Your Workouts</div>

            {workouts.map((workout, index) => (
              <div
                key={index}
                className="home-workout-item"
                onClick={() => handleWorkoutClick(workout)}
              >
                <span>{workout.name}</span>
                <div className="home-workout-buttons">
                  <button
                    className="home-workout-button"
                    onClick={(event) => markWorkoutComplete(workout.id, event)}
                  >
                    ✓
                  </button>
                  <button
                    className="home-workout-button"
                    onClick={(event) => deleteWorkout(workout.id, event)}
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-container">
            {user ? (
              <>
                <h2>{`${user.username}'s stats`}</h2>
                <div className="user-stats">
                  {bodyPartStats && bodyPartStats.length > 0 ? (
                    bodyPartStats.map((stat, index) => (
                      <div key={index} className="user-single-stat">
                        <span>
                          <strong>{stat.bodyPart}</strong>
                        </span>
                        <span>{stat.score}</span>
                      </div>
                    ))
                  ) : (
                    <div>No stats available</div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-user-stats">
                <h2>Log in to see your stats</h2>
              </div>
            )}
          </div>

          <div className="home-friends-box">
            <div className="home-friends-header">Your Friends</div>
            <div className="friends-list">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="home-friend-item"
                  onClick={() => handleUserClick(friend)}
                >
                  <span>{friend.username}</span>
                </div>
              ))}
            </div>
            <div className="recommended-friends-header">
              Recommended Friends
            </div>
            <div className="recommended-friends-list">
              {recommendedFriends.map((recommendedFriend) => {
                const isFriend = friends.includes(recommendedFriend.id);
                const isPending = pendingRequests.includes(
                  recommendedFriend.id
                );
                const isCurrentUser = user?.id === recommendedFriend.id;

                return (
                  <div
                    key={recommendedFriend.id}
                    className="home-friend-item"
                    onClick={() => handleUserClick(recommendedFriend)}
                  >
                    <span>{recommendedFriend.username}</span>
                    {!isFriend && !isPending && !isCurrentUser && (
                      <button
                        className="home-friend-request-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          sendFriendRequest(recommendedFriend.id);
                        }}
                      >
                        Add
                      </button>
                    )}
                    {isPending && (
                      <span className="pending-icon-container">
                        <img
                          src={pendingIcon}
                          alt="friend request pending icon"
                          className="pending-icon"
                        />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedWorkout && (
            <WorkoutModal workout={selectedWorkout} onClose={closeModal} />
          )}
        </div>
      </div>
      {selectedUser && (
        <UserModal user={selectedUser} onClose={closeUserModal} />
      )}
    </>
  );
};

export default HomePage;
