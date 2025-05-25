import React from "react";
import useAuthGuard from "../../hooks/authGuard";

const AdminDashboard = () => {
  useAuthGuard("admin");

  return (
    <div>
      <h2>Admin Dashboard</h2>
    </div>
  );
};

export default AdminDashboard;
