import React from "react";
import useAuthGuard from "../hooks/authGuard";

const CustomerDashboard = () => {
  useAuthGuard("customer");

  return (
    <div>
      <h2>Customer Dashboard</h2>
    </div>
  );
};

export default CustomerDashboard;
