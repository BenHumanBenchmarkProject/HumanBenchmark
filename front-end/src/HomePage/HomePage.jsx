import "./HomePage.css";
import React from "react";
import { useState } from "react";
import bodyOutline from "../assets/body-outline.jpg";

import { NavigationButtons } from "../constants";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <div className="container">
        <NavigationButtons className="navButtons" />

        <section className="diagram-section">
          <img src={bodyOutline} alt="Body Outline" className="body-img" />
          <div className="xp-labels-column">
            <div className="xp-label">
              Brain
              <br />
              200xp
            </div>
            <div className="xp-label">
              Torso
              <br />
              50xp
            </div>
            <div className="xp-label">
              Arms
              <br />
              100xp
            </div>
            <div className="xp-label">
              Legs
              <br />
              300xp
            </div>
            <div className="xp-label">
              Stamina
              <br />
              500xp
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
