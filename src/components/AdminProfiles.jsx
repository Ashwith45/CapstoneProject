import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AdminProfile.css"; // Importing CSS for better UI

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setAdmin(user);

    fetchEmployees();
  }, [navigate]);

  const fetchEmployees = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setEmployees(data.filter((user) => user.role === "user")))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  const handleGetHistory = async (employee) => {
    setSelectedEmployee(employee);
    setTaskHistory([]); // Clear previous history

    try {
      const scrumResponse = await fetch("http://localhost:5000/scrumTeams");
      const scrumTeams = await scrumResponse.json();

      // Find all tasks assigned to the employee in all teams
      const assignedTasks = scrumTeams
        .filter((team) => team.users.some((user) => user.email === employee.email))
        .flatMap((team) => team.tasks);

      setTaskHistory(assignedTasks);
    } catch (error) {
      console.error("Error fetching task history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="admin-profile">
      {/* 🔹 Navigation Bar */}
      <nav>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin-profiles">Profiles</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <h1>Admin Profile</h1>

      {admin && (
        <div className="admin-details">
          <h2>Admin Details</h2>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
        </div>
      )}

      <h2>Employees</h2>
      <ul className="employee-list">
        {employees.map((employee) => (
          <li key={employee.id} className="employee-item">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <button onClick={() => handleGetHistory(employee)} className="history-btn">Get History</button>
          </li>
        ))}
      </ul>

      {selectedEmployee && (
        <div className="task-history-modal">
          <h2>Tasks Worked By {selectedEmployee.name}</h2>
          {taskHistory.length === 0 ? (
            <p>No tasks found for this employee.</p>
          ) : (
            <ul className="task-list">
              {taskHistory.map((task, index) => (
                <li key={index} className="task-item">
                  <p><strong>Title:</strong> {task.title}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setSelectedEmployee(null)} className="close-btn">Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
