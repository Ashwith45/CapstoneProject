import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // Import CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching users from API...");
      const response = await fetch("http://localhost:5000/users");

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const users = await response.json();
      console.log("Users from API:", users);

      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        console.log("User not found:", email);
        setError("User not found!");
      } else if (user.password !== password) {
        console.log("Incorrect password for:", email);
        setError("Incorrect password!");
      } else {
        console.log("Login successful for:", user);
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p className="signup-text">
        Don't have an account?{" "}
        <span className="signup-link" onClick={() => navigate("/signup")}>
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default Login;
