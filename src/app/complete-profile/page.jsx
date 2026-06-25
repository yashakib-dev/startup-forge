"use client";

import { useState } from "react";

export default function CompleteProfile() {
  const [role, setRole] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>Select Role</h1>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Choose Role</option>
        <option value="jobSeeker">Job Seeker</option>
        <option value="startupOwner">Startup Owner</option>
      </select>

      <button onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
}