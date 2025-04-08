const FinancialData = require('../models/FinancialData');

// Function to handle advanced search queries based on financial metrics
exports.advancedSearch = async (req, res) => {
    const { revenue, cagr, otherMetrics } = req.body;

    try {
        const query = {};
        
        if (revenue) {
            query.revenue = { $gte: revenue.min, $lte: revenue.max };
        }
        
        if (cagr) {
            query.cagr = { $gte: cagr.min, $lte: cagr.max };
        }
        
        // Add additional metrics to the query as needed
        if (otherMetrics) {
            // Assuming otherMetrics is an object with key-value pairs
            Object.keys(otherMetrics).forEach(metric => {
                query[metric] = otherMetrics[metric];
            });
        }

        const results = await FinancialData.find(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
};