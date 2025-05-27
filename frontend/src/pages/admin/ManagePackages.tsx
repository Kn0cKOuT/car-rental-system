import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const ManagePackages = () => {
  useAuthGuard("admin");
  const navigate = useNavigate();

  type Package = {
    PackageID: number;
    PackageName: string;
    Description: string;
    DailyCost: number | null;
  };

  const [insurancePackages, setPackages] = useState<Package[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPackage, setNewPackage] = useState<Omit<Package, "PackageID">>({
    PackageName: "",
    Description: "",
    DailyCost: null,
  });

  const fetchPackages = async () => {
    try {
      const response = await api.get("/api/admin/packages");
      setPackages(response.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (insurancePackageId: number) => {
    const confirm = window.confirm(
      `Are you sure you want to delete package ID ${insurancePackageId}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/admin/packages/${insurancePackageId}`);
      setPackages((prev) =>
        prev.filter(
          (insurancePackage) =>
            insurancePackage.PackageID !== insurancePackageId
        )
      );
      alert("Package deleted successfully.");
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Failed to delete package.");
    }
  };

  const handleAddPackage = async () => {
    try {
      if (
        !newPackage.PackageName ||
        !newPackage.Description ||
        !newPackage.DailyCost
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const packageData = {
        packageName: newPackage.PackageName,
        description: newPackage.Description,
        dailyCost: newPackage.DailyCost,
      };

      await api.post("/api/admin/packages", packageData);
      await fetchPackages();
      setIsModalOpen(false);
      setNewPackage({
        PackageName: "",
        Description: "",
        DailyCost: null,
      });
      alert("Package added successfully!");
    } catch (err: any) {
      console.error("Error adding package:", err);
      alert(
        err.response?.data?.message || err.message || "Failed to add package."
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
        <h1>Manage Packages</h1>
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
          Add New Package
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
              width: "500px",
              maxWidth: "90%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#1e3a5f", marginBottom: "20px" }}>
              Add New Package
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
                  Package Name:
                </label>
                <input
                  type="text"
                  value={newPackage.PackageName}
                  onChange={(e) =>
                    setNewPackage((prev) => ({
                      ...prev,
                      PackageName: e.target.value,
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
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Description:
                </label>
                <input
                  type="text"
                  value={newPackage.Description}
                  onChange={(e) =>
                    setNewPackage((prev) => ({
                      ...prev,
                      Description: e.target.value,
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
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Daily Cost:
                </label>
                <input
                  type="number"
                  value={newPackage.DailyCost ?? ""}
                  onChange={(e) =>
                    setNewPackage((prev) => ({
                      ...prev,
                      DailyCost: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
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
                  onClick={handleAddPackage}
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
                  Add Package
                </button>
              </div>
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
              Package ID
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
              Package Name
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
              Description
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
              Daily Cost
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
          {insurancePackages.map((res: any) => (
            <tr key={res.PackageID}>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.PackageID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.PackageName}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Description}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                ₺{res.DailyCost}
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
                  onClick={() => handleDelete(res.PackageID)}
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

export default ManagePackages;
