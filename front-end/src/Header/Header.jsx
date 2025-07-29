import "./Header.css";
import React, { useContext, useState } from "react";
import SignInModal from "../SignInModal/SignInModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import UserContext from "../userContext.jsx";
import AccountModal from "../AccountModal/AccountModal.jsx";
import boyPFP from "../assets/blue-pfp.jpg";
import girlPFP from "../assets/pink-pfp.jpeg";
import { GENDER_MALE } from "../constants.js";

const SIGN_IN_MODAL = "SIGN_IN_MODAL";
const SIGN_UP_MODAL = "SIGN_UP_MODAL";
const ACCOUNT_MODAL = "ACCOUNT_MODAL";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [activeModal, setActiveModal] = useState(null);
  const { user } = useContext(UserContext);

  const handleSignInClick = () => {
    setActiveModal(SIGN_IN_MODAL);
  };

  const handleSignUpClick = () => {
    setActiveModal(SIGN_UP_MODAL);
  };

  const handleCloseModals = () => {
    setActiveModal(null);
  };

  const handleCursorEnter = () => {
    setActiveModal(ACCOUNT_MODAL);
  };

  return (
    <header className="banner">
      <div className="logo">HUMAN BENCHMARK (LOGO)</div>
      {user ? (
        <div
          className="account-signed-in"
          onMouseEnter={handleCursorEnter}
          onMouseLeave={handleCloseModals}
        >
          <button>
            <div className="account">
              <h3>{user.username}</h3>
              <img
                src={user.gender === GENDER_MALE ? boyPFP : girlPFP}
                alt="profile picture"
                width="40px"
              />
            </div>
          </button>
          {activeModal === ACCOUNT_MODAL && <AccountModal />}
        </div>
      ) : (
        <div className="account">
          <button onClick={handleSignInClick}>Log in</button>
          {activeModal === SIGN_IN_MODAL && (
            <SignInModal onClose={handleCloseModals} />
          )}
          <button onClick={handleSignUpClick}>Sign up</button>
          {activeModal === SIGN_UP_MODAL && (
            <SignUpModal onClose={handleCloseModals} />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
