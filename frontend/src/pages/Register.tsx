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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.username}
            </div>
          )}
        </div>
        <br />
        <div>
          <label>Password </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.password}
            </div>
          )}
        </div>
        <br />
        <div>
          {" "}
          <label>First Name </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Last Name </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Email </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div style={{ color: "red", fontSize: "12px" }}>{errors.email}</div>
          )}
        </div>
        <br />
        <div>
          <label>Phone </label>
          <input
            type="text"
            name="phone"
            placeholder="5XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && (
            <div style={{ color: "red", fontSize: "12px" }}>{errors.phone}</div>
          )}
        </div>
        <br />
        <div>
          <label>Driver License No </label>
          <input
            type="text"
            name="driverLicenseNo"
            value={formData.driverLicenseNo}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Credit Card Number </label>
          <input
            type="text"
            name="creditCardNumber"
            placeholder="XXXX XXXX XXXX XXXX"
            value={formData.creditCardNumber}
            onChange={handleChange}
            maxLength={19}
            required
          />
          {errors.creditCardNumber && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.creditCardNumber}
            </div>
          )}
        </div>
        <br />
        <div>
          <label>Expiration Date </label>
          <input
            type="text"
            name="expDate"
            placeholder="MM/YY"
            value={formData.expDate}
            onChange={handleChange}
            required
          />
          {errors.expDate && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors.expDate}
            </div>
          )}
        </div>
        <br />
        <div>
          <label>CVV </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            required
          />
          {errors.cvv && (
            <div style={{ color: "red", fontSize: "12px" }}>{errors.cvv}</div>
          )}
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
