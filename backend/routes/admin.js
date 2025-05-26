const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/customers', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT 
            c.*,
            COUNT(r.ReservationID) as TotalReservations
        FROM CUSTOMER c
        LEFT JOIN RESERVATION r ON c.CustomerID = r.CustomerID
        GROUP BY c.CustomerID
        ORDER BY c.CustomerID;
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
        SELECT 
            r.ReservationID,
            r.CarID,
            r.CustomerID,
            DATE_FORMAT(r.StartDate, '%Y-%m-%d') as StartDate,
            DATE_FORMAT(r.EndDate, '%Y-%m-%d') as EndDate,
            r.PickupBranchID,
            r.ReturnBranchID,
            r.PackageID,
            r.TotalDays,
            r.Cost,
            b.Name as PickupBranchName,
            b2.Name as ReturnBranchName
        FROM RESERVATION AS r
        JOIN BRANCH AS b ON r.PickupBranchID = b.BranchID
        JOIN BRANCH AS b2 ON r.ReturnBranchID = b2.BranchID
        ORDER BY r.ReservationID;
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
        SELECT 
            c.CarID,
            c.Brand,
            c.Model,
            c.Year,
            c.Transmission,
            c.Fuel,
            c.Passengers,
            c.DailyRate,
            c.Status,
            c.BranchID,
            b.Name as BranchName,
            r.ReservationID,
            DATE_FORMAT(r.StartDate, '%Y-%m-%d') as StartDate,
            DATE_FORMAT(r.EndDate, '%Y-%m-%d') as EndDate
        FROM CAR AS c
        LEFT JOIN BRANCH AS b ON c.BranchID = b.BranchID
        LEFT JOIN (
            SELECT r1.*
            FROM RESERVATION r1
            LEFT JOIN RESERVATION r2
            ON r1.CarID = r2.CarID 
            AND r1.StartDate < r2.StartDate
            WHERE r2.CarID IS NULL
        ) r ON c.CarID = r.CarID
        ORDER BY c.CarID;
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

    const checkCarQuery = `
        SELECT COUNT(*) as count
        FROM RESERVATION
        WHERE CarID = ?
    `;

    db.query(checkCarQuery, [carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete car. It is being used in existing reservations." 
            });
        }

        const deleteQuery = `
            DELETE
            FROM CAR
            WHERE CarID = ?
        `;

        db.query(deleteQuery, [carId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            if(result.affectedRows === 0) {
                return res.status(404).json({ error: "Car not found." });
            }

            res.json({ message: "Car deleted successfully" });
        });
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

    const checkPackageQuery = `
        SELECT COUNT(*) as count
        FROM RESERVATION
        WHERE PackageID = ?
    `;

    db.query(checkPackageQuery, [packageId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete package. It is being used in existing reservations." 
            });
        }

        const deleteQuery = `
            DELETE
            FROM INSURANCE
            WHERE PackageID = ?
        `;

        db.query(deleteQuery, [packageId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            if(result.affectedRows === 0) {
                return res.status(404).json({ error: "Package not found." });
            }

            res.json({ message: "Package deleted successfully" });
        });
    });
});

router.put('/cars/:id/status', allowRoles('admin'), (req, res) => {
    const carId = req.params.id;
    const { status } = req.body;

    if (!['available', 'maintenance', 'not_available'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'available', 'maintenance', or 'not_available'" });
    }


    const checkReservationQuery = `
        SELECT COUNT(*) as count
        FROM RESERVATION
        WHERE CarID = ?
    `;

    db.query(checkReservationQuery, [carId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot change status. Car is currently in a reservation." 
            });
        }

        const updateQuery = `
            UPDATE Car 
            SET Status = ? 
            WHERE CarID = ?
        `;

        db.query(updateQuery, [status, carId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Car not found" });
            }
            res.json({ message: "Car status updated successfully" });
        });
    });
});

router.get('/branches/:id/cars', allowRoles('admin'), (req, res) => {
    const branchId = req.params.id;
    const sql = `
        SELECT 
            c.CarID,
            c.Brand,
            c.Model,
            c.Year,
            c.Transmission,
            c.Fuel,
            c.Passengers,
            c.DailyRate,
            c.Status
        FROM CAR As c
        WHERE c.BranchID = ?
        ORDER BY c.CarID;
    `;

    db.query(sql, [branchId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.get('/cars/:id/reservations', allowRoles('admin'), (req, res) => {
    const carId = req.params.id;
    const sql = `
        SELECT 
            r.ReservationID,
            r.CustomerID,
            DATE_FORMAT(r.StartDate, '%Y-%m-%d') as StartDate,
            DATE_FORMAT(r.EndDate, '%Y-%m-%d') as EndDate,
            r.PickupBranchID,
            r.ReturnBranchID
        FROM Reservation As r
        WHERE r.CarID = ?
        ORDER BY r.ReservationID;
    `;

    db.query(sql, [carId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.get('/customers/:id/reservations', allowRoles('admin'), (req, res) => {
    const customerId = req.params.id;
    const sql = `
        SELECT 
            r.ReservationID,
            r.CarID,
            DATE_FORMAT(r.StartDate, '%Y-%m-%d') as StartDate,
            DATE_FORMAT(r.EndDate, '%Y-%m-%d') as EndDate,
            r.PickupBranchID,
            r.ReturnBranchID,
            b.Name as PickupBranchName,
            b2.Name as ReturnBranchName
        FROM Reservation As r
        JOIN Branch As b ON r.PickupBranchID = b.BranchID
        JOIN Branch As b2 ON r.ReturnBranchID = b2.BranchID
        WHERE r.CustomerID = ?
        ORDER BY r.ReservationID;
    `;

    db.query(sql, [customerId], (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

router.get('/admins', allowRoles('admin'), (req, res) => {
    const sql = `
        SELECT AdminID, Username
        FROM Admin
        ORDER BY AdminID;
    `;
    
    db.query(sql, (err, result) => {
        if (err) { 
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

module.exports = router;