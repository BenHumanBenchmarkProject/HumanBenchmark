import "./NavigationButtons.css";
import { Link } from "react-router";
const NavigationButtons = () => {
  return (
    <div className="top-buttons">
      <Link to={"/"}>
        <button>HOME</button>
      </Link>
      <Link to={"/leaderboard"}>
        <button>LEADER BOARD</button>
      </Link>
      <Link to={"/build-workout"}>
        <button>BUILD WORKOUT</button>
      </Link>
      <Link to={"/log-workout"}>
        <button>LOG WORKOUT</button>
      </Link>
      <Link to={"/calendar"}>
        <button>CALENDAR</button>
      </Link>
    </div>
  );
};

export default NavigationButtons;
