import React, { useState } from "react";
import SmartWasteDashboard from "./SmartWasteDashboard";
import "./App.css";

function App() {
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const handleSignUp = () => {
    if (!nameInput) return alert("Enter a username");

    if (nameInput.toLowerCase() === "admin") {
      setIsAdmin(true);
      setUsername("Admin");
      return;
    }

    const defaultContainers = [
      { id: "C001", type: "Dry Waste", inUse: false },
      { id: "C002", type: "Wet Waste", inUse: false },
      { id: "C003", type: "Metal Waste", inUse: false },
    ];

    localStorage.setItem(`containers_${nameInput}`, JSON.stringify(defaultContainers));
    localStorage.setItem(`credits_${nameInput}`, 0); // ✅ initialize credits
    setUsername(nameInput);
  };

  if (!username) {
    return (
      <div className="login-container">
        <h1>♻️ SmartWaste Login / Sign-up</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <input
            type="text"
            placeholder="Enter username (type 'admin' for admin)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }

  return <SmartWasteDashboard username={username} isAdmin={isAdmin} />;
}

export default App;
