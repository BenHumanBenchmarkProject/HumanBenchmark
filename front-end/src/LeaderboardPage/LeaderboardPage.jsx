import "./LeaderboardPage.css";
import { Link } from "react-router";

const LeaderboardPage = () => {
  return (
    <div>
      <h1>Leaderboard</h1>
      <Link to={"/"}>
        <button>Home</button>
      </Link>
    </div>
  );
};

export default LeaderboardPage;
