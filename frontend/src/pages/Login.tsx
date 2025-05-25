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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ecf0f1",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#1e3a5f",
          }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "0",
                border: "none",
                borderBottom: "2px solid #7f8c8d",
                padding: "0 15px",
                fontSize: "16px",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                outline: "none",
                color: "#2c3e50",
              }}
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "0",
                border: "none",
                borderBottom: "2px solid #7f8c8d",
                padding: "0 15px",
                fontSize: "16px",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                outline: "none",
                color: "#2c3e50",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              height: "50px",
              backgroundColor: "#1e3a5f",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3498db")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#1e3a5f")
            }
          >
            Login
          </button>
          {error && (
            <div
              style={{
                color: "#e74c3c",
                marginTop: "15px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#2c3e50",
          }}
        >
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{
              color: "#3498db",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
