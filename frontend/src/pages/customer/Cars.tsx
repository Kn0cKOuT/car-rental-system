import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const Cars = () => {
  useAuthGuard("customer");

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
    <div style={{ padding: "0 50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
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
                  <th style={cellStyle}>Start Date</th>
                  <th style={cellStyle}>End Date</th>
                </tr>
              </thead>
              <tbody>
                {carReservations.map((reservation) => (
                  <tr key={reservation.StartDate}>
                    <td style={cellStyle}>{reservation.StartDate}</td>
                    <td style={cellStyle}>{reservation.EndDate}</td>
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
            <th style={cellStyle}>Brand</th>
            <th style={cellStyle}>Model</th>
            <th style={cellStyle}>Year</th>
            <th style={cellStyle}>Transmission</th>
            <th style={cellStyle}>Fuel Type</th>
            <th style={cellStyle}>Passengers</th>
            <th style={cellStyle}>Daily Rate</th>
            <th style={cellStyle}>Status</th>
            <th style={cellStyle}>Branch (ID)</th>
            <th style={cellStyle}>Reservations</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((res) => (
            <tr key={res.CarID}>
              <td style={cellStyle}>{res.Brand}</td>
              <td style={cellStyle}>{res.Model}</td>
              <td style={cellStyle}>{res.Year}</td>
              <td style={cellStyle}>{res.Transmission}</td>
              <td style={cellStyle}>{res.Fuel}</td>
              <td style={cellStyle}>{res.Passengers}</td>
              <td style={cellStyle}>${res.DailyRate}</td>
              <td style={cellStyle}>{res.Status}</td>
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

export default Cars;
