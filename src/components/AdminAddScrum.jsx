import React, { useState, useEffect } from "react";
import "../styles/AdminAddScrum.css"; // Importing CSS for styling

const AdminAddScrum = ({ onAddScrum }) => {
  const [scrumName, setScrumName] = useState("");
  const [scrumTeams, setScrumTeams] = useState([]);
  const [lastScrumId, setLastScrumId] = useState(0); // Track last Scrum ID

  useEffect(() => {
    // Fetch existing Scrum Teams to determine last ID
    fetch("http://localhost:5000/scrumTeams")
      .then((res) => res.json())
      .then((data) => {
        setScrumTeams(data);
        if (data.length > 0) {
          const maxId = Math.max(...data.map((team) => parseInt(team.id))); // Get highest ID
          setLastScrumId(maxId);
        }
      })
      .catch((err) => console.error("Error fetching Scrum Teams:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (scrumName.trim() === "") {
      alert("Scrum Team Name is required.");
      return;
    }

    // Generate the next sequential ID
    const newScrumId = lastScrumId + 1;

    const newScrum = {
      id: newScrumId.toString(),
      name: scrumName,
      users: [],
      tasks: []
    };

    try {
      // Send the new Scrum Team to the database
      await fetch("http://localhost:5000/scrumTeams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newScrum)
      });

      // Update state with the new team
      setScrumTeams([...scrumTeams, newScrum]);
      setLastScrumId(newScrumId); // Update last Scrum ID
      setScrumName("");

      // Notify parent component (if needed)
      if (onAddScrum) onAddScrum(newScrum);
    } catch (err) {
      console.error("Error adding Scrum Team:", err);
    }
  };

  return (
    <div className="admin-add-scrum">
      <h2>Add Scrum Team</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={scrumName}
          onChange={(e) => setScrumName(e.target.value)}
          placeholder="Enter Scrum Team Name"
          required
        />
        <button type="submit">Add Scrum</button>
      </form>
    </div>
  );
};

export default AdminAddScrum;
