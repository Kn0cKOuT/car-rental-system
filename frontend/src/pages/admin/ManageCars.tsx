import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const ManageCars = () => {
  useAuthGuard("admin");

  type Car = {
    CarID: number;
    Brand: string;
    Model: string;
    Year: number | null;
    Transmission: string;
    Fuel: string;
    Passengers: number | null;
    DailyRate: number | null;
    Status: string;
    BranchID: number | null;
    BranchName: string;
  };

  type Reservation = {
    ReservationID: number;
    CustomerID: number;
    StartDate: string;
    EndDate: string;
    PickupBranchID: number;
    ReturnBranchID: number;
  };

  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carReservations, setCarReservations] = useState<Reservation[]>([]);

  const [newCar, setNewCar] = useState<Omit<Car, "CarID">>({
    Brand: "",
    Model: "",
    Year: null,
    Transmission: "Automatic",
    Fuel: "Gasoline",
    Passengers: null,
    DailyRate: null,
    Status: "available",
    BranchID: null,
    BranchName: "",
  });

  const fetchCars = async () => {
    try {
      const response = await api.get("/api/admin/cars");
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchCarReservations = async (carId: number) => {
    try {
      const response = await api.get(`/api/admin/cars/${carId}/reservations`);
      setCarReservations(response.data);
    } catch (err) {
      console.error("Error fetching car reservations:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleViewReservations = async (car: Car) => {
    setSelectedCar(car);
    await fetchCarReservations(car.CarID);
    setIsReservationsModalOpen(true);
  };

  const handleDelete = async (carId: number) => {
    const confirm = window.confirm(
      `Are you sure you want to delete car ID ${carId}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/admin/cars/${carId}`);
      setCars((prev) => prev.filter((car) => car.CarID !== carId));
      alert("Car deleted successfully.");
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Failed to delete car.");
    }
  };

  const handleStatusChange = async (carId: number, newStatus: string) => {
    try {
      await api.put(`/api/admin/cars/${carId}/status`, { status: newStatus });
      setCars((prev) =>
        prev.map((car) =>
          car.CarID === carId ? { ...car, Status: newStatus } : car
        )
      );
      alert("Status updated.");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleAddCar = async () => {
    try {
      if (
        !newCar.Brand ||
        !newCar.Model ||
        !newCar.Year ||
        !newCar.BranchID ||
        !newCar.Transmission ||
        !newCar.Fuel ||
        !newCar.Passengers ||
        !newCar.DailyRate ||
        !newCar.Status
      ) {
        alert("Please fill in all required fields");
        return;
      }

      if (
        isNaN(newCar.Year) ||
        isNaN(newCar.Passengers) ||
        isNaN(newCar.DailyRate) ||
        isNaN(newCar.BranchID)
      ) {
        alert(
          "Please enter valid numbers for Year, Passengers, Daily Rate, and Branch ID"
        );
        return;
      }

      const carData = {
        brand: newCar.Brand,
        model: newCar.Model,
        year: Number(newCar.Year),
        transmission: newCar.Transmission,
        fuel: newCar.Fuel,
        passengers: Number(newCar.Passengers),
        dailyRate: Number(newCar.DailyRate),
        status: newCar.Status,
        branchId: Number(newCar.BranchID),
      };

      await api.post("/api/admin/cars", carData);
      await fetchCars();
      setIsModalOpen(false);
      setNewCar({
        Brand: "",
        Model: "",
        Year: null,
        Transmission: "Automatic",
        Fuel: "Gasoline",
        Passengers: null,
        DailyRate: null,
        Status: "available",
        BranchID: null,
        BranchName: "",
      });
      alert("Car added successfully!");
    } catch (err: any) {
      console.error("Error adding car:", err);
      alert(err.response?.data?.message || err.message || "Failed to add car.");
    }
  };

  return (
    <div style={{ padding: "0 50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Manage Cars</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add New Car
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
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h2>Add New Car</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Brand:
                </label>
                <input
                  type="text"
                  value={newCar.Brand}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Brand: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Model:
                </label>
                <input
                  type="text"
                  value={newCar.Model}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Model: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Year:
                </label>
                <input
                  type="number"
                  value={newCar.Year ?? ""}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      Year: parseInt(e.target.value)
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Transmission:
                </label>
                <select
                  value={newCar.Transmission}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      Transmission: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Fuel Type:
                </label>
                <select
                  value={newCar.Fuel}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Fuel: e.target.value }))
                  }
                  style={inputStyle}
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Passengers:
                </label>
                <input
                  type="number"
                  value={newCar.Passengers ?? ""}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      Passengers: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Daily Rate:
                </label>
                <input
                  type="number"
                  value={newCar.DailyRate ?? ""}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      DailyRate: parseFloat(e.target.value)
                        ? parseFloat(e.target.value)
                        : null,
                    }))
                  }
                  style={inputStyle}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Branch ID:
                </label>
                <input
                  type="number"
                  value={newCar.BranchID ?? ""}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      BranchID: parseInt(e.target.value)
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  style={inputStyle}
                />
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
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCar}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add Car
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReservationsModalOpen && selectedCar && (
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
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "1000px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>
                Reservations for {selectedCar.Brand} {selectedCar.Model}
              </h2>
              <button
                onClick={() => setIsReservationsModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#9beeff" }}>
                  <th style={cellStyle}>Reservation ID</th>
                  <th style={cellStyle}>Customer ID</th>
                  <th style={cellStyle}>Start Date</th>
                  <th style={cellStyle}>End Date</th>
                  <th style={cellStyle}>Pickup Branch ID</th>
                  <th style={cellStyle}>Return Branch ID</th>
                </tr>
              </thead>
              <tbody>
                {carReservations.map((reservation) => (
                  <tr key={reservation.ReservationID}>
                    <td style={cellStyle}>{reservation.ReservationID}</td>
                    <td style={cellStyle}>{reservation.CustomerID}</td>
                    <td style={cellStyle}>{reservation.StartDate}</td>
                    <td style={cellStyle}>{reservation.EndDate}</td>
                    <td style={cellStyle}>{reservation.PickupBranchID}</td>
                    <td style={cellStyle}>{reservation.ReturnBranchID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Car ID</th>
            <th style={cellStyle}>Brand</th>
            <th style={cellStyle}>Model</th>
            <th style={cellStyle}>Year</th>
            <th style={cellStyle}>Transmission</th>
            <th style={cellStyle}>Fuel Type</th>
            <th style={cellStyle}>Passengers</th>
            <th style={cellStyle}>Daily Rate</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}>Branch (ID)</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {cars.map((res: any) => (
            <tr key={res.CarID}>
              <td style={cellStyle}>{res.CarID}</td>
              <td style={cellStyle}>{res.Brand}</td>
              <td style={cellStyle}>{res.Model}</td>
              <td style={cellStyle}>{res.Year}</td>
              <td style={cellStyle}>{res.Transmission}</td>
              <td style={cellStyle}>{res.Fuel}</td>
              <td style={cellStyle}>{res.Passengers}</td>
              <td style={cellStyle}>${res.DailyRate}</td>
              <td style={cellStyle}>
                <select
                  value={res.Status}
                  onChange={(e) =>
                    handleStatusChange(res.CarID, e.target.value)
                  }
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="not_available">Not Available</option>
                </select>
              </td>
              <td style={cellStyle}>
                {res.BranchName} ({res.BranchID})
              </td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleViewReservations(res)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  View Reservations
                </button>
                <button
                  onClick={() => handleDelete(res.CarID)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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

const cellStyle: React.CSSProperties = {
  padding: "10px",
  border: "1px solid black",
};

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export default ManageCars;
