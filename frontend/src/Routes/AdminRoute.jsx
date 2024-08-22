// src/Routes/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
