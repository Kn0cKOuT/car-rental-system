import React from "react";
import useAuthGuard from "../../hooks/authGuard";

const AdminDashboard = () => {
  useAuthGuard("admin");

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
          backgroundColor: "#ecf0f1",
          color: "#1e3a5f",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
      </div>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#2c3e50" }}>
          As an administrator, you can manage vehicles, monitor reservations,
          and control platform-wide settings. Use the navigation panel to add
          new cars, update availability, or review customer bookings.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
