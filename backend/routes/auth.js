const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

router.post('/register/customer', async(req, res) => {
    const {username, password, firstName, lastName, email, phone, driverLicenseNo, creditCardNumber, expDate, cvv} = req.body;

    try
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Customer 
                    (Username, Password, FirstName, LastName, Email, Phone, DriverLicenseNo, CreditCardNumber, ExpDate, CVV) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`;

        db.query(sql, [username, hashedPassword, firstName, lastName, email, phone, driverLicenseNo, creditCardNumber, expDate, cvv], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.status(201).json({ message: "Customer registered" });
        });
    }
    catch (err)
    {
        res.status(500).json({ error: err.message });
    }
});

router.post('/register/admin', async(req, res) => {
    const {username, password} = req.body;

    try
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Admin 
                    (Username, Password) 
                    VALUES (?, ?)`;

        db.query(sql, [username, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                res.status(201).json({ message: "Admin registered" });
        });
    }
    catch (err)
    {
        res.status(500).json({error: err.message});
    }
});



router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(`SELECT * FROM Customer WHERE Username = ?`, [username], async (err,result) => {
        if(err) return res.status(500).json({ error: err });

        if(result.length > 0) {
            const match = await bcrypt.compare(password, result[0].Password);
            if (match) return res.json({ message: "Login Success", role: "customer", id: result[0].CustomerID });
        }

        db.query(`SELECT * FROM Admin WHERE Username = ?`, [username], async (err2, result2) => {
            if (err2) return res.status(500).json({ error: err2});

            if(result2.length > 0) {
                const match2 = await bcrypt.compare(password, result2[0].Password);
                if (match2) return res.json({ message: "Login Success", role: "admin", id: result2[0].AdminID });
            }

            return res.status(401).json({ error: "Invalid username or password" });
        });

       
    });
});

module.exports = router;
