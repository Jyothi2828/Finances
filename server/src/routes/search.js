const express = require('express');
const { searchFinancialData } = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Route for searching financial data based on metrics
router.get('/search', authenticate, searchFinancialData);

module.exports = router;