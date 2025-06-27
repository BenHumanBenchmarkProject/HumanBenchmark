import "./SignInModal.css"
import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignInModal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
          const response = await axios.post(`${BASE_URL}users/login`, {
            username,
            password,
          });

          if (response.data.success) {
            console.log("Login successful");
            
          } else {
            setError("Invalid username or password");
          }
        } catch (err) {
          console.error("Error logging in:", err);
          setError("An error occurred during login");
        }
      };
    return(
        <div className="signin-container">
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
    )
}

export default SignInModal;
