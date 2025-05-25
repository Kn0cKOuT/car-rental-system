import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const ManageReservations = () => {
  useAuthGuard("admin");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  type Reservation = {
    ReservationID: number;
    CarID: number;
    CustomerID: number;
    PickupBranchID: number;
    PickupBranchName: string;
    ReturnBranchID: number;
    ReturnBranchName: string;
    PackageID: number;
    TotalDays: number;
    Cost: number;
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/api/admin/reservations");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (reservationId: number) => {
    const confirm = window.confirm(
      `Are you sure you want to delete reservation ID ${reservationId}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/api/admin/reservations/${reservationId}`);
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
        <h1>Manage Reservations</h1>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Reservation ID</th>
            <th style={cellStyle}>Car ID</th>
            <th style={cellStyle}>Customer ID</th>
            <th style={cellStyle}>Start Date</th>
            <th style={cellStyle}>End Date</th>
            <th style={cellStyle}>Pickup Branch (ID)</th>
            <th style={cellStyle}>Return Branch (ID)</th>
            <th style={cellStyle}>Package ID</th>
            <th style={cellStyle}>Total Days</th>
            <th style={cellStyle}>Cost</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res: any) => (
            <tr key={res.ReservationID}>
              <td style={cellStyle}>{res.ReservationID}</td>
              <td style={cellStyle}>{res.CarID}</td>
              <td style={cellStyle}>{res.CustomerID}</td>
              <td style={cellStyle}>{res.StartDate}</td>
              <td style={cellStyle}>{res.EndDate}</td>
              <td style={cellStyle}>
                {res.PickupBranchName} ({res.PickupBranchID})
              </td>
              <td style={cellStyle}>
                {res.ReturnBranchName} ({res.ReturnBranchID})
              </td>
              <td style={cellStyle}>{res.PackageID}</td>
              <td style={cellStyle}>{res.TotalDays}</td>
              <td style={cellStyle}>${res.Cost}</td>

              <td style={cellStyle}>
                <button
                  onClick={() => handleDelete(res.ReservationID)}
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

export default ManageReservations;
