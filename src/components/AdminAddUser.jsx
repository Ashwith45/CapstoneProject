import React, { useState, useEffect } from "react";
import "../styles/AdminAddUser.css"; // Import CSS for styling

const AdminAddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [lastUserId, setLastUserId] = useState(0); // Track last user ID

  // 🔹 Fetch users to get the last ID
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          const maxId = Math.max(...data.map((user) => parseInt(user.id))); // Get highest ID
          setLastUserId(maxId);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validate all fields
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // 🔹 Validate email format
    if (!email.includes("@")) {
      setError("Please include an '@' in the email.");
      return;
    }

    // 🔹 Check if email already exists
    if (users.some((user) => user.email === email)) {
      setError("Email already exists. Please use another email.");
      return;
    }

    // 🔹 Generate the next sequential ID
    const newUserId = lastUserId + 1;

    // 🔹 Create user object
    const newUser = {
      id: newUserId.toString(),
      name,
      email,
      password,
      role,
    };

    try {
      // 🔹 Add new user to the database
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      // 🔹 Update state and reset form
      setUsers([...users, newUser]);
      setLastUserId(newUserId);
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setError("");

      // Notify parent component
      if (onUserAdded) onUserAdded(newUser);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-add-user">
      <h2>Add New User</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AdminAddUser;
