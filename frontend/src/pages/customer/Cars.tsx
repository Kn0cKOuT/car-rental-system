import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const Cars = () => {
  useAuthGuard("customer");
  const navigate = useNavigate();

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
    StartDate?: string;
    EndDate?: string;
  };

  // Bir müşteri bir arabayı bir rezervasyondan sonra kiralamak isterse o rezervasyonun bitşindeki şubeden almak zorunda!!!
  type Reservation = {
    StartDate: string;
    EndDate: string;
  };

  const [cars, setCars] = useState<Car[]>([]);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carReservations, setCarReservations] = useState<Reservation[]>([]);

  const fetchCars = async () => {
    try {
      const response = await api.get("/api/customer/cars");
      setCars(response.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchCarReservations = async (carId: number) => {
    try {
      const response = await api.get(
        `/api/customer/cars/${carId}/reservations`
      );
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
        <h1>Cars</h1>
      </div>

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
              padding: "30px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "1200px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
              <h2 style={{ color: "#1e3a5f" }}>
                Reservations for {selectedCar.Brand} {selectedCar.Model}
              </h2>
              <button
                onClick={() => setIsReservationsModalOpen(false)}
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
                Close
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
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
                    <th style={tableHeaderStyle}>Start Date</th>
                    <th style={tableHeaderStyle}>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {carReservations.map((reservation) => (
                    <tr key={reservation.StartDate}>
                      <td style={tableCellStyle}>{reservation.StartDate}</td>
                      <td style={tableCellStyle}>{reservation.EndDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <th style={tableHeaderStyle}>Brand</th>
            <th style={tableHeaderStyle}>Model</th>
            <th style={tableHeaderStyle}>Year</th>
            <th style={tableHeaderStyle}>Transmission</th>
            <th style={tableHeaderStyle}>Fuel Type</th>
            <th style={tableHeaderStyle}>Passengers</th>
            <th style={tableHeaderStyle}>Daily Rate</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Branch (ID)</th>
            <th style={tableHeaderStyle}>Reservations</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.CarID}>
              <td style={tableCellStyle}>{car.Brand}</td>
              <td style={tableCellStyle}>{car.Model}</td>
              <td style={tableCellStyle}>{car.Year}</td>
              <td style={tableCellStyle}>{car.Transmission}</td>
              <td style={tableCellStyle}>{car.Fuel}</td>
              <td style={tableCellStyle}>{car.Passengers}</td>
              <td style={tableCellStyle}>${car.DailyRate}</td>
              <td style={tableCellStyle}>{car.Status}</td>
              <td style={tableCellStyle}>
                {car.BranchName} ({car.BranchID})
              </td>
              <td style={tableCellStyle}>
                <button
                  onClick={() => handleViewReservations(car)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2980b9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3498db")
                  }
                >
                  View Reservations
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

export default Cars;
