import "./SignUpModal.css";
import { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { BASE_URL, GENDER_FEMALE, GENDER_MALE } from "../constants";
import { useLoading } from "../loadingContext";
const STEP_ONE = 1;
const STEP_TWO = 2;

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const MIN_HEIGHT = 36;
const MAX_HEIGHT = 96;
const MIN_WEIGHT = 0;
const MAX_WEIGHT = 1000;
const MIN_AGE = 13;
const MAX_AGE = 100;

const SignUpModal = ({ onClose }) => {
  const { setLoading } = useLoading();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [zipcode, setZipcode] = useState("");
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

  const getCoordinates = async (zipcode) => {
    try {
      console.log("Getting coordinates for zipcode:", zipcode);
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${GOOGLE_API_KEY}`
        )
        .then((response) => {
          console.log(response.data.results[0].geometry.location);
          setLatitude(response.data.results[0].geometry.location.lat);
          setLongitude(response.data.results[0].geometry.location.lng);
        });
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
  };

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
    gender,
    zipcode
  ) => {
    setLoading(true);
    console.log("Creating account with zipcode:", zipcode); // Debugging log

    try {
      await getCoordinates(zipcode);
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await axios.post(`${BASE_URL}users`, {
        username,
        password: hashedPassword,
        height: parseInt(height, 10), // Ensure it's an integer
        weight: parseInt(weight, 10), // Ensure it's an integer
        age: parseInt(age, 10), // Ensure it's an integer
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        gender,
      });

      console.log("Account created successfully:", response.data);
      onClose();
    } catch (error) {
      console.error(
        "Error creating account:",
        error.response ? error.response.data : error.message
      );
      throw error;
    } finally {
      setLoading(false);
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
    if (password.length < 10) {
      newErrors.password = "Password must be at least 10 characters long.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { height: "", weight: "", age: "", gender: "" };

    if (
      !height ||
      isNaN(height) ||
      height < MIN_HEIGHT ||
      height > MAX_HEIGHT
    ) {
      newErrors.height =
        "Please enter a valid height between 36 and 96 inches.";
      valid = false;
    }
    if (
      !weight ||
      isNaN(weight) ||
      weight < MIN_WEIGHT ||
      weight > MAX_WEIGHT
    ) {
      newErrors.weight = "Please enter a valid weight between 0 and 1000 lbs.";
      valid = false;
    }
    if (!age || isNaN(age) || age < MIN_AGE || age > MAX_AGE) {
      newErrors.age = "Please enter a valid age between 13 and 100.";
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
          await createAccount(
            username,
            password,
            height,
            weight,
            age,
            gender,
            zipcode
          );
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
    <div className="modal-backdrop">
      <div className="signup-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
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

              <div className="password-tooltip-wrapper">
                <label htmlFor="password">Password:</label>
                <div className="tooltip-icon" tabIndex="0">
                  ⓘ
                  <span className="tooltip-text">
                    Password must be at least 10 characters long.
                  </span>
                </div>
              </div>

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
                min="36"
                max="96"
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
                min="0"
                max="1000"
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
                min="13"
                max="100"
              />
              {errors.age && (
                <span className="error-message">{errors.age}</span>
              )}

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

              <label htmlFor="zipcode">Zip Code:</label>
              <input
                type="number"
                id="zipcode"
                value={zipcode}
                onChange={(event) => setZipcode(event.target.value)}
                className={errors.zipcode ? "error" : ""}
                placeholder=""
              />
              {errors.height && (
                <span className="error-message">{errors.zipcode}</span>
              )}
            </>
          )}

          <button type="button" onClick={handleContinue}>
            {step === STEP_ONE ? "Continue" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
