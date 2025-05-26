import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const ManageReservations = () => {
  useAuthGuard("admin");
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  type Reservation = {
    ReservationID: number;
    CarID: number;
    CustomerID: number;
    PickupBranchID: number;
    PickupBranchName: string;
    ReturnBranchID: number;
    ReturnBranchName: string;
    StartDate: string;
    EndDate: string;
    PackageID: number;
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
    <div
      style={{
        padding: "20px 50px",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
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
        <h1>Manage Reservations</h1>
      </div>

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
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Reservation ID
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Car ID
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Customer ID
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Pickup Branch (ID)
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Return Branch (ID)
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Package ID
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Start Date
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              End Date
            </th>
            <th
              style={{
                backgroundColor: "#2c3e50",
                color: "#ffffff",
                padding: "15px",
                textAlign: "center",
                borderBottom: "2px solid #1e3a5f",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res: any) => (
            <tr key={res.ReservationID}>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.ReservationID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.CarID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.CustomerID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.PickupBranchName} ({res.PickupBranchID})
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.ReturnBranchName} ({res.ReturnBranchID})
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.PackageID}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {new Date(res.StartDate).toLocaleDateString()}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {new Date(res.EndDate).toLocaleDateString()}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(res.ReservationID)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
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

export default ManageReservations;
