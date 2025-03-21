import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpPage.css"; // Import CSS for styling

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUserId, setLastUserId] = useState(0);
  const navigate = useNavigate();

  // 🔹 Fetch last user ID from database
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((users) => {
        if (users.length > 0) {
          const maxId = Math.max(...users.map((user) => parseInt(user.id))); // Get the highest ID
          setLastUserId(maxId);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // 🔹 Validate email format
  const validateEmail = (email) => email.includes("@");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🔹 Validate all fields
    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // 🔹 Validate email format
    if (!validateEmail(email)) {
      setError("Please include an '@' in the email.");
      setLoading(false);
      return;
    }

    try {
      // 🔹 Check if email already exists
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      if (users.some((user) => user.email === email)) {
        setError("Email already exists. Please use another email.");
        setLoading(false);
        return;
      }

      // 🔹 Generate next sequential ID
      const newUserId = lastUserId + 1;

      // 🔹 Create user object
      const newUser = {
        id: newUserId.toString(), // Convert to string as JSON Server stores IDs as strings
        name,
        email,
        password,
        role: "user", // Default role
      };

      // 🔹 Add new user to the database
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      // 🔹 Store user in localStorage and redirect to home page
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSignUp} className="signup-form">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p className="login-text">
        Already have an account?{" "}
        <span className="login-link" onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default SignUpPage;
