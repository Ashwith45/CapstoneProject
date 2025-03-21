import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notification"; // Import Notifications component
import "../styles/AdminDashboard.css"; // Import CSS for better UI

const AdminDashboard = () => {
  const [scrumTeams, setScrumTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [scrumName, setScrumName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [assignTo, setAssignTo] = useState("");
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]); // Store notifications
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setAdmin(user);
    fetchScrumTeams();
    fetchUsers();
    fetchNotifications();
  }, [navigate]);

  const fetchScrumTeams = () => {
    fetch("http://localhost:5000/scrumTeams")
      .then((res) => res.json())
      .then((data) => setScrumTeams(data))
      .catch((err) => console.error("Error fetching scrum teams:", err));
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const fetchNotifications = () => {
    fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  };

  const handleCreateScrum = () => {
    if (!scrumName || !taskTitle || !taskDescription || !assignTo) {
      alert("All fields are required");
      return;
    }

    const assignedUser = users.find((u) => u.name === assignTo);
    if (!assignedUser) {
      alert("Selected user not found!");
      return;
    }

    const newScrum = {
      id: Date.now().toString(),
      name: scrumName,
      users: [{ name: assignTo, email: assignedUser.email }],
      tasks: [{ id: Date.now().toString(), title: taskTitle, description: taskDescription, status: taskStatus }],
    };

    fetch("http://localhost:5000/scrumTeams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newScrum),
    })
      .then(() => {
        fetchScrumTeams();
        setShowForm(false);
        alert("Scrum created successfully!");
      })
      .catch((err) => console.error("Error creating scrum:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* 🔹 Navigation Bar */}
      <nav>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin-profiles">Profiles</Link>
        <Link to="/admin-add-user">Users</Link>

        {/* 🔔 Notification Icon with Dot Indicator */}
        <Link to="/admin-notifications" className="notification-link">
          Notifications
          {notifications.length > 0 && <span className="notification-dot"></span>}
        </Link>

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      {/* 🔔 Display Notifications */}
      <Notifications />

      {/* 🔹 Add New Scrum Form */}
      <button className="add-scrum-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Scrum"}
      </button>

      {showForm && (
        <div className="scrum-form">
          <h2>Create New Scrum</h2>
          <input type="text" placeholder="Scrum Name" value={scrumName} onChange={(e) => setScrumName(e.target.value)} />
          <input type="text" placeholder="Task Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <input type="text" placeholder="Task Description" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />

          <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">Select Employee</option>
            {users.filter((u) => u.role === "user").map((user) => (
              <option key={user.id} value={user.name}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button onClick={handleCreateScrum} className="create-btn">Create Scrum</button>
        </div>
      )}

      {/* 🔹 Scrum Teams List */}
      <h2>Scrum Teams</h2>
      <ul className="scrum-teams-list">
        {scrumTeams.map((team) => (
          <li key={team.id}>
            {team.name}
            <Link to={`/scrum-details/${team.id}`}>
              <button className="details-btn">Get Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
