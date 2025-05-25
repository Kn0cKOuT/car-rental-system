import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import DefaultNavbar from "./components/layout/DefaultNavbar";
import AdminNavbar from "./pages/admin/AdminNavbar";
import CustomerNavbar from "./pages/customer/CustomerNavbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import NoPermission from "./pages/NoPermission";
import ManageCars from "./pages/admin/ManageCars";
import ManageBranches from "./pages/admin/ManageBranches";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageReservations from "./pages/admin/ManageReservations";
import ManagePackages from "./pages/admin/ManagePackages";
import Cars from "./pages/customer/Cars";
import Reservations from "./pages/customer/Reservations";
import Branches from "./pages/customer/Branches";
import Packages from "./pages/customer/Packages";
import "./App.css";

function NavbarWrapper() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const location = useLocation();

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Show DefaultNavbar on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return <DefaultNavbar />;
  }

  return (
    <>
      {role === "admin" && <AdminNavbar />}
      {role === "customer" && <CustomerNavbar />}
      {!role && <DefaultNavbar />}
    </>
  );
}

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
          <Route
            path="/customer/CustomerDashboard"
            element={<CustomerDashboard />}
          />
          <Route path="/NoPermission" element={<NoPermission />} />
          <Route path="/admin/ManageCars" element={<ManageCars />} />
          <Route path="/admin/ManageBranches" element={<ManageBranches />} />
          <Route path="/admin/ManageCustomers" element={<ManageCustomers />} />
          <Route
            path="/admin/ManageReservations"
            element={<ManageReservations />}
          />
          <Route path="/admin/ManagePackages" element={<ManagePackages />} />
          <Route path="/customer/Cars" element={<Cars />} />
          <Route path="/customer/Reservations" element={<Reservations />} />
          <Route path="/customer/Branches" element={<Branches />} />
          <Route path="/customer/Packages" element={<Packages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
