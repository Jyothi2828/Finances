const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize express app
const app = express();
app.use(express.json());

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/b11';
console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully to b11 database');
    
    // Set up a simple User schema for testing
    const userSchema = new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        role: String,
        businessType: String,
        createdAt: Date
    });
    
    const User = mongoose.model('User', userSchema, 'users');
    
    // Test endpoint - Just returns OK to verify server is running
    app.get('/test', (req, res) => {
        res.json({ status: 'ok', message: 'Server is running' });
    });
    
    // Test login endpoint without complex middleware
    app.post('/api/test-login', async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(`Login attempt for: ${email}`);
            
            // Find the user
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found');
                return res.status(400).json({ message: 'User not found' });
            }
            
            console.log(`Found user: ${user.username}, Role: ${user.role}`);
            
            // Compare password (simple comparison for test only)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Password does not match');
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            console.log('Password matched successfully');
            
            // Check role
            if (user.role !== 'business') {
                console.log('User is not a business role');
                return res.status(403).json({ message: 'Access denied. Only business accounts allowed.' });
            }
            
            // Return success
            return res.json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    businessType: user.businessType || 'Not specified'
                }
            });
        } catch (err) {
            console.error('Test login error:', err);
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
    
    // List all users endpoint (for testing only)
    app.get('/api/list-users', async (req, res) => {
        try {
            const users = await User.find({}, 'username email role businessType');
            console.log(`Found ${users.length} users`);
            res.json({ users });
        } catch (err) {
            console.error('Error listing users:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    });
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
        console.log(`Test URL: http://localhost:${PORT}/test`);
        console.log(`Test login: http://localhost:${PORT}/api/test-login`);
        console.log(`List users: http://localhost:${PORT}/api/list-users`);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});