import React from "react";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { authApi } from "@/api/authApi";

export default function ProtectedRoute({ children }) {
  const token = authApi.getToken();
  const user = authApi.getUser();

  // If no token or user, redirect to admin login
  if (!token || !user) {
    return <Navigate to={PATHS.ADMIN_LOGIN} replace />;
  }

  // If user is not admin, redirect to home
  if (user.role !== "admin") {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // User is authenticated and is admin
  return children;
}
