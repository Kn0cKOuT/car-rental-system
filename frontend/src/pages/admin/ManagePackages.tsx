import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const ManagePackages = () => {
  useAuthGuard("admin");

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
    <div style={{ padding: "0 50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Manage Packages</h1>
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
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
              maxWidth: "90%",
            }}
          >
            <h2>Add New Package</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
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
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
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
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
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
                  onClick={handleAddPackage}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Package ID</th>
            <th style={cellStyle}>Package Name</th>
            <th style={cellStyle}>Description</th>
            <th style={cellStyle}>Daily Cost</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {insurancePackages.map((res: any) => (
            <tr key={res.PackageID}>
              <td style={cellStyle}>{res.PackageID}</td>
              <td style={cellStyle}>{res.PackageName}</td>
              <td style={cellStyle}>{res.Description}</td>
              <td style={cellStyle}>${res.DailyCost}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleDelete(res.PackageID)}
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

export default ManagePackages;
