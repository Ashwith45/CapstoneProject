import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/UserDashboard.css"; // Import CSS for styling

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [scrumTeams, setScrumTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
    fetchScrumTeams();
  }, [navigate]);

  // Fetch scrum teams from the database
  const fetchScrumTeams = () => {
    fetch("http://localhost:5000/scrumTeams")
      .then((res) => res.json())
      .then((data) => {
        setScrumTeams(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching scrum teams:", err);
        setLoading(false);
      });
  };

  // Handle status update request by user
  const handleStatusUpdateRequest = async (teamId, taskId, newStatus) => {
    if (!user) return;

    try {
      const notification = {
        taskId,
        teamId,
        status: newStatus,
        message: `${user.name} has requested to update task status to '${newStatus}'`,
        isRead: false
      };

      await fetch("http://localhost:5000/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification)
      });

      alert("Status update request sent to admin.");
    } catch (error) {
      console.error("Error sending status update request:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (loading) return <p className="loading">Loading Scrum Teams...</p>;

  return (
    <div className="dashboard-container">
      {/* 🔹 Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/user-dashboard">Dashboard</Link>
        <Link to="/profiles">Profiles</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>

      <h1>Welcome, {user.name}!</h1>

      {/* 🔹 Scrum Teams Section */}
      <h2>Scrum Teams</h2>
      <ul className="scrum-teams-list">
        {scrumTeams.map((team) => (
          <li key={team.id} className="scrum-card">
            <h3>{team.name}</h3>

            <ul className="task-list">
              {team.tasks.map((task) =>
                task.assignedTo === user.email ? (
                  <li key={task.id} className="task-card">
                    <p><strong>Title:</strong> {task.title}</p>
                    <p><strong>Description:</strong> {task.description}</p>
                    <p><strong>Status:</strong> {task.status}</p>

                    {/* Employee can request status update */}
                    <select
                      onChange={(e) => handleStatusUpdateRequest(team.id, task.id, e.target.value)}
                    >
                      <option value="">Update Status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </li>
                ) : null
              )}
            </ul>

            {/* Get Details Button */}
            <Link to={`/scrum-details/${team.id}`}>
              <button className="details-button">Get Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
