import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../config/api";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CustomerDashboard from "../pages/customer/CustomerDashboard";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authAPI.login(credentials);

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      window.dispatchEvent(new Event("storage"));

      if (role === "admin") {
        navigate("/admin/AdminDashboard");
      } else {
        navigate("/customer/CustomerDashboard");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Login failed";
      setError(msg);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Password </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <button type="submit">Login</button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </form>
    </div>
  );
};

export default Login;
