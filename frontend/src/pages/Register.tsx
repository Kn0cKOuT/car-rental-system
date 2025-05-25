import React, { useState } from "react";
import { authAPI } from "../config/api";

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
      tempErrors.cvv = "CVV must be 3 or 4 digits";
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
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
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
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1e3a5f",
            marginBottom: "30px",
            fontSize: "2.5rem",
          }}
        >
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "30px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.username && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.username}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.password && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.password}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.email && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.phone && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.phone}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.creditCardNumber && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.creditCardNumber}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.expDate && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.expDate}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  color: "#7f8c8d",
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
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
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #7f8c8d",
                  fontSize: "16px",
                  color: "#2c3e50",
                }}
              />
              {errors.cvv && (
                <div
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  {errors.cvv}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button
              type="submit"
              style={{
                padding: "15px 30px",
                fontSize: "1.1rem",
                backgroundColor: "#1e3a5f",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
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
      </div>
    </div>
  );
};

export default Register;
