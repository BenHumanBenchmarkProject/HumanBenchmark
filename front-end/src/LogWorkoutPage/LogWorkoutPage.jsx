import "./LogWorkoutPage.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const LogWorkoutPage = () => {
  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Log Workout</h1>
        </div>
      </div>
    </div>
  );
};

export default LogWorkoutPage;
