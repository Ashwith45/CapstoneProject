import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import UserDashboard from "./components/UserDashboard";
import ScrumDetails from "./components/ScrumDetails";
import Profiles from "./components/Profiles";
//import ScrumTeams from "./components/ScrumTeams"; // 🔹 Added Scrum Teams Route
import AdminDashboard from "./components/AdminDashboard";
import AdminProfile from "./components/AdminProfiles";
import AdminAddScrum from "./components/AdminAddScrum";
import AdminAddUser from "./components/AdminAddUser";
import Logout from "./components/Logout";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 🔹 Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 🔹 User Routes */}
        <Route path="/user-dashboard" element={<PrivateRoute element={<UserDashboard />} role="user" />} />
        <Route path="/scrum-details/:id" element={<PrivateRoute element={<ScrumDetails />} role={["user", "admin"]} />} />
        <Route path="/profiles" element={<PrivateRoute element={<Profiles />} role="user" />} />
        

        {/* 🔹 Admin Routes */}
        <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} role="admin" />} />
        <Route path="/admin-profiles" element={<PrivateRoute element={<AdminProfile />} role="admin" />} />
        <Route path="/admin-add-scrum" element={<PrivateRoute element={<AdminAddScrum />} role="admin" />} />
        <Route path="/admin-add-user" element={<PrivateRoute element={<AdminAddUser />} role="admin" />} />

        {/* 🔹 Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;
