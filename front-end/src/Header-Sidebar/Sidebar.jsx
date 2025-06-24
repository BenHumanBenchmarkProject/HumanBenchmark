import "./Sidebar.css"
import React from 'react';

const Sidebar = () => (
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
);

export default Sidebar;
