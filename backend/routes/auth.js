const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = 'jwt_key';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

router.post('/register/customer', async(req, res) => {
    const {username, password, firstName, lastName, email, phone, driverLicenseNo, creditCardNumber, expDate, cvv} = req.body;

    try {
    
        db.query(`SELECT * FROM Customer WHERE Username = ?`, [username], (err, customerResult) => {
            if (err) return res.status(500).json({ error: err });

            db.query(`SELECT * FROM Admin WHERE Username = ?`, [username], (err2, adminResult) => {
                if (err2) return res.status(500).json({ error: err2 });

                if (customerResult.length > 0 || adminResult.length > 0) {
                    return res.status(400).json({ error: "Username already exists" });
                }

                bcrypt.hash(password, 10).then(hashedPassword => {
                    const sql = `
                        INSERT INTO Customer 
                        (Username, Password, FirstName, LastName, Email, Phone, DriverLicenseNo, CreditCardNumber, ExpDate, CVV)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `; 

                    db.query(sql, [username, hashedPassword, firstName, lastName, email, phone, driverLicenseNo, creditCardNumber, expDate, cvv], (err, result) => {
                        if (err) return res.status(500).json({ error: err });
                        res.status(201).json({ message: "Customer registered" });
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/register/admin', async(req, res) => {
    const {username, password} = req.body;

    try {
        
        db.query(`SELECT * FROM Customer WHERE Username = ?`, [username], (err, customerResult) => {
            if (err) return res.status(500).json({ error: err });

            db.query(`SELECT * FROM Admin WHERE Username = ?`, [username], (err2, adminResult) => {
                if (err2) return res.status(500).json({ error: err2 });

                if (customerResult.length > 0 || adminResult.length > 0) {
                    return res.status(400).json({ error: "Username already exists" });
                }

                bcrypt.hash(password, 10).then(hashedPassword => {
                    const sql = `
                        INSERT INTO Admin 
                        (Username, Password) 
                        VALUES (?, ?)
                    `;

                    db.query(sql, [username, hashedPassword], (err, result) => {
                        if (err) return res.status(500).json({ error: err });
                        res.status(201).json({ message: "Admin registered" });
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        db.query(`SELECT * FROM Customer WHERE Username = ?`, [username], async (err,result) => {
            if(err) return res.status(500).json({ error: err });

            if(result.length > 0) {
                const match = await bcrypt.compare(password, result[0].Password);
                if (match) {
                    const token = jwt.sign(
                        { 
                            id: result[0].CustomerID,
                            username: result[0].Username,
                            role: 'customer'
                        },
                        JWT_SECRET
                    );
                    return res.json({ 
                        message: "Login Success", 
                        role: "customer", 
                        id: result[0].CustomerID,
                        token: token
                    });
                }
            }

            db.query(`SELECT * FROM Admin WHERE Username = ?`, [username], async (err2, result2) => {
                if (err2) return res.status(500).json({ error: err2});

                if(result2.length > 0) {
                    const match2 = await bcrypt.compare(password, result2[0].Password);
                    if (match2) {
                        const token = jwt.sign(
                            { 
                                id: result2[0].AdminID,
                                username: result2[0].Username,
                                role: 'admin'
                            },
                            JWT_SECRET
                        );
                        return res.json({ 
                            message: "Login Success", 
                            role: "admin", 
                            id: result2[0].AdminID,
                            token: token
                        });
                    }
                }
                return res.status(401).json({ error: "Invalid username or password" });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/check-username", (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: "Username is required" });

  db.query(`
    SELECT Username FROM Customer WHERE Username = ? 
    UNION 
    SELECT Username FROM Admin WHERE Username = ?`,
    [username, username],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length > 0) return res.json({ available: false });
      return res.json({ available: true });
    }
  );
});


module.exports = router; 