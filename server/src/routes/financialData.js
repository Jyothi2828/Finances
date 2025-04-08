const express = require('express');
const router = express.Router();
const financialDataController = require('../controllers/financialDataController');
const auth = require('../middleware/auth');

// All financial data routes are protected
router.use(auth);

// Get all financial data for the logged-in user
router.get('/', financialDataController.getAllData);

// Get a specific financial data record
router.get('/:id', financialDataController.getData);

// Create a new financial data record
router.post('/', financialDataController.createData);

// Update a financial data record
router.put('/:id', financialDataController.updateData);

// Delete a financial data record
router.delete('/:id', financialDataController.deleteData);

// Search financial data
router.get('/search/advanced', financialDataController.searchData);

module.exports = router;