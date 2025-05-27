import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const ManageBranches = () => {
  useAuthGuard("admin");
  const navigate = useNavigate();

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
    <div
      style={{
        padding: "20px 50px",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/admin/AdminDashboard")}
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
        <h1>Manage Branches</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
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
              padding: "30px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#1e3a5f", marginBottom: "20px" }}>
              Add New Branch
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Name:
                </label>
                <input
                  type="text"
                  value={newBranch.Name}
                  onChange={(e) =>
                    setNewBranch((prev) => ({ ...prev, Name: e.target.value }))
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #7f8c8d",
                    fontSize: "14px",
                    flex: 1,
                  }}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Phone:
                </label>
                <input
                  type="text"
                  value={newBranch.Phone}
                  onChange={(e) =>
                    setNewBranch((prev) => ({ ...prev, Phone: e.target.value }))
                  }
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #7f8c8d",
                    fontSize: "14px",
                    flex: 1,
                  }}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
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
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #7f8c8d",
                    fontSize: "14px",
                    flex: 1,
                  }}
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
                    backgroundColor: "#7f8c8d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBranch}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
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
              padding: "30px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "1200px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
              <h2 style={{ color: "#1e3a5f" }}>
                Cars at {selectedBranch.Name}
              </h2>
              <button
                onClick={() => setIsCarsModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
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
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Car ID
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Brand
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Model
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Year
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Transmission
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Fuel
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Passengers
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Daily Rate
                    </th>
                    <th
                      style={{
                        backgroundColor: "#2c3e50",
                        color: "#ffffff",
                        padding: "15px",
                        textAlign: "center",
                        borderBottom: "2px solid #1e3a5f",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branchCars.map((car) => (
                    <tr key={car.CarID}>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.CarID}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Brand}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Model}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Year}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Transmission}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Fuel}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Passengers}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        ₺{car.DailyRate}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {car.Status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Branch ID
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Name
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Phone
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Address
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {branches.map((res: any) => (
            <tr key={res.BranchID}>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.BranchID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Name}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Phone}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Address}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => handleViewCars(res)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  View Cars
                </button>
                <button
                  onClick={() => handleDelete(res.BranchID)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
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

export default ManageBranches;
