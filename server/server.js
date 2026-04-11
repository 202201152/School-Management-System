const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const taskRoutes = require('./routes/tasks');
const announcementRoutes = require('./routes/announcements');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('School Management API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
