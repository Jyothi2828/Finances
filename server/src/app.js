const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jprasannakambam1:Bubbly12345@clusterbusinessapp.lxztf.mongodb.net/b11?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
console.log('Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB Atlas connected successfully to b11 database'))
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Import routes
const authRoutes = require('./routes/auth');
const financialDataRoutes = require('./routes/financialData');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/financial-data', financialDataRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('Financial Statistics API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Function to start the server with port fallback
function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .on('listening', () => {
                console.log(`Server started successfully on port ${port}`);
                resolve(server);
            })
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy. Trying port ${port + 1}...`);
                    resolve(startServer(port + 1));
                } else {
                    reject(err);
                }
            });
    });
}

// Start server with fallback ports
const PORT = process.env.PORT || 5000;
startServer(PORT)
    .then(server => {
        const address = server.address();
        console.log(`Server running at http://localhost:${address.port}`);
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

module.exports = app;