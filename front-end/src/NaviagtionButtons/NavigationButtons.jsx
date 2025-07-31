import "./NavigationButtons.css";
import { Link } from "react-router";
import homeIcon from "../assets/home.png";
import leaderboardIcon from "../assets/leaderboard.png";
import buildWorkoutIcon from "../assets/build.png";
import logWorkoutIcon from "../assets/log.png";
import calendarIcon from "../assets/calendar.png";
const NavigationButtons = () => {
  return (
    <>
      <ul className="nav-list">
        <Link to={"/"}>
          <li>
            <span className="icon">
              <img src={homeIcon} alt="Home" />
            </span>
            <span className="title">Home</span>
          </li>
        </Link>

        <Link to={"/leaderboard"}>
          <li>
            <span className="icon">
              <img src={leaderboardIcon} alt="Leaderboard" />
            </span>
            <span className="title">Leaderboard</span>
          </li>
        </Link>

        <Link to={"/build-workout"}>
          <li>
            <span className="icon">
              <img src={buildWorkoutIcon} alt="Build Workout" />
            </span>
            <span className="title">Build Workout</span>
          </li>
        </Link>

        <Link to={"/log-workout"}>
          <li>
            <span className="icon">
              <img src={logWorkoutIcon} alt="Log Workout" />
            </span>
            <span className="title">Log Workout</span>
          </li>
        </Link>

        <Link to={"/calendar"}>
          <li>
            <span className="icon">
              <img src={calendarIcon} alt="Calendar" />
            </span>
            <span className="title">Calendar</span>
          </li>
        </Link>
      </ul>
    </>
  );
};

export default NavigationButtons;
