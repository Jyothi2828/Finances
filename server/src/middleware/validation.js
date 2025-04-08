const { body, validationResult } = require('express-validator');

const validateFinancialData = [
    body('revenue').isNumeric().withMessage('Revenue must be a number'),
    body('cagr').isNumeric().withMessage('CAGR must be a number'),
    body('metrics').isArray().withMessage('Metrics must be an array'),
];

const validateSearchQuery = [
    body('query').isString().withMessage('Query must be a string'),
    body('minRevenue').optional().isNumeric().withMessage('Minimum revenue must be a number'),
    body('maxRevenue').optional().isNumeric().withMessage('Maximum revenue must be a number'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateFinancialData,
    validateSearchQuery,
    validateRequest,
};