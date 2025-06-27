import "./LeaderboardPage.css";
import { Link } from "react-router";
import SignUpModal from "../SignUpModal/SignUpModal";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const LeaderboardPage = () => {
  return (
    <div>
      <h1>Leaderboard</h1>
      <NavigationButtons/>

      <SignUpModal/>
    </div>
  );
};

export default LeaderboardPage;
