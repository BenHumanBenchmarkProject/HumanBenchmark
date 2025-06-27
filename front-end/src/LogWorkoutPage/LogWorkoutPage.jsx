
import "./LogWorkoutPage.css";
import { Link } from "react-router";
import SignInModal from "../SignInModal/SignInModal";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const LogWorkoutPage = () => {
  return (
    <div>
      <h1>Log Workout</h1>
      <NavigationButtons/>
      <SignInModal />
    </div>
  );
};

export default LogWorkoutPage;
