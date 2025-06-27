import "./Header.css";
import React from "react";
import blankPfp from "../assets/blank-pfp.jpg";
import SignInModal from "../SignInModal/SignInModal";
import SignUpModal from "../SignUpModal/SIgnUpModal";
import {useState} from "react";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleSignInClick = () => {
    setShowSignInModal(true);
    setShowSignUpModal(false); // only one modal can be open at a time
  };

  const handleSignUpClick = () => {
    setShowSignUpModal(true);
    setShowSignInModal(false); // only one modal can be open at a time
  };

  const handleCloseModals = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false);
  };

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
          <button onClick={handleSignInClick}>Log in</button>
          {showSignInModal && <SignInModal onClose={handleCloseModals} />}
          <button onClick={handleSignUpClick}>Sign up</button>
          {showSignUpModal && <SignUpModal onClose={handleCloseModals} />}
        </div>
      )}
    </header>
  );
};

export default Header;
