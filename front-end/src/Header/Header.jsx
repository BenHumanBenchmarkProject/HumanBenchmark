import "./Header.css";
import React, { useContext } from "react";
import blankPfp from "../assets/blank-pfp.jpg";
import SignInModal from "../SignInModal/SignInModal";
import SignUpModal from "../SignUpModal/SIgnUpModal";
import { useState } from "react";
import UserContext from "../userContext.jsx";
import AccountModal from "../AccountModal/AccountModal.jsx";

const SIGN_IN_MODAL = "SIGN_IN_MODAL";
const SIGN_UP_MODAL = "SIGN_UP_MODAL";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const { user } = useContext(UserContext);

  const handleSignInClick = () => {
    setActiveModal(SIGN_IN_MODAL);
    setIsAccountModalVisible(false); // without this line in the AccountModal appears after log in
  };

  const handleSignUpClick = () => {
    setActiveModal(SIGN_UP_MODAL);
    setIsAccountModalVisible(false); // without this line in the AccountModal appears after log in
  };

  const handleCloseModals = () => {
    setActiveModal(null);
  };

  const handleCursorEnter = () => {
    setIsAccountModalVisible(true);
  };

  const handleCursorLeave = () => {
    setIsAccountModalVisible(false);
  };

  return (
    <header className="banner">
      <div className="logo">HUMAN BENCHMARK (LOGO)</div>
      {user ? (
        <div
          className="account-signed-in"
          onMouseEnter={handleCursorEnter}
          onMouseLeave={handleCursorLeave}
        >
          <button>
            <div className="account">
              <h3>{user.username}</h3>
              <img src={blankPfp} alt="profile picture" width="40px" />
            </div>
          </button>
          {isAccountModalVisible && <AccountModal />}
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
