import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Logout.css"; // Import CSS for styling

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Clear all stored user data and redirect to login
    setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, 2000); // 2-second delay for better UX
  }, [navigate]);

  return (
    <div className="logout-container">
      <h3>Logging out...</h3>
      <p>Please wait while we redirect you to the login page.</p>
    </div>
  );
};

export default Logout;
