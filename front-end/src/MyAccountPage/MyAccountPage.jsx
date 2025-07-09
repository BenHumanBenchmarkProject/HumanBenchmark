import "./MyAccountPage.css";
import { NavigationButtons } from "../constants";
import { useContext } from "react";
import UserContext from "../userContext";
import blankProfilePic from "../assets/blank-pfp.jpg";

const GENDER_FEMALE = "F";
const GENDER_MALE = "M";

const MyAccountPage = () => {
  const { user } = useContext(UserContext);

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    // make the user.createdAt date more readable
    // month day, year  (ex. July 8, 2025)
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  const handleDetailsClick = (workout) => {
    console.log("Workout details:", workout);
  };

  return (
    <div>
      <NavigationButtons />
      <div className="account-content">
        <div className="account-top">
          <div className="user-info-left">
            <img src={blankProfilePic} alt="user profile picture" />
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
            <div className="friend-request-list"></div>
          </div>
        </div>

        <div className="completed-workouts-box">
          <div className="completed-workout-header">Completed Workouts</div>
          <div className="completed-workout-list">
            {user.workouts.map((workout, index) => (
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
    </div>
  );
};

export default MyAccountPage;
