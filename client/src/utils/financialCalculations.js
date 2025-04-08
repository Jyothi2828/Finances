export const calculateCAGR = (initialValue, finalValue, years) => {
    if (initialValue <= 0 || finalValue <= 0 || years <= 0) {
        throw new Error("Initial value, final value, and years must be greater than zero.");
    }
    return ((finalValue / initialValue) ** (1 / years) - 1) * 100;
};

export const calculateRevenueGrowth = (currentRevenue, previousRevenue) => {
    if (previousRevenue <= 0) {
        throw new Error("Previous revenue must be greater than zero.");
    }
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const calculateAverage = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Data must be a non-empty array.");
    }
    const total = data.reduce((acc, value) => acc + value, 0);
    return total / data.length;
};