import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";
import { useNavigate } from "react-router-dom";

const ManageCustomers = () => {
  useAuthGuard("admin");
  const navigate = useNavigate();
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
                Reservations for {selectedCustomer.FirstName}{" "}
                {selectedCustomer.LastName}
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
                  </tr>
                </thead>
                <tbody>
                  {customerReservations.map((reservation) => (
                    <tr key={reservation.ReservationID}>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.ReservationID}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.CarID}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.StartDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.EndDate}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.PickupBranchName} (
                        {reservation.PickupBranchID})
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          borderBottom: "1px solid #ecf0f1",
                          color: "#2c3e50",
                          textAlign: "center",
                        }}
                      >
                        {reservation.ReturnBranchName} (
                        {reservation.ReturnBranchID})
                      </td>
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
              Username
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
              Name
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
              Email
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
              Phone
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
              Driver License No
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
              Credit Card Number
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
              CVV
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
              Total Reservations
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
          {customers.map((res: any) => (
            <tr key={res.CustomerID}>
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
                {res.Username}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.FirstName} {res.LastName}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Email}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.Phone}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.DriverLicenseNo}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.CreditCardNumber}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.CVV}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                {res.TotalReservations}
              </td>
              <td
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid #ecf0f1",
                  color: "#2c3e50",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => handleViewReservations(res)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
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

export default ManageCustomers;
