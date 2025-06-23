import "./HomePage.css"
import React from 'react'
import bodyOutline from '../assets/body-outline.jpg'
import { Link } from "react-router"


const HomePage = () =>{
    return (
        <>
          <header className="banner">
            <div className="logo">HUMAN BENCHMARK (LOGO)</div>
            <div className="account">Account</div>
          </header>

          <div className="container">
            <aside className="sidebar">
              <div className="level">
                <h2>LEVEL 82</h2>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ "--final-width": "50%" }}></div>
                </div>
                <div className="xp-labels">
                  <span>300xp</span>
                  <span>600xp</span>
                </div>
              </div>

              <div className="stats">
                <h3>STATS</h3>
                <div className="stat">
                  <span>Strength</span>
                  <div className="bar">
                    <div style={{ "--final-width": "50%" }}></div>
                  </div>
                  50
                </div>
                <div className="stat">
                  <span>Knowledge</span>
                  <div className="bar">
                    <div style={{ "--final-width": "30%" }}></div>
                  </div>
                  30
                </div>
                <div className="stat">
                  <span>Overall</span>
                  <div className="bar">
                    <div style={{ "--final-width": "40%" }}></div>
                  </div>
                  40
                </div>
              </div>
            </aside>

            <main className="main-content">
              <div className="top-buttons">
                <Link to={"/leaderboard"}><button>LEADER BOARD</button></Link>
                <Link to ={"/build-workout"}><button>BUILD WORKOUT</button></Link>
                <Link to={"/log-workout"}><button>LOG WORKOUT</button></Link>
                
              </div>

              <section className="diagram-section">
                <img
                  src={bodyOutline}
                  alt="Body Outline"
                  className="body-img"
                />
                <div className="xp-labels-column">
                  <div className="xp-label">Brain<br />200xp</div>
                  <div className="xp-label">Torso<br />50xp</div>
                  <div className="xp-label">Arms<br />100xp</div>
                  <div className="xp-label">Legs<br />300xp</div>
                  <div className="xp-label">Stamina<br />500xp</div>
                </div>
              </section>
            </main>
          </div>
        </>
      );

}

export default HomePage
