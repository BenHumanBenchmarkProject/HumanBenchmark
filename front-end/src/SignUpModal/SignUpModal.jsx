import "./SignUpModal.css";
import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const STEP_ONE = 1;
const STEP_TWO = 2;
const GENDER_MALE = "M";
const GENDER_FEMALE = "F";


const SignUpModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [step, setStep] = useState(STEP_ONE);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
  });

  const checkAvailability = async (username) => {
    try {
      const response = await axios.post(`${BASE_URL}check-availability`, {
        username,
      });
      return response.data.available;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return false;
    }
  };

  const createAccount = async (
    username,
    password,
    height,
    weight,
    age,
    gender
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}users`, {
        username,
        password,
        height: parseInt(height, 10), // Ensure it's an integer
        weight: parseInt(weight, 10), // Ensure it's an integer
        age: parseInt(age, 10), // Ensure it's an integer
        gender,
      });

      console.log("Account created successfully:", response.data);
    } catch (error) {
      console.error(
        "Error creating account:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { username: "", password: "", confirmPassword: "" };

    if (!username) {
      newErrors.username = "Username is required.";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }
    if(password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { height: "", weight: "", age: "", gender: "" };

    if (!height || isNaN(height)) {
      newErrors.height = "Please enter a valid number for height.";
      valid = false;
    }
    if (!weight || isNaN(weight)) {
      newErrors.weight = "Please enter a valid number for weight.";
      valid = false;
    }
    if (!age || isNaN(age)) {
      newErrors.age = "Please enter a valid number for age.";
      valid = false;
    }
    if (!gender || (gender !== GENDER_MALE && gender !== GENDER_FEMALE)) {
      newErrors.gender = "Please make a selection for gender.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const resetInputState = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setHeight("");
    setWeight("");
    setAge("");
    setGender("");
    setErrors({
      username: "",
      password: "",
      confirmPassword: "",
      height: "",
      weight: "",
      age: "",
      gender: "",
    });
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    if (step === STEP_ONE) {
      if (!validateStep1()) return;

      const isUsernameAvailable = await checkAvailability(username);
      if (!isUsernameAvailable) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username is already taken.",
        }));
        return;
      }

      setStep(STEP_TWO);
    } else if (step === STEP_TWO) {
      if (validateStep2()) {
        try {
          await createAccount(username, password, height, weight, age, gender);
          // reset all inputs and return to step 1
          resetInputState();
          setStep(STEP_ONE);
        } catch (error) {
          console.error("Error creating account:", error);
        }
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form className="signup-form">
        {step === STEP_ONE && (
          <>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={errors.username ? "error" : ""}
              placeholder=""
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={errors.password ? "error" : ""}
              placeholder=""
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}

            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={errors.confirmPassword ? "error" : ""}
              placeholder=""
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </>
        )}

        {step === STEP_TWO && (
          <>
            <label htmlFor="height">Height (in):</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
              className={errors.height ? "error" : ""}
              placeholder=""
            />
            {errors.height && (
              <span className="error-message">{errors.height}</span>
            )}

            <label htmlFor="weight">Weight (lb):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className={errors.weight ? "error" : ""}
              placeholder=""
            />
            {errors.weight && (
              <span className="error-message">{errors.weight}</span>
            )}

            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className={errors.age ? "error" : ""}
              placeholder=""
            />
            {errors.age && <span className="error-message">{errors.age}</span>}

            <legend>Gender:</legend>
            <div className="radioInputs">
              <div className="genderOption">
                <input
                  type="radio"
                  name="gender"
                  value={GENDER_MALE}
                  checked={gender === GENDER_MALE}
                  onChange={(event) => setGender(event.target.value)}
                  id="gender-m"
                />
                <label htmlFor="gender-m">Male</label>
              </div>
              <div className="genderOption">
                <input
                  type="radio"
                  name="gender"
                  value={GENDER_FEMALE}
                  checked={gender === GENDER_FEMALE}
                  onChange={(event) => setGender(event.target.value)}
                  id="gender-f"
                />
                <label htmlFor="gender-f">Female</label>
              </div>
            </div>

            {errors.gender && (
              <span className="error-message">{errors.gender}</span>
            )}
          </>
        )}

        <button type="button" onClick={handleContinue}>
          {step === STEP_ONE ? "Continue" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SignUpModal;
