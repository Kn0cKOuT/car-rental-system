import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const ManageCustomers = () => {
  useAuthGuard("admin");
  const [customers, setCustomers] = useState<Customer[]>([]);

  type Customer = {
    CustomerID: number;
    Username: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
    DriverLicenseNo: string;
    CreditCardNumber: string;
    ExpDate: string;
    CVV: string;
    TotalReservations: number;
  };

  type Reservation = {
    ReservationID: number;
    CarID: number;
    StartDate: string;
    EndDate: string;
    PickupBranchID: number;
    PickupBranchName: string;
    ReturnBranchID: number;
    ReturnBranchName: string;
  };

  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerReservations, setCustomerReservations] = useState<
    Reservation[]
  >([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/api/admin/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchCustomerReservations = async (customerId: number) => {
    try {
      const response = await api.get(
        `/api/admin/customers/${customerId}/reservations`
      );
      setCustomerReservations(response.data);
    } catch (err) {
      console.error("Error fetching customer reservations:", err);
    }
  };

  const handleViewReservations = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerReservations(customer.CustomerID);
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
        <h1>Manage Customers</h1>
      </div>

      {isReservationsModalOpen && selectedCustomer && (
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
                Reservations for {selectedCustomer.FirstName}{" "}
                {selectedCustomer.LastName}
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
                  <th style={cellStyle}>Car ID</th>
                  <th style={cellStyle}>Start Date</th>
                  <th style={cellStyle}>End Date</th>
                  <th style={cellStyle}>Pickup Branch (ID)</th>
                  <th style={cellStyle}>Return Branch (ID)</th>
                </tr>
              </thead>
              <tbody>
                {customerReservations.map((reservation) => (
                  <tr key={reservation.ReservationID}>
                    <td style={cellStyle}>{reservation.ReservationID}</td>
                    <td style={cellStyle}>{reservation.CarID}</td>
                    <td style={cellStyle}>{reservation.StartDate}</td>
                    <td style={cellStyle}>{reservation.EndDate}</td>
                    <td style={cellStyle}>
                      {reservation.PickupBranchName} (
                      {reservation.PickupBranchID})
                    </td>
                    <td style={cellStyle}>
                      {reservation.ReturnBranchName} (
                      {reservation.ReturnBranchID})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Customer ID</th>
            <th style={cellStyle}>Username</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Phone</th>
            <th style={cellStyle}>Driver License No</th>
            <th style={cellStyle}>Credit Card Number</th>
            <th style={cellStyle}>CVV</th>
            <th style={cellStyle}>Total Reservations</th>
            <th style={cellStyle}></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((res: any) => (
            <tr key={res.CustomerID}>
              <td style={cellStyle}>{res.CustomerID}</td>
              <td style={cellStyle}>{res.Username}</td>
              <td style={cellStyle}>
                {res.FirstName} {res.LastName}
              </td>
              <td style={cellStyle}>{res.Email}</td>
              <td style={cellStyle}>{res.Phone}</td>
              <td style={cellStyle}>{res.DriverLicenseNo}</td>
              <td style={cellStyle}>{res.CreditCardNumber}</td>
              <td style={cellStyle}>{res.CVV}</td>
              <td style={cellStyle}>{res.TotalReservations}</td>
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

export default ManageCustomers;
