import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Clear any existing role when home page loads
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  }, []);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
