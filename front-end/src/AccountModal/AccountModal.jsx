import "./AccountModal.css";
import UserContext from "../userContext";
import boyPFP from "../assets/blue-pfp.jpg";
import girlPFP from "../assets/pink-pfp.jpeg";
import { useContext } from "react";
import { Link } from "react-router";

const AccountModal = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="account-modal-container">
      <div className="modal-all">
        <img
          src={user.gender === "M" ? boyPFP : girlPFP}
          alt="userProfilePicture"
          id="modal-profile-picture"
        />
        <div className="modal-right">
          <h2>{user.username}</h2>
          <div className="modal-btns">
            <Link to={"/myAccount"}>
              <button id="my-account-btn">My Account</button>{" "}
            </Link>

            <Link to={"/"}>
              {" "}
              <button id="logout-btn" onClick={logout}>
                Log Out
              </button>{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
