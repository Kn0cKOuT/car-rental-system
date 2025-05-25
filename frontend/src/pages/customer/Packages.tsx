import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const Packages = () => {
  useAuthGuard("customer");
  const navigate = useNavigate();

  type Package = {
    PackageID: number;
    PackageName: string;
    Description: string;
    DailyCost: number | null;
  };

  const [insurancePackages, setPackages] = useState<Package[]>([]);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/api/customer/packages");
      setPackages(response.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div
      style={{
        padding: "20px 50px",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/customer/CustomerDashboard")}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          padding: "8px 15px",
          backgroundColor: "#3498db",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background-color 0.3s ease",
          zIndex: 1000,
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
      >
        Back to Dashboard
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#1e3a5f",
          borderRadius: "8px",
          color: "#ffffff",
        }}
      >
        <h1>Insurance Packages</h1>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Package ID</th>
            <th style={tableHeaderStyle}>Package Name</th>
            <th style={tableHeaderStyle}>Description</th>
            <th style={tableHeaderStyle}>Daily Cost</th>
          </tr>
        </thead>
        <tbody>
          {insurancePackages.map((pkg) => (
            <tr key={pkg.PackageID}>
              <td style={tableCellStyle}>{pkg.PackageID}</td>
              <td style={tableCellStyle}>{pkg.PackageName}</td>
              <td style={tableCellStyle}>{pkg.Description}</td>
              <td style={tableCellStyle}>${pkg.DailyCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: "#2c3e50",
  color: "#ffffff",
  padding: "15px",
  textAlign: "center",
  borderBottom: "2px solid #1e3a5f",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ecf0f1",
  color: "#2c3e50",
  textAlign: "center",
};

export default Packages;
