const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login attempt received:', {
    email: req.body.email,
    hasPassword: !!req.body.password
  });
  
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Normalize the email to lowercase before searching
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user by normalized email
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('Login failed: User not found for email:', normalizedEmail);
      // Use generic message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Log found user details (without password)
    console.log('User found:', {
      id: user._id,
      email: user.email,
      role: user.role || 'no_role_assigned',
      active: user.active
    });
    
    // Check if user account is active
    if (user.active === false) {
      console.log('Login failed: Account inactive for user:', user._id);
      return res.status(401).json({ message: 'Account is inactive. Please contact support.' });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Login failed: Invalid password for user:', user._id);
      // Use generic message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create payload for JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'business' // Default to business role if not set
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          throw err;
        }
        console.log('Login successful for user:', user._id);
        
        // Ensure user object has required fields with defaults for missing values
        const userResponse = {
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          role: user.role || 'business', // Default to business role if not set
          company: user.company || 'Not specified'
        };
        
        res.json({
          token,
          user: userResponse
        });
      }
    );
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// @route   GET api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router
module.exports = router;