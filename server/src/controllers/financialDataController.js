const FinancialData = require('../models/FinancialData');

// Get all financial data for a user
exports.getAllData = async (req, res) => {
    try {
        const financialData = await FinancialData.find({ userId: req.user._id });
        res.json(financialData);
    } catch (err) {
        console.error('Error fetching financial data:', err.message);
        res.status(500).json({ message: 'Server error fetching financial data' });
    }
};

// Get a single financial data record
exports.getData = async (req, res) => {
    try {
        const financialData = await FinancialData.findOne({ 
            _id: req.params.id,
            userId: req.user._id 
        });

        if (!financialData) {
            return res.status(404).json({ message: 'Financial data not found' });
        }

        res.json(financialData);
    } catch (err) {
        console.error('Error fetching financial data record:', err.message);
        res.status(500).json({ message: 'Server error fetching financial data record' });
    }
};

// Create new financial data
exports.createData = async (req, res) => {
    try {
        const {
            companyName,
            revenue,
            cagr,
            profitMargin,
            roi,
            customerRetentionRate,
            otherMetrics
        } = req.body;

        // Create new financial data record
        const financialData = new FinancialData({
            userId: req.user._id,
            companyName,
            revenue,
            cagr,
            profitMargin,
            roi,
            customerRetentionRate,
            otherMetrics
        });

        await financialData.save();
        res.status(201).json(financialData);
    } catch (err) {
        console.error('Error creating financial data:', err.message);
        res.status(500).json({ message: 'Server error creating financial data' });
    }
};

// Update financial data
exports.updateData = async (req, res) => {
    try {
        const {
            companyName,
            revenue,
            cagr,
            profitMargin,
            roi,
            customerRetentionRate,
            otherMetrics
        } = req.body;

        // Find and update financial data
        let financialData = await FinancialData.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!financialData) {
            return res.status(404).json({ message: 'Financial data not found' });
        }

        // Update fields
        financialData.companyName = companyName || financialData.companyName;
        financialData.revenue = revenue || financialData.revenue;
        financialData.cagr = cagr !== undefined ? cagr : financialData.cagr;
        financialData.profitMargin = profitMargin !== undefined ? profitMargin : financialData.profitMargin;
        financialData.roi = roi !== undefined ? roi : financialData.roi;
        financialData.customerRetentionRate = customerRetentionRate !== undefined ? 
            customerRetentionRate : financialData.customerRetentionRate;
        
        // Handle otherMetrics carefully to avoid overwriting entire object
        if (otherMetrics) {
            if (!financialData.otherMetrics) {
                financialData.otherMetrics = new Map();
            }
            // Update or add new metrics
            Object.entries(otherMetrics).forEach(([key, value]) => {
                financialData.otherMetrics.set(key, value);
            });
        }

        await financialData.save();
        res.json(financialData);
    } catch (err) {
        console.error('Error updating financial data:', err.message);
        res.status(500).json({ message: 'Server error updating financial data' });
    }
};

// Delete financial data
exports.deleteData = async (req, res) => {
    try {
        const result = await FinancialData.deleteOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Financial data not found' });
        }

        res.json({ message: 'Financial data deleted successfully' });
    } catch (err) {
        console.error('Error deleting financial data:', err.message);
        res.status(500).json({ message: 'Server error deleting financial data' });
    }
};

// Search functionality
exports.searchData = async (req, res) => {
    try {
        const { 
            revenue, 
            cagr, 
            profitMargin, 
            roi, 
            customerRetentionRate,
            companyName
        } = req.query;

        // Build query
        let query = { userId: req.user._id };

        // Add search filters if provided
        if (companyName) {
            query.companyName = { $regex: companyName, $options: 'i' };
        }
        
        if (revenue) {
            query['revenue.amount'] = { $gte: Number(revenue) };
        }
        
        if (cagr) {
            query.cagr = { $gte: Number(cagr) };
        }
        
        if (profitMargin) {
            query.profitMargin = { $gte: Number(profitMargin) };
        }
        
        if (roi) {
            query.roi = { $gte: Number(roi) };
        }
        
        if (customerRetentionRate) {
            query.customerRetentionRate = { $gte: Number(customerRetentionRate) };
        }

        // Execute search
        const results = await FinancialData.find(query).sort('-updatedAt');
        
        res.json(results);
    } catch (err) {
        console.error('Search error:', err.message);
        res.status(500).json({ message: 'Server error during search' });
    }
};