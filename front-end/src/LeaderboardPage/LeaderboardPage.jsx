import "./LeaderboardPage.css";
import { Link } from "react-router";
import SignUpModal from "../SignUpModal/SignUpModal";

const LeaderboardPage = () => {
  return (
    <div>
      <h1>Leaderboard</h1>
      <Link to={"/"}>
        <button>Home</button>
      </Link>

      <SignUpModal/>
    </div>
  );
};

export default LeaderboardPage;
