import React from "react";
import { Link } from "react-router-dom";
import "../styles/WelcomePage.css"; // Import the CSS file

const WelcomePage = () => {
  const scrumTeams = [
    { id: 1, name: "Scrum Team A" },
    { id: 2, name: "Scrum Team B" }
  ];

  return (
    <div className="container">
      <h1>Scrum Teams</h1>
      <nav>
        <Link to="/user-dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
      <ul>
        {scrumTeams.map((team) => (
          <li key={team.id}>
            {team.name} <Link to="/login"><button>Get Details</button></Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WelcomePage;
