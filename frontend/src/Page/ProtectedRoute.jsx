// src/Page/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // belum login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // sudah login tapi bukan admin
    return <Navigate to="/" replace />;
  }

  // sudah login dan admin, boleh akses
  return children;
};

export default ProtectedRoute;
