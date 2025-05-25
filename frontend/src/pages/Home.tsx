import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ecf0f1",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1e3a5f",
            marginBottom: "30px",
            fontSize: "2.5rem",
          }}
        >
          Car Rental Management System
        </h1>

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              color: "#2c3e50",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            Welcome to our Car Rental Management System, a comprehensive
            database implementation project. This system demonstrates practical
            applications of database operations and management.
          </p>

          <p
            style={{
              color: "#2c3e50",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            For customers, experience seamless database operations including
            SELECT queries for browsing available cars, JOIN operations for
            viewing reservation details, and INSERT operations for creating new
            reservations.
          </p>

          <p
            style={{ color: "#2c3e50", fontSize: "1.1rem", lineHeight: "1.6" }}
          >
            Administrators can manage the database with INSERT, UPDATE, and
            DELETE operations, maintaining the system's data integrity and
            efficiency.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              backgroundColor: "#1e3a5f",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#152a45")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#1e3a5f")
            }
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              backgroundColor: "#3498db",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#2980b9")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#3498db")
            }
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
