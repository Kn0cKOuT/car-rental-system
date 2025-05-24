import React from "react";
import { Link } from "react-router-dom";

const NoPermission = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1 style={{ color: "red" }}>🚫 Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <p>Please check your credentials and try again.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NoPermission;
