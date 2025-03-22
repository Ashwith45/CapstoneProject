import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/ScrumDetails.css"; // Import CSS for styling

const ScrumDetails = () => {
  const { id } = useParams();
  const [scrum, setScrum] = useState(null);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    // Fetch Scrum Team Details
    fetch(`http://localhost:5000/scrumTeams/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setScrum(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Scrum Team:", err);
        setLoading(false);
      });

    // Fetch notifications related to this scrum team
    fetch(`http://localhost:5000/notifications`)
      .then((res) => res.json())
      .then((data) => {
        const teamNotifications = data.filter((n) => n.teamId === id && !n.isRead);
        setNotifications(teamNotifications);
        setHasUnreadNotifications(teamNotifications.length > 0);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, [id]);

  // Admin updates task status
  const handleStatusUpdate = (taskId, newStatus) => {
    if (!scrum || !user || user.role !== "admin") return;

    const updatedTasks = scrum.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );

    const updatedScrum = { ...scrum, tasks: updatedTasks };

    fetch(`http://localhost:5000/scrumTeams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedScrum),
    })
      .then(() => setScrum(updatedScrum))
      .catch((err) => console.error("Error updating status:", err));

    // Remove notification after admin updates task
    handleClearNotification(taskId);
  };

  // Mark notification as read when the admin reviews it
  const handleClearNotification = (taskId) => {
    fetch(`http://localhost:5000/notifications`)
      .then((res) => res.json())
      .then((data) => {
        const taskNotification = data.find((n) => n.taskId === taskId && n.teamId === id);
        if (taskNotification) {
          fetch(`http://localhost:5000/notifications/${taskNotification.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          }).then(() => {
            setNotifications((prev) => prev.filter((n) => n.taskId !== taskId));
            setHasUnreadNotifications(false);
          });
        }
      })
      .catch((err) => console.error("Error clearing notification:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (loading) return <p className="loading">Loading Scrum Details...</p>;
  if (!scrum) return <p className="error">Error: Scrum Team not found.</p>;

  return (
    <div className="scrum-details-container">
      {/* 🔹 Navigation Bar */}
      <nav className="nav-bar">
        <Link to="/user-dashboard">Dashboard</Link>
        <Link to="/profiles">Profiles</Link>
        <button onClick={handleLogout}>Logout</button>
        <span className="notification-icon">
          Notifications {hasUnreadNotifications && <span className="dot"></span>}
        </span>
      </nav>

      <h1>Scrum Details for {scrum.name}</h1>

      {/* 🔹 Notifications Section for Admin */}
      {user?.role === "admin" && notifications.length > 0 && (
        <div className="notifications-panel">
          <h3>Pending Status Requests</h3>
          {notifications.map((notification) => (
            <div key={notification.taskId} className="notification-card">
              <p>{notification.message}</p>
              <button onClick={() => handleStatusUpdate(notification.taskId, notification.status)}>
                Approve
              </button>
              <button onClick={() => handleClearNotification(notification.taskId)}>Ignore</button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Tasks Section */}
      <h2>Tasks</h2>
      <ul className="task-list">
        {scrum.tasks.map((task) => (
          <li key={task.id} className="task-card">
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>

            {/* 🔹 Admin can update task status */}
            {user?.role === "admin" ? (
              <select value={task.status} onChange={(e) => handleStatusUpdate(task.id, e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            ) : (
              <p className={`task-status ${task.status.toLowerCase()}`}><strong>Status:</strong> {task.status}</p>
            )}
          </li>
        ))}
      </ul>

      {/* 🔹 Assigned Users Section */}
      <h2>Assigned Users</h2>
      <ul className="user-list">
        {scrum.users.map((user, index) => (
          <li key={index} className="user-card">
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrumDetails;
