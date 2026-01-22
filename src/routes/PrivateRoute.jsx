import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth(); // access login state
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />; // redirect to login page if user is not logged in
};

export default PrivateRoute;
