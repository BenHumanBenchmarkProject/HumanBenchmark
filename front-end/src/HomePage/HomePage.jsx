import "./HomePage.css";
import React from "react";
import { useState } from "react";
import bodyOutline from "../assets/body-outline.jpg";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import NavigationButtons from "../NaviagtionButtons/NavigationButtons";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="container">
        <Sidebar />

        <main className="main-content">
          <NavigationButtons />

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
        </main>
      </div>
    </>
  );
};

export default HomePage;
