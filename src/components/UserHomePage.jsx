import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserHomePage.css';

const UserHomePage = () => {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/teams')
            .then(response => setTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    return (
        <div className="user-home-container">
            <h2>*** User Home Page ***</h2>
            <ul className="nav-links">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profiles">Profiles</Link></li>
                <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </ul>
            <h3>Scrum Teams</h3>
            <ul className="scrum-teams">
                {teams.map(team => (
                    <li key={team.id}>{team.team_name} <button className="details-btn">Get Details</button></li>
                ))}
            </ul>
        </div>
    );
};

export default UserHomePage;