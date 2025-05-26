import React from "react";

export default function Logout({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
