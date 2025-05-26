import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const Reservations = () => {
  useAuthGuard("customer");
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  type Car = {
    CarID: number;
    Brand: string;
    Model: string;
    DailyRate: number;
    BranchID: number;
    Status: string;
  };

  type Branch = {
    BranchID: number;
    Name: string;
  };

  type Package = {
    PackageID: number;
    Name: string;
    DailyCost: number;
  };

  type Reservation = {
    ReservationID: number;
    CarID: number;
    Brand: string;
    Model: string;
    StartDate: string;
    EndDate: string;
    PickupBranchID: number;
    PickupBranchName: string;
    ReturnBranchID: number;
    ReturnBranchName: string;
    PackageID: number;
    TotalDays: number;
    Cost: number;
  };

  const [newReservation, setNewReservation] = useState({
    carId: "",
    startDate: "",
    endDate: "",
    pickupBranchId: "",
    returnBranchId: "",
    packageId: "",
  });

  const fetchReservations = async () => {
    try {
      const response = await api.get("/api/customer/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
    const fetchCars = async () => {
      try {
        const response = await api.get("/api/customer/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await api.get("/api/customer/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    const fetchPackages = async () => {
      try {
        const response = await api.get("/api/customer/packages");
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchCars();
    fetchBranches();
    fetchPackages();
  }, []);

  const handleDelete = async (reservationId: number) => {
    const confirm = window.confirm(
      `Are you sure you want to delete reservation ID ${reservationId}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/customer/reservations/${reservationId}`);
      setReservations((prev) =>
        prev.filter(
          (reservation) => reservation.ReservationID !== reservationId
        )
      );
      alert("Reservation deleted successfully.");
    } catch (err) {
      console.error("Error deleting reservation:", err);
      alert("Failed to delete reservation.");
    }
  };

  const handleCarSelect = (carId: string) => {
    const selectedCar = cars.find((car) => car.CarID === parseInt(carId));
    setNewReservation((prev) => ({
      ...prev,
      carId: carId,
      pickupBranchId: selectedCar ? selectedCar.BranchID.toString() : "",
    }));
  };

  const handleAddReservation = async () => {
    try {
      if (
        !newReservation.carId ||
        !newReservation.startDate ||
        !newReservation.endDate ||
        !newReservation.returnBranchId ||
        !newReservation.packageId
      ) {
        alert("Please fill in all required fields");
        return;
      }

      const reservationData = {
        carId: parseInt(newReservation.carId),
        startDate: newReservation.startDate,
        endDate: newReservation.endDate,
        pickupBranchId: parseInt(newReservation.pickupBranchId),
        returnBranchId: parseInt(newReservation.returnBranchId),
        packageId: parseInt(newReservation.packageId),
      };

      await api.post("/api/customer/reserve", reservationData);
      await fetchReservations();

      setIsModalOpen(false);
      setNewReservation({
        carId: "",
        startDate: "",
        endDate: "",
        pickupBranchId: "",
        returnBranchId: "",
        packageId: "",
      });
      alert("Reservation added successfully!");
    } catch (err: any) {
      console.error("Error adding reservation:", err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to add reservation."
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px 50px",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => navigate("/customer/CustomerDashboard")}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          padding: "8px 15px",
          backgroundColor: "#3498db",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          transition: "background-color 0.3s ease",
          zIndex: 1000,
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
      >
        Back to Dashboard
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#1e3a5f",
          borderRadius: "8px",
          color: "#ffffff",
        }}
      >
        <h1>Reservations</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#219a52")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#27ae60")
          }
        >
          Add New Reservation
        </button>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ color: "#1e3a5f", marginBottom: "20px" }}>
              Add New Reservation
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Car:
                </label>
                <select
                  value={newReservation.carId}
                  onChange={(e) => handleCarSelect(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select a car</option>
                  {cars
                    .filter((car) => car.Status === "available")
                    .map((car) => (
                      <option key={car.CarID} value={car.CarID}>
                        {car.Brand} {car.Model} - ${car.DailyRate}/day
                      </option>
                    ))}
                </select>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  value={newReservation.startDate}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  End Date:
                </label>
                <input
                  type="date"
                  value={newReservation.endDate}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Pickup Branch:
                </label>
                <input
                  type="text"
                  value={
                    branches.find(
                      (b) =>
                        b.BranchID === parseInt(newReservation.pickupBranchId)
                    )?.Name || "Select a car first"
                  }
                  disabled
                  style={{ ...inputStyle, backgroundColor: "#f5f5f5" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Return Branch:
                </label>
                <select
                  value={newReservation.returnBranchId}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      returnBranchId: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">Select return branch</option>
                  {branches.map((branch) => (
                    <option key={branch.BranchID} value={branch.BranchID}>
                      {branch.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label
                  style={{
                    width: "100px",
                    textAlign: "right",
                    color: "#2c3e50",
                  }}
                >
                  Package:
                </label>
                <select
                  value={newReservation.packageId}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      packageId: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.PackageID} value={pkg.PackageID}>
                      {pkg.Name} - ${pkg.DailyCost}/day
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c0392b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e74c3c")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReservation}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#219a52")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#27ae60")
                  }
                >
                  Add Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Reservation ID</th>
            <th style={tableHeaderStyle}>Brand</th>
            <th style={tableHeaderStyle}>Model</th>
            <th style={tableHeaderStyle}>Start Date</th>
            <th style={tableHeaderStyle}>End Date</th>
            <th style={tableHeaderStyle}>Pickup Branch</th>
            <th style={tableHeaderStyle}>Return Branch</th>
            <th style={tableHeaderStyle}>Package ID</th>
            <th style={tableHeaderStyle}>Total Days</th>
            <th style={tableHeaderStyle}>Cost</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.ReservationID}>
              <td style={tableCellStyle}>{reservation.ReservationID}</td>
              <td style={tableCellStyle}>{reservation.Brand}</td>
              <td style={tableCellStyle}>{reservation.Model}</td>
              <td style={tableCellStyle}>{reservation.StartDate}</td>
              <td style={tableCellStyle}>{reservation.EndDate}</td>
              <td style={tableCellStyle}>{reservation.PickupBranchName}</td>
              <td style={tableCellStyle}>{reservation.ReturnBranchName}</td>
              <td style={tableCellStyle}>{reservation.PackageID}</td>
              <td style={tableCellStyle}>{reservation.TotalDays}</td>
              <td style={tableCellStyle}>${reservation.Cost}</td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleDelete(reservation.ReservationID)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c0392b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e74c3c")
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: "#2c3e50",
  color: "#ffffff",
  padding: "15px",
  textAlign: "center",
  borderBottom: "2px solid #1e3a5f",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ecf0f1",
  color: "#2c3e50",
  textAlign: "center",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #7f8c8d",
  fontSize: "14px",
  width: "200px",
  color: "#2c3e50",
  backgroundColor: "#ffffff",
};

export default Reservations;
