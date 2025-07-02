import "./SignInModal.css";
import axios from "axios";
import { useState, useContext } from "react";
import UserContext from "..//userContext.jsx";

import { BASE_URL } from "../constants";

const SignInModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}users/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log("Login response:", response.data);
        login(response.data.user); // update context with user info
        console.log("Login successful");
        onClose(); // close after login
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="signin-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h1>Sign In</h1>
        <form className="signin-form" onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <span className="error-message">{error}</span>}

          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
