// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  // not authenticated -> go to login
  if (!user) return <Navigate to="/login" replace />;

  // role-based guard (if allowedRoles provided)
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // allowed
  return children;
}
