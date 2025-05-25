import React from "react";
import useAuthGuard from "../../hooks/authGuard";

const CustomerDashboard = () => {
  useAuthGuard("customer");

  return (
    <div
      style={{
        padding: "20px 50px",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ecf0f1",
          borderRadius: "8px",
          color: "#1e3a5f",
        }}
      >
        <h1 style={{ textAlign: "center", margin: 0 }}>
          Welcome to Car Rental System
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#2c3e50" }}>
            Here you can view available cars, manage your reservations. Start a
            new reservation or review your rental history using the options
            below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
