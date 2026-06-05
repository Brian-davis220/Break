require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Root Route - Serves Landing Page (HTML) or JSON info
app.get('/', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.json({
            status: 'success',
            message: 'Break Backend API is running smoothly',
            timestamp: new Date().toISOString(),
            author: 'Antigravity',
            version: '1.0.0'
        });
    }
});

// Example API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Cars CRUD Routes
app.use('/api/cars', require('./routes/cars'));

// Demo Data Route
app.get('/api/data', (req, res) => {
    res.json([
        { id: 1, name: 'Item One', status: 'Active' },
        { id: 2, name: 'Item Two', status: 'Pending' },
        { id: 3, name: 'Item Three', status: 'Completed' }
    ]);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong on the server'
    });
});

// Conditional server start for testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server is soaring at http://localhost:${PORT}`);
        console.log(`📁 Environment: ${process.env.NODE_ENV}`);
    });
}

// Export the app for external usage (e.g., testing)
module.exports = app;