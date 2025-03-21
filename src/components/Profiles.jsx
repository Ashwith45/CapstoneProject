import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profiles.css"; // Import CSS file for styling

const Profiles = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    // Fetch scrum teams and get tasks assigned to this user
    fetch("http://localhost:5000/scrumTeams")
      .then((res) => res.json())
      .then((scrumTeams) => {
        const assignedTasks = scrumTeams.flatMap((team) =>
          team.users.some((teamUser) => teamUser.email === loggedInUser.email)
            ? team.tasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                teamId: team.id,
              }))
            : []
        );

        setTasks(assignedTasks);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [navigate]);

  const handleTaskCompletion = async (taskId, teamId) => {
    try {
      // Add notification for the admin
      await fetch("http://localhost:5000/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          teamId,
          userId: user.id,
          userName: user.name,
          status: "Pending Approval",
          isRead: false, // Admin sees a dot indicator
        }),
      });

      alert("Task marked as completed! Waiting for admin approval.");
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="profile-container">
      {/* 🔹 Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/user-dashboard">Dashboard</Link>
        <Link to="/profiles">Profiles</Link>
        <Link to="/scrum-teams">Scrum Teams</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1>User Profile</h1>
      <div className="user-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h2>Tasks Assigned to {user.name}</h2>
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={index} className="task-card">
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Description:</strong> {task.description}</p>
              <p className={`task-status ${task.status.toLowerCase()}`}>
                <strong>Status:</strong> {task.status}
              </p>
              {task.status !== "Completed" && (
                <button
                  className="complete-btn"
                  onClick={() => handleTaskCompletion(task.id, task.teamId)}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-tasks">No tasks assigned.</p>
      )}
    </div>
  );
};

export default Profiles;
