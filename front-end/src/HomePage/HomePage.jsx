import "./HomePage.css";
import React, { useContext, useEffect, useState } from "react";
import bodyOutline from "../assets/body-outline.jpg";
import axios from "axios";
import { BASE_URL } from "../constants";
import UserContext from "../userContext";

import { NavigationButtons } from "../constants";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [friends, setFriends] = useState([]);

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

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${BASE_URL}users/${user.id}/friends`);
      setFriends(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIncompleteWorkouts();
    fetchFriends();
  }, []);

  return (
    <>
      <div className="container">
        <NavigationButtons className="navButtons" />

        <div className="central-content">
          <div className="home-workouts-box">
            <div className="home-workouts-header">Your Workouts</div>
            {workouts.map((workout, index) => (
              <div key={index} className="home-workout-item">
                <span>{workout.name}</span>{" "}
              </div>
            ))}
          </div>

          <div className="calendar">
            <h1>Calendar Placeholder</h1>
          </div>

          <div className="home-friends-box">
            <div className="home-friends-header">Your Friends</div>
            {friends.map((friend, index) => (
              <div key={index} className="home-friend-item">
                <span>{friend.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
