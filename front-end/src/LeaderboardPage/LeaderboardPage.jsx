import "./LeaderboardPage.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const LeaderboardPage = () => {
  return (
    <div>
      <div className="container">
        <div className="main-content">
          <NavigationButtons />
          <h1>Leaderboard</h1>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
