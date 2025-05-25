import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItemStyle = (isHovered: boolean) => ({
    width: "25%",
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
        to="/customer/Reservations"
        style={navItemStyle(hoveredItem === "reservations")}
        onMouseEnter={() => setHoveredItem("reservations")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Reservations
      </Link>
      <Link
        to="/customer/Cars"
        style={navItemStyle(hoveredItem === "cars")}
        onMouseEnter={() => setHoveredItem("cars")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Cars
      </Link>
      <Link
        to="/customer/Branches"
        style={navItemStyle(hoveredItem === "branches")}
        onMouseEnter={() => setHoveredItem("branches")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Branches
      </Link>
      <Link
        to="/customer/Packages"
        style={{
          ...navItemStyle(hoveredItem === "packages"),
          borderRight: "none",
        }}
        onMouseEnter={() => setHoveredItem("packages")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        Packages
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

export default CustomerNavbar;
