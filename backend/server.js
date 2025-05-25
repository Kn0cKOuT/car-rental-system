require('dotenv').config(); // always load env first
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://gregory-accessible-wv-popularity.trycloudflare.com'
    ],
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Backend is working!");
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
