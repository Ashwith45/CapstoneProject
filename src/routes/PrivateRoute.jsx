import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  console.log("Checking Private Route Access:", loggedInUser);

  if (!loggedInUser) {
    console.log("User not logged in, redirecting to login...");
    return <Navigate to="/login" />;
  }

  // Convert role to an array to support multiple roles
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(loggedInUser.role)) {
    console.log("User role not authorized, redirecting to login...");
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
