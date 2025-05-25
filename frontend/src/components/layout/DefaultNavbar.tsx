import React from "react";
import { Link, useNavigate } from "react-router-dom";

const DefaultNavbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return <div>{/* Your Navbar code will go here */}</div>;
};

export default DefaultNavbar;
