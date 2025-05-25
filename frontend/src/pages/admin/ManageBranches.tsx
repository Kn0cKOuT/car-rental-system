import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const ManageBranches = () => {
  useAuthGuard("admin");

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCarsModalOpen, setIsCarsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchCars, setBranchCars] = useState<Car[]>([]);
  const [newBranch, setNewBranch] = useState<Omit<Branch, "BranchID">>({
    Name: "",
    Phone: "",
    Address: "",
  });

  const fetchBranches = async () => {
    try {
      const response = await api.get("/api/admin/branches");
      setBranches(response.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const fetchBranchCars = async (branchId: number) => {
    try {
      const response = await api.get(`/api/admin/branches/${branchId}/cars`);
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

  const handleDelete = async (branchId: number) => {
    const confirm = window.confirm(
      `Are you sure you want to delete branch ID ${branchId}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/admin/branches/${branchId}`);
      setBranches((prev) =>
        prev.filter((branch) => branch.BranchID !== branchId)
      );
      alert("Branch deleted successfully.");
    } catch (err) {
      console.error("Error deleting branch:", err);
      alert("Failed to delete branch.");
    }
  };

  const handleStatusChange = async (branchId: number, newStatus: string) => {
    try {
      await api.put(`/api/admin/branches/${branchId}/status`, {
        status: newStatus,
      });
      setBranches((prev) =>
        prev.map((branch) =>
          branch.BranchID === branchId
            ? { ...branch, Status: newStatus }
            : branch
        )
      );
      alert("Status updated.");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleAddBranch = async () => {
    try {
      if (!newBranch.Name || !newBranch.Phone || !newBranch.Address) {
        alert("Please fill in all required fields");
        return;
      }

      const branchData = {
        name: newBranch.Name,
        phone: newBranch.Phone,
        address: newBranch.Address,
      };

      await api.post("/api/admin/branches", branchData);
      await fetchBranches();
      setIsModalOpen(false);
      setNewBranch({
        Name: "",
        Phone: "",
        Address: "",
      });
      alert("Branch added successfully!");
    } catch (err: any) {
      console.error("Error adding branch:", err);
      alert(
        err.response?.data?.message || err.message || "Failed to add branch."
      );
    }
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
        <h1>Manage Branches</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add New Branch
        </button>
      </div>

      {isModalOpen && (
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
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h2>Add New Branch</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Name:
                </label>
                <input
                  type="text"
                  value={newBranch.Name}
                  onChange={(e) =>
                    setNewBranch((prev) => ({ ...prev, Name: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Phone:
                </label>
                <input
                  type="text"
                  value={newBranch.Phone}
                  onChange={(e) =>
                    setNewBranch((prev) => ({ ...prev, Phone: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Address:
                </label>
                <input
                  type="text"
                  value={newBranch.Address}
                  onChange={(e) =>
                    setNewBranch((prev) => ({
                      ...prev,
                      Address: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBranch}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add Branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <button
                  onClick={() => handleDelete(res.BranchID)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
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

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export default ManageBranches;
