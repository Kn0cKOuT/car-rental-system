 const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { allowRoles } = require('../middleware/authMiddleware');

router.get('/customers', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT *
        FROM CUSTOMER
        ORDER BY CustomerID;
    `;
    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.get('/reservations', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT *
        FROM RESERVATION
        ORDER BY CustomerID;
    `;

    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.delete('/reservations/:id', allowRoles('admin'), (req, res) => { 
    const reservationId = req.params.id;

    const sql=`
        DELETE
        FROM RESERVATION
        WHERE ReservationID = ?
    `;
    db.query(sql, [reservationId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Reservation not found." })
        }

        res.json({ message: "Reservation deleted"});
    });
});

router.get('/branches', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT *
        FROM BRANCH
        ORDER BY BranchID;
    `;

    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.post('/branches', allowRoles('admin'), (req, res) => {
    const { name, phone, address } = req.body;

    const sql = `
        INSERT INTO BRANCH
        (Name, Phone, Address)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, phone, address], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "Branch added!" });
    });
});

router.delete('/branches/:id', allowRoles('admin'), (req, res) => {
    const branchId = req.params.id;

    const sql=`
        DELETE
        FROM BRANCH
        WHERE BranchID = ?
    `;
    db.query(sql, [branchId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }

        if(result.affectedRows === 0) {
            return res.status(404).json({ error: "Branch not found." })
        }

        res.json({ message: "Branch deleted"});
    });
});

router.get('/cars', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT c.CarID, c.Model, c.Year, c.DailyRate, c.Status, C.BranchID, r.StartDate, r.EndDate
        FROM CAR AS c
        LEFT JOIN Reservation AS r ON c.CarID = r.CarID
        ORDER BY c.CarID, r.StartDate;
    `;

    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.post('/cars', allowRoles('admin'), (req, res) => {
    const { brand, model, year, transmission, fuel, passengers, dailyRate, branchId } = req.body;

    const sql=`
        INSERT INTO CAR
        (Brand, Model, Year, Transmission, Fuel, Passengers, DailyRate, Status, BranchID)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?)
    `;

    const values = [brand, model, year, transmission, fuel, passengers, dailyRate, branchId];
    db.query(sql, values, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "Car added."});
    });
});

router.delete('/cars/:id', allowRoles('admin'), (req, res) => {
    const carId = req.params.id;

    const sql=`
        DELETE
        FROM CAR
        WHERE CarID = ?
    `;
    db.query(sql, [carId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Car not found." })
        }

        res.json({ message: "Car deleted"});
    });
});

router.get('/packages', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT *
        FROM INSURANCE
        ORDER BY PackageID;
    `;

    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.post('/packages', allowRoles('admin'), (req, res) => {
    const { packageName, description, dailyCost} = req.body

    const sql=`
        INSERT INTO INSURANCE
        (PackageName, Description, DailyCost)
        VALUES (?, ?, ?)
    `;

    const values = [packageName, description, dailyCost];
    db.query(sql, values, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: "Package added."});
    });
});

router.delete('/packages/:id', allowRoles('admin'), (req, res) => {
    const packageId = req.params.id;

    const sql=`
        DELETE
        FROM INSURANCE
        WHERE PackageID = ?
    `;
    db.query(sql, [packageId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Package not found." })
        }

        res.json({ message: "Package deleted"});
    });
});

router.put('/cars/:id/status', allowRoles('admin'), (req, res) => {
    const carId = req.params.id;
    const { status } = req.body;

    if (!['available', 'maintenance', 'not_available'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'available', 'maintenance', or 'not_available'" });
    }

    const sql = `
        UPDATE Car 
        SET Status = ? 
        WHERE CarID = ?
    `;

    db.query(sql, [status, carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json({ message: "Car status updated successfully" });
    });
});

module.exports = router;