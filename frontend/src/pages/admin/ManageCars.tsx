import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

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

  const styles = {
    container: {
      padding: "20px 50px",
      backgroundColor: "#ecf0f1",
      minHeight: "100vh",
    } as React.CSSProperties,
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#1e3a5f",
      borderRadius: "8px",
      color: "#ffffff",
    } as React.CSSProperties,
    addButton: {
      padding: "10px 20px",
      backgroundColor: "#27ae60",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    } as React.CSSProperties,
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    tableHeader: {
      backgroundColor: "#2c3e50",
      color: "#ffffff",
      padding: "15px",
      textAlign: "center" as const,
      borderBottom: "2px solid #1e3a5f",
    } as React.CSSProperties,
    tableCell: {
      padding: "12px 15px",
      borderBottom: "1px solid #ecf0f1",
      color: "#2c3e50",
      textAlign: "center" as const,
    } as React.CSSProperties,
    tableRow: {
      "&:hover": {
        backgroundColor: "#f5f6f7",
      },
    } as React.CSSProperties,
    actionButton: {
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "8px",
      transition: "all 0.3s ease",
    } as React.CSSProperties,
    viewButton: {
      backgroundColor: "#3498db",
      color: "#ffffff",
    } as React.CSSProperties,
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "#ffffff",
    } as React.CSSProperties,
    modal: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    } as React.CSSProperties,
    modalContent: {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "8px",
      width: "80%",
      maxWidth: "1200px",
      maxHeight: "80vh",
      overflow: "auto",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    modalHeader: {
      color: "#1e3a5f",
      marginBottom: "20px",
    } as React.CSSProperties,
    inputGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px",
    } as React.CSSProperties,
    label: {
      width: "100px",
      textAlign: "right" as const,
      color: "#2c3e50",
    } as React.CSSProperties,
    input: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #7f8c8d",
      fontSize: "14px",
      flex: 1,
    } as React.CSSProperties,
    select: {
      padding: "8px 12px",
      borderRadius: "4px",
      border: "1px solid #7f8c8d",
      fontSize: "14px",
      flex: 1,
      backgroundColor: "#ffffff",
    } as React.CSSProperties,
    modalButtons: {
      display: "flex",
      gap: "10px",
      justifyContent: "flex-end",
      marginTop: "20px",
    } as React.CSSProperties,
    cancelButton: {
      padding: "8px 16px",
      backgroundColor: "#7f8c8d",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    } as React.CSSProperties,
    submitButton: {
      padding: "8px 16px",
      backgroundColor: "#27ae60",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.3s ease",
    } as React.CSSProperties,
    modalTable: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      tableLayout: "fixed" as const,
    } as React.CSSProperties,
    modalTableHeader: {
      backgroundColor: "#2c3e50",
      color: "#ffffff",
      padding: "12px",
      textAlign: "center" as const,
      borderBottom: "2px solid #1e3a5f",
      position: "sticky" as const,
      top: 0,
      zIndex: 1,
    } as React.CSSProperties,
    modalTableCell: {
      padding: "10px 12px",
      borderBottom: "1px solid #ecf0f1",
      color: "#2c3e50",
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center" as const,
    } as React.CSSProperties,
  };

  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Manage Cars</h1>
        <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>
          Add New Car
        </button>
      </div>

      <button
        onClick={() => navigate("/admin/AdminDashboard")}
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

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalHeader}>Add New Car</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div style={styles.inputGroup}>
                <label style={styles.label}>Brand:</label>
                <input
                  type="text"
                  value={newCar.Brand}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Brand: e.target.value }))
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Model:</label>
                <input
                  type="text"
                  value={newCar.Model}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Model: e.target.value }))
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Year:</label>
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
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Transmission:</label>
                <select
                  value={newCar.Transmission}
                  onChange={(e) =>
                    setNewCar((prev) => ({
                      ...prev,
                      Transmission: e.target.value,
                    }))
                  }
                  style={styles.select}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Fuel Type:</label>
                <select
                  value={newCar.Fuel}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Fuel: e.target.value }))
                  }
                  style={styles.select}
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Passengers:</label>
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
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Daily Rate:</label>
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
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Branch ID:</label>
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
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Status:</label>
                <select
                  value={newCar.Status}
                  onChange={(e) =>
                    setNewCar((prev) => ({ ...prev, Status: e.target.value }))
                  }
                  style={styles.select}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
              <div style={styles.modalButtons}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button onClick={handleAddCar} style={styles.submitButton}>
                  Add Car
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isReservationsModalOpen && selectedCar && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={styles.modalHeader}>
                Reservations for {selectedCar.Brand} {selectedCar.Model}
              </h2>
              <button
                onClick={() => setIsReservationsModalOpen(false)}
                style={{ ...styles.actionButton, ...styles.deleteButton }}
              >
                Close
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.modalTable}>
                <thead>
                  <tr>
                    <th style={{ ...styles.modalTableHeader, width: "15%" }}>
                      Reservation ID
                    </th>
                    <th style={{ ...styles.modalTableHeader, width: "15%" }}>
                      Customer ID
                    </th>
                    <th style={{ ...styles.modalTableHeader, width: "20%" }}>
                      Start Date
                    </th>
                    <th style={{ ...styles.modalTableHeader, width: "20%" }}>
                      End Date
                    </th>
                    <th style={{ ...styles.modalTableHeader, width: "15%" }}>
                      Pickup Branch
                    </th>
                    <th style={{ ...styles.modalTableHeader, width: "15%" }}>
                      Return Branch
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carReservations.map((reservation) => (
                    <tr key={reservation.ReservationID}>
                      <td style={styles.modalTableCell}>
                        {reservation.ReservationID}
                      </td>
                      <td style={styles.modalTableCell}>
                        {reservation.CustomerID}
                      </td>
                      <td style={styles.modalTableCell}>
                        {reservation.StartDate}
                      </td>
                      <td style={styles.modalTableCell}>
                        {reservation.EndDate}
                      </td>
                      <td style={styles.modalTableCell}>
                        {reservation.PickupBranchID}
                      </td>
                      <td style={styles.modalTableCell}>
                        {reservation.ReturnBranchID}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Car ID</th>
            <th style={styles.tableHeader}>Brand</th>
            <th style={styles.tableHeader}>Model</th>
            <th style={styles.tableHeader}>Year</th>
            <th style={styles.tableHeader}>Transmission</th>
            <th style={styles.tableHeader}>Fuel Type</th>
            <th style={styles.tableHeader}>Passengers</th>
            <th style={styles.tableHeader}>Daily Rate</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Branch (ID)</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.CarID} style={styles.tableRow}>
              <td style={styles.tableCell}>{car.CarID}</td>
              <td style={styles.tableCell}>{car.Brand}</td>
              <td style={styles.tableCell}>{car.Model}</td>
              <td style={styles.tableCell}>{car.Year}</td>
              <td style={styles.tableCell}>{car.Transmission}</td>
              <td style={styles.tableCell}>{car.Fuel}</td>
              <td style={styles.tableCell}>{car.Passengers}</td>
              <td style={styles.tableCell}>${car.DailyRate}</td>
              <td style={styles.tableCell}>
                <select
                  value={car.Status}
                  onChange={(e) =>
                    handleStatusChange(car.CarID, e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="not_available">Not Available</option>
                </select>
              </td>
              <td style={styles.tableCell}>
                {car.BranchName} ({car.BranchID})
              </td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleViewReservations(car)}
                  style={{ ...styles.actionButton, ...styles.viewButton }}
                >
                  View Reservations
                </button>
                <button
                  onClick={() => handleDelete(car.CarID)}
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
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

export default ManageCars;
