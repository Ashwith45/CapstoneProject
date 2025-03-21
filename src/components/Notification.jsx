import React, { useState, useEffect } from "react";
import "../styles/Notification.css"; // Import CSS for styling

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Toggle dropdown visibility

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch("http://localhost:5000/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));
  };

  const handleStatusUpdate = async (id, taskId, teamId, newStatus) => {
    try {
      // Update task status in scrum teams
      const teamResponse = await fetch(`http://localhost:5000/scrumTeams/${teamId}`);
      const teamData = await teamResponse.json();

      const updatedTasks = teamData.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      await fetch(`http://localhost:5000/scrumTeams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...teamData, tasks: updatedTasks }),
      });

      // Remove notification after updating task status
      await fetch(`http://localhost:5000/notifications/${id}`, {
        method: "DELETE",
      });

      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="notification-container">
      {/* 🔔 Bell Icon with Dot Indicator */}
      <div className="notification-icon" onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bell"></i> {/* FontAwesome Bell Icon */}
        {notifications.length > 0 && <span className="notification-dot"></span>}
      </div>

      {/* 🔹 Notification Dropdown */}
      {isOpen && (
        <div className="notification-dropdown">
          <h2>Notifications</h2>
          <ul className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <p>
                    <strong>{notification.userName}</strong> has marked a task as completed.
                  </p>
                  <div className="notification-buttons">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleStatusUpdate(notification.id, notification.taskId, notification.teamId, "Completed")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleStatusUpdate(notification.id, notification.taskId, notification.teamId, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="no-notifications">No new notifications</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
