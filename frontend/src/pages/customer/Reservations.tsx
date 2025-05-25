import React, { useEffect, useState } from "react";
import api from "../../config/api";
import useAuthGuard from "../../hooks/authGuard";

const Reservations = () => {
  useAuthGuard("customer");
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

  const handleAddReservation = async () => {
    try {
      if (
        !newReservation.carId ||
        !newReservation.startDate ||
        !newReservation.endDate ||
        !newReservation.pickupBranchId ||
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
    <div style={{ padding: "0 50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Reservations</h1>
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
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h2>Add New Reservation</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label style={{ width: "100px", textAlign: "right" }}>
                  Car:
                </label>
                <select
                  value={newReservation.carId}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      carId: e.target.value,
                    }))
                  }
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
                <label style={{ width: "100px", textAlign: "right" }}>
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
                <label style={{ width: "100px", textAlign: "right" }}>
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
                <label style={{ width: "100px", textAlign: "right" }}>
                  Pickup Branch:
                </label>
                <select
                  value={newReservation.pickupBranchId}
                  onChange={(e) =>
                    setNewReservation((prev) => ({
                      ...prev,
                      pickupBranchId: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">Select pickup branch</option>
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
                <label style={{ width: "100px", textAlign: "right" }}>
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
                <label style={{ width: "100px", textAlign: "right" }}>
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
                  onClick={handleAddReservation}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#9beeff" }}>
            <th style={cellStyle}>Reservation ID</th>
            <th style={cellStyle}>Brand</th>
            <th style={cellStyle}>Model</th>
            <th style={cellStyle}>Start Date</th>
            <th style={cellStyle}>End Date</th>
            <th style={cellStyle}>Pickup Branch</th>
            <th style={cellStyle}>Return Branch</th>
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
              <td style={cellStyle}>{res.Brand}</td>
              <td style={cellStyle}>{res.Model}</td>
              <td style={cellStyle}>{res.StartDate}</td>
              <td style={cellStyle}>{res.EndDate}</td>
              <td style={cellStyle}>{res.PickupBranchName}</td>
              <td style={cellStyle}>{res.ReturnBranchName}</td>
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

const inputStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "200px",
};

export default Reservations;
