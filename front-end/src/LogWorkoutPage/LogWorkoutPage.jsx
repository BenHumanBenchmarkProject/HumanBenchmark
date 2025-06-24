import "./LogWorkoutPage.css";
import { Link } from "react-router";

const LogWorkoutPage = () => {
  return (
    <div>
      <h1>Log Workout</h1>
      <Link to={"/"}>
        <button>Home</button>
      </Link>
    </div>
  );
};

export default LogWorkoutPage;
