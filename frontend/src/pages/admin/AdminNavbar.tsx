import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ManageCars from "./ManageCars";
import ManageCustomers from "./ManageCustomers";
import ManageReservations from "./ManageReservations";
import ManageBranches from "./ManageBranches";
import ManagePackages from "./ManagePackages";

const AdminNavbar = () => {
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
        <Link to="/admin/ManageCars" style={linkStyle}>
          Cars
        </Link>
        <Link to="/admin/ManageCustomers" style={linkStyle}>
          Customers
        </Link>
        <Link to="/admin/ManageReservations" style={linkStyle}>
          Reservations
        </Link>
        <Link to="/admin/ManageBranches" style={linkStyle}>
          Branches
        </Link>
        <Link to="/admin/ManagePackages" style={linkStyle}>
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

export default AdminNavbar;
