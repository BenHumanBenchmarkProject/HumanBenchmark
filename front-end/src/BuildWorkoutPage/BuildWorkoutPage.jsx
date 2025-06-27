import "./BuildWorkoutPage.css";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const BuildWorkoutPage = () => {
  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Build Workout</h1>
        </div>
      </div>
    </div>
  );
};

export default BuildWorkoutPage;
