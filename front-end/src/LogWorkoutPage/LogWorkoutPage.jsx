
import "./LogWorkoutPage.css";
import { Link } from "react-router";
import SignInModal from "../SignInModal/SignInModal";

const LogWorkoutPage = () => {
  return (
    <div>
      <h1>Log Workout</h1>
      <Link to={"/"}>
        <button>Home</button>
      </Link>
      <SignInModal />
    </div>
  );
};

export default LogWorkoutPage;
