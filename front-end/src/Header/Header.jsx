import "./Header.css";
import React from "react";
import blankPfp from "../assets/blank-pfp.jpg";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <header className="banner">
      <div className="logo">HUMAN BENCHMARK (LOGO)</div>
      {isLoggedIn ? (
        <button onClick={() => setIsLoggedIn(false)}>
          <div className="account">
            <h3>Account</h3>
            <img src={blankPfp} alt="profile picture" width="40px" />
          </div>
        </button>
      ) : (
        <div className="account">
          <button>Log in</button>
          <button>Sign up</button>
        </div>
      )}
    </header>
  );
};

export default Header;
