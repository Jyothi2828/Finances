const mongoose = require('mongoose');

const financialDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    revenue: [{
        year: Number,
        quarter: {
            type: Number,
            min: 1,
            max: 4
        },
        amount: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    }],
    cagr: {
        type: Number,
        default: 0
    },
    profitMargin: {
        type: Number,
        default: 0
    },
    roi: {
        type: Number,
        default: 0
    },
    customerRetentionRate: {
        type: Number,
        default: 0
    },
    otherMetrics: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
financialDataSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Use the businesses collection from b11 database
const FinancialData = mongoose.model('FinancialData', financialDataSchema, 'businesses');

module.exports = FinancialData;