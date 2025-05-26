import React, { useState } from "react";
import { authAPI } from "../config/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    driverLicenseNo: "",
    creditCardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    creditCardNumber: "",
    expDate: "",
    cvv: "",
  });

  const navigate = useNavigate();

  const checkUsernameAvailability = async (username: string) => {
    if (!username) return false;

    try {
      const res = await authAPI.checkUsername(username);
      return res.data.available;
    } catch (err: any) {
      console.error("Username check error:", err);
      return false;
    }
  };

  const formatCreditCard = (value: string) => {
    const noSpaces = value.replace(/\s/g, "");

    const chunks = noSpaces.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const formatPhoneNumber = (value: string) => {
    const noSpaces = value.replace(/\s/g, "");
    return noSpaces.slice(0, 10);
  };

  const formatExpDate = (value: string) => {
    const cleanValue = value.replace("/", "");
    const limitedValue = cleanValue.slice(0, 4);

    if (limitedValue.length <= 2) {
      return limitedValue;
    } else {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
    }
  };

  const formatCVV = (value: string) => {
    return value.slice(0, 3);
  };

  const validateForm = () => {
    let tempErrors = {
      username: "",
      password: "",
      email: "",
      phone: "",
      creditCardNumber: "",
      expDate: "",
      cvv: "",
    };
    let isValid = true;

    if (errors.username) {
      tempErrors.username = errors.username;
      isValid = false;
    }

    if (formData.password && formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (
      formData.creditCardNumber &&
      !/^\d{16}$/.test(formData.creditCardNumber.replace(/\s/g, ""))
    ) {
      tempErrors.creditCardNumber = "Credit card number must be 16 digits";
      isValid = false;
    }

    if (
      formData.expDate &&
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate)
    ) {
      tempErrors.expDate = "Expiration date must be in MM/YY format";
      isValid = false;
    }

    if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
      tempErrors.cvv = "CVV must be 3 digits";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "creditCardNumber") {
      const formattedValue = formatCreditCard(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "phone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "expDate") {
      const formattedValue = formatExpDate(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "cvv") {
      const formattedValue = formatCVV(value);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const isUsernameAvailable = await checkUsernameAvailability(
        formData.username
      );

      if (!isUsernameAvailable) {
        setErrors((prev) => ({ ...prev, username: "Username already taken" }));
        return;
      }

      try {
        const response = await authAPI.registerCustomer(formData);
        console.log("Registration successful:", response);
        alert("Registration successful");
        navigate("/login");
      } catch (error: any) {
        const raw = error.response?.data?.error;
        const message = typeof raw === "string" ? raw : JSON.stringify(raw);
        alert(message);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ecf0f1",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "8px 15px",
          backgroundColor: "#1e3a5f",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#152a45")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1e3a5f")}
      >
        Back to Home
      </button>
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1e3a5f",
            marginBottom: "20px",
            fontSize: "2rem",
          }}
        >
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
              marginBottom: "20px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.username && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.username}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.password && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.email && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="5XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.phone && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.phone}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Driver License No
              </label>
              <input
                type="text"
                name="driverLicenseNo"
                value={formData.driverLicenseNo}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Credit Card Number
              </label>
              <input
                type="text"
                name="creditCardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                value={formData.creditCardNumber}
                onChange={handleChange}
                maxLength={19}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.creditCardNumber && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.creditCardNumber}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Expiration Date
              </label>
              <input
                type="text"
                name="expDate"
                placeholder="MM/YY"
                value={formData.expDate}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.expDate && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.expDate}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #7f8c8d",
                  fontSize: "14px",
                  color: "#2c3e50",
                }}
              />
              {errors.cvv && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {errors.cvv}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              type="submit"
              style={{
                padding: "10px 25px",
                fontSize: "1rem",
                backgroundColor: "#1e3a5f",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#152a45")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e3a5f")
              }
            >
              Register
            </button>
          </div>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#2c3e50",
          }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{
              color: "#3498db",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
