import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const Packages = () => {
  useAuthGuard("customer");

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
    <div style={{ padding: "0 50px" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Package ID</th>
            <th style={cellStyle}>Package Name</th>
            <th style={cellStyle}>Description</th>
            <th style={cellStyle}>Daily Cost</th>
          </tr>
        </thead>
        <tbody>
          {insurancePackages.map((res: any) => (
            <tr key={res.PackageID}>
              <td style={cellStyle}>{res.PackageID}</td>
              <td style={cellStyle}>{res.PackageName}</td>
              <td style={cellStyle}>{res.Description}</td>
              <td style={cellStyle}>${res.DailyCost}</td>
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

export default Packages;
