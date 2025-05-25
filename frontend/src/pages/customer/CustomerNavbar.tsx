import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    margin: "0 0.5rem",
  };

  return (
    <nav
      style={{
        backgroundColor: "#333",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }}></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 2,
        }}
      >
        <Link to="/customer/Reservations" style={linkStyle}>
          Reservations
        </Link>
        <Link to="/customer/Cars" style={linkStyle}>
          Cars
        </Link>
        <Link to="/customer/Branches" style={linkStyle}>
          Branches
        </Link>
        <Link to="/customer/Packages" style={linkStyle}>
          Packages
        </Link>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
