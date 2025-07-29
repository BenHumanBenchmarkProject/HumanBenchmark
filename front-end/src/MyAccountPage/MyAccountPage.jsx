import "./MyAccountPage.css";
import {
  NavigationButtons,
  BASE_URL,
  GENDER_FEMALE,
  GENDER_MALE,
} from "../constants";
import { useContext, useState, useEffect } from "react";
import UserContext from "../userContext";
import axios from "axios";
import WorkoutModal from "../WorkoutModal/WorkoutModal";
import UserModal from "../UserModal/UserModal";
import boyPFP from "../assets/blue-pfp.jpg";
import girlPFP from "../assets/pink-pfp.jpeg";

const MyAccountPage = () => {
  const { user } = useContext(UserContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  const fetchCompleteWorkouts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}users/${user.id}/workouts`);
      const completeWorkouts = response.data.filter(
        (workout) => workout.isComplete
      );
      setWorkouts(completeWorkouts);
      return completeWorkouts;
    } catch (err) {
      console.log(err);
    }
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    // make the user.createdAt date more readable
    // month day, year  (ex. July 8, 2025)
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}users/${user.id}/friendRequests`
      );
      setFriendRequests(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchFriendRequests();
      fetchCompleteWorkouts();
    }
  }, [user]);

  const formattedHeight = () => {
    let feet = Math.floor(user.height / 12);
    let inches = user.height % 12;

    return `${feet}'${inches}"`;
  };

  const formattedGender = () => {
    if (user.gender === GENDER_MALE) {
      return "Male";
    }
    if (user.gender === GENDER_FEMALE) {
      return "Female";
    }
  };

  const handleAccept = async (friendId) => {
    try {
      await axios.post(
        `${BASE_URL}users/${user.id}/friends/${friendId}/accept`
      );
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDecline = async (friendId) => {
    try {
      await axios.delete(
        `${BASE_URL}users/${user.id}/friends/${friendId}/delete`
      );
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDetailsClick = (workout) => {
    setSelectedWorkout(workout);
  };

  const closeModal = () => {
    setSelectedWorkout(null);
  };
  return (
    <div>
      <NavigationButtons />
      <div className="account-content">
        <div className="account-top">
          <div className="user-info-left">
            <img
              src={user.gender === GENDER_MALE ? boyPFP : girlPFP}
              alt="user profile picture"
            />
            <h2>{user.username}</h2>
            <p>{`User since: ${formattedDate}`}</p>
          </div>

          <div className="user-info-center">
            <div className="user-stat-box">
              <h2>Height</h2>
              <p>{formattedHeight()}</p>
            </div>

            <div className="user-stat-box">
              <h2>Weight</h2>
              <p>{`${user.weight}lbs`}</p>
            </div>

            <div className="user-stat-box">
              <h2>Age</h2>
              <p>{`${user.age}yr`}</p>
            </div>

            <div className="user-stat-box">
              <h2>Gender</h2>
              <p>{formattedGender()}</p>
            </div>
          </div>

          <div className="friend-request-box">
            <div className="friend-request-header">Friend Requests</div>
            <div className="friend-request-list">
              {friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="friend-request-item"
                  onClick={() => handleUserClick(request)}
                >
                  <span>{request.username}</span>

                  <div className="friend-request-buttons">
                    <button
                      className="friend-request-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAccept(request.id);
                      }}
                    >
                      ✓
                    </button>
                    <button
                      className="friend-request-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDecline(request.id);
                      }}
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="completed-workouts-box">
          <div className="completed-workout-header">Completed Workouts</div>
          <div className="completed-workout-list">
            {workouts.map((workout, index) => (
              <div key={index} className="completed-workout-item">
                <span>{workout.name}</span>
                <button
                  className="details-button"
                  onClick={() => handleDetailsClick(workout)}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedWorkout && (
        <WorkoutModal workout={selectedWorkout} onClose={closeModal} />
      )}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={closeUserModal} />
      )}
    </div>
  );
};

export default MyAccountPage;
