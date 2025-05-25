import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const Branches = () => {
  useAuthGuard("customer");

  type Branch = {
    BranchID: number;
    Name: string;
    Phone: string;
    Address: string;
  };

  type Car = {
    CarID: number;
    Brand: string;
    Model: string;
    Year: number;
    Transmission: string;
    Fuel: string;
    Passengers: number;
    DailyRate: number;
    Status: string;
  };

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isCarsModalOpen, setIsCarsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchCars, setBranchCars] = useState<Car[]>([]);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/api/customer/branches");
      setBranches(response.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchBranchCars = async (branchId: number) => {
    try {
      const response = await api.get(`/api/customer/branches/${branchId}/cars`);
      setBranchCars(response.data);
    } catch (err) {
      console.error("Error fetching branch cars:", err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleViewCars = async (branch: Branch) => {
    setSelectedBranch(branch);
    await fetchBranchCars(branch.BranchID);
    setIsCarsModalOpen(true);
  };

  return (
    <div style={{ padding: "0 50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Branches</h1>
      </div>

      {isCarsModalOpen && selectedBranch && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "1000px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>Cars at {selectedBranch.Name}</h2>
              <button
                onClick={() => setIsCarsModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#9beeff" }}>
                  <th style={cellStyle}>Car ID</th>
                  <th style={cellStyle}>Brand</th>
                  <th style={cellStyle}>Model</th>
                  <th style={cellStyle}>Year</th>
                  <th style={cellStyle}>Transmission</th>
                  <th style={cellStyle}>Fuel</th>
                  <th style={cellStyle}>Passengers</th>
                  <th style={cellStyle}>Daily Rate</th>
                  <th style={cellStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {branchCars.map((car) => (
                  <tr key={car.CarID}>
                    <td style={cellStyle}>{car.CarID}</td>
                    <td style={cellStyle}>{car.Brand}</td>
                    <td style={cellStyle}>{car.Model}</td>
                    <td style={cellStyle}>{car.Year}</td>
                    <td style={cellStyle}>{car.Transmission}</td>
                    <td style={cellStyle}>{car.Fuel}</td>
                    <td style={cellStyle}>{car.Passengers}</td>
                    <td style={cellStyle}>${car.DailyRate}</td>
                    <td style={cellStyle}>{car.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Branch ID</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Phone</th>
            <th style={cellStyle}>Address</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {branches.map((res: any) => (
            <tr key={res.BranchID}>
              <td style={cellStyle}>{res.BranchID}</td>
              <td style={cellStyle}>{res.Name}</td>
              <td style={cellStyle}>{res.Phone}</td>
              <td style={cellStyle}>{res.Address}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleViewCars(res)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  View Cars
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "10px",
  border: "1px solid black",
};

export default Branches;
