 const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { allowRoles } = require('../middleware/authMiddleware');

router.get('/reservations/:id', allowRoles('customer'), (req, res) => {
    const customerId = req.params.id;

    const sql = `
    SELECT * 
    FROM Reservation 
    WHERE CustomerID = ?`;
    db.query(sql, [customerId], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

router.post('/reserve', allowRoles('customer'), (req, res) => {
    const { carId, customerId, startDate, endDate, pickupBranchId, returnBranchId, packageId } = req.body;

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const totalDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
        return res.status(400).json({ error: "End date must be after start date." });
    }

    const availabilityCheck = `
        SELECT * FROM Reservation 
        WHERE CarID = ? 
        AND NOT (EndDate < ? OR StartDate > ?)
    `;
    db.query(availabilityCheck, [carId, startDate, endDate], (err, rows) => {
        if (err) return res.status(500).json({ error: err });

        if (rows.length > 0) {
            return res.status(400).json({ error: "Car is already reserved in this date interval." });
        }

        const carQuery = `
            SELECT Status, DailyRate, BranchID 
            FROM Car 
            WHERE CarID = ?
        `;
        db.query(carQuery, [carId], (err, carResult) => {
            if (err || carResult.length === 0) {
                return res.status(500).json({ error: "Car not found." });
            }

            if (carResult[0].Status !== 'available') {
                return res.status(400).json({ error: "Car is not available." });
            }

            if (carResult[0].BranchID !== pickupBranchId) {
                return res.status(400).json({ error: "Car is not available at the selected pickup branch." });
            }

            const carRate = Number(carResult[0].DailyRate);

            const insQuery = `
                SELECT DailyCost 
                FROM Insurance 
                WHERE PackageID = ?
            `;

            db.query(insQuery, [packageId], (err, insResult) => {
                if (err || insResult.length === 0) {
                    return res.status(500).json({ error: "Insurance package not found." });
                }

                const insuranceRate = Number(insResult[0].DailyCost);

                if (
                    isNaN(carRate) ||
                    isNaN(insuranceRate) ||
                    isNaN(totalDays)
                ) {
                    return res.status(500).json({ error: "Invalid rate or days for cost calculation." });
                }

                const totalCost = (carRate + insuranceRate) * totalDays;

                const insertQuery = `
                    INSERT INTO Reservation 
                    (CarID, CustomerID, StartDate, EndDate, PickupBranchID, ReturnBranchID, PackageID, TotalDays, Cost) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const values = [carId, customerId, startDate, endDate, pickupBranchId, returnBranchId, packageId, totalDays, totalCost];

                db.query(insertQuery, values, (err, result) => {
                    if (err) return res.status(500).json({ error: err });

                    const updateCarStatus = `
                        UPDATE Car
                        SET Status = 'reserved' 
                        WHERE CarID = ?
                    `;
                    db.query(updateCarStatus, [carId], (err, result2) => {
                        if (err) return res.status(500).json({ error: "Reservation saved, but failed to update car status." });

                        res.status(201).json({
                            message: "Reservation created and car marked as reserved!", totalDays, totalCost
                        });
                    });
                });
            });
        });
    });
});

router.delete('/reservations/:id', allowRoles('customer'), (req, res) => {
    const reservationId = req.params.id;
    const customerId = req.user.id;

    const checkOwnershipQuery = `
        SELECT CarID 
        FROM Reservation 
        WHERE ReservationID = ? AND CustomerID = ?
    `;
    
    db.query(checkOwnershipQuery, [reservationId, customerId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        
        if (result.length === 0) {
            return res.status(403).json({ error: "You are not authorized to delete this reservation." });
        }
        
        const carId = result[0].CarID;
        
        const deleteQuery = `
            DELETE
            FROM Reservation 
            WHERE ReservationID = ?
        `;
        
        db.query(deleteQuery, [reservationId], (err, deleteResult) => {
            if (err) { 
                return res.status(500).json({ error: err });
            }

            if(deleteResult.affectedRows === 0){
                return res.status(404).json({ error: "Reservation not found." });
            }

            const updateCarStatus = `
                UPDATE Car
                SET Status = 'available'
                WHERE CarID = ?
            `;
            
            db.query(updateCarStatus, [carId], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: "Reservation deleted but failed to update car status." });
                }
                
                res.json({ message: "Reservation deleted and car marked as available" });
            });
        });
    });
});

router.get('/branches', allowRoles('customer'), (req, res) => {
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

router.get('/cars', allowRoles('customer'), (req, res) => {
    const sql = `
        SELECT 
            c.CarID, 
            c.Model, 
            c.Year, 
            c.DailyRate, 
            c.Status, 
            c.BranchID, 
            DATE_FORMAT(r.StartDate, '%Y-%m-%d') as StartDate, 
            DATE_FORMAT(r.EndDate, '%Y-%m-%d') as EndDate
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

router.get('/packages', allowRoles('customer'), (req, res) => {
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

module.exports = router;