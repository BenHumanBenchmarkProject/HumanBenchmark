import "./HomePage.css";
import React, { useContext, useEffect, useState } from "react";
import bodyOutline from "../assets/body-outline.jpg";
import axios from "axios";
import { BASE_URL } from "../constants";
import UserContext from "../userContext";
import WorkoutModal from "../WorkoutModal/WorkoutModal";
import pendingIcon from "../assets/pending-icon.png";

import { NavigationButtons } from "../constants";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);

  const fetchIncompleteWorkouts = async () => {
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
      fetchFriends(); // get new friends list after sending request
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    fetchIncompleteWorkouts();
    fetchFriends();
    fetchRecommendedFriends();
  }, []);

  const handleWorkoutClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
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
              </div>
            ))}
          </div>

          <div className="calendar">
            <h1>Calendar Placeholder</h1>
          </div>

          <div className="home-friends-box">
            <div className="home-friends-header">Your Friends</div>
            <div className="friends-list">
              {friends.map((friend, index) => (
                <div key={index} className="home-friend-item">
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
                const isCurrentUser = user.id === recommendedFriend.id;

                return (
                  <div key={recommendedFriend.id} className="home-friend-item">
                    <span>{recommendedFriend.username}</span>
                    {!isFriend && !isPending && !isCurrentUser && (
                      <button
                        className="home-friend-request-button"
                        onClick={() => sendFriendRequest(recommendedFriend.id)}
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
    </>
  );
};

export default HomePage;
