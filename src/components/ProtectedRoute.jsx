import React from "react";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import { authApi } from "@/api/authApi";

export default function ProtectedRoute({ children, allowedRoles = ["admin"] }) {
  const token = authApi.getToken();
  const user = authApi.getUser();

  // If no token or user, redirect to admin login
  if (!token || !user) {
    return <Navigate to={PATHS.ADMIN_LOGIN} replace />;
  }

  // If user role is not in the allowed list, redirect to home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // User is authenticated and has correct role
  return children;
}
