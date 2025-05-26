import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItemStyle = (isHovered: boolean) => ({
    width: "16.66%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRight: "2px solid #7f8c8d",
    color: "#ffffff",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    height: "100%",
    backgroundColor: isHovered ? "#3498db" : "transparent",
  });

  return (
    <nav
      style={{
        display: "flex",
        width: "100%",
        height: "60px",
        backgroundColor: "#1e3a5f",
        color: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <Link
        to="/admin/ManageCars"
        style={navItemStyle(hoveredItem === "cars")}
        onMouseEnter={() => setHoveredItem("cars")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Cars
      </Link>
      <Link
        to="/admin/ManageCustomers"
        style={navItemStyle(hoveredItem === "customers")}
        onMouseEnter={() => setHoveredItem("customers")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Customers
      </Link>
      <Link
        to="/admin/ManageReservations"
        style={navItemStyle(hoveredItem === "reservations")}
        onMouseEnter={() => setHoveredItem("reservations")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Reservations
      </Link>
      <Link
        to="/admin/ManageBranches"
        style={navItemStyle(hoveredItem === "branches")}
        onMouseEnter={() => setHoveredItem("branches")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Branches
      </Link>
      <Link
        to="/admin/ManagePackages"
        style={navItemStyle(hoveredItem === "packages")}
        onMouseEnter={() => setHoveredItem("packages")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Packages
      </Link>
      <Link
        to="/admin/ManageAdmin"
        style={{
          ...navItemStyle(hoveredItem === "admin"),
          borderRight: "none",
        }}
        onMouseEnter={() => setHoveredItem("admin")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Admins
      </Link>
      <div
        style={{
          width: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderLeft: "2px solid #7f8c8d",
          marginLeft: "auto",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            border: "1px solid #e74c3c",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c0392b")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e74c3c")
          }
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
